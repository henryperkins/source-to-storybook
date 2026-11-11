import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button, BrandReturnMark, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, FlowHeader, FlowNavTab } from "@/design-system/agent-transaction-99232c";
import { Menu, LogOut, User } from "lucide-react";
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
  if (pathname === "/new") return (
    <div className="new-reading-reference min-h-screen">
      <header className="mx-auto flex max-w-6xl flex-wrap items-center gap-5 border-b border-border px-6 py-4 sm:px-8">
        <Link to="/readings" className="flex items-center gap-3 font-display text-2xl font-semibold"><BrandReturnMark />Reflection</Link>
        <div className="ml-auto md:hidden"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" size="lg" className="reference-menu"><Menu aria-hidden="true" />Menu</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem asChild><Link to="/account"><User aria-hidden="true" />Account</Link></DropdownMenuItem><DropdownMenuItem onSelect={signOut}><LogOut aria-hidden="true" />Sign out</DropdownMenuItem></DropdownMenuContent></DropdownMenu></div>
        <nav aria-label="Reflection" className="reference-navigation order-last flex w-full gap-6 md:order-none md:w-auto md:flex-1 md:justify-center">
          <FlowNavTab href="/readings" className="reference-tab order-last md:order-none">Saved readings</FlowNavTab>
          <FlowNavTab href="/new" variant="current" className="reference-tab">New reading</FlowNavTab>
        </nav>
        <div className="hidden items-center gap-6 md:flex"><Button asChild variant="ghost"><Link to="/account">Account</Link></Button><Button variant="ghost" onClick={signOut}>Sign out</Button></div>
      </header>
      <main className="mx-auto max-w-6xl px-6 pb-8 pt-6 sm:px-8 md:pt-10">{children}</main>
    </div>
  );
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
