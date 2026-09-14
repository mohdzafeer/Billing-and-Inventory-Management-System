import { useTheme } from '../context/ThemeContext'

const iconBgsDark = {
  indigo: 'rgba(99,102,241,0.12)',
  violet: 'rgba(139,92,246,0.12)',
  emerald: 'rgba(16,185,129,0.12)',
  amber: 'rgba(245,158,11,0.12)',
}

const iconBgsLight = {
  indigo: '#eef2ff',
  violet: '#f5f3ff',
  emerald: '#ecfdf5',
  amber: '#fffbeb',
}

export default function StatCard({ title, value, subtitle, icon, accent = 'indigo' }) {
  const { isDark } = useTheme()

  const iconBg = isDark ? iconBgsDark[accent] || iconBgsDark.indigo : iconBgsLight[accent] || iconBgsLight.indigo

  return (
    <div className={`rounded-xl border p-5 flex items-center gap-4 hover:shadow-sm transition-all ${
      isDark
        ? 'bg-zinc-900 border-white/[0.07] hover:border-white/[0.12]'
        : 'bg-white border-gray-200 hover:border-gray-300'
    }`}>
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: iconBg }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className={`text-sm truncate ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>{title}</p>
        <p className={`text-2xl font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</p>
        {subtitle && (
          <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-600' : 'text-gray-400'}`}>{subtitle}</p>
        )}
      </div>
    </div>
  )
}
