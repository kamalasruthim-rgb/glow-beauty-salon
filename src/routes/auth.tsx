import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Admin Sign In — Glow" }, { name: "description", content: "Salon admin sign in." }] }),
  component: Auth,
});

function Auth() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    nav({ to: "/admin" });
  };

  const signUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: window.location.origin + "/admin" },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created. You can sign in now.");
  };

  return (
    <div className="grid min-h-[80vh] place-items-center bg-gradient-hero px-4 py-14">
      <div className="w-full max-w-md rounded-3xl bg-card p-8 shadow-elegant">
        <div className="flex items-center gap-2"><span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-gold text-gold-foreground"><Sparkles className="h-5 w-5" /></span><span className="font-display text-2xl">Glow Admin</span></div>
        <p className="mt-2 text-sm text-muted-foreground">The first account to sign up becomes the salon admin.</p>
        <Tabs defaultValue="signin" className="mt-6">
          <TabsList className="grid w-full grid-cols-2 rounded-full">
            <TabsTrigger value="signin" className="rounded-full">Sign In</TabsTrigger>
            <TabsTrigger value="signup" className="rounded-full">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin" className="mt-5 space-y-4">
            <div><Label>Email</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-1.5 rounded-xl" /></div>
            <div><Label>Password</Label><Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="mt-1.5 rounded-xl" /></div>
            <Button onClick={signIn} disabled={loading} className="w-full rounded-full bg-gradient-rose text-primary-foreground">Sign In</Button>
          </TabsContent>
          <TabsContent value="signup" className="mt-5 space-y-4">
            <div><Label>Email</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-1.5 rounded-xl" /></div>
            <div><Label>Password</Label><Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="mt-1.5 rounded-xl" /></div>
            <Button onClick={signUp} disabled={loading} className="w-full rounded-full bg-gradient-rose text-primary-foreground">Create Account</Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}