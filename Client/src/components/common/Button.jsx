import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-colors duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0AE3DA] focus:ring-offset-2 focus:ring-offset-[#0B1215] disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer tracking-normal';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-2.5 gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-[#0AE3DA] text-[#0B1215] font-semibold hover:bg-[#08C5BD] active:bg-[#07B0A9] border border-[#0AE3DA]',
    secondary:
      'bg-transparent text-[var(--text-primary)] border border-[var(--border-color)] hover:border-[#0AE3DA] hover:text-[#0AE3DA] active:bg-[var(--surface-color)]',
    outline:
      'bg-transparent text-[var(--text-primary)] border border-[var(--border-color)] hover:border-[#0AE3DA] hover:text-[#0AE3DA]',
    ghost:
      'bg-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-color)]',
    danger:
      'bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20 hover:border-red-500/50',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
};

export default Button;
