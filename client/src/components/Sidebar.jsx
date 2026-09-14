import { useTheme } from '../context/ThemeContext'

const navItems = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    key: 'inventory',
    label: 'Inventory',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    key: 'billing',
    label: 'Billing',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    key: 'members',
    label: 'Members',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
]

function NavButton({ item, isActive, isDark, onClick, isAdmin }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer relative group ${
        isActive
          ? isDark ? 'text-white' : 'text-indigo-700'
          : isDark ? 'text-zinc-500 hover:text-zinc-200' : 'text-gray-500 hover:text-gray-900'
      }`}
    >
      {isActive && (
        <span className={`absolute inset-0 rounded-xl ${
          isDark
            ? 'bg-gradient-to-r from-indigo-500/[0.18] to-violet-500/[0.08] border border-white/[0.08]'
            : 'bg-indigo-50 border border-indigo-100'
        }`} />
      )}
      {!isActive && (
        <span className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity ${
          isDark ? 'bg-white/[0.04]' : 'bg-gray-100'
        }`} />
      )}
      <span className={`relative z-10 shrink-0 ${isActive ? isDark ? 'text-indigo-400' : 'text-indigo-600' : ''}`}>
        {item.icon}
      </span>
      <span className="relative z-10">{item.label}</span>
      {item.key === 'members' && isAdmin && (
        <span className={`relative z-10 ml-auto text-xs px-1.5 py-0.5 rounded-full ${
          isDark ? 'bg-indigo-500/15 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
        }`}>Admin</span>
      )}
    </button>
  )
}

