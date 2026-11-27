
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { publicService } from '../../services/publicService';
import { Button } from '../../components/common/Button';
import { Search, ArrowRight, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Websites',
  'Mobile Applications',
  'Custom Software',
];

export const PortfolioPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawCategory = searchParams.get('category') || 'All';
  const currentCategory = CATEGORIES.includes(rawCategory) ? rawCategory : 'All';
  const currentSearch = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [projects, setProjects] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(currentSearch);

  useEffect(() => {
    if (rawCategory && !CATEGORIES.includes(rawCategory)) {
      const params = new URLSearchParams(searchParams);
      params.delete('category');
      params.set('page', '1');
      setSearchParams(params, { replace: true });
    }
  }, [rawCategory, searchParams, setSearchParams]);

  useEffect(() => {
    let isMounted = true;
    document.title = 'Portfolio — CYDEX DIGITAL';
    setLoading(true);

    const queryParams = {
      page: currentPage,
      limit: 9,
    };
    if (currentCategory && currentCategory !== 'All') {
      queryParams.category = currentCategory;
    }
    if (currentSearch.trim()) {
      queryParams.search = currentSearch.trim();
    }

    publicService
      .getPortfolio(queryParams)
      .then((res) => {
        if (!isMounted) return;
        const payload = res?.data && Array.isArray(res.data) ? res : res?.data;
        if (payload?.success && Array.isArray(payload.data)) {
          setProjects(payload.data);
          setTotalPages(payload.totalPages || 1);
        } else if (Array.isArray(res)) {
          setProjects(res);
          setTotalPages(1);
        } else {
          setProjects([]);
          setTotalPages(1);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Failed to load portfolio:', err);
        setProjects([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', searchInput);
  };

  return (
    <div className="bg-[var(--bg-color)] text-[var(--text-primary)] selection:bg-[#0AE3DA] selection:text-[#0B1215]">
      <section className="pt-7 pb-12 sm:pt-20 sm:pb-24 lg:pt-28 lg:pb-32 border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4 sm:space-y-6 animate-fade-up">
            <div className="text-xs font-mono uppercase tracking-widest text-[#0AE3DA]">
              // Portfolio
            </div>
            <h1 className="editorial-title text-3xl sm:text-5xl lg:text-6xl font-normal text-[var(--text-primary)]">
              Selected <span className="accent-word">Work</span>.
            </h1>
            <p className="text-sm sm:text-lg text-[var(--text-muted)] leading-relaxed max-w-prose">
              A collection of production websites, mobile applications, and software platforms developed for modern businesses.
            </p>
          </div>
        </div>
      </section>

      <section className="py-5 sm:py-8 border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 sm:gap-4">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {CATEGORIES.map((cat) => (
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

            <form onSubmit={handleSearchSubmit} className="relative sm:w-64">
              <input
                type="text"
                placeholder="Search projects..."
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

      <section className="py-10 sm:py-16 lg:py-24 border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="studio-card p-6 h-72 animate-pulse bg-[var(--surface-color)]" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="studio-card p-12 sm:p-16 text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                {currentSearch || currentCategory !== 'All'
                  ? 'No projects match your filter'
                  : 'No projects published yet'}
              </h2>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-md mx-auto">
                {currentSearch || currentCategory !== 'All'
                  ? 'Try searching with different terms or reset your filters.'
                  : 'We are preparing our latest project deployments. Check back soon or contact us to discuss your upcoming build.'}
              </p>
              <div className="pt-2">
                {currentSearch || currentCategory !== 'All' ? (
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
                ) : (
                  <Link to="/contact">
                    <Button variant="primary" size="sm">
                      Start a Project
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((item) => (
                <div
                  key={item._id}
                  className="studio-card overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {item.coverImage && (
                      <div className="aspect-[16/10] w-full bg-[var(--bg-color)] border-b border-[var(--border-color)] overflow-hidden">
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-6 space-y-3">
                      <div className="text-xs uppercase tracking-wider text-[#0AE3DA] font-mono">
                        {item.category || 'Project'}
                      </div>
                      <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                        {item.title}
                      </h3>
                      <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                        {item.shortDescription || item.summary || item.description}
                      </p>
                      {Array.isArray(item.technologies) && item.technologies.length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-1.5">
                          {item.technologies.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[11px] px-2 py-0.5 rounded bg-[var(--bg-color)] text-[var(--text-muted)] border border-[var(--border-color)] font-mono"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6 pt-4 flex items-center justify-between border-t border-[var(--border-color)] mt-4">
                    <Link
                      to={`/portfolio/${item.slug || item._id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0AE3DA] hover:text-[var(--text-primary)] uppercase tracking-wider transition-colors"
                    >
                      <span>Read Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    {item.projectUrl && (
                      <a
                        href={item.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        <span>View Project</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

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

      <section className="py-24 sm:py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="editorial-title text-4xl sm:text-5xl lg:text-6xl font-normal text-[var(--text-primary)]">
            Ready to start your <span className="accent-word">project</span>?
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed max-w-prose mx-auto">
            Tell us about your project and we will get back to you with a clear plan.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6">
            <Link to="/contact">
              <Button variant="primary" size="lg">
                Start a Project
              </Button>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center text-sm font-medium text-[var(--text-primary)] hover:text-[#0AE3DA] transition-colors py-2 px-1 gap-1.5 group"
            >
              <span>Contact Team</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PortfolioPage;