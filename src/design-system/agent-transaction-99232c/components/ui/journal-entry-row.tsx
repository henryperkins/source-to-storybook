import * as React from "react";
import { cn } from "@/design-system/agent-transaction-99232c/lib/utils";
export interface JournalEntryRowProps extends React.HTMLAttributes<HTMLElement> { source: string; title: string; excerpt: string; metadata: string; actions?: React.ReactNode; }
/** Unframed journal entry; application-provided actions own navigation and deletion. */
export const JournalEntryRow = React.forwardRef<HTMLElement,JournalEntryRowProps>(({source,title,excerpt,metadata,actions,children,className,...props},ref) => <article ref={ref} className={cn("space-y-2 border-b border-border py-4",className)} {...props}><p className="font-sans text-xs font-medium text-primary">{source}</p><h3 className="font-display text-2xl">{title}</h3><p className="font-sans text-sm">{excerpt}</p><p className="font-sans text-xs text-muted-foreground">{metadata}</p>{children}{actions}</article>);
JournalEntryRow.displayName = "JournalEntryRow";
