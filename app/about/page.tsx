import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ArrowRight, Heart, Target, Lightbulb } from 'lucide-react';

export const metadata = {
  title: 'About - FlowNote',
  description: 'Learn the story behind FlowNote and our mission to help people think more clearly.',
};

export default function AboutPage() {
  const values = [
    {
      icon: Lightbulb,
      title: 'Clarity',
      description: 'We believe clear thinking starts with frictionless capture. Remove obstacles between thought and note.',
    },
    {
      icon: Target,
      title: 'Focus',
      description: 'A single tool focused on doing one thing exceptionally well. No noise, no distraction, just writing.',
    },
    {
      icon: Heart,
      title: 'Care',
      description: 'We build with our users in mind. Every feature, every interaction is thoughtfully designed with you in mind.',
    },
  ];

  const team = [
    {
      name: 'Sarah Chen',
      role: 'Founder & CEO',
      bio: 'Former product designer at Linear. Obsessed with how tools shape thinking.',
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Head of Engineering',
      bio: 'Built infrastructure at Vercel. Passionate about performance and developer experience.',
    },
    {
      name: 'Emily Watson',
      role: 'Head of Design',
      bio: 'Design systems specialist. Believes beautiful interfaces enable better thinking.',
    },
    {
      name: 'David Kim',
      role: 'Product Manager',
      bio: 'Previously at Notion. Expert in understanding user workflows and needs.',
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
              Tools shape how we think
            </h1>
            <p className="text-balance text-lg md:text-xl text-foreground/60 leading-relaxed">
              FlowNote exists because we believe the right tool can unlock your best thinking. We&apos;re building for clarity, focus, and flow.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="px-6 md:px-12 py-24 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Story</h2>
              <p className="text-lg text-foreground/70 leading-relaxed mb-4">
                FlowNote started with a simple observation: most note-taking apps are built for organization first, capture second. They force you to decide where something goes before you&apos;ve even finished thinking about it.
              </p>
              <p className="text-lg text-foreground/70 leading-relaxed mb-4">
                We watched creators, developers, and thinkers struggle with friction in their favorite tools. They wanted to capture ideas at the speed of thought, not at the speed of organization.
              </p>
              <p className="text-lg text-foreground/70 leading-relaxed">
                So we built FlowNote. A tool that gets out of the way. One that treats capture as sacred, organization as optional, and focus as the ultimate goal.
              </p>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-lg text-foreground/70 leading-relaxed">
                We&apos;re on a mission to help people capture thoughts with zero friction and think more clearly. By removing obstacles between thought and note, we believe you can unlock your best ideas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-6 md:px-12 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">What We Believe</h2>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
              These core values guide everything we build and every decision we make.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="p-8 rounded-xl bg-card border border-border hover:border-accent/30 transition-all duration-300 text-center"
              >
                <value.icon className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-3">{value.title}</h3>
                <p className="text-foreground/60 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="px-6 md:px-12 py-24 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Our Team</h2>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
              A small group of people obsessed with building the best thinking tool on the internet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 mx-auto mb-4 flex items-center justify-center">
                  <div className="w-28 h-28 rounded-lg bg-accent/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-accent/40">{member.name.charAt(0)}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">{member.name}</h3>
                <p className="text-sm font-medium text-accent mb-2">{member.role}</p>
                <p className="text-sm text-foreground/60 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hiring CTA */}
      <section className="px-6 md:px-12 py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8 bg-gradient-to-br from-accent/10 via-background to-background border border-accent/20 rounded-xl p-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">We&apos;re Hiring</h2>
            <p className="text-lg text-foreground/60">
              Love building tools that shape how people think? Come join our team.
            </p>
          </div>

          <Button className="h-12 px-8 bg-accent hover:bg-accent/90 text-accent-foreground font-medium rounded-lg flex items-center gap-2 justify-center mx-auto">
            View Open Positions <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="px-6 md:px-12 py-24 bg-card/50">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Let&apos;s build together</h2>
            <p className="text-lg text-foreground/60">
              Have questions, ideas, or just want to chat? We&apos;d love to hear from you.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button className="h-12 px-8 bg-accent hover:bg-accent/90 text-accent-foreground font-medium rounded-lg">
              Get in Touch
            </Button>
            <Button variant="outline" className="h-12 px-8 font-medium rounded-lg">
              hello@flownote.app
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
