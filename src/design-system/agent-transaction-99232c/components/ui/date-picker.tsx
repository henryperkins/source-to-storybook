import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/design-system/agent-transaction-99232c/lib/utils";
import { Button } from "@/design-system/agent-transaction-99232c/components/ui/button";
import { Calendar } from "@/design-system/agent-transaction-99232c/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/design-system/agent-transaction-99232c/components/ui/popover";

export interface DatePickerProps {
  /** The selected date (controlled). */
  date?: Date;
  /** Called when the user picks a date. */
  onDateChange?: (date: Date | undefined) => void;
  /** Text shown when no date is selected. */
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

/**
 * A date input that opens a Solstice-styled calendar in a popover.
 */
function DatePicker({
  date,
  onDateChange,
  placeholder = "Pick a date",
  disabled,
  className,
  id,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start rounded-lg text-left font-normal",
            !date && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          defaultMonth={date}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export { DatePicker };
