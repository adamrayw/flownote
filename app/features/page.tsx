import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ArrowRight, Brain, Zap, Lock, Search, Share2, BarChart3, Palette } from 'lucide-react';

export const metadata = {
  title: 'Features - FlowNote',
  description: 'Discover all the powerful features that make FlowNote the perfect note-taking app.',
};

export default function FeaturesPage() {
  const coreFeatures = [
    {
      icon: Brain,
      title: 'Brain Dump Everything',
      description: 'Capture thoughts instantly without friction. No pressure to organize—just write. Sort later when it matters.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Zero lag, instant search, and seamless performance. Your ideas are never more than a keystroke away.',
    },
    {
      icon: Lock,
      title: 'Private & Secure',
      description: 'Your thoughts stay yours. End-to-end encryption keeps all your ideas protected and private.',
    },
    {
      icon: Search,
      title: 'Powerful Search',
      description: 'Find any note in milliseconds. Search by content, tags, dates—everything is indexed and ready.',
    },
    {
      icon: Share2,
      title: 'Easy Sharing',
      description: 'Share individual notes or collaborate with your team. Control who sees what, always.',
    },
    {
      icon: Palette,
      title: 'Customizable Experience',
      description: 'Personalize your workspace with themes, layouts, and organization methods that match your style.',
    },
  ];

  const advancedFeatures = [
    {
      title: 'AI-Powered Summaries',
      description: 'Automatically generate summaries from your notes. Perfect for quick reviews of long thoughts and ideas.',
      details: ['Instant summaries', 'Custom length', 'Multiple formats'],
    },
    {
      title: 'Advanced Tagging System',
      description: 'Create hierarchical tags and smart collections. Organize by project, topic, or however your mind works.',
      details: ['Nested tags', 'Auto-tagging', 'Smart collections'],
    },
    {
      title: 'Sync Everywhere',
      description: 'Write on any device—phone, tablet, desktop. Changes sync instantly, so you&apos;re always up to date.',
      details: ['Cross-platform', 'Real-time sync', 'Offline mode'],
    },
    {
      title: 'Collaboration Tools',
      description: 'Invite teammates to collaborate in real-time. Leave comments, suggestions, and build together.',
      details: ['Real-time editing', 'Comments', 'Permissions'],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-6 py-24 md:py-32 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-balance text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Everything you need to think and create
            </h1>
            <p className="text-balance text-lg md:text-xl text-foreground/60 leading-relaxed">
              Powerful features designed to eliminate friction and keep you in flow. No bloat, no complexity—just what matters.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
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

      {/* Advanced Features Section */}
      <section className="px-6 md:px-12 py-24">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Advanced Capabilities</h2>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
              Next-level features for power users who want more control and intelligence.
            </p>
          </div>

          {advancedFeatures.map((feature, idx) => (
            <div key={feature.title} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${idx % 2 === 1 ? 'lg:grid-cols-2 lg:[&>*:first-child]:order-2' : ''}`}>
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
              <div className="rounded-xl bg-gradient-to-br from-accent/10 via-background to-background border border-accent/20 p-8 aspect-square flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Sparkles className="w-20 h-20 text-accent/30 mx-auto" />
                  <p className="text-foreground/50 font-medium">Feature showcase</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Integration & API */}
      <section className="px-6 md:px-12 py-24 bg-card/50">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Works with Your Tools</h2>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
              Seamlessly integrate with your favorite apps and services. Export anywhere, import everything.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Slack', 'Zapier', 'Notion', 'GitHub', 'Twitter', 'Discord', 'Calendar', 'Email'].map((tool) => (
              <div key={tool} className="p-6 rounded-lg bg-background border border-border hover:border-accent/30 transition-colors">
                <p className="text-foreground/60 font-medium">{tool}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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

      {/* Footer */}
      <Footer />
    </div>
  );
}

import { Sparkles } from 'lucide-react';
