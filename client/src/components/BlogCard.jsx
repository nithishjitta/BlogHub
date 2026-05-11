import { Calendar, ArrowRight } from 'lucide-react';

const fmt = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

/* ── FEATURED ── */
const FeaturedCard = ({ blog, onClick }) => (
  <div className="featured-card" onClick={onClick}>
    <div className="feat-img">
      <img src={blog.coverImage} alt={blog.title} />
      <div className="feat-img-overlay" />
      <div className="feat-badge">Featured</div>
    </div>
    <div className="feat-body">
      <div className="cats">
        {blog.category.map((c) => <span key={c} className="cat-chip">{c}</span>)}
      </div>
      <h2 className="feat-title">{blog.title}</h2>
      <p className="feat-desc">{blog.description}</p>
      <div className="art-foot">
        <div className="art-date">
          <Calendar size={13} />
          <span>{fmt(blog.date)}</span>
        </div>
        <span className="read-cta">Read Article <ArrowRight size={13} /></span>
      </div>
    </div>
  </div>
);

/* ── GRID CARD ── */
const GridCard = ({ blog, onClick, isActive }) => (
  <div className={`blog-card${isActive ? ' active' : ''}`} onClick={onClick}>
    <div className="card-img">
      <img src={blog.coverImage} alt={blog.title} />
      <div className="card-img-fade" />
    </div>
    <div className="card-body">
      <div className="cats" style={{ marginBottom: '0.6rem' }}>
        {blog.category.map((c) => <span key={c} className="cat-chip">{c}</span>)}
      </div>
      <h3 className="card-title">{blog.title}</h3>
      <p className="card-desc">{blog.description}</p>
      <div className="card-foot">
        <div className="art-date">
          <Calendar size={12} />
          <span>{fmt(blog.date)}</span>
        </div>
        <span className="read-cta" style={{ fontSize: '0.74rem' }}>
          Read <ArrowRight size={12} />
        </span>
      </div>
    </div>
  </div>
);

/* ── SIDEBAR ── */
const SidebarCard = ({ blog, onClick, isActive }) => (
  <div className={`aside-item${isActive ? ' aside-active' : ''}`} onClick={onClick}>
    <div className="aside-thumb">
      <img src={blog.coverImage} alt={blog.title} />
    </div>
    <div className="aside-meta">
      <div className="aside-cats">
        {blog.category.slice(0, 2).map((c) => <span key={c} className="aside-cat">{c}</span>)}
      </div>
      <div className="aside-title">{blog.title}</div>
      <div className="aside-date">{fmt(blog.date)}</div>
    </div>
  </div>
);

export const BlogCard = ({ blog, onClick, featured = false, sidebar = false, isActive = false }) => {
  if (featured) return <FeaturedCard blog={blog} onClick={onClick} />;
  if (sidebar)  return <SidebarCard  blog={blog} onClick={onClick} isActive={isActive} />;
  return          <GridCard  blog={blog} onClick={onClick} isActive={isActive} />;
};