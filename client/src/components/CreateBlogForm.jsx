import { useState, useEffect } from 'react';
import { useCreateBlog } from '../hooks/useBlogs';
import { useAuth } from '../AuthContext';
import {
  Dialog, DialogContent, DialogTrigger, DialogClose,
} from './ui/dialog';
import { DialogTitle, DialogDescription } from './ui/dialog';
import { Plus, Loader2, PenLine, X } from 'lucide-react';
import toast from 'react-hot-toast';

export const CreateBlogForm = () => {
  const { user } = useAuth(); // ← get logged in user
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [categories, setCategories] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [content, setContent] = useState('');

  const { mutate, isPending } = useCreateBlog();

  useEffect(() => {
    const root = document.getElementById('root');
    if (!root) return;
    if (open) root.classList.add('dialog-open');
    else root.classList.remove('dialog-open');
    return () => root.classList.remove('dialog-open');
  }, [open]);

  const reset = () => {
    setTitle(''); setCategories(''); setDescription('');
    setCoverImage(''); setContent('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(
      {
        title,
        category: categories.split(',').map((c) => c.trim().toUpperCase()).filter(Boolean),
        description,
        coverImage,
        content,
        date: new Date().toISOString(),
        author: {
          name: user.name,   // ← save author name
          email: user.email, // ← save author email (used to fetch user's blogs)
        },
      },
      {
        onSuccess: () => {
          setOpen(false);
          reset();
          toast.custom(() => (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: '14px',
              padding: '16px 18px', borderRadius: '14px',
              border: '1.5px solid var(--border)',
              background: 'var(--surface)',
              boxShadow: 'var(--shadow-lg)',
              maxWidth: '420px', width: '100%',
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(5,150,105,0.1)', color: 'var(--accent-green)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', flexShrink: 0,
              }}>✓</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text)', marginBottom: '2px' }}>
                  Article published successfully!
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Your article is now live and visible to all BlogHub readers.
                </div>
              </div>
            </div>
          ), { duration: 4000, position: 'bottom-center' });
        },
        onError: () => {
          toast.custom(() => (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: '14px',
              padding: '16px 18px', borderRadius: '14px',
              border: '1.5px solid rgba(220,38,38,0.3)',
              background: 'var(--surface)',
              boxShadow: 'var(--shadow-lg)',
              maxWidth: '420px', width: '100%',
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(220,38,38,0.1)', color: 'var(--accent-red)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', flexShrink: 0,
              }}>✕</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text)', marginBottom: '2px' }}>
                  Could not publish article
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Something went wrong. Please check your connection and try again.
                </div>
              </div>
            </div>
          ), { duration: 4000, position: 'bottom-center' });
        },
      }
    );
  };

  const contentOk = content.length >= 300;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="btn btn-md btn-blue">
          <PenLine size={14} /> Write Article
        </button>
      </DialogTrigger>

      <DialogContent style={{
        background: 'var(--surface)', border: '1.5px solid var(--border)',
        borderRadius: '18px', maxWidth: '780px', width: '92vw', maxHeight: '90vh',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        padding: 0, color: 'var(--text)', position: 'fixed',
        top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        zIndex: 301, boxShadow: 'var(--shadow-xl)', transition: 'background 0.25s',
      }}>
        <DialogTitle style={{ display: 'none' }}>
  Publish New Article
</DialogTitle>

<DialogDescription style={{ display: 'none' }}>
  Form to create and publish a new blog article.
</DialogDescription>
        <div className="dlg-head">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <div className="dlg-title">Publish New Article</div>
              <div className="dlg-sub">Share your expertise with the BlogHub community</div>
            </div>
            <DialogClose asChild>
              <button className="dlg-close-btn" title="Close"><X size={15} /></button>
            </DialogClose>
          </div>
        </div>

        <div className="dlg-body">
          <form onSubmit={handleSubmit}>
            <div className="f-grid2">
              <div className="f-row">
                <label className="f-lbl">Article Title *</label>
                <input className="f-inp" placeholder="Enter a compelling headline…"
                  value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="f-row">
                <label className="f-lbl">Categories *</label>
                <input className="f-inp" placeholder="Finance, Tech, Career"
                  value={categories} onChange={(e) => setCategories(e.target.value)} required />
                <div className="f-hint"><span>Comma-separated</span></div>
              </div>
              <div className="f-row f-span2">
                <label className="f-lbl">Short Description</label>
                <textarea className="f-area" rows={3} placeholder="A brief summary that draws readers in…"
                  value={description} onChange={(e) => setDescription(e.target.value)} style={{ resize: 'none' }} />
                <div className="f-hint">
                  <span />
                  <span className={description.length > 140 ? 'f-hint-ok' : ''}>{description.length}/160</span>
                </div>
              </div>
              <div className="f-row f-span2">
                <label className="f-lbl">Cover Image URL</label>
                <input className="f-inp" type="url" placeholder="https://example.com/image.jpg"
                  value={coverImage} onChange={(e) => setCoverImage(e.target.value)} />
              </div>
            </div>

            {coverImage && (
              <img src={coverImage} alt="Preview" className="f-preview"
                onError={(e) => (e.currentTarget.style.display = 'none')} />
            )}

            <div className="f-row">
              <label className="f-lbl">Article Content *</label>
              <textarea className="f-area" rows={10}
                placeholder="Write your full article here. Use double line breaks to separate paragraphs…"
                value={content} onChange={(e) => setContent(e.target.value)}
                style={{ resize: 'none' }} required />
              <div className="f-hint">
                <span className={contentOk ? 'f-hint-ok' : ''}>
                  {contentOk ? '✓ Minimum met' : `${300 - content.length} more characters needed`}
                </span>
                <span>{content.length} chars</span>
              </div>
            </div>

            <button type="submit" className="f-submit"
              disabled={isPending || !title || !categories || !contentOk}>
              {isPending
                ? <><Loader2 size={15} style={{ animation: 'spin 0.75s linear infinite' }} /> Publishing…</>
                : <><Plus size={15} /> Publish Article</>}
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};