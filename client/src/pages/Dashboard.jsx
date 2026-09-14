import { useState } from 'react'
import StatCard from '../components/StatCard'
import RevenueChart from '../components/RevenueChart'
import { useTheme } from '../context/ThemeContext'

export default function Dashboard({ products, bills, setCurrentPage, orgInfo }) {
  const { isDark } = useTheme()
  const [selectedBill, setSelectedBill] = useState(null)

  const today = new Date().toDateString()
  const todayBills = bills.filter(b => new Date(b.createdAt).toDateString() === today)
  const todayRevenue = todayBills.reduce((sum, b) => sum + b.total, 0)

  const printBill = (bill) => {
    const invoiceDate = new Date(bill.createdAt).toLocaleDateString('en-PK', {
      year: 'numeric', month: 'long', day: 'numeric',
    })
    const itemRows = bill.items.map((item, i) => `
      <tr style="border-bottom:1px solid #f3f4f6">
        <td style="padding:8px 10px;color:#9ca3af">${i + 1}</td>
        <td style="padding:8px 10px;color:#374151;font-weight:500">${item.name}</td>
        <td style="padding:8px 10px;color:#374151;text-align:center">${item.qty}</td>
        <td style="padding:8px 10px;color:#374151;text-align:right">Rs. ${item.price.toLocaleString()}</td>
        <td style="padding:8px 10px;color:#111;font-weight:600;text-align:right">Rs. ${(item.price * item.qty).toLocaleString()}</td>
      </tr>`).join('')
    const win = window.open('', '_blank', 'width=800,height=700')
    win.document.write(`<!DOCTYPE html><html><head><title>Invoice ${bill.invoiceNo}</title><style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:'Segoe UI',Arial,sans-serif;color:#111;background:#fff;padding:40px}
      table{width:100%;border-collapse:collapse;margin-bottom:20px}
      thead tr{background:#f1f0ff}
      th{padding:9px 12px;text-align:left;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:#4f46e5}
      th:last-child,th:nth-child(3),th:nth-child(4){text-align:right}
      th:nth-child(3){text-align:center}
      img.logo{height:38px;margin-bottom:6px;object-fit:contain}
    </style></head><body>
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;padding-bottom:20px;border-bottom:2px solid #4f46e5">
        <div>
          ${orgInfo?.logo ? `<img class="logo" src="${orgInfo.logo}" alt="Logo"/>` : ''}
          <div style="font-size:20px;font-weight:700;color:#4f46e5">${orgInfo?.name || 'Your Organization'}</div>
          <div style="font-size:11px;color:#6b7280;margin-top:3px;line-height:1.5">
            ${orgInfo?.address ? `<div>${orgInfo.address}</div>` : ''}
            ${orgInfo?.phone ? `<div>Tel: ${orgInfo.phone}</div>` : ''}
            ${orgInfo?.email ? `<div>${orgInfo.email}</div>` : ''}
          </div>
        </div>
        <div style="text-align:right">
          <div style="font-size:26px;font-weight:800;letter-spacing:2px;color:#111">INVOICE</div>
          <div style="font-size:11px;color:#6b7280;margin-top:4px;line-height:1.6">
            <div># ${bill.invoiceNo}</div>
            <div>${invoiceDate}</div>
          </div>
        </div>
      </div>
      ${bill.customerName || bill.customerPhone || bill.customerAddress ? `
      <div style="margin-bottom:24px">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;margin-bottom:5px">Bill To</div>
        ${bill.customerName ? `<div style="font-size:14px;font-weight:600;color:#111">${bill.customerName}</div>` : ''}
        ${bill.customerPhone ? `<div style="font-size:11px;color:#6b7280;margin-top:2px">${bill.customerPhone}</div>` : ''}
        ${bill.customerAddress ? `<div style="font-size:11px;color:#6b7280;margin-top:1px">${bill.customerAddress}</div>` : ''}
      </div>` : ''}
      <table>
        <thead>
          <tr>
            <th>#</th><th>Item</th><th style="text-align:center">Qty</th><th style="text-align:right">Rate</th><th style="text-align:right">Amount</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>
      <div style="display:flex;justify-content:flex-end">
        <div style="width:210px">
          <div style="display:flex;justify-content:space-between;padding:10px 14px;background:#4f46e5;color:#fff;font-size:14px;font-weight:700;border-radius:8px">
            <span>Total</span><span>Rs. ${bill.total.toLocaleString()}</span>
          </div>
        </div>
      </div>
      <div style="margin-top:36px;padding-top:16px;border-top:1px solid #e5e7eb;text-align:center;font-size:11px;color:#9ca3af">
        Thank you for your business!${orgInfo?.name ? `<div style="margin-top:2px">— ${orgInfo.name}</div>` : ''}
      </div>
    </body></html>`)
    win.document.close()
    win.focus()
    setTimeout(() => { win.print(); win.close() }, 400)
  }

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))]

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Products"
          value={products.length}
          subtitle="items in inventory"
          accent="indigo"
          icon={
            <svg className={`w-6 h-6 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
        />
        <StatCard
          title="Categories"
          value={categories.length}
          subtitle="product categories"
          accent="violet"
          icon={
            <svg className={`w-6 h-6 ${isDark ? 'text-violet-400' : 'text-violet-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          }
        />
        <StatCard
          title="Bills Today"
          value={todayBills.length}
          subtitle="invoices generated"
          accent="emerald"
          icon={
            <svg className={`w-6 h-6 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <StatCard
          title="Revenue Today"
          value={`Rs. ${todayRevenue.toLocaleString()}`}
          subtitle="total earnings"
          accent="amber"
          icon={
            <svg className={`w-6 h-6 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <RevenueChart bills={bills} metric="revenue" />
        <RevenueChart bills={bills} metric="bills" />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Bills */}
        <div className={`col-span-1 lg:col-span-2 rounded-xl border ${isDark ? 'bg-zinc-900 border-white/[0.06]' : 'bg-white border-gray-200'}`}>
          <div className={`px-5 py-4 border-b flex items-center justify-between ${isDark ? 'border-white/[0.06]' : 'border-gray-100'}`}>
            <h2 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Bills</h2>
            {bills.length > 0 && (
              <button
                onClick={() => setCurrentPage('billing')}
                className={`text-xs font-medium cursor-pointer ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}
              >
                New Bill →
              </button>
            )}
          </div>
          {bills.length === 0 ? (
            <div className="py-16 text-center">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`}>
                <svg className={`w-7 h-7 ${isDark ? 'text-zinc-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className={`text-sm font-medium ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>No bills yet</p>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-600' : 'text-gray-400'}`}>Create your first invoice to see it here</p>
              <button
                onClick={() => setCurrentPage('billing')}
                className={`mt-4 text-sm font-medium cursor-pointer ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}
              >
                Create a Bill →
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-white/[0.06]' : 'border-gray-100'}`}>
                    <th className={`text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Bill #</th>
                    <th className={`text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Customer</th>
                    <th className={`text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Date & Time</th>
                    <th className={`text-right px-5 py-3 text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Amount</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-white/[0.04]' : 'divide-gray-50'}`}>
                  {bills.slice(0, 8).map((bill, i) => (
                    <tr
                      key={i}
                      onClick={() => setSelectedBill(bill)}
                      className={`transition-colors cursor-pointer ${isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-gray-50'}`}
                    >
                      <td className={`px-5 py-3 text-sm font-medium ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>#{bill.invoiceNo}</td>
                      <td className={`px-5 py-3 text-sm ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>{bill.customerName || 'Walk-in Customer'}</td>
                      <td className={`px-5 py-3 text-sm ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                        <div>{new Date(bill.createdAt).toLocaleDateString()}</div>
                        <div className={`text-xs mt-0.5 ${isDark ? 'text-zinc-600' : 'text-gray-400'}`}>
                          {new Date(bill.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className={`px-5 py-3 text-sm font-semibold text-right ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Rs. {bill.total.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={e => { e.stopPropagation(); printBill(bill) }}
                          title="Print invoice"
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            isDark
                              ? 'text-zinc-600 hover:text-indigo-400 hover:bg-indigo-500/10'
                              : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'
                          }`}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                          </svg>
                        </button>
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
          <div className={`rounded-xl border p-5 ${isDark ? 'bg-zinc-900 border-white/[0.06]' : 'bg-white border-gray-200'}`}>
            <h2 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h2>
            <div className="space-y-2">
              <button
                onClick={() => setCurrentPage('billing')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-sm font-medium text-left cursor-pointer ${
                  isDark
                    ? 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400'
                    : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
                }`}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Create New Bill
              </button>
              <button
                onClick={() => setCurrentPage('inventory')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-sm font-medium text-left cursor-pointer ${
                  isDark
                    ? 'bg-violet-500/10 hover:bg-violet-500/20 text-violet-400'
                    : 'bg-violet-50 hover:bg-violet-100 text-violet-700'
                }`}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add Product
              </button>
              <button
                onClick={() => setCurrentPage('settings')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-sm font-medium text-left cursor-pointer ${
                  isDark
                    ? 'bg-white/[0.04] hover:bg-white/[0.07] text-zinc-400'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`}
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
          <div className={`rounded-xl border p-5 ${isDark ? 'bg-zinc-900 border-white/[0.06]' : 'bg-white border-gray-200'}`}>
            <h2 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>By Category</h2>
            {categories.length === 0 ? (
              <p className={`text-sm text-center py-4 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>No products yet</p>
            ) : (
              <div className="space-y-2">
                {categories.map(cat => (
                  <div key={cat} className="flex items-center justify-between py-1">
                    <span className={`text-sm truncate ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>{cat}</span>
                    <span className={`text-sm font-semibold ml-2 shrink-0 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {products.filter(p => p.category === cat).length}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bill Detail Modal */}
      {selectedBill && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedBill(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div>
                <h2 className="font-bold text-gray-900 text-base">Invoice #{selectedBill.invoiceNo}</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(selectedBill.createdAt).toLocaleString([], {
                    year: 'numeric', month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => printBill(selectedBill)}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print
                </button>
                <button
                  onClick={() => setSelectedBill(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Invoice Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Invoice Header */}
              <div className="flex justify-between items-start mb-6 pb-5 border-b-2 border-indigo-500">
                <div>
                  {orgInfo?.logo && (
                    <img src={orgInfo.logo} alt="Logo" className="h-8 mb-2 object-contain" />
                  )}
                  <div className="text-lg font-bold text-indigo-600">{orgInfo?.name || 'Your Organization'}</div>
                  <div className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {orgInfo?.address && <div>{orgInfo.address}</div>}
                    {orgInfo?.phone && <div>Tel: {orgInfo.phone}</div>}
                    {orgInfo?.email && <div>{orgInfo.email}</div>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black tracking-widest text-gray-900">INVOICE</div>
                  <div className="text-xs text-gray-500 mt-1 leading-relaxed">
                    <div># {selectedBill.invoiceNo}</div>
                    <div>{new Date(selectedBill.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  </div>
                </div>
              </div>

              {/* Customer */}
              {(selectedBill.customerName || selectedBill.customerPhone || selectedBill.customerAddress) && (
                <div className="mb-5">
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Bill To</div>
                  {selectedBill.customerName && (
                    <div className="text-sm font-semibold text-gray-900">{selectedBill.customerName}</div>
                  )}
                  {selectedBill.customerPhone && (
                    <div className="text-xs text-gray-500 mt-0.5">{selectedBill.customerPhone}</div>
                  )}
                  {selectedBill.customerAddress && (
                    <div className="text-xs text-gray-500 mt-0.5">{selectedBill.customerAddress}</div>
                  )}
                </div>
              )}

              {/* Items Table */}
              <table className="w-full border-collapse mb-4">
                <thead>
                  <tr className="bg-indigo-50">
                    {['#', 'Item', 'Qty', 'Rate', 'Amount'].map((h, i) => (
                      <th
                        key={h}
                        className={`py-2 px-3 text-xs font-semibold uppercase tracking-wide text-indigo-600 ${
                          i === 0 ? 'text-left w-8' : i === 1 ? 'text-left' : i === 2 ? 'text-center' : 'text-right'
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedBill.items.map((item, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-2.5 px-3 text-xs text-gray-400">{i + 1}</td>
                      <td className="py-2.5 px-3 text-sm text-gray-700 font-medium">{item.name}</td>
                      <td className="py-2.5 px-3 text-sm text-center text-gray-600">{item.qty}</td>
                      <td className="py-2.5 px-3 text-sm text-right text-gray-600">Rs. {item.price.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-sm text-right font-semibold text-gray-900">
                        Rs. {(item.price * item.qty).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total */}
              <div className="flex justify-end mb-8">
                <div className="w-52">
                  <div className="flex justify-between items-center bg-indigo-600 text-white px-4 py-3 rounded-xl font-bold text-sm">
                    <span>Total</span>
                    <span>Rs. {selectedBill.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 text-center text-xs text-gray-400">
                Thank you for your business!{orgInfo?.name ? ` — ${orgInfo.name}` : ''}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
