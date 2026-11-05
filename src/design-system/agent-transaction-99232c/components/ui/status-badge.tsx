import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Ban,
  CircleCheck,
  CircleDashed,
  CircleX,
  Loader2,
  PauseCircle,
  Undo2,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/design-system/agent-transaction-99232c/lib/utils";

export type TransactionStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "refunded"
  | "cancelled"
  | "on-hold";

export const STATUS_LABELS: Record<TransactionStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  completed: "Completed",
  failed: "Failed",
  refunded: "Refunded",
  cancelled: "Cancelled",
  "on-hold": "On hold",
};

const STATUS_ICONS: Record<TransactionStatus, LucideIcon> = {
  pending: CircleDashed,
  processing: Loader2,
  completed: CircleCheck,
  failed: CircleX,
  refunded: Undo2,
  cancelled: Ban,
  "on-hold": PauseCircle,
};

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border font-medium whitespace-nowrap [&_svg]:shrink-0",
  {
    variants: {
      status: {
        pending: "border-border bg-muted text-muted-foreground",
        processing: "border-transparent bg-secondary text-secondary-foreground",
        completed: "border-transparent bg-primary text-primary-foreground",
        failed: "border-transparent bg-destructive text-destructive-foreground",
        refunded: "border-border bg-card text-foreground",
        cancelled: "border-border bg-muted text-muted-foreground",
        "on-hold": "border-accent bg-card text-foreground [&_svg]:text-accent",
      },
      size: {
        sm: "px-2 py-0 text-xs [&_svg]:size-3",
        default: "px-2.5 py-0.5 text-xs [&_svg]:size-3.5",
      },
    },
    defaultVariants: { status: "pending", size: "default" },
  },
);

export interface StatusBadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    Omit<VariantProps<typeof statusBadgeVariants>, "status"> {
  /** Transaction lifecycle state. */
  status: TransactionStatus;
  /** Override the visible label (defaults to the status name). */
  label?: string;
}

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ status, size, label, className, ...props }, ref) => {
    const Icon = STATUS_ICONS[status];
    return (
      <span
        ref={ref}
        data-status={status}
        className={cn(statusBadgeVariants({ status, size }), className)}
        {...props}
      >
        <Icon aria-hidden="true" className={status === "processing" ? "animate-spin" : undefined} />
        {label ?? STATUS_LABELS[status]}
      </span>
    );
  },
);
StatusBadge.displayName = "StatusBadge";

export { StatusBadge, statusBadgeVariants };
