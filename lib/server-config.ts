/**
 * Server Configuration & Failover System
 * Multiple server endpoints with automatic failover
 */

export interface ServerEndpoint {
  id: string
  name: string
  url: string
  priority: number
  isHealthy: boolean
  lastChecked: Date
  region: string
}

export interface ServerConfig {
  primary: ServerEndpoint[]
  fallback: ServerEndpoint[]
  healthCheckInterval: number
  timeout: number
  retries: number
}

// Production server endpoints
export const SERVER_CONFIG: ServerConfig = {
  primary: [
    {
      id: 'vercel-primary',
      name: 'Vercel Primary',
      url: 'https://glixtron.vercel.app',
      priority: 1,
      isHealthy: true,
      lastChecked: new Date(),
      region: 'global'
    },
    {
      id: 'vercel-secondary',
      name: 'Vercel Secondary', 
      url: 'https://glixtron-git-main-glixtron.vercel.app',
      priority: 2,
      isHealthy: true,
      lastChecked: new Date(),
      region: 'global'
    }
  ],
  fallback: [
    {
      id: 'github-pages',
      name: 'GitHub Pages',
      url: 'https://glixtron.github.io',
      priority: 3,
      isHealthy: true,
      lastChecked: new Date(),
      region: 'global'
    },
    {
      id: 'netlify-backup',
      name: 'Netlify Backup',
      url: 'https://glixtron.netlify.app',
      priority: 4,
      isHealthy: true,
      lastChecked: new Date(),
      region: 'global'
    }
  ],
  healthCheckInterval: 30000, // 30 seconds
  timeout: 10000, // 10 seconds
  retries: 3
}

export class ServerManager {
  private static instance: ServerManager
  private currentServer: ServerEndpoint | null = null
  private healthCheckTimer: NodeJS.Timeout | null = null

  private constructor() {
    this.initializeServer()
    this.startHealthChecks()
  }

  static getInstance(): ServerManager {
    if (!ServerManager.instance) {
      ServerManager.instance = new ServerManager()
    }
    return ServerManager.instance
  }

  private initializeServer() {
    // Try primary servers first
    for (const server of SERVER_CONFIG.primary) {
      if (server.isHealthy) {
        this.currentServer = server
        break
      }
    }
    
    // Fallback to backup servers if needed
    if (!this.currentServer) {
      for (const server of SERVER_CONFIG.fallback) {
        if (server.isHealthy) {
          this.currentServer = server
          break
        }
      }
    }
  }

  private startHealthChecks() {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer)
    }

    this.healthCheckTimer = setInterval(async () => {
      await this.checkAllServersHealth()
    }, SERVER_CONFIG.healthCheckInterval)
  }

  private async checkAllServersHealth() {
    const allServers = [...SERVER_CONFIG.primary, ...SERVER_CONFIG.fallback]
    
    await Promise.allSettled(
      allServers.map(server => this.checkServerHealth(server))
    )
    
    // Re-evaluate current server if it's unhealthy
    if (this.currentServer && !this.currentServer.isHealthy) {
      this.switchToHealthyServer()
    }
  }

  private async checkServerHealth(server: ServerEndpoint): Promise<void> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), SERVER_CONFIG.timeout)

      const response = await fetch(`${server.url}/api/health`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })

      clearTimeout(timeoutId)
      
      server.isHealthy = response.ok
      server.lastChecked = new Date()
    } catch (error) {
      server.isHealthy = false
      server.lastChecked = new Date()
      console.warn(`Server ${server.name} health check failed:`, error)
    }
  }

  public switchToHealthyServer() {
    const allServers = [...SERVER_CONFIG.primary, ...SERVER_CONFIG.fallback]
    
    // Find the next healthy server with highest priority (lowest number)
    const healthyServers = allServers
      .filter(s => s.isHealthy)
      .sort((a, b) => a.priority - b.priority)

    if (healthyServers.length > 0) {
      const newServer = healthyServers[0]
      if (newServer.id !== this.currentServer?.id) {
        console.log(`Switching from ${this.currentServer?.name} to ${newServer.name}`)
        this.currentServer = newServer
      }
    }
  }

  public getCurrentServer(): ServerEndpoint | null {
    return this.currentServer
  }

  public getServerUrl(): string {
    return this.currentServer?.url || SERVER_CONFIG.primary[0].url
  }

  public async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const maxRetries = SERVER_CONFIG.retries
    let lastError: Error | null = null

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const server = this.getCurrentServer()
      if (!server) {
        throw new Error('No healthy servers available')
      }

      try {
        const url = `${server.url}${endpoint}`
        const response = await fetch(url, {
          ...options,
          headers: {
            'X-Server-ID': server.id,
            'X-Attempt': attempt.toString(),
            ...options.headers
          }
        })

        if (response.ok) {
          return response
        }

        // If server responds with error, mark as unhealthy and retry
        server.isHealthy = false
        this.switchToHealthyServer()
        lastError = new Error(`Server responded with ${response.status}`)
        
      } catch (error) {
        lastError = error as Error
        server.isHealthy = false
        this.switchToHealthyServer()
        
        // Wait before retry (exponential backoff)
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
        }
      }
    }

    throw lastError || new Error('All server attempts failed')
  }

  public getServerStatus() {
    return {
      current: this.currentServer,
      primary: SERVER_CONFIG.primary,
      fallback: SERVER_CONFIG.fallback,
      config: SERVER_CONFIG
    }
  }

  public destroy() {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer)
      this.healthCheckTimer = null
    }
  }
}

// Export singleton instance
export const serverManager = ServerManager.getInstance()

// Utility function for API calls
export async function apiCall(endpoint: string, options: RequestInit = {}): Promise<Response> {
  return serverManager.makeRequest(endpoint, options)
}
