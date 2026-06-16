import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, LogOut, MessageSquare, Plus, Scissors } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useIsAdmin } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/admin")({
  component: Admin,
});

function Admin() {
  const nav = useNavigate();
  const { user } = useAuth();
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin(user?.id);
  const qc = useQueryClient();

  const { data: appointments } = useQuery({
    queryKey: ["admin-appts"], enabled: !!isAdmin,
    queryFn: async () => (await supabase.from("appointments").select("*, services(service_name)").order("created_at", { ascending: false })).data ?? [],
  });
  const { data: services } = useQuery({
    queryKey: ["admin-services"], enabled: !!isAdmin,
    queryFn: async () => (await supabase.from("services").select("*").order("category")).data ?? [],
  });
  const { data: reviews } = useQuery({
    queryKey: ["admin-reviews"], enabled: !!isAdmin,
    queryFn: async () => (await supabase.from("reviews").select("*").order("created_at", { ascending: false })).data ?? [],
  });

  useEffect(() => {
    if (!isAdmin) return;
    const ch = supabase
      .channel("admin-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "appointments" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-appts"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "reviews" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-reviews"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "services" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-services"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [isAdmin, qc]);

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["admin-appts"] }); },
  });

  const deleteService = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("services").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Service removed"); qc.invalidateQueries({ queryKey: ["admin-services"] }); },
  });

  const togglePublish = useMutation({
    mutationFn: async ({ id, on }: { id: string; on: boolean }) => { const { error } = await supabase.from("reviews").update({ is_published: on }).eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["admin-reviews"] }); },
  });

  const createService = useMutation({
    mutationFn: async (input: {
      service_name: string; category: string; description: string;
      price: number; duration_minutes: number; image_url: string | null;
    }) => {
      const { error } = await supabase.from("services").insert(input);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Service created"); qc.invalidateQueries({ queryKey: ["admin-services"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const signOut = async () => { await supabase.auth.signOut(); nav({ to: "/auth" }); };

  if (roleLoading) return <div className="p-10 text-center text-muted-foreground">Loading…</div>;
  if (!isAdmin) return (
    <div className="mx-auto max-w-md p-10 text-center">
      <h1 className="font-display text-3xl">Access denied</h1>
      <p className="mt-2 text-muted-foreground">Your account doesn't have admin privileges.</p>
      <Button onClick={signOut} className="mt-6 rounded-full">Sign out</Button>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back, {user?.email}</p>
        </div>
        <Button variant="outline" onClick={signOut} className="rounded-full"><LogOut className="mr-2 h-4 w-4" /> Sign out</Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat icon={<CalendarDays className="h-5 w-5" />} label="Appointments" value={appointments?.length ?? 0} />
        <Stat icon={<Scissors className="h-5 w-5" />} label="Services" value={services?.length ?? 0} />
        <Stat icon={<MessageSquare className="h-5 w-5" />} label="Reviews" value={reviews?.length ?? 0} />
      </div>

      <Section title="Appointments">
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-left">
              <tr><th className="p-3">Customer</th><th className="p-3">Service</th><th className="p-3">Date</th><th className="p-3">Time</th><th className="p-3">Phone</th><th className="p-3">Status</th><th className="p-3">Action</th></tr>
            </thead>
            <tbody>
              {(appointments ?? []).map((a) => (
                <tr key={a.id} className="border-t border-border">
                  <td className="p-3">{a.customer_name}</td>
                  <td className="p-3">{(a as { services?: { service_name?: string } }).services?.service_name ?? "—"}</td>
                  <td className="p-3">{a.booking_date}</td>
                  <td className="p-3">{a.booking_time}</td>
                  <td className="p-3">{a.phone}</td>
                  <td className="p-3"><span className="rounded-full bg-secondary px-2 py-0.5 text-xs">{a.status}</span></td>
                  <td className="p-3">
                    <select defaultValue={a.status} onChange={(e) => updateStatus.mutate({ id: a.id, status: e.target.value })} className="rounded-md border border-input bg-background px-2 py-1 text-xs">
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
              {(appointments ?? []).length === 0 && <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">No appointments yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Services">
        <NewServiceForm onSubmit={(v) => createService.mutate(v)} pending={createService.isPending} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(services ?? []).map((s) => (
            <div key={s.id} className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs uppercase tracking-wide text-primary">{s.category}</p>
              <h3 className="mt-1 font-display text-lg">{s.service_name}</h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{s.description}</p>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span>${Number(s.price).toFixed(0)} · {s.duration_minutes}m</span>
                <Button size="sm" variant="outline" onClick={() => deleteService.mutate(s.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Reviews">
        <div className="space-y-3">
          {(reviews ?? []).map((r) => (
            <div key={r.id} className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-card p-4">
              <div>
                <p className="font-display text-lg">{r.customer_name} · {r.rating}★</p>
                <p className="mt-1 text-sm text-muted-foreground">{r.review_text}</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => togglePublish.mutate({ id: r.id, on: !r.is_published })}>
                {r.is_published ? "Hide" : "Publish"}
              </Button>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-3xl bg-gradient-rose p-5 text-primary-foreground shadow-soft">
      <div className="flex items-center justify-between"><span className="text-sm opacity-90">{label}</span><span>{icon}</span></div>
      <p className="mt-3 font-display text-4xl">{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

const serviceSchema = z.object({
  service_name: z.string().trim().min(2).max(100),
  category: z.string().trim().min(2).max(50),
  description: z.string().trim().min(5).max(500),
  price: z.number().min(0).max(10000),
  duration_minutes: z.number().int().min(5).max(600),
});

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

type ServiceInput = {
  service_name: string; category: string; description: string;
  price: number; duration_minutes: number; image_url: string | null;
};

function NewServiceForm({ onSubmit, pending }: { onSubmit: (v: ServiceInput) => void; pending: boolean }) {
  const [form, setForm] = useState({
    service_name: "", category: "", description: "",
    price: "", duration_minutes: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (!f) { setFile(null); setPreview(null); return; }
    if (!ALLOWED_IMAGE_TYPES.includes(f.type)) {
      toast.error("Image must be JPG, PNG, WEBP, or GIF");
      e.target.value = "";
      return;
    }
    if (f.size > MAX_IMAGE_BYTES) {
      toast.error("Image must be under 5 MB");
      e.target.value = "";
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = serviceSchema.safeParse({
      service_name: form.service_name,
      category: form.category,
      description: form.description,
      price: Number(form.price),
      duration_minutes: Number(form.duration_minutes),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    let image_url: string | null = null;
    if (file) {
      try {
        setUploading(true);
        const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("service-images")
          .upload(path, file, { contentType: file.type, upsert: false });
        if (upErr) throw upErr;
        // Bucket is private; mint a long-lived signed URL (10 years).
        const { data: signed, error: signErr } = await supabase.storage
          .from("service-images")
          .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
        if (signErr || !signed) throw signErr ?? new Error("Failed to sign URL");
        image_url = signed.signedUrl;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Image upload failed");
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    onSubmit({ ...parsed.data, image_url });
    setForm({ service_name: "", category: "", description: "", price: "", duration_minutes: "" });
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  };

  return (
    <form onSubmit={submit} className="mb-6 rounded-2xl border border-border bg-card p-5">
      <h3 className="font-display text-lg">Add new service</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="svc-name">Service name</Label>
          <Input id="svc-name" value={form.service_name} onChange={set("service_name")} placeholder="Signature Facial" required />
        </div>
        <div>
          <Label htmlFor="svc-cat">Category</Label>
          <Input id="svc-cat" value={form.category} onChange={set("category")} placeholder="Facial" required />
        </div>
        <div>
          <Label htmlFor="svc-price">Price ($)</Label>
          <Input id="svc-price" type="number" min="0" step="1" value={form.price} onChange={set("price")} required />
        </div>
        <div>
          <Label htmlFor="svc-dur">Duration (minutes)</Label>
          <Input id="svc-dur" type="number" min="5" step="5" value={form.duration_minutes} onChange={set("duration_minutes")} required />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="svc-img">Service image (optional, max 5 MB)</Label>
          <Input
            id="svc-img"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={onPickFile}
          />
          {preview && (
            <img src={preview} alt="Preview" className="mt-3 h-32 w-32 rounded-xl object-cover" />
          )}
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="svc-desc">Description</Label>
          <Textarea id="svc-desc" value={form.description} onChange={set("description")} rows={3} required />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button type="submit" disabled={pending || uploading} className="rounded-full">
          <Plus className="mr-2 h-4 w-4" />
          {uploading ? "Uploading…" : pending ? "Adding…" : "Add service"}
        </Button>
      </div>
    </form>
  );
}