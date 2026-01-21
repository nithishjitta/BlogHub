import { Badge } from './ui/badge';
import { Calendar, ArrowUpRight } from 'lucide-react';

export const BlogCard = ({ blog, onClick, featured = false, isActive = false }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (featured) {
    return (
      <div
        onClick={onClick}
        className="group relative overflow-hidden rounded-3xl cursor-pointer
                   transition-all duration-500 bg-white shadow-xl hover:shadow-2xl
                   border border-teal-100"
      >
        <div className="grid md:grid-cols-2 gap-0 relative">
  
          <div className="relative h-96 md:h-full overflow-hidden">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />

            <div className="absolute top-6 left-6">
              <span className="bg-amber-500 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-xl">
                ⭐ Featured
              </span>
            </div>
          </div>

          <div className="p-8 md:p-12 flex flex-col justify-center relative bg-gradient-to-br from-white to-teal-50/30">

            <div className="flex flex-wrap gap-2 mb-4">
              {blog.category.map((cat) => (
                <Badge
                  key={cat}
                  className="bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 font-semibold px-3 py-1.5"
                >
                  {cat}
                </Badge>
              ))}
            </div>

            <h2 className="text-4xl font-black text-slate-900 mb-4 leading-tight">
              {blog.title}
            </h2>

            <p className="text-slate-600 text-lg mb-6 line-clamp-3 leading-relaxed">
              {blog.description}
            </p>

            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2 text-slate-500">
                <Calendar className="h-4 w-4 text-teal-600" />
                <span className="text-sm font-medium">
                  {formatDate(blog.date)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-teal-600 font-semibold">
                <span>Read More</span>
                <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
  onClick={onClick}
  className={`
    group relative overflow-hidden rounded-2xl cursor-pointer
    transition-all duration-300 bg-white shadow-md
    border
    ${isActive
      ? 'border-blue-500 bg-blue-50/40 shadow-lg ring-2 ring-blue-100'
      : 'border-slate-200 hover:shadow-xl'}
  `}
>

      <div className="relative h-56 overflow-hidden">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
      </div>

      <div className="p-6 relative">

        <div className="flex flex-wrap gap-2 mb-3">
          {blog.category.map((cat) => (
            <Badge
              key={cat}
              className="bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 text-xs font-semibold"
            >
              {cat}
            </Badge>
          ))}
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 leading-tight">
          {blog.title}
        </h3>

        <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {blog.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <Calendar className="h-3.5 w-3.5 text-teal-600" />
            <span className="font-medium">
              {formatDate(blog.date)}
            </span>
          </div>

          <div className="flex items-center gap-1 text-teal-600 text-sm font-semibold">
            <span>Read</span>
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
