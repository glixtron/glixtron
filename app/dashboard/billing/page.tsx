'use client'

import { useState, useEffect } from 'react'
import StatCard from '@/components/StatCard'
import ActionCard from '@/components/ActionCard'
import ChartCard from '@/components/ChartCard'
import { 
  CreditCard, 
  CheckCircle, 
  X, 
  Zap, 
  Crown, 
  Sparkles,
  TrendingUp,
  Users,
  FileText,
  Shield,
  HeadphonesIcon as Headphones,
  ArrowRight
} from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started with career assessment',
    features: [
      '5 Resume Scans per month',
      'Basic Career Assessment',
      'Email Support',
      'Basic Analytics',
      'Mobile App Access'
    ],
    notIncluded: [
      'Advanced AI Analysis',
      'Priority Support',
      'Custom Reports',
      'API Access'
    ],
    color: 'from-slate-500 to-slate-600',
    buttonText: 'Current Plan',
    disabled: true,
    popular: false
  },
  {
    name: 'Professional',
    price: '$29',
    period: 'per month',
    description: 'Ideal for serious job seekers and career changers',
    features: [
      'Unlimited Resume Scans',
      'Advanced Career Assessment',
      'AI-Powered Job Matching',
      'Priority Email Support',
      'Advanced Analytics',
      'Custom Reports',
      'Interview Preparation',
      'Salary Negotiation Tips'
    ],
    notIncluded: [
      'Phone Support',
      'Custom Integrations',
      'White Label Options'
    ],
    color: 'from-blue-500 to-blue-600',
    buttonText: 'Upgrade to Professional',
    disabled: false,
    popular: true
  },
  {
    name: 'Enterprise',
    price: '$99',
    period: 'per month',
    description: 'Complete solution for teams and agencies',
    features: [
      'Everything in Professional',
      'Unlimited Team Members',
      'Phone & Email Support',
      'Custom Integrations',
      'White Label Options',
      'API Access',
      'Dedicated Account Manager',
      'Custom Training Sessions',
      'SLA Guarantee'
    ],
    notIncluded: [],
    color: 'from-purple-500 to-purple-600',
    buttonText: 'Contact Sales',
    disabled: false,
    popular: false
  }
]

export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState('Starter')
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [isLoading, setIsLoading] = useState(false)

  const handleUpgrade = async (planName: string) => {
    try {
      setIsLoading(true)
      // In a real app, this would integrate with Stripe or payment provider
      console.log(`Upgrading to ${planName} plan`)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSelectedPlan(planName)
    } catch (error) {
      console.error('Upgrade failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getFeatureIcon = (feature: string) => {
    if (feature.includes('Resume')) return FileText
    if (feature.includes('Support') || feature.includes('Phone')) return Headphones
    if (feature.includes('Analytics') || feature.includes('Reports')) return TrendingUp
    if (feature.includes('API') || feature.includes('Integrations')) return Shield
    if (feature.includes('Team')) return Users
    return CheckCircle
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Subscription & Payments
        </h1>
        <p className="text-slate-400">Manage your subscription and payment methods</p>
      </div>

      {/* Current Plan Status */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Current Plan</h2>
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-lg font-medium text-white">{selectedPlan} Plan</p>
                <p className="text-slate-400 text-sm">
                  {selectedPlan === 'Starter' ? 'Free forever' : selectedPlan === 'Professional' ? '$29/month' : '$99/month'}
                </p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-sm mb-1">Next billing date</p>
            <p className="text-white font-medium">February 1, 2024</p>
          </div>
        </div>
      </div>

      {/* Billing Cycle Toggle */}
      <div className="flex justify-center">
        <div className="bg-slate-800/50 rounded-lg p-1 flex">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              billingCycle === 'monthly'
                ? 'bg-blue-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              billingCycle === 'yearly'
                ? 'bg-blue-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Yearly (Save 20%)
          </button>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`
              relative bg-slate-900/80 backdrop-blur-md border rounded-xl p-6 transition-all duration-300
              ${plan.popular 
                ? 'border-blue-500/50 shadow-glow-lg scale-105' 
                : 'border-slate-700/50 hover:border-slate-600/50 hover:shadow-glow'
              }
            `}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  MOST POPULAR
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${plan.color} flex items-center justify-center mx-auto mb-4`}>
                {plan.name === 'Starter' && <Zap className="h-6 w-6 text-white" />}
                {plan.name === 'Professional' && <Crown className="h-6 w-6 text-white" />}
                {plan.name === 'Enterprise' && <Sparkles className="h-6 w-6 text-white" />}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
              <p className="text-slate-400 text-sm mb-4">{plan.description}</p>
              <div className="flex items-baseline justify-center">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                <span className="text-slate-400 text-sm ml-1">{plan.period}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                {plan.features.map((feature, index) => {
                  const Icon = getFeatureIcon(feature)
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <Icon className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </div>
                  )
                })}
              </div>

              {plan.notIncluded.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-slate-700/50">
                  {plan.notIncluded.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3 opacity-50">
                      <X className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-500 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => handleUpgrade(plan.name)}
              disabled={plan.disabled || isLoading}
              className={`
                w-full mt-6 px-4 py-3 rounded-lg font-medium transition-all duration-200
                ${plan.disabled
                  ? 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
                  : `bg-gradient-to-r ${plan.color} text-white hover:shadow-glow hover:scale-105`
                }
                disabled:opacity-50
              `}
            >
              {isLoading ? 'Processing...' : plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      {/* Payment Methods */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Payment Methods</h2>
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">•••• •••• •••• 4242</p>
                  <p className="text-slate-400 text-sm">Expires 12/24</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full">Default</span>
                <button className="text-slate-400 hover:text-white transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <button className="w-full p-4 border-2 border-dashed border-slate-700/50 rounded-lg text-slate-400 hover:text-white hover:border-slate-600/50 transition-colors">
              <div className="flex items-center justify-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Add Payment Method</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Billing History</h2>
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 hover:bg-slate-800/50 rounded-lg transition-colors">
              <div>
                <p className="text-white font-medium">Professional Plan</p>
                <p className="text-slate-400 text-sm">January 1, 2024 - January 31, 2024</p>
              </div>
              <div className="text-right">
                <p className="text-white font-medium">$29.00</p>
                <p className="text-green-400 text-sm">Paid</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 hover:bg-slate-800/50 rounded-lg transition-colors">
              <div>
                <p className="text-white font-medium">Professional Plan</p>
                <p className="text-slate-400 text-sm">December 1, 2023 - December 31, 2023</p>
              </div>
              <div className="text-right">
                <p className="text-white font-medium">$29.00</p>
                <p className="text-green-400 text-sm">Paid</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
