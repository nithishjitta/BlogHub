import { useState } from 'react';
import { useMyBlogs } from '../hooks/useBlogs'; // ← dedicated hook
import { useAuth } from '../AuthContext';
import { Calendar, Clock, FileText, TrendingUp, PenLine, Eye } from 'lucide-react';

const fmt = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const readTime = (content) =>
  `${Math.ceil((content || '').split(' ').length / 200)} min read`;

export const MyBlogs = ({ onOpen }) => {
  const { user } = useAuth();
  const { data: myBlogs = [], isLoading } = useMyBlogs(user?.email); // ← fetch by email
  const [filter, setFilter] = useState('all');

  const allCats = [...new Set(myBlogs.flatMap((b) => b.category || []))];

  const filtered = filter === 'all'
    ? myBlogs
    : myBlogs.filter((b) => b.category?.includes(filter));

  if (isLoading) {
    return (
      <div className="state-center">
        <div className="spinner" />
        <span className="state-txt">Loading your articles…</span>
      </div>
    );
  }

  return (
    <div className="myblogs-root">
      <div className="myblogs-header">
        <div className="myblogs-header-left">
          <div className="hero-eyebrow" style={{ marginBottom: '0.6rem' }}>
            <div className="hero-eyebrow-pip" />
            <span className="hero-eyebrow-text">My Articles</span>
          </div>
          <h2 className="myblogs-title">Your Published Work</h2>
          <p className="myblogs-sub">Articles you've contributed to the BlogHub community.</p>
        </div>

        <div className="myblogs-stats">
          <div className="myblogs-stat">
            <div className="myblogs-stat-icon" style={{ background: 'var(--blue-light)', color: 'var(--blue)' }}>
              <FileText size={16} />
            </div>
            <div>
              <div className="myblogs-stat-n">{myBlogs.length}</div>
              <div className="myblogs-stat-l">Articles</div>
            </div>
          </div>
          <div className="myblogs-stat">
            <div className="myblogs-stat-icon" style={{ background: 'rgba(5,150,105,0.1)', color: 'var(--accent-green)' }}>
              <TrendingUp size={16} />
            </div>
            <div>
              <div className="myblogs-stat-n">{allCats.length}</div>
              <div className="myblogs-stat-l">Categories</div>
            </div>
          </div>
          <div className="myblogs-stat">
            <div className="myblogs-stat-icon" style={{ background: 'rgba(217,119,6,0.1)', color: 'var(--accent-amber)' }}>
              <Clock size={16} />
            </div>
            <div>
              <div className="myblogs-stat-n">
                {myBlogs.reduce((acc, b) => acc + Math.ceil((b.content || '').split(' ').length / 200), 0)}
              </div>
              <div className="myblogs-stat-l">Min of Content</div>
            </div>
          </div>
        </div>
      </div>

      {myBlogs.length === 0 && (
        <div className="myblogs-empty">
          <div className="myblogs-empty-icon"><PenLine size={32} /></div>
          <h3 className="myblogs-empty-title">No articles yet</h3>
          <p className="myblogs-empty-sub">
            You haven't published any articles. Click "Write Article" to get started.
          </p>
        </div>
      )}

      {myBlogs.length > 0 && (
        <>
          <div className="myblogs-filters">
            <button className={`myblogs-filter-btn${filter === 'all' ? ' active' : ''}`} onClick={() => setFilter('all')}>
              All ({myBlogs.length})
            </button>
            {allCats.map((cat) => (
              <button key={cat} className={`myblogs-filter-btn${filter === cat ? ' active' : ''}`} onClick={() => setFilter(cat)}>
                {cat} ({myBlogs.filter((b) => b.category?.includes(cat)).length})
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="state-center" style={{ padding: '3rem' }}>
              <span style={{ fontSize: '2rem' }}>📂</span>
              <span className="state-txt">No articles in this category</span>
            </div>
          ) : (
            <div className="myblogs-list">
              {filtered.map((blog, i) => (
                <div key={blog._id} className="myblogs-item fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="myblogs-thumb">
                    <img src={blog.coverImage} alt={blog.title} />
                  </div>
                  <div className="myblogs-item-body">
                    <div className="cats" style={{ marginBottom: '0.45rem' }}>
                      {blog.category?.map((c) => <span key={c} className="cat-chip">{c}</span>)}
                    </div>
                    <h3 className="myblogs-item-title">{blog.title}</h3>
                    <p className="myblogs-item-desc">{blog.description}</p>
                    <div className="myblogs-item-meta">
                      <span className="myblogs-meta-pill"><Calendar size={11} /> {fmt(blog.date)}</span>
                      <span className="myblogs-meta-pill"><Clock size={11} /> {readTime(blog.content)}</span>
                    </div>
                  </div>
                  <div className="myblogs-item-actions">
                    <button className="myblogs-action-btn read" onClick={() => onOpen(blog._id)} title="Read article">
                      <Eye size={14} /> Read
                    </button>
                  </div>
                  <div className="myblogs-index">{String(i + 1).padStart(2, '0')}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};