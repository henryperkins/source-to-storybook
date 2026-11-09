import { Button, Label, Switch, AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/design-system/agent-transaction-99232c";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { profileQuery } from "@/lib/queries";
import { COPY, DAILY_LIMIT, MONTHLY_LIMIT } from "@/lib/reading-rules";
import { deleteAccount } from "@/lib/readings.functions";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({ meta: [{ title: "Account — Reflection" }, { name: "description", content: "AI permission, data export and account deletion." }, { property: "og:title", content: "Account — Reflection" }, { property: "og:description", content: "AI permission, data export and account deletion." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(profileQuery(context.user.id)),
  component: Account,
});

function Account() {
  const { user } = Route.useRouteContext();
  const { data: profile } = useSuspenseQuery(profileQuery(user.id));
  const qc = useQueryClient();
  const navigate = useNavigate();
  const del = useServerFn(deleteAccount);
  const [status, setStatus] = useState<string | null>(null);

  async function toggleAi(on: boolean) {
    const { error } = await supabase.from("profiles").update({ ai_enabled: on, ai_enabled_at: on ? new Date().toISOString() : null, updated_at: new Date().toISOString() }).eq("id", user.id);
    setStatus(error ? "Couldn't update permission." : on ? "AI readings are on." : "AI readings are off.");
    await qc.invalidateQueries({ queryKey: ["profile"] });
  }

  async function exportData() {
    const { data: readings } = await supabase.from("readings").select("*, reflections(*)").eq("saved", true).order("created_at");
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), account: user.email, readings }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `reflection-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function removeAccount() {
    await del();
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  return (
    <section className="mx-auto flex max-w-2xl flex-col gap-6 pt-6">
      <h1 className="text-4xl md:text-5xl">Account</h1>
      <p className="break-words text-muted-foreground">Signed in as {user.email}</p>

      <div className="flex flex-col gap-3 border-t border-border py-6">
        <h2 className="text-xl">AI readings</h2>
        <p className="text-sm text-muted-foreground">{COPY.aiPermission}</p>
        <p className="text-sm text-muted-foreground">{COPY.providerRetention} Limits: {DAILY_LIMIT} readings a day, {MONTHLY_LIMIT} a month.</p>
        <div className="flex items-center gap-3"><Switch id="ai-permission" checked={profile.ai_enabled} onCheckedChange={toggleAi} /><Label htmlFor="ai-permission">Allow AI readings</Label></div>
        {status && <p role="status" className="text-sm text-primary">{status}</p>}
      </div>

      <div className="flex flex-col gap-3 border-t border-border py-6">
        <h2 className="text-xl">Your data</h2>
        <p className="text-sm text-muted-foreground">Download every saved reading and reflection as a file.</p>
        <Button variant="outline" className="self-start" onClick={exportData}>Export saved readings</Button>
      </div>

      <div className="flex flex-col gap-3 border-t border-border py-6">
        <h2 className="text-xl">Delete account</h2>
        <p className="text-sm text-muted-foreground">Permanently removes your account, readings and reflections.</p>
        <AlertDialog><div className="self-start"><AlertDialogTrigger asChild><Button variant="destructive">Delete account</Button></AlertDialogTrigger></div><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete your account?</AlertDialogTitle><AlertDialogDescription>All saved readings and reflections will be permanently removed. This can't be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Keep account</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={removeAccount}>Delete account</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      </div>
    </section>
  );
}
