import * as React from "react";
import { cva } from "class-variance-authority";
import { Bot, CircleAlert, CircleCheck, CircleX } from "lucide-react";

import { cn } from "@/design-system/agent-transaction-99232c/lib/utils";
import { ActivityTimeline, ActivityTimelineItem } from "./activity-timeline";
import { ApprovalCard, type ApprovalCardProps, type ApprovalState } from "./approval-card";
import { Checkbox } from "./checkbox";
import { Label } from "./label";
import { Textarea } from "./textarea";

export type PolicyCheckResult = "passed" | "flagged" | "failed";

export interface PolicyCheck {
  /** Policy name, e.g. "Spend limit". Must be unique within the action. */
  name: string;
  result: PolicyCheckResult;
  /** Optional detail, e.g. "Above $2,500 single-payout limit". */
  detail?: string;
}

export interface AgentActionParameter {
  name: string;
  value: React.ReactNode;
}

/** The authenticated person making decisions; `id` is what the audit log records. */
export interface AgentActionActor {
  id: string;
  /** Display name shown in the log. */
  name: string;
}

export interface AgentDecisionEntry {
  /** UUID for this decision. */
  id: string;
  /** Stable ID of the agent action this decision belongs to. */
  actionId: string;
  decision: "approved" | "rejected";
  /** ISO timestamp of the decision. */
  at: string;
  actorId: string;
  /** Display name at decision time (for rendering only — audit by actorId). */
  actorName?: string;
  /** Reject reason. */
  reason?: string;
  /** Present when Approve overrode failed checks. */
  override?: { reason: string; failedChecks: string[] };
  /** Flagged checks the actor acknowledged before approving. */
  acknowledgedFlags?: string[];
}

export interface AgentActionCardProps
  extends Omit<
    ApprovalCardProps,
    "title" | "onApprove" | "onReject" | "state" | "children" | "approveDisabled"
  > {
  /** Stable ID of the proposed action; every decision references it. */
  actionId: string;
  /** ISO timestamp of when the agent proposed the action. */
  proposedAt: string;
  /** Agent that proposed the action, e.g. "Payments agent". */
  agent: string;
  /** The proposed action, e.g. "Issue refund". */
  action: string;
  parameters: AgentActionParameter[];
  checks: PolicyCheck[];
  /** Short explanation from the agent. */
  rationale: string;
  /** The signed-in reviewer, supplied by the app. */
  actor: AgentActionActor;
  /** Allow approving despite failed checks with a written reason. Defaults to true. */
  allowOverride?: boolean;
  /** Prior log entries for this action, newest first. */
  history?: AgentDecisionEntry[];
  /** Called after a decision is logged; persist it as the audit record. */
  onDecision?: (entry: AgentDecisionEntry) => void;
  /** Override the ID generator (defaults to crypto.randomUUID). */
  generateId?: () => string;
}

const checkVariants = cva(
  "flex items-start gap-2 rounded-lg px-3 py-2 text-sm [&_svg]:mt-0.5 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      result: {
        passed: "bg-muted text-foreground [&_svg]:text-primary",
        flagged: "bg-secondary text-secondary-foreground [&_svg]:text-accent",
        failed: "bg-destructive/10 text-foreground [&_svg]:text-destructive",
      },
    },
  },
);

const CHECK_ICON = { passed: CircleCheck, flagged: CircleAlert, failed: CircleX } as const;
const CHECK_LABEL = { passed: "Passed", flagged: "Flagged", failed: "Failed" } as const;

const TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
};

const formatTime = (iso: string, timeZone?: string) =>
  new Intl.DateTimeFormat("en-US", { ...TIME_OPTIONS, timeZone }).format(new Date(iso));

const subscribeNoop = () => () => {};

/**
 * Human-readable label for a machine-readable instant. The server and the first
 * client render agree — both show the instant marked UTC — and the visitor's own
 * time zone appears after hydration, so SSR never mismatches the browser.
 */
