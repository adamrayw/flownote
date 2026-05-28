'use client';

import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';
import { Mail, MessageSquare, Github, Twitter, Slack, ArrowRight } from 'lucide-react';
import { FormEvent, useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      description: 'Our fastest way to respond',
      value: 'hello@flownote.app',
      href: 'mailto:hello@flownote.app',
    },
    {
      icon: MessageSquare,
      title: 'Support',
      description: 'Get help from our team',
      value: 'support.flownote.app',
      href: 'https://support.flownote.app',
    },
    {
      icon: Slack,
      title: 'Community',
      description: 'Chat with other users',
      value: 'Join our Slack',
      href: '#',
    },
  ];

  const socialLinks = [
    { icon: Twitter, label: 'Twitter', href: 'https://twitter.com/flownote' },
    { icon: Github, label: 'GitHub', href: 'https://github.com/flownote' },
    { icon: Slack, label: 'Slack', href: '#' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-6 py-24 md:py-32 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-balance text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Get in touch
            </h1>
            <p className="text-balance text-lg md:text-xl text-foreground/60 leading-relaxed">
              Have a question? We&apos;d love to hear from you. Our team typically responds within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="px-6 md:px-12 py-24 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method) => (
              <a
                key={method.title}
                href={method.href}
                className="p-8 rounded-xl bg-background border border-border hover:border-accent/30 transition-all duration-300 group"
              >
                <method.icon className="w-12 h-12 text-accent mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-foreground mb-2">{method.title}</h3>
                <p className="text-sm text-foreground/60 mb-4">{method.description}</p>
                <p className="text-accent font-medium hover:underline">{method.value}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="px-6 md:px-12 py-24">
        <div className="max-w-2xl mx-auto">
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Send us a message</h2>
              <p className="text-foreground/60">We&apos;ll get back to you as soon as possible.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-foreground">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-accent focus:outline-none transition-colors text-foreground placeholder:text-foreground/40"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-foreground">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-accent focus:outline-none transition-colors text-foreground placeholder:text-foreground/40"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="block text-sm font-medium text-foreground">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-accent focus:outline-none transition-colors text-foreground"
                >
                  <option value="">Select a topic</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Support Request</option>
                  <option value="partnership">Partnership</option>
                  <option value="feedback">Feedback</option>
                  <option value="press">Press</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium text-foreground">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Tell us what&apos;s on your mind..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-accent focus:outline-none transition-colors text-foreground placeholder:text-foreground/40 resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-medium rounded-lg flex items-center gap-2 justify-center"
              >
                {submitted ? (
                  <>
                    <span>Message sent!</span>
                  </>
                ) : (
                  <>
                    Send Message <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            {submitted && (
              <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                <p className="text-sm text-accent font-medium">
                  Thanks for reaching out! We&apos;ll get back to you soon.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="px-6 md:px-12 py-24 bg-card/50">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Follow us</h2>
            <p className="text-foreground/60">Stay updated with the latest news and updates</p>
          </div>

          <div className="flex gap-4 justify-center">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="p-4 rounded-lg bg-background border border-border hover:border-accent/30 hover:bg-card transition-all duration-300 group"
                aria-label={link.label}
              >
                <link.icon className="w-6 h-6 text-foreground/60 group-hover:text-accent transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="px-6 md:px-12 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-2 mb-12">
            <h2 className="text-3xl font-bold text-foreground">Common Questions</h2>
            <p className="text-foreground/60">Check out our FAQ for quick answers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: 'How do I get started with FlowNote?',
                a: 'Sign up for free and start writing. No credit card required.',
              },
              {
                q: 'Is my data secure?',
                a: 'Yes. All notes are encrypted end-to-end. Your data is yours alone.',
              },
              {
                q: 'Can I import from other apps?',
                a: 'We support importing from most popular note-taking apps.',
              },
              {
                q: 'Do you have a mobile app?',
                a: 'Yes. Available on iOS and Android with full feature parity.',
              },
            ].map((item) => (
              <div key={item.q} className="p-6 rounded-lg bg-card border border-border">
                <h3 className="font-semibold text-foreground mb-2">{item.q}</h3>
                <p className="text-sm text-foreground/60">{item.a}</p>
              </div>
            ))}
          </div>
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
