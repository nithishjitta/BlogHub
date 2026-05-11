import { Calendar, Clock, Bookmark, Share2, Heart, MessageCircle, TrendingUp } from 'lucide-react';

const fmt = (d) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const readTime = (content) =>
  `${Math.ceil(content.split(' ').length / 200)} min read`;

const RichContent = ({ content }) => {
  const paras = content.split(/\n\n+/).filter(Boolean);
  return (
    <div className="detail-body">
      {paras.map((p, i) => {
        if (i > 0 && i % 3 === 0) {
          const sentence = p.split('. ')[0] + '.';
          return (
            <div key={i}>
              <div className="key-insight">
                <TrendingUp size={14} style={{ display: 'inline', marginRight: '0.45rem', verticalAlign: 'middle', color: 'var(--blue)' }} />
                <strong>Key Insight: </strong>{sentence}
              </div>
              <p>{p}</p>
            </div>
          );
        }
        return <p key={i}>{p}</p>;
      })}
    </div>
  );
};

export const BlogDetail = ({ blog }) => (
  <article className="detail-wrap fade-up">
    <img src={blog.coverImage} alt={blog.title} className="detail-cover" />

    <div className="detail-cats">
      {blog.category.map((c) => <span key={c} className="cat-chip">{c}</span>)}
    </div>

    <h1 className="detail-title">{blog.title}</h1>

    <div className="detail-meta">
      <div className="detail-meta-item">
        <Calendar size={13} />
        <span>{fmt(blog.date)}</span>
      </div>
      <div className="detail-meta-item">
        <Clock size={13} />
        <span>{readTime(blog.content)}</span>
      </div>
      <div className="detail-action-row">
        <button className="detail-btn heart">
          <Heart size={13} /> 48
        </button>
        <button className="detail-btn">
          <MessageCircle size={13} /> 10
        </button>
        <button className="detail-btn save">
          <Bookmark size={13} />
        </button>
        <button className="detail-btn">
          <Share2 size={13} />
        </button>
      </div>
    </div>

    <blockquote className="detail-lede">{blog.description}</blockquote>

    <RichContent content={blog.content} />

    <div className="detail-tags">
      <div className="detail-tags-lbl">Topics</div>
      <div>
        {blog.category.map((c) => (
          <span key={c} className="tag-pill">#{c.toLowerCase()}</span>
        ))}
      </div>
    </div>
  </article>
);