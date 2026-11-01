import { Link } from "@tanstack/react-router";
import situation from "@/assets/position-situation.png.asset.json";
import tension from "@/assets/position-tension.png.asset.json";
import possibility from "@/assets/position-possibility.png.asset.json";
import ribbon from "@/assets/spread-ribbon-960.webp.asset.json";

export function Logo({ to = "/" }: { to?: "/" | "/readings" }) {
  return (
    <Link to={to} className="flex items-center gap-2 font-display text-xl font-semibold text-foreground">
      <span className="logo-mark" aria-hidden /> Reflection
    </Link>
  );
}

const tiles = [
  { n: 1, title: "Situation", sub: "What's here now", art: situation.url },
  { n: 2, title: "Tension", sub: "What pulls against it", art: tension.url },
  { n: 3, title: "Possibility", sub: "What could open up", art: possibility.url },
];

export function PositionTiles() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {tiles.map((t) => (
        <div key={t.n} className="panel relative flex items-center gap-3 overflow-hidden p-4">
          <span className="num-badge">{t.n}</span>
          <div className="relative z-10">
            <div className="font-display font-semibold">{t.title}</div>
            <div className="text-sm text-muted-foreground">{t.sub}</div>
          </div>
          <img src={t.art} alt="" className="absolute -right-2 top-0 h-full w-1/2 object-cover object-left opacity-80" />
        </div>
      ))}
    </div>
  );
}

export function LeafFooter() {
  return <div aria-hidden className="leaf-footer" style={{ backgroundImage: `url(${ribbon.url})` }} />;
}

export const stanceLabel: Record<string, string> = {
  unspecified: "Not selected",
  resonates: "Resonates",
  unsure: "Unsure",
  disagree: "Disagree",
};
export function StanceChip({ stance }: { stance: string }) {
  const tone = stance === "resonates" ? "text-primary" : stance === "unsure" ? "text-accent" : stance === "disagree" ? "text-destructive" : "text-muted-foreground";
  return (
    <span className="pill">
      <span className={`dot ${tone}`} /> {stanceLabel[stance] ?? stance}
    </span>
  );
}
