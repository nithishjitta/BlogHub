import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { useBlogs, useBlog } from '../hooks/useBlogs';
import { BlogCard } from './BlogCard';
import { BlogDetail } from './BlogDetail';
import { ArrowLeft } from 'lucide-react';

export const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { searchQuery } = useOutletContext();

  const { data: blogs } = useBlogs();
  const { data: selectedBlog, isLoading: loadingBlog } = useBlog(id || 0);

  const filtered = blogs?.filter((b) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.title.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q) ||
      b.category.some((c) => c.toLowerCase().includes(q))
    );
  });

  return (
    <>
      {/* Back button — visible on mobile / small screens */}
      <div style={{ padding: '0.75rem 1.5rem 0', display: 'flex' }}>
        <button className="btn btn-sm btn-outline" onClick={() => navigate('/')}>
          <ArrowLeft size={13} /> Back to Articles
        </button>
      </div>

      <div className="split-root">
        {/* ─── SIDEBAR LIST ─── */}
        <aside className="split-aside">
          {filtered?.map((b) => (
            <BlogCard
              key={b._id}
              blog={b}
              sidebar
              isActive={b._id === id || b._id === Number(id)}
              onClick={() => navigate(`/blogs/${b._id}`)}
            />
          ))}
        </aside>

        {/* ─── MAIN CONTENT ─── */}
        <section className="split-main">
          {loadingBlog && (
            <div className="state-center">
              <div className="spinner" />
              <span className="state-txt">Loading article…</span>
            </div>
          )}
          {selectedBlog && <BlogDetail blog={selectedBlog} />}
        </section>
      </div>
    </>
  );
};