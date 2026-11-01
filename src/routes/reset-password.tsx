import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Choose a new password — Reflection" }, { name: "description", content: "Set a new password for your Reflection account." }] }),
  component: Reset,
});

function Reset() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  async function submit(e: FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setError(error.message);
    else navigate({ to: "/readings" });
  }
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5">
      <form onSubmit={submit} className="panel flex flex-col gap-4 p-6">
        <h1 className="text-3xl">Choose a new password</h1>
        <input className="field" type="password" minLength={8} required autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} aria-label="New password" />
        <button className="btn">Save password</button>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </form>
    </div>
  );
}
