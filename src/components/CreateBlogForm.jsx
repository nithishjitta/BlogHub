import { useState } from 'react';
import { useCreateBlog } from '../hooks/useBlogs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Plus, Loader2 } from 'lucide-react';

export const CreateBlogForm = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [categories, setCategories] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [content, setContent] = useState('');

  const { mutate, isPending } = useCreateBlog();

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(
      {
        title,
        category: categories.split(',').map((c) => c.trim().toUpperCase()),
        description,
        coverImage,
        content,
        date: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          setOpen(false);
          setTitle('');
          setCategories('');
          setDescription('');
          setCoverImage('');
          setContent('');
        },
      }
    );
  };

  const inputClass =
    "w-full px-4 py-3 text-base border-2 border-slate-200 rounded-xl " +
    "focus:border-slate-400 focus:ring-0 outline-none transition";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-slate-900 hover:bg-slate-800 text-white font-semibold gap-2 px-6 shadow-md transition">
          <Plus className="h-5 w-5" />
          Create Article
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[85vh] p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-200 bg-white">
          <DialogTitle className="text-2xl font-semibold text-slate-900">
            Create New Article
          </DialogTitle>
        </DialogHeader>

        <div
          className="overflow-y-auto px-6 py-6"
          style={{ maxHeight: 'calc(85vh - 80px)' }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">
                Article Title *
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a compelling title"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">
                Categories *
              </label>
              <Input
                value={categories}
                onChange={(e) => setCategories(e.target.value)}
                placeholder="Finance, Accounting, Business"
                required
                className={inputClass}
              />
              <p className="text-xs text-slate-500 mt-1">
                Separate with commas
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">
                Short Description
              </label>
              <Textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of the article"
                className={inputClass + " resize-none"}
              />
              <p className="text-xs text-slate-500 text-right mt-1">
                {description.length}/160
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">
                Cover Image URL
              </label>
              <Input
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className={inputClass}
              />
            </div>

            {coverImage && (
              <img
                src={coverImage}
                alt="Preview"
                className="rounded-xl border border-slate-200 h-48 w-full object-cover"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            )}

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">
                Article Content *
              </label>
              <Textarea
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article here..."
                className={inputClass + " resize-none"}
              />
              <p className="text-xs text-slate-500 text-right mt-1">
                {content.length} characters (min 300)
              </p>
            </div>

            <Button
              type="submit"
              disabled={isPending || content.length < 300}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl shadow-md transition disabled:bg-slate-300"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Publishing...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-5 w-5" />
                  Publish Article
                </>
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
