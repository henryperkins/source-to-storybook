import { createFileRoute, Link } from "@tanstack/react-router";
import rose from "@/assets/hero-rose.webp.asset.json";
import { LeafFooter, Logo, PositionTiles } from "@/components/Brand";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Reflection — a little space to reflect" },
      { name: "description", content: "Bring a question. Draw Situation, Tension and Possibility, read a grounded interpretation, and keep your own reflections." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: rose.url },
      { name: "twitter:image", content: rose.url },
      { property: "og:title", content: "Reflection — a little space to reflect" },
      { property: "og:description", content: "Bring a question. Make room for another perspective. Reflection, not prediction." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden pb-40">
      <img src={rose.url} alt="" aria-hidden className="fade-bottom pointer-events-none absolute -right-24 -top-10 w-[34rem] max-w-none opacity-90 md:right-0 md:w-[46rem]" />
      <div className="relative mx-auto flex max-w-5xl flex-col gap-10 px-5 pt-6">
        <header className="flex items-center justify-between">
          <Logo />
          <Link to="/auth" search={{ mode: "signin" }} className="text-sm text-foreground underline-offset-4 hover:underline">Sign in</Link>
        </header>
        <div className="flex max-w-xl flex-col gap-6 pt-40 md:pt-24">
          <h1 className="text-6xl text-ink md:text-8xl">A little space to reflect.</h1>
          <p className="text-xl text-foreground">Bring a question. Make room for another perspective.</p>
          <div className="flex flex-wrap gap-3">
            <Link to="/auth" className="btn">Draw three cards</Link>
            <Link to="/auth" search={{ mode: "signin" }} className="btn btn-secondary">I have an account</Link>
          </div>
        </div>
        <section className="flex flex-col gap-3">
          <span className="eyebrow">Reflection positions</span>
          <PositionTiles />
        </section>
        <p className="text-sm text-muted-foreground">Reflection, not prediction. Save what's useful, write what it means to you, and return with time.</p>
      </div>
      <LeafFooter />
    </div>
  );
}
