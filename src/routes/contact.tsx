import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Glow Beauty Salon" },
      { name: "description", content: "Visit us in Mumbai, call, WhatsApp or email Glow Beauty Salon." },
      { property: "og:title", content: "Contact Glow" },
      { property: "og:description", content: "Get in touch with our team." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sending, setSending] = useState(false);
  return (
    <div>
      <section className="bg-gradient-hero py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Contact</p>
          <h1 className="mt-3 font-display text-5xl font-semibold sm:text-6xl">Let's <span className="text-gradient-gold">connect</span></h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="space-y-4">
          <div className="rounded-3xl bg-card p-6 shadow-soft">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-rose text-primary-foreground"><MapPin className="h-5 w-5" /></span>
              <div>
                <h3 className="font-display text-xl">Visit</h3>
                <p className="text-sm text-muted-foreground">24 Rose Avenue, Bandra West, Mumbai 400050</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl bg-card p-6 shadow-soft">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-gold text-gold-foreground"><Phone className="h-5 w-5" /></span>
              <div>
                <h3 className="font-display text-xl">Call</h3>
                <p className="text-sm text-muted-foreground">+91 98765 43210</p>
                <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary"><MessageCircle className="h-4 w-4" /> WhatsApp us</a>
              </div>
            </div>
          </div>
          <div className="rounded-3xl bg-card p-6 shadow-soft">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-secondary text-secondary-foreground"><Mail className="h-5 w-5" /></span>
              <div>
                <h3 className="font-display text-xl">Email</h3>
                <p className="text-sm text-muted-foreground">hello@glowbeauty.in</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl bg-card p-6 shadow-soft">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-secondary text-secondary-foreground"><Clock className="h-5 w-5" /></span>
              <div>
                <h3 className="font-display text-xl">Business Hours</h3>
                <p className="text-sm text-muted-foreground">Mon – Sat: 10:00 — 20:00</p>
                <p className="text-sm text-muted-foreground">Sunday: 11:00 — 18:00</p>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl shadow-soft">
            <iframe title="Map" className="h-72 w-full" src="https://www.google.com/maps?q=Bandra+West+Mumbai&output=embed" />
          </div>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); setSending(true); setTimeout(() => { setSending(false); toast.success("Message sent! We'll reply soon."); (e.target as HTMLFormElement).reset(); }, 700); }}
          className="space-y-4 rounded-3xl bg-card p-8 shadow-elegant"
        >
          <h2 className="font-display text-3xl">Send a message</h2>
          <div><Label>Name</Label><Input required maxLength={80} className="mt-1.5 rounded-xl" /></div>
          <div><Label>Email</Label><Input type="email" required maxLength={120} className="mt-1.5 rounded-xl" /></div>
          <div><Label>Phone (optional)</Label><Input maxLength={20} className="mt-1.5 rounded-xl" /></div>
          <div><Label>Message</Label><Textarea required maxLength={1000} rows={5} className="mt-1.5 rounded-xl" /></div>
          <Button type="submit" disabled={sending} className="w-full rounded-full bg-gradient-rose text-primary-foreground">{sending ? "Sending…" : "Send Message"}</Button>
        </form>
      </section>
    </div>
  );
}