import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import { CreateBlogForm } from './CreateBlogForm';
import { X, LogOut, Sun, Moon, LayoutGrid, BookOpen, ArrowLeft } from 'lucide-react';

export const Layout = () => {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');

  const isHome = location.pathname === '/';
  const isMyBlogs = location.pathname === '/my-blogs';
  const isDetail = location.pathname.startsWith('/blogs/');

  const handleLogout = () => {
    logout();
    navigate('/auth', { replace: true });
  };

  return (
    <div
  style={{
    minHeight: '100vh',
    background: 'var(--bg)',
    transition: 'background 0.25s',
    display: 'flex',
    flexDirection: 'column',
  }}
>

      {/* ─── NAVBAR ─── */}
      <header className="masthead">
        <div className="masthead-bar">

          {/* Back button in navbar — only on detail pages */}
          {isDetail ? (
            <button
              className="btn btn-sm btn-outline"
              onClick={() => navigate('/')}
              style={{ flexShrink: 0 }}
            >
              <ArrowLeft size={13} /> Back
            </button>
          ) : (
            /* Logo — only when not on detail page */
            <div className="site-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
              Blog<span className="site-logo-dot">.</span>Hub
              <small className="site-logo-sub">Finance · Career · Tech</small>
            </div>
          )}

          <div className="nav-sep" />

          {/* Nav tabs */}
          <div className="nav-tabs">
            <button
              className={`nav-tab${isHome || isDetail ? ' active' : ''}`}
              onClick={() => navigate('/')}
            >
              <LayoutGrid size={13} /> All Articles
            </button>
            <button
              className={`nav-tab${isMyBlogs ? ' active' : ''}`}
              onClick={() => navigate('/my-blogs')}
            >
              <BookOpen size={13} /> My Blogs
            </button>
          </div>

          <div className="nav-sep" />

          {/* Search — only on home / detail views */}
          {(isHome || isDetail) && (
            <div className="nav-search">
              <svg className="nav-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                className="nav-search-input"
                placeholder="Search articles…"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (isDetail) navigate('/');
                }}
              />
              {searchQuery && (
                <button className="nav-search-x" onClick={() => setSearchQuery('')}>
                  <X size={13} />
                </button>
              )}
            </div>
          )}

          {/* Right actions */}
          <div className="nav-right">
            <CreateBlogForm />

            <button className="theme-toggle" onClick={toggle} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <div className="user-chip" onClick={handleLogout} title="Click to sign out">
              <div className="user-avi">
                <img
                  src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                  alt="User avatar"
                />
              </div>
              <span className="user-nm">{user?.name?.split(' ')[0]}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ─── PAGE CONTENT ─── */}
      <div style={{ flex: 1 }}>
  <Outlet context={{ searchQuery, setSearchQuery }} />
</div>

      {/* ─── FOOTER — hide on detail pages ─── */}
      {!isDetail && (
        <footer className="site-footer">
          <div className="footer-inner">
            <span className="footer-logo">Blog<span className="footer-logo-dot">.</span>Hub</span>
            <span className="footer-copy">© 2026 BlogHub — Curated insights for finance professionals</span>
            <button className="btn btn-sm btn-ghost" onClick={handleLogout}>
              <LogOut size={13} /> Sign out
            </button>
          </div>
        </footer>
      )}
    </div>
  );
};