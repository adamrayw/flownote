'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Handle sign-in logic here
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with back button */}
      <div className="px-6 py-4 md:px-12 md:py-6 border-b border-border">
        <Link href="/" className="inline-flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to home</span>
        </Link>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 md:py-16">
        <div className="w-full max-w-md">
          {/* Logo and branding */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent text-accent-foreground font-bold text-xl">
                F
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-foreground">FlowNote</div>
                <div className="text-xs font-medium text-foreground/50 uppercase tracking-wider">by raytech.cloud</div>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-8 mb-2">Welcome back</h1>
            <p className="text-foreground/60">Sign in to your FlowNote account to continue</p>
          </div>

          {/* Sign-in form */}
          <form onSubmit={handleSignIn} className="space-y-5">
            {/* Email field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 bg-card border-border placeholder:text-foreground/40"
              />
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs font-medium text-accent hover:text-accent/80 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 bg-card border-border placeholder:text-foreground/40 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Sign in button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-accent hover:bg-accent/90 text-accent-foreground font-medium rounded-lg transition-all disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-foreground/50 font-medium">Or continue with</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* OAuth buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-11 font-medium rounded-lg">
              GitHub
            </Button>
            <Button variant="outline" className="h-11 font-medium rounded-lg">
              Google
            </Button>
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-foreground/60 mt-8">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-semibold text-accent hover:text-accent/80 transition-colors">
              Create one free
            </Link>
          </p>

          {/* Terms and privacy */}
          <p className="text-center text-xs text-foreground/50 mt-6">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="hover:text-foreground/70 transition-colors underline underline-offset-2">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="hover:text-foreground/70 transition-colors underline underline-offset-2">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      {/* Footer branding */}
      <div className="border-t border-border px-6 py-6 md:px-12 text-center text-xs text-foreground/50">
        <p>A premium note-taking experience by <span className="font-medium text-foreground/70">raytech.cloud</span></p>
      </div>
    </div>
  );
}
