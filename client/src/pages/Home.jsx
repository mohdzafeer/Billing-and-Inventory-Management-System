import { useState, useRef, useCallback } from 'react'
import Login from './Login'

const METEORS = [
  { top: '8%',  left: '12%', delay: '0s',   dur: '5s'   },
  { top: '4%',  left: '36%', delay: '2.4s', dur: '4.2s' },
  { top: '14%', left: '57%', delay: '0.8s', dur: '5.8s' },
  { top: '6%',  left: '74%', delay: '3.6s', dur: '4.8s' },
  { top: '20%', left: '88%', delay: '1.6s', dur: '6.2s' },
]

export default function Home({ onLogin }) {
  const [authMode, setAuthMode] = useState(null)
  const containerRef = useRef(null)
  const spotRef = useRef(null)

  const handleMouseMove = useCallback((e) => {
    if (!spotRef.current || !containerRef.current) return
    const r = containerRef.current.getBoundingClientRect()
    spotRef.current.style.transform =
      `translate(${e.clientX - r.left}px, ${e.clientY - r.top}px) translate(-50%, -50%)`
  }, [])

  if (authMode) {
    return <Login onLogin={onLogin} initialMode={authMode} onBack={() => setAuthMode(null)} />
  }

  return (
    <>
      <style>{`
        /* ── Entrances ── */
        @keyframes fadeInUp {
          from { opacity:0; transform:translateY(28px); }
          to   { opacity:1; transform:translateY(0); }
        }

        /* ── Aurora orb paths ── */
        @keyframes auroraA {
          0%,100% { transform:translate(0,0) scale(1); }
          30%     { transform:translate(90px,-80px) scale(1.2); }
          65%     { transform:translate(-55px,65px) scale(0.85); }
        }
        @keyframes auroraB {
          0%,100% { transform:translate(0,0) scale(1); }
          40%     { transform:translate(-80px,90px) scale(1.15); }
          72%     { transform:translate(65px,-45px) scale(0.9); }
        }
        @keyframes auroraC {
          0%,100% { transform:translate(0,0) scale(1); }
          55%     { transform:translate(45px,55px) scale(1.12); }
        }

        /* ── Shooting stars ── */
        @keyframes meteor {
          0%   { opacity:0;   transform:rotate(45deg) translateX(-200px); }
          8%   { opacity:0.9; }
          92%  { opacity:0.9; }
          100% { opacity:0;   transform:rotate(45deg) translateX(1400px); }
        }

        /* ── Logo ── */
        @keyframes logoPulse {
          0%,100% { box-shadow:0 0 18px 4px rgba(99,102,241,0.4); }
          50%      { box-shadow:0 0 42px 12px rgba(99,102,241,0.75); }
        }

        /* ── Headline gradient ── */
        @keyframes gradShift {
          0%,100% { background-position:0% 50%; }
          50%      { background-position:100% 50%; }
        }

        /* ── Card spinning border ── */
        @keyframes borderSpin {
          from { transform:rotate(0deg); }
          to   { transform:rotate(360deg); }
        }

        /* ── Button shimmer ── */
        @keyframes beamSweep {
          0%   { left:-70%; }
          100% { left:130%; }
        }

        /* ── Badge dot ── */
        @keyframes dotBlink {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.3; transform:scale(0.7); }
        }

        /* ─────── Applied classes ─────── */
        .fiu  { animation:fadeInUp 0.7s ease both; opacity:0; }
        .d1   { animation-delay:0.08s; }
        .d2   { animation-delay:0.22s; }
        .d3   { animation-delay:0.38s; }
        .d4   { animation-delay:0.54s; }
        .d5   { animation-delay:0.72s; }

        .orb-a { animation:auroraA 13s ease-in-out infinite; }
        .orb-b { animation:auroraB 16s ease-in-out infinite; animation-delay:4s; }
        .orb-c { animation:auroraC 11s ease-in-out infinite; animation-delay:7s; }

        .meteor-el { animation:meteor var(--dur) linear var(--delay) infinite; }

        .logo-glow  { animation:logoPulse 3s ease-in-out infinite; }
        .badge-dot  { animation:dotBlink 2s ease-in-out infinite; }

        .grad-text {
          background:linear-gradient(135deg,#a5b4fc,#c4b5fd,#f0abfc,#a5b4fc);
          background-size:300% 300%;
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
          animation:gradShift 5s ease infinite;
        }

        /* Animated conic-gradient border cards */
        .card-wrap {
          position:relative;
          border-radius:18px;
          padding:1px;
          overflow:hidden;
        }
        .card-wrap::before {
          content:'';
          position:absolute;
          inset:-100%;
          animation:borderSpin var(--sd,6s) linear infinite;
        }
        .card-indigo::before  { background:conic-gradient(from 0deg, transparent 335deg, rgba(99,102,241,1) 355deg, transparent 360deg); }
        .card-violet::before  { background:conic-gradient(from 0deg, transparent 335deg, rgba(139,92,246,1)  355deg, transparent 360deg); }
        .card-emerald::before { background:conic-gradient(from 0deg, transparent 335deg, rgba(16,185,129,1)  355deg, transparent 360deg); }

        .card-body {
          position:relative;
          border-radius:17px;
          padding:20px;
          background:rgba(8,8,20,0.82);
          backdrop-filter:blur(14px);
          transition:transform 0.28s ease;
        }
        .card-wrap:hover .card-body {
          transform:translateY(-3px);
        }

        /* Primary button shimmer */
        .btn-primary {
          position:relative;
          overflow:hidden;
          transition:box-shadow 0.25s ease, transform 0.2s ease, background 0.2s ease;
        }
        .btn-primary::after {
          content:'';
          position:absolute;
          top:0; bottom:0;
          width:45%;
          background:linear-gradient(to right, transparent, rgba(255,255,255,0.22), transparent);
          animation:beamSweep 2.8s ease-in-out infinite;
          pointer-events:none;
        }
        .btn-primary:hover {
          box-shadow:0 0 36px 8px rgba(99,102,241,0.6);
          transform:translateY(-2px);
        }

        .btn-ghost {
          transition:all 0.22s ease;
        }
        .btn-ghost:hover {
          background:rgba(255,255,255,0.08);
          border-color:rgba(255,255,255,0.28);
          color:#fff;
          transform:translateY(-1px);
        }
      `}</style>

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="min-h-screen bg-slate-950 flex flex-col relative overflow-hidden"
      >
        {/* ── Mouse spotlight ── */}
        <div
          ref={spotRef}
          className="absolute pointer-events-none z-0"
          style={{
            width: 720, height: 720, top: 0, left: 0, willChange: 'transform',
            background: 'radial-gradient(circle, rgba(99,102,241,0.075) 0%, transparent 65%)',
          }}
        />

        {/* ── Background layer ── */}
        <div className="absolute inset-0 pointer-events-none z-0" aria-hidden>

          {/* Aurora orbs */}
          <div className="orb-a absolute -top-52 -left-52 w-[580px] h-[580px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.45) 0%, transparent 70%)', filter: 'blur(52px)' }} />
          <div className="orb-b absolute -top-20 right-[-80px] w-[440px] h-[440px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.32) 0%, transparent 70%)', filter: 'blur(62px)' }} />
          <div className="orb-c absolute bottom-[-60px] left-[30%] w-[420px] h-[420px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.28) 0%, transparent 70%)', filter: 'blur(58px)' }} />

          {/* Soft centre halo */}
          <div className="absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[860px] h-[860px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 60%)', filter: 'blur(32px)' }} />

          {/* Dot grid */}
          <div className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1px)',
              backgroundSize: '38px 38px',
            }} />

          {/* Film-grain noise */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <filter id="grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#grain)" />
          </svg>

          {/* Vignette */}
          <div className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,0.55) 100%)' }} />
        </div>

        {/* ── Shooting stars ── */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
          {METEORS.map((m, i) => (
            <div
              key={i}
              className="meteor-el absolute"
              style={{
                top: m.top, left: m.left,
                '--dur': m.dur, '--delay': m.delay,
                width: '150px', height: '1px',
                background: 'linear-gradient(to right, transparent 0%, rgba(196,181,253,0.9) 60%, rgba(255,255,255,1) 100%)',
                borderRadius: '9999px',
                willChange: 'transform, opacity',
              }}
            />
          ))}
        </div>

        {/* ── Nav ── */}
        <nav className="fiu relative z-10 px-8 py-5 flex items-center justify-between max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-2.5">
            <div className="logo-glow w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="font-bold text-white text-lg tracking-tight">BizManager</span>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setAuthMode('login')}
              className="px-5 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
              Sign In
            </button>
            <button onClick={() => setAuthMode('register')}
              className="btn-primary px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg">
              Get Started
            </button>
          </div>
        </nav>

        {/* ── Hero ── */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center py-12">

          {/* Badge */}
          <div className="fiu d1 inline-flex items-center gap-2 border border-indigo-500/25 bg-indigo-500/10 text-indigo-300 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-8 backdrop-blur-sm">
            <span className="badge-dot w-1.5 h-1.5 bg-indigo-400 rounded-full" />
            Simple billing for every business
          </div>

          {/* Headline */}
          <h1 className="fiu d2 text-5xl sm:text-6xl font-extrabold text-white leading-tight mb-5 max-w-2xl">
            Billing &amp; Inventory<br />
            <span className="grad-text">Made Simple</span>
          </h1>

          {/* Sub-line */}
          <p className="fiu d3 text-lg text-slate-400 max-w-md mb-10 leading-relaxed">
            Create professional invoices, manage your products, and grow your business — all in one place.
          </p>

          {/* CTAs */}
          <div className="fiu d4 flex items-center gap-3 flex-wrap justify-center">
            <button onClick={() => setAuthMode('register')}
              className="btn-primary px-8 py-3.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl">
              Create Free Account
            </button>
            <button onClick={() => setAuthMode('login')}
              className="btn-ghost px-8 py-3.5 text-sm font-semibold text-slate-300 bg-white/5 border border-white/10 rounded-xl">
              Sign In →
            </button>
          </div>

          {/* Cards */}
          <div className="fiu d5 grid grid-cols-1 sm:grid-cols-3 gap-5 mt-20 max-w-2xl w-full">
            {[
              {
                cls: 'card-indigo', sd: '7s',
                iconBg: 'bg-indigo-500/15', iconColor: 'text-indigo-400',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />,
                title: 'Inventory Tracking',
                desc: 'Track stock levels, categories, and get low-stock alerts automatically.',
              },
              {
                cls: 'card-violet', sd: '5.5s',
                iconBg: 'bg-violet-500/15', iconColor: 'text-violet-400',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
                title: 'Professional Invoices',
                desc: 'Create, save, and print branded invoices in seconds.',
              },
              {
                cls: 'card-emerald', sd: '8s',
                iconBg: 'bg-emerald-500/15', iconColor: 'text-emerald-400',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
                title: 'Business Dashboard',
                desc: 'See daily revenue, bill counts, and inventory stats at a glance.',
              },
            ].map(f => (
              <div key={f.title} className={`card-wrap ${f.cls}`} style={{ '--sd': f.sd }}>
                <div className="card-body">
                  <div className={`w-10 h-10 ${f.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                    <svg className={`w-5 h-5 ${f.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      {f.icon}
                    </svg>
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1.5">{f.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="relative z-10 py-5 text-center text-xs text-slate-600 border-t border-white/5">
          © {new Date().getFullYear()} BizManager · Built for small businesses
        </div>
      </div>
    </>
  )
}
