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
    <div className="mx-auto max-w-6xl px-6 sm:px-8">
      <FlowHeader brand={<Link to="/" className="font-display font-semibold">Reflection</Link>} actions={<TextLink href="/auth?mode=signin">Sign in</TextLink>} />
    </div>
    <section className="relative isolate overflow-hidden">
      <div className="relative mx-auto max-w-6xl">
      <img src={bloom} alt="" className="pointer-events-none absolute bottom-0 right-6 -z-10 size-44 object-contain sm:size-56 md:right-8 md:h-full md:w-full md:pl-96" />
      <div className="relative flex flex-col gap-4 px-6 pb-44 pt-8 sm:px-8 md:gap-6 md:py-16">
        <p className="text-sm text-muted-foreground">Reflection, not prediction</p>
        <h1 className="max-w-xl font-display text-5xl font-semibold md:text-7xl">Reflection</h1>
        <p className="max-w-md font-display text-3xl">A little space to reflect.</p>
        <p className="max-w-sm text-lg">Bring a question. Make room for another perspective.</p>
        <div className="mt-2 flex flex-wrap items-center gap-4">
          <Button asChild size="lg"><Link to="/auth">Draw three cards</Link></Button>
          <TextLink href="/auth?mode=signin">I have an account</TextLink>
        </div>
      </div>
      </div>
    </section>
    <section className="mx-auto flex max-w-6xl flex-col gap-6 border-t border-border px-6 py-8 sm:px-8 md:py-10">
      <div className="flex flex-col gap-2"><h2 className="font-display text-3xl font-semibold">Three cards, three perspectives</h2>
      <p className="max-w-lg text-muted-foreground">Save what's useful, write what it means to you, and return with time.</p></div>
      <PositionTiles />
    </section>
    <LeafFooter />
  </div>;
}
