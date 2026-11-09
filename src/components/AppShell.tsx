import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button, FlowHeader, FlowNavTab } from "@/design-system/agent-transaction-99232c";
import { LeafFooter, Logo } from "@/components/Brand";

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="relative min-h-screen">
      <div className="mx-auto max-w-5xl px-5">
        <FlowHeader brand={<Logo to="/readings" />} navigation={<>
          <FlowNavTab href="/readings" variant={pathname.startsWith("/readings") ? "current" : "default"}>Saved readings</FlowNavTab>
          <FlowNavTab href="/new" variant={pathname === "/new" ? "current" : "default"}>New reading</FlowNavTab>
          <FlowNavTab href="/account" variant={pathname === "/account" ? "current" : "default"}>Account</FlowNavTab>
        </>} actions={<Button variant="ghost" onClick={signOut}>Sign out</Button>} />
      </div>
      <main className="relative z-10 mx-auto max-w-5xl px-5 pb-12">{children}</main>
      <LeafFooter />
    </div>
  );
}
