import { Button, FlowMomentArt, HomeReturnRow, JournalEntryRow, JournalFilterChip, JournalTarotBasis } from "@/design-system/agent-transaction-99232c";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { formatDate, savedReadingsQuery } from "@/lib/queries";
import { cardName } from "@/lib/reading-rules";
import { journalFilters, journalReflection, matchesJournalFilter, tarotBasisCards, type JournalFilter } from "@/lib/journal";
import { StanceChip } from "@/components/Brand";

export const Route = createFileRoute("/_authenticated/readings/")({
  head: () => ({ meta: [{ title: "Saved readings — Reflection" }, { name: "description", content: "Your dated saved tarot readings and reflections." }, { property: "og:title", content: "Saved readings — Reflection" }, { property: "og:description", content: "Your dated saved tarot readings and reflections." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(savedReadingsQuery()),
  component: History,
});

function History() {
  const { data } = useSuspenseQuery(savedReadingsQuery());
  const [filter, setFilter] = useState<JournalFilter>("all");
  const entries = data.filter((r) => matchesJournalFilter(journalReflection(r.reflections), filter));
  const latestReflection = data
    .map((r) => ({ reading: r, reflection: journalReflection(r.reflections) }))
    .filter((entry) => entry.reflection !== null)
    .sort((a, b) => (b.reflection?.updated_at ?? "").localeCompare(a.reflection?.updated_at ?? ""))[0];
  return (
    <section className="flex flex-col gap-6 pt-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs font-medium text-muted-foreground">Your archive</span>
          <h1 className="mt-2 font-display text-4xl md:text-5xl">Saved readings</h1>
        </div>
        <Button asChild><Link to="/new" >New reading</Link></Button>
      </div>
      {data.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <FlowMomentArt moment="Reflecting" size="lg" />
          <h2 className="font-display text-2xl">Nothing kept yet</h2>
          <p className="max-w-sm text-muted-foreground">Start a reading and choose <strong>Save reading</strong> to keep it here.</p>
          <Button asChild><Link to="/new">Draw your first spread</Link></Button>
        </div>
      ) : (
        <>
        {latestReflection?.reflection && <section aria-labelledby="return-heading" className="flex flex-col gap-2">
          <h2 id="return-heading" className="font-display text-2xl">Return to your reflection</h2>
          <HomeReturnRow date={formatDate(latestReflection.reflection.updated_at)} question={latestReflection.reading.question} href={`/readings/${latestReflection.reading.id}#reflection`} />
        </section>}
        <div aria-label="Filter saved readings" className="flex flex-wrap gap-2">
          {journalFilters.map((f) => <JournalFilterChip key={f.value} state={filter === f.value ? "Selected" : "Default"} onClick={() => setFilter(f.value)}>{f.label}</JournalFilterChip>)}
        </div>
        <p role="status" className="text-sm text-muted-foreground">{entries.length} {entries.length === 1 ? "reading" : "readings"}</p>
        {entries.length === 0 ? <div className="flex flex-col items-start gap-3 py-8">
          <h2 className="font-display text-2xl">No readings here yet</h2>
          <Button variant="outline" onClick={() => setFilter("all")}>Show all readings</Button>
        </div> : <ul className="flex flex-col gap-3">
          {entries.map((r) => {
            const reflection = journalReflection(r.reflections);
            return (
              <li key={r.id}>
                <JournalEntryRow source="Three-card reading" title={r.question} excerpt={reflection?.body || r.cards.map((c) => cardName(c.cardId)).join(" · ")} metadata={`${formatDate(r.created_at)}${reflection ? ` · Reflected ${formatDate(reflection.updated_at)}` : ""}`} actions={<Button asChild variant="link"><Link to="/readings/$id" params={{ id: r.id }}>Open reading</Link></Button>}>
                  <div className="flex flex-col gap-3">
                    {reflection && <div><StanceChip stance={reflection.stance} /></div>}
                    <JournalTarotBasis cards={tarotBasisCards(r.id, r.cards)} />
                  </div>
                </JournalEntryRow>
              </li>
            );
          })}
        </ul>}
        </>
      )}
    </section>
  );
}
