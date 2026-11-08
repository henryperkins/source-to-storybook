import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/design-system/agent-transaction-99232c/lib/utils";
import { TopicChip } from "./topic-chip";

const captionVariants = cva("flex min-w-0 flex-col gap-2 text-foreground", {
  variants: { size: { default: "text-base", compact: "text-sm" } },
  defaultVariants: { size: "default" },
});
export interface VisualReferencePlateCaptionProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, VariantProps<typeof captionVariants> {
  title: string;
  note: string;
  meta: string;
  showStatus?: boolean;
  statusLabel?: string;
}
/** Caption a real figure with its editorial title, intended use, and source metadata. */
export const VisualReferencePlateCaption = React.forwardRef<HTMLElement, VisualReferencePlateCaptionProps>(
  ({ className, title, note, meta, showStatus = true, statusLabel = "Ships in app", size, children, ...props }, ref) => (
    <figcaption ref={ref} className={cn(captionVariants({ size }), className)} {...props}>
      <div className="flex flex-wrap items-center gap-3">
        <h2 className={cn("font-display font-normal", size === "compact" ? "text-xl" : "text-2xl")}>{title}</h2>
        {showStatus && <TopicChip label={statusLabel} tone="Mint" size="sm" />}
      </div>
      <p className="font-sans">{note}</p>
      <p className="whitespace-pre-line break-words font-sans text-xs">{meta}</p>
      {children}
    </figcaption>
  ),
);
VisualReferencePlateCaption.displayName = "VisualReferencePlateCaption";
export default VisualReferencePlateCaption;