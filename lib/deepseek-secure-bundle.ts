// Secure DeepSeek Bundle Integration
// Provides anonymous, secure communication with DeepSeek using temporary bundles

import crypto from 'crypto';

interface DeepSeekBundle {
  id: string;
  createdAt: string;
  expiresAt: string;
  data: {
    prompt: string;
    context: {
      anonymizedResume: string;
      assessmentData?: any;
      metadata: {
        requestId: string;
        timestamp: string;
        version: string;
      }
    };
  }
}

interface DeepSeekResponse {
  id: string;
  response: string;
  extractedData: {
    careerMap?: any;
    recommendedRoles?: any[];
    skillGaps?: string[];
    nextSteps?: string[];
  };
  processedAt: string;
}

class DeepSeekSecureBundle {
  private static readonly BUNDLE_EXPIRY = 5 * 60 * 1000; // 5 minutes
  private static readonly MAX_BUNDLES = 100;
  private static bundles = new Map<string, DeepSeekBundle>();
  
  /**
   * Create a secure bundle with anonymized data
   */
  static createBundle(resumeText: string, assessmentData?: any): DeepSeekBundle {
    const bundleId = crypto.randomUUID();
    const requestId = crypto.randomUUID();
    
    // Anonymize resume text - remove personal identifiers
    const anonymizedResume = this.anonymizeResume(resumeText);
    
    const bundle: DeepSeekBundle = {
      id: bundleId,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + this.BUNDLE_EXPIRY).toISOString(),
      data: {
        prompt: this.generateSecurePrompt(anonymizedResume, assessmentData),
        context: {
          anonymizedResume,
          assessmentData: assessmentData ? this.anonymizeAssessment(assessmentData) : undefined,
          metadata: {
            requestId,
            timestamp: new Date().toISOString(),
            version: '1.0'
          }
        }
      }
    };
    
    // Store bundle temporarily
    this.bundles.set(bundleId, bundle);
    
    // Schedule cleanup
    setTimeout(() => {
      this.destroyBundle(bundleId);
    }, this.BUNDLE_EXPIRY);
    
    // Cleanup old bundles
    this.cleanupOldBundles();
    
