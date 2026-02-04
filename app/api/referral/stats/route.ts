import { NextRequest, NextResponse } from 'next/server'

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

export async function GET(request: NextRequest) {
  try {
    // In a real implementation, you would fetch this from your database
    // For now, we'll return mock data
    const mockStats: ReferralStats = {
      totalReferrals: 15,
      successfulReferrals: 8,
      pendingReferrals: 7,
      totalEarnings: 245.50,
      currentMonthEarnings: 87.00,
      referralCode: 'CAREER2024',
      referralLink: 'https://glixtron.app/signup?ref=CAREER2024',
      tier: 'silver',
      nextTierProgress: 60,
      rewards: {
        signup: 10.00,
        firstPurchase: 25.00,
        monthlySubscription: 15.00,
        annualSubscription: 50.00
      }
    }

    const mockHistory: ReferralHistory[] = [
      {
        id: '1',
        referredEmail: 'john.doe@example.com',
        referredName: 'John Doe',
        status: 'completed',
        signupDate: '2024-01-15',
        completionDate: '2024-01-20',
        reward: 35.00,
        rewardType: 'purchase'
      },
      {
        id: '2',
        referredEmail: 'jane.smith@example.com',
        referredName: 'Jane Smith',
        status: 'pending',
        signupDate: '2024-01-18',
        reward: 0.00,
        rewardType: 'signup'
      },
      {
        id: '3',
        referredEmail: 'mike.johnson@example.com',
        referredName: 'Mike Johnson',
        status: 'completed',
        signupDate: '2024-01-10',
        completionDate: '2024-01-25',
        reward: 25.00,
        rewardType: 'subscription'
      }
    ]

    return NextResponse.json({
      success: true,
      data: {
        stats: mockStats,
        history: mockHistory
      }
    })
  } catch (error) {
    console.error('Referral stats error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch referral stats' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, referralData } = body

    switch (action) {
      case 'create_referral':
        // Create a new referral
        return NextResponse.json({
          success: true,
          data: {
            referralCode: 'NEWREF2024',
            referralLink: 'https://glixtron.app/signup?ref=NEWREF2024'
          }
        })

      case 'track_click':
        // Track referral link click
        return NextResponse.json({
          success: true,
          message: 'Click tracked successfully'
        })

      case 'update_tier':
        // Update user's referral tier
        return NextResponse.json({
          success: true,
          data: {
            newTier: 'gold',
            message: 'Tier updated successfully'
          }
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Referral action error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process referral action' },
      { status: 500 }
    )
  }
}
