'use client'

import { useState } from 'react'

type ApiOk = { success: true; data: unknown }
type ApiErr = { success?: false; error?: string; details?: unknown }

export default function CareerGuidance() {
  const [resumeText, setResumeText] = useState('')
  const [streamType, setStreamType] = useState<'pcm' | 'pcb' | 'pcmb' | 'general'>('pcm')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [response, setResponse] = useState<unknown>(null)

  const analyze = async () => {
    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const res = await fetch('/api/glix/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, streamType })
      })

      const text = await res.text()
      const parsed: ApiOk | ApiErr = text ? JSON.parse(text) : { success: false, error: 'Empty response' }

      if (!res.ok) {
        throw new Error(parsed && typeof parsed === 'object' && 'error' in parsed && parsed.error ? String(parsed.error) : `HTTP ${res.status}`)
      }

      if (parsed && typeof parsed === 'object' && 'success' in parsed && parsed.success) {
        setResponse((parsed as ApiOk).data)
        return
      }

      throw new Error((parsed as ApiErr).error || 'Analysis failed')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-cyan-400">GlixAI Career Intelligence</h1>

        <div className="space-y-3">
          <label className="block text-sm text-gray-300">Stream</label>
          <select
            className="w-full bg-gray-900 border border-white/10 rounded px-3 py-2"
            value={streamType}
            onChange={(e) => setStreamType(e.target.value as any)}
          >
            <option value="pcm">PCM</option>
            <option value="pcb">PCB</option>
            <option value="pcmb">PCMB</option>
            <option value="general">General</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="block text-sm text-gray-300">Resume Text</label>
          <textarea
            className="w-full bg-gray-900 border border-white/10 rounded p-3 min-h-40"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste resume text here…"
          />
        </div>

        <button
          className="inline-flex items-center justify-center px-5 py-2.5 rounded bg-cyan-600 text-black font-semibold disabled:opacity-50"
          disabled={loading || !resumeText.trim()}
          onClick={analyze}
        >
          {loading ? 'Processing…' : 'Analyze'}
        </button>

        {error && <div className="p-3 rounded border border-red-500/30 bg-red-950/40 text-red-200">{error}</div>}

        {response !== null && (
          <pre className="text-xs p-4 rounded bg-gray-900 border border-white/10 overflow-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}
