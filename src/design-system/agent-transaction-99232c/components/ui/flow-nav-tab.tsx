import * as React from "react";
import { cn } from "@/design-system/agent-transaction-99232c/lib/utils";
import { Button } from "./button";
export interface FlowNavTabProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> { label?: string; variant?: "default" | "current"; size?: "sm" | "default"; }
/** Navigation item; current variant conveys the current page to assistive technology. */
export const FlowNavTab = React.forwardRef<HTMLAnchorElement, FlowNavTabProps>(({ label, children, variant="default", size="default", className,...props },ref) => <Button asChild variant={variant === "current" ? "default" : "ghost"} size={size} className={className}><a ref={ref} aria-current={variant === "current" ? "page" : undefined} {...props}>{children ?? label}</a></Button>);
FlowNavTab.displayName = "FlowNavTab";
