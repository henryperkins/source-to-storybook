import { describe, expect, it } from "vitest";
import { journalReflection, matchesJournalFilter, tarotBasisCards } from "./journal";

const reflection = { body: "A little more space.", stance: "resonates", updated_at: "2026-11-10T00:00:00Z" };
describe("journal filters", () => {
  it("keeps readings without reflections in All", () => {
    expect(matchesJournalFilter(null, "all")).toBe(true);
  });
  it("shows only existing reflections in With reflections, including empty text", () => {
    expect(matchesJournalFilter(null, "reflected")).toBe(false);
    expect(matchesJournalFilter({ ...reflection, body: "" }, "reflected")).toBe(true);
  });
  it.each(["resonates", "unsure", "disagree"] as const)("matches only the selected %s stance", (stance) => {
    expect(matchesJournalFilter({ ...reflection, stance }, stance)).toBe(true);
    expect(matchesJournalFilter(null, stance)).toBe(false);
    expect(matchesJournalFilter({ ...reflection, stance: "unspecified" }, stance)).toBe(false);
  });
  it("normalizes both relation shapes and an empty relation", () => {
    expect(journalReflection([reflection])).toEqual(reflection);
    expect(journalReflection(reflection)).toEqual(reflection);
    expect(journalReflection([])).toBeNull();
  });
});
it("links each compact card to its actual reading position", () => {
  expect(tarotBasisCards("reading-123", [{ cardId: "major-00", position: "tension", orientation: "reversed" }])[0]).toMatchObject({ position: "Tension", number: "02", orientation: "Reversed", href: "/readings/reading-123#card-tension" });
});