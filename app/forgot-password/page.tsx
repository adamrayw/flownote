'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { FlowNoteLogo } from '@/components/brand/flownote-logo';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Validate email
    if (!email) {
      setError('Email address is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navigation */}
      <nav className="flex items-center border-b border-border px-6 py-4 md:px-12 md:py-6">
        <div className="flex items-center gap-2">
          <FlowNoteLogo className="h-9 w-9" priority />
          <span className="text-xl font-semibold text-foreground">FlowNote</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 md:py-0">
        <div className="w-full max-w-md space-y-8">
          {/* Back Link */}
          <Link href="/signin" className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>

          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="space-y-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 mx-auto">
                  <Mail className="w-6 h-6 text-accent" />
                </div>
                <h1 className="text-2xl md:text-3xl font-semibold text-foreground text-center">
                  Reset your password
                </h1>
                <p className="text-sm text-foreground/60 text-center">
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-foreground">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    className={`w-full px-4 py-2.5 rounded-lg border bg-card text-foreground placeholder:text-foreground/40 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent ${
                      error ? 'border-destructive' : 'border-border'
                    }`}
                  />
                  {error && (
                    <div className="flex items-center gap-2 text-xs text-destructive">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sending link...' : 'Send reset link'}
                </Button>
              </form>

              {/* Help Text */}
              <p className="text-xs text-foreground/50 text-center">
                Remember your password?{' '}
                <Link href="/signin" className="text-accent hover:text-accent/90 transition-colors font-medium">
                  Sign in instead
                </Link>
              </p>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-accent/10">
                    <CheckCircle className="w-8 h-8 text-accent" />
                  </div>
                </div>

                <div className="space-y-3 text-center">
                  <h2 className="text-2xl font-semibold text-foreground">Check your email</h2>
                  <p className="text-sm text-foreground/60">
                    We&apos;ve sent a password reset link to{' '}
                    <span className="font-medium text-foreground">{email}</span>
                  </p>
                  <p className="text-xs text-foreground/50">
                    The link will expire in 24 hours. If you don&apos;t see it, check your spam folder.
                  </p>
                </div>

                {/* Next Steps */}
                <div className="space-y-3 pt-4 border-t border-border">
                  <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">What&apos;s next?</h3>
                  <ol className="space-y-2 text-sm text-foreground/70">
                    <li className="flex gap-3">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-accent/10 text-accent text-xs font-medium flex-shrink-0">
                        1
                      </span>
                      <span>Click the reset link in your email</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-accent/10 text-accent text-xs font-medium flex-shrink-0">
                        2
                      </span>
                      <span>Enter a new password</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-accent/10 text-accent text-xs font-medium flex-shrink-0">
                        3
                      </span>
                      <span>Sign in with your new password</span>
                    </li>
                  </ol>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <Link href="/signin" className="block">
                    <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium py-2.5 rounded-lg">
                      Back to sign in
                    </Button>
                  </Link>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail('');
                      setError('');
                    }}
                    className="w-full px-4 py-2.5 rounded-lg border border-border text-foreground hover:bg-card/50 transition-colors text-sm font-medium"
                  >
                    Try another email
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Parent Company Branding */}
          <div className="text-center text-xs text-foreground/50 uppercase tracking-wider">
            A product by <span className="text-accent font-medium">raytech.cloud</span>
          </div>
        </div>
      </div>
    </div>
  );
}
