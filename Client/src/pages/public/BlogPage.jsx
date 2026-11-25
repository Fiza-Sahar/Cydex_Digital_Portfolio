import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { publicService } from '../../services/publicService';
import { Button } from '../../components/common/Button';
import { Search, Calendar, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export const BlogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || 'All';
  const currentSearch = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState(currentSearch);

  useEffect(() => {
    document.title = 'Blog — CYDEX DIGITAL';
    publicService.getBlogCategories().then((res) => {
      if (res.success && res.data) setCategories(res.data);
    });
  }, []);

  useEffect(() => {
    publicService
      .getBlogPosts({
        category: currentCategory,
        search: currentSearch,
        page: currentPage,
        limit: 9,
      })
      .then((res) => {
        if (res.success) {
          setPosts(res.data || []);
          setTotalPages(res.totalPages || 1);
        }
      })
      .catch((err) => console.error(err));
  }, [currentCategory, currentSearch, currentPage]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== 'page') params.set('page', '1');
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateParam('search', searchInput);
  };

  const allCategories = ['All', ...categories.map((c) => (typeof c === 'string' ? c : c.name || c.title))];

  return (
    <div className="bg-[var(--bg-color)] text-[var(--text-primary)] selection:bg-[#0AE3DA] selection:text-[#0B1215]">
      {/* 1. Header */}
      <section className="pt-7 pb-12 sm:pt-20 sm:pb-24 lg:pt-28 lg:pb-32 border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4 sm:space-y-6 animate-fade-up">
            <div className="text-xs font-mono uppercase tracking-widest text-[#0AE3DA]">
              // Insights
            </div>
            <h1 className="editorial-title text-3xl sm:text-5xl lg:text-6xl font-normal text-[var(--text-primary)]">
              Engineering <span className="accent-word">Journal</span>.
            </h1>
            <p className="text-sm sm:text-lg text-[var(--text-muted)] leading-relaxed max-w-prose">
              Notes, architectural decisions, and technical insights from our software team.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Controls & Categories */}
      <section className="py-5 sm:py-8 border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 sm:gap-4">
            {allCategories.length > 1 && (
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => updateParam('category', cat)}
                    className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      currentCategory === cat
                        ? 'bg-[#0AE3DA] text-[#0B1215] font-semibold'
                        : 'bg-[var(--surface-color)] text-[var(--text-muted)] border border-[var(--border-color)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSearch} className="relative sm:w-64">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-[var(--surface-color)] border border-[var(--border-color)] rounded-md px-3.5 py-1.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[#0AE3DA]"
              />
              <button
                type="submit"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[#0AE3DA]"
                aria-label="Submit search"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 3. Articles Grid or Clean Empty State */}
      <section className="py-10 sm:py-16 lg:py-24 border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="studio-card p-12 sm:p-16 text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                {currentSearch || currentCategory !== 'All'
                  ? 'No articles found'
                  : 'No articles published yet'}
              </h2>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-md mx-auto">
                {currentSearch || currentCategory !== 'All'
                  ? 'Try searching with different terms or reset your filters.'
                  : 'Check back soon for new articles and technical updates from our engineering team.'}
              </p>
              {(currentSearch || currentCategory !== 'All') && (
                <div className="pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSearchInput('');
                      setSearchParams({});
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="studio-card overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {post.coverImage && (
                      <div className="aspect-video w-full overflow-hidden bg-[var(--bg-color)] border-b border-[var(--border-color)]">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-base font-semibold text-[var(--text-primary)] line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-[var(--border-color)] mt-4 pt-4">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="text-xs font-semibold text-[#0AE3DA] hover:text-[var(--text-primary)] uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>Read Article</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => updateParam('page', currentPage - 1)}
                className="p-2 rounded-md border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-[var(--text-muted)] px-3">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => updateParam('page', currentPage + 1)}
                className="p-2 rounded-md border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
