import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CalendarCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "Book an Appointment — Glow Beauty Salon" },
      { name: "description", content: "Reserve your appointment online in under 60 seconds." },
      { property: "og:title", content: "Book — Glow Beauty Salon" },
      { property: "og:description", content: "Reserve your appointment online." },
    ],
  }),
  component: Booking,
});

const schema = z.object({
  customer_name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z.string().trim().min(7, "Enter a valid phone").max(20),
  email: z.string().trim().email("Enter a valid email").max(120),
  service_id: z.string().min(1, "Choose a service"),
  booking_date: z.string().min(1, "Pick a date"),
  booking_time: z.string().min(1, "Pick a time"),
  notes: z.string().max(500).optional(),
});
type Form = z.infer<typeof schema>;

function Booking() {
  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: async () => (await supabase.from("services").select("id,service_name,category").eq("is_active", true).order("service_name")).data ?? [],
  });

  const form = useForm<Form>({ resolver: zodResolver(schema) });

  const mut = useMutation({
    mutationFn: async (v: Form) => {
      const { error } = await supabase.from("appointments").insert({
        customer_name: v.customer_name,
        phone: v.phone,
        email: v.email,
        service_id: v.service_id,
        booking_date: v.booking_date,
        booking_time: v.booking_time,
        notes: v.notes ?? null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Appointment requested! We'll confirm shortly.");
      form.reset();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <section className="bg-gradient-hero py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Book</p>
          <h1 className="mt-3 font-display text-5xl font-semibold sm:text-6xl">Reserve your <span className="text-gradient-gold">Glow moment</span></h1>
          <p className="mt-4 text-muted-foreground">Fill in your details and we'll confirm by phone or email.</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <form onSubmit={form.handleSubmit((v) => mut.mutate(v))} className="space-y-5 rounded-3xl bg-card p-8 shadow-elegant">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="customer_name">Full name</Label>
              <Input id="customer_name" {...form.register("customer_name")} className="mt-1.5 rounded-xl" />
              {form.formState.errors.customer_name && <p className="mt-1 text-xs text-destructive">{form.formState.errors.customer_name.message}</p>}
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...form.register("phone")} className="mt-1.5 rounded-xl" />
              {form.formState.errors.phone && <p className="mt-1 text-xs text-destructive">{form.formState.errors.phone.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register("email")} className="mt-1.5 rounded-xl" />
            {form.formState.errors.email && <p className="mt-1 text-xs text-destructive">{form.formState.errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="service_id">Service</Label>
            <select id="service_id" {...form.register("service_id")} className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm">
              <option value="">Choose a service…</option>
              {(services ?? []).map((s) => (
                <option key={s.id} value={s.id}>{s.service_name} — {s.category}</option>
              ))}
            </select>
            {form.formState.errors.service_id && <p className="mt-1 text-xs text-destructive">{form.formState.errors.service_id.message}</p>}
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="booking_date">Preferred date</Label>
              <Input id="booking_date" type="date" min={today} {...form.register("booking_date")} className="mt-1.5 rounded-xl" />
              {form.formState.errors.booking_date && <p className="mt-1 text-xs text-destructive">{form.formState.errors.booking_date.message}</p>}
            </div>
            <div>
              <Label htmlFor="booking_time">Preferred time</Label>
              <Input id="booking_time" type="time" {...form.register("booking_time")} className="mt-1.5 rounded-xl" />
              {form.formState.errors.booking_time && <p className="mt-1 text-xs text-destructive">{form.formState.errors.booking_time.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Additional notes (optional)</Label>
            <Textarea id="notes" {...form.register("notes")} className="mt-1.5 rounded-xl" rows={3} />
          </div>
          <Button type="submit" size="lg" disabled={mut.isPending} className="w-full rounded-full bg-gradient-rose text-primary-foreground shadow-soft">
            <CalendarCheck className="mr-2 h-4 w-4" />{mut.isPending ? "Sending…" : "Request Appointment"}
          </Button>
        </form>
      </section>
    </div>
  );
}