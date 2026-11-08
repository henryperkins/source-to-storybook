import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/design-system/agent-transaction-99232c/lib/utils";

export const topicChipVariants = cva("inline-flex shrink-0 items-center rounded-full font-sans font-medium", {
  variants: {
    tone: { Mint: "bg-mint text-mint-foreground", Sage: "bg-sage text-sage-foreground", Butter: "bg-secondary text-secondary-foreground" },
    size: { sm: "px-2 py-1 text-xs", default: "px-3 py-2 text-xs" },
  },
  defaultVariants: { tone: "Mint", size: "default" },
});

export interface TopicChipProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof topicChipVariants> {
  label?: string;
}
/** Non-interactive topic metadata; never use this as a transaction status or action. */
export const TopicChip = React.forwardRef<HTMLSpanElement, TopicChipProps>(
  ({ className, label, children, tone, size, ...props }, ref) => (
    <span ref={ref} className={cn(topicChipVariants({ tone, size }), className)} {...props}>{children ?? label}</span>
  ),
);
TopicChip.displayName = "TopicChip";
export default TopicChip;