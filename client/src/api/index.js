const BASE = import.meta.env.BASE_URL || 'http://localhost:3000/api'
// const BASE = 'http://localhost:3000/api'

const getToken = () => localStorage.getItem('biz_token')

const buildHeaders = () => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
})

const request = async (method, path, body) => {
  if (!BASE) throw new Error('API URL not configured — set VITE_API_URL in your .env file')

  let res
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers: buildHeaders(),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('Cannot reach the server. Check your internet connection or API URL.')
  }

  const text = await res.text()
  let data = {}
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    throw new Error(`Server returned an unexpected response (${res.status})`)
  }

  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`)
  return data
}

export const authApi = {
  login: (body) => request('POST', '/auth/login', body),
  register: (body) => request('POST', '/auth/register', body),
  me: () => request('GET', '/auth/me'),
}

export const productsApi = {
  getAll: () => request('GET', '/products'),
  add: (body) => request('POST', '/products', body),
  delete: (id) => request('DELETE', `/products/${id}`),
  update: (id, body) => request('PUT', `/products/${id}`, body),
}

export const billsApi = {
  getAll: () => request('GET', '/bills'),
  create: (body) => request('POST', '/bills', body),
}

export const settingsApi = {
  get: () => request('GET', '/settings'),
  update: (body) => request('PUT', '/settings', body),
}

export const membersApi = {
  getAll: () => request('GET', '/members'),
  add: (body) => request('POST', '/members', body),
  remove: (id) => request('DELETE', `/members/${id}`),
}
