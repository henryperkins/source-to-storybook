import { cardName, positionLabel, POSITIONS, type DrawnCard } from "./reading-rules";

export const journalFilters = [
  { value: "all", label: "All" },
  { value: "reflected", label: "With reflections" },
  { value: "resonates", label: "Resonates" },
  { value: "unsure", label: "Unsure" },
  { value: "disagree", label: "Disagree" },
] as const;
export type JournalFilter = (typeof journalFilters)[number]["value"];
type JournalReflection = { body: string; stance: string; updated_at: string };
export function journalReflection(reflections: JournalReflection[] | JournalReflection | null) {
  return Array.isArray(reflections) ? reflections[0] ?? null : reflections;
}
export function matchesJournalFilter(reflection: JournalReflection | null, filter: JournalFilter) {
  if (filter === "all") return true;
  if (filter === "reflected") return reflection !== null;
  return reflection?.stance === filter;
}
export function tarotBasisCards(id: string, cards: DrawnCard[]) {
  return cards.map((card) => ({
    position: positionLabel[card.position],
    number: String(POSITIONS.indexOf(card.position) + 1).padStart(2, "0"),
    name: cardName(card.cardId),
    orientation: card.orientation === "reversed" ? "Reversed" as const : "Upright" as const,
    href: `/readings/${encodeURIComponent(id)}#card-${card.position}`,
  }));
}