import { Badge } from './ui/badge';
import {
  Calendar,
  Clock,
  Share2,
  BookmarkPlus,
  Heart,
  MessageCircle,
} from 'lucide-react';
import { Button } from './ui/button';

export const BlogDetail = ({ blog }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    return `${Math.ceil(words / wordsPerMinute)} min read`;
  };

  const paragraphs = blog.content
    .split(/\n\n+/)
    .filter((p) => p.trim());

  return (
    <article className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">

      <div className="relative h-[420px] overflow-hidden">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />

        <div className="absolute top-6 right-6 flex gap-3">
          <Button
            size="icon"
            className="bg-white hover:bg-slate-100 text-slate-800 shadow-lg rounded-xl w-11 h-11 transition"
          >
            <BookmarkPlus className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            className="bg-white hover:bg-slate-100 text-slate-800 shadow-lg rounded-xl w-11 h-11 transition"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
          {blog.category.map((cat) => (
            <Badge
              key={cat}
              className="bg-white text-slate-900 px-4 py-2 font-semibold shadow-md border-0"
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      <div className="px-8 md:px-16 py-12">
  
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 pb-8 mb-10 border-b border-slate-200">
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold">
              {formatDate(blog.date)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold">
              {getReadTime(blog.content)}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-5">
            <button className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors">
              <Heart className="h-5 w-5" />
              <span className="font-semibold text-sm">48</span>
            </button>
            <button className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors">
              <MessageCircle className="h-5 w-5" />
              <span className="font-semibold text-sm">10</span>
            </button>
          </div>
        </div>

        <div className="mb-12">
          <p className="text-xl md:text-2xl text-slate-700 leading-relaxed border-l-4 border-amber-500 pl-6 py-4 bg-amber-50 rounded-r-xl font-medium">
            {blog.description}
          </p>
        </div>

        <div className="space-y-6">
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-slate-700 leading-relaxed text-lg"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Related Topics
          </h3>
          <div className="flex flex-wrap gap-3">
            {blog.category.map((cat) => (
              <button
                key={cat}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-semibold text-sm transition border border-slate-200"
              >
                #{cat.toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};