function useLocalTime(iso: string) {
  const getSnapshot = React.useCallback(() => formatTime(iso), [iso]);
  const getServerSnapshot = React.useCallback(
    () => `${formatTime(iso, "UTC")} UTC`,
    [iso],
  );
  return React.useSyncExternalStore(subscribeNoop, getSnapshot, getServerSnapshot);
}

const DecisionLogItem = ({ entry, action }: { entry: AgentDecisionEntry; action: string }) => {
  const timeLabel = useLocalTime(entry.at);
  return (
    <ActivityTimelineItem
      data-decision-id={entry.id}
      tone={entry.decision === "rejected" ? "danger" : entry.override ? "warning" : "success"}
      title={`${entry.decision === "approved" ? (entry.override ? "Approved with override" : "Approved") : "Rejected"}: ${action}`}
      dateTime={entry.at}
      timeLabel={timeLabel}
      actor={`${entry.actorName ?? "Reviewer"} · ${entry.actorId}`}
    >
      {entry.reason}
      {entry.override && <span className="block">Override: {entry.override.reason}</span>}
      {entry.acknowledgedFlags && (
        <span className="block">Acknowledged: {entry.acknowledgedFlags.join(", ")}</span>
      )}
    </ActivityTimelineItem>
  );
};

/**
 * Approve gate: failed checks block approval unless an override with a written
 * reason is given; flagged checks require acknowledgment.
 */
export function canApproveAgentAction(
  checks: PolicyCheck[],
  { override = false, overrideReason = "", acknowledged = false, allowOverride = true } = {},
): boolean {
  const failed = checks.some((c) => c.result === "failed");
  const flagged = checks.some((c) => c.result === "flagged");
  if (failed && !(allowOverride && override && overrideReason.trim().length > 0)) return false;
  if (flagged && !acknowledged) return false;
  return true;
}

