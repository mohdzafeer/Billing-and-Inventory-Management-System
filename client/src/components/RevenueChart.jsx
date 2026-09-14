import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'

const PAD = { top: 16, right: 16, bottom: 36, left: 52 }
const W = 600
const H = 200
const IW = W - PAD.left - PAD.right
const IH = H - PAD.top - PAD.bottom

function fmtY(val, metric) {
  if (metric === 'revenue') return val >= 1000 ? (val / 1000).toFixed(val % 1000 === 0 ? 0 : 1) + 'k' : String(Math.round(val))
  return String(Math.round(val))
}

function fmtTotal(val, metric) {
  return metric === 'revenue' ? `Rs. ${val.toLocaleString()}` : `${val} bill${val !== 1 ? 's' : ''}`
}

function fmtTip(val, metric) {
  return metric === 'revenue' ? `Rs. ${val >= 1000 ? fmtY(val, 'revenue') : val.toLocaleString()}` : `${val} bill${val !== 1 ? 's' : ''}`
}

function buildPts(data) {
  const max = Math.max(...data.map(d => d.value), 1)
  return data.map((d, i) => ({
    x: PAD.left + (data.length === 1 ? IW / 2 : (i / (data.length - 1)) * IW),
    y: PAD.top + IH - (d.value / max) * IH,
    value: d.value,
    label: d.label,
    max,
  }))
}

function smoothPath(pts) {
  if (pts.length < 2) return pts.length === 1 ? `M ${pts[0].x} ${pts[0].y}` : ''
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const cpx = (pts[i - 1].x + pts[i].x) / 2
    d += ` C ${cpx} ${pts[i - 1].y} ${cpx} ${pts[i].y} ${pts[i].x} ${pts[i].y}`
  }
  return d
}

function aggregate(bills, view, metric) {
  const now = new Date()
  if (view === 'daily') {
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date(now); d.setDate(now.getDate() - (13 - i))
      const f = bills.filter(b => new Date(b.createdAt).toDateString() === d.toDateString())
      return { label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value: metric === 'bills' ? f.length : f.reduce((s, b) => s + b.total, 0) }
    })
  }
  if (view === 'monthly') {
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1)
      const f = bills.filter(b => { const bd = new Date(b.createdAt); return bd.getFullYear() === d.getFullYear() && bd.getMonth() === d.getMonth() })
      return { label: d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }), value: metric === 'bills' ? f.length : f.reduce((s, b) => s + b.total, 0) }
    })
  }
  return Array.from({ length: 5 }, (_, i) => {
    const year = now.getFullYear() - (4 - i)
    const f = bills.filter(b => new Date(b.createdAt).getFullYear() === year)
    return { label: String(year), value: metric === 'bills' ? f.length : f.reduce((s, b) => s + b.total, 0) }
  })
}

const COLORS = {
  revenue: { line: '#6366f1', glow: 'rgba(99,102,241,0.3)',  area0: 'rgba(99,102,241,0.45)',  area1: 'rgba(99,102,241,0)',  dot: '#818cf8', grad: 'revGrad' },
  bills:   { line: '#06b6d4', glow: 'rgba(6,182,212,0.3)',   area0: 'rgba(6,182,212,0.4)',    area1: 'rgba(6,182,212,0)',   dot: '#67e8f9', grad: 'billsGrad' },
}

