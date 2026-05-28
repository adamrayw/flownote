import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border px-6 md:px-12 py-12 md:py-16 bg-card/50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-foreground/60">
              <li><a href="/features" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="/pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Roadmap</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Updates</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-3 text-sm text-foreground/60">
              <li><a href="#" className="hover:text-foreground transition-colors">Docs</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Guides</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-foreground/60">
              <li><a href="/about" className="hover:text-foreground transition-colors">About</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Press</a></li>
              <li><a href="/contact" className="hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-foreground/60">
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Compliance</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-accent text-accent-foreground font-bold text-sm">
                F
              </div>
              <span className="font-semibold text-foreground">FlowNote</span>
            </div>
            <span className="text-xs text-foreground/50 uppercase tracking-wider">by raytech.cloud</span>
          </div>
          <p className="text-sm text-foreground/60">
            © {new Date().getFullYear()} raytech.cloud. Made with care for clear thinking.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-foreground/50 hover:text-foreground transition-colors">Twitter</a>
            <a href="#" className="text-foreground/50 hover:text-foreground transition-colors">GitHub</a>
            <a href="#" className="text-foreground/50 hover:text-foreground transition-colors">Discord</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
