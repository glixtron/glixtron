'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Zap, Users, Crown, AlertTriangle, TrendingUp } from 'lucide-react'

interface UsageTrackerProps {
  userId: string
  onUpgradeRequired?: () => void
}

interface UserTier {
  tier: string
  jobAnalysisLimit: number
  jobAnalysisUsed: number
  remaining: number | string
  trialExpiresAt?: string
  subscriptionActive: boolean
}

interface ReferralStats {
  totalReferrals: number
  successfulReferrals: number
  pendingReferrals: number
  referralCode?: string
  referralLink?: string
  progress?: {
    current: number
    required: number
    percentage: number
  }
}

export default function UsageTracker({ userId, onUpgradeRequired }: UsageTrackerProps) {
  const [loading, setLoading] = useState(true)
  const [userTier, setUserTier] = useState<UserTier | null>(null)
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null)
  const [showPaymentPortal, setShowPaymentPortal] = useState(false)

  useEffect(() => {
    if (userId) {
      fetchUsageData()
    }
  }, [userId])

  const fetchUsageData = async () => {
    try {
      // Fetch user tier and usage
      const tierResponse = await fetch(`/api/payment-portal?userId=${userId}`)
      const tierData = await tierResponse.json()
      
      if (tierData.success) {
        setUserTier(tierData.data.userTier)
      }

      // Fetch referral stats
      const referralResponse = await fetch(`/api/referral?userId=${userId}`)
      const referralData = await referralResponse.json()
      
      if (referralData.success) {
        setReferralStats(referralData.data)
      }

    } catch (error) {
      console.error('Failed to fetch usage data:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyReferralLink = async () => {
    if (referralStats?.referralLink) {
      try {
        await navigator.clipboard.writeText(referralStats.referralLink)
        // Show success feedback
      } catch (error) {
        console.error('Failed to copy referral link:', error)
      }
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'premium': return 'bg-blue-500'
      case 'enterprise': return 'bg-purple-500'
      case 'trial': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  const getUsagePercentage = () => {
    if (!userTier || userTier.jobAnalysisLimit === -1) return 0
    return (userTier.jobAnalysisUsed / userTier.jobAnalysisLimit) * 100
  }

  const isNearLimit = () => {
    if (!userTier || userTier.jobAnalysisLimit === -1) return false
    return userTier.jobAnalysisUsed >= Math.floor(userTier.jobAnalysisLimit * 0.8)
  }

  const isTrialExpired = () => {
    if (!userTier?.trialExpiresAt) return false
    return new Date() > new Date(userTier.trialExpiresAt)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Usage Alert */}
      {isNearLimit() && userTier?.tier !== 'premium' && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            You&apos;re approaching your job analysis limit! Upgrade to Premium for unlimited access or refer friends to earn free Premium.
          </AlertDescription>
        </Alert>
      )}

      {/* Trial Expired Alert */}
      {isTrialExpired() && userTier?.tier === 'free' && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Your free trial has expired. Upgrade to Premium to continue using unlimited job analysis features.
          </AlertDescription>
        </Alert>
      )}

      {/* Usage Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <CardTitle>Usage Overview</CardTitle>
            </div>
            <Badge className={getTierColor(userTier?.tier || 'free')}>
              {userTier?.tier?.charAt(0).toUpperCase() + userTier?.tier?.slice(1) || 'Free'}
            </Badge>
          </div>
          <CardDescription>
            Track your job analysis usage and limits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Job Analysis Usage */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Job Analyses</span>
              <span className="text-gray-600">
                {userTier?.jobAnalysisUsed} / {userTier?.remaining === -1 ? 'Unlimited' : userTier?.remaining}
              </span>
            </div>
            <Progress 
              value={getUsagePercentage()} 
              className={`h-2 ${isNearLimit() ? 'bg-orange-100' : ''}`}
            />
            {userTier?.tier !== 'premium' && (
              <p className="text-xs text-gray-500 mt-1">
                {userTier?.remaining === -1 
                  ? 'Unlimited analyses with Premium' 
                  : `${Math.max(0, userTier?.jobAnalysisLimit - userTier?.jobAnalysisUsed)} analyses remaining`
                }
              </p>
            )}
          </div>

          {/* Trial Info */}
          {userTier?.trialExpiresAt && (
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline">Trial Active</Badge>
              <span className="text-gray-600">
                Expires: {new Date(userTier.trialExpiresAt).toLocaleDateString()}
              </span>
            </div>
          )}

          {/* Upgrade Button */}
          {userTier?.tier !== 'premium' && (
            <Button 
              onClick={() => onUpgradeRequired?.()}
              className="w-full"
              variant={isNearLimit() ? 'default' : 'outline'}
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Premium
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Referral Card */}
      {referralStats && userTier?.tier !== 'premium' && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <CardTitle>Referral Program</CardTitle>
            </div>
            <CardDescription>
              Get 5 successful referrals to unlock Premium for free!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Referral Progress */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Successful Referrals</span>
                <span className="text-gray-600">
                  {referralStats.successfulReferrals} / 5
                </span>
              </div>
              <Progress 
                value={(referralStats.successfulReferrals / 5) * 100} 
                className="h-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                {5 - referralStats.successfulReferrals} more to unlock Premium
              </p>
            </div>

            {/* Referral Link */}
            {referralStats.referralLink && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Referral Link</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={referralStats.referralLink}
                    readOnly
                    className="flex-1 px-3 py-2 text-sm border rounded-lg bg-gray-50"
                  />
                  <Button variant="outline" size="sm" onClick={copyReferralLink}>
                    Copy
                  </Button>
                </div>
              </div>
            )}

            {/* Referral Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{referralStats.totalReferrals}</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{referralStats.successfulReferrals}</div>
                <div className="text-xs text-gray-500">Successful</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{referralStats.pendingReferrals}</div>
                <div className="text-xs text-gray-500">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Premium Benefits */}
      {userTier?.tier !== 'premium' && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-blue-800">Premium Benefits</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>Unlimited job analyses</span>
              </li>
              <li className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>Advanced AI-powered analysis</span>
              </li>
              <li className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>Priority support</span>
              </li>
              <li className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>Export to PDF/Word</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
