import * as React from "react";
import { cn } from "@/design-system/agent-transaction-99232c/lib/utils";
import { FlowNavTab } from "./flow-nav-tab";
export interface TarotBasisCard { position: string; number: string; name: string; orientation: "Upright" | "Reversed"; href: string; }
export interface JournalTarotBasisProps extends React.HTMLAttributes<HTMLDivElement> { cards: readonly TarotBasisCard[]; }
/** Compact spread links; supply real destinations for every card. */
export const JournalTarotBasis = React.forwardRef<HTMLDivElement,JournalTarotBasisProps>(({cards,className,children,...props},ref) => <div ref={ref} className={cn("grid gap-3 sm:grid-cols-3",className)} {...props}>{cards.map(c => <FlowNavTab key={c.position} href={c.href} className="h-auto whitespace-normal rounded-lg border border-border py-3"><span className="space-y-1 text-center"><span className="block text-xs">{c.position} · {c.number}</span><span className="block text-sm">{c.name}</span><span className="block text-xs font-normal">{c.orientation}</span></span></FlowNavTab>)}{children}</div>);
JournalTarotBasis.displayName = "JournalTarotBasis";
