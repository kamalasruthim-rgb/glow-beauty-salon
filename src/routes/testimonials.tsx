import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { submitReview } from "@/lib/public-submissions.functions";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Testimonials — Glow Beauty Salon" },
      { name: "description", content: "Real reviews from real Glow clients." },
      { property: "og:title", content: "Reviews — Glow" },
      { property: "og:description", content: "Real reviews from real Glow clients." },
    ],
  }),
  component: Testimonials,
});

const schema = z.object({
  customer_name: z.string().trim().min(2).max(80),
  rating: z.number().int().min(1).max(5),
  review_text: z.string().trim().min(10, "Tell us a little more").max(1000),
});
type Form = z.infer<typeof schema>;

function Stars({ value, onChange }: { value: number; onChange?: (n: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button type="button" key={n} onClick={() => onChange?.(n)} className={onChange ? "cursor-pointer" : "cursor-default"}>
          <Star className={"h-5 w-5 " + (n <= value ? "fill-accent text-accent" : "text-muted-foreground")} />
        </button>
      ))}
    </div>
  );
}

function Testimonials() {
  const qc = useQueryClient();
  const submitReviewFn = useServerFn(submitReview);
  const { data: reviews } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => (await supabase.from("reviews").select("*").eq("is_published", true).order("created_at", { ascending: false })).data ?? [],
  });

  useEffect(() => {
    const ch = supabase
      .channel("reviews-public")
      .on("postgres_changes", { event: "*", schema: "public", table: "reviews" }, () => {
        qc.invalidateQueries({ queryKey: ["reviews"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc]);

  const [rating, setRating] = useState(5);
  const form = useForm<Form>({ resolver: zodResolver(schema), defaultValues: { rating: 5 } });

  const mut = useMutation({
    mutationFn: async (v: Form) => submitReviewFn({ data: v }),
    onSuccess: () => { toast.success("Thank you for your review!"); form.reset({ rating: 5 }); setRating(5); qc.invalidateQueries({ queryKey: ["reviews"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <section className="bg-gradient-hero py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Reviews</p>
          <h1 className="mt-3 font-display text-5xl font-semibold sm:text-6xl">Loved by <span className="text-gradient-gold">our guests</span></h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(reviews ?? []).map((r) => (
            <div key={r.id} className="rounded-3xl bg-card p-7 shadow-soft">
              <Stars value={r.rating} />
              <p className="mt-4 text-foreground/90">"{r.review_text}"</p>
              <p className="mt-5 font-display text-lg">— {r.customer_name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-card p-8 shadow-elegant">
          <h2 className="font-display text-3xl">Share your experience</h2>
          <form onSubmit={form.handleSubmit((v) => mut.mutate({ ...v, rating }))} className="mt-6 space-y-5">
            <div>
              <Label>Your name</Label>
              <Input {...form.register("customer_name")} className="mt-1.5 rounded-xl" />
            </div>
            <div>
              <Label>Rating</Label>
              <div className="mt-1.5"><Stars value={rating} onChange={(n) => { setRating(n); form.setValue("rating", n); }} /></div>
            </div>
            <div>
              <Label>Your review</Label>
              <Textarea rows={4} {...form.register("review_text")} className="mt-1.5 rounded-xl" />
            </div>
            <Button type="submit" disabled={mut.isPending} className="rounded-full bg-gradient-rose text-primary-foreground">
              {mut.isPending ? "Submitting…" : "Submit Review"}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}