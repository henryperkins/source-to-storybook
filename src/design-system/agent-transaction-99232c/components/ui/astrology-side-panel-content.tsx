import * as React from "react";
import { cn } from "@/design-system/agent-transaction-99232c/lib/utils";
export interface AstrologySidePanelContentProps extends React.HTMLAttributes<HTMLDivElement> { variant?: "chart" | "cycle"; title: string; subtitle?: string; art?: React.ReactNode; detail?: React.ReactNode; actions?: React.ReactNode; }
/** Chart/cycle context; chart facts and cycle dates come from the application, not this library. */
export const AstrologySidePanelContent = React.forwardRef<HTMLDivElement,AstrologySidePanelContentProps>(({variant="chart",title,subtitle,art,detail,actions,children,className,...props},ref) => <div ref={ref} data-variant={variant} className={cn("space-y-4",className)} {...props}><h3 className="font-display text-2xl">{title}</h3>{subtitle && <p className="font-sans text-sm text-muted-foreground">{subtitle}</p>}{art}{detail}{children}{actions}</div>);
AstrologySidePanelContent.displayName = "AstrologySidePanelContent";
