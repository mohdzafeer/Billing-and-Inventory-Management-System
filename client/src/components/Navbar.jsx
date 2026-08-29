const pageNames = {
  dashboard: { title: 'Dashboard', subtitle: 'Overview of your business' },
  inventory: { title: 'Inventory', subtitle: 'Manage your products and stock' },
  billing: { title: 'New Bill', subtitle: 'Create and manage invoices' },
  settings: { title: 'Settings', subtitle: 'Configure your organization' },
}

export default function Navbar({ currentPage, orgInfo, currentUser }) {
  const page = pageNames[currentPage] || pageNames.dashboard
  const initial = currentUser?.organizationName?.charAt(0).toUpperCase() || 'A'

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 print:hidden">
      <div>
        <h1 className="text-base font-semibold text-gray-900">{page.title}</h1>
        <p className="text-xs text-gray-400">{page.subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        {orgInfo?.name && (
          <span className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full font-medium hidden sm:inline">
            {orgInfo.name}
          </span>
        )}
        <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        <div
          className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold"
          title={currentUser?.email || ''}
        >
          {initial}
        </div>
      </div>
    </header>
  )
}
