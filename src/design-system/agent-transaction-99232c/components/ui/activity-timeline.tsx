import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/design-system/agent-transaction-99232c/lib/utils";

const timelineVariants = cva("relative", {
  variants: {
    density: {
      compact: "space-y-3",
      default: "space-y-5",
    },
  },
  defaultVariants: { density: "default" },
});

export interface ActivityTimelineProps
  extends React.OlHTMLAttributes<HTMLOListElement>,
    VariantProps<typeof timelineVariants> {}

const ActivityTimeline = React.forwardRef<HTMLOListElement, ActivityTimelineProps>(
  ({ className, density, ...props }, ref) => (
    <ol ref={ref} className={cn(timelineVariants({ density }), className)} {...props} />
  ),
);
ActivityTimeline.displayName = "ActivityTimeline";

const dotVariants = cva("relative z-10 mt-1.5 size-2.5 shrink-0 rounded-full ring-4 ring-card", {
  variants: {
    tone: {
      default: "bg-muted-foreground",
      success: "bg-primary",
      warning: "bg-accent",
      danger: "bg-destructive",
      info: "bg-chart-4",
    },
  },
  defaultVariants: { tone: "default" },
});

export interface ActivityTimelineItemProps
  extends Omit<React.LiHTMLAttributes<HTMLLIElement>, "title">,
    VariantProps<typeof dotVariants> {
  /** Short event headline, e.g. "Payout approved". */
  title: React.ReactNode;
  /** ISO timestamp for the machine-readable time. */
  dateTime: string;
  /** Human-readable time label shown to the user. */
  timeLabel: React.ReactNode;
  /** Who performed the action. */
  actor?: React.ReactNode;
}

const ActivityTimelineItem = React.forwardRef<HTMLLIElement, ActivityTimelineItemProps>(
  ({ className, tone, title, dateTime, timeLabel, actor, children, ...props }, ref) => (
    <li
      ref={ref}
      className={cn(
        "relative flex gap-3 after:absolute after:left-[4.5px] after:top-4 after:-bottom-5 after:w-px after:bg-border last:after:hidden",
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className={dotVariants({ tone })} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
          <p className="text-sm font-medium text-foreground">{title}</p>
          <time dateTime={dateTime} className="text-xs text-muted-foreground tabular-nums">
            {timeLabel}
          </time>
        </div>
        {actor && <p className="text-xs text-muted-foreground">{actor}</p>}
        {children && <div className="mt-1 text-sm text-muted-foreground">{children}</div>}
      </div>
    </li>
  ),
);
ActivityTimelineItem.displayName = "ActivityTimelineItem";

export { ActivityTimeline, ActivityTimelineItem };
