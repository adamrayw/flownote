'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Menu, Bell, Search, LogOut, Settings } from 'lucide-react';
import { getAuthSignOutUrl } from '@/lib/raytech-account';
import { useAuthSession } from '@/hooks/use-auth-session';

export function DashboardHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const { data: session } = useAuthSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const userName =
    session?.user?.name?.trim() ||
    session?.user?.email?.split('@')[0] ||
    'RayTech User';
  const initials = useMemo(() => {
    const parts = userName.split(' ').filter(Boolean);
    if (parts.length === 0) return 'FN';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }, [userName]);

  useEffect(() => {
    if (pathname !== '/dashboard/notes') {
      return;
    }

    const queryFromUrl = searchParams.get('q')?.trim() ?? '';
    setSearchQuery((prev) => (prev === queryFromUrl ? prev : queryFromUrl));
  }, [pathname, searchParams]);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = searchQuery.trim();
    const params = new URLSearchParams();
    if (query) {
      params.set('q', query);
    }

    const destination = params.toString() ? `/dashboard/notes?${params.toString()}` : '/dashboard/notes';
    router.push(destination);
  };

  const handleSignOut = async () => {
    await fetch(getAuthSignOutUrl(), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({}),
    });

    window.location.href = '/signin';
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors text-foreground/70"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-xl font-semibold text-foreground hidden sm:block">FlowNote</h1>
        </div>

        <form className="hidden md:flex flex-1 max-w-md mx-8" onSubmit={handleSearchSubmit}>
          <div className="w-full relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted/50 border border-border focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
            />
          </div>
        </form>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg hover:bg-muted transition-colors text-foreground/70 relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-sm font-semibold text-accent">
                {initials}
              </div>
              <span className="hidden sm:block text-sm font-medium text-foreground">{userName}</span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg bg-card border border-border shadow-lg py-1">
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <Settings size={16} />
                  Settings
                </Link>
                <button
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/70 hover:text-foreground hover:bg-muted transition-colors border-t border-border mt-1"
                  onClick={async () => {
                    setShowProfileMenu(false);
                    await handleSignOut();
                  }}
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
