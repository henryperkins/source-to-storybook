import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/design-system/agent-transaction-99232c/lib/utils";

const amountVariants = cva("font-medium tabular-nums whitespace-nowrap", {
  variants: {
    variant: {
      default: "text-foreground",
      credit: "text-primary",
      debit: "text-foreground",
      muted: "text-muted-foreground",
    },
    size: {
      sm: "text-sm",
      default: "text-base",
      lg: "text-2xl font-semibold tracking-tight",
    },
  },
  defaultVariants: { variant: "default", size: "default" },
});

export interface FormatAmountOptions {
  currency?: string;
  locale?: string;
  /** credit forces "+", debit forces "−"; default shows the value's own sign. */
  direction?: "credit" | "debit" | "none";
}

/** Formats a money value. Credits get a leading "+", debits a leading "-". */
export function formatAmount(
  value: number,
  { currency = "USD", locale = "en-US", direction = "none" }: FormatAmountOptions = {},
): string {
  const abs = new Intl.NumberFormat(locale, { style: "currency", currency }).format(Math.abs(value));
  if (direction === "credit") return `+${abs}`;
  if (direction === "debit") return `-${abs}`;
  return value < 0 ? `-${abs}` : abs;
}

export interface AmountProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    VariantProps<typeof amountVariants> {
  /** Numeric value in major units (e.g. 12.5 = $12.50). */
  value: number;
  /** ISO 4217 currency code. */
  currency?: string;
  locale?: string;
  /** Show the +/- sign for credit/debit variants. Defaults to true. */
  showSign?: boolean;
}

const Amount = React.forwardRef<HTMLSpanElement, AmountProps>(
  ({ value, currency = "USD", locale = "en-US", variant, size, showSign = true, className, ...props }, ref) => {
    const direction =
      showSign && variant === "credit" ? "credit" : showSign && variant === "debit" ? "debit" : "none";
    const text = formatAmount(value, { currency, locale, direction });
    const spoken =
      direction === "credit"
        ? `credit ${formatAmount(value, { currency, locale })}`
        : direction === "debit" || value < 0
          ? `debit ${formatAmount(Math.abs(value), { currency, locale })}`
          : undefined;
    return (
      <span
        ref={ref}
        className={cn(amountVariants({ variant, size }), className)}
        {...props}
      >
        <span aria-hidden={spoken ? true : undefined}>{text}</span>
        {spoken && <span className="sr-only">{spoken}</span>}
      </span>
    );
  },
);
Amount.displayName = "Amount";

export { Amount, amountVariants };
