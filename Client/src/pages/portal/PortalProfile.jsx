import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { Button } from '../../components/common/Button';
import { User, Lock, CheckCircle2, AlertCircle, Bell, Shield } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  company: z.string().optional(),
  phone: z.string().optional(),
  timezone: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm password is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'New passwords do not match',
  path: ['confirmPassword'],
});

export const PortalProfile = () => {
  const { user, updateProfile } = useAuth();
  const [profileSuccess, setProfileSuccess] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      company: user?.company || '',
      phone: user?.phone || '',
      timezone: user?.timezone || 'UTC',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSave = async (data) => {
    setIsUpdatingProfile(true);
    setProfileError('');
    setProfileSuccess('');
    try {
      const res = await updateProfile(data);
      if (res.success) {
        setProfileSuccess('Profile information updated successfully');
        setTimeout(() => setProfileSuccess(''), 4000);
      }
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const onPasswordChange = async (data) => {
    setIsUpdatingPassword(true);
    setPasswordError('');
    setPasswordSuccess('');
    try {
      const res = await authService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      if (res.success) {
        setPasswordSuccess('Password changed successfully');
        resetPasswordForm();
        setTimeout(() => setPasswordSuccess(''), 4000);
      }
    } catch (err) {
      setPasswordError(err.message || 'Current password incorrect');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-10 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white font-display">Account & Security Settings</h1>
        <p className="text-xs text-[#E5E7E7]/70 mt-1">
          Manage your contact credentials, organization identity, and account security.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Profile Card */}
        <div className="bg-[#0c222a] border border-[#143542] rounded-3xl p-7 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-[#143542] pb-4">
            <User className="w-5 h-5 text-[#0AE3DA]" />
            <h3 className="text-base font-bold text-white font-display">Profile Information</h3>
          </div>

          {profileSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{profileSuccess}</span>
            </div>
          )}

          {profileError && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{profileError}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit(onProfileSave)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#E5E7E7]/90">Full Name</label>
              <input
                type="text"
                {...registerProfile('name')}
                className="w-full bg-[#06161B] border border-[#143542] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
              />
              {profileErrors.name && <p className="text-[11px] text-red-400">{profileErrors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#E5E7E7]/90">Email Address (Read-only)</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full bg-[#06161B]/50 border border-[#143542] rounded-xl px-4 py-2.5 text-xs text-[#E5E7E7]/50 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#E5E7E7]/90">Company Name</label>
              <input
                type="text"
                {...registerProfile('company')}
                className="w-full bg-[#06161B] border border-[#143542] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#E5E7E7]/90">Phone Number</label>
              <input
                type="tel"
                {...registerProfile('phone')}
                className="w-full bg-[#06161B] border border-[#143542] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
              />
            </div>

            <Button type="submit" variant="primary" size="md" className="w-full" isLoading={isUpdatingProfile}>
              Save Changes
            </Button>
          </form>
        </div>

        {/* Password Security Card */}
        <div className="bg-[#0c222a] border border-[#143542] rounded-3xl p-7 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-[#143542] pb-4">
            <Lock className="w-5 h-5 text-[#03A094]" />
            <h3 className="text-base font-bold text-white font-display">Change Password</h3>
          </div>

          {passwordSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit(onPasswordChange)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#E5E7E7]/90">Current Password</label>
              <input
                type="password"
                {...registerPassword('currentPassword')}
                placeholder="••••••••"
                className="w-full bg-[#06161B] border border-[#143542] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
              />
              {passwordErrors.currentPassword && (
                <p className="text-[11px] text-red-400">{passwordErrors.currentPassword.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#E5E7E7]/90">New Password (min 8 chars)</label>
              <input
                type="password"
                {...registerPassword('newPassword')}
                placeholder="••••••••"
                className="w-full bg-[#06161B] border border-[#143542] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
              />
              {passwordErrors.newPassword && (
                <p className="text-[11px] text-red-400">{passwordErrors.newPassword.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#E5E7E7]/90">Confirm New Password</label>
              <input
                type="password"
                {...registerPassword('confirmPassword')}
                placeholder="••••••••"
                className="w-full bg-[#06161B] border border-[#143542] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#0AE3DA]"
              />
              {passwordErrors.confirmPassword && (
                <p className="text-[11px] text-red-400">{passwordErrors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" variant="secondary" size="md" className="w-full" isLoading={isUpdatingPassword}>
              Update Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PortalProfile;

