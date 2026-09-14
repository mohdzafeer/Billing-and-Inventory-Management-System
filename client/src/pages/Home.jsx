import { useState, useRef, useCallback } from 'react'
import Login from './Login'

const BARS    = [34, 51, 42, 68, 54, 80, 61, 74, 57, 92, 70, 86]
const STATS   = [
  { label: 'Revenue',     val: '₹48,200', sub: '+12% this week', cls: 'text-emerald-400' },
  { label: 'Bills Today', val: '24',       sub: '8 pending',      cls: 'text-blue-400'   },
  { label: 'Products',    val: '142',      sub: '6 low stock',    cls: 'text-violet-400' },
]
const BILLS   = [
  { name: 'Rahul General Store', amount: '₹2,400', status: 'Paid',    sc: 'text-emerald-400' },
  { name: 'City Mart & Co.',     amount: '₹1,850', status: 'Pending', sc: 'text-amber-400'   },
]
const NAV_ITEMS = [
  { label: 'Dashboard', active: true  },
  { label: 'Inventory',  active: false },
  { label: 'Billing',    active: false },
  { label: 'Members',    active: false },
  { label: 'Settings',   active: false },
]
const FEATURES = [
  {
    topLine: 'linear-gradient(to right,transparent,rgba(99,102,241,0.65),transparent)',
    iconBg:  'rgba(99,102,241,0.12)', iconCol: '#818cf8',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>,
    title: 'Smart Inventory',
    desc:  'Track stock in real time. Get low-stock alerts before you run out.',
  },
  {
    topLine: 'linear-gradient(to right,transparent,rgba(139,92,246,0.65),transparent)',
    iconBg:  'rgba(139,92,246,0.12)', iconCol: '#a78bfa',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>,
    title: 'Pro Invoices',
    desc:  'Generate branded, print-ready invoices in seconds. Save every transaction.',
  },
  {
    topLine: 'linear-gradient(to right,transparent,rgba(217,70,239,0.65),transparent)',
    iconBg:  'rgba(217,70,239,0.12)', iconCol: '#e879f9',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>,
    title: 'Live Dashboard',
    desc:  'Revenue, bills, and inventory at a glance. Know your numbers, always.',
  },
]

// ─── 3D wireframe cube ──────────────────────────────────────────────────────
const CUBE_FACES = [
  'translateZ(VAR)',
  'rotateY(180deg) translateZ(VAR)',
  'rotateY(-90deg) translateZ(VAR)',
  'rotateY(90deg)  translateZ(VAR)',
  'rotateX(90deg)  translateZ(VAR)',
  'rotateX(-90deg) translateZ(VAR)',
]

function Cube3D({ size, color, duration, delay, pos }) {
  const half = size / 2
  return (
    <div className="absolute pointer-events-none" style={{ ...pos, perspective: size * 5 }}>
      <div style={{
        width: size, height: size,
        transformStyle: 'preserve-3d',
        animation: `cube3DSpin ${duration}s linear ${delay}s infinite`,
      }}>
        {CUBE_FACES.map((t, i) => (
          <div key={i} style={{
            position: 'absolute', width: size, height: size,
            border: `1px solid ${color}`,
            background: color.replace(/[\d.]+\)$/, '0.025)'),
            transform: t.replace('VAR', `${half}px`),
          }}/>
        ))}
      </div>
    </div>
  )
}

// ─── Feature card with 3D magnetic tilt ────────────────────────────────────
function FeatureCard({ f }) {
  const ref = useRef(null)

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    const x = (e.clientX - r.left) / r.width  - 0.5
    const y = (e.clientY - r.top)  / r.height - 0.5
    ref.current.style.transition = 'none'
    ref.current.style.transform  =
      `perspective(700px) rotateY(${x * 16}deg) rotateX(${-y * 16}deg) translateY(-6px) scale(1.02)`
  }
  const onLeave = () => {
    if (!ref.current) return
    ref.current.style.transition = 'transform 0.55s cubic-bezier(0.23,1,0.32,1)'
    ref.current.style.transform  = 'perspective(700px) rotateY(0deg) rotateX(0deg) translateY(0px) scale(1)'
  }

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      className="bg-zinc-950 border border-white/[0.06] rounded-2xl overflow-hidden cursor-pointer"
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}>
      <div className="h-px w-full" style={{ background: f.topLine }}/>
      <div className="p-5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4" style={{ background: f.iconBg }}>
          <svg className="w-4 h-4" style={{ color: f.iconCol }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            {f.icon}
          </svg>
        </div>
        <h3 className="font-semibold text-white text-sm mb-2">{f.title}</h3>
        <p className="text-xs text-zinc-500 leading-relaxed">{f.desc}</p>
      </div>
    </div>
  )
}