    return bundle;
  }
  
  /**
   * Send bundle to DeepSeek and extract response
   */
  static async sendToDeepSeek(bundle: DeepSeekBundle): Promise<DeepSeekResponse> {
    try {
      const apiKey = process.env.DEEPSEEK_API_KEY;
      if (!apiKey) {
        throw new Error('DEEPSEEK_API_KEY is not configured');
      }
      
      // Send to DeepSeek
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Glixtron-AI-Client/1.0'
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [{ 
            role: 'user', 
            content: bundle.data.prompt 
          }],
          temperature: 0.7,
          max_tokens: 2000,
          stream: false
        })
      });
      
      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      const rawResponse = data.choices?.[0]?.message?.content || '';
      
      // Extract structured data from response
      const extractedData = this.extractStructuredData(rawResponse);
      
      const result: DeepSeekResponse = {
        id: bundle.id,
        response: rawResponse,
        extractedData,
        processedAt: new Date().toISOString()
      };
      
      // Destroy bundle immediately after processing
      this.destroyBundle(bundle.id);
      
      return result;
      
    } catch (error) {
      // Ensure bundle is destroyed even on error
      this.destroyBundle(bundle.id);
      throw error;
    }
  }
  
  /**
   * Anonymize resume text to remove personal identifiers
   */
  private static anonymizeResume(resumeText: string): string {
    let anonymized = resumeText;
    
    // Remove email addresses
    anonymized = anonymized.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL_REDACTED]');
    
    // Remove phone numbers
    anonymized = anonymized.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE_REDACTED]');
    
    // Remove addresses (basic pattern)
    anonymized = anonymized.replace(/\d+\s+[^,\n]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd)[^,\n]*,\s*[^,\n]*\d{5}/g, '[ADDRESS_REDACTED]');
    
    // Remove names (basic pattern - title case followed by name)
    anonymized = anonymized.replace(/\b(?:Mr|Mrs|Ms|Dr|Prof)\.?\s+[A-Z][a-z]+\s+[A-Z][a-z]+\b/g, '[NAME_REDACTED]');
    
    // Remove URLs
    anonymized = anonymized.replace(/https?:\/\/[^\s]+/g, '[URL_REDACTED]');
    
    // Remove LinkedIn profiles
    anonymized = anonymized.replace(/linkedin\.com\/in\/[^\s]+/g, '[LINKEDIN_REDACTED]');
    
    return anonymized;
  }
  
  /**
   * Anonymize assessment data
   */
  private static anonymizeAssessment(assessmentData: any): any {
    if (!assessmentData) return undefined;
    
    const anonymized = { ...assessmentData };
    
    // Remove any potentially identifying information
    if (anonymized.personalInfo) {
      delete anonymized.personalInfo;
    }
    
    return anonymized;
  }
  
  /**
   * Generate secure prompt for DeepSeek
   */
  private static generateSecurePrompt(anonymizedResume: string, assessmentData?: any): string {
    const assessmentContext = assessmentData 
      ? `Assessment: Core skills: ${assessmentData.coreSkills?.join(', ') || 'N/A'}, Soft skills: ${assessmentData.softSkills?.join(', ') || 'N/A'}, Remote preference: ${assessmentData.remotePreference || 50}%, Startup preference: ${assessmentData.startupPreference || 50}%`
      : '';
    
    return `You are an expert career advisor providing guidance based on anonymized resume data. 

ANONYMIZED RESUME:
${anonymizedResume.substring(0, 3000)}
${assessmentContext}

IMPORTANT: 
- Do not request or store any personal information
- Focus only on career guidance and skill analysis
- Provide actionable, professional advice
- Return structured JSON response

Return a JSON object with this exact structure (no markdown, no code blocks):
{
  "careerMap": {
    "shortTerm": [<3-4 actionable steps for next 0-6 months>],
    "midTerm": [<3-4 goals for 6-18 months>],
    "longTerm": [<2-3 career aspirations for 2+ years>]
  },
  "recommendedRoles": [
    {
      "title": "<job title>",
      "matchScore": <0-100>,
      "description": "<brief why this fits>",
      "skills": [<key skills for this role>]
    }
  ],
  "skillGaps": [<missing skills to develop>],
  "nextSteps": [<3-5 immediate actionable next steps>]
}

Return ONLY valid JSON. No additional text or explanations.`;
  }
  
  /**
   * Extract structured data from AI response
   */
  private static extractStructuredData(rawResponse: string): DeepSeekResponse['extractedData'] {
    try {
      // Clean up response
      let jsonStr = rawResponse.replace(/```json|```/g, '').trim();
      
      // Find JSON object
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }
      
      const parsed = JSON.parse(jsonStr);
      
      // Validate structure
      return {
        careerMap: parsed.careerMap || {},
        recommendedRoles: parsed.recommendedRoles || [],
        skillGaps: parsed.skillGaps || [],
        nextSteps: parsed.nextSteps || []
      };
    } catch (error) {
      console.error('Failed to parse DeepSeek response:', error);
      return {
        careerMap: {},
        recommendedRoles: [],
        skillGaps: [],
        nextSteps: []
      };
    }
  }
  
  /**
   * Destroy bundle and clean up data
   */
  private static destroyBundle(bundleId: string): void {
    const bundle = this.bundles.get(bundleId);
    if (bundle) {
      // Clear sensitive data
      bundle.data.prompt = '';
      bundle.data.context.anonymizedResume = '';
      bundle.data.context.assessmentData = undefined;
      
      // Remove from memory
      this.bundles.delete(bundleId);
    }
  }
  
  /**
   * Clean up expired bundles
   */
  private static cleanupOldBundles(): void {
    const now = Date.now();
    const expiredBundles: string[] = [];
    
    for (const [id, bundle] of this.bundles.entries()) {
      if (new Date(bundle.expiresAt).getTime() < now) {
        expiredBundles.push(id);
      }
    }
    
    expiredBundles.forEach(id => this.destroyBundle(id));
    
    // If too many bundles, remove oldest ones
    if (this.bundles.size > this.MAX_BUNDLES) {
      const sortedBundles = Array.from(this.bundles.entries())
        .sort((a, b) => 
          new Date(a[1].createdAt).getTime() - new Date(b[1].createdAt).getTime()
        );
      
      const toRemove = sortedBundles.slice(0, sortedBundles.length - this.MAX_BUNDLES);
      toRemove.forEach(([id]) => this.destroyBundle(id));
    }
  }
  
  /**
   * Get bundle status (for debugging)
   */
  static getBundleStatus(): { count: number; oldest: string | null; newest: string | null } {
    const bundles = Array.from(this.bundles.values());
    
    if (bundles.length === 0) {
      return { count: 0, oldest: null, newest: null };
    }
    
    const sorted = bundles.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    
    return {
      count: bundles.length,
      oldest: sorted[0]?.createdAt || null,
      newest: sorted[sorted.length - 1]?.createdAt || null
    };
  }
}

export default DeepSeekSecureBundle;
