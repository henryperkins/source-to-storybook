import { cardName, positionLabel, POSITIONS, type DrawnCard } from "@/lib/reading-rules";
import { TarotBotanicalCardFace } from "@/design-system/agent-transaction-99232c";
export function CardFace({ card }: { card: DrawnCard }) {
  return <TarotBotanicalCardFace position={positionLabel[card.position]} number={String(POSITIONS.indexOf(card.position) + 1).padStart(2, "0")} name={cardName(card.cardId)} orientation={card.orientation === "reversed" ? "Reversed" : "Upright"} />;
}
