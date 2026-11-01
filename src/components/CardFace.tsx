import { cardName, positionLabel, suitOf, type DrawnCard } from "@/lib/reading-rules";
import major from "@/assets/study-perspective.jpg.asset.json";
import cups from "@/assets/study-stillness.jpg.asset.json";
import pentacles from "@/assets/study-possibility.jpg.asset.json";
import wands from "@/assets/study-tension.jpg.asset.json";
import swords from "@/assets/study-return.jpg.asset.json";

const art: Record<string, { url: string; label: string }> = {
  major: { url: major.url, label: "Major Arcana" },
  cups: { url: cups.url, label: "Cups" },
  pentacles: { url: pentacles.url, label: "Pentacles" },
  wands: { url: wands.url, label: "Wands" },
  swords: { url: swords.url, label: "Swords" },
};

export function CardFace({ card }: { card: DrawnCard }) {
  const a = art[suitOf(card.cardId)]!;
  return (
    <figure className="flex flex-col gap-3">
      <span className="eyebrow">{positionLabel[card.position]}</span>
      <div className="card-face">
        <img src={a.url} alt="" className={`h-3/4 w-full object-cover ${card.orientation}`} />
        <figcaption className="flex h-1/4 flex-col justify-center px-3 text-center">
          <span className="text-[0.65rem] uppercase tracking-widest text-muted-foreground">{a.label}</span>
          <span className="font-serif text-lg leading-tight text-foreground">{cardName(card.cardId)}</span>
          <span className="text-[0.65rem] uppercase tracking-widest text-muted-foreground">{card.orientation}</span>
        </figcaption>
      </div>
    </figure>
  );
}
