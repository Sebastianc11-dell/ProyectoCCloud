export default function Footer() {
  return (
    <footer className="bg-surface border-t border-surface-light mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-primary mb-2">PriceWatch</h3>
            <p className="text-foreground-muted text-sm">
              Monitor product prices across the web and get instant alerts when prices drop.
            </p>
          </div>
          <div>
            <h4 className="text-foreground font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-foreground-muted">
              <li>
                <a href="#" className="hover:text-primary transition">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Search Products
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  My Alerts
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-foreground font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-foreground-muted">
              <li>
                <a href="#" className="hover:text-primary transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-surface-light mt-8 pt-8 text-center text-foreground-muted text-sm">
          <p>&copy; 2025 PriceWatch. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
