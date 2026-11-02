export function gatewayFailure(status: number, body: unknown) {
  const root = body && typeof body === "object" ? body as Record<string, unknown> : {};
  const error = root['error'] && typeof root['error'] === "object" ? root['error'] as Record<string, unknown> : root;
  const message = typeof error['message'] === "string" ? error['message'] : typeof root['message'] === "string" ? root['message'] : "Lovable AI couldn't complete this reading. Nothing was saved.";
  const type = typeof error['type'] === "string" ? error['type'] : root['type'];
  const configurationTypes = ["provider_not_available_in_region", "model_requires_retention_consent", "model_vendor_not_enabled", "credit_limit_reached"];
  const workspaceBlock = /credit|workspace|AI disabled/i.test(message);
  const providerDenied = status === 403 && !configurationTypes.includes(String(type)) && !workspaceBlock;
  return { code: String(status), message, providerDenied };
}