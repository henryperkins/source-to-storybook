import { Button, JournalEntryRow } from "@/design-system/agent-transaction-99232c";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { formatDate, savedReadingsQuery } from "@/lib/queries";
import { cardName } from "@/lib/reading-rules";

export const Route = createFileRoute("/_authenticated/readings/")({
  head: () => ({ meta: [{ title: "Saved readings — Reflection" }, { name: "description", content: "Your dated saved tarot readings and reflections." }, { property: "og:title", content: "Saved readings — Reflection" }, { property: "og:description", content: "Your dated saved tarot readings and reflections." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(savedReadingsQuery()),
  component: History,
});

function History() {
  const { data } = useSuspenseQuery(savedReadingsQuery());
  return (
    <section className="flex flex-col gap-6 pt-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs font-medium text-muted-foreground">Your archive</span>
          <h1 className="mt-2 text-4xl md:text-5xl">Saved readings</h1>
        </div>
        <Button asChild><Link to="/new" >New reading</Link></Button>
      </div>
      {data.length === 0 ? (
        <div className="py-12 text-muted-foreground">
          No saved readings yet. Start a reading and choose <strong>Save reading</strong> to keep it here.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {data.map((r) => {
            const hasReflection = Array.isArray(r.reflections) ? r.reflections.length > 0 : !!r.reflections;
            return (
              <li key={r.id}>
                <JournalEntryRow source="Three-card reading" title={r.question} excerpt={r.cards.map((c) => cardName(c.cardId)).join(" · ")} metadata={`${formatDate(r.created_at)}${hasReflection ? " · Reflection added" : ""}`} actions={<Button asChild variant="link"><Link to="/readings/$id" params={{ id: r.id }}>Open reading</Link></Button>} />
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
