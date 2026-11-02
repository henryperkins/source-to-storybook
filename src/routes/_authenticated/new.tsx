import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import { profileQuery } from "@/lib/queries";
import { admitQuestion, COPY, MAX_QUESTION } from "@/lib/reading-rules";
import { startReading } from "@/lib/readings.functions";
import { PositionTiles } from "@/components/Brand";

export const Route = createFileRoute("/_authenticated/new")({
  head: () => ({ meta: [{ title: "New reading — Reflection" }, { name: "description", content: "Ask a question and draw Situation, Tension and Possibility." }, { property: "og:title", content: "New reading — Reflection" }, { property: "og:description", content: "Ask a question and draw Situation, Tension and Possibility." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(profileQuery(context.user.id)),
  component: NewReading,
});

const STAGES = ["Shuffling the deck", "Drawing three cards", "Writing your reading", "Checking the reading"];

function NewReading() {
  const { user } = Route.useRouteContext();
  const { data: profile } = useSuspenseQuery(profileQuery(user.id));
  const start = useServerFn(startReading);
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [reversals, setReversals] = useState(false);
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const local = admitQuestion(question);
    if (local) return setError(local.message);
    setError(null);
    setBusy(true);
    setStage(0);
    const timer = setInterval(() => setStage((s) => Math.min(s + 1, STAGES.length - 1)), 4000);
    try {
      const r = await start({ data: { question, reversals } });
      if (r.ok) navigate({ to: "/readings/$id", params: { id: r.id } });
      else setError(r.message);
    } catch {
      setError("Connection lost. Nothing new was saved; you can try again.");
    } finally {
      clearInterval(timer);
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-6 pt-6">
      <div>
        <span className="eyebrow">Reflection, not prediction</span>
        <h1 className="mt-2 text-4xl md:text-5xl">What would you like to think about?</h1>
      </div>
      <PositionTiles />
      {!profile.ai_enabled && (
        <div className="panel flex flex-col gap-3 p-5" role="status">
          <h2 className="text-lg">AI readings are off</h2>
          <p className="text-sm text-muted-foreground">{COPY.aiPermission}</p>
          <Link to="/account" className="btn self-start">Turn on AI readings</Link>
        </div>
      )}
      <form onSubmit={submit} className="panel flex flex-col gap-4 p-6">
        <label className="flex flex-col gap-2 text-sm font-medium">Your question
          <textarea className="field min-h-32 font-serif text-lg" maxLength={MAX_QUESTION} value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="How can I approach the next few weeks at work with more care?" disabled={busy} />
        </label>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" checked={reversals} onChange={(e) => setReversals(e.target.checked)} disabled={busy} /> Include reversed cards
          </label>
          <span>{question.length}/{MAX_QUESTION}</span>
        </div>
        <p className="text-xs text-muted-foreground">{COPY.startProcessing} {COPY.providerRetention}</p>
        <button className="btn" disabled={busy || !profile.ai_enabled || !question.trim()}>{busy ? "Drawing…" : "Draw three cards"}</button>
        {busy && (
          <div role="status" aria-live="polite" className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              {STAGES.map((s, i) => (
                <span key={s} className={i < stage ? "pill pill-done" : i === stage ? "pill pill-progress" : "pill"}>
                  {i < stage ? "✓" : i === stage ? "◌" : "○"} {s}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">This can take up to a minute.</p>
          </div>
        )}
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      </form>
    </section>
  );
}
