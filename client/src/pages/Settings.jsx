import { useState } from 'react'
import { settingsApi } from '../api/index'

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="font-semibold text-gray-900 mb-5">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 block mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  )
}

export default function Settings({ orgInfo, setOrgInfo }) {
  const [form, setForm] = useState({ ...orgInfo })
  const [logoPreview, setLogoPreview] = useState(orgInfo.logo)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field, value) => {
    setSaved(false)
    setError('')
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setLogoPreview(ev.target.result)
      setForm(prev => ({ ...prev, logo: ev.target.result }))
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveLogo = () => {
    setLogoPreview(null)
    setForm(prev => ({ ...prev, logo: null }))
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    setError('')
    try {
      const updated = await settingsApi.update(form)
      setOrgInfo({
        name: updated.name || '',
        tagline: updated.tagline || '',
        address: updated.address || '',
        phone: updated.phone || '',
        email: updated.email || '',
        ownerName: updated.ownerName || '',
        logo: updated.logo || null,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow'

  return (
    <div className="p-6">
      <div className="max-w-2xl space-y-5">
        {/* Organization Details */}
        <Section title="Organization Details">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Logo</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                {logoPreview ? (
                  <img src={logoPreview} alt="Organization logo" className="w-full h-full object-contain p-1" />
                ) : (
                  <svg className="w-9 h-9 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <div className="space-y-2">
                <label className="inline-block cursor-pointer bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-sm px-4 py-2 rounded-lg transition-colors font-medium">
                  {logoPreview ? 'Change Logo' : 'Upload Logo'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                </label>
                {logoPreview && (
                  <button
                    onClick={handleRemoveLogo}
                    className="block text-sm text-red-500 hover:text-red-600 font-medium cursor-pointer"
                  >
                    Remove
                  </button>
                )}
                <p className="text-xs text-gray-400">PNG, JPG. Appears on invoices.</p>
              </div>
            </div>
          </div>

          <Field label="Organization / Shop Name" required>
            <input
              type="text"
              value={form.name}
              onChange={e => handleChange('name', e.target.value)}
              className={inputClass}
              placeholder="e.g. ABC General Store"
            />
          </Field>

          <Field label="Tagline / Description">
            <input
              type="text"
              value={form.tagline}
              onChange={e => handleChange('tagline', e.target.value)}
              className={inputClass}
              placeholder="e.g. Quality you can trust"
            />
          </Field>

          <Field label="Address">
            <textarea
              value={form.address}
              onChange={e => handleChange('address', e.target.value)}
              className={`${inputClass} resize-none`}
              rows={3}
              placeholder="Street, Area, City, Province"
            />
          </Field>
        </Section>

        {/* Contact Details */}
        <Section title="Contact Details">
          <Field label="Phone Number">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </span>
              <input
                type="tel"
                value={form.phone}
                onChange={e => handleChange('phone', e.target.value)}
                className={`${inputClass} pl-9`}
                placeholder="+92 300 0000000"
              />
            </div>
          </Field>

          <Field label="Business Email">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <input
                type="email"
                value={form.email}
                onChange={e => handleChange('email', e.target.value)}
                className={`${inputClass} pl-9`}
                placeholder="info@yourshop.com"
              />
            </div>
          </Field>
        </Section>

        {/* Owner Information */}
        <Section title="Owner Information">
          <Field label="Owner Name">
            <input
              type="text"
              value={form.ownerName}
              onChange={e => handleChange('ownerName', e.target.value)}
              className={inputClass}
              placeholder="Full name"
            />
          </Field>
        </Section>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-xl">
            {error}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer disabled:cursor-not-allowed
            ${saved
              ? 'bg-emerald-500 text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white'
            }`}
        >
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving...
            </span>
          ) : saved ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Saved Successfully
            </span>
          ) : (
            'Save Settings'
          )}
        </button>
      </div>
    </div>
  )
}
