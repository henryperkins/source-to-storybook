import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { formatDate, savedReadingsQuery } from "@/lib/queries";
import { cardName } from "@/lib/reading-rules";

export const Route = createFileRoute("/_authenticated/readings/")({
  head: () => ({ meta: [{ title: "Saved readings — Reflection" }, { name: "description", content: "Your dated saved tarot readings and reflections." }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(savedReadingsQuery()),
  component: History,
});

function History() {
  const { data } = useSuspenseQuery(savedReadingsQuery());
  return (
    <section className="flex flex-col gap-6 pt-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Your archive</span>
          <h1 className="mt-2 text-4xl md:text-5xl">Saved readings</h1>
        </div>
        <Link to="/new" className="btn">New reading</Link>
      </div>
      {data.length === 0 ? (
        <div className="panel p-8 text-muted-foreground">
          No saved readings yet. Start a reading and choose <strong>Save reading</strong> to keep it here.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {data.map((r) => {
            const hasReflection = Array.isArray(r.reflections) ? r.reflections.length > 0 : !!r.reflections;
            return (
              <li key={r.id}>
                <Link to="/readings/$id" params={{ id: r.id }} className="panel block p-5 transition hover:border-primary">
                  <div className="text-xs text-muted-foreground">{formatDate(r.created_at)}{hasReflection ? " · Reflection added" : ""}</div>
                  <div className="mt-1 font-serif text-xl text-foreground">{r.question}</div>
                  <div className="mt-2 text-sm text-muted-foreground">{r.cards.map((c) => cardName(c.cardId)).join(" · ")}</div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
