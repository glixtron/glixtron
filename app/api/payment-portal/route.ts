/**
 * Payment Portal API - Handle subscription management and payment processing
 */

import { NextRequest, NextResponse } from 'next/server'
import { userTierSystem } from '@/lib/user-tier-system'
import { secureApiRoute } from '@/lib/secure-api'

export const GET = secureApiRoute(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    await userTierSystem.initialize()
    
    const userTier = await userTierSystem.getUserTier(userId)
    const referralStats = await userTierSystem.getReferralStats(userId)
    const usageAnalytics = await userTierSystem.getUsageAnalytics(userId, 30)
    const shouldShowPortal = await userTierSystem.shouldShowPaymentPortal(userId)

    const plans = [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        currency: 'USD',
        interval: 'month',
        features: [
          '10 job analyses per month',
          'Basic JD extraction',
          'Limited resume analysis',
          'Community support'
        ],
        highlighted: false,
        current: userTier.tier === 'free'
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 29.99,
        currency: 'USD',
        interval: 'month',
        features: [
          'Unlimited job analyses',
          'Advanced JD extraction',
          'AI-powered resume analysis',
          'Priority support',
          'Export to PDF/Word',
          'Advanced analytics'
        ],
        highlighted: true,
        current: userTier.tier === 'premium'
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 99.99,
        currency: 'USD',
        interval: 'month',
        features: [
          'Everything in Premium',
          'Team collaboration',
          'API access',
          'Custom integrations',
          'Dedicated support',
          'White-label options'
        ],
        highlighted: false,
        current: userTier.tier === 'enterprise'
      }
    ]

    const paymentMethods = [
      {
        id: 'stripe',
        name: 'Credit/Debit Card',
        description: 'Visa, Mastercard, American Express',
        icon: 'credit-card',
        popular: true
      },
      {
        id: 'paypal',
        name: 'PayPal',
        description: 'Pay with PayPal account',
        icon: 'paypal',
        popular: false
      },
      {
        id: 'razorpay',
        name: 'Razorpay',
        description: 'UPI, Cards, Net Banking',
        icon: 'bank',
        popular: false
      },
      {
        id: 'crypto',
        name: 'Cryptocurrency',
        description: 'Bitcoin, Ethereum, USDT',
        icon: 'bitcoin',
        popular: false
      }
    ]

    return NextResponse.json({
      success: true,
      data: {
        userTier: {
          tier: userTier.tier,
          jobAnalysisLimit: userTier.jobAnalysisLimit,
          jobAnalysisUsed: userTier.jobAnalysisUsed,
          remaining: userTier.jobAnalysisLimit === -1 ? 'Unlimited' : 
                   Math.max(0, userTier.jobAnalysisLimit - userTier.jobAnalysisUsed),
          trialExpiresAt: userTier.trialExpiresAt,
          subscriptionActive: userTier.subscriptionActive
        },
        referralStats,
        usageAnalytics: usageAnalytics.slice(0, 7), // Last 7 days
        shouldShowPortal,
        plans,
        paymentMethods
      }
    })

  } catch (error: any) {
    console.error('Payment portal error:', error)
    return NextResponse.json(
      { error: 'Failed to load payment portal', details: error.message },
      { status: 500 }
    )
  }
})

export const POST = secureApiRoute(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const { userId, planId, paymentMethod } = body

    if (!userId || !planId || !paymentMethod) {
      return NextResponse.json(
        { error: 'User ID, plan ID, and payment method are required' },
        { status: 400 }
      )
    }

    await userTierSystem.initialize()

    // Get plan details
    const plans = {
      premium: { price: 29.99, name: 'Premium' },
      enterprise: { price: 99.99, name: 'Enterprise' }
    }

    const plan = plans[planId as keyof typeof plans]
    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 })
    }

    // Create subscription
    const subscription = await userTierSystem.createSubscription(
      userId,
      planId,
      paymentMethod,
      plan.price
    )

    // In a real implementation, you would integrate with payment providers here
    // For now, we'll simulate successful payment
    await userTierSystem.upgradeToPremium(userId, 'payment')

    return NextResponse.json({
      success: true,
      data: {
        subscription,
        message: `Successfully upgraded to ${plan.name} plan!`,
        redirectUrl: '/dashboard?upgrade=success'
      }
    })

  } catch (error: any) {
    console.error('Subscription creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create subscription', details: error.message },
      { status: 500 }
    )
  }
})
