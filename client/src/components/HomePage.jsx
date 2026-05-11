import { useNavigate, useOutletContext } from 'react-router-dom';
import { useBlogs } from '../hooks/useBlogs';
import { BlogCard } from '../components/BlogCard';

export const HomePage = () => {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useOutletContext();

  const { data: blogs, isLoading, error } = useBlogs();

  const filtered = blogs?.filter((b) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.title.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q) ||
      b.category.some((c) => c.toLowerCase().includes(q))
    );
  });

  const handleOpen = (id) => {
    if (window.innerWidth < 768) window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/blogs/${id}`);
  };

  return (
    <main className="page-main">
      {/* ─── HERO ─── */}
      <section className="hero-wrap fade-up full-hero">
        <div className="hero-left" style={{ width: '100%' }}>
          <div className="hero-eyebrow">
            <div className="hero-eyebrow-pip" />
            <span className="hero-eyebrow-text">Latest Articles</span>
          </div>
          <h1 className="hero-h1">
            Insights that <em>shape</em><br />your financial future.
          </h1>
          <p className="hero-body">
            Expert perspectives on finance, taxation, accounting technology, and professional careers — written for the modern CA.
          </p>
        </div>
      </section>

      {/* ─── LOADING ─── */}
      {isLoading && (
        <div className="state-center">
          <div className="spinner" />
          <span className="state-txt">Loading articles…</span>
        </div>
      )}

      {/* ─── ERROR ─── */}
      {error && (
        <div className="error-box">
          ⚠ Cannot connect to server. Make sure{' '}
          <code style={{ fontFamily: 'monospace', background: 'var(--bg-3)', padding: '1px 5px', borderRadius: '3px' }}>
            json-server
          </code>{' '}
          is running on port 3001.
        </div>
      )}

      {/* ─── ARTICLES ─── */}
      {filtered && filtered.length > 0 && (
        <div className="fade-up d2">
          <BlogCard blog={filtered[0]} featured onClick={() => handleOpen(filtered[0]._id)} />

          {filtered.length > 1 && (
            <div className="sec-head">
              <span className="sec-head-label">More Stories</span>
              <div className="sec-head-line" />
              <span className="sec-head-count">{filtered.length - 1} articles</span>
            </div>
          )}

          <div className="blog-grid">
            {filtered.slice(1).map((b) => (
              <BlogCard key={b._id} blog={b} onClick={() => handleOpen(b._id)} />
            ))}
          </div>
        </div>
      )}

      {/* ─── EMPTY SEARCH ─── */}
      {filtered && filtered.length === 0 && !isLoading && (
        <div className="state-center">
          <span style={{ fontSize: '2.5rem' }}>🔍</span>
          <span className="state-txt">No articles match your search</span>
          <button className="btn btn-sm btn-outline" onClick={() => setSearchQuery('')}>
            Clear search
          </button>
        </div>
      )}
    </main>
  );
};