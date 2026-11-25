import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { publicService } from '../../services/publicService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Button } from '../../components/common/Button';
import { Calendar, ArrowLeft, ArrowRight, Share2, Tag } from 'lucide-react';

export const BlogDetailPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    publicService
      .getBlogPostBySlug(slug)
      .then((res) => {
        if (res.success && res.data) {
          setPost(res.data.post);
          setRelated(res.data.related || []);
          document.title = `${res.data.post.title} — CYDEX DIGITAL`;
        } else {
          setPost(null);
          setRelated([]);
          document.title = 'Article Not Found — CYDEX DIGITAL';
        }
      })
      .catch((err) => {
        console.error(err);
        setPost(null);
        setRelated([]);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const copyArticleLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading CYDEX DIGITAL article..." />;
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-28 text-center space-y-6">
        <h2 className="editorial-title text-3xl font-normal text-[var(--text-primary)]">
          Article Not Found
        </h2>
        <p className="text-sm text-[var(--text-muted)]">The requested article is no longer available.</p>
        <Link to="/blog">
          <Button variant="primary" size="md">
            Return to Blog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <article className="bg-[var(--bg-color)] text-[var(--text-primary)] selection:bg-[#0AE3DA] selection:text-[#0B1215]">
      {/* Header */}
      <section className="pt-7 pb-10 sm:py-16 lg:py-24 border-b border-[var(--border-color)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)] hover:text-[#0AE3DA] uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Journal</span>
          </Link>

          <div className="text-xs font-mono uppercase tracking-widest text-[#0AE3DA]">
            // {post.category || 'Article'}
          </div>

          <h1 className="editorial-title text-3xl sm:text-5xl lg:text-6xl font-normal text-[var(--text-primary)] leading-[1.12]">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--border-color)] text-xs text-[var(--text-muted)]">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
            </div>

            <button
              onClick={copyArticleLink}
              className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[#0AE3DA] transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copied' : 'Share Article'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Cover & Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-8 sm:space-y-12">
        {post.coverImage && (
          <div className="aspect-video w-full rounded-md overflow-hidden bg-[var(--surface-color)] border border-[var(--border-color)]">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="prose prose-invert max-w-none text-[var(--text-muted)] leading-relaxed space-y-6 text-base sm:text-lg">
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content || '') }} />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="pt-8 border-t border-[var(--border-color)] flex flex-wrap gap-2">
            {post.tags.map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-[var(--surface-color)] border border-[var(--border-color)] text-[var(--text-muted)]"
              >
                <Tag className="w-3 h-3 text-[#0AE3DA]" />
                <span>{tag}</span>
              </span>
            ))}
          </div>
        )}

        {/* Related articles */}
        {related.length > 0 && (
          <div className="pt-16 border-t border-[var(--border-color)] space-y-6">
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">
              Related Articles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map((item) => (
                <Link
                  key={item._id}
                  to={`/blog/${item.slug}`}
                  className="studio-card p-6 block space-y-2 group"
                >
                  <h4 className="text-base font-semibold text-[var(--text-primary)] group-hover:text-[#0AE3DA] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2">
                    {item.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default BlogDetailPage;
