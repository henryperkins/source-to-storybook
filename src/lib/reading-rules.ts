import deck from "@/content/deck.json";

export const DAILY_LIMIT = 3;
export const MONTHLY_LIMIT = 30;
export const MAX_QUESTION = 500;
export const POSITIONS = ["situation", "tension", "possibility"] as const;
export type Position = (typeof POSITIONS)[number];
export type DrawnCard = { position: Position; cardId: string; orientation: "upright" | "reversed" };

export const COPY = {
  unsupportedLanguage:
    "This version supports English. You can revise your question in English; your saved readings remain available.",
  crisis:
    "A tarot reading cannot provide crisis support. If you may be in immediate danger, contact local emergency services or a trusted person who can stay with you.",
  sensitiveAdvice:
    "This reading cannot make medical, legal or financial decisions. Consider asking about your priorities, feelings or the questions you want to discuss with a qualified professional.",
  providerRefusal:
    "The AI provider declined this request. No reading was accepted. Your saved readings and reflections remain available.",
  startProcessing:
    "Start temporarily stores your question for 24 hours. Save reading keeps the result until you delete it.",
  saveReading: "Save keeps this reading, its cards and sources until deletion. No reflection is required.",
  aiPermission:
    "AI permission is separate from saving. It allows your question to be used for a new reading. Saved readings and reflections are not sent automatically.",
  providerRetention:
    "Live AI readings send your question, drawn cards and source text to OpenAI with store:false.",
};

const normalized = (t: string) => t.normalize("NFKC").toLowerCase().replace(/[’]/g, "'");
const nonEnglish = (t: string) =>
  /\p{L}/u.test(t) &&
  (/[^\p{Script=Latin}\p{Script=Common}\p{Script=Inherited}]/u.test(t) ||
    /\b(je|dois|comprendre|pourquoi|quiero|cómo|porque|necesito|warum|möchte|nicht|perché)\b/u.test(normalized(t)));
const crisis =
  /\b(?:i\s+(?:(?:want|plan|intend)\s+to|will|am going to)\s+(?:kill|hurt|harm)\s+myself|(?:end|take)\s+my\s+life|suicid(?:e|al)|self[ -]harm)\b/;
const medical =
  /\b(?:medication|medicine|diagnos(?:e|is)|dosage|medical treatment|treatment (?:for|of) (?:cancer|diabetes|depression|anxiety|disease)|prescription|insulin|antidepressants?)\b/;
const financial = /\b(?:buy|sell|invest|borrow|trade)\b.{0,80}\b(?:stocks?|shares?|crypto|bitcoin|funds?|loans?)\b/;
const legal =
  /\b(?:legal advice|(?:should i|can i|how (?:can|do) i|must i|you should) sue|plead guilty|plead innocent|evade taxes|sign (?:this|the) contract)\b/;

export type Admission = null | { code: "BAD_INPUT" | "TOO_LONG" | "LANGUAGE" | "CRISIS" | "SENSITIVE"; message: string };

export function admitQuestion(question: string): Admission {
  if (!question.trim()) return { code: "BAD_INPUT", message: "Write a question to begin." };
  if (question.length > MAX_QUESTION)
    return { code: "TOO_LONG", message: `Keep your question under ${MAX_QUESTION} characters.` };
  if (nonEnglish(question)) return { code: "LANGUAGE", message: COPY.unsupportedLanguage };
  const t = normalized(question);
  if (crisis.test(t)) return { code: "CRISIS", message: COPY.crisis };
  if (medical.test(t) || financial.test(t) || legal.test(t)) return { code: "SENSITIVE", message: COPY.sensitiveAdvice };
  return null;
}

export function quotaRemaining(today: number, month: number) {
  return { day: Math.max(0, DAILY_LIMIT - today), month: Math.max(0, MONTHLY_LIMIT - month) };
}

function uniformIndex(next: () => number, size: number) {
  const ceiling = Math.floor(2 ** 32 / size) * size;
  for (;;) {
    const w = next();
    if (w < ceiling) return w % size;
  }
}

/** Fisher–Yates with rejection sampling over crypto randomness; three positions. */
export function drawCards(reversals: boolean): DrawnCard[] {
  const ids = deck.map((c) => c.id);
  const buf = new Uint32Array(256);
  let i = buf.length;
  const next = () => {
    if (i >= buf.length) {
      crypto.getRandomValues(buf);
      i = 0;
    }
    return buf[i++]!;
  };
  for (let k = ids.length - 1; k > 0; k--) {
    const j = uniformIndex(next, k + 1);
    [ids[k], ids[j]] = [ids[j]!, ids[k]!];
  }
  return POSITIONS.map((position, n) => ({
    position,
    cardId: ids[n]!,
    orientation: reversals && next() % 2 === 1 ? "reversed" : "upright",
  }));
}

const names = new Map(deck.map((c) => [c.id, c.name]));
export const cardName = (id: string) => names.get(id) ?? id;
export const positionLabel: Record<Position, string> = {
  situation: "Situation",
  tension: "Tension",
  possibility: "Possibility",
};
export function suitOf(cardId: string) {
  const p = cardId.split("-")[0]!;
  return ["cups", "pentacles", "wands", "swords"].includes(p) ? p : "major";
}
