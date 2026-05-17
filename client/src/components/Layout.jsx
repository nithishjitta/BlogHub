import { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import { X, Menu, Sun, Moon, LayoutGrid, BookOpen, ArrowLeft, LogOut, PenLine } from 'lucide-react';

export const Layout = () => {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profileRef = useRef(null);

  const isHome = location.pathname === '/';
  const isMyBlogs = location.pathname === '/my-blogs';
  const isWrite = location.pathname === '/write';
  const isDetail = location.pathname.startsWith('/blogs/');

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    setProfileOpen(false);
    setMobileMenuOpen(false);
    await logout();
    navigate('/auth', { replace: true });
  };

  const handleNavigate = (path) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', transition: 'background 0.3s', display: 'flex', flexDirection: 'column' }}>

      {/* ─── NAVBAR ─── */}
      <header className="masthead">
        <div className="masthead-bar">

          {isDetail ? (
            <button className="btn btn-sm btn-outline" onClick={() => navigate('/')} style={{ flexShrink: 0 }}>
              <ArrowLeft size={13} /> Back
            </button>
          ) : (
            <div className="site-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
              Blog<span className="site-logo-dot">.</span>Hub
              <small className="site-logo-sub">Finance · Career · Tech</small>
            </div>
          )}

          <div className="nav-sep" />

          {/* Desktop nav tabs only */}
          <div className="nav-tabs">
            <button className={`nav-tab${isHome || isDetail ? ' active' : ''}`} onClick={() => navigate('/')}>
              <LayoutGrid size={13} /> All Articles
            </button>
            <button className={`nav-tab${isMyBlogs ? ' active' : ''}`} onClick={() => navigate('/my-blogs')}>
              <BookOpen size={13} /> My Blogs
            </button>
          </div>

          <div className="nav-sep" />

          {(isHome || isDetail) && (
            <div className="nav-search">
              <svg className="nav-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                className="nav-search-input"
                placeholder="Search articles…"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); if (isDetail) navigate('/'); }}
              />
              {searchQuery && (
                <button className="nav-search-x" onClick={() => setSearchQuery('')}>
                  <X size={13} />
                </button>
              )}
            </div>
          )}

          <div className="nav-right">
            {/* Mobile hamburger — only visible on mobile via CSS */}
            <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(v => !v)}>
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            {/* Desktop write button */}
            <button className="btn btn-md btn-blue write-article-btn" onClick={() => navigate('/write')}>
              <PenLine size={14} /> Write Article
            </button>

            <button className="theme-toggle" onClick={toggle} title="Toggle theme">
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Desktop profile dropdown — hidden on mobile via CSS */}
            <div className="profile-wrap" ref={profileRef}>
              <button className="user-chip" onClick={() => setProfileOpen(v => !v)}>
                <div className="user-avi">
                  <img src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg" alt="avatar" />
                </div>
                <span className="user-nm">{user?.name?.split(' ')[0]}</span>
              </button>

              {profileOpen && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-header">
                    <div className="profile-dropdown-avi">
                      <img src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg" alt="avatar" />
                    </div>
                    <div>
                      <div className="profile-dropdown-name">{user?.name}</div>
                      <div className="profile-dropdown-email">{user?.email}</div>
                    </div>
                  </div>
                  <div className="profile-dropdown-divider" />
                  {/* ← Removed My Blogs here — already in nav tabs */}
                  <button className="profile-dropdown-item danger" onClick={handleLogout}>
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ─── MOBILE SLIDE DRAWER ─── */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <div className="mobile-menu-backdrop" onClick={() => setMobileMenuOpen(false)} />
          <div className="mobile-menu-panel">

            {/* User info at top */}
            <div className="mobile-menu-header">
              <div className="mobile-menu-user">
                <div className="mobile-menu-avi">
                  <img src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg" alt="avatar" />
                </div>
                <div>
                  <div className="mobile-menu-title">{user?.name}</div>
                  <div className="mobile-menu-sub">{user?.email}</div>
                </div>
              </div>
              <button className="mobile-menu-close" onClick={() => setMobileMenuOpen(false)}>
                <X size={16} />
              </button>
            </div>

            {/* Nav links */}
            <div className="mobile-menu-list">
              <button
                className={`mobile-menu-item${isHome || isDetail ? ' active' : ''}`}
                onClick={() => handleNavigate('/')}
              >
                <LayoutGrid size={16} /> All Articles
              </button>
              <button
                className={`mobile-menu-item${isMyBlogs ? ' active' : ''}`}
                onClick={() => handleNavigate('/my-blogs')}
              >
                <BookOpen size={16} /> My Blogs
              </button>
              <button
                className={`mobile-menu-item${isWrite ? ' active' : ''}`}
                onClick={() => handleNavigate('/write')}
              >
                <PenLine size={16} /> Write Article
              </button>
            </div>

            {/* Sign out at bottom */}
            <div className="mobile-menu-footer">
              <button className="mobile-menu-item danger" onClick={handleLogout}>
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── PAGE CONTENT ─── */}
      <div style={{ flex: 1 }} className="main-content-area">
        <Outlet context={{ searchQuery, setSearchQuery }} />
      </div>

      {/* ─── MOBILE BOTTOM TAB BAR ─── */}
      <nav className="mobile-tabbar">
        <button
          className={`mobile-tab${isHome || isDetail ? ' active' : ''}`}
          onClick={() => navigate('/')}
        >
          <LayoutGrid size={20} />
          <span>Articles</span>
        </button>

        <div className="mobile-tab-write">
          <button className="mobile-write-fab" onClick={() => navigate('/write')} title="Write">
            <PenLine size={18} />
          </button>
        </div>

        <button
          className={`mobile-tab${isMyBlogs ? ' active' : ''}`}
          onClick={() => navigate('/my-blogs')}
        >
          <BookOpen size={20} />
          <span>My Blogs</span>
        </button>
      </nav>

      {/* ─── FOOTER ─── */}
      {!isDetail && (
        <footer className="site-footer">
          <div className="footer-inner">
            <span className="footer-logo">Blog<span className="footer-logo-dot">.</span>Hub</span>
            <span className="footer-copy">© 2026 BlogHub — Curated insights for finance professionals</span>
          </div>
        </footer>
      )}
    </div>
  );
};