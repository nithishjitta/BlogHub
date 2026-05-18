import { useEffect, useState } from 'react';
import { Calendar, Clock, Bookmark, Share2, Heart, MessageCircle, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../AuthContext.jsx';
import { blogApi } from '../api/blogApi.js';

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

export const BlogDetail = ({ blog }) => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [liveBlog, setLiveBlog] = useState(blog);

  useEffect(() => {
    setLiveBlog(blog);
  }, [blog]);

  const handleLike = async () => {
    try {
      const updated = await blogApi.likeBlog(blog._id);
      setLiveBlog(updated);
      toast.success('Liked!');
    } catch (error) {
      toast.error('Like failed');
    }
  };

  const handleSave = async () => {
    try {
      const updated = await blogApi.saveBlog(blog._id);
      setLiveBlog(updated);
      toast.success('Saved!');
    } catch (error) {
      toast.error('Save failed');
    }
  };

  const handleShare = async () => {
    try {
      const updated = await blogApi.shareBlog(blog._id);
      setLiveBlog(updated);
      if (navigator.share) {
        await navigator.share({
          title: blog.title,
          text: blog.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard');
      }
    } catch (error) {
      toast.error('Share failed');
    }
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    if (!commentText.trim()) {
      return toast.error('Write something before posting');
    }

    try {
      const updated = await blogApi.commentBlog(blog._id, {
        text: commentText.trim(),
        authorName: user?.name,
      });
      setLiveBlog(updated);
      setCommentText('');
      setShowCommentForm(false);
      toast.success('Comment posted');
    } catch (error) {
      toast.error('Comment failed');
    }
  };

  return (
    <article className="detail-wrap fade-up">
      <img src={liveBlog.coverImage} alt={liveBlog.title} className="detail-cover" />

      <div className="detail-cats">
        {liveBlog.category?.map((c) => <span key={c} className="cat-chip">{c}</span>)}
      </div>

      <h1 className="detail-title">{liveBlog.title}</h1>

      <div className="detail-meta">
        <div className="detail-meta-item">
          <Calendar size={13} />
          <span>{fmt(liveBlog.date)}</span>
        </div>
        <div className="detail-meta-item">
          <Clock size={13} />
          <span>{readTime(liveBlog.content)}</span>
        </div>
        <div className="detail-meta-item" style={{ fontWeight: 500, cursor: liveBlog.author?.email ? 'pointer' : 'default', color: 'var(--blue)' }} onClick={() => liveBlog.author?.email && (window.location.href = `/author/${encodeURIComponent(liveBlog.author.email)}`)}>
          <span>by {liveBlog.author?.name || 'BlogHub Author'}</span>
        </div>
        <div className="detail-action-row">
          <button className="detail-btn heart" onClick={handleLike}>
            <Heart size={13} /> {liveBlog.likes ?? 0}
          </button>
          <button className="detail-btn" onClick={() => setShowCommentForm((value) => !value)}>
            <MessageCircle size={13} /> {liveBlog.comments?.length ?? 0}
          </button>
          <button className="detail-btn save" onClick={handleSave}>
            <Bookmark size={13} /> {liveBlog.saves ?? 0}
          </button>
          <button className="detail-btn" onClick={handleShare}>
            <Share2 size={13} /> {liveBlog.shares ?? 0}
          </button>
        </div>
      </div>

      <blockquote className="detail-lede">{liveBlog.description}</blockquote>

      <RichContent content={liveBlog.content} />

      {showCommentForm && (
        <section className="detail-comments-panel">
          <form onSubmit={handleCommentSubmit}>
            <textarea
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder="Share your thoughts on this article"
              rows={4}
            />
            <button type="submit" className="detail-btn save">
              Post comment
            </button>
          </form>
        </section>
      )}

      {liveBlog.comments?.length > 0 && (
        <section className="detail-comments">
          <h3>Comments</h3>
          {liveBlog.comments.slice().reverse().map((item, index) => (
            <div key={index} className="comment-card">
              <div className="comment-card-header">
                <strong>{item.author?.name || 'Guest'}</strong>
                <span>{new Date(item.date).toLocaleString()}</span>
              </div>
              <p>{item.text}</p>
            </div>
          ))}
        </section>
      )}

      <div className="detail-tags">
        <div className="detail-tags-lbl">Topics</div>
        <div>
          {liveBlog.category?.map((c) => (
            <span key={c} className="tag-pill">#{c.toLowerCase()}</span>
          ))}
        </div>
      </div>
    </article>
  );
};