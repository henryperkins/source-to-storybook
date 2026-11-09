import { createFileRoute, Link } from "@tanstack/react-router";
import bloom from "@/design-system/agent-transaction-99232c/assets/illustrations/reflection-hero-bloom-cut-from-supplied-mock.png";
import { Button, FlowHeader, TextLink } from "@/design-system/agent-transaction-99232c";
import { LeafFooter, PositionTiles } from "@/components/Brand";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Reflection — a little space to reflect" },
      { name: "description", content: "Bring a question. Draw Situation, Tension and Possibility, read a grounded interpretation, and keep your own reflections." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Reflection — a little space to reflect" },
      { property: "og:description", content: "Bring a question. Make room for another perspective. Reflection, not prediction." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return <div className="min-h-screen overflow-hidden">
    <div className="mx-auto max-w-5xl px-5">
      <FlowHeader brand={<Link to="/">Reflection</Link>} actions={<TextLink href="/auth?mode=signin">Sign in</TextLink>} />
    </div>
    <section className="relative isolate overflow-hidden">
      <img src={bloom} alt="" className="pointer-events-none absolute bottom-0 right-0 -z-10 h-40 w-40 object-contain md:h-full md:w-full md:pl-96" />
      <div className="relative mx-auto flex max-w-5xl flex-col gap-6 px-5 pb-24 pt-12 md:py-24">
        <p className="text-xs font-medium text-muted-foreground">REFLECTION, NOT PREDICTION</p>
        <h1 className="max-w-xl font-display text-6xl md:text-7xl">Reflection</h1>
        <p className="max-w-md text-2xl">A little space to reflect.</p>
        <p className="max-w-md text-lg">Bring a question. Make room for another perspective.</p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg"><Link to="/auth">Draw three cards</Link></Button>
          <Button asChild size="lg" variant="outline"><Link to="/auth" search={{ mode: "signin" }}>I have an account</Link></Button>
        </div>
      </div>
    </section>
    <section className="mx-auto flex max-w-5xl flex-col gap-6 px-5 py-10">
      <h2 className="font-display text-3xl">Three places to look</h2>
      <PositionTiles />
      <p className="text-sm text-muted-foreground">Save what's useful, write what it means to you, and return with time.</p>
    </section>
    <LeafFooter />
  </div>;
}
