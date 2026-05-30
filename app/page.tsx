import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Brain, Lock, Check, Search, Tag, Heart, Archive, FileText, Clock3, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-6 py-24 md:py-32 lg:py-40 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
              <span className="text-xs font-medium text-accent">A product by raytech.cloud</span>
            </div>
            <h1 className="text-balance text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              Capture thoughts, organize ideas, stay productive
            </h1>
            <p className="text-balance text-lg md:text-xl text-foreground/60 leading-relaxed">
              FlowNote helps you capture thoughts instantly without friction. Brain dump, organize, and use AI to summarize, rewrite, and extract action items in seconds.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button className="h-11 px-8 bg-accent hover:bg-accent/90 text-accent-foreground font-medium rounded-lg flex items-center gap-2 justify-center">
              Start Writing <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="h-11 px-8 font-medium rounded-lg">
              View Demo
            </Button>
          </div>

          <p className="text-sm text-foreground/50">No credit card required. Free forever plan available.</p>
        </div>
      </section>

      {/* Feature Preview */}
      <section className="px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl bg-gradient-to-br from-accent/10 via-background to-background border border-accent/25 p-4 md:p-6 shadow-sm">
            <div className="aspect-video rounded-xl bg-card border border-border overflow-hidden">
              <div className="h-11 border-b border-border bg-background/90 flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="hidden md:flex items-center gap-2 text-xs text-foreground/50">
                  <Search className="w-3.5 h-3.5" />
                  Search "meeting notes"
                </div>
              </div>

              <div className="grid grid-cols-12 h-[calc(100%-44px)]">
                <aside className="hidden md:block col-span-3 border-r border-border bg-muted/30 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-foreground/45 mb-3">Workspace</p>
                  <div className="space-y-2 text-xs">
                    <div className="px-2.5 py-2 rounded-md bg-accent/10 text-accent font-medium flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5" />
                      Notes
                    </div>
                    <div className="px-2.5 py-2 rounded-md text-foreground/65 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      AI Assistant
                    </div>
                    <div className="px-2.5 py-2 rounded-md text-foreground/65 flex items-center gap-2">
                      <Heart className="w-3.5 h-3.5" />
                      Favorites
                    </div>
                    <div className="px-2.5 py-2 rounded-md text-foreground/65 flex items-center gap-2">
                      <Archive className="w-3.5 h-3.5" />
                      Archived
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-[11px] uppercase tracking-wide text-foreground/45">Tags</p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-1 rounded-full text-[10px] bg-blue-500/15 text-blue-600">product</span>
                      <span className="px-2 py-1 rounded-full text-[10px] bg-emerald-500/15 text-emerald-600">ideas</span>
                      <span className="px-2 py-1 rounded-full text-[10px] bg-amber-500/15 text-amber-700">meeting</span>
                    </div>
                  </div>
                </aside>

                <div className="col-span-12 md:col-span-9 p-3 md:p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 h-full">
                    <div className="lg:col-span-2 rounded-lg border border-border bg-background p-3">
                      <p className="text-[11px] uppercase tracking-wide text-foreground/45 mb-2">Recent Notes</p>
                      <div className="space-y-2.5">
                        {[
                          { title: 'Q2 Product Planning', updated: '2m ago' },
                          { title: 'Daily Journal - Friday', updated: '10m ago' },
                          { title: 'Growth Experiments', updated: '1h ago' },
                        ].map((item) => (
                          <div key={item.title} className="p-2 rounded-md border border-border/70 bg-card/50">
                            <p className="text-xs font-medium text-foreground truncate">{item.title}</p>
                            <p className="text-[10px] text-foreground/50 mt-1">{item.updated}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="lg:col-span-3 rounded-lg border border-border bg-background p-3">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <p className="text-sm font-semibold text-foreground">Q2 Product Planning</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-foreground/55">
                          <Clock3 className="w-3 h-3" />
                          Updated 2m ago
                        </div>
                      </div>
                      <div className="space-y-2 text-xs text-foreground/75 leading-relaxed">
                        <p className="font-semibold text-foreground"># Launch priorities</p>
                        <p>- Improve onboarding conversion from 18% to 26%</p>
                        <p>- Ship archive and favorite workflow in one sprint</p>
                        <p className="font-semibold text-foreground mt-2">## Key tasks</p>
                        <p>1. Finalize dashboard IA and empty states</p>
                        <p>2. Add search + tags + quick keyboard actions</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] bg-accent/10 text-accent">
                          <Tag className="w-3 h-3" />
                          Product
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] bg-emerald-500/10 text-emerald-700">
                          Sprint 2
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 md:px-12 py-24 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Features designed for flow
            </h2>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
              Everything you need to think, capture, and create without getting in your own way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: 'Brain Dump Everything',
                description: 'No pressure to organize. Capture thoughts as they come. Sort later, when it matters.',
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Zero lag. Instant search. Your ideas are never more than a keystroke away.',
              },
              {
                icon: Lock,
                title: 'Private & Secure',
                description: 'Your thoughts stay yours. End-to-end encryption keeps your ideas protected.',
              },
              {
                icon: Sparkles,
                title: 'AI That Actually Helps',
                description: 'Convert raw notes into summaries, action items, rewrites, and smart tags from one workspace.',
              },
            ].map((feature) => (
              <div key={feature.title} className="p-6 rounded-xl bg-background border border-border hover:border-accent/30 hover:bg-card transition-all duration-300">
                <feature.icon className="w-10 h-10 text-accent mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="px-6 md:px-12 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Work the way your mind works
                </h2>
                <p className="text-lg text-foreground/60">
                  FlowNote adapts to your workflow, not the other way around. Write, organize, and share with complete flexibility.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  'Capture fleeting ideas instantly',
                  'Organize with tags and collections',
                  'Search billions of notes in milliseconds',
                  'Ask AI across all your saved notes',
                  'Save AI results directly as notes',
                ].map((benefit) => (
                  <div key={benefit} className="flex gap-3 items-start">
                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button className="w-full md:w-auto h-11 px-8 bg-accent hover:bg-accent/90 text-accent-foreground font-medium rounded-lg">
                Explore More Features
              </Button>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-accent/10 via-background to-background border border-accent/20 p-6 md:p-8 aspect-square">
              <div className="h-full grid grid-rows-[auto,1fr,auto] gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">Flow in action</h3>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent">Live workflow</span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-lg border border-border bg-card/60">
                    <p className="text-sm font-medium text-foreground">Capture</p>
                    <p className="text-xs text-foreground/60 mt-1">
                      Quick notes with markdown formatting, then organize later.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border border-border bg-card/60">
                    <p className="text-sm font-medium text-foreground">Organize</p>
                    <p className="text-xs text-foreground/60 mt-1">
                      Tags, favorites, and archive keep your workspace clean.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border border-border bg-card/60">
                    <p className="text-sm font-medium text-foreground">Retrieve</p>
                    <p className="text-xs text-foreground/60 mt-1">
                      Instant search helps you find context in seconds.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border border-border bg-card/60">
                    <p className="text-sm font-medium text-foreground">Accelerate with AI</p>
                    <p className="text-xs text-foreground/60 mt-1">
                      Summarize and extract action items, then save output straight into your notes.
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-card/50 p-3">
                  <p className="text-xs text-foreground/60">
                    Real usage insights will appear here as product analytics are finalized.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-6 md:px-12 py-24 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
              Start free. Scale as you grow. Always have a plan that fits your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Free',
                price: '$0',
                description: 'Perfect to get started',
                features: [
                  'Unlimited notes',
                  'Basic search',
                  'Mobile & desktop apps',
                  'Community support',
                ],
                cta: 'Start Free',
                highlight: false,
              },
              {
                name: 'Pro',
                price: '$8',
                description: '/month, billed annually',
                features: [
                  'Everything in Free',
                  'AI-powered summaries',
                  'Action items and smart tags',
                  'Advanced search filters',
                  'Priority support',
                  'Custom themes',
                ],
                cta: 'Start Free Trial',
                highlight: true,
              },
              {
                name: 'Team',
                price: 'Custom',
                description: 'For organizations',
                features: [
                  'Everything in Pro',
                  'Team collaboration',
                  'Admin controls',
                  'SSO & SAML',
                  'Dedicated support',
                ],
                cta: 'Contact Sales',
                highlight: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl border p-8 transition-all duration-300 ${
                  plan.highlight
                    ? 'bg-accent/5 border-accent/40 shadow-lg scale-105'
                    : 'bg-background border-border hover:border-accent/20'
                }`}
              >
                <h3 className="text-2xl font-bold text-foreground mb-1">{plan.name}</h3>
                <p className="text-sm text-foreground/60 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                </div>
                <Button
                  className={`w-full mb-8 h-10 font-medium rounded-lg ${
                    plan.highlight
                      ? 'bg-accent hover:bg-accent/90 text-accent-foreground'
                      : 'border border-accent text-accent hover:bg-accent/5'
                  }`}
                  variant={plan.highlight ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2 items-start text-sm text-foreground/70">
                      <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-12 py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Ready to find your flow?
            </h2>
            <p className="text-lg text-foreground/60">
              Join thousands of creators, thinkers, and builders who are capturing their best ideas with FlowNote.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button className="h-12 px-8 bg-accent hover:bg-accent/90 text-accent-foreground font-medium rounded-lg flex items-center gap-2 justify-center">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="h-12 px-8 font-medium rounded-lg">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
