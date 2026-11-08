import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/design-system/agent-transaction-99232c/lib/utils";

const headerVariants = cva("flex flex-wrap items-baseline gap-4 font-display", {
  variants: { size: { default: "text-4xl sm:text-5xl", compact: "text-2xl" } },
  defaultVariants: { size: "default" },
});
export interface VisualReferenceSetHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, VariantProps<typeof headerVariants> {
  number: string;
  title: string;
  count: string;
}
/** Editorial heading for a numbered visual collection. Render once as the page heading. */
export const VisualReferenceSetHeader = React.forwardRef<HTMLElement, VisualReferenceSetHeaderProps>(
  ({ className, number, title, count, size, children, ...props }, ref) => (
    <header ref={ref} className={cn(headerVariants({ size }), className)} {...props}>
      <span className="italic text-primary">{number}</span>
      <h1 className="text-inherit font-normal">{title}</h1>
      <span className="font-sans text-sm">{count}</span>
      {children}
    </header>
  ),
);
VisualReferenceSetHeader.displayName = "VisualReferenceSetHeader";
export default VisualReferenceSetHeader;