function Brand({ orgInfo, isDark, initial }) {
  return (
    <div className="flex items-center gap-2.5">
      {orgInfo?.logo ? (
        <img src={orgInfo.logo} alt="Logo" className="w-8 h-8 rounded-xl object-contain bg-white p-0.5 ring-1 ring-black/10" />
      ) : (
        <img src="/bm.png" alt="Bilz Manager" className="w-8 h-8 rounded-xl object-contain shrink-0" />
      )}
      <span className={`font-bold text-base tracking-tight truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {orgInfo?.name || 'Bilz Manager'}
      </span>
    </div>
  )
}

export default function Sidebar({ currentPage, setCurrentPage, onLogout, orgInfo, currentUser, menuOpen, setMenuOpen }) {
  const { isDark } = useTheme()
  const initial = orgInfo?.name ? orgInfo.name.charAt(0).toUpperCase() : 'B'
  const isAdmin = currentUser?.role === 'admin'

  const navigate = (key) => {
    setCurrentPage(key)
    setMenuOpen(false)
  }

  const sidebarBg = isDark
    ? 'bg-zinc-950/90 backdrop-blur-2xl border-r border-white/[0.07]'
    : 'bg-white/80 backdrop-blur-xl border-r border-black/[0.05] shadow-[1px_0_24px_rgba(0,0,0,0.06)]'

  const divider = isDark ? 'border-white/[0.05]' : 'border-black/[0.04]'

  const userBadge = isDark ? 'bg-white/[0.03]' : 'bg-gray-50/80'

  return (
    <>
      {/* ── Desktop Sidebar ─────────────────────────────────── */}
      <aside className={`hidden lg:flex flex-col w-64 shrink-0 print:hidden relative ${sidebarBg}`}>
        {isDark && (
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-indigo-600/[0.06] to-transparent pointer-events-none rounded-tr-xl" />
        )}

        {/* Brand */}
        <div className={`h-16 flex items-center px-5 shrink-0 border-b ${divider}`}>
          <Brand orgInfo={orgInfo} isDark={isDark} initial={initial} />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(item => (
            <NavButton
              key={item.key}
              item={item}
              isActive={currentPage === item.key}
              isDark={isDark}
              isAdmin={isAdmin}
              onClick={() => navigate(item.key)}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className={`p-3 space-y-0.5 shrink-0 border-t ${divider}`}>
          {currentUser && (
            <div className={`px-3 py-2.5 mb-1 rounded-xl ${userBadge}`}>
              <p className={`text-xs truncate font-medium ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                {currentUser.email}
              </p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${
                isAdmin
                  ? isDark ? 'bg-indigo-500/15 text-indigo-400' : 'bg-indigo-50 text-indigo-700'
                  : isDark ? 'bg-white/[0.06] text-zinc-400' : 'bg-gray-100 text-gray-600'
              }`}>
                {isAdmin ? 'Admin' : 'Member'}
              </span>
            </div>
          )}
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
              isDark
                ? 'text-zinc-600 hover:bg-red-500/10 hover:text-red-400'
                : 'text-gray-500 hover:bg-red-50 hover:text-red-600'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* ── Mobile Drawer ─────────────────────────────────────── */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 print:hidden ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />

        {/* Drawer panel */}
        <div className={`absolute left-0 top-0 h-full w-72 max-w-[85vw] flex flex-col transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full'} ${
          isDark
            ? 'bg-zinc-950/95 backdrop-blur-2xl border-r border-white/[0.08]'
            : 'bg-white/95 backdrop-blur-xl border-r border-black/[0.06] shadow-2xl'
        }`}>
          {isDark && (
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-indigo-600/[0.08] to-transparent pointer-events-none" />
          )}

          <div className={`h-16 flex items-center justify-between px-5 shrink-0 border-b ${divider}`}>
            <Brand orgInfo={orgInfo} isDark={isDark} initial={initial} />
            <button
              onClick={() => setMenuOpen(false)}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isDark ? 'text-zinc-500 hover:text-white hover:bg-white/[0.06]' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
            {navItems.map(item => (
              <NavButton
                key={item.key}
                item={item}
                isActive={currentPage === item.key}
                isDark={isDark}
                isAdmin={isAdmin}
                onClick={() => navigate(item.key)}
              />
            ))}
          </nav>

          <div className={`p-3 space-y-0.5 shrink-0 border-t ${divider}`}>
            {currentUser && (
              <div className={`px-3 py-2.5 mb-2 rounded-xl ${userBadge}`}>
                <p className={`text-xs truncate font-medium ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>{currentUser.email}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${
                  isAdmin
                    ? isDark ? 'bg-indigo-500/15 text-indigo-400' : 'bg-indigo-50 text-indigo-700'
                    : isDark ? 'bg-white/[0.06] text-zinc-400' : 'bg-gray-100 text-gray-600'
                }`}>
                  {isAdmin ? 'Admin' : 'Member'}
                </span>
              </div>
            )}
            <button
              onClick={onLogout}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                isDark ? 'text-zinc-600 hover:bg-red-500/10 hover:text-red-400' : 'text-gray-500 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Bottom Tab Bar — Liquid Glass Pill ──────────── */}
      <nav className={`lg:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-0.5 px-2 py-2 rounded-[22px] print:hidden ${
        isDark
          ? 'bg-zinc-900/75 backdrop-blur-2xl border border-white/[0.13] shadow-[0_8px_48px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.06)]'
          : 'bg-white/80 backdrop-blur-xl border border-black/[0.07] shadow-[0_8px_40px_rgba(0,0,0,0.14),inset_0_1px_0_rgba(255,255,255,0.9)]'
      }`}>
        {navItems.map(item => {
          const isActive = currentPage === item.key
          return (
            <button
              key={item.key}
              onClick={() => setCurrentPage(item.key)}
              title={item.label}
              className={`relative flex flex-col items-center justify-center w-12 h-11 rounded-[16px] transition-all duration-200 cursor-pointer ${
                isActive
                  ? isDark ? 'text-white' : 'text-indigo-700'
                  : isDark ? 'text-zinc-500 active:text-zinc-300' : 'text-gray-400 active:text-gray-700'
              }`}
            >
              {isActive && (
                <span className={`absolute inset-0 rounded-[16px] ${
                  isDark
                    ? 'bg-gradient-to-b from-indigo-500/30 to-indigo-600/20 border border-indigo-500/25 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
                    : 'bg-indigo-50 border border-indigo-200/70'
                }`} />
              )}
              <span className={`relative z-10 ${isActive ? isDark ? 'text-indigo-400' : 'text-indigo-600' : ''}`}>
                {item.icon}
              </span>
              {isActive && (
                <span className={`absolute bottom-1.5 w-1 h-1 rounded-full ${isDark ? 'bg-indigo-400' : 'bg-indigo-500'}`} />
              )}
            </button>
          )
        })}
      </nav>
    </>
  )
}
