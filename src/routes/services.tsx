import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Clock, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import serviceHair from "@/assets/service-hair.jpg";
import serviceFacial from "@/assets/service-facial.jpg";
import serviceBridal from "@/assets/service-bridal.jpg";
import serviceSpa from "@/assets/service-spa.jpg";
import serviceNails from "@/assets/service-nails.jpg";
import serviceBrows from "@/assets/service-brows.jpg";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services & Pricing — Glow Beauty Salon" },
      { name: "description", content: "Browse hair, makeup, facial, nail, and spa services with transparent pricing and durations." },
      { property: "og:title", content: "Services & Pricing — Glow" },
      { property: "og:description", content: "Browse our beauty services with transparent pricing." },
    ],
  }),
  component: Services,
});

const imgByCategory: Record<string, string> = {
  "Hair Styling": serviceHair,
  "Hair Coloring": serviceHair,
  "Facial Treatments": serviceFacial,
  "Bridal Makeup": serviceBridal,
  "Party Makeup": serviceBridal,
  "Manicure": serviceNails,
  "Pedicure": serviceNails,
  "Eyebrow Threading": serviceBrows,
  "Waxing": serviceBrows,
  "Spa Services": serviceSpa,
};

function Services() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");

  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data } = await supabase.from("services").select("*").eq("is_active", true).order("category");
      return data ?? [];
    },
  });

  const categories = useMemo(() => ["All", ...Array.from(new Set((services ?? []).map((s) => s.category)))], [services]);
  const filtered = useMemo(() => {
    return (services ?? []).filter((s) => {
      if (cat !== "All" && s.category !== cat) return false;
      if (q && !s.service_name.toLowerCase().includes(q.toLowerCase()) && !s.description.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [services, q, cat]);

  return (
    <div>
      <section className="bg-gradient-hero py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Services</p>
          <h1 className="mt-3 font-display text-5xl font-semibold sm:text-6xl">Our <span className="text-gradient-gold">menu</span></h1>
          <p className="mt-4 text-muted-foreground">Transparent pricing. Premium products. Crafted with love.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search services..." className="pl-9 rounded-full" />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={"rounded-full px-4 py-1.5 text-xs font-medium transition-colors " + (cat === c ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/70")}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <article key={s.id} className="overflow-hidden rounded-3xl bg-card shadow-soft transition-transform hover:-translate-y-1">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={imgByCategory[s.category] ?? serviceSpa} alt={s.service_name} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{s.category}</p>
                <h3 className="mt-1 font-display text-2xl">{s.service_name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-semibold">${Number(s.price).toFixed(0)}</span>
                    <span className="ml-2 inline-flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{s.duration_minutes} min</span>
                  </div>
                  <Button asChild size="sm" className="rounded-full bg-gradient-rose text-primary-foreground">
                    <Link to="/booking" search={{ service: s.id } as never}>Book Now</Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}
          {filtered.length === 0 && <p className="text-muted-foreground">No services match your search.</p>}
        </div>
      </section>
    </div>
  );
}