import StatCard from '../components/StatCard'

export default function Dashboard({ products, bills, setCurrentPage }) {
  const today = new Date().toDateString()
  const todayBills = bills.filter(b => new Date(b.date).toDateString() === today)
  const todayRevenue = todayBills.reduce((sum, b) => sum + b.total, 0)
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))]

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Products"
          value={products.length}
          subtitle="items in inventory"
          iconBg="bg-indigo-50"
          icon={
            <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
        />
        <StatCard
          title="Categories"
          value={categories.length}
          subtitle="product categories"
          iconBg="bg-violet-50"
          icon={
            <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          }
        />
        <StatCard
          title="Bills Today"
          value={todayBills.length}
          subtitle="invoices generated"
          iconBg="bg-emerald-50"
          icon={
            <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <StatCard
          title="Revenue Today"
          value={`Rs. ${todayRevenue.toLocaleString()}`}
          subtitle="total earnings"
          iconBg="bg-amber-50"
          icon={
            <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-3 gap-5">
        {/* Recent Bills */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Bills</h2>
            {bills.length > 0 && (
              <button
                onClick={() => setCurrentPage('billing')}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
              >
                New Bill →
              </button>
            )}
          </div>
          {bills.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-500">No bills yet</p>
              <p className="text-xs text-gray-400 mt-0.5">Create your first invoice to see it here</p>
              <button
                onClick={() => setCurrentPage('billing')}
                className="mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Create a Bill →
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Bill #</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[...bills].reverse().slice(0, 8).map((bill, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 text-sm font-medium text-indigo-600">#{bill.invoiceNo}</td>
                      <td className="px-5 py-3 text-sm text-gray-700">{bill.customerName || 'Walk-in Customer'}</td>
                      <td className="px-5 py-3 text-sm text-gray-500">{new Date(bill.date).toLocaleDateString()}</td>
                      <td className="px-5 py-3 text-sm font-semibold text-gray-900 text-right">
                        Rs. {bill.total.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-3">Quick Actions</h2>
            <div className="space-y-2">
              <button
                onClick={() => setCurrentPage('billing')}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors text-sm font-medium text-left cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Create New Bill
              </button>
              <button
                onClick={() => setCurrentPage('inventory')}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-700 transition-colors text-sm font-medium text-left cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add Product
              </button>
              <button
                onClick={() => setCurrentPage('settings')}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors text-sm font-medium text-left cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </button>
            </div>
          </div>

          {/* Inventory Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-3">By Category</h2>
            {categories.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No products yet</p>
            ) : (
              <div className="space-y-2">
                {categories.map(cat => (
                  <div key={cat} className="flex items-center justify-between py-1">
                    <span className="text-sm text-gray-600 truncate">{cat}</span>
                    <span className="text-sm font-semibold text-gray-900 ml-2 shrink-0">
                      {products.filter(p => p.category === cat).length}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
