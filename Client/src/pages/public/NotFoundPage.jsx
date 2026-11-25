import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFoundPage() {
  useEffect(() => {
    document.title = 'Page Not Found (404) | CYDEX DIGITAL';
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <span className="font-mono text-xs text-[var(--text-muted)] tracking-wider">ERROR 404</span>

        <h1 className="font-serif text-6xl sm:text-7xl font-normal text-[var(--text-primary)] tracking-tight">
          Page not found.
        </h1>

        <p className="text-[var(--text-muted)] text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
          The page you requested could not be located or may have been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to="/" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full flex items-center justify-center gap-2">
              <Home className="w-4 h-4" /> Return Home
            </Button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-[var(--border-color)] text-sm font-medium text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-colors flex items-center justify-center gap-2 studio-card"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
