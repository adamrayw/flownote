'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Heart, Archive, Tag, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/notes', label: 'Notes', icon: FileText },
  { href: '/dashboard/favorites', label: 'Favorites', icon: Heart },
  { href: '/dashboard/archived', label: 'Archived', icon: Archive },
  { href: '/dashboard/tags', label: 'Tags', icon: Tag },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden md:flex flex-col border-r border-border bg-card/50 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent text-accent-foreground font-bold text-sm">
                F
              </div>
              <span className="font-semibold text-foreground">FlowNote</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-foreground/60"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-accent/10 text-accent font-medium'
                    : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon size={20} className="flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border text-xs text-foreground/50 text-center">
          {!isCollapsed && <p>© FlowNote by raytech.cloud</p>}
        </div>
      </div>

      {/* Mobile Navigation Button - shown in header */}
    </>
  );
}
