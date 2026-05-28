'use client';

import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';
import { Sparkles, Zap, Users, ArrowRight } from 'lucide-react';
import { FormEvent, useState } from 'react';

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [position, setPosition] = useState(0);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulate waitlist signup
    setPosition(Math.floor(Math.random() * 5000) + 1);
    setSubmitted(true);
    setEmail('');
  };

  const perks = [
    {
      icon: Sparkles,
      title: 'Early Access',
      description: 'Be among the first to experience FlowNote when we launch',
    },
    {
      icon: Zap,
      title: 'Pro For Life',
      description: 'Launch discount: 50% off Pro pricing for your first year',
    },
    {
      icon: Users,
      title: 'Shape the Future',
      description: 'Direct input on features and the product direction',
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'Join the Waitlist',
      description: 'Sign up with your email to get early access notifications',
    },
    {
      number: '2',
      title: 'Spread the Word',
      description: 'Invite friends to move up the queue (optional but rewarding)',
    },
    {
      number: '3',
      title: 'Get Exclusive Access',
      description: 'Be notified when your access is ready. Launch pricing never changes.',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-6 py-24 md:py-32 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
              <span className="text-xs font-medium text-accent">Exclusive Beta Access</span>
            </div>
            <h1 className="text-balance text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Be first to experience FlowNote
            </h1>
            <p className="text-balance text-lg md:text-xl text-foreground/60 leading-relaxed">
              Join our early access program and help shape the future of note-taking. Limited spots available.
            </p>
          </div>
        </div>
      </section>

      {/* Signup Form */}
      <section className="px-6 md:px-12 py-24 bg-gradient-to-br from-accent/10 via-background to-background">
        <div className="max-w-2xl mx-auto">
          {submitted ? (
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 border border-accent/30">
                  <Sparkles className="w-8 h-8 text-accent" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">You&apos;re in!</h2>
                <p className="text-lg text-foreground/60">
                  Welcome to the FlowNote family. You&apos;re currently at position <span className="font-bold text-accent">#{position}</span> on the waitlist.
                </p>
              </div>

              <div className="space-y-4 p-8 rounded-xl bg-accent/5 border border-accent/20">
                <h3 className="font-semibold text-foreground text-lg">Move Up the Queue</h3>
                <p className="text-sm text-foreground/60 mb-4">
                  Invite your friends and move up the waitlist. Share your unique link below.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={`flownote.app/waitlist?ref=${email?.split('@')[0] || 'friend'}`}
                    readOnly
                    className="flex-1 px-4 py-3 rounded-lg bg-background border border-border text-sm text-foreground/70"
                  />
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(`flownote.app/waitlist?ref=${email?.split('@')[0] || 'friend'}`);
                    }}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    Copy
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">What&apos;s Next?</h3>
                <p className="text-foreground/60">
                  We&apos;ll send you an email when your beta access is ready. In the meantime, follow us on social media for updates.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-4 rounded-lg bg-card border border-border focus:border-accent focus:outline-none transition-colors text-foreground placeholder:text-foreground/40 text-lg"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-medium rounded-lg text-lg flex items-center gap-2 justify-center"
              >
                Claim Your Spot <ArrowRight className="w-5 h-5" />
              </Button>

              <p className="text-xs text-foreground/50 text-center">
                We&apos;ll send you early access updates. No spam, unsubscribe anytime.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Perks Section */}
      <section className="px-6 md:px-12 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">What You Get</h2>
            <p className="text-lg text-foreground/60">
              Early access members enjoy exclusive perks and pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {perks.map((perk) => (
              <div
                key={perk.title}
                className="p-8 rounded-xl bg-card border border-border hover:border-accent/30 transition-all duration-300 text-center group"
              >
                <perk.icon className="w-12 h-12 text-accent mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-foreground mb-2">{perk.title}</h3>
                <p className="text-foreground/60 leading-relaxed">{perk.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 md:px-12 py-24 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">How It Works</h2>
            <p className="text-lg text-foreground/60">
              Three simple steps to get early access to FlowNote.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div key={step.number} className="relative">
                <div className="p-8 rounded-xl bg-background border border-border">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent/20 border border-accent/30 mb-4">
                    <span className="font-bold text-accent text-lg">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-foreground/60 leading-relaxed">{step.description}</p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-accent/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 md:px-12 py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Waitlist FAQ</h2>

          <div className="space-y-4">
            {[
              {
                q: 'When will I get access?',
                a: 'We&apos;re opening early access in phases. You&apos;ll receive an email when your turn comes.',
              },
              {
                q: 'Can I move up the queue?',
                a: 'Yes! Invite friends and you&apos;ll automatically move up the waitlist.',
              },
              {
                q: 'Is there a cost for early access?',
                a: 'No. Early access is free, and you&apos;ll get Pro pricing locked in for life.',
              },
              {
                q: 'What if I change my mind?',
                a: 'You can unsubscribe from waitlist emails anytime. No hard feelings!',
              },
            ].map((faq) => (
              <details
                key={faq.q}
                className="group p-6 rounded-lg bg-card border border-border hover:border-accent/20 cursor-pointer transition-all"
              >
                <summary className="font-medium text-foreground flex items-center justify-between">
                  {faq.q}
                  <span className="text-accent group-open:rotate-180 transition-transform">+</span>
                </summary>
                <p className="text-foreground/60 mt-4 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 md:px-12 py-24 bg-gradient-to-br from-accent/10 to-background">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Join thousands of early adopters
            </h2>
            <p className="text-lg text-foreground/60">
              Be part of something special. FlowNote launches soon.
            </p>
          </div>

          <Button className="h-12 px-8 bg-accent hover:bg-accent/90 text-accent-foreground font-medium rounded-lg flex items-center gap-2 justify-center mx-auto">
            Get Early Access <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 md:px-12 py-12 md:py-16 bg-card/50">
        <div className="max-w-6xl mx-auto text-center text-sm text-foreground/60">
          <p>© {new Date().getFullYear()} FlowNote. Made with care for clear thinking.</p>
        </div>
      </footer>
    </div>
  );
}
