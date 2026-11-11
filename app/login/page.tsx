'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/neon-auth'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function continueWithGoogle() {
    setLoading(true)
    setError('')
    try {
      const result = await authClient.signIn.social({ provider: 'google', callbackURL: '/login' })
      if (result.error) throw result.error
    } catch (error) {
      console.error('[v0] Google OAuth failed:', error)
      setLoading(false)
      setError('Google লগইন সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।')
    }
  }

  return <main className="login-screen"><div className="login-brand"><div className="login-mark">K</div><h1>Kukie</h1><p>মানুষের সাথে যুক্ত থাকুন</p></div><section className="login-card"><h2>স্বাগতম</h2><p>চালিয়ে যেতে আপনার Google অ্যাকাউন্ট ব্যবহার করুন</p><button className="google-login-button" onClick={continueWithGoogle} disabled={loading}><span className="google-g">G</span>{loading ? 'Google খুলছে...' : 'Continue with Google'}</button>{error && <p className="login-error" role="alert">{error}</p>}<small>চালিয়ে যাওয়ার মাধ্যমে আপনি আমাদের পরিষেবার শর্তাবলী এবং গোপনীয়তা নীতিতে সম্মত হচ্ছেন।</small></section></main>
}
