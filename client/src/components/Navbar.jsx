import { useTheme } from '../context/ThemeContext'

const pageNames = {
  dashboard: { title: 'Dashboard', subtitle: 'Overview of your business' },
  inventory: { title: 'Inventory', subtitle: 'Manage your products and stock' },
  billing: { title: 'New Bill', subtitle: 'Create and manage invoices' },
  settings: { title: 'Settings', subtitle: 'Configure your organization' },
  members: { title: 'Members', subtitle: 'Manage your team' },
}

export default function Navbar({ currentPage, orgInfo, currentUser, onMenuOpen }) {
  const { isDark, toggle } = useTheme()
  const page = pageNames[currentPage] || pageNames.dashboard
  const initial = currentUser?.organizationName?.charAt(0).toUpperCase() || 'A'

  return (
    <header className={`h-14 lg:h-16 flex items-center justify-between px-4 lg:px-6 shrink-0 print:hidden ${
      isDark ? 'bg-zinc-950/80 backdrop-blur-xl border-b border-white/[0.05]' : 'bg-white/80 backdrop-blur-xl border-b border-gray-200/60'
    }`}>
      <div className="flex items-center gap-3 min-w-0">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuOpen}
          className={`lg:hidden w-9 h-9 flex items-center justify-center rounded-xl transition-colors cursor-pointer shrink-0 ${
            isDark ? 'text-zinc-400 hover:bg-white/[0.06] hover:text-white' : 'text-gray-500 hover:bg-gray-100'
          }`}
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="min-w-0">
          <h1 className={`text-sm lg:text-base font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {page.title}
          </h1>
          <p className={`text-xs hidden sm:block ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
            {page.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-3 shrink-0">
        {orgInfo?.name && (
          <span className={`text-xs px-3 py-1 rounded-full font-medium hidden md:inline ${
            isDark ? 'text-zinc-400 bg-white/[0.06]' : 'text-gray-600 bg-gray-100'
          }`}>
            {orgInfo.name}
          </span>
        )}

        {/* Theme toggle */}
        <button
          onClick={toggle}
          className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all cursor-pointer ${
            isDark
              ? 'text-zinc-400 hover:bg-white/[0.06] hover:text-white'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? (
            <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
            </svg>
          ) : (
            <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold shrink-0"
          title={currentUser?.email || ''}
        >
          {initial}
        </div>
      </div>
    </header>
  )
}
