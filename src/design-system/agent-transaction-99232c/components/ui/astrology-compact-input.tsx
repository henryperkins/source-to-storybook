import * as React from "react";
import { cn } from "@/design-system/agent-transaction-99232c/lib/utils";
import { Input } from "./input";
import { Label } from "./label";
export interface AstrologyCompactInputProps extends React.InputHTMLAttributes<HTMLInputElement> { label: string; hint?: string; }
/** Labeled, editable field; value and change handler belong to the consumer. */
export const AstrologyCompactInput = React.forwardRef<HTMLInputElement,AstrologyCompactInputProps>(({label,hint,id,className,"aria-describedby":describedBy,...props},ref) => {
 const generated=React.useId(); const fieldId=id ?? generated; const hintId=fieldId+"-hint";
 return <div className={cn("space-y-2",className)}><Label htmlFor={fieldId}>{label}</Label><Input ref={ref} id={fieldId} aria-describedby={[describedBy,hint ? hintId : undefined].filter(Boolean).join(" ") || undefined} {...props} />{hint && <p id={hintId} className="font-sans text-xs text-muted-foreground">{hint}</p>}</div>;
});
AstrologyCompactInput.displayName = "AstrologyCompactInput";
