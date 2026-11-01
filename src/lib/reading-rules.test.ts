import { describe, expect, it } from "vitest";
import { admitQuestion, drawCards, quotaRemaining } from "./reading-rules";

describe("reading rules", () => {
  it("allows three readings per day", () => {
    expect(quotaRemaining(2, 2).day).toBe(1);
    expect(quotaRemaining(3, 3).day).toBe(0);
  });
  it("allows thirty readings per month", () => {
    expect(quotaRemaining(0, 29).month).toBe(1);
    expect(quotaRemaining(0, 30).month).toBe(0);
  });
  it("rejects questions over 500 characters", () => {
    expect(admitQuestion("a".repeat(501))?.code).toBe("TOO_LONG");
    expect(admitQuestion("How can I approach my week?")).toBeNull();
  });
  it("routes crisis questions away from a reading", () => {
    expect(admitQuestion("I want to end my life")?.code).toBe("CRISIS");
  });
  it("declines medical, legal and financial decisions", () => {
    expect(admitQuestion("Should I change my medication dosage?")?.code).toBe("SENSITIVE");
    expect(admitQuestion("Should I buy bitcoin stocks now?")?.code).toBe("SENSITIVE");
  });
  it("draws three distinct cards, upright when reversals are off", () => {
    const cards = drawCards(false);
    expect(cards).toHaveLength(3);
    expect(new Set(cards.map((c) => c.cardId)).size).toBe(3);
    expect(cards.every((c) => c.orientation === "upright")).toBe(true);
  });
});
