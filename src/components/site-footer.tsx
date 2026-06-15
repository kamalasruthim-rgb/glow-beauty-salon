import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone, Sparkles } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-gold text-gold-foreground">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="font-display text-xl font-semibold">Glow Beauty Salon</span>
          </Link>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            A boutique beauty parlor dedicated to enhancing your natural beauty with expert care,
            premium products, and a truly relaxing experience.
          </p>
          <div className="mt-5 flex gap-3">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full bg-background text-foreground/70 transition-colors hover:bg-primary hover:text-primary-foreground">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full bg-background text-foreground/70 transition-colors hover:bg-primary hover:text-primary-foreground">
              <Facebook className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground/80">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/services" className="hover:text-foreground">Services</Link></li>
            <li><Link to="/booking" className="hover:text-foreground">Book Appointment</Link></li>
            <li><Link to="/gallery" className="hover:text-foreground">Gallery</Link></li>
            <li><Link to="/testimonials" className="hover:text-foreground">Testimonials</Link></li>
            <li><Link to="/about" className="hover:text-foreground">About Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground/80">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-primary" /> 24 Rose Avenue, Bandra, Mumbai</li>
            <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 text-primary" /> +91 98765 43210</li>
            <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 text-primary" /> hello@glowbeauty.in</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/50 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Glow Beauty Salon. All rights reserved.
      </div>
    </footer>
  );
}