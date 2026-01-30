/**
 * User Tier System with Job Analysis Limits and Referral Rewards
 */

import { MongoClient, Db } from 'mongodb'

export interface UserTier {
  id: string
  userId: string
  tier: 'free' | 'trial' | 'premium' | 'enterprise'
  jobAnalysisLimit: number
  jobAnalysisUsed: number
  referralCount: number
  successfulReferrals: number
  trialStartedAt?: Date
  trialExpiresAt?: Date
  subscriptionActive: boolean
  subscriptionId?: string
  paymentMethod?: string
  createdAt: Date
  updatedAt: Date
}

export interface Referral {
  id: string
  referrerId: string
  referredUserId?: string
  referredEmail: string
  referralCode: string
  status: 'pending' | 'registered' | 'successful'
  rewardClaimed: boolean
  createdAt: Date
  completedAt?: Date
}

export interface PaymentSubscription {
  id: string
  userId: string
  planId: string
  status: 'active' | 'cancelled' | 'expired' | 'pending'
  amount: number
  currency: string
  paymentMethod: 'stripe' | 'paypal' | 'razorpay' | 'crypto'
  subscriptionId: string
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UsageAnalytics {
  userId: string
  date: Date
  jobAnalyses: number
  jdExtractions: number
  resumeAnalyses: number
  apiCalls: number
}

class UserTierSystem {
  private db: Db
  private client: MongoClient

  constructor() {
    const mongoUri = process.env.MONGODB_URI
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is required')
    }
    
    this.client = new MongoClient(mongoUri)
    this.db = this.client.db('careerpath-pro')
  }

  async initialize() {
    await this.client.connect()
    
    // Create indexes for better performance
    await this.db.collection('user_tiers').createIndex({ userId: 1 }, { unique: true })
    await this.db.collection('referrals').createIndex({ referralCode: 1 }, { unique: true })
    await this.db.collection('referrals').createIndex({ referrerId: 1 })
    await this.db.collection('payments').createIndex({ userId: 1 })
    await this.db.collection('usage_analytics').createIndex({ userId: 1, date: 1 })
  }

  /**
   * Get or create user tier record
   */
  async getUserTier(userId: string): Promise<UserTier> {
    let userTier = await this.db.collection<UserTier>('user_tiers').findOne({ userId })
    
    if (!userTier) {
      // Create new user with free tier and 1-week trial
      const trialExpiresAt = new Date()
      trialExpiresAt.setDate(trialExpiresAt.getDate() + 7)
      
      const newUserTier: UserTier = {
        id: this.generateId(),
        userId,
        tier: 'trial',
        jobAnalysisLimit: 10,
        jobAnalysisUsed: 0,
        referralCount: 0,
        successfulReferrals: 0,
        trialStartedAt: new Date(),
        trialExpiresAt,
        subscriptionActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      await this.db.collection('user_tiers').insertOne(newUserTier)
      userTier = newUserTier
    }
    
    // Check if trial has expired
    if (userTier.tier === 'trial' && userTier.trialExpiresAt && new Date() > userTier.trialExpiresAt) {
      userTier.tier = 'free'
      userTier.jobAnalysisLimit = 10
      userTier.updatedAt = new Date()
      await this.db.collection('user_tiers').updateOne(
        { userId },
        { 
          $set: { 
            tier: 'free', 
            jobAnalysisLimit: 10, 
            updatedAt: new Date() 
          } 
        }
      )
    }
    
    return userTier
  }

  /**
   * Check if user can perform job analysis
   */
  async canPerformJobAnalysis(userId: string): Promise<{ allowed: boolean; remaining: number; tier: string }> {
    const userTier = await this.getUserTier(userId)
    
    // Unlimited for premium and enterprise
    if (userTier.tier === 'premium' || userTier.tier === 'enterprise') {
      return { allowed: true, remaining: -1, tier: userTier.tier }
    }
    
    // Check if user has reached limit
    const remaining = Math.max(0, userTier.jobAnalysisLimit - userTier.jobAnalysisUsed)
    
    return {
      allowed: remaining > 0,
      remaining,
      tier: userTier.tier
    }
  }

  /**
   * Record job analysis usage
   */
  async recordJobAnalysis(userId: string): Promise<void> {
    await this.db.collection('user_tiers').updateOne(
      { userId },
      { 
        $inc: { jobAnalysisUsed: 1 },
        $set: { updatedAt: new Date() }
      }
    )
    
    // Record usage analytics
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    await this.db.collection('usage_analytics').updateOne(
      { userId, date: today },
      { 
        $inc: { jobAnalyses: 1 },
        $set: { updatedAt: new Date() }
      },
      { upsert: true }
    )
  }

  /**
   * Generate referral code for user
   */
  async generateReferralCode(userId: string): Promise<string> {
    const code = this.generateReferralCodeString()
    
    await this.db.collection('referrals').insertOne({
      id: this.generateId(),
      referrerId: userId,
      referredEmail: '',
      referralCode: code,
      status: 'pending',
      rewardClaimed: false,
      createdAt: new Date()
    })
    
    return code
  }

  /**
   * Process referral signup
   */
  async processReferral(referralCode: string, newUserId: string, email: string): Promise<boolean> {
    const referral = await this.db.collection<Referral>('referrals').findOne({ 
      referralCode, 
      status: 'pending' 
    })
    
    if (!referral) {
      return false
    }
    
    // Update referral
    await this.db.collection('referrals').updateOne(
      { id: referral.id },
      { 
        $set: { 
          referredUserId: newUserId,
          referredEmail: email,
          status: 'registered',
          completedAt: new Date()
        }
      }
    )
    
    // Update referrer's count
    await this.db.collection('user_tiers').updateOne(
      { userId: referral.referrerId },
      { 
        $inc: { referralCount: 1 },
        $set: { updatedAt: new Date() }
      }
    )
    
    return true
  }

  /**
   * Mark referral as successful (after referred user becomes active)
   */
  async markReferralSuccessful(referralCode: string): Promise<boolean> {
    const referral = await this.db.collection<Referral>('referrals').findOne({ 
      referralCode, 
      status: 'registered' 
    })
    
    if (!referral || !referral.referredUserId) {
      return false
    }
    
    // Update referral status
    await this.db.collection('referrals').updateOne(
      { id: referral.id },
      { 
        $set: { 
          status: 'successful',
          completedAt: new Date()
        }
      }
    )
    
    // Update referrer's successful referrals
    const updateResult = await this.db.collection('user_tiers').updateOne(
      { userId: referral.referrerId },
      { 
        $inc: { successfulReferrals: 1 },
        $set: { updatedAt: new Date() }
      }
    )
    
    // Check if user qualifies for premium (5 successful referrals)
    const referrerTier = await this.getUserTier(referral.referrerId)
    if (referrerTier.successfulReferrals >= 5 && referrerTier.tier !== 'premium') {
      await this.upgradeToPremium(referral.referrerId, 'referral_reward')
    }
    
    return true
  }

  /**
   * Upgrade user to premium tier
   */
  async upgradeToPremium(userId: string, reason: string = 'payment'): Promise<void> {
    await this.db.collection('user_tiers').updateOne(
      { userId },
      { 
        $set: { 
          tier: 'premium',
          jobAnalysisLimit: -1, // Unlimited
          subscriptionActive: true,
          updatedAt: new Date()
        }
      }
    )
    
    console.log(`User ${userId} upgraded to premium (reason: ${reason})`)
  }

  /**
   * Create payment subscription
   */
  async createSubscription(
    userId: string, 
    planId: string, 
    paymentMethod: string,
    amount: number
  ): Promise<PaymentSubscription> {
    const subscription: PaymentSubscription = {
      id: this.generateId(),
      userId,
      planId,
      status: 'pending',
      amount,
      currency: 'USD',
      paymentMethod: paymentMethod as any,
      subscriptionId: this.generateSubscriptionId(),
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      cancelAtPeriodEnd: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    await this.db.collection('payments').insertOne(subscription)
    
    return subscription
  }

  /**
   * Get user's referral stats
   */
  async getReferralStats(userId: string): Promise<{
    totalReferrals: number
    successfulReferrals: number
    pendingReferrals: number
    referralCode?: string
  }> {
    const referrals = await this.db.collection<Referral>('referrals').find({ referrerId: userId }).toArray()
    const userTier = await this.getUserTier(userId)
    
    const referralCode = await this.db.collection<Referral>('referrals').findOne({ 
      referrerId: userId, 
      status: 'pending' 
    })
    
    return {
      totalReferrals: referrals.length,
      successfulReferrals: userTier.successfulReferrals,
      pendingReferrals: referrals.filter(r => r.status === 'pending').length,
      referralCode: referralCode?.referralCode
    }
  }

  /**
   * Get usage analytics for user
   */
  async getUsageAnalytics(userId: string, days: number = 30): Promise<UsageAnalytics[]> {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    return await this.db.collection<UsageAnalytics>('usage_analytics')
      .find({ 
        userId, 
        date: { $gte: startDate } 
      })
      .sort({ date: -1 })
      .toArray()
  }

  /**
   * Check if payment portal should be visible (after 1 week trial)
   */
  async shouldShowPaymentPortal(userId: string): Promise<boolean> {
    const userTier = await this.getUserTier(userId)
    
    // Show payment portal if:
    // 1. Trial has expired and user is still on free tier
    // 2. User has used 80% of their free limit
    // 3. User explicitly requested to see plans
    
    const trialExpired = userTier.tier === 'free' && 
                       (!userTier.trialExpiresAt || new Date() > userTier.trialExpiresAt)
    
    const nearLimit = userTier.jobAnalysisUsed >= Math.floor(userTier.jobAnalysisLimit * 0.8)
    
    return trialExpired || nearLimit || userTier.tier === 'free'
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  private generateReferralCodeString(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  private generateSubscriptionId(): string {
    return 'sub_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  async close() {
    await this.client.close()
  }
}

export const userTierSystem = new UserTierSystem()