export default function RevenueChart({ bills, metric = 'revenue' }) {
  const { isDark } = useTheme()
  const [view, setView]       = useState('daily')
  const [hovered, setHovered] = useState(null)

  const data  = aggregate(bills, view, metric)
  const pts   = buildPts(data)
  const total = data.reduce((s, d) => s + d.value, 0)
  const max   = pts[0]?.max ?? 1
  const line  = smoothPath(pts)
  const area  = line ? `${line} L ${pts[pts.length-1].x} ${PAD.top+IH} L ${pts[0].x} ${PAD.top+IH} Z` : ''
  const c     = COLORS[metric] || COLORS.revenue
  const gradId = c.grad + (metric === 'revenue' ? 'R' : 'B') // unique ids per instance

  const yTicks = Array.from({ length: 5 }, (_, i) => ({ v: (max / 4) * i, y: PAD.top + IH - (i / 4) * IH }))
  const step   = pts.length > 8 ? 2 : 1

  const cardBg    = isDark ? 'bg-zinc-900 border-white/[0.07]' : 'bg-white border-gray-200'
  const titleCl   = isDark ? 'text-white' : 'text-gray-900'
  const subCl     = isDark ? 'text-zinc-500' : 'text-gray-500'
  const tabWrap   = isDark ? 'bg-white/[0.05]' : 'bg-gray-100'
  const tabAct    = isDark ? 'bg-white/[0.12] text-white' : 'bg-white text-gray-900 shadow-sm'
  const tabInact  = isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-gray-500 hover:text-gray-700'
  const gridClr   = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'
  const tickClr   = isDark ? '#71717a' : '#9ca3af'
  const dotStroke = isDark ? '#18181b' : '#ffffff'
  const title     = metric === 'revenue' ? 'Revenue' : 'Bills Created'
  const periodLbl = view === 'daily' ? 'Last 14 days' : view === 'monthly' ? 'Last 12 months' : 'Last 5 years'

  return (
    <div className={`rounded-xl border ${cardBg} p-5`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
        <div>
          <p className={`text-[10px] font-semibold uppercase tracking-widest mb-1 ${subCl}`}>{title}</p>
          <p className={`text-2xl font-bold ${titleCl}`}>{fmtTotal(total, metric)}</p>
          <p className={`text-xs mt-0.5 ${subCl}`}>{periodLbl}</p>
        </div>
        <div className={`flex items-center gap-1 p-1 rounded-xl ${tabWrap}`}>
          {['daily', 'monthly', 'yearly'].map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all capitalize cursor-pointer ${view === v ? tabAct : tabInact}`}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="w-full overflow-hidden">
        <svg key={view + metric} viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 'auto' }} onMouseLeave={() => setHovered(null)}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={c.area0} />
              <stop offset="100%" stopColor={c.area1} />
            </linearGradient>
            <filter id={`glow-${metric}`}>
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {yTicks.map((t, i) => (
            <g key={i}>
              <line x1={PAD.left} y1={t.y} x2={W - PAD.right} y2={t.y} stroke={gridClr} strokeWidth="1"/>
              <text x={PAD.left - 6} y={t.y + 4} textAnchor="end" fontSize="10" fill={tickClr}>{fmtY(t.v, metric)}</text>
            </g>
          ))}

          {area && <path d={area} fill={`url(#${gradId})`}/>}

          {line && <>
            <path d={line} fill="none" stroke={c.glow} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" filter={`url(#glow-${metric})`}/>
            <path d={line} fill="none" stroke={c.line} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </>}

          {pts.map((pt, i) => i % step === 0 && (
            <text key={i} x={pt.x} y={H - 4} textAnchor="middle" fontSize="9" fill={tickClr}>{pt.label}</text>
          ))}

          {pts.map((pt, i) => (
            <g key={i}>
              <rect x={pt.x - 16} y={PAD.top} width={32} height={IH} fill="transparent" onMouseEnter={() => setHovered(i)}/>
              <circle cx={pt.x} cy={pt.y} r={hovered === i ? 5.5 : 3.5}
                fill={hovered === i ? c.dot : c.line} stroke={dotStroke} strokeWidth="1.5"
                style={{ transition: 'r 0.1s, fill 0.1s' }}/>
              {hovered === i && (
                <g>
                  <rect
                    x={Math.min(Math.max(pt.x - 38, PAD.left), W - PAD.right - 76)}
                    y={pt.y - 32} width={76} height={22} rx={11}
                    fill="rgba(49,46,129,0.95)"
                  />
                  <text
                    x={Math.min(Math.max(pt.x, PAD.left + 38), W - PAD.right - 38)}
                    y={pt.y - 16} textAnchor="middle" fontSize="10" fontWeight="600" fill="#e0e7ff">
                    {fmtTip(pt.value, metric)}
                  </text>
                </g>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}
