import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Clock, Bookmark, Share2, Heart, MessageCircle, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../AuthContext.jsx';
import { blogApi } from '../api/blogApi.js';
import { blogKeys } from '../hooks/useBlogs';

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
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);

  const invalidateBlog = () => {
    queryClient.invalidateQueries({ queryKey: blogKeys.detail(blog._id) });
    queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
  };

  const likeMutation = useMutation(() => blogApi.likeBlog(blog._id), {
    onSuccess: () => {
      invalidateBlog();
      toast.success('Liked!');
    },
  });

  const shareMutation = useMutation(() => blogApi.shareBlog(blog._id), {
    onSuccess: () => {
      invalidateBlog();
    },
  });

  const saveMutation = useMutation(() => blogApi.saveBlog(blog._id), {
    onSuccess: () => {
      invalidateBlog();
      toast.success('Saved!');
    },
  });

  const commentMutation = useMutation((text) =>
    blogApi.commentBlog(blog._id, { text, authorName: user?.name })
  , {
    onSuccess: () => {
      invalidateBlog();
      setCommentText('');
      setShowCommentForm(false);
      toast.success('Comment posted');
    },
  });

  const handleShare = async () => {
    try {
      await shareMutation.mutateAsync();
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

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    if (!commentText.trim()) {
      return toast.error('Write something before posting');
    }
    commentMutation.mutate(commentText.trim());
  };

  return (
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
        {blog.author?.name && (
          <div className="detail-meta-item" style={{ fontWeight: 500, cursor: 'pointer', color: 'var(--blue)' }} onClick={() => window.location.href = `/author/${encodeURIComponent(blog.author.email)}`}>
            <span>by {blog.author.name}</span>
          </div>
        )}
        <div className="detail-action-row">
          <button className="detail-btn heart" onClick={() => likeMutation.mutate()} disabled={likeMutation.isLoading}>
            <Heart size={13} /> {blog.likes ?? 0}
          </button>
          <button className="detail-btn" onClick={() => setShowCommentForm((value) => !value)}>
            <MessageCircle size={13} /> {blog.comments?.length ?? 0}
          </button>
          <button className="detail-btn save" onClick={() => saveMutation.mutate()} disabled={saveMutation.isLoading}>
            <Bookmark size={13} /> {blog.saves ?? 0}
          </button>
          <button className="detail-btn" onClick={handleShare} disabled={shareMutation.isLoading}>
            <Share2 size={13} /> {blog.shares ?? 0}
          </button>
        </div>
      </div>

      <blockquote className="detail-lede">{blog.description}</blockquote>

      <RichContent content={blog.content} />

      {showCommentForm && (
        <section className="detail-comments-panel">
          <form onSubmit={handleCommentSubmit}>
            <textarea
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder="Share your thoughts on this article"
              rows={4}
            />
            <button type="submit" className="detail-btn save" disabled={commentMutation.isLoading}>
              Post comment
            </button>
          </form>
        </section>
      )}

      {blog.comments?.length > 0 && (
        <section className="detail-comments">
          <h3>Comments</h3>
          {blog.comments.slice().reverse().map((item, index) => (
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
          {blog.category.map((c) => (
            <span key={c} className="tag-pill">#{c.toLowerCase()}</span>
          ))}
        </div>
      </div>
    </article>
  );
};