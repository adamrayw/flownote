import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ArrowRight, Brain, Zap, Lock, Search, Share2, Palette, FileText, Clock3, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Features - FlowNote',
  description: 'Discover all the powerful features that make FlowNote the perfect note-taking app.',
};

type AdvancedFeature = {
  title: string;
  description: string;
  details: string[];
  previewTitle: string;
  previewLines: string[];
};

function FeatureShowcase({ feature, index }: { feature: AdvancedFeature; index: number }) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-accent/10 via-background to-background border border-accent/20 p-4 md:p-5 aspect-square">
      <div className="h-full rounded-lg border border-border bg-card overflow-hidden">
        <div className="h-10 border-b border-border bg-background px-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <span className="text-[10px] text-foreground/45">{feature.previewTitle}</span>
        </div>

        <div className="p-3 h-[calc(100%-40px)] grid grid-rows-[auto,1fr,auto] gap-3">
          <div className="flex items-center justify-between text-[10px] text-foreground/50">
            <span className="inline-flex items-center gap-1">
              <FileText className="w-3 h-3" />
              {feature.title}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock3 className="w-3 h-3" />
              Updated now
            </span>
          </div>

          <div className="rounded-md border border-border bg-background p-2.5 space-y-2 text-[11px] text-foreground/70 overflow-hidden">
            {feature.previewLines.map((line) => (
              <p key={line} className="truncate">{line}</p>
            ))}
          </div>

          <div className="rounded-md border border-border bg-background p-2.5">
            <p className="text-[11px] text-foreground/60">
              Preview output for this capability is shown above.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturesPage() {
  const coreFeatures = [
    {
      icon: Brain,
      title: 'Brain Dump Everything',
      description: 'Capture thoughts instantly without friction. No pressure to organize. Write first, structure later.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Zero lag, instant loading, and responsive interactions so your writing flow never breaks.',
    },
    {
      icon: Lock,
      title: 'Private & Secure',
      description: 'Your notes are private by default. Authentication and protected routes keep your workspace safe.',
    },
    {
      icon: Search,
      title: 'Powerful Search',
      description: 'Search by title or content in seconds. Quickly jump back to the exact idea you need.',
    },
    {
      icon: Share2,
      title: 'Flexible Workflow',
      description: 'Mark important notes as favorites and archive old ones to keep your active workspace clean.',
    },
    {
      icon: Palette,
      title: 'Markdown Writing',
      description: 'Use headers, bold text, bullets, and numbered lists with live preview while writing.',
    },
    {
      icon: Sparkles,
      title: 'Built-in AI Assistant',
      description: 'Summarize notes, extract action items, rewrite drafts, suggest smart tags, and ask AI across all your notes.',
    },
  ];

  const advancedFeatures: AdvancedFeature[] = [
    {
      title: 'Smart Note Workflow',
      description: 'Capture quickly, then organize with favorites, archive, and tags without interrupting your writing momentum.',
      details: ['Favorites', 'Archive / Restore', 'Tag management'],
      previewTitle: 'Workflow Preview',
      previewLines: ['# Q2 Planning Notes', '- Prioritize dashboard polish', '- Launch archive + favorites', '## Next step', '1. Review feedback weekly'],
    },
    {
      title: 'Focused Editor Experience',
      description: 'A clean markdown editor with formatting toolbar and live preview so you can think and write in one place.',
      details: ['H1 / H2 / Bold', 'Auto-list continuation', 'Live markdown preview'],
      previewTitle: 'Editor Preview',
      previewLines: ['## Meeting recap', '**Decision:** ship settings first', '- Update profile + password', '- Polish notes toolbar behavior', '1. QA on mobile + desktop'],
    },
    {
      title: 'Search & Retrieval',
      description: 'Find active or archived notes instantly using search and filters, then restore context with a single click.',
      details: ['Instant keyword search', 'Filter by tags', 'Archived search'],
      previewTitle: 'Search Preview',
      previewLines: ['Search: "dashboard settings"', 'Result: Account + Security update', 'Tag: product, sprint-2', 'Updated: 12 minutes ago', 'Action: Open note'],
    },
    {
      title: 'Security Fundamentals',
      description: 'Authentication, password hashing, session handling, and protected APIs form a secure baseline for daily use.',
      details: ['Secure sign-in', 'Private account access', 'Protected workspace'],
      previewTitle: 'Security Preview',
      previewLines: ['Auth: Register / Login / Logout', 'Password: min length + hash', 'Session: refresh token flow', 'Rate limit on login attempts', 'Change password in settings'],
    },
    {
      title: 'AI Workspace',
      description: 'Run AI on your notes directly in FlowNote. Save AI output as new notes and attach smart tags to your database instantly.',
      details: ['Summarize + rewrite', 'Ask all notes context', 'Save output as note'],
      previewTitle: 'AI Preview',
      previewLines: ['Mode: Ask Notes', 'Q: What are top priorities this week?', 'A: Improve onboarding and polish archive flow', 'Evidence: Note 2, Note 5, Note 8', 'Action: Save as note'],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <section className="flex flex-col items-center justify-center px-6 py-24 md:py-32 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-balance text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Everything you need to think and create
            </h1>
            <p className="text-balance text-lg md:text-xl text-foreground/60 leading-relaxed">
              Powerful features designed to eliminate friction and keep you in flow, with AI built into your everyday note workflow.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-24 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Core Features</h2>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
              The essentials you need to capture, organize, and focus on what matters most.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreFeatures.map((feature) => (
              <div
                key={feature.title}
                className="p-8 rounded-xl bg-background border border-border hover:border-accent/30 hover:bg-card/50 transition-all duration-300 group"
              >
                <feature.icon className="w-12 h-12 text-accent mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-foreground/60 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-24">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Advanced Capabilities</h2>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
              Product-ready workflows for people who need speed, clarity, and control.
            </p>
          </div>

          {advancedFeatures.map((feature, idx) => (
            <div key={feature.title} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${idx % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-3xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-lg text-foreground/60 leading-relaxed">{feature.description}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {feature.details.map((detail) => (
                    <div key={detail} className="px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
                      <span className="text-sm font-medium text-accent">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              <FeatureShowcase feature={feature} index={idx} />
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-12 py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Ready to experience FlowNote?</h2>
            <p className="text-lg text-foreground/60">
              Start with our free plan. No credit card required, no strings attached.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button className="h-12 px-8 bg-accent hover:bg-accent/90 text-accent-foreground font-medium rounded-lg flex items-center gap-2 justify-center">
              Get Early Access <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="h-12 px-8 font-medium rounded-lg">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
