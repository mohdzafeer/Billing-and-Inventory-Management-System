import { useState } from 'react'
import Login from './Login'

export default function Home({ onLogin }) {
  const [authMode, setAuthMode] = useState(null)

  if (authMode) {
    return (
      <Login
        onLogin={onLogin}
        initialMode={authMode}
        onBack={() => setAuthMode(null)}
      />
    )
  }

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatA {
          0%, 100% { transform: translateY(0)   scale(1); }
          50%       { transform: translateY(-32px) scale(1.06); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0)  scale(1); }
          50%       { transform: translateY(22px) scale(0.96); }
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0%   50%; }
          50%       { background-position: 100% 50%; }
        }
        @keyframes logoPulse {
          0%, 100% { box-shadow: 0 0 18px 4px rgba(99,102,241,0.35); }
          50%       { box-shadow: 0 0 36px 8px rgba(99,102,241,0.6);  }
        }
        @keyframes dotBlink {
          0%, 100% { opacity: 1;   transform: scale(1);    }
          50%       { opacity: 0.5; transform: scale(0.75); }
        }

        .fiu { animation: fadeInUp 0.65s ease both; opacity: 0; }
        .d1  { animation-delay: 0.08s; }
        .d2  { animation-delay: 0.2s;  }
        .d3  { animation-delay: 0.34s; }
        .d4  { animation-delay: 0.48s; }
        .d5  { animation-delay: 0.62s; }

        .orb-a { animation: floatA 9s ease-in-out infinite; }
        .orb-b { animation: floatB 7s ease-in-out infinite; }
        .orb-c { animation: floatA 11s ease-in-out infinite; animation-delay: 3s; }

        .grad-text {
          background: linear-gradient(135deg, #818cf8, #a78bfa, #c4b5fd, #818cf8);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 5s ease infinite;
        }

        .logo-glow { animation: logoPulse 3s ease-in-out infinite; }
        .badge-dot { animation: dotBlink 2s ease-in-out infinite; }

        .card-hover {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px -8px rgba(99,102,241,0.2), 0 4px 16px -4px rgba(0,0,0,0.3);
        }

        .btn-glow {
          transition: background 0.2s ease, box-shadow 0.25s ease, transform 0.2s ease;
        }
        .btn-glow:hover {
          box-shadow: 0 0 28px 4px rgba(99,102,241,0.5);
          transform: translateY(-1px);
        }

        .btn-ghost {
          transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
        }
        .btn-ghost:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.25);
          color: #fff;
        }
      `}</style>

      <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-hidden">

        {/* ── Ambient lighting orbs ── */}
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
          <div
            className="orb-a absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)', filter: 'blur(48px)' }}
          />
          <div
            className="orb-b absolute -top-16 right-[-80px] w-[380px] h-[380px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)', filter: 'blur(56px)' }}
          />
          <div
            className="orb-c absolute bottom-[-80px] right-1/4 w-[340px] h-[340px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 70%)', filter: 'blur(64px)' }}
          />
          {/* Centre halo behind hero */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 65%)', filter: 'blur(40px)' }}
          />
          {/* Subtle dot-grid */}
          <div
            className="absolute inset-0 opacity-[0.045]"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
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
            <button
              onClick={() => setAuthMode('login')}
              className="px-5 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className="btn-glow px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg"
            >
              Get Started
            </button>
          </div>
        </nav>

        {/* ── Hero ── */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center py-12">

          {/* Badge */}
          <div className="fiu d1 inline-flex items-center gap-2 border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-8 backdrop-blur-sm">
            <span className="badge-dot w-1.5 h-1.5 bg-indigo-400 rounded-full" />
            Simple billing for every business
          </div>

          {/* Headline */}
          <h1 className="fiu d2 text-5xl sm:text-6xl font-extrabold text-white leading-tight mb-5 max-w-2xl">
            Billing &amp; Inventory<br />
            <span className="grad-text">Made Simple</span>
          </h1>

          {/* Sub-headline */}
          <p className="fiu d3 text-lg text-slate-400 max-w-md mb-10 leading-relaxed">
            Create professional invoices, manage your products, and grow your business — all in one place.
          </p>

          {/* CTAs */}
          <div className="fiu d4 flex items-center gap-3 flex-wrap justify-center">
            <button
              onClick={() => setAuthMode('register')}
              className="btn-glow px-8 py-3.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl"
            >
              Create Free Account
            </button>
            <button
              onClick={() => setAuthMode('login')}
              className="btn-ghost px-8 py-3.5 text-sm font-semibold text-slate-300 bg-white/5 border border-white/10 rounded-xl"
            >
              Sign In →
            </button>
          </div>

          {/* Feature cards */}
          <div className="fiu d5 grid grid-cols-1 sm:grid-cols-3 gap-5 mt-20 max-w-2xl w-full">
            {[
              {
                grad: 'from-indigo-500/15 to-indigo-600/5',
                border: 'border-indigo-500/20',
                iconBg: 'bg-indigo-500/15',
                iconColor: 'text-indigo-400',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />,
                title: 'Inventory Tracking',
                desc: 'Track stock levels, categories, and get low-stock alerts automatically.',
              },
              {
                grad: 'from-violet-500/15 to-violet-600/5',
                border: 'border-violet-500/20',
                iconBg: 'bg-violet-500/15',
                iconColor: 'text-violet-400',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
                title: 'Professional Invoices',
                desc: 'Create, save, and print branded invoices in seconds.',
              },
              {
                grad: 'from-emerald-500/15 to-emerald-600/5',
                border: 'border-emerald-500/20',
                iconBg: 'bg-emerald-500/15',
                iconColor: 'text-emerald-400',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
                title: 'Business Dashboard',
                desc: 'See daily revenue, bill counts, and inventory stats at a glance.',
              },
            ].map(f => (
              <div
                key={f.title}
                className={`card-hover bg-gradient-to-br ${f.grad} border ${f.border} rounded-2xl p-5 text-left backdrop-blur-sm`}
              >
                <div className={`w-10 h-10 ${f.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                  <svg className={`w-5 h-5 ${f.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    {f.icon}
                  </svg>
                </div>
                <h3 className="font-semibold text-white text-sm mb-1.5">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
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
