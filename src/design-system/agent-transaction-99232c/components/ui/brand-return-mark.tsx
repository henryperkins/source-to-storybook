import * as React from "react";
import { cn } from "@/design-system/agent-transaction-99232c/lib/utils";
import paper from "@/design-system/agent-transaction-99232c/assets/logos/reflection-paper.png";
import evening from "@/design-system/agent-transaction-99232c/assets/logos/reflection-evening.png";
export interface BrandReturnMarkProps extends React.ImgHTMLAttributes<HTMLImageElement> { variant?: "paper" | "evening"; size?: "sm" | "default"; }
/** Original Reflection mark; use empty alt beside a visible wordmark. */
export const BrandReturnMark = React.forwardRef<HTMLImageElement, BrandReturnMarkProps>(({ variant="paper", size="default", className, alt="", ...props }, ref) => <img ref={ref} src={variant === "paper" ? paper : evening} alt={alt} className={cn("shrink-0 object-contain",size === "sm" ? "size-6" : "size-8",className)} {...props} />);
BrandReturnMark.displayName = "BrandReturnMark";
