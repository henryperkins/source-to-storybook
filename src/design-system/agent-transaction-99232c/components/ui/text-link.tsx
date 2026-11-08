import * as React from "react";
import { cn } from "@/design-system/agent-transaction-99232c/lib/utils";
import { Button } from "./button";
export interface TextLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> { label?: string; size?: "sm" | "default"; }
/** Semantic inline navigation with a visible underline and focus ring. */
export const TextLink = React.forwardRef<HTMLAnchorElement, TextLinkProps>(({ label, children, size="default", className, ...props },ref) => <Button asChild variant="link" size={size === "sm" ? "sm" : "default"} className={cn("h-auto min-h-8 justify-start whitespace-normal px-0 underline",className)}><a ref={ref} {...props}>{children ?? label}</a></Button>);
TextLink.displayName = "TextLink";
