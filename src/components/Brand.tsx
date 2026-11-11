import { Link } from "@tanstack/react-router";
import { BrandReturnMark, FlowSidePanel, ReflectionCard, TopicChip } from "@/design-system/agent-transaction-99232c";
import keeping from "@/design-system/agent-transaction-99232c/assets/illustrations/reflection-keeping-paper.png";
import returning from "@/design-system/agent-transaction-99232c/assets/illustrations/reflection-returning-paper.png";
import reflecting from "@/design-system/agent-transaction-99232c/assets/illustrations/reflection-reflecting-paper.png";

export function Logo({ to = "/" }: { to?: "/" | "/readings" }) {
  return <Link to={to} className="flex items-center gap-2 font-geometric text-xl"><BrandReturnMark variant="paper" />Reflection</Link>;
}
const tiles = [
  { title: "Situation", body: "What's here now", art: keeping, tone: "Mint" },
  { title: "Tension", body: "What pulls against it", art: reflecting, tone: "Butter" },
  { title: "Possibility", body: "What could open up", art: returning, tone: "Sage" },
] as const;
export function PositionTiles() {
  return <div className="grid gap-4 sm:grid-cols-3">{tiles.map((t, i) => <ReflectionCard key={t.title} title={t.title} body={t.body} topic={<TopicChip tone={t.tone} label={String(i + 1).padStart(2, "0")} />}><img src={t.art} alt="" className="h-20 w-full object-contain" /></ReflectionCard>)}</div>;
}
export function ReadingPerspectives() {
  return <FlowSidePanel title="Three cards, three perspectives" className="reading-perspectives">
    <ol className="flex flex-col">
      {tiles.map((tile, i) => <li key={tile.title} className="flex items-center gap-4 border-b border-border py-5">
        <span className={`flex size-10 shrink-0 items-center justify-center rounded-full text-lg ${tile.tone === "Mint" ? "bg-mint text-mint-foreground" : tile.tone === "Butter" ? "bg-secondary text-secondary-foreground" : "bg-sage text-sage-foreground"}`}>{String(i + 1).padStart(2, "0")}</span>
        <div className="min-w-0 flex-1"><h3 className="font-display text-2xl font-semibold">{tile.title}</h3><p className="mt-1">{tile.body}</p></div>
        <img src={tile.art} alt="" className="size-20 shrink-0 object-contain" />
      </li>)}
    </ol>
  </FlowSidePanel>;
}
export function LeafFooter() {
  return <footer aria-hidden className="mx-auto flex max-w-5xl justify-end px-5 py-8"><img src={returning} alt="" className="h-24 w-40 object-contain" /></footer>;
}
export const stanceLabel: Record<string, string> = { unspecified: "Not selected", resonates: "Resonates", unsure: "Unsure", disagree: "Disagree" };
export function StanceChip({ stance }: { stance: string }) {
  return <TopicChip tone={stance === "resonates" ? "Mint" : stance === "unsure" ? "Butter" : "Sage"} label={stanceLabel[stance] ?? stance} />;
}
