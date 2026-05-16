import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogClose } from './ui/dialog';
import { DialogTitle, DialogDescription } from './ui/dialog';
import { PenLine, X } from 'lucide-react';
import { BlogForm } from './BlogForm';

export const CreateBlogForm = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const root = document.getElementById('root');
    if (!root) return;
    if (open) root.classList.add('dialog-open');
    else root.classList.remove('dialog-open');
    return () => root.classList.remove('dialog-open');
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="btn btn-md btn-blue write-article-btn">
          <PenLine size={14} /> Write Article
        </button>
      </DialogTrigger>

      <DialogContent
        className="dialog-panel"
        style={{
          background: 'var(--surface)',
          border: '1.5px solid var(--border)',
          borderRadius: '18px',
          maxWidth: '780px',
          width: '92vw',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          color: 'var(--text)',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 301,
          boxShadow: 'var(--shadow-xl)',
          transition: 'background 0.25s',
        }}
      >
        <DialogTitle style={{ display: 'none' }}>Publish New Article</DialogTitle>
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
              <button className="dlg-close-btn" title="Close">
                <X size={15} />
              </button>
            </DialogClose>
          </div>
        </div>

        <div className="dlg-body">
          <BlogForm onSuccess={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
