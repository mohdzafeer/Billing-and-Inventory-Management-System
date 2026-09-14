import { useState, useEffect } from 'react'
import { membersApi } from '../api/index'
import { useTheme } from '../context/ThemeContext'

export default function Members({ currentUser }) {
  const { isDark } = useTheme()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [adding, setAdding] = useState(false)
  const [formError, setFormError] = useState('')
  const [toast, setToast] = useState(null)
  const [removing, setRemoving] = useState(null)

  const isAdmin = currentUser?.role === 'admin'

  useEffect(() => {
    membersApi.getAll()
      .then(setMembers)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const showToast = (type, msg, extra) => {
    setToast({ type, msg, ...extra })
    if (type === 'success') setTimeout(() => setToast(null), 6000)
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!form.email.trim()) return setFormError('Email is required')
    if (!form.password) return setFormError('Password is required')
    if (form.password.length < 6) return setFormError('Password must be at least 6 characters')

    setAdding(true)
    try {
      const { member, emailSent, emailError } = await membersApi.add({
        email: form.email.trim(),
        password: form.password,
      })
      setMembers(prev => [member, ...prev])
      setShowModal(false)
      setForm({ email: '', password: '' })

      if (emailSent) {
        showToast('success', `${member.email} added. Invitation email sent successfully.`)
      } else {
        showToast('warn', `${member.email} added, but email could not be sent.`, {
          credentials: { email: member.email, password: form.password },
          emailError,
        })
      }
    } catch (err) {
      setFormError(err.message)
    } finally {
      setAdding(false)
    }
  }

  const handleRemove = async (id, email) => {
    if (!window.confirm(`Remove ${email} from your organization?`)) return
    setRemoving(id)
    try {
      await membersApi.remove(id)
      setMembers(prev => prev.filter(m => m._id !== id))
    } catch (err) {
      alert(err.message)
    } finally {
      setRemoving(null)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setForm({ email: '', password: '' })
    setFormError('')
    setShowPassword(false)
  }

  const card = isDark ? 'bg-zinc-900 border-white/[0.06]' : 'bg-white border-gray-200'
  const sectionHead = isDark ? 'bg-zinc-800/50 border-white/[0.06] text-zinc-500' : 'bg-gray-50 border-gray-100 text-gray-500'
  const titleCl = isDark ? 'text-white' : 'text-gray-900'
  const subCl = isDark ? 'text-zinc-500' : 'text-gray-500'
  const inputCl = isDark
    ? 'bg-zinc-800 border-white/[0.08] text-white placeholder-zinc-600 focus:ring-indigo-500 focus:border-transparent'
    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-indigo-500 focus:border-transparent'

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold ${titleCl}`}>Team Members</h1>
          <p className={`text-sm mt-0.5 ${subCl}`}>
            {isAdmin ? 'Manage who has access to your organization.' : 'People in your organization.'}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Member
          </button>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className={`rounded-xl px-5 py-4 flex gap-3 ${toast.type === 'success'
          ? isDark ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'
          : isDark ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'
        }`}>
          <div className={`mt-0.5 shrink-0 ${toast.type === 'success' ? 'text-emerald-500' : 'text-amber-500'}`}>
            {toast.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${toast.type === 'success'
              ? isDark ? 'text-emerald-400' : 'text-emerald-800'
              : isDark ? 'text-amber-400' : 'text-amber-800'
            }`}>
              {toast.msg}
            </p>
            {toast.credentials && (
              <div className={`mt-2 text-xs space-y-1 ${isDark ? 'text-amber-500' : 'text-amber-700'}`}>
                <p>Share these credentials manually with the new member:</p>
                <div className={`rounded-lg px-3 py-2 font-mono space-y-1 mt-1 ${
                  isDark ? 'bg-zinc-800 border border-white/[0.06]' : 'bg-white border border-amber-200'
                }`}>
                  <p><span className="font-semibold">Email:</span> {toast.credentials.email}</p>
                  <p><span className="font-semibold">Password:</span> {toast.credentials.password}</p>
                </div>
                {toast.emailError && (
                  <p className={`mt-1 ${isDark ? 'text-amber-600' : 'text-amber-600'}`}>Reason: {toast.emailError}</p>
                )}
              </div>
            )}
          </div>
          <button onClick={() => setToast(null)} className={`shrink-0 cursor-pointer ${isDark ? 'text-zinc-600 hover:text-zinc-400' : 'text-gray-400 hover:text-gray-600'}`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Admin card */}
      <div className={`rounded-xl border overflow-hidden ${card}`}>
        <div className={`px-5 py-3 border-b ${sectionHead}`}>
          <h2 className="text-xs font-semibold uppercase tracking-wide">Organization Admin</h2>
        </div>
        <div className="px-5 py-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {currentUser?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold truncate ${titleCl}`}>{currentUser?.email || '—'}</p>
            <p className={`text-xs mt-0.5 ${subCl}`}>{currentUser?.organizationName || 'Organization'}</p>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
            isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-700'
          }`}>
            Admin
          </span>
        </div>
      </div>

      {/* Members list */}
      <div className={`rounded-xl border overflow-hidden ${card}`}>
        <div className={`px-5 py-3 border-b flex items-center justify-between ${sectionHead}`}>
          <h2 className="text-xs font-semibold uppercase tracking-wide">Members</h2>
          <span className={`text-xs ${isDark ? 'text-zinc-600' : 'text-gray-400'}`}>{members.length} member{members.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <svg className="w-6 h-6 animate-spin text-indigo-500 mx-auto" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : members.length === 0 ? (
          <div className="py-16 text-center">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`}>
              <svg className={`w-7 h-7 ${isDark ? 'text-zinc-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className={`text-sm font-medium ${subCl}`}>No members yet</p>
            {isAdmin && (
              <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-600' : 'text-gray-400'}`}>
                Click "Add Member" to invite someone to your organization.
              </p>
            )}
          </div>
        ) : (
          <div className={`divide-y ${isDark ? 'divide-white/[0.04]' : 'divide-gray-50'}`}>
            {members.map((member) => (
              <div key={member._id} className={`flex items-center gap-4 px-5 py-4 transition-colors ${isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-gray-50'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                  isDark ? 'bg-violet-500/10 text-violet-400' : 'bg-violet-100 text-violet-700'
                }`}>
                  {member.email.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${titleCl}`}>{member.email}</p>
                  <p className={`text-xs mt-0.5 ${subCl}`}>
                    Added {new Date(member.createdAt).toLocaleDateString('en-PK', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${
                  isDark ? 'bg-white/[0.05] text-zinc-400' : 'bg-gray-100 text-gray-600'
                }`}>
                  Member
                </span>
                {isAdmin && (
                  <button
                    onClick={() => handleRemove(member._id, member.email)}
                    disabled={removing === member._id}
                    className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed shrink-0 ${
                      isDark ? 'text-zinc-700 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-300 hover:text-red-400 hover:bg-red-50'
                    }`}
                    title="Remove member"
                  >
                    {removing === member._id ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div
            className={`rounded-2xl shadow-2xl w-full max-w-md ${isDark ? 'bg-zinc-900 border border-white/[0.08]' : 'bg-white'}`}
            onClick={e => e.stopPropagation()}
          >
            <div className={`px-6 py-5 border-b flex items-center justify-between ${isDark ? 'border-white/[0.06]' : 'border-gray-100'}`}>
              <h2 className={`font-semibold text-lg ${titleCl}`}>Add New Member</h2>
              <button onClick={closeModal} className={`cursor-pointer ${isDark ? 'text-zinc-600 hover:text-zinc-400' : 'text-gray-400 hover:text-gray-600'}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className={`text-sm font-medium block mb-1.5 ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
                  Member's Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setFormError('') }}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${inputCl}`}
                  placeholder="member@example.com"
                  autoFocus
                />
              </div>

              <div>
                <label className={`text-sm font-medium block mb-1.5 ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
                  Set Password for Member
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setFormError('') }}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 pr-10 ${inputCl}`}
                    placeholder="Min. 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer ${isDark ? 'text-zinc-600 hover:text-zinc-400' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className={`text-xs mt-1.5 ${isDark ? 'text-zinc-600' : 'text-gray-400'}`}>
                  An invitation email with these credentials will be sent to the member.
                </p>
              </div>

              {formError && (
                <div className={`text-sm px-4 py-2.5 rounded-xl ${
                  isDark ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                  {formError}
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className={`flex-1 border py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    isDark ? 'border-white/[0.08] text-zinc-400 hover:bg-white/[0.04]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adding}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {adding && (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  {adding ? 'Adding...' : 'Add & Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
