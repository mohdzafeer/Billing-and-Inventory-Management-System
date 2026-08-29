import { useState, useRef } from 'react'
import { billsApi } from '../api/index'

const generateInvoiceNo = () => `INV-${Date.now().toString().slice(-7)}`

export default function Billing({ products, bills, setBills, orgInfo }) {
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '' })
  const [items, setItems] = useState([])
  const [selectedProductId, setSelectedProductId] = useState('')
  const [customItem, setCustomItem] = useState({ name: '', price: '', qty: 1 })
  const [addMode, setAddMode] = useState('inventory')
  const [saving, setSaving] = useState(false)
  const [savedBill, setSavedBill] = useState(null)
  const billRef = useRef(null)

  const invoiceNo = useRef(generateInvoiceNo()).current
  const invoiceDate = new Date().toLocaleDateString('en-PK', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const total = subtotal

  const addFromInventory = () => {
    const product = products.find(p => p._id === selectedProductId)
    if (!product) return
    const existing = items.find(i => i.productId === product._id)
    if (existing) {
      setItems(prev => prev.map(i =>
        i.productId === product._id ? { ...i, qty: i.qty + 1 } : i
      ))
    } else {
      setItems(prev => [...prev, {
        productId: product._id,
        name: product.name,
        price: product.price,
        qty: 1,
      }])
    }
    setSelectedProductId('')
  }

  const addCustom = () => {
    if (!customItem.name.trim() || !customItem.price) return
    setItems(prev => [...prev, {
      productId: null,
      name: customItem.name.trim(),
      price: parseFloat(customItem.price),
      qty: Math.max(1, parseInt(customItem.qty) || 1),
    }])
    setCustomItem({ name: '', price: '', qty: 1 })
  }

  const removeItem = (index) => setItems(prev => prev.filter((_, i) => i !== index))

  const updateQty = (index, qty) => {
    const n = parseInt(qty)
    if (isNaN(n) || n < 1) return
    setItems(prev => prev.map((item, i) => i === index ? { ...item, qty: n } : item))
  }

  const handleSave = async () => {
    if (items.length === 0 || saving || savedBill) return
    setSaving(true)
    try {
      const bill = await billsApi.create({
        invoiceNo,
        customerName: customer.name,
        customerPhone: customer.phone,
        customerAddress: customer.address,
        items,
        subtotal,
        total,
        date: new Date().toISOString(),
      })
      setBills(prev => [bill, ...prev])
      setSavedBill(bill)
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handlePrint = () => {
    const content = billRef.current
    if (!content) return
    const win = window.open('', '_blank', 'width=800,height=700')
    win.document.write(`<!DOCTYPE html><html><head><title>Invoice ${invoiceNo}</title><style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:'Segoe UI',Arial,sans-serif;color:#111;background:#fff;padding:40px}
      .hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;padding-bottom:20px;border-bottom:2px solid #4f46e5}
      .org-name{font-size:20px;font-weight:700;color:#4f46e5}
      .org-sub{font-size:11px;color:#6b7280;margin-top:3px;line-height:1.5}
      .inv-title{font-size:26px;font-weight:800;letter-spacing:2px;color:#111}
      .inv-meta{font-size:11px;color:#6b7280;text-align:right;margin-top:4px;line-height:1.6}
      .bill-to{margin-bottom:24px}
      .lbl{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;margin-bottom:5px}
      .cname{font-size:14px;font-weight:600;color:#111}
      .cdetail{font-size:11px;color:#6b7280;margin-top:2px}
      table{width:100%;border-collapse:collapse;margin-bottom:20px}
      thead tr{background:#f1f0ff}
      th{padding:9px 12px;text-align:left;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:#4f46e5}
      th:last-child{text-align:right}
      tbody tr{border-bottom:1px solid #f3f4f6}
      td{padding:9px 12px;font-size:12px;color:#374151}
      td:last-child{text-align:right;font-weight:600;color:#111}
      .total-wrap{display:flex;justify-content:flex-end}
      .total-box{width:210px}
      .total-final{display:flex;justify-content:space-between;padding:10px 14px;background:#4f46e5;color:#fff;font-size:14px;font-weight:700;border-radius:8px;margin-top:8px}
      .footer{margin-top:36px;padding-top:16px;border-top:1px solid #e5e7eb;text-align:center;font-size:11px;color:#9ca3af}
      img.logo{height:38px;margin-bottom:6px;object-fit:contain}
    </style></head><body>${content.innerHTML}</body></html>`)
    win.document.close()
    win.focus()
    setTimeout(() => { win.print(); win.close() }, 400)
  }

  const handleClear = () => {
    setCustomer({ name: '', phone: '', address: '' })
    setItems([])
    setSavedBill(null)
  }

  return (
    <div className="p-6 flex gap-5 h-full min-h-0">
      {/* Left Panel */}
      <div className="flex-1 space-y-4 overflow-y-auto min-w-0">
        {/* Customer Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Customer Information</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Customer Name</label>
              <input
                type="text"
                value={customer.name}
                onChange={e => setCustomer({ ...customer, name: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Walk-in Customer"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Phone</label>
                <input
                  type="tel"
                  value={customer.phone}
                  onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="+92 xxx xxxxxxx"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Address</label>
                <input
                  type="text"
                  value={customer.address}
                  onChange={e => setCustomer({ ...customer, address: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="City, Area"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Add Items */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Add Items</h2>
          <div className="flex bg-gray-100 rounded-lg p-1 mb-4 w-fit">
            {['inventory', 'custom'].map(m => (
              <button
                key={m}
                onClick={() => setAddMode(m)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer
                  ${addMode === m ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {m === 'inventory' ? 'From Inventory' : 'Custom Item'}
              </button>
            ))}
          </div>

          {addMode === 'inventory' ? (
            <div className="flex gap-2">
              <select
                value={selectedProductId}
                onChange={e => setSelectedProductId(e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">Select a product...</option>
                {products.map(p => (
                  <option key={p._id} value={p._id}>
                    {p.name} — Rs. {p.price} {p.unit ? `(${p.unit})` : ''}
                  </option>
                ))}
              </select>
              <button
                onClick={addFromInventory}
                disabled={!selectedProductId}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Item Name</label>
                <input
                  type="text"
                  value={customItem.name}
                  onChange={e => setCustomItem({ ...customItem, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter item name"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-500 block mb-1">Price (Rs.)</label>
                  <input
                    type="number"
                    min="0"
                    value={customItem.price}
                    onChange={e => setCustomItem({ ...customItem, price: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="0.00"
                  />
                </div>
                <div className="w-24">
                  <label className="text-xs font-medium text-gray-500 block mb-1">Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={customItem.qty}
                    onChange={e => setCustomItem({ ...customItem, qty: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={addCustom}
                    disabled={!customItem.name || !customItem.price}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Line Items */}
        {items.length > 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Bill Items ({items.length})</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">Rs. {item.price.toLocaleString()} each</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => updateQty(i, item.qty - 1)}
                      className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 cursor-pointer"
                    >−</button>
                    <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                    <button
                      onClick={() => updateQty(i, item.qty + 1)}
                      className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 cursor-pointer"
                    >+</button>
                  </div>
                  <div className="text-right shrink-0 w-24">
                    <p className="text-sm font-semibold text-gray-900">
                      Rs. {(item.price * item.qty).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(i)}
                    className="p-1 text-gray-300 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 py-12 text-center text-gray-400">
            <svg className="w-10 h-10 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-sm">Add items to the bill above</p>
          </div>
        )}
      </div>

      {/* Right Panel — Bill Preview */}
      <div className="w-96 shrink-0 flex flex-col gap-4">
        <div className="bg-white rounded-xl border border-gray-200 flex-1 overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Bill Preview</h2>
            <span className="text-xs text-gray-400">#{invoiceNo}</span>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            <div ref={billRef}>
              {/* Bill Header */}
              <div className="hdr" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'24px',paddingBottom:'16px',borderBottom:'2px solid #4f46e5'}}>
                <div>
                  {orgInfo?.logo && (
                    <img src={orgInfo.logo} alt="Logo" className="logo" style={{height:'36px',marginBottom:'5px',objectFit:'contain'}} />
                  )}
                  <div className="org-name" style={{fontSize:'17px',fontWeight:'700',color:'#4f46e5'}}>
                    {orgInfo?.name || 'Your Organization'}
                  </div>
                  <div className="org-sub" style={{fontSize:'10px',color:'#6b7280',marginTop:'3px',lineHeight:'1.5'}}>
                    {orgInfo?.address && <div>{orgInfo.address}</div>}
                    {orgInfo?.phone && <div>Tel: {orgInfo.phone}</div>}
                    {orgInfo?.email && <div>{orgInfo.email}</div>}
                  </div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div className="inv-title" style={{fontSize:'22px',fontWeight:'800',letterSpacing:'2px',color:'#111'}}>INVOICE</div>
                  <div className="inv-meta" style={{fontSize:'10px',color:'#6b7280',textAlign:'right',marginTop:'3px',lineHeight:'1.6'}}>
                    <div># {invoiceNo}</div>
                    <div>{invoiceDate}</div>
                  </div>
                </div>
              </div>

              {/* Customer */}
              {(customer.name || customer.phone || customer.address) && (
                <div className="bill-to" style={{marginBottom:'20px'}}>
                  <div className="lbl" style={{fontSize:'9px',fontWeight:'700',textTransform:'uppercase',letterSpacing:'1px',color:'#9ca3af',marginBottom:'5px'}}>Bill To</div>
                  {customer.name && <div className="cname" style={{fontSize:'13px',fontWeight:'600',color:'#111'}}>{customer.name}</div>}
                  {customer.phone && <div className="cdetail" style={{fontSize:'11px',color:'#6b7280',marginTop:'2px'}}>{customer.phone}</div>}
                  {customer.address && <div className="cdetail" style={{fontSize:'11px',color:'#6b7280',marginTop:'1px'}}>{customer.address}</div>}
                </div>
              )}

              {/* Items Table */}
              {items.length > 0 ? (
                <>
                  <table style={{width:'100%',borderCollapse:'collapse',marginBottom:'16px',fontSize:'11px'}}>
                    <thead>
                      <tr style={{background:'#f1f0ff'}}>
                        {['#','Item','Qty','Rate','Amount'].map((h, i) => (
                          <th key={h} style={{padding:'8px 10px',textAlign: i >= 2 ? (i === 2 ? 'center' : 'right') : 'left',color:'#4f46e5',fontWeight:'600',fontSize:'9px',textTransform:'uppercase',letterSpacing:'.5px'}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, i) => (
                        <tr key={i} style={{borderBottom:'1px solid #f3f4f6'}}>
                          <td style={{padding:'8px 10px',color:'#9ca3af'}}>{i + 1}</td>
                          <td style={{padding:'8px 10px',color:'#374151',fontWeight:'500'}}>{item.name}</td>
                          <td style={{padding:'8px 10px',color:'#374151',textAlign:'center'}}>{item.qty}</td>
                          <td style={{padding:'8px 10px',color:'#374151',textAlign:'right'}}>Rs. {item.price.toLocaleString()}</td>
                          <td style={{padding:'8px 10px',color:'#111',fontWeight:'600',textAlign:'right'}}>Rs. {(item.price * item.qty).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="total-wrap" style={{display:'flex',justifyContent:'flex-end'}}>
                    <div className="total-box" style={{width:'200px'}}>
                      <div className="total-final" style={{display:'flex',justifyContent:'space-between',padding:'10px 14px',background:'#4f46e5',color:'#fff',fontSize:'14px',fontWeight:'700',borderRadius:'8px'}}>
                        <span>Total</span>
                        <span>Rs. {total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="footer" style={{marginTop:'32px',paddingTop:'14px',borderTop:'1px solid #e5e7eb',textAlign:'center',fontSize:'10px',color:'#9ca3af'}}>
                    Thank you for your business!
                    {orgInfo?.name && <div style={{marginTop:'2px'}}>— {orgInfo.name}</div>}
                  </div>
                </>
              ) : (
                <div style={{textAlign:'center',padding:'32px 0',color:'#d1d5db',fontSize:'12px'}}>
                  No items added yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {savedBill && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium px-4 py-2.5 rounded-xl text-center">
              ✓ Bill #{savedBill.invoiceNo} saved
            </div>
          )}
          <button
            onClick={handlePrint}
            disabled={items.length === 0}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print / Download PDF
          </button>
          <button
            onClick={handleSave}
            disabled={items.length === 0 || saving || !!savedBill}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {saving ? 'Saving...' : savedBill ? 'Saved ✓' : 'Save Bill'}
          </button>
          <button
            onClick={handleClear}
            className="w-full border border-gray-200 text-gray-600 hover:bg-gray-50 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer"
          >
            Clear & New Bill
          </button>
        </div>
      </div>
    </div>
  )
}
