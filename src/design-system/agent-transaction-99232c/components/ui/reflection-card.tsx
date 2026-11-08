import * as React from "react";
import { cn } from "@/design-system/agent-transaction-99232c/lib/utils";
import { Card } from "./card";
export interface ReflectionCardProps extends React.HTMLAttributes<HTMLDivElement> { title: string; body: string; topic?: React.ReactNode; actions?: React.ReactNode; }
/** Editorial reflection item; supply topic and navigation as slots. */
export const ReflectionCard = React.forwardRef<HTMLDivElement,ReflectionCardProps>(({title,body,topic,actions,children,className,...props},ref) => <Card ref={ref} className={cn("space-y-3 p-5 shadow-reflection",className)} {...props}>{topic}<h3 className="font-display text-xl">{title}</h3><p className="font-sans text-sm">{body}</p>{children}{actions}</Card>);
ReflectionCard.displayName = "ReflectionCard";
