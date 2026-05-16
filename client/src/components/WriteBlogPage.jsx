import { PenLine } from 'lucide-react';
import { BlogForm } from './BlogForm';

export const WriteBlogPage = () => {
  return (
    <main className="page-main">
      <section className="hero-wrap fade-up full-hero">
        <div className="hero-left" style={{ width: '100%' }}>
          <div className="hero-eyebrow">
            <div className="hero-eyebrow-pip" />
            <span className="hero-eyebrow-text">Write Article</span>
          </div>
          <h1 className="hero-h1">
            Share your expertise with <em>BlogHub</em>.
          </h1>
          <p className="hero-body">
            Publish a thoughtful article for finance professionals, career builders, and technology leaders.
            The editor below helps you draft a full post with image preview, categories, and publication-ready content.
          </p>
        </div>
      </section>

      <section className="fade-up d2 write-page-panel">
        <div className="write-page-card">
          <div className="write-page-head">
            <div>
              <span className="sec-head-label">Publish a new article</span>
              <h2>Bring a fresh story to BlogHub.</h2>
              <p className="hero-body" style={{ marginTop: '0.75rem' }}>
                Add your headline, categories, summary, and the full article content. When you publish, your post goes live for all readers.
              </p>
            </div>
            <div className="write-page-chip">
              <PenLine size={16} /> Begin writing
            </div>
          </div>

          <BlogForm />
        </div>
      </section>
    </main>
  );
};
