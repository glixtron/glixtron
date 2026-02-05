'use client'

import { useState, useEffect } from 'react'
import { Shield, Lock, Database, Users, FileText, CheckCircle, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPolicy() {
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)

  const handleAcceptPrivacy = () => {
    setAcceptedPrivacy(true)
    localStorage.setItem('acceptedPrivacy', 'true')
  }

  useEffect(() => {
    const stored = localStorage.getItem('acceptedPrivacy')
    if (stored === 'true') {
      setAcceptedPrivacy(true)
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Lock className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
          </div>
          <p className="text-gray-300">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Your Privacy Matters</h2>
          <p className="text-gray-300 mb-6">
            At Glixtron, we are committed to protecting your privacy and ensuring the security of your personal information. 
            This Privacy Policy explains how we collect, use, and protect your data.
          </p>
          
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <p className="text-blue-200 text-sm">
                <strong>Our Commitment:</strong> We never sell your data and use it only to provide better career guidance.
              </p>
            </div>
          </div>
        </div>

        {/* Key Sections */}
        <div className="space-y-8">
          {/* 1. Information We Collect */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">1. Information We Collect</h3>
            <div className="space-y-4 text-gray-300">
              <p>We collect only the information necessary to provide our career guidance services:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span className="font-medium text-white">Resume Data</span>
                  </div>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Resume text content</li>
                    <li>• Skills and experience</li>
                    <li>• Education background</li>
                    <li>• Career goals</li>
                  </ul>
                </div>
                
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span className="font-medium text-white">Account Information</span>
                  </div>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Name and email</li>
                    <li>• Profile preferences</li>
                    <li>• Usage analytics</li>
                    <li>• Communication preferences</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 2. How We Use Your Information */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">2. How We Use Your Information</h3>
            <div className="space-y-4 text-gray-300">
              <p>We use your information solely for:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Providing personalized career guidance and recommendations</li>
                <li>Analyzing your skills and experience to identify career opportunities</li>
                <li>Generating tailored learning paths and skill development plans</li>
                <li>Improving our AI algorithms and service quality</li>
                <li>Communicating with you about your career progress</li>
                <li>Ensuring platform security and preventing fraud</li>
              </ul>
            </div>
          </div>

          {/* 3. Data Security and Protection */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">3. Data Security and Protection</h3>
            <div className="space-y-4 text-gray-300">
              <p>We implement industry-leading security measures:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <Database className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <span className="text-sm font-medium text-white">Encrypted Storage</span>
                  <p className="text-xs text-gray-300 mt-1">All data encrypted at rest</p>
                </div>
                
                <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <Lock className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <span className="text-sm font-medium text-white">Secure Transmission</span>
                  <p className="text-xs text-gray-300 mt-1">SSL/TLS encryption</p>
                </div>
                
                <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <span className="text-sm font-medium text-white">Regular Audits</span>
                  <p className="text-xs text-gray-300 mt-1">Security assessments</p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. AI Processing and Data */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">4. AI Processing and Data</h3>
            <div className="space-y-4 text-gray-300">
              <p>
                Our AI system processes your data to provide career guidance. Here's how we handle it:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Resume text is processed server-side, never in your browser</li>
                <li>AI models use anonymized data for training and improvement</li>
                <li>We don't store original resume files, only extracted text</li>
                <li>AI responses are generated on-demand and not permanently stored</li>
                <li>You can request deletion of your AI interaction history</li>
              </ul>
            </div>
          </div>

          {/* 5. Data Sharing and Third Parties */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">5. Data Sharing and Third Parties</h3>
            <div className="space-y-4 text-gray-300">
              <p>We do not sell your personal information. We may share data only with:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>AI service providers (Google, DeepSeek) for processing</li>
                <li>Cloud infrastructure providers for hosting</li>
                <li>Analytics providers for service improvement</li>
                <li>Legal authorities when required by law</li>
              </ul>
              
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mt-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <p className="text-yellow-200 text-sm">
                    <strong>Important:</strong> We never share your resume or career data with employers without your explicit consent.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 6. Your Rights and Choices */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">6. Your Rights and Choices</h3>
            <div className="space-y-4 text-gray-300">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Access your personal data at any time</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and all associated data</li>
                <li>Export your data in a readable format</li>
                <li>Opt-out of marketing communications</li>
                <li>Request data portability</li>
              </ul>
              
              <p className="text-gray-300 mt-4">
                To exercise these rights, contact us at privacy@glixtron.com
              </p>
            </div>
          </div>

          {/* 7. Cookies and Tracking */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">7. Cookies and Tracking</h3>
            <div className="space-y-4 text-gray-300">
              <p>We use cookies and similar technologies to:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Keep you logged in to your account</li>
                <li>Remember your preferences</li>
                <li>Analyze platform usage to improve our services</li>
                <li>Ensure security and prevent fraud</li>
              </ul>
              
              <p className="text-gray-300 mt-4">
                You can control cookies through your browser settings.
              </p>
            </div>
          </div>

          {/* 8. Data Retention */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">8. Data Retention</h3>
            <div className="space-y-4 text-gray-300">
              <p>We retain your data only as long as necessary:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Account data: Until you delete your account</li>
                <li>Resume data: Until you remove it from our system</li>
                <li>Analytics data: For 12 months (anonymized)</li>
                <li>AI interaction logs: For 6 months (anonymized)</li>
              </ul>
            </div>
          </div>

          {/* 9. International Data Transfers */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">9. International Data Transfers</h3>
            <div className="space-y-4 text-gray-300">
              <p>
                Your data may be processed in countries outside your own. We ensure adequate protection through:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Standard Contractual Clauses (SCCs)</li>
                <li>Adequacy decisions where applicable</li>
                <li>Encryption and security measures</li>
                <li>Compliance with GDPR and other regulations</li>
              </ul>
            </div>
          </div>

          {/* 10. Children's Privacy */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">10. Children's Privacy</h3>
            <div className="space-y-4 text-gray-300">
              <p>
                Our services are intended for users 16 years and older. We do not knowingly collect personal information 
                from children under 16. If we become aware that we have collected such information, we will delete it promptly.
              </p>
            </div>
          </div>

          {/* 11. Changes to This Policy */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">11. Changes to This Policy</h3>
            <div className="space-y-4 text-gray-300">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of significant changes by:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Email notification</li>
                <li>In-app notifications</li>
                <li>Posting on our website</li>
                <li>Updating the "Last updated" date</li>
              </ul>
            </div>
          </div>

          {/* 12. Contact Us */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">12. Contact Us</h3>
            <div className="space-y-4 text-gray-300">
              <p>If you have questions about this Privacy Policy or our data practices, contact us:</p>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <ul className="space-y-2">
                  <li><strong>Email:</strong> privacy@glixtron.com</li>
                  <li><strong>Address:</strong> 123 Career Lane, Tech City, TC 12345</li>
                  <li><strong>Phone:</strong> +1 (555) 123-4567</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {!acceptedPrivacy && (
          <div className="text-center mt-8">
            <button
              onClick={handleAcceptPrivacy}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Accept Privacy Policy</span>
            </button>
          </div>
        )}

        {/* Already Accepted */}
        {acceptedPrivacy && (
          <div className="mt-8 p-6 bg-green-500/10 border-green-500/30 rounded-xl">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-green-200 font-medium">Privacy Policy Accepted</span>
            </div>
            <p className="text-green-200 text-sm mt-2">
              Thank you for trusting us with your data.
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
              Your privacy is our priority. We are committed to protecting your personal information.
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
