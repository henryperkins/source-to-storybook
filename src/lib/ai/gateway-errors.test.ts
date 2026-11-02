import { describe, expect, it } from "vitest";
import { gatewayFailure } from "./gateway-errors";

describe("Lovable AI terminal failures", () => {
  it("preserves a provider denial and marks it for persistent blocking", () => {
    expect(gatewayFailure(403, { error: { type: "permission_error", message: "Provider access denied" } })).toEqual({ code: "403", message: "Provider access denied", providerDenied: true });
  });
  it("surfaces credit recovery without treating it as a provider denial", () => {
    expect(gatewayFailure(402, { message: "Add credits in Settings" })).toEqual({ code: "402", message: "Add credits in Settings", providerDenied: false });
  });
  it("keeps model eligibility blocks distinct from provider denials", () => {
    expect(gatewayFailure(403, { error: { type: "model_requires_retention_consent", message: "Enable consent" } }).providerDenied).toBe(false);
  });
});