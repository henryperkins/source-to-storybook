import { Button, Input, Textarea, Label, Checkbox, Switch, RadioGroup, RadioGroupItem, Alert, AlertTitle, AlertDescription, TarotFlowProgress, FlowSidePanel, JournalEntryRow, TextLink, TopicChip } from "@/design-system/agent-transaction-99232c";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CardFace } from "@/components/CardFace";
import { StanceChip } from "@/components/Brand";
import leaves from "@/assets/leaves.png.asset.json";
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
    if (!r!.saved) await supabase.from("readings").update({ saved: true, saved_at: new Date().toISOString() }).eq("id", id);
    setEditing(false);
    setStatus("Reflection saved.");
    await refresh();
  }
  async function remove() {
    if (!confirm("Delete this reading and its reflection? This can't be undone.")) return;
    await supabase.from("readings").delete().eq("id", id);
    await qc.invalidateQueries({ queryKey: ["readings"] });
    navigate({ to: "/readings" });
  }

  const it = r.interpretation;
  return (
    <article className="flex flex-col gap-10 pt-6">
      <header className="relative flex flex-col gap-3">
        <img src={leaves.url} alt="" aria-hidden className="pointer-events-none absolute -top-4 right-0 hidden w-40 md:block" />
        <span className="text-xs font-medium text-muted-foreground">{formatDate(r.created_at)} · {r.saved ? "Saved" : "Not saved"}</span>
        <h1 className="text-4xl md:text-5xl">{r.question}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          {r.saved ? (
            <Button variant="outline"  onClick={() => setSaved(false)}>Unsave</Button>
          ) : (
            <Button  onClick={() => setSaved(true)}>Save reading</Button>
          )}
          <Button variant="outline"  onClick={remove}>Delete</Button>
          {status && <span role="status" className="text-sm text-primary">{status}</span>}
        </div>
        {!r.saved && <p className="text-xs text-muted-foreground">{COPY.saveReading} Unsaved readings expire 24 hours after they start.</p>}
      </header>

      <section aria-labelledby="drawn">
        <h2 id="drawn" className="mb-4 text-xl">Drawn cards</h2>
        <div className="grid grid-cols-3 gap-3 md:gap-6">
          {r.cards.map((c) => <CardFace key={c.position} card={c} />)}
        </div>
      </section>

      <section aria-labelledby="interp" className="flex flex-col gap-6">
        <h2 id="interp" className="text-xl">Interpretation</h2>
        {it.units.map((u) => {
          const card = r.cards.find((c) => c.position === u.position)!;
          const src = it.sources[u.position];
          return (
            <div key={u.position} className="flex flex-col gap-3 border-t border-border py-6">
              <div className="text-xs font-medium text-muted-foreground">{positionLabel[u.position]} · {cardName(card.cardId)}, {card.orientation}</div>
              <p className="font-display text-lg leading-relaxed text-foreground">{u.interpretation}</p>
              {src && (
                <details className="text-sm text-muted-foreground">
                  <summary className="cursor-pointer">Source meaning</summary>
                  <blockquote className="mt-2 border-l-2 border-primary pl-3">{src.core}</blockquote>
                  <p className="mt-2 text-xs">{src.attribution}</p>
                </details>
              )}
            </div>
          );
        })}
        <div className="flex flex-col gap-3 border-t border-border py-6">
          <div className="text-xs font-medium text-muted-foreground">Bringing it together</div>
          <p className="font-display text-lg leading-relaxed">{it.synthesis}</p>
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
            <fieldset className="flex flex-wrap gap-3 text-sm">
              <legend className="mb-2 text-sm text-muted-foreground">How does this reading sit with you?</legend>
              {stances.map(([v, l]) => (
                <Label key={v} className="flex items-center gap-1">
                  <input type="radio" name="stance" value={v} checked={stance === v} onChange={() => setStance(v)} /> {l}
                </Label>
              ))}
            </fieldset>
            <div className="flex gap-2">
              <Button  onClick={saveReflection}>Save reflection</Button>
              <Button variant="outline"  onClick={() => setEditing(false)}>Cancel</Button>
            </div>
            {!r.saved && <p className="text-xs text-muted-foreground">Saving a reflection also saves this reading.</p>}
          </>
        ) : r.reflection ? (
          <>
            <p className="whitespace-pre-wrap font-display text-lg">{r.reflection.body || <em className="text-muted-foreground">No text</em>}</p>
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
