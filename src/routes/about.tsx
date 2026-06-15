import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Heart, Sparkles } from "lucide-react";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import serviceSpa from "@/assets/service-spa.jpg";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Glow Beauty Salon" },
      { name: "description", content: "Meet the team behind Glow Beauty Salon — our story, mission, and beauty experts." },
      { property: "og:title", content: "About Glow Beauty Salon" },
      { property: "og:description", content: "Our story, mission, and beauty experts." },
    ],
  }),
  component: About,
});

const experts = [
  { name: "Anaya Sharma", role: "Founder & Senior Stylist", bio: "15+ years crafting unforgettable bridal looks." },
  { name: "Priya Mehta", role: "Lead Makeup Artist", bio: "Trained in Paris & Mumbai. Specialist in soft glam." },
  { name: "Riya Kapoor", role: "Skin Therapist", bio: "Certified in advanced facial therapies & dermo-cosmetics." },
];

function About() {
  return (
    <div>
      <section className="bg-gradient-hero py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">About Us</p>
          <h1 className="mt-3 font-display text-5xl font-semibold sm:text-6xl">A boutique made for <span className="text-gradient-gold">your glow</span></h1>
          <p className="mt-5 text-lg text-muted-foreground">Glow Beauty Salon began as a small dream in a quiet Mumbai lane — to create a space where every woman feels celebrated, listened to, and beautifully cared for.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <img src={gallery1} alt="Our salon" width={1024} height={1280} loading="lazy" className="rounded-3xl shadow-elegant" />
          <div>
            <h2 className="font-display text-4xl">Our story</h2>
            <p className="mt-4 text-muted-foreground">Founded in 2015, Glow has grown from a one-chair studio into a beloved neighbourhood salon — but our soul has never changed. We believe beauty rituals should be unhurried, personal, and joyful.</p>
            <p className="mt-3 text-muted-foreground">Every service uses premium products, hygienic single-use tools, and is delivered by certified experts who genuinely love what they do.</p>
          </div>
        </div>
      </section>

      <section className="bg-secondary/40 py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <div className="rounded-3xl bg-card p-8 shadow-soft">
            <Heart className="h-7 w-7 text-primary" />
            <h3 className="mt-4 font-display text-2xl">Our Mission</h3>
            <p className="mt-2 text-muted-foreground">To make every guest feel radiant, confident, and at home — with thoughtful service that honours your unique beauty.</p>
          </div>
          <div className="rounded-3xl bg-card p-8 shadow-soft">
            <Award className="h-7 w-7 text-accent" />
            <h3 className="mt-4 font-display text-2xl">Our Vision</h3>
            <p className="mt-2 text-muted-foreground">To be your city's most-loved boutique salon — known for craft, warmth, and uncompromising hygiene.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="font-display text-4xl">Meet our beauty experts</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {experts.map((e) => (
            <div key={e.name} className="rounded-3xl border border-border bg-card p-7">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-rose text-primary-foreground">
                <Sparkles className="h-7 w-7" />
              </div>
              <h3 className="mt-5 font-display text-xl">{e.name}</h3>
              <p className="text-sm text-primary">{e.role}</p>
              <p className="mt-2 text-sm text-muted-foreground">{e.bio}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <h2 className="font-display text-4xl">Step inside</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <img src={gallery1} alt="Interior" loading="lazy" className="aspect-[4/5] w-full rounded-3xl object-cover" />
          <img src={serviceSpa} alt="Spa room" loading="lazy" className="aspect-[4/5] w-full rounded-3xl object-cover" />
          <img src={gallery6} alt="Relaxation room" loading="lazy" className="aspect-[4/5] w-full rounded-3xl object-cover" />
        </div>
        <div className="mt-10 text-center">
          <Button asChild size="lg" className="rounded-full bg-gradient-rose text-primary-foreground"><Link to="/booking">Book Your Visit</Link></Button>
        </div>
      </section>
    </div>
  );
}