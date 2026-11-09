import { Button, Input, Label, Alert, AlertDescription } from "@/design-system/agent-transaction-99232c";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Brand";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  validateSearch: z.object({ redirect: z.string().optional(), mode: z.enum(["signin", "signup"]).optional() }),
  head: () => ({ meta: [{ title: "Sign in — Reflection" }, { name: "description", content: "Sign in or create a Reflection account." }, { property: "og:title", content: "Sign in — Reflection" }, { property: "og:description", content: "Sign in or create a Reflection account." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: AuthPage,
});

function safePath(p?: string) {
  if (!p) return "/readings";
  try {
    const u = new URL(p, "http://x");
    return u.origin === "http://x" || u.origin === (typeof window !== "undefined" ? window.location.origin : "") ? u.pathname + u.search : "/readings";
  } catch {
    return "/readings";
  }
}

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup" | "reset">(search.mode ?? "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "error" | "info"; text: string } | null>(null);

  // Google sign-in returns here after the redirect; if a session already
  // exists, leave the auth page instead of showing the form again.
  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (active && data.user) navigate({ to: safePath(search.redirect), replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") navigate({ to: safePath(search.redirect), replace: true });
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/readings" } });
        if (error) throw error;
        setMsg({ kind: "info", text: "Check your email to confirm your account, then sign in." });
      } else if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw new Error("That email and password didn't match.");
        navigate({ to: safePath(search.redirect) });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/reset-password" });
        if (error) throw error;
        setMsg({ kind: "info", text: "If an account exists for that email, a reset link is on its way." });
      }
    } catch (err) {
      setMsg({ kind: "error", text: err instanceof Error ? err.message : "Something went wrong." });
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (r.error) setMsg({ kind: "error", text: "Google sign-in didn't complete." });
    else if (!r.redirected) navigate({ to: safePath(search.redirect) });
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-5 py-12">
      <Logo />
      <div className="flex flex-col gap-5">
        <h1 className="font-display text-3xl">{mode === "signup" ? "Create your account" : mode === "signin" ? "Welcome back" : "Reset password"}</h1>
        {mode !== "reset" && (
          <>
            <Button type="button" variant="outline"  onClick={google}>Continue with Google</Button>
            <div className="text-center text-xs text-muted-foreground">or with email</div>
          </>
        )}
        <form onSubmit={submit} className="flex flex-col gap-3">
          <Label className="flex flex-col gap-1 text-sm">Email
            <Input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Label>
          {mode !== "reset" && (
            <Label className="flex flex-col gap-1 text-sm">Password
              <Input type="password" required minLength={8} autoComplete={mode === "signup" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} />
            </Label>
          )}
          <Button className="mt-2" loading={busy}>{ mode === "signup" ? "Create account" : mode === "signin" ? "Sign in" : "Send reset link"}</Button>
        </form>
        {msg && <Alert variant={msg.kind === "error" ? "destructive" : "default"}><AlertDescription>{msg.text}</AlertDescription></Alert>}
        <div className="flex flex-wrap justify-between gap-2 text-sm">
          {mode === "signup" ? (
            <Button type="button" variant="link"  onClick={() => setMode("signin")}>I already have an account</Button>
          ) : (
            <Button type="button" variant="link"  onClick={() => setMode("signup")}>Create an account</Button>
          )}
          {mode === "signin" && <Button type="button" variant="link"  onClick={() => setMode("reset")}>Forgot password?</Button>}
          {mode === "reset" && <Button type="button" variant="link"  onClick={() => setMode("signin")}>Back to sign in</Button>}
        </div>
      </div>
    </div>
  );
}
