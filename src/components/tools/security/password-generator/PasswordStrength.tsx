'use client'

import { Shield, AlertCircle, CheckCircle } from 'lucide-react'

interface PasswordStrengthProps {
  password: string
}

interface StrengthResult {
  score: number
  label: string
  color: string
  width: string
  feedback: string[]
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const calculateStrength = (pwd: string): StrengthResult => {
    if (!pwd) {
      return {
        score: 0,
        label: 'None',
        color: 'bg-gray-300',
        width: '0%',
        feedback: ['Enter a password to check strength']
      }
    }

    let score = 0
    const feedback: string[] = []

    // Length checks
    if (pwd.length >= 8) score++
    if (pwd.length >= 12) score++
    if (pwd.length >= 16) score++
    
    if (pwd.length < 8) {
      feedback.push('Use at least 8 characters')
    } else if (pwd.length < 12) {
      feedback.push('Consider using 12+ characters for better security')
    }

    // Character variety checks
    if (/[A-Z]/.test(pwd)) score++
    if (/[a-z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++

    if (!/[A-Z]/.test(pwd)) feedback.push('Add uppercase letters (A-Z)')
    if (!/[a-z]/.test(pwd)) feedback.push('Add lowercase letters (a-z)')
    if (!/[0-9]/.test(pwd)) feedback.push('Add numbers (0-9)')
    if (!/[^A-Za-z0-9]/.test(pwd)) feedback.push('Add symbols (!@#$)')

    // Common pattern checks
    if (/(.)\1{2,}/.test(pwd)) {
      score--
      feedback.push('Avoid repeated characters')
    }
    if (/12345|qwerty|password/i.test(pwd)) {
      score = Math.max(0, score - 2)
      feedback.push('Avoid common patterns and words')
    }

    const strengths = [
      { label: 'Very Weak', color: 'bg-red-400', width: '20%' },
      { label: 'Weak', color: 'bg-orange-400', width: '40%' },
      { label: 'Fair', color: 'bg-yellow-400', width: '60%' },
      { label: 'Good', color: 'bg-lime-400', width: '80%' },
      { label: 'Strong', color: 'bg-green-500', width: '95%' },
      { label: 'Very Strong', color: 'bg-emerald-500', width: '100%' }
    ]

    const result = strengths[Math.min(Math.max(score, 0), strengths.length - 1)]
    
    return {
      ...result,
      score,
      feedback: feedback.length > 0 ? feedback : ['Great! Your password looks strong']
    }
  }

  const strength = calculateStrength(password)

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-gray-700" />
          <span className="text-sm font-medium text-gray-700">Password Strength</span>
        </div>
        <span className={`text-sm font-semibold ${strength.color.replace('bg-', 'text-')}`}>
          {strength.label}
        </span>
      </div>
      
      {/* Strength Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div 
          className={`h-3 rounded-full ${strength.color} transition-all duration-500 shadow-sm`}
          style={{ width: strength.width }}
        ></div>
      </div>

      {/* Feedback */}
      <div className="space-y-2">
        {strength.feedback.map((item, index) => (
          <div key={index} className="flex items-center space-x-2 text-sm">
            {strength.score >= 4 ? (
              <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
            )}
            <span className="text-gray-600">{item}</span>
          </div>
        ))}
      </div>

      {/* Additional Metrics */}
      {password && (
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-emerald-200">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{password.length}</div>
            <div className="text-xs text-gray-500">Length</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">
              {new Set(password.split('')).size}
            </div>
            <div className="text-xs text-gray-500">Unique</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">
              {[
                /[A-Z]/.test(password),
                /[a-z]/.test(password),
                /[0-9]/.test(password),
                /[^A-Za-z0-9]/.test(password)
              ].filter(Boolean).length}
            </div>
            <div className="text-xs text-gray-500">Char Types</div>
          </div>
        </div>
      )}
    </div>
  )
}