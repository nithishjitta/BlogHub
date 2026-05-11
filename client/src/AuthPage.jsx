import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import { Eye, EyeOff, ArrowRight, Loader2, Sun, Moon } from 'lucide-react';
import {Link, useNavigate} from 'react-router-dom';

/* Social provider brand SVG icons */
const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const GitHubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const MicrosoftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="1" y="1" width="10.5" height="10.5" fill="#F25022"/>
    <rect x="12.5" y="1" width="10.5" height="10.5" fill="#7FBA00"/>
    <rect x="1" y="12.5" width="10.5" height="10.5" fill="#00A4EF"/>
    <rect x="12.5" y="12.5" width="10.5" height="10.5" fill="#FFB900"/>
  </svg>
);

export const AuthPage = () => {
  const { loginWithGoogle, loginWithGitHub, loginWithLinkedIn, loginWithMicrosoft } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  const [tab, setTab] = useState('login');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState('');
  const [error, setError] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPw, setLoginPw] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPw, setRegPw] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3100/signin', {
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json'
        },
        credentials : 'include',
        body : JSON.stringify({
          email : loginEmail,
          password : loginPw
        })
      })
      const data = await response.json();
      if(response.ok) {
        navigate('/'); // Redirect to home page on successful login
      }
      else {
        setError(data.message);
      }
    }
    catch(err) {
      setError('Check your details and try again.');
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try{
      const response = await fetch('http://localhost:3100/signup', {
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json'
        },
        credentials : 'include',
        body : JSON.stringify({
          fullname : regName,
            email : regEmail,
            password : regPw
        })
      })
      const data = await response.json();
      if(response.ok) {
        navigate('/'); // Redirect to home page on successful registration
      }
      else {
        setError(data.message);
      }
    }
    catch(err) {
      setError('Check your details and try again.');
    }
    setLoading(false);
  };

  const handleSocial = (provider, fn) => {
    setSocialLoading(provider);
    fn();
    // Social fns auto-resolve via setTimeout in AuthContext
    setTimeout(() => setSocialLoading(''), 1000);
  };

  const switchTab = (t) => { setTab(t); setError(''); };

  return (
    <div className="auth-root">

      {/* ── LEFT: HERO ── */}
      <div className="auth-hero">
        <div className="auth-hero-bg" />
        <div className="auth-hero-gradient" />

        {/* Top */}
        <div className="auth-hero-content fade-up">
          <div className="auth-logo">
            Blog<span className="auth-logo-dot">.</span>Hub
          </div>
          <h1 className="auth-hero-headline">
            The knowledge hub<br />for <em>finance</em> pros.
          </h1>
          <p className="auth-hero-sub">
            Curated insights on tax, technology, career growth, and compliance — built for modern accounting professionals.
          </p>
        </div>

        {/* Bottom */}
        <div className="auth-hero-bottom fade-up d2" style={{ position: 'relative', zIndex: 1 }}>
          <div className="auth-features">
            {[
              'Expert articles on finance & accounting',
              'Career insights for CA professionals',
              'Latest regulatory & tax updates',
              'AI & tech trends in the profession',
              'Publish and share your expertise',
            ].map((f) => (
              <div className="auth-feature" key={f}>
                <div className="auth-feature-check">✓</div>
                <span>{f}</span>
              </div>
            ))}
          </div>

          <div className="auth-hero-stats">
            {[
              { n: '10+', l: 'Articles' },
              { n: '6', l: 'Categories' },
              { n: '12K+', l: 'Readers' },
            ].map((s) => (
              <div className="auth-stat" key={s.l}>
                <span className="auth-stat-num">{s.n}</span>
                <span className="auth-stat-lbl">{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT: FORM ── */}
      <div className="auth-panel">
        {/* Theme toggle */}
        <div className="auth-panel-top">
          <button className="theme-toggle" onClick={toggle} title="Toggle theme">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        <div className="auth-form-box fade-up d1">
          <div className="auth-form-title">
            {tab === 'login' ? 'Welcome back' : 'Create account'}
          </div>
          <div className="auth-form-sub">
            {tab === 'login'
              ? 'Sign in to access your personalised finance feed.'
              : 'Join thousands of finance professionals on Ledger.Ink.'}
          </div>

          {/* Social auth */}
          <div className="auth-social-grid">
            <button
              className="social-btn google"
              onClick={() => handleSocial('google', loginWithGoogle)}
              disabled={!!socialLoading}
            >
              {socialLoading === 'google'
                ? <Loader2 size={15} style={{ animation: 'spin 0.75s linear infinite' }} />
                : <GoogleIcon />}
              Google
            </button>
            <button
              className="social-btn github"
              onClick={() => handleSocial('github', loginWithGitHub)}
              disabled={!!socialLoading}
            >
              {socialLoading === 'github'
                ? <Loader2 size={15} style={{ animation: 'spin 0.75s linear infinite' }} />
                : <GitHubIcon />}
              GitHub
            </button>
            <button
              className="social-btn linkedin"
              onClick={() => handleSocial('linkedin', loginWithLinkedIn)}
              disabled={!!socialLoading}
            >
              {socialLoading === 'linkedin'
                ? <Loader2 size={15} style={{ animation: 'spin 0.75s linear infinite' }} />
                : <LinkedInIcon />}
              LinkedIn
            </button>
            <button
              className="social-btn microsoft"
              onClick={() => handleSocial('microsoft', loginWithMicrosoft)}
              disabled={!!socialLoading}
            >
              {socialLoading === 'microsoft'
                ? <Loader2 size={15} style={{ animation: 'spin 0.75s linear infinite' }} />
                : <MicrosoftIcon />}
              Microsoft
            </button>
          </div>

          <div className="auth-divider">or continue with email</div>

          {/* Tabs */}
          <div className="auth-tabs">
            <button className={`auth-tab${tab === 'login' ? ' active' : ''}`} onClick={() => switchTab('login')}>Sign In</button>
            <button className={`auth-tab${tab === 'register' ? ' active' : ''}`} onClick={() => switchTab('register')}>Register</button>
          </div>

          {error && <div className="auth-error" style={{ marginBottom: '1rem' }}>{error}</div>}

          {/* Login form */}
          {tab === 'login' && (
            <form className="auth-form" onSubmit={handleLogin} method="POST">
              <div className="auth-field">
                <label className="auth-label">Email Address</label>
                <input
                  className="auth-input"
                  type="email" placeholder="you@example.com"
                  value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                  required autoComplete="email"
                />
              </div>
              <div className="auth-field">
                <label className="auth-label">Password</label>
                <div className="auth-pass-wrap">
                  <input
                    className="auth-input"
                    type={showPw ? 'text' : 'password'}
                    placeholder="Min 6 characters"
                    value={loginPw} onChange={(e) => setLoginPw(e.target.value)}
                    required autoComplete="current-password"
                  />
                  <button type="button" className="auth-eye" onClick={() => setShowPw(!showPw)}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <button className="auth-submit" type="submit" disabled={loading}>
                {loading
                  ? <><Loader2 size={15} style={{ animation: 'spin 0.75s linear infinite' }} /> Signing in…</>
                  : <><ArrowRight size={15} /> Sign In</>}
              </button>
            </form>
          )}

          {/* Register form */}
          {tab === 'register' && (
            <form className="auth-form" onSubmit={handleRegister} method="POST">
              <div className="auth-field">
                <label className="auth-label">Full Name</label>
                <input
                  className="auth-input" type="text" placeholder="Rahul Sharma"
                  value={regName} onChange={(e) => setRegName(e.target.value)}
                  required autoComplete="name"
                />
              </div>
              <div className="auth-field">
                <label className="auth-label">Email Address</label>
                <input
                  className="auth-input" type="email" placeholder="you@example.com"
                  value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                  required autoComplete="email"
                />
              </div>
              <div className="auth-field">
                <label className="auth-label">Password</label>
                <div className="auth-pass-wrap">
                  <input
                    className="auth-input"
                    type={showPw ? 'text' : 'password'}
                    placeholder="Min 6 characters"
                    value={regPw} onChange={(e) => setRegPw(e.target.value)}
                    required autoComplete="new-password"
                  />
                  <button type="button" className="auth-eye" onClick={() => setShowPw(!showPw)}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <button className="auth-submit" type="submit" disabled={loading}>
                {loading
                  ? <><Loader2 size={15} style={{ animation: 'spin 0.75s linear infinite' }} /> Creating account…</>
                  : <><ArrowRight size={15} /> Create Account</>}
              </button>
            </form>
          )}

          <div className="auth-footer-row">
            {tab === 'login'
              ? <><span>No account? </span><span className="auth-switch-link" onClick={() => switchTab('register')}>Register free</span></>
              : <><span>Already a member? </span><span className="auth-switch-link" onClick={() => switchTab('login')}>Sign in</span></>
            }
          </div>
        </div>
      </div>
    </div>
  );
};