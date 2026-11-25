import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/common/Logo';
import { Button } from '../../components/common/Button';
import { Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = 'Sign In | CYDEX DIGITAL';
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError('');
    try {
      const res = await login(data);
      if (res.success && res.data?.user) {
        const role = res.data.user.role;
        if (role === 'admin') {
          const fromAdmin = location.state?.from?.pathname;
          const redirectPath = fromAdmin && fromAdmin.startsWith('/admin') ? fromAdmin : '/admin';
          navigate(redirectPath, { replace: true });
        } else {
          // Normal Client: always redirect to public website (homepage or requested public page)
          const fromPublic = location.state?.from?.pathname;
          const isPublicSafe = fromPublic && !fromPublic.startsWith('/admin') && !fromPublic.startsWith('/portal');
          const redirectPath = isPublicSafe ? fromPublic : '/';
          navigate(redirectPath, { replace: true });
        }
      }
    } catch (err) {
      setServerError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="flex justify-center mb-2">
          <Logo size="large" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[var(--text-primary)]">Sign In</h1>
        <p className="text-xs text-[var(--text-muted)]">
          Access your project dashboard and records.
        </p>
      </div>

      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="studio-card rounded-2xl p-5 sm:p-8 space-y-5 sm:space-y-6">
          {serverError && (
            <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-600 dark:text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="text-xs font-medium text-[var(--text-primary)]">Email Address</label>
              <div className="relative">
                <input
                  id="login-email"
                  type="email"
                  {...register('email')}
                  placeholder="name@company.com"
                  className="w-full bg-[var(--surface-color)] border border-[var(--border-color)] rounded-lg pl-9 pr-3.5 py-2 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#03A094] transition-colors"
                />
                <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              {errors.email && <p className="text-[11px] text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="text-xs font-medium text-[var(--text-primary)]">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type="password"
                  {...register('password')}
                  placeholder="••••••••"
                  className="w-full bg-[var(--surface-color)] border border-[var(--border-color)] rounded-lg pl-9 pr-3.5 py-2 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#03A094] transition-colors"
                />
                <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              {errors.password && <p className="text-[11px] text-red-500">{errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-2"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="pt-4 border-t border-[var(--border-color)] text-center text-xs text-[var(--text-muted)] space-y-2">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="text-[#0AE3DA] hover:underline font-medium">
                Create an account
              </Link>
            </p>
            <p>
              <Link to="/" className="inline-flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to website
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
