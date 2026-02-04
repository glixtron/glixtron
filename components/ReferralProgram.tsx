'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Users, 
  Gift, 
  Share2, 
  Copy, 
  CheckCircle, 
  TrendingUp,
  Award,
  Target,
  Zap,
  Crown,
  Star,
  Calendar,
  DollarSign,
  Mail,
  MessageCircle,
  Twitter,
  Linkedin,
  Link2,
  QrCode,
  Download,
  Eye,
  BarChart3
} from 'lucide-react'

interface ReferralStats {
  totalReferrals: number
  successfulReferrals: number
  pendingReferrals: number
  totalEarnings: number
  currentMonthEarnings: number
  referralCode: string
  referralLink: string
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  nextTierProgress: number
  rewards: {
    signup: number
    firstPurchase: number
    monthlySubscription: number
    annualSubscription: number
  }
}

interface ReferralHistory {
  id: string
  referredEmail: string
  referredName: string
  status: 'pending' | 'completed' | 'expired'
  signupDate: string
  completionDate?: string
  reward: number
  rewardType: 'signup' | 'purchase' | 'subscription'
}

export default function ReferralProgram() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [history, setHistory] = useState<ReferralHistory[]>([])
  const [copied, setCopied] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'rewards' | 'tools'>('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      loadReferralData()
    }
  }, [session])

  const loadReferralData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/referral/stats')
      const data = await response.json()
      
      if (data.success) {
        setStats(data.data.stats)
        setHistory(data.data.history)
      }
    } catch (error) {
      console.error('Failed to load referral data:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const shareOnSocial = (platform: 'twitter' | 'linkedin' | 'facebook') => {
    const url = stats?.referralLink || ''
    const text = 'Check out this amazing career guidance platform that helped me land my dream job!'
    
    let shareUrl = ''
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  const sendReferralEmail = () => {
    const subject = 'Invitation to Join Career Guidance Platform'
    const body = `Hi there!

I wanted to share this amazing career guidance platform that has been incredibly helpful for my career development. It offers:

✨ AI-powered resume analysis
🎯 Personalized career roadmaps
📊 Skill gap analysis
💼 Job matching tools
🚀 Interview preparation

You can sign up using my referral link: ${stats?.referralLink}

Let me know if you have any questions!

Best regards,
${session?.user?.name || 'Your friend'}`

    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoUrl)
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'text-orange-400'
      case 'silver': return 'text-gray-300'
      case 'gold': return 'text-yellow-400'
      case 'platinum': return 'text-purple-400'
      default: return 'text-gray-400'
    }
  }

  const getTierBgColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'bg-orange-600/20 border-orange-500/50'
      case 'silver': return 'bg-gray-600/20 border-gray-500/50'
      case 'gold': return 'bg-yellow-600/20 border-yellow-500/50'
      case 'platinum': return 'bg-purple-600/20 border-purple-500/50'
      default: return 'bg-gray-600/20 border-gray-500/50'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Users className="w-8 h-8 text-blue-400" />
          <Gift className="w-8 h-8 text-purple-400" />
          <Share2 className="w-8 h-8 text-green-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Referral Program
        </h1>
        <p className="text-gray-300">
          Earn rewards by sharing the platform with friends and colleagues
        </p>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-blue-400" />
              <span className="text-sm text-gray-400">Total Referrals</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stats.totalReferrals}</div>
            <div className="text-sm text-gray-300">
              {stats.successfulReferrals} successful
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-green-400" />
              <span className="text-sm text-gray-400">Total Earnings</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">${stats.totalEarnings}</div>
            <div className="text-sm text-gray-300">
              ${stats.currentMonthEarnings} this month
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <Crown className={`w-8 h-8 ${getTierColor(stats.tier)}`} />
              <span className="text-sm text-gray-400">Current Tier</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1 capitalize">{stats.tier}</div>
            <div className="text-sm text-gray-300">
              {stats.nextTierProgress}% to next tier
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-purple-400" />
              <span className="text-sm text-gray-400">Conversion Rate</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {stats.totalReferrals > 0 
                ? Math.round((stats.successfulReferrals / stats.totalReferrals) * 100) 
                : 0}%
            </div>
            <div className="text-sm text-gray-300">
              {stats.pendingReferrals} pending
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'overview' 
              ? 'bg-blue-600 text-white' 
              : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('tools')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'tools' 
              ? 'bg-blue-600 text-white' 
              : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
          }`}
        >
          Sharing Tools
        </button>
        <button
          onClick={() => setActiveTab('rewards')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'rewards' 
              ? 'bg-blue-600 text-white' 
              : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
          }`}
        >
          Rewards
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'history' 
              ? 'bg-blue-600 text-white' 
              : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
          }`}
        >
          History
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-6">
          {/* Referral Link */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-6 border border-blue-500/50">
            <h3 className="text-xl font-semibold text-white mb-4">Your Referral Link</h3>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={stats.referralLink}
                readOnly
                className="flex-1 p-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white"
              />
              <button
                onClick={() => copyToClipboard(stats.referralLink)}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setShowQRCode(!showQRCode)}
                className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <QrCode className="w-4 h-4" />
                <span>QR Code</span>
              </button>
            </div>
            
            {showQRCode && (
              <div className="mt-4 p-4 bg-white rounded-lg">
                <div className="w-64 h-64 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">QR Code would be generated here</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Share Buttons */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
            <h3 className="text-xl font-semibold text-white mb-4">Share Instantly</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => shareOnSocial('twitter')}
                className="p-4 bg-sky-600/20 border border-sky-500/50 rounded-lg hover:bg-sky-600/30 transition-colors flex flex-col items-center space-y-2"
              >
                <Twitter className="w-6 h-6 text-sky-400" />
                <span className="text-white text-sm">Twitter</span>
              </button>
              <button
                onClick={() => shareOnSocial('linkedin')}
                className="p-4 bg-blue-600/20 border border-blue-500/50 rounded-lg hover:bg-blue-600/30 transition-colors flex flex-col items-center space-y-2"
              >
                <Linkedin className="w-6 h-6 text-blue-400" />
                <span className="text-white text-sm">LinkedIn</span>
              </button>
              <button
                onClick={sendReferralEmail}
                className="p-4 bg-green-600/20 border border-green-500/50 rounded-lg hover:bg-green-600/30 transition-colors flex flex-col items-center space-y-2"
              >
                <Mail className="w-6 h-6 text-green-400" />
                <span className="text-white text-sm">Email</span>
              </button>
              <button
                onClick={() => copyToClipboard(stats.referralLink)}
                className="p-4 bg-purple-600/20 border border-purple-500/50 rounded-lg hover:bg-purple-600/30 transition-colors flex flex-col items-center space-y-2"
              >
                <Link2 className="w-6 h-6 text-purple-400" />
                <span className="text-white text-sm">Copy Link</span>
              </button>
            </div>
          </div>

          {/* Tier Progress */}
          <div className={`bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border ${getTierBgColor(stats.tier)}`}>
            <h3 className="text-xl font-semibold text-white mb-4">Tier Progress</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Current Tier:</span>
                <span className={`font-bold capitalize ${getTierColor(stats.tier)}`}>{stats.tier}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${stats.nextTierProgress}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-300">
                {stats.nextTierProgress}% to next tier
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sharing Tools Tab */}
      {activeTab === 'tools' && (
        <div className="space-y-6">
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
            <h3 className="text-xl font-semibold text-white mb-4">Email Templates</h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <h4 className="text-white font-medium mb-2">Professional Template</h4>
                <p className="text-gray-300 text-sm mb-3">
                  Hi [Name], I wanted to share this career guidance platform that has been incredibly helpful&#39;...
                </p>
                <button
                  onClick={sendReferralEmail}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Use This Template
                </button>
              </div>
              
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <h4 className="text-white font-medium mb-2">Casual Template</h4>
                  <p className="text-gray-300 text-sm mb-3">
                  Hey! Found this awesome career platform and thought you&apos;d love it...
                </p>
                <button
                  onClick={sendReferralEmail}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  Use This Template
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
            <h3 className="text-xl font-semibold text-white mb-4">Social Media Posts</h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <h4 className="text-white font-medium mb-2">LinkedIn Post</h4>
                <p className="text-gray-300 text-sm">
                  Just discovered this amazing AI-powered career guidance platform! 🚀 It helped me...
                </p>
                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={() => shareOnSocial('linkedin')}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    Post on LinkedIn
                  </button>
                </div>
              </div>
              
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <h4 className="text-white font-medium mb-2">Twitter Post</h4>
                <p className="text-gray-300 text-sm">
                  Landing your dream job just got easier! 🎯 This AI platform analyzes your resume...
                </p>
                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={() => shareOnSocial('twitter')}
                    className="px-3 py-1 bg-sky-600 text-white rounded hover:bg-sky-700 transition-colors text-sm"
                  >
                    Tweet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rewards Tab */}
      {activeTab === 'rewards' && stats && (
        <div className="space-y-6">
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
            <h3 className="text-xl font-semibold text-white mb-4">Reward Structure</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-800/50 rounded-lg text-center">
                <Gift className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <h4 className="text-white font-medium mb-1">Sign Up</h4>
                <p className="text-2xl font-bold text-green-400">${stats.rewards.signup}</p>
                <p className="text-gray-300 text-sm">Per referral</p>
              </div>
              
              <div className="p-4 bg-slate-800/50 rounded-lg text-center">
                <Award className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <h4 className="text-white font-medium mb-1">First Purchase</h4>
                <p className="text-2xl font-bold text-blue-400">${stats.rewards.firstPurchase}</p>
                <p className="text-gray-300 text-sm">Per referral</p>
              </div>
              
              <div className="p-4 bg-slate-800/50 rounded-lg text-center">
                <Calendar className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h4 className="text-white font-medium mb-1">Monthly Sub</h4>
                <p className="text-2xl font-bold text-purple-400">${stats.rewards.monthlySubscription}</p>
                <p className="text-gray-300 text-sm">Per referral</p>
              </div>
              
              <div className="p-4 bg-slate-800/50 rounded-lg text-center">
                <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <h4 className="text-white font-medium mb-1">Annual Sub</h4>
                <p className="text-2xl font-bold text-yellow-400">${stats.rewards.annualSubscription}</p>
                <p className="text-gray-300 text-sm">Per referral</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
            <h3 className="text-xl font-semibold text-white mb-4">Tier Benefits</h3>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${getTierBgColor('bronze')}`}>
                <h4 className={`font-medium ${getTierColor('bronze')}`}>Bronze Tier (0-10 referrals)</h4>
                <ul className="text-gray-300 text-sm space-y-1 mt-2">
                  <li>• Standard rewards</li>
                  <li>• Basic referral tracking</li>
                  <li>• Email support</li>
                </ul>
              </div>
              
              <div className={`p-4 rounded-lg border ${getTierBgColor('silver')}`}>
                <h4 className={`font-medium ${getTierColor('silver')}`}>Silver Tier (11-25 referrals)</h4>
                <ul className="text-gray-300 text-sm space-y-1 mt-2">
                  <li>• 10% reward bonus</li>
                  <li>• Advanced analytics</li>
                  <li>• Priority support</li>
                </ul>
              </div>
              
              <div className={`p-4 rounded-lg border ${getTierBgColor('gold')}`}>
                <h4 className={`font-medium ${getTierColor('gold')}`}>Gold Tier (26-50 referrals)</h4>
                <ul className="text-gray-300 text-sm space-y-1 mt-2">
                  <li>• 20% reward bonus</li>
                  <li>• Premium analytics</li>
                  <li>• Dedicated support</li>
                </ul>
              </div>
              
              <div className={`p-4 rounded-lg border ${getTierBgColor('platinum')}`}>
                <h4 className={`font-medium ${getTierColor('platinum')}`}>Platinum Tier (50+ referrals)</h4>
                <ul className="text-gray-300 text-sm space-y-1 mt-2">
                  <li>• 30% reward bonus</li>
                  <li>• VIP analytics</li>
                  <li>• Personal manager</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
          <h3 className="text-xl font-semibold text-white mb-4">Referral History</h3>
          {history.length > 0 ? (
            <div className="space-y-4">
              {history.map((referral) => (
                <div key={referral.id} className="p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">{referral.referredName}</h4>
                      <p className="text-gray-300 text-sm">{referral.referredEmail}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        referral.status === 'completed' ? 'bg-green-600/20 text-green-400' :
                        referral.status === 'pending' ? 'bg-yellow-600/20 text-yellow-400' :
                        'bg-red-600/20 text-red-400'
                      }`}>
                        {referral.status}
                      </span>
                      <p className="text-white font-medium mt-1">${referral.reward}</p>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-400">
                    <span>Signup: {new Date(referral.signupDate).toLocaleDateString()}</span>
                    {referral.completionDate && (
                      <span> • Completed: {new Date(referral.completionDate).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300">No referrals yet. Start sharing to earn rewards!</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
