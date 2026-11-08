import * as React from "react";
import { cn } from "@/design-system/agent-transaction-99232c/lib/utils";
import { Button, type ButtonProps } from "./button";
import check from "@/design-system/agent-transaction-99232c/assets/icons/reflection-check.png";
export interface JournalFilterChipProps extends Omit<ButtonProps,"variant"> { label?: string; state?: "Selected" | "Default"; }
/** Toggle-style journal filter; expose selection as aria-pressed. */
export const JournalFilterChip = React.forwardRef<HTMLButtonElement,JournalFilterChipProps>(({ label,children,state="Default",className,...props },ref) => <Button ref={ref} type="button" variant="outline" aria-pressed={state === "Selected"} className={cn(state === "Selected" && "bg-mint text-mint-foreground hover:bg-mint/90",className)} {...props}>{state === "Selected" && <img src={check} alt="" className="size-4" />}{children ?? label}</Button>);
JournalFilterChip.displayName = "JournalFilterChip";
