'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Check, Star, Users, Zap, Crown, Building2, CreditCard, PayPal, Bitcoin, Bank } from 'lucide-react'

interface PaymentPortalProps {
  userId: string
  isVisible: boolean
  onClose: () => void
}

interface UserTier {
  tier: string
  jobAnalysisLimit: number
  jobAnalysisUsed: number
  remaining: number | string
  trialExpiresAt?: string
  subscriptionActive: boolean
}

interface Plan {
  id: string
  name: string
  price: number
  currency: string
  interval: string
  features: string[]
  highlighted: boolean
  current: boolean
}

interface PaymentMethod {
  id: string
  name: string
  description: string
  icon: string
  popular: boolean
}

export default function PaymentPortal({ userId, isVisible, onClose }: PaymentPortalProps) {
  const [loading, setLoading] = useState(true)
  const [userTier, setUserTier] = useState<UserTier | null>(null)
  const [plans, setPlans] = useState<Plan[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [selectedPlan, setSelectedPlan] = useState<string>('premium')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('stripe')
  const [referralStats, setReferralStats] = useState<any>(null)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (isVisible && userId) {
      fetchPaymentData()
    }
  }, [isVisible, userId])

  const fetchPaymentData = async () => {
    try {
      const response = await fetch(`/api/payment-portal?userId=${userId}`)
      const data = await response.json()
      
      if (data.success) {
        setUserTier(data.data.userTier)
        setPlans(data.data.plans)
        setPaymentMethods(data.data.paymentMethods)
        setReferralStats(data.data.referralStats)
      }
    } catch (error) {
      console.error('Failed to fetch payment data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async () => {
    setProcessing(true)
    try {
      const response = await fetch('/api/payment-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          planId: selectedPlan,
          paymentMethod: selectedPaymentMethod
        })
      })

      const data = await response.json()
      
      if (data.success) {
        // Redirect or show success message
        window.location.href = data.data.redirectUrl
      } else {
        console.error('Upgrade failed:', data.error)
      }
    } catch (error) {
      console.error('Upgrade error:', error)
    } finally {
      setProcessing(false)
    }
  }

  const getPaymentIcon = (iconName: string) => {
    switch (iconName) {
      case 'credit-card': return <CreditCard className="w-5 h-5" />
      case 'paypal': return <PayPal className="w-5 h-5" />
      case 'bank': return <Bank className="w-5 h-5" />
      case 'bitcoin': return <Bitcoin className="w-5 h-5" />
      default: return <CreditCard className="w-5 h-5" />
    }
  }

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free': return <Users className="w-6 h-6" />
      case 'premium': return <Crown className="w-6 h-6" />
      case 'enterprise': return <Building2 className="w-6 h-6" />
      default: return <Users className="w-6 h-6" />
    }
  }

  if (!isVisible) return null

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  const usagePercentage = userTier?.jobAnalysisLimit === -1 ? 100 : 
    (userTier?.jobAnalysisUsed / userTier?.jobAnalysisLimit) * 100

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Upgrade Your Plan</h2>
              <p className="text-gray-600">Unlock unlimited job analysis and premium features</p>
            </div>
            <Button variant="ghost" onClick={onClose}>×</Button>
          </div>
        </div>

        <div className="p-6">
          {/* Current Usage */}
          {userTier && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Current Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Job Analyses Used</span>
                      <span className="font-medium">
                        {userTier.jobAnalysisUsed} / {userTier.remaining}
                      </span>
                    </div>
                    <Progress value={usagePercentage} className="h-2" />
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <Badge variant={userTier.tier === 'premium' ? 'default' : 'secondary'}>
                      {userTier.tier.charAt(0).toUpperCase() + userTier.tier.slice(1)} Plan
                    </Badge>
                    {userTier.trialExpiresAt && (
                      <span className="text-gray-500">
                        Trial ends: {new Date(userTier.trialExpiresAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Referral Progress */}
          {referralStats && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Referral Program
                </CardTitle>
                <CardDescription>
                  Get 5 successful referrals to unlock Premium for free!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Successful Referrals</span>
                      <span className="font-medium">
                        {referralStats.successfulReferrals} / 5
                      </span>
                    </div>
                    <Progress value={(referralStats.successfulReferrals / 5) * 100} className="h-2" />
                  </div>
                  
                  {referralStats.referralCode && (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={referralStats.referralCode}
                        readOnly
                        className="flex-1 px-3 py-2 border rounded-lg bg-gray-50"
                      />
                      <Button variant="outline" size="sm">
                        Copy
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pricing Plans */}
          <Tabs defaultValue="plans" className="mb-6">
            <TabsList>
              <TabsTrigger value="plans">Choose Plan</TabsTrigger>
              <TabsTrigger value="payment">Payment Method</TabsTrigger>
            </TabsList>

            <TabsContent value="plans">
              <div className="grid md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <Card 
                    key={plan.id} 
                    className={`relative ${plan.highlighted ? 'border-blue-500 shadow-lg' : ''} ${plan.current ? 'opacity-75' : ''}`}
                  >
                    {plan.highlighted && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-blue-500">
                          <Star className="w-3 h-3 mr-1" />
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    
                    {plan.current && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge variant="secondary">Current Plan</Badge>
                      </div>
                    )}

                    <CardHeader className="text-center">
                      <div className="flex justify-center mb-2">
                        {getPlanIcon(plan.id)}
                      </div>
                      <CardTitle>{plan.name}</CardTitle>
                      <div className="text-3xl font-bold">
                        ${plan.price}
                        <span className="text-sm font-normal text-gray-500">/{plan.interval}</span>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <ul className="space-y-2 mb-4">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      
                      {!plan.current && (
                        <Button 
                          className="w-full" 
                          variant={plan.highlighted ? 'default' : 'outline'}
                          onClick={() => setSelectedPlan(plan.id)}
                        >
                          Select {plan.name}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="payment">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Choose Payment Method</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <Card 
                      key={method.id}
                      className={`cursor-pointer transition-all ${selectedPaymentMethod === method.id ? 'border-blue-500 bg-blue-50' : ''}`}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          {getPaymentIcon(method.icon)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{method.name}</h4>
                              {method.popular && <Badge variant="secondary">Popular</Badge>}
                            </div>
                            <p className="text-sm text-gray-500">{method.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Maybe Later
            </Button>
            <Button 
              onClick={handleUpgrade}
              disabled={processing || userTier?.tier === 'premium'}
              className="min-w-[120px]"
            >
              {processing ? 'Processing...' : 'Upgrade Now'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