const AgentActionCard = React.forwardRef<HTMLDivElement, AgentActionCardProps>(
  (
    {
      actionId,
      proposedAt,
      agent,
      action,
      parameters,
      checks,
      rationale,
      actor,
      allowOverride = true,
      history = [],
      onDecision,
      generateId = () => crypto.randomUUID(),
      description,
      className,
      ...props
    },
    ref,
  ) => {
    const [log, setLog] = React.useState<AgentDecisionEntry[]>(history);
    const [state, setState] = React.useState<ApprovalState>("pending");
    const [override, setOverride] = React.useState(false);
    const [overrideReason, setOverrideReason] = React.useState("");
    const [acknowledged, setAcknowledged] = React.useState(false);
    const uid = React.useId();
    const proposedLabel = useLocalTime(proposedAt);

    const failed = checks.filter((c) => c.result === "failed").map((c) => c.name);
    const flagged = checks.filter((c) => c.result === "flagged").map((c) => c.name);
    const approvable = canApproveAgentAction(checks, { override, overrideReason, acknowledged, allowOverride });
    const pending = state === "pending";

    const record = (entry: Omit<AgentDecisionEntry, "id" | "actionId" | "at" | "actorId" | "actorName">) => {
      const full: AgentDecisionEntry = {
        id: generateId(),
        actionId,
        at: new Date().toISOString(),
        actorId: actor.id,
        actorName: actor.name,
        ...entry,
      };
      setLog((prev) => [full, ...prev]);
      setState(full.decision);
      onDecision?.(full);
    };

    const approve = () => {
      if (!approvable) return;
      record({
        decision: "approved",
        ...(failed.length ? { override: { reason: overrideReason.trim(), failedChecks: failed } } : {}),
        ...(flagged.length ? { acknowledgedFlags: flagged } : {}),
      });
    };

    return (
      <div ref={ref} className={cn("grid gap-4", className)} data-action-id={actionId}>
        <ApprovalCard
          {...props}
          title={action}
          description={
            description ?? (
              <span className="inline-flex flex-wrap items-center gap-x-1.5">
                <Bot aria-hidden="true" className="size-4" /> Proposed by {agent} ·{" "}
                <time dateTime={proposedAt}>{proposedLabel}</time>
              </span>
            )
          }
          state={state}
          approveDisabled={!approvable}
          onApprove={approve}
          onReject={(reason) => record({ decision: "rejected", reason: reason || undefined })}
        >
          <p className="font-mono text-xs text-muted-foreground">Action {actionId}</p>
          <section aria-label="Parameters" className="space-y-1.5">
            <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Parameters</h4>
            <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1 text-sm">
              {parameters.map((p) => (
                <React.Fragment key={p.name}>
                  <dt className="text-muted-foreground">{p.name}</dt>
                  <dd className="min-w-0 break-words font-mono text-xs leading-5">{p.value}</dd>
                </React.Fragment>
              ))}
            </dl>
          </section>
          <section aria-label="Policy checks" className="space-y-1.5">
            <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Policy checks</h4>
            <ul className="grid gap-1.5">
              {checks.map((c) => {
                const Icon = CHECK_ICON[c.result];
                return (
                  <li key={c.name} className={checkVariants({ result: c.result })} data-result={c.result}>
                    <Icon aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="font-medium">{c.name}</span>
                      <span className="sr-only">: </span>
                      <span className="ml-1 text-xs text-muted-foreground">{CHECK_LABEL[c.result]}</span>
                      {c.detail && <span className="block text-xs text-muted-foreground">{c.detail}</span>}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
          <section aria-label="Agent rationale" className="space-y-1.5">
            <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Rationale</h4>
            <p className="text-sm text-foreground">{rationale}</p>
          </section>

          {pending && failed.length > 0 && (
            <div className="space-y-2 rounded-lg border border-destructive/40 p-3">
              <p className="text-sm font-medium" id={`${uid}-blocked`}>
                Approval blocked: {failed.length === 1 ? "1 check failed" : `${failed.length} checks failed`}.
              </p>
              {allowOverride ? (
                <>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`${uid}-override`}
                      checked={override}
                      onCheckedChange={(v) => setOverride(v === true)}
                      disabled={props.disabled || props.loading}
                    />
                    <Label htmlFor={`${uid}-override`}>Override failed checks</Label>
                  </div>
                  {override && (
                    <div className="grid gap-1.5">
                      <Label htmlFor={`${uid}-override-reason`}>Override reason (required)</Label>
                      <Textarea
                        id={`${uid}-override-reason`}
                        value={overrideReason}
                        onChange={(e) => setOverrideReason(e.target.value)}
                        placeholder="Why is it safe to proceed despite the failed checks?"
                      />
                    </div>
                  )}
                </>
              ) : (
                <p className="text-xs text-muted-foreground">Overrides are not allowed for this action.</p>
              )}
            </div>
          )}
          {pending && flagged.length > 0 && (
            <div className="flex items-start gap-2">
              <Checkbox
                id={`${uid}-ack`}
                checked={acknowledged}
                onCheckedChange={(v) => setAcknowledged(v === true)}
                disabled={props.disabled || props.loading}
                className="mt-0.5"
              />
              <Label htmlFor={`${uid}-ack`} className="leading-5">
                I've reviewed the flagged {flagged.length === 1 ? "check" : "checks"} ({flagged.join(", ")})
              </Label>
            </div>
          )}
        </ApprovalCard>

        <section aria-label="Decision log" className="rounded-2xl border border-border bg-card p-5">
          <h4 className="mb-3 text-sm font-semibold">Decision log</h4>
          {log.length === 0 ? (
            <p className="text-sm text-muted-foreground">No decisions yet.</p>
          ) : (
            <ActivityTimeline density="compact">
              {log.map((e) => (
                <DecisionLogItem key={e.id} entry={e} action={action} />
              ))}
            </ActivityTimeline>
          )}
        </section>
      </div>
    );
  },
);
AgentActionCard.displayName = "AgentActionCard";

export { AgentActionCard };
