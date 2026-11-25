import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/common/Logo';
import { Button } from '../../components/common/Button';
import { User, Mail, Lock, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Name cannot exceed 100 characters'),
    email: z
      .string()
      .trim()
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Za-z]/, 'Password must contain at least one letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match. Please ensure both passwords are identical.',
    path: ['confirmPassword'],
  });

export const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = 'Create Client Account | CYDEX DIGITAL';
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError('');
    setSuccessMessage('');
    try {
      const res = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      if (res.success && res.data?.user) {
        setSuccessMessage('Account created successfully! Redirecting...');
        const fromPublic = location.state?.from?.pathname;
        const isPublicSafe = fromPublic && !fromPublic.startsWith('/admin') && !fromPublic.startsWith('/portal');
        const redirectPath = isPublicSafe ? fromPublic : '/';
        setTimeout(() => {
          navigate(redirectPath, { replace: true });
        }, 800);
      } else {
        setServerError(res.message || 'Registration failed. Please check your details.');
      }
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please try again.');
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
        <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[var(--text-primary)]">
          Create Client Account
        </h1>
        <p className="text-xs text-[var(--text-muted)]">
          Sign up to track project milestones, access deliverables, and collaborate with CYDEX DIGITAL.
        </p>
      </div>

      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="studio-card rounded-2xl p-5 sm:p-8 space-y-5 sm:space-y-6">
          {serverError && (
            <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-lg bg-[#0AE3DA]/10 border border-[#0AE3DA]/30 flex items-start gap-3 text-[#0AE3DA] text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="register-name" className="text-xs font-medium text-[var(--text-primary)]">Full Name</label>
              <div className="relative">
                <input
                  id="register-name"
                  type="text"
                  {...register('name')}
                  placeholder="e.g. Sarah Jenkins"
                  autoComplete="name"
                  className="w-full bg-[var(--surface-color)] border border-[var(--border-color)] rounded-lg pl-9 pr-3.5 py-2 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#0AE3DA] transition-colors"
                />
                <User className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              {errors.name && <p className="text-[11px] text-red-500">{errors.name.message}</p>}
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label htmlFor="register-email" className="text-xs font-medium text-[var(--text-primary)]">Email Address</label>
              <div className="relative">
                <input
                  id="register-email"
                  type="email"
                  {...register('email')}
                  placeholder="name@company.com"
                  autoComplete="email"
                  className="w-full bg-[var(--surface-color)] border border-[var(--border-color)] rounded-lg pl-9 pr-3.5 py-2 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#0AE3DA] transition-colors"
                />
                <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              {errors.email && <p className="text-[11px] text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="register-password" className="text-xs font-medium text-[var(--text-primary)]">Password</label>
              <div className="relative">
                <input
                  id="register-password"
                  type="password"
                  {...register('password')}
                  placeholder="At least 8 characters (letters + numbers)"
                  autoComplete="new-password"
                  className="w-full bg-[var(--surface-color)] border border-[var(--border-color)] rounded-lg pl-9 pr-3.5 py-2 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#0AE3DA] transition-colors"
                />
                <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              {errors.password && <p className="text-[11px] text-red-500">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label htmlFor="register-confirmPassword" className="text-xs font-medium text-[var(--text-primary)]">Confirm Password</label>
              <div className="relative">
                <input
                  id="register-confirmPassword"
                  type="password"
                  {...register('confirmPassword')}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  className="w-full bg-[var(--surface-color)] border border-[var(--border-color)] rounded-lg pl-9 pr-3.5 py-2 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#0AE3DA] transition-colors"
                />
                <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-2"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          {/* Links: Sign In & Back to Website */}
          <div className="pt-4 border-t border-[var(--border-color)] text-center text-xs text-[var(--text-muted)] space-y-2">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="text-[#0AE3DA] hover:underline font-medium">
                Sign In
              </Link>
            </p>
            <p>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to website
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
