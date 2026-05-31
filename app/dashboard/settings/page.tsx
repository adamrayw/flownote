'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Lock, Settings, User } from 'lucide-react';
import { useAuthSession } from '@/hooks/use-auth-session';

type MeResponse = {
  user: {
    id: string;
    name: string | null;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function SettingsPage() {
  const { update } = useAuthSession();

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    let active = true;

    const run = async () => {
      try {
        setLoadError('');
        setIsLoading(true);

        const response = await fetch('/api/me', { cache: 'no-store' });
        if (!response.ok) {
          const data = (await response.json().catch(() => null)) as { message?: string } | null;
          throw new Error(data?.message ?? 'Failed to load account settings');
        }

        const data = (await response.json()) as MeResponse;
        if (!active) {
          return;
        }

        setFullName(data.user.name ?? '');
        setEmail(data.user.email);
        setCreatedAt(data.user.createdAt);
      } catch (error) {
        if (active) {
          setLoadError(error instanceof Error ? error.message : 'Failed to load account settings');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void run();

    return () => {
      active = false;
    };
  }, []);

  const memberSinceLabel = useMemo(() => {
    if (!createdAt) {
      return '-';
    }
    return formatDate(createdAt);
  }, [createdAt]);

  const handleUpdateProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setProfileError('');
    setProfileSuccess('');
    setIsSavingProfile(true);

    try {
      const response = await fetch('/api/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fullName,
          email,
        }),
      });

      const data = (await response.json().catch(() => null)) as MeResponse | { message?: string } | null;
      if (!response.ok) {
        const message = (data as { message?: string } | null)?.message ?? 'Failed to update account';
        throw new Error(message);
      }

      const updatedUser = (data as MeResponse).user;
      setFullName(updatedUser.name ?? '');
      setEmail(updatedUser.email);
      setProfileSuccess('Account updated successfully');

      await update({
        name: updatedUser.name,
        email: updatedUser.email,
      });
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : 'Failed to update account');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setPasswordError('');
    setPasswordSuccess('');
    setIsSavingPassword(true);

    try {
      const response = await fetch('/api/me/password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = (await response.json().catch(() => null)) as { message?: string } | null;
      if (!response.ok) {
        throw new Error(data?.message ?? 'Failed to change password');
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordSuccess('Password updated successfully');
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : 'Failed to change password');
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-lg bg-accent/10">
            <Settings className="text-accent" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        </div>
        <p className="text-foreground/60">Manage your account profile and password.</p>
      </div>

      {loadError ? <p className="text-sm text-red-500 mb-4">{loadError}</p> : null}

      <div className="space-y-6">
        <div className="p-6 rounded-lg border border-border bg-card/50">
          <div className="flex items-center gap-3 mb-4">
            <User size={20} className="text-accent" />
            <h2 className="text-xl font-semibold text-foreground">Account</h2>
          </div>
          <p className="text-xs text-foreground/60 mb-4">
            Profile and password are managed by RayTech Account.
          </p>

          {isLoading ? (
            <p className="text-sm text-foreground/60">Loading account...</p>
          ) : (
            <form className="space-y-4" onSubmit={handleUpdateProfile}>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
                  placeholder="name@example.com"
                />
              </div>
              <p className="text-xs text-foreground/50">Member since {memberSinceLabel}</p>

              {profileError ? <p className="text-sm text-red-500">{profileError}</p> : null}
              {profileSuccess ? <p className="text-sm text-emerald-600">{profileSuccess}</p> : null}

              <Button type="submit" disabled={isSavingProfile} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                {isSavingProfile ? 'Saving...' : 'Update Account'}
              </Button>
            </form>
          )}
        </div>

        <div className="p-6 rounded-lg border border-border bg-card/50">
          <div className="flex items-center gap-3 mb-4">
            <Lock size={20} className="text-accent" />
            <h2 className="text-xl font-semibold text-foreground">Security</h2>
          </div>
          <p className="text-xs text-foreground/60 mb-4">
            Change your password from auth.raytech.cloud.
          </p>

          <form className="space-y-4" onSubmit={handleChangePassword}>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
                autoComplete="current-password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
                autoComplete="new-password"
              />
              <p className="text-xs text-foreground/50 mt-1">Minimum 8 characters.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
                autoComplete="new-password"
              />
            </div>

            {passwordError ? <p className="text-sm text-red-500">{passwordError}</p> : null}
            {passwordSuccess ? <p className="text-sm text-emerald-600">{passwordSuccess}</p> : null}

            <Button type="submit" disabled={isSavingPassword} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              {isSavingPassword ? 'Updating...' : 'Change Password'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

