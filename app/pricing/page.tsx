import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Check, X, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Pricing - FlowNote',
  description: 'Simple, transparent pricing for everyone. Start free, upgrade when you&apos;re ready.',
};

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'Forever',
      description: 'Perfect to get started and test the workflow',
      cta: 'Start Free',
      highlight: false,
      features: [
        { name: 'Unlimited notes', included: true },
        { name: 'Basic search', included: true },
        { name: 'Mobile & desktop apps', included: true },
        { name: 'Community support', included: true },
        { name: 'AI summaries', included: false },
        { name: 'Advanced tags', included: false },
        { name: 'Team collaboration', included: false },
        { name: 'Priority support', included: false },
      ],
    },
    {
      name: 'Pro',
      price: '$8',
      period: '/month (billed annually)',
      description: 'For creators and professionals',
      cta: 'Start Free Trial',
      highlight: true,
      features: [
        { name: 'Everything in Free', included: true },
        { name: 'AI-powered summaries', included: true },
        { name: 'Advanced search filters', included: true },
        { name: 'Custom themes', included: true },
        { name: 'API access', included: true },
        { name: 'Priority email support', included: true },
        { name: 'Team collaboration', included: false },
        { name: 'Admin controls', included: false },
      ],
    },
    {
      name: 'Team',
      price: 'Custom',
      period: 'For organizations',
      description: 'For teams and organizations',
      cta: 'Contact Sales',
      highlight: false,
      features: [
        { name: 'Everything in Pro', included: true },
        { name: 'Team collaboration', included: true },
        { name: 'Admin controls & roles', included: true },
        { name: 'SSO & SAML', included: true },
        { name: 'Advanced security', included: true },
        { name: 'Dedicated support', included: true },
        { name: 'Custom integrations', included: true },
        { name: 'SLA guarantee', included: true },
      ],
    },
  ];

  const faqs = [
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes, absolutely. Cancel your subscription anytime without penalty. Your notes remain accessible in the free plan.',
    },
    {
      question: 'Do you offer discounts for annual billing?',
      answer: 'Yes. Annual billing saves you 2 months. That\'s 16% off the monthly price when paid annually.',
    },
    {
      question: 'What happens to my notes if I downgrade?',
      answer: 'All your notes stay with you. If you downgrade from Pro to Free, you keep everything but lose Pro features.',
    },
    {
      question: 'Is there a student discount?',
      answer: 'Yes. Students get 50% off Pro with a valid .edu email. Email us to verify your status.',
    },
    {
      question: 'Can I try Pro before paying?',
      answer: 'Of course. Start with a 14-day free trial of Pro. No credit card required.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and wire transfer for Team plans.',
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
              Simple, transparent pricing
            </h1>
            <p className="text-balance text-lg md:text-xl text-foreground/60 leading-relaxed">
              Start free. Scale as you grow. Always have a plan that fits your needs.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-6 md:px-12 py-24 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl border p-8 transition-all duration-300 ${
                  plan.highlight
                    ? 'bg-accent/5 border-accent/40 shadow-lg md:scale-105'
                    : 'bg-background border-border hover:border-accent/20'
                }`}
              >
                {plan.highlight && (
                  <div className="mb-4 inline-block px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                    <span className="text-xs font-medium text-accent">Most Popular</span>
                  </div>
                )}

                <h3 className="text-2xl font-bold text-foreground mb-1">{plan.name}</h3>
                <p className="text-sm text-foreground/60 mb-6">{plan.description}</p>

                <div className="mb-2">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-sm text-foreground/60 ml-2">{plan.period}</span>
                </div>

                <p className="text-xs text-foreground/50 mb-6">No credit card required</p>

                <Button
                  className={`w-full mb-8 h-11 font-medium rounded-lg transition-all ${
                    plan.highlight
                      ? 'bg-accent hover:bg-accent/90 text-accent-foreground'
                      : 'border border-accent text-accent hover:bg-accent/5'
                  }`}
                  variant={plan.highlight ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>

                <div className="space-y-4">
                  {plan.features.map((feature) => (
                    <div key={feature.name} className="flex gap-3 items-start">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-foreground/30 flex-shrink-0 mt-0.5" />
                      )}
                      <span
                        className={`text-sm ${
                          feature.included ? 'text-foreground/80' : 'text-foreground/40'
                        }`}
                      >
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="px-6 md:px-12 py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            Detailed Feature Comparison
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-semibold text-foreground">Feature</th>
                  <th className="text-center py-4 px-4 font-semibold text-foreground">Free</th>
                  <th className="text-center py-4 px-4 font-semibold text-foreground">Pro</th>
                  <th className="text-center py-4 px-4 font-semibold text-foreground">Team</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Unlimited Notes', free: true, pro: true, team: true },
                  { feature: 'Basic Search', free: true, pro: true, team: true },
                  { feature: 'Mobile App', free: true, pro: true, team: true },
                  { feature: 'Desktop App', free: true, pro: true, team: true },
                  { feature: 'AI Summaries', free: false, pro: true, team: true },
                  { feature: 'Advanced Filters', free: false, pro: true, team: true },
                  { feature: 'Custom Themes', free: false, pro: true, team: true },
                  { feature: 'Team Collaboration', free: false, pro: false, team: true },
                  { feature: 'Admin Controls', free: false, pro: false, team: true },
                  { feature: 'SSO & SAML', free: false, pro: false, team: true },
                  { feature: 'Priority Support', free: false, pro: true, team: true },
                  { feature: 'Dedicated Support', free: false, pro: false, team: true },
                ].map((row) => (
                  <tr key={row.feature} className="border-b border-border/50 hover:bg-card/50 transition-colors">
                    <td className="py-4 px-4 font-medium text-foreground">{row.feature}</td>
                    <td className="text-center py-4 px-4">
                      {row.free ? (
                        <Check className="w-5 h-5 text-accent mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-foreground/20 mx-auto" />
                      )}
                    </td>
                    <td className="text-center py-4 px-4">
                      {row.pro ? (
                        <Check className="w-5 h-5 text-accent mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-foreground/20 mx-auto" />
                      )}
                    </td>
                    <td className="text-center py-4 px-4">
                      {row.team ? (
                        <Check className="w-5 h-5 text-accent mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-foreground/20 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 md:px-12 py-24 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group p-6 rounded-lg bg-background border border-border hover:border-accent/20 cursor-pointer transition-all"
              >
                <summary className="font-medium text-foreground flex items-center justify-between">
                  {faq.question}
                  <span className="text-accent group-open:rotate-180 transition-transform">+</span>
                </summary>
                <p className="text-foreground/60 mt-4 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-12 py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Ready to get started?
            </h2>
            <p className="text-lg text-foreground/60">
              Choose the plan that works for you. Upgrade or downgrade anytime.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button className="h-12 px-8 bg-accent hover:bg-accent/90 text-accent-foreground font-medium rounded-lg flex items-center gap-2 justify-center">
              Get Early Access <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
