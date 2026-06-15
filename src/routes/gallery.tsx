import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { X } from "lucide-react";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";
import sFacial from "@/assets/service-facial.jpg";
import sNails from "@/assets/service-nails.jpg";
import sBridal from "@/assets/service-bridal.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Glow Beauty Salon" },
      { name: "description", content: "Bridal makeup, hair, facial transformations and salon interiors." },
      { property: "og:title", content: "Gallery — Glow" },
      { property: "og:description", content: "Bridal, hair, facial transformations and salon interiors." },
    ],
  }),
  component: Gallery,
});

const items = [
  { src: g1, cat: "Salon Interior" },
  { src: g2, cat: "Bridal Makeup" },
  { src: sFacial, cat: "Facial" },
  { src: g4, cat: "Hair Styling" },
  { src: sNails, cat: "Nails" },
  { src: g5, cat: "Party Makeup" },
  { src: g3, cat: "Facial Results" },
  { src: sBridal, cat: "Bridal" },
  { src: g6, cat: "Spa" },
];

function Gallery() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div>
      <section className="bg-gradient-hero py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Gallery</p>
          <h1 className="mt-3 font-display text-5xl font-semibold sm:text-6xl">Real <span className="text-gradient-gold">transformations</span></h1>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="columns-2 gap-4 sm:columns-3 [&>*]:mb-4">
          {items.map((it, i) => (
            <button key={i} onClick={() => setOpen(it.src)} className="block w-full overflow-hidden rounded-2xl shadow-soft transition-transform hover:scale-[1.02]">
              <img src={it.src} alt={it.cat} loading="lazy" className="w-full" />
            </button>
          ))}
        </div>
      </section>
      {open && (
        <div onClick={() => setOpen(null)} className="fixed inset-0 z-50 grid place-items-center bg-foreground/80 p-6 backdrop-blur">
          <button className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-background"><X className="h-5 w-5" /></button>
          <img src={open} alt="Preview" className="max-h-[90vh] max-w-full rounded-2xl" />
        </div>
      )}
    </div>
  );
}