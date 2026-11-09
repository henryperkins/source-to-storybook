import { Button, Textarea, Label, RadioGroup, RadioGroupItem, Accordion, AccordionItem, AccordionTrigger, AccordionContent, AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/design-system/agent-transaction-99232c";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CardFace } from "@/components/CardFace";
import { StanceChip } from "@/components/Brand";

import { formatDate, readingQuery } from "@/lib/queries";
import { cardName, COPY, positionLabel } from "@/lib/reading-rules";

export const Route = createFileRoute("/_authenticated/readings/$id")({
  head: () => ({ meta: [{ title: "Reading — Reflection" }, { name: "description", content: "Your three-card reading with sources and personal reflection." }, { property: "og:title", content: "Reading — Reflection" }, { property: "og:description", content: "Your three-card reading with sources and personal reflection." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  loader: ({ context, params }) => context.queryClient.ensureQueryData(readingQuery(params.id)),
  component: ReadingPage,
});

const stances = [
  ["unspecified", "Not selected"],
  ["resonates", "Resonates"],
  ["unsure", "Unsure"],
  ["disagree", "Disagree"],
] as const;

function ReadingPage() {
  const { id } = Route.useParams();
  const { user } = Route.useRouteContext();
  const { data: r } = useSuspenseQuery(readingQuery(id));
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState(r?.reflection?.body ?? "");
  const [stance, setStance] = useState(r?.reflection?.stance ?? "unspecified");
  const [status, setStatus] = useState<string | null>(null);

  if (!r || (!r.saved && new Date(r.expires_at) < new Date()))
    return (
      <div className="mt-6 py-8">
        <h1 className="text-3xl">This reading isn't available</h1>
        <p className="mt-2 text-muted-foreground">Unsaved readings expire after 24 hours.</p>
        <Button asChild className="mt-4"><Link to="/readings" >Saved readings</Link></Button>
      </div>
    );

  const refresh = () => Promise.all([qc.invalidateQueries({ queryKey: ["readings"] })]);

  async function setSaved(saved: boolean) {
    const { error } = await supabase.from("readings").update({ saved, saved_at: saved ? new Date().toISOString() : null }).eq("id", id);
    setStatus(error ? "Couldn't update. Try again." : saved ? "Reading saved." : "Reading unsaved.");
    await refresh();
  }
  async function saveReflection() {
    const payload = { reading_id: id, user_id: user.id, body, stance };
    const { error } = await supabase.from("reflections").upsert(payload, { onConflict: "reading_id" });
    if (error) return setStatus("Couldn't save reflection.");
    if (!r?.saved) await supabase.from("readings").update({ saved: true, saved_at: new Date().toISOString() }).eq("id", id);
    setEditing(false);
    setStatus("Reflection saved.");
    await refresh();
  }
  async function remove() {
    await supabase.from("readings").delete().eq("id", id);
    await qc.invalidateQueries({ queryKey: ["readings"] });
    navigate({ to: "/readings" });
  }

  const it = r.interpretation;
  return (
    <article className="flex flex-col gap-10 pt-6">
      <header className="relative flex flex-col gap-3">
        <span className="text-xs font-medium text-muted-foreground">{formatDate(r.created_at)} · {r.saved ? "Saved" : "Not saved"}</span>
        <h1 className="break-words text-4xl md:text-5xl">{r.question}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          {r.saved ? (
            <Button variant="outline"  onClick={() => setSaved(false)}>Unsave</Button>
          ) : (
            <Button  onClick={() => setSaved(true)}>Save reading</Button>
          )}
          <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost">Delete</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete this reading?</AlertDialogTitle><AlertDialogDescription>This reading and its reflection will be permanently removed. This can't be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Keep reading</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={remove}>Delete reading</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
          {status && <span role="status" className="text-sm text-primary">{status}</span>}
        </div>
        {!r.saved && <p className="text-xs text-muted-foreground">{COPY.saveReading} Unsaved readings expire 24 hours after they start.</p>}
      </header>

      <section aria-labelledby="drawn">
        <h2 id="drawn" className="mb-4 text-xl">Drawn cards</h2>
        <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
          {r.cards.map((c) => <CardFace key={c.position} card={c} />)}
        </div>
      </section>

      <section aria-labelledby="interp" className="flex flex-col gap-6">
        <h2 id="interp" className="text-xl">Interpretation</h2>
        {it.units.map((u) => {
          const card = r.cards.find((c) => c.position === u.position);
          if (!card) return null;
          const src = it.sources[u.position];
          return (
            <div key={u.position} className="flex flex-col gap-3 border-t border-border py-6">
              <div className="text-xs font-medium text-muted-foreground">{positionLabel[u.position]} · {cardName(card.cardId)}, {card.orientation}</div>
              <p className="text-lg leading-relaxed text-foreground">{u.interpretation}</p>
              {src && (
                <Accordion type="single" collapsible><AccordionItem value={u.position}><AccordionTrigger>Source meaning</AccordionTrigger><AccordionContent>
                  <blockquote className="mt-2 border-l-2 border-primary pl-3">{src.core}</blockquote>
                  <p className="mt-2 text-xs">{src.attribution}</p>
                </AccordionContent></AccordionItem></Accordion>
              )}
            </div>
          );
        })}
        <div className="flex flex-col gap-3 border-t border-border py-6">
          <div className="text-xs font-medium text-muted-foreground">Bringing it together</div>
          <p className="text-lg leading-relaxed">{it.synthesis}</p>
          <div className="mt-3 text-xs font-medium text-muted-foreground">An optional next step</div>
          <p>{it.action}</p>
          {it.reflectionQuestion && (
            <>
              <div className="mt-3 text-xs font-medium text-muted-foreground">A question to sit with</div>
              <p className="font-display text-lg italic">{it.reflectionQuestion}</p>
            </>
          )}
        </div>
      </section>

      <section aria-labelledby="reflection" className="flex flex-col gap-4">
        <h2 id="reflection" className="text-xl">Your reflection</h2>
        {editing ? (
          <>
            <Textarea rows={7} value={body} maxLength={10000} onChange={(e) => setBody(e.target.value)} aria-label="Reflection" />
            <RadioGroup value={stance} onValueChange={setStance} aria-label="How does this reading sit with you?">
              <p className="text-sm text-muted-foreground">How does this reading sit with you?</p>
              <div className="flex flex-wrap gap-4">{stances.map(([v, l]) => <div key={v} className="flex items-center gap-2"><RadioGroupItem id={`stance-${v}`} value={v} /><Label htmlFor={`stance-${v}`}>{l}</Label></div>)}</div>
            </RadioGroup>
            <div className="flex gap-2">
              <Button  onClick={saveReflection}>Save reflection</Button>
              <Button variant="outline"  onClick={() => setEditing(false)}>Cancel</Button>
            </div>
            {!r.saved && <p className="text-xs text-muted-foreground">Saving a reflection also saves this reading.</p>}
          </>
        ) : r.reflection ? (
          <>
            <p className="whitespace-pre-wrap text-lg">{r.reflection.body || <em className="text-muted-foreground">No text</em>}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <StanceChip stance={r.reflection.stance} /> Saved {formatDate(r.reflection.updated_at)}
            </div>
            <Button variant="outline" className="self-start" onClick={() => setEditing(true)}>Edit reflection</Button>
          </>
        ) : (
          <Button variant="outline" className="self-start" onClick={() => setEditing(true)}>Add reflection</Button>
        )}
      </section>
    </article>
  );
}
