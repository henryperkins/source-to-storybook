import { Button, FlowSidePanel, JournalTarotBasis, JournalEntryRow, TopicChip, Textarea, Label, RadioGroup, RadioGroupItem, Accordion, AccordionItem, AccordionTrigger, AccordionContent, AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/design-system/agent-transaction-99232c";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CardFace } from "@/components/CardFace";
import { StanceChip } from "@/components/Brand";
import { ArrowLeft, Bookmark, BookmarkMinus, Trash2, Pencil } from "lucide-react";
import returning from "@/design-system/agent-transaction-99232c/assets/illustrations/reflection-returning-paper.png";

import { formatDate, readingQuery } from "@/lib/queries";
import { cardName, COPY, positionLabel } from "@/lib/reading-rules";
import { tarotBasisCards } from "@/lib/journal";

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
        <h1 className="font-display text-3xl">This reading isn't available</h1>
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
    <article className="flex flex-col gap-10">
      <header className="relative flex flex-col gap-4">
        <div className="self-start"><Button asChild variant="link"><Link to="/readings"><ArrowLeft aria-hidden="true" />Saved readings</Link></Button></div>
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-muted-foreground"><span>{formatDate(r.created_at)}</span><TopicChip tone={r.saved ? "Mint" : "Butter"} label={r.saved ? "Saved" : "Unsaved · 24h"} /></div>
        <h1 className="max-w-4xl break-words font-display text-4xl font-semibold md:text-5xl">{r.question}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          {r.saved ? (
            <Button variant="outline"  onClick={() => setSaved(false)}><BookmarkMinus aria-hidden="true" />Unsave</Button>
          ) : (
            <Button  onClick={() => setSaved(true)}><Bookmark aria-hidden="true" />Save reading</Button>
          )}
          <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost"><Trash2 aria-hidden="true" />Delete</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete this reading?</AlertDialogTitle><AlertDialogDescription>This reading and its reflection will be permanently removed. This can't be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Keep reading</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={remove}>Delete reading</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
          {status && <span role="status" className="text-sm text-primary">{status}</span>}
        </div>
        {!r.saved && <p className="text-xs text-muted-foreground">{COPY.saveReading} Unsaved readings expire 24 hours after they start.</p>}
      </header>

      <section aria-labelledby="drawn" className="border-t border-border pt-6">
        <h2 id="drawn" className="mb-6 font-display text-3xl font-semibold">Drawn cards</h2>
        <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
          {r.cards.map((c) => <div key={c.position} id={`card-${c.position}`} className="scroll-mt-6"><CardFace card={c} /></div>)}
        </div>
      </section>

      <section aria-labelledby="interp" className="flex flex-col gap-6">
        <h2 id="interp" className="font-display text-3xl font-semibold">Interpretation</h2>
        <div className="grid gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
        {it.units.map((u) => {
          const card = r.cards.find((c) => c.position === u.position);
          if (!card) return null;
          const src = it.sources[u.position];
          return (
            <div key={u.position} className="flex flex-col gap-3 border-t border-border py-6">
              <h3 className="font-display text-2xl font-semibold">{positionLabel[u.position]}</h3>
              <div className="text-sm text-muted-foreground">{cardName(card.cardId)} · {card.orientation}</div>
              <p className="text-lg leading-relaxed text-foreground">{u.interpretation}</p>
              {src && <p className="text-xs text-muted-foreground">{src.attribution}</p>}
            </div>
          );
        })}
        <div className="flex flex-col gap-4 border-t border-border py-6">
          <h3 className="font-display text-2xl font-semibold">Bringing it together</h3>
          <p className="text-lg leading-relaxed">{it.synthesis}</p>
          <h3 className="mt-3 font-display text-2xl font-semibold">An optional next step</h3>
          <p>{it.action}</p>
          {it.reflectionQuestion && (
            <>
              <h3 className="mt-3 text-sm font-medium text-muted-foreground">A question to sit with</h3>
              <p className="border-l-2 border-accent pl-4 font-display text-2xl italic">{it.reflectionQuestion}</p>
            </>
          )}
        </div>
        </div>
        <FlowSidePanel title="Card notes" art={<img src={returning} alt="" className="h-24 w-full object-contain" />}>
          <Accordion type="multiple">
            {r.cards.map((card) => {
              const source = it.sources[card.position];
              return source ? <AccordionItem key={card.position} value={card.position}><AccordionTrigger>{positionLabel[card.position]} · {cardName(card.cardId)}</AccordionTrigger><AccordionContent><div className="flex flex-col gap-3"><blockquote>{source.core}</blockquote><p className="text-xs text-muted-foreground">{source.attribution}</p></div></AccordionContent></AccordionItem> : null;
            })}
          </Accordion>
        </FlowSidePanel>
        </div>
      </section>

      <section aria-labelledby="reflection" className="flex flex-col gap-6 border-t border-border pt-8">
        <h2 id="reflection" className="font-display text-3xl font-semibold">Your reflection</h2>
        <JournalTarotBasis cards={tarotBasisCards(r.id, r.cards)} />
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
            <JournalEntryRow source="Your journal" title="What this means to you" excerpt="" metadata={`Saved ${formatDate(r.reflection.updated_at)}`} actions={<Button variant="outline" onClick={() => setEditing(true)}><Pencil aria-hidden="true" />Edit reflection</Button>}>
              <div className="flex flex-col gap-3"><p className="whitespace-pre-wrap break-words text-lg">{r.reflection.body || <em className="text-muted-foreground">No text</em>}</p><div><StanceChip stance={r.reflection.stance} /></div></div>
            </JournalEntryRow>
          </>
        ) : (
          <Button variant="outline" className="self-start" onClick={() => setEditing(true)}>Add reflection</Button>
        )}
      </section>
    </article>
  );
}
