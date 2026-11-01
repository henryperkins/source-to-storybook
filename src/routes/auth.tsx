import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  validateSearch: z.object({ redirect: z.string().optional(), mode: z.enum(["signin", "signup"]).optional() }),
  head: () => ({ meta: [{ title: "Sign in — Reflection" }, { name: "description", content: "Sign in or create a Reflection account." }] }),
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
      <a href="/" className="font-serif text-2xl text-foreground">Reflection</a>
      <div className="panel flex flex-col gap-5 p-6">
        <h1 className="text-3xl">{mode === "signup" ? "Create your account" : mode === "signin" ? "Welcome back" : "Reset password"}</h1>
        {mode !== "reset" && (
          <>
            <button type="button" className="btn btn-secondary" onClick={google}>Continue with Google</button>
            <div className="text-center text-xs text-muted-foreground">or with email</div>
          </>
        )}
        <form onSubmit={submit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm">Email
            <input className="field" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          {mode !== "reset" && (
            <label className="flex flex-col gap-1 text-sm">Password
              <input className="field" type="password" required minLength={8} autoComplete={mode === "signup" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
          )}
          <button className="btn mt-2" disabled={busy}>{busy ? "Please wait…" : mode === "signup" ? "Create account" : mode === "signin" ? "Sign in" : "Send reset link"}</button>
        </form>
        {msg && <p role="status" className={msg.kind === "error" ? "text-sm text-destructive" : "text-sm text-success-foreground"}>{msg.text}</p>}
        <div className="flex flex-wrap justify-between gap-2 text-sm">
          {mode === "signup" ? (
            <button type="button" className="underline" onClick={() => setMode("signin")}>I already have an account</button>
          ) : (
            <button type="button" className="underline" onClick={() => setMode("signup")}>Create an account</button>
          )}
          {mode === "signin" && <button type="button" className="underline" onClick={() => setMode("reset")}>Forgot password?</button>}
          {mode === "reset" && <button type="button" className="underline" onClick={() => setMode("signin")}>Back to sign in</button>}
        </div>
      </div>
    </div>
  );
}
