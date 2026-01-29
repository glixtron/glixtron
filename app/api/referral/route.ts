/**
 * Referral System API - Handle referral codes and tracking
 */

import { NextRequest, NextResponse } from 'next/server'
import { userTierSystem } from '@/lib/user-tier-system'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    await userTierSystem.initialize()
    
    const referralStats = await userTierSystem.getReferralStats(userId)
    
    // Generate referral code if user doesn't have one
    if (!referralStats.referralCode) {
      const newCode = await userTierSystem.generateReferralCode(userId)
      referralStats.referralCode = newCode
    }

    return NextResponse.json({
      success: true,
      data: {
        ...referralStats,
        referralLink: `${process.env.NEXT_PUBLIC_APP_URL || 'https://glixtron.com'}?ref=${referralStats.referralCode}`,
        progress: {
          current: referralStats.successfulReferrals,
          required: 5,
          percentage: (referralStats.successfulReferrals / 5) * 100
        }
      }
    })

  } catch (error: any) {
    console.error('Referral stats error:', error)
    return NextResponse.json(
      { error: 'Failed to get referral stats', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, referralCode, userId, email } = body

    await userTierSystem.initialize()

    switch (action) {
      case 'validate':
        // Validate referral code during signup
        if (!referralCode) {
          return NextResponse.json({ error: 'Referral code required' }, { status: 400 })
        }

        const referral = await userTierSystem.processReferral(referralCode, userId, email)
        
        return NextResponse.json({
          success: true,
          data: {
            valid: referral,
            message: referral ? 'Referral code applied successfully!' : 'Invalid or expired referral code'
          }
        })

      case 'complete':
        // Mark referral as successful after user becomes active
        if (!referralCode) {
          return NextResponse.json({ error: 'Referral code required' }, { status: 400 })
        }

        const success = await userTierSystem.markReferralSuccessful(referralCode)
        
        return NextResponse.json({
          success: true,
          data: {
            success,
            message: success ? 'Referral marked as successful!' : 'Failed to update referral status'
          }
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error: any) {
    console.error('Referral action error:', error)
    return NextResponse.json(
      { error: 'Failed to process referral action', details: error.message },
      { status: 500 }
    )
  }
}
