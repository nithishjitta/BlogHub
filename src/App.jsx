import { useState } from "react";
import { useBlogs, useBlog } from "./hooks/useBlogs";
import { BlogCard } from "./components/BlogCard";
import { BlogDetail } from "./components/BlogDetail";
import { CreateBlogForm } from "./components/CreateBlogForm";
import { Loader2, AlertCircle, Search, X, ArrowLeft } from "lucide-react";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

function App() {
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const {
    data: blogs,
    isLoading: isLoadingBlogs,
    error: blogsError,
  } = useBlogs();
  const { data: selectedBlog, isLoading: isLoadingBlog } = useBlog(
    selectedBlogId || 0,
  );

  const handleBlogClick = (blogId) => {
    setSelectedBlogId(blogId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToGrid = () => {
    setSelectedBlogId(null);
  };

  const filteredBlogs = blogs?.filter((blog) => {
    const matchesSearch =
      searchQuery === "" ||
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.category.some((cat) =>
        cat.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesCategory =
      !selectedCategory || blog.category.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
      <header className="bg-white/95 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-black tracking-tight">
                <span className="text-gray-900">Blog</span>
                <span className="text-blue-600">Hub</span>
              </h1>
              <span className="hidden md:block text-sm text-gray-500 border-l border-gray-300 pl-4">
                Discover amazing content
              </span>
            </div>

            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {selectedBlogId && (
                <Button
                  variant="ghost"
                  onClick={handleBackToGrid}
                  className="text-blue-600 hover:bg-blue-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              )}
              <CreateBlogForm />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {!selectedBlogId && (
          <>
            <div className="mb-12 text-center">
              <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-4">
                Latest Articles
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Explore insights, stories, and knowledge from our community
              </p>
            </div>

            {isLoadingBlogs && (
              <div className="flex justify-center py-24">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              </div>
            )}

            {blogsError && (
              <div className="max-w-2xl mx-auto bg-red-50 border-2 border-red-200 rounded-2xl p-8">
                <AlertCircle className="h-6 w-6 text-red-600 mb-2" />
                <p className="text-red-700">
                  Please ensure the JSON server is running on port 3001
                </p>
              </div>
            )}

            {filteredBlogs && filteredBlogs.length > 0 && (
              <div className="space-y-12">
                <BlogCard
                  blog={filteredBlogs[0]}
                  featured
                  onClick={() => handleBlogClick(filteredBlogs[0].id)}
                />

                <div className="grid md:grid-cols-2 gap-8">
                  {filteredBlogs.slice(1).map((blog) => (
                    <BlogCard
                      key={blog.id}
                      blog={blog}
                      onClick={() => handleBlogClick(blog.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {selectedBlogId && (
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 h-[calc(100vh-80px)]">
            <aside
              className="
    w-full
    lg:w-[35%]
    h-full
    border-b lg:border-b-0 lg:border-r border-gray-200
    pb-8 lg:pb-0
    lg:pr-10
    overflow-y-auto
    space-y-8
  "
            >
              {filteredBlogs?.map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  isActive={blog.id === selectedBlogId}
                  onClick={() => handleBlogClick(blog.id)}
                />
              ))}
            </aside>

            <section
              className="
    w-full
    lg:w-[65%]
    h-full
    lg:pl-10
    overflow-y-auto
  "
            >
              {isLoadingBlog && (
                <div className="flex justify-center py-24">
                  <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                </div>
              )}

              {selectedBlog && (
                <div className="max-w-5xl mx-auto">
                  <BlogDetail blog={selectedBlog} />
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {!selectedBlogId && (
        <footer className="bg-white border-t border-gray-200 mt-24">
          <div className="max-w-7xl mx-auto px-6 py-12 text-center">
            <h3 className="text-2xl font-bold text-gray-900">
              Blog<span className="text-blue-600">Hub</span>
            </h3>
            <p className="text-gray-600">Share your knowledge with the world</p>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
