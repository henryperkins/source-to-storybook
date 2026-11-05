import * as React from "react";
import { Check, Loader2, X } from "lucide-react";

import { cn } from "@/design-system/agent-transaction-99232c/lib/utils";
import { Amount } from "./amount";
import { Button } from "./button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";
import { Label } from "./label";
import { StatusBadge } from "./status-badge";
import { Textarea } from "./textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";

export type ApprovalState = "pending" | "approved" | "rejected";

export interface ApprovalCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** What is being approved, e.g. "Payout to Juniper Studio". */
  title: React.ReactNode;
  description?: React.ReactNode;
  amount: number;
  currency?: string;
  locale?: string;
  /** Decision state; controlled by the parent. */
  state?: ApprovalState;
  /** Shows a spinner and disables actions while a decision is saving. */
  loading?: boolean;
  /** Disables both decisions (e.g. missing permission). */
  disabled?: boolean;
  /** Disables only Approve (e.g. a blocking policy check); Reject stays available. */
  approveDisabled?: boolean;
  /** Require a written reason before rejecting. Defaults to true. */
  requireReason?: boolean;
  onApprove?: () => void;
  onReject?: (reason: string) => void;
}

const STATE_TO_STATUS = { pending: "pending", approved: "completed", rejected: "failed" } as const;
const STATE_LABEL = { pending: "Awaiting approval", approved: "Approved", rejected: "Rejected" } as const;

const ApprovalCard = React.forwardRef<HTMLDivElement, ApprovalCardProps>(
  (
    {
      title,
      description,
      amount,
      currency,
      locale,
      state = "pending",
      loading = false,
      disabled = false,
      approveDisabled = false,
      requireReason = true,
      onApprove,
      onReject,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const reasonId = React.useId();
    const [reason, setReason] = React.useState("");
    const decided = state !== "pending";
    const locked = decided || loading || disabled;
    const canReject = !requireReason || reason.trim().length > 0;

    return (
      <Card ref={ref} className={cn("w-full", className)} aria-busy={loading || undefined} {...props}>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <CardTitle className="text-lg">{title}</CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
            </div>
            <StatusBadge status={STATE_TO_STATUS[state]} label={STATE_LABEL[state]} />
          </div>
          <Amount value={amount} currency={currency} locale={locale} size="lg" />
        </CardHeader>
        <CardContent className="space-y-4">
          {children}
          {!decided && (
            <div className="grid gap-1.5">
              <Label htmlFor={reasonId}>Reason {requireReason ? "(required to reject)" : "(optional)"}</Label>
              <Textarea
                id={reasonId}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain the decision for the audit log"
                disabled={locked}
              />
            </div>
          )}
        </CardContent>
        {!decided && (
          <CardFooter className="flex-wrap justify-end gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" disabled={locked || !canReject}>
                  <X aria-hidden="true" /> Reject
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reject this request?</AlertDialogTitle>
                  <AlertDialogDescription>
                    The requester will be notified with your reason. This can't be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep pending</AlertDialogCancel>
                  <AlertDialogAction variant="destructive" onClick={() => onReject?.(reason.trim())}>
                    Reject request
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button onClick={() => onApprove?.()} disabled={locked || approveDisabled}>
              {loading ? <Loader2 aria-hidden="true" className="animate-spin" /> : <Check aria-hidden="true" />}
              {loading ? "Saving" : "Approve"}
            </Button>
          </CardFooter>
        )}
      </Card>
    );
  },
);
ApprovalCard.displayName = "ApprovalCard";

export { ApprovalCard };
