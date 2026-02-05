'use client'

import { useState, useEffect } from 'react'
import { Shield, Users, FileText, AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function TermsOfService() {
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleAcceptTerms = () => {
    setAcceptedTerms(true)
    localStorage.setItem('acceptedTerms', 'true')
  }

  useEffect(() => {
    const stored = localStorage.getItem('acceptedTerms')
    if (stored === 'true') {
      setAcceptedTerms(true)
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Shield className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
          </div>
          <p className="text-gray-300">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Welcome to Glixtron</h2>
          <p className="text-gray-300 mb-6">
            These Terms of Service govern your access to and use of the Glixtron AI Career Guidance platform. 
            By accessing or using our services, you agree to be bound by these terms.
          </p>
          
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              <p className="text-yellow-200 text-sm">
                <strong>Important:</strong> Read these terms carefully as they contain important information about your rights and obligations.
              </p>
            </div>
          </div>
        </div>

        {/* Key Sections */}
        <div className="space-y-8">
          {/* 1. Acceptance of Terms */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">1. Acceptance of Terms</h3>
            <p className="text-gray-300 mb-4">
              By creating an account and using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
            
            <div className="flex items-start space-x-4">
              <input
                type="checkbox"
                id="terms-accept"
                checked={acceptedTerms}
                onChange={handleAcceptTerms}
                className="w-4 h-4 text-blue-500 bg-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="terms-accept" className="text-gray-300 cursor-pointer">
                I accept the Terms of Service
              </label>
            </div>
          </div>

          {/* 2. Service Description */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">2. Service Description</h3>
            <div className="space-y-4 text-gray-300">
              <p>
                <strong>Glixtron</strong> is an AI-powered career guidance platform that provides:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>AI-powered resume analysis and optimization</li>
                <li>Personalized career roadmap generation</li>
                <li>Skill gap analysis and learning recommendations</li>
                <li>Interview preparation and job matching</li>
                <li>Market insights and salary analysis</li>
              </ul>
              
              <p className="text-gray-300">
                Our AI algorithms analyze your background and career goals to provide personalized career guidance across all professional fields.
              </p>
            </div>
          </div>

          {/* 3. User Responsibilities */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">3. User Responsibilities</h3>
            <div className="space-y-4 text-gray-300">
              <p>As a user of Glixtron, you agree to:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Provide accurate and truthful information in your resume and career goals</li>
                <li>Use the platform for legitimate career development purposes only</li>
                <li>Respect intellectual property and copyright laws</li>
                <li>Not attempt to manipulate or exploit the AI system</li>
                <li>Report any bugs or issues you encounter</li>
              </ul>
            </div>
          </div>

          {/* 4. AI-Generated Content */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">4. AI-Generated Content</h3>
            <div className="space-y-4 text-gray-300">
              <p>
                Glixtron uses artificial intelligence to provide career guidance and recommendations. While we strive for accuracy, AI-generated content may contain inaccuracies or hallucinations.
              </p>
              <p>
                You acknowledge that:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>AI suggestions are based on the data you provide</li>
                <li>The Market Readiness score is an estimate, not a guarantee</li>
                <li>Career paths may change based on market conditions</li>
              </ul>
            </div>
          </div>

          {/* 5. Data Privacy and Security */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">5. Data Privacy and Security</h3>
            <div className="space-y-4 text-gray-300">
              <p>
                We take your privacy seriously and implement robust security measures:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>All resume data is processed server-side and encrypted</li>
                <li>We do not sell or share personal information</li>
                <li>Your data is used only for career guidance purposes</li>
                <li>We comply with GDPR, CCPA, and other privacy regulations</li>
                <li>Regular security audits and penetration testing</li>
              </ul>
            </div>
          </div>

          {/* 6. Limitation of Liability */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">6. Limitation of Liability</h3>
            <div className="space-y-4 text-gray-300">
              <p>
                To the fullest extent permitted by law, Glixtron and its team shall not be liable for:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Decisions made based on AI recommendations</li>
                <li>Employment outcomes or job offers</li>
                <li>Accuracy of AI-generated content</li>
                <li>Third-party service interruptions</li>
              </ul>
              <p>
                You use our services at your own risk and should verify all career decisions independently.
              </p>
            </div>
          </div>

          {/* 7. Service Availability */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">7. Service Availability</h3>
            <div className="space-y-4 text-gray-300">
              <p>
                While we strive for 99.9% uptime, Glixtron may experience temporary outages due to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>AI service provider maintenance</li>
                <li>Internet connectivity issues</li>
                <li>Planned system updates</li>
                <li>Unforeseen technical issues</li>
              </ul>
              <p>
                We will notify users of scheduled maintenance in advance when possible.
              </p>
            </div>
          </div>

          {/* 8. User Conduct */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">8. User Conduct</h3>
            <div className="space-y-4 text-gray-300">
              <p>
                To maintain a positive experience for all users, you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Be respectful in all interactions</li>
                <li>Provide constructive feedback to improve the platform</li>
                <li>Report bugs or issues promptly</li>
                <li>Not share proprietary or confidential information</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </div>
          </div>

          {/* 9. Termination */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">9. Termination</h3>
            <div className="space-y-4 text-gray-300">
              <p>
                You may terminate your account at any time by:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Deleting your account and all associated data</li>
                <li>Requesting data deletion under privacy laws</li>
                <li>Deactivating notifications and communications</li>
              </ul>
              <p>
                Upon termination, your data will be deleted within 30 days unless you request otherwise.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {!acceptedTerms && (
          <div className="text-center mt-8">
            <button
              onClick={handleAcceptTerms}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white border-t-2"></div>
                  <span>Accepting...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Accept Terms</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Already Accepted */}
        {acceptedTerms && (
          <div className="mt-8 p-6 bg-green-500/10 border-green-500/30 rounded-xl">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-green-200 font-medium">Terms Accepted</span>
            </div>
            <p className="text-green-200 text-sm mt-2">
              You can now access all Glixtron features and services.
            </p>
            <div className="mt-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 bg-white text-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-700">
          <div className="text-center text-gray-400 text-sm">
            <p>
              By continuing to use Glixtron, you acknowledge that you have read and agreed to these Terms of Service.
            </p>
            <p className="text-gray-500 text-xs">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
