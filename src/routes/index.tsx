import { createFileRoute, Link } from "@tanstack/react-router";
import spread from "@/assets/three-card-spread.webp.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Reflection — three-card tarot for thinking, not predicting" },
      { name: "description", content: "Draw Situation, Tension and Possibility cards, get a grounded AI reading, and keep your own dated reflections." },
      { property: "og:title", content: "Reflection — tarot for reflection" },
      { property: "og:description", content: "A three-card reading that helps you think about your question. Reflection, not prediction." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="mx-auto grid min-h-screen max-w-5xl items-center gap-10 px-5 py-12 md:grid-cols-2">
      <div className="flex flex-col gap-6">
        <span className="eyebrow">Reflection</span>
        <h1 className="text-5xl text-foreground md:text-6xl">A three-card reading for thinking things through.</h1>
        <p className="text-lg text-muted-foreground">
          Bring a question. Draw Situation, Tension and Possibility. Read an interpretation grounded in each card's
          meaning — then write what it means to you. Reflection, not prediction.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/auth" className="btn">Start reflecting</Link>
          <Link to="/auth" search={{ mode: "signin" }} className="btn btn-secondary">Sign in</Link>
        </div>
      </div>
      <img src={spread.url} alt="Three tarot cards laid side by side" className="w-full rounded-3xl" />
    </div>
  );
}