// ─── Main page ──────────────────────────────────────────────────────────────
export default function Home({ onLogin }) {
  const [authMode, setAuthMode] = useState(null)
  const containerRef = useRef(null)
  const spotRef      = useRef(null)

  const handleMouseMove = useCallback((e) => {
    if (!spotRef.current || !containerRef.current) return
    const r = containerRef.current.getBoundingClientRect()
    spotRef.current.style.transform =
      `translate(${e.clientX - r.left}px,${e.clientY - r.top}px) translate(-50%,-50%)`
  }, [])

  if (authMode) {
    return <Login onLogin={onLogin} initialMode={authMode} onBack={() => setAuthMode(null)} />
  }

  return (
    <>
      <style>{`
        /* ── Keyframes ── */
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(32px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        @keyframes orbA {
          0%,100% { transform:translate(0,0)       scale(1);    }
          33%     { transform:translate(70px,-90px) scale(1.2);  }
          66%     { transform:translate(-60px,60px) scale(0.86); }
        }
        @keyframes orbB {
          0%,100% { transform:translate(0,0)        scale(1);    }
          42%     { transform:translate(-80px,85px)  scale(1.15); }
          74%     { transform:translate(60px,-50px)  scale(0.9);  }
        }
        @keyframes gradShift {
          0%,100% { background-position:0%   50%; }
          50%     { background-position:100% 50%; }
        }
        @keyframes logoPulse {
          0%,100% { box-shadow:0 0 14px 3px  rgba(99,102,241,0.5); }
          50%     { box-shadow:0 0 32px 10px rgba(99,102,241,0.9); }
        }
        @keyframes dotBlink {
          0%,100% { opacity:1;   }
          50%     { opacity:0.2; }
        }
        @keyframes beamSweep {
          from { left:-80%;  }
          to   { left:130%;  }
        }
        @keyframes mockupFloat {
          0%,100% { transform:rotateX(12deg) rotateY(-2deg) translateY(0);    }
          50%     { transform:rotateX(12deg) rotateY(-2deg) translateY(-10px); }
        }
        @keyframes borderGlow {
          0%,100% { opacity:0.4; }
          50%     { opacity:1;   }
        }

        /* 3-D cube — each axis spins at a prime-ratio so it never loops cleanly */
        @keyframes cube3DSpin {
          0%   { transform: rotateX(0deg)   rotateY(0deg)   rotateZ(0deg);   }
          100% { transform: rotateX(360deg) rotateY(540deg) rotateZ(180deg); }
        }

        /* Rings */
        @keyframes ringSpinA {
          from { transform: rotateX(72deg) rotateZ(0deg);   }
          to   { transform: rotateX(72deg) rotateZ(360deg); }
        }
        @keyframes ringSpinB {
          from { transform: rotateY(65deg) rotateZ(0deg);   }
          to   { transform: rotateY(65deg) rotateZ(360deg); }
        }
        @keyframes ringSpinC {
          from { transform: rotateX(55deg) rotateY(30deg) rotateZ(0deg);   }
          to   { transform: rotateX(55deg) rotateY(30deg) rotateZ(360deg); }
        }

        /* ── Utility ── */
        .fiu { animation:fadeUp 0.75s cubic-bezier(0.22,1,0.36,1) both; opacity:0; }
        .d1  { animation-delay:0.04s; }
        .d2  { animation-delay:0.16s; }
        .d3  { animation-delay:0.28s; }
        .d4  { animation-delay:0.42s; }
        .d5  { animation-delay:0.56s; }
        .d6  { animation-delay:0.72s; }

        .orb-a { animation:orbA 14s ease-in-out infinite; }
        .orb-b { animation:orbB 18s ease-in-out infinite; animation-delay:6s; }

        .logo-glow { animation:logoPulse 3s ease-in-out infinite; }
        .dot-blink { animation:dotBlink 1.8s ease-in-out infinite; }

        .grad-text {
          background:linear-gradient(135deg,#818cf8 0%,#c084fc 38%,#f472b6 72%,#818cf8 100%);
          background-size:280% 280%;
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
          animation:gradShift 6s ease infinite;
        }

        /* Primary button */
        .btn-p {
          position:relative; overflow:hidden;
          transition:transform 0.2s ease, box-shadow 0.3s ease;
        }
        .btn-p::after {
          content:''; position:absolute; top:0; bottom:0; width:50%;
          background:linear-gradient(to right,transparent,rgba(255,255,255,0.22),transparent);
          animation:beamSweep 2.8s ease-in-out infinite;
          pointer-events:none;
        }
        .btn-p:hover {
          transform:translateY(-2px);
          box-shadow:0 0 44px 10px rgba(99,102,241,0.55),0 0 100px 30px rgba(99,102,241,0.15);
        }

        /* Ghost button */
        .btn-g { transition:all 0.22s ease; }
        .btn-g:hover {
          background:rgba(255,255,255,0.06);
          border-color:rgba(255,255,255,0.28);
          color:#fff; transform:translateY(-1px);
        }

        /* Nav link */
        .nav-lnk { position:relative; transition:color 0.2s ease; }
        .nav-lnk::after {
          content:''; position:absolute; bottom:-2px; left:0; right:0; height:1px;
          background:linear-gradient(to right,transparent,rgba(255,255,255,0.5),transparent);
          transform:scaleX(0); transition:transform 0.2s ease;
        }
        .nav-lnk:hover::after { transform:scaleX(1); }

        /* Mockup */
        .mockup-wrap { animation:mockupFloat 6s ease-in-out infinite; transform-style:preserve-3d; }
        .mockup-glow { animation:borderGlow 4s ease-in-out infinite; }

        /* 3-D rings */
        .ring-a { animation:ringSpinA 13s linear infinite; }
        .ring-b { animation:ringSpinB 18s linear infinite reverse; }
        .ring-c { animation:ringSpinC  9s linear infinite; }
      `}</style>

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden"
      >
        {/* Mouse spotlight */}
        <div ref={spotRef} className="pointer-events-none absolute z-0"
          style={{
            width:850, height:850, top:0, left:0, willChange:'transform',
            background:'radial-gradient(circle, rgba(99,102,241,0.065) 0%, transparent 62%)',
          }}
        />

        {/* ── Static background ── */}
        <div className="absolute inset-0 pointer-events-none z-0" aria-hidden>
          {/* Top bloom */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[700px]"
            style={{ background:'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.08) 45%, transparent 70%)' }}
          />
          {/* Aurora orbs */}
          <div className="orb-a absolute -left-72 top-16 w-[640px] h-[640px] rounded-full"
            style={{ background:'radial-gradient(circle, rgba(79,70,229,0.32) 0%, transparent 70%)', filter:'blur(68px)' }}
          />
          <div className="orb-b absolute -right-72 top-36 w-[580px] h-[580px] rounded-full"
            style={{ background:'radial-gradient(circle, rgba(139,92,246,0.26) 0%, transparent 70%)', filter:'blur(76px)' }}
          />
          {/* Grid */}
          <div className="absolute inset-0" style={{
            backgroundImage:`
              linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
            `,
            backgroundSize:'64px 64px',
          }}/>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[760px] h-[520px]"
            style={{ background:'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.07) 0%, transparent 65%)' }}
          />
          {/* Film grain */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
            <filter id="grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch"/>
              <feColorMatrix type="saturate" values="0"/>
            </filter>
            <rect width="100%" height="100%" filter="url(#grain)"/>
          </svg>
          {/* Vignette */}
          <div className="absolute inset-0"
            style={{ background:'radial-gradient(ellipse 85% 75% at 50% 50%, transparent 35%, rgba(0,0,0,0.72) 100%)' }}
          />
        </div>

        {/* ── 3D Elements ── */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>

          {/* ▸ Large central wireframe cube — very subtle backdrop */}
          <div className="absolute" style={{
            top:'50%', left:'50%',
            transform:'translate(-50%,-50%)',
            perspective:'1400px',
            opacity: 0.1,
          }}>
            <div style={{
              width:380, height:380,
              transformStyle:'preserve-3d',
              animation:'cube3DSpin 50s linear infinite',
            }}>
              {CUBE_FACES.map((t, i) => (
                <div key={i} style={{
                  position:'absolute', width:380, height:380,
                  border:'1px solid rgba(99,102,241,0.9)',
                  background:'transparent',
                  transform: t.replace('VAR','190px'),
                }}/>
              ))}
            </div>
          </div>

          {/* ▸ Ring — top-left */}
          <div className="absolute" style={{ top:'6%', left:'7%', perspective:'500px', opacity:0.45 }}>
            <div className="ring-a" style={{
              width:110, height:110,
              border:'1.5px solid rgba(99,102,241,0.65)',
              borderRadius:'50%',
            }}/>
          </div>

          {/* ▸ Ring — bottom-right */}
          <div className="absolute" style={{ bottom:'16%', right:'6%', perspective:'500px', opacity:0.4 }}>
            <div className="ring-b" style={{
              width:95, height:95,
              border:'1.5px solid rgba(217,70,239,0.65)',
              borderRadius:'50%',
            }}/>
          </div>

          {/* ▸ Ring — mid-right */}
          <div className="absolute" style={{ top:'38%', right:'2%', perspective:'400px', opacity:0.3 }}>
            <div className="ring-c" style={{
              width:68, height:68,
              border:'1px solid rgba(139,92,246,0.7)',
              borderRadius:'50%',
            }}/>
          </div>

          {/* ▸ Small cubes — corners & edges */}
          <Cube3D size={52} color="rgba(99,102,241,0.5)"  duration={12} delay={0}
            pos={{ top:'7%',  left:'4%'  }} />
          <Cube3D size={36} color="rgba(139,92,246,0.5)" duration={9}  delay={1.5}
            pos={{ top:'13%', right:'5%' }} />
          <Cube3D size={68} color="rgba(99,102,241,0.35)" duration={19} delay={0.8}
            pos={{ top:'54%', left:'0%'  }} />
          <Cube3D size={30} color="rgba(217,70,239,0.55)" duration={10} delay={3}
            pos={{ bottom:'20%', right:'3%' }} />
          <Cube3D size={44} color="rgba(139,92,246,0.4)" duration={15} delay={2}
            pos={{ top:'28%', right:'1%' }} />
        </div>

        {/* ══════════════ NAV ══════════════ */}
        <nav className="fiu relative z-10 px-6 sm:px-10 py-5 flex items-center justify-between max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-2.5">
            <img src="/bm.png" alt="Bilz Manager" className="logo-glow w-8 h-8 rounded-lg object-contain shrink-0" />
            <span className="font-bold text-sm tracking-tight">Bilz Manager</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setAuthMode('login')}
              className="nav-lnk px-5 py-2 text-sm text-zinc-400 hover:text-white">
              Sign in
            </button>
            <button onClick={() => setAuthMode('register')}
              className="btn-p ml-2 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg">
              Get started
            </button>
          </div>
        </nav>

        {/* ══════════════ HERO ══════════════ */}
        <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-6 pb-12">
          {/* Live badge */}
          <div className="fiu d1 inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-full px-4 py-1.5 mb-10 text-xs text-zinc-400 font-medium backdrop-blur-sm">
            <span className="dot-blink w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"/>
            Now live · Free for all businesses
          </div>

          <h1 className="fiu d2 font-black tracking-tighter leading-none mb-7 max-w-5xl"
            style={{ fontSize:'clamp(2.8rem, 7.5vw, 5.5rem)' }}>
            <span className="block text-white">Billing &amp; inventory</span>
            <span className="grad-text block">done beautifully.</span>
          </h1>

          <p className="fiu d3 text-base sm:text-lg text-zinc-500 max-w-xl mb-10 leading-relaxed">
            Create invoices, manage stock, and understand your business — all from one clean dashboard built for small businesses.
          </p>

          <div className="fiu d4 flex flex-wrap items-center justify-center gap-3 mb-7">
            <button onClick={() => setAuthMode('register')}
              className="btn-p inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl">
              Start for free
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </button>
            <button onClick={() => setAuthMode('login')}
              className="btn-g px-7 py-3 text-sm font-medium text-zinc-400 border border-white/10 rounded-xl">
              Sign in
            </button>
          </div>

          <p className="fiu d4 text-[11px] tracking-widest text-zinc-700 uppercase">
            Free forever&nbsp;·&nbsp;No credit card&nbsp;·&nbsp;2-minute setup
          </p>
        </section>

        {/* ══════════════ DASHBOARD PREVIEW ══════════════ */}
        <section className="fiu d5 relative z-10 px-4 sm:px-8 pb-10 max-w-5xl mx-auto w-full">
          <div style={{ perspective:'1600px' }}>
            <div className="mockup-wrap" style={{ transformOrigin:'center bottom' }}>

              <div className="mockup-glow absolute inset-x-8 -top-6 h-12 rounded-full pointer-events-none"
                style={{ background:'radial-gradient(ellipse, rgba(99,102,241,0.3) 0%, transparent 70%)', filter:'blur(12px)' }}
              />

              <div className="relative rounded-2xl border border-white/[0.09] overflow-hidden"
                style={{
                  background:'rgba(9,9,18,0.85)',
                  backdropFilter:'blur(16px)',
                  boxShadow:'0 60px 120px -20px rgba(0,0,0,0.95), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}>

                {/* Window chrome */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.05] bg-black/40">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"/>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"/>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"/>
                  </div>
                  <div className="flex-1 mx-6 h-4 rounded-md bg-white/[0.04]"/>
                  <div className="w-14 h-4 rounded-md bg-white/[0.03]"/>
                </div>

                {/* App layout */}
                <div className="flex" style={{ height:'260px' }}>
                  {/* Sidebar */}
                  <div className="w-40 border-r border-white/[0.04] p-3 flex-shrink-0 bg-black/20">
                    <div className="flex items-center gap-1.5 mb-5 px-2">
                      <div className="w-4 h-4 rounded bg-indigo-600/70"/>
                      <div className="h-2 w-16 rounded bg-white/10"/>
                    </div>
                    {NAV_ITEMS.map(item => (
                      <div key={item.label}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg mb-0.5 ${item.active ? 'bg-indigo-600/15' : ''}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${item.active ? 'bg-indigo-400' : 'bg-zinc-800'}`}/>
                        <span className={`text-[10px] font-medium ${item.active ? 'text-indigo-300' : 'text-zinc-600'}`}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Main content */}
                  <div className="flex-1 p-4 overflow-hidden">
                    {/* Stat cards */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {STATS.map(s => (
                        <div key={s.label} className="rounded-xl border border-white/[0.05] p-2.5 bg-white/[0.02]">
                          <div className="text-[9px] text-zinc-600 mb-1 uppercase tracking-wider">{s.label}</div>
                          <div className={`text-sm font-bold mb-0.5 ${s.cls}`}>{s.val}</div>
                          <div className="text-[9px] text-zinc-700">{s.sub}</div>
                        </div>
                      ))}
                    </div>

                    {/* Chart */}
                    <div className="rounded-xl border border-white/[0.05] p-3 mb-2.5 bg-white/[0.015]" style={{ height:'90px' }}>
                      <div className="text-[9px] text-zinc-700 uppercase tracking-wider mb-2">Revenue · last 12 days</div>
                      <div className="flex items-end gap-0.5" style={{ height:'52px' }}>
                        {BARS.map((h, i) => (
                          <div key={i} className="flex-1 rounded-sm" style={{
                            height:`${h}%`,
                            background: i === 9 ? 'rgba(99,102,241,0.75)'
                                      : i === 11 ? 'rgba(99,102,241,0.55)'
                                      : 'rgba(99,102,241,0.2)',
                          }}/>
                        ))}
                      </div>
                    </div>

                    {/* Recent bills */}
                    <div className="rounded-xl border border-white/[0.05] overflow-hidden bg-white/[0.015]">
                      {BILLS.map((b, i) => (
                        <div key={b.name}
                          className={`flex items-center justify-between px-3 py-2 ${i === 0 ? 'border-b border-white/[0.04]' : ''}`}>
                          <div>
                            <div className="text-[10px] text-zinc-300 font-medium">{b.name}</div>
                            <div className={`text-[9px] ${b.sc}`}>{b.status}</div>
                          </div>
                          <span className="text-xs font-bold text-white">{b.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Glow underneath */}
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-2/3 h-32 pointer-events-none"
            style={{ background:'radial-gradient(ellipse at 50% 100%, rgba(99,102,241,0.18) 0%, transparent 70%)', filter:'blur(8px)' }}
          />
        </section>

        {/* ══════════════ FEATURES ══════════════ */}
        <section className="relative z-10 px-6 sm:px-10 pb-16 max-w-5xl mx-auto w-full">
          <div className="fiu d6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {FEATURES.map(f => <FeatureCard key={f.title} f={f} />)}
          </div>
        </section>

        {/* ══════════════ FOOTER ══════════════ */}
        <footer className="relative z-10 border-t border-white/[0.05] py-5 text-center text-xs text-zinc-800">
          © {new Date().getFullYear()} Bilz Manager · Built for small businesses
        </footer>
      </div>
    </>
  )
}
