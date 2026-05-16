import { useParams, useNavigate } from 'react-router-dom';
import { useBlogs } from '../hooks/useBlogs';
import { BlogCard } from './BlogCard';
import { ArrowLeft, Mail } from 'lucide-react';

export const AuthorProfilePage = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const { data: blogs } = useBlogs();

  const decodedEmail = decodeURIComponent(email);
  const authorBlogs = blogs?.filter((b) => b.author?.email === decodedEmail) || [];
  const author = authorBlogs[0]?.author;

  return (
    <div style={{ minHeight: '100vh' }} className="page-main">
      <section className="hero-wrap fade-up full-hero" style={{ marginBottom: '2rem' }}>
        <button
          className="btn btn-sm btn-outline"
          onClick={() => navigate(-1)}
          style={{ alignSelf: 'flex-start', marginBottom: '1.5rem' }}
        >
          <ArrowLeft size={13} /> Back
        </button>

        <div className="hero-left" style={{ width: '100%' }}>
          <div className="hero-eyebrow">
            <div className="hero-eyebrow-pip" />
            <span className="hero-eyebrow-text">Author Profile</span>
          </div>

          <h1 className="hero-h1">
            {author?.name || 'Unknown Author'}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
            <Mail size={16} />
            <span>{decodedEmail}</span>
          </div>

          <p className="hero-body" style={{ marginTop: '1rem' }}>
            {authorBlogs.length} {authorBlogs.length === 1 ? 'article' : 'articles'} published
          </p>
        </div>
      </section>

      <section className="fade-up d2">
        {authorBlogs.length > 0 ? (
          <div className="featured-grid">
            {authorBlogs.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                onClick={() => navigate(`/blogs/${blog._id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="state-center">
            <div className="state-icon">📝</div>
            <span className="state-txt">No articles yet</span>
          </div>
        )}
      </section>
    </div>
  );
};
