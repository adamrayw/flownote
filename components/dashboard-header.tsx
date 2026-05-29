'use client';

import { Menu, Bell, Search, LogOut, Settings, User } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function DashboardHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors text-foreground/70"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-xl font-semibold text-foreground hidden sm:block">FlowNote</h1>
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="w-full relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input
              type="text"
              placeholder="Search notes..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted/50 border border-border focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg hover:bg-muted transition-colors text-foreground/70 relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-sm font-semibold text-accent">
                JD
              </div>
              <span className="hidden sm:block text-sm font-medium text-foreground">Jane Doe</span>
            </button>

            {/* Dropdown Menu */}
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
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <User size={16} />
                  Profile
                </Link>
                <button
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/70 hover:text-foreground hover:bg-muted transition-colors border-t border-border mt-1"
                  onClick={() => {
                    setShowProfileMenu(false);
                    // Handle logout
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
