import { useState, useEffect, useCallback } from 'react'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import Billing from './pages/Billing'
import Settings from './pages/Settings'
import Login from './pages/Login'
import { productsApi, billsApi, settingsApi } from './api/index'

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('biz_token'))
  const [currentUser, setCurrentUser] = useState(null)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [products, setProducts] = useState([])
  const [bills, setBills] = useState([])
  const [orgInfo, setOrgInfo] = useState({
    name: '', tagline: '', address: '', phone: '', email: '', ownerName: '', logo: null,
  })
  const [loading, setLoading] = useState(false)

  const handleLogout = useCallback(() => {
    localStorage.removeItem('biz_token')
    setToken(null)
    setCurrentUser(null)
    setProducts([])
    setBills([])
    setOrgInfo({ name: '', tagline: '', address: '', phone: '', email: '', ownerName: '', logo: null })
    setCurrentPage('dashboard')
  }, [])

  const loadAllData = useCallback(async () => {
    setLoading(true)
    try {
      const [prods, bls, sett] = await Promise.all([
        productsApi.getAll(),
        billsApi.getAll(),
        settingsApi.get(),
      ])
      setProducts(prods)
      setBills(bls)
      setOrgInfo({
        name: sett.name || '',
        tagline: sett.tagline || '',
        address: sett.address || '',
        phone: sett.phone || '',
        email: sett.email || '',
        ownerName: sett.ownerName || '',
        logo: sett.logo || null,
      })
    } catch (err) {
      if (err.message.includes('Invalid') || err.message.includes('token')) {
        handleLogout()
      }
    } finally {
      setLoading(false)
    }
  }, [handleLogout])

  useEffect(() => {
    if (token) {
      loadAllData()
    }
  }, [token, loadAllData])

  const handleLogin = (newToken, user) => {
    setToken(newToken)
    setCurrentUser(user)
  }

  if (!token) {
    return <Login onLogin={handleLogin} />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-10 h-10 animate-spin text-indigo-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-gray-500 text-sm">Loading your data...</p>
        </div>
      </div>
    )
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard products={products} bills={bills} setCurrentPage={setCurrentPage} />
      case 'inventory':
        return (
          <Inventory
            products={products}
            setProducts={setProducts}
          />
        )
      case 'billing':
        return (
          <Billing
            products={products}
            bills={bills}
            setBills={setBills}
            orgInfo={orgInfo}
          />
        )
      case 'settings':
        return (
          <Settings
            orgInfo={orgInfo}
            setOrgInfo={setOrgInfo}
          />
        )
      default:
        return <Dashboard products={products} bills={bills} setCurrentPage={setCurrentPage} />
    }
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onLogout={handleLogout}
        orgInfo={orgInfo}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Navbar currentPage={currentPage} orgInfo={orgInfo} currentUser={currentUser} />
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}

export default App
