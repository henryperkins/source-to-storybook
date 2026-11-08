import * as React from "react";
import { cn } from "@/design-system/agent-transaction-99232c/lib/utils";
import { Button } from "./button";
import { ArrowRight } from "lucide-react";
export interface HomeReturnRowProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> { date: string; question: string; }
/** Full-row navigation to a saved reflection; date is an application-provided stable label. */
export const HomeReturnRow = React.forwardRef<HTMLAnchorElement,HomeReturnRowProps>(({date,question,className,children,...props},ref) => <Button asChild variant="ghost" className={cn("h-auto min-h-9 w-full justify-between whitespace-normal rounded-none border-b border-border px-0 py-3 text-left",className)}><a ref={ref} {...props}><span className="min-w-0 space-y-1"><span className="block text-xs font-normal">{date}</span><span className="block font-display text-xl">{question}</span>{children}</span><ArrowRight aria-hidden="true" /></a></Button>);
HomeReturnRow.displayName = "HomeReturnRow";
