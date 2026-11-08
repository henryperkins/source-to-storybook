import * as React from "react";
import { cn } from "@/design-system/agent-transaction-99232c/lib/utils";
import { BrandReturnMark } from "./brand-return-mark";
export interface FlowHeaderProps extends React.HTMLAttributes<HTMLElement> { variant?: "global" | "focused"; brand?: React.ReactNode; navigation?: React.ReactNode; actions?: React.ReactNode; }
/** Responsive header; consumers supply navigation destinations and account actions. */
export const FlowHeader = React.forwardRef<HTMLElement,FlowHeaderProps>(({ variant="global", brand="Reflection", navigation, actions, children,className,...props },ref) => <header ref={ref} className={cn("flex flex-wrap items-center gap-3 border-b border-border py-3",className)} {...props}><div className="flex items-center gap-2 font-geometric text-xl font-medium"><BrandReturnMark />{brand}</div>{variant === "global" && navigation && <nav aria-label="Reflection" className="order-last flex w-full flex-wrap gap-1 sm:order-none sm:w-auto sm:flex-1 sm:justify-center">{navigation}</nav>}<div className="ml-auto flex items-center gap-3">{actions}</div>{children}</header>);
FlowHeader.displayName = "FlowHeader";
