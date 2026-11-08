import * as React from "react";
import { cn } from "@/design-system/agent-transaction-99232c/lib/utils";
export interface FlowSidePanelProps extends React.HTMLAttributes<HTMLElement> { title?: string; body?: string; quote?: React.ReactNode; art?: React.ReactNode; actions?: React.ReactNode; }
/** Unframed companion column, never a decorative card enclosing other cards. */
export const FlowSidePanel = React.forwardRef<HTMLElement,FlowSidePanelProps>(({title,body,quote,art,actions,children,className,...props},ref) => <aside ref={ref} className={cn("space-y-4 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0",className)} {...props}>{art}{title && <h2 className="font-display text-2xl">{title}</h2>}{body && <p className="font-sans text-sm">{body}</p>}{quote && <blockquote className="font-display text-xl">{quote}</blockquote>}{children}{actions}</aside>);
FlowSidePanel.displayName = "FlowSidePanel";
