import * as React from "react";
import { cn } from "@/design-system/agent-transaction-99232c/lib/utils";
export type TarotStep = "Question" | "Spread" | "Cards" | "Reading";
export interface TarotFlowProgressProps extends React.HTMLAttributes<HTMLOListElement> { step?: TarotStep; }
/** Reading sequence, not interactive navigation; current step is announced. */
export const TarotFlowProgress = React.forwardRef<HTMLOListElement,TarotFlowProgressProps>(({step="Question",className,...props},ref) => <ol ref={ref} aria-label="Reading progress" className={cn("flex flex-wrap gap-3 font-sans text-xs font-medium",className)} {...props}>{(["Question","Spread","Cards","Reading"] as const).map((s,i) => <li key={s} aria-current={s === step ? "step" : undefined} className={cn("border-b-2 pb-1",s === step ? "border-primary text-foreground" : "border-transparent text-muted-foreground")}>{String(i+1).padStart(2,"0")} {s.toUpperCase()}</li>)}</ol>);
TarotFlowProgress.displayName = "TarotFlowProgress";
