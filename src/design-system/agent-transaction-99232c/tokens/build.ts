/** Pure token extraction from the Solstice theme CSS (used by scripts/export-tokens.ts and tests). */
function block(css: string, selector: string): Record<string, string> {
  const start = css.indexOf(`${selector} {`);
  if (start < 0) return {};
  const body = css.slice(start, css.indexOf("}", start));
  const out: Record<string, string> = {};
  for (const m of body.matchAll(/--([\w-]+):\s*([^;]+);/g)) out[m[1]] = m[2].trim();
  return out;
}

function typeOf(name: string): string {
  if (name === "radius") return "dimension";
  if (name.startsWith("font")) return "fontFamily";
  if (name.startsWith("shadow")) return "shadow";
  return "color";
}

export function buildTokens(css: string) {
  const light = block(css, ":root");
  const dark = block(css, ".dark");
  const fonts = block(css, "@theme");
  const group = (vars: Record<string, string>) =>
    Object.fromEntries(Object.entries(vars).map(([k, v]) => [k, { $type: typeOf(k), $value: v }]));
  const json = {
    $description: "Solstice — Reflection design tokens (paper, ink, botanical colors, and self-hosted font families). Generated from src/styles.css — do not edit by hand.",
    light: group(light),
    dark: group(dark),
    font: group(fonts),
    paper: group(block(css, ".reflection-paper")),
    evening: group(block(css, ".reflection-evening")),
  };
  const decl = (vars: Record<string, string>) =>
    Object.entries(vars).map(([k, v]) => `  --${k}: ${v};`).join("\n");
  const flatCss =
    `/* Solstice — Reflection tokens (token-only fallback; no font loading or Tailwind wiring). Generated from src/styles.css — do not edit by hand. */\n` +
    `:root {\n${decl({ ...fonts, ...light })}\n}\n\n.dark {\n${decl(dark)}\n}\n` +
    `\n.reflection-paper {\n${decl(block(css, ".reflection-paper"))}\n}\n\n.reflection-evening {\n${decl(block(css, ".reflection-evening"))}\n}\n`;
  return { json, flatCss };
}
