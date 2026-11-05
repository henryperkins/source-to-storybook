import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, type DayPickerProps } from "react-day-picker";

import { cn } from "@/design-system/agent-transaction-99232c/lib/utils";
import { buttonVariants } from "@/design-system/agent-transaction-99232c/components/ui/button";

export type CalendarProps = DayPickerProps;

/**
 * A monthly calendar built on react-day-picker, styled with Solstice tokens.
 * Usually composed inside a Popover to form a DatePicker.
 */
function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      navLayout="around"
      className={cn("p-3", className)}
      classNames={{
        root: "relative w-fit",
        months: "flex flex-col gap-4 sm:flex-row",
        month: "relative flex flex-col gap-4",
        month_caption: "relative flex h-9 items-center justify-center",
        caption_label: "font-display text-sm font-semibold",
                button_previous: cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "absolute left-0 top-0.5 z-10 h-8 w-8 border border-border text-foreground hover:bg-muted",
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "absolute right-0 top-0.5 z-10 h-8 w-8 border border-border text-foreground hover:bg-muted",
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "w-9 text-center text-xs font-medium text-muted-foreground",
        week: "mt-1 flex",
        day: "h-8 w-8 p-0 text-center text-sm",
        day_button: cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "h-8 w-8 rounded-full font-normal aria-selected:opacity-100",
        ),
        selected:
          "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground",
        today: "[&>button]:bg-secondary [&>button]:text-secondary-foreground",
        outside: "text-muted-foreground opacity-50",
        disabled: "text-muted-foreground opacity-50",
        hidden: "invisible",
        range_middle: "[&>button]:rounded-none [&>button]:bg-muted",
        range_start: "[&>button]:rounded-r-none",
        range_end: "[&>button]:rounded-l-none",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...chevronProps }) =>
          orientation === "left" ? (
            <ChevronLeft className="h-4 w-4" {...chevronProps} />
          ) : (
            <ChevronRight className="h-4 w-4" {...chevronProps} />
          ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
