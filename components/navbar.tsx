'use client';

import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur-sm px-6 py-4 md:px-12 md:py-6">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent text-accent-foreground font-bold text-lg">
          F
        </div>
        <span className="text-xl font-semibold text-foreground hidden sm:inline">FlowNote</span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-medium transition-colors ${
              isActive(link.href)
                ? 'text-accent'
                : 'text-foreground/70 hover:text-foreground'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Desktop CTAs */}
      <div className="hidden md:flex items-center gap-3">
        <Link href="/signin">
          <Button variant="outline" className="text-sm">
            Sign In
          </Button>
        </Link>
        <Button className="text-sm bg-accent hover:bg-accent/90 text-accent-foreground">
          Get Early Access
        </Button>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 hover:bg-card rounded-lg transition-colors"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-foreground" />
        ) : (
          <Menu className="w-6 h-6 text-foreground" />
        )}
      </button>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-background border-b border-border md:hidden">
          <div className="flex flex-col p-4 gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-accent/10 text-accent'
                    : 'text-foreground/70 hover:bg-card'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              <Link href="/signin" className="w-full">
                <Button variant="outline" className="text-sm w-full">
                  Sign In
                </Button>
              </Link>
              <Button className="text-sm w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                Get Early Access
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
