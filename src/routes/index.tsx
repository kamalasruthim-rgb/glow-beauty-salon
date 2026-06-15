import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Calendar, Sparkles, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import hero from "@/assets/hero.jpg";
import serviceHair from "@/assets/service-hair.jpg";
import serviceFacial from "@/assets/service-facial.jpg";
import serviceBridal from "@/assets/service-bridal.jpg";
import serviceSpa from "@/assets/service-spa.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Glow Beauty Salon — Enhance Your Natural Beauty" },
      { name: "description", content: "Professional beauty services for every occasion. Book hair, makeup, facial, nail & spa appointments at Glow." },
      { property: "og:title", content: "Glow Beauty Salon" },
      { property: "og:description", content: "Professional beauty services for every occasion." },
    ],
  }),
  component: Index,
});

const featured = [
  { name: "Bridal Makeup", desc: "Look unforgettable on the day that matters most.", img: serviceBridal },
  { name: "Glow Facial", desc: "Vitamin C + 24k gold for luminous, radiant skin.", img: serviceFacial },
  { name: "Hair Styling", desc: "Precision cuts, blowouts, and balayage by senior stylists.", img: serviceHair },
  { name: "Spa Rituals", desc: "Rose aromatherapy massages that melt the week away.", img: serviceSpa },
];

const tips = [
  { t: "Hydrate, then highlight", d: "Apply hyaluronic serum before your day cream for plumper, dewier skin." },
  { t: "Brush from the ends", d: "Detangle from the tips upward to prevent breakage and split ends." },
  { t: "Always wear SPF", d: "Even on cloudy days — UV is the #1 cause of premature ageing." },
];

function Index() {
  const { data: reviews } = useQuery({
    queryKey: ["reviews-home"],
    queryFn: async () => {
      const { data } = await supabase
        .from("reviews")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(3);
      return data ?? [];
    },
  });

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-28 relative">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-background/70 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-foreground/70 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Boutique Beauty Parlor
            </span>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-tight sm:text-6xl lg:text-7xl">
              Enhance Your <span className="text-gradient-gold">Natural Beauty</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Professional beauty services for every occasion. From bridal glam to everyday glow —
              experience the Glow difference.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full bg-gradient-rose px-7 text-primary-foreground shadow-elegant hover:opacity-90">
                <Link to="/booking">
                  <Calendar className="mr-2 h-4 w-4" /> Book Appointment
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-foreground/20 px-7">
                <Link to="/services">
                  View Services <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <span>4.9 average from 500+ clients</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-gold opacity-30 blur-2xl" />
            <img src={hero} alt="Glow Beauty Salon interior" width={1600} height={1024} className="relative rounded-[2rem] shadow-elegant" />
          </div>
        </div>
      </section>

      {/* FEATURED SERVICES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Signature</p>
            <h2 className="mt-2 text-4xl font-semibold sm:text-5xl">Featured Services</h2>
          </div>
          <Link to="/services" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            All services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((f) => (
            <Link key={f.name} to="/services" className="group overflow-hidden rounded-3xl bg-card shadow-soft transition-transform hover:-translate-y-1">
              <div className="aspect-[4/5] overflow-hidden">
                <img src={f.img} alt={f.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl">{f.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-primary">Loved by clients</p>
          <h2 className="mt-2 text-center text-4xl font-semibold sm:text-5xl">What our guests say</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {(reviews ?? []).map((r) => (
              <div key={r.id} className="rounded-3xl bg-card p-7 shadow-soft">
                <div className="flex gap-1">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="mt-4 text-foreground/90">"{r.review_text}"</p>
                <p className="mt-5 font-display text-lg">— {r.customer_name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BEAUTY TIPS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">From our experts</p>
        <h2 className="mt-2 text-4xl font-semibold sm:text-5xl">Beauty tips & rituals</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {tips.map((t, i) => (
            <div key={t.t} className="rounded-3xl border border-border bg-card p-7">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-gold font-display text-gold-foreground">{i + 1}</div>
              <h3 className="mt-5 font-display text-xl">{t.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto mb-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] bg-gradient-rose p-10 text-primary-foreground sm:p-14">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl">Ready for your Glow moment?</h2>
              <p className="mt-2 max-w-xl opacity-90">Book your appointment online in under 60 seconds.</p>
            </div>
            <Button asChild size="lg" className="rounded-full bg-background text-foreground hover:bg-background/90">
              <Link to="/booking">Book Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
