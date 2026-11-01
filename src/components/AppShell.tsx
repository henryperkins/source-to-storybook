import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }
  const link = "rounded-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground";
  const active = { className: "rounded-full px-3 py-2 text-sm bg-muted text-foreground" };
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-5 py-4">
        <Link to="/readings" className="font-serif text-2xl text-foreground">Reflection</Link>
        <nav className="flex flex-wrap items-center gap-1">
          <Link to="/readings" className={link} activeProps={active} activeOptions={{ exact: true }}>Saved readings</Link>
          <Link to="/new" className={link} activeProps={active}>New reading</Link>
          <Link to="/account" className={link} activeProps={active}>Account</Link>
          <button type="button" onClick={signOut} className={link}>Sign out</button>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-5 pb-20">{children}</main>
    </div>
  );
}
