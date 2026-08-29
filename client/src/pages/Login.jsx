import { useState } from 'react'
import { authApi } from '../api/index'

export default function Login({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ organizationName: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (field, val) => {
    setError('')
    setForm(prev => ({ ...prev, [field]: val }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (mode === 'register' && !form.organizationName.trim()) {
      return setError('Organization name is required')
    }
    if (!form.email.trim() || !form.password.trim()) {
      return setError('Email and password are required')
    }

    setLoading(true)
    try {
      const data = mode === 'login'
        ? await authApi.login({ email: form.email, password: form.password })
        : await authApi.register(form)

      localStorage.setItem('biz_token', data.token)
      onLogin(data.token, data.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-2xl mb-4 shadow-lg shadow-indigo-500/30">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">BizManager</h1>
          <p className="text-slate-400 text-sm mt-1">Billing & Inventory Management</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Tab Toggle */}
          <div className="flex bg-white/5 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setMode('login'); setError('') }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer
                ${mode === 'login'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-slate-400 hover:text-white'
                }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('register'); setError('') }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer
                ${mode === 'register'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-slate-400 hover:text-white'
                }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1.5">
                  Organization / Shop Name
                </label>
                <input
                  type="text"
                  value={form.organizationName}
                  onChange={e => handleChange('organizationName', e.target.value)}
                  className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                  placeholder="e.g. ABC General Store"
                  autoFocus={mode === 'register'}
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-slate-300 block mb-1.5">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => handleChange('email', e.target.value)}
                className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                placeholder="you@example.com"
                autoFocus={mode === 'login'}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 block mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => handleChange('password', e.target.value)}
                className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-2.5 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:text-indigo-400 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors mt-2 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {loading
                ? (mode === 'login' ? 'Signing in...' : 'Creating account...')
                : (mode === 'login' ? 'Sign In' : 'Create Account')
              }
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
            className="text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
          >
            {mode === 'login' ? 'Register here' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
