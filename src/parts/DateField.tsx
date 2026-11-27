"use client";
// Ours, built on React Aria's DatePicker (Apache-2.0); the field box and popover are the adapted parts beside it.

import { parseDate, type CalendarDate } from "@internationalized/date";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Button as AriaButton,
  Calendar,
  CalendarCell,
  CalendarGrid,
  DateInput,
  DatePicker,
  DateSegment,
  Dialog,
  Heading,
} from "react-aria-components";
import { cx, focusRing } from "./cx";
import { Description, FieldError, FieldGroup, Label, fieldButton } from "./Field";
import { Popover } from "./Popover";

// A typed date (gap 17; GOV.UK date input, React Aria DatePicker): month, day and year typed in place, which is fastest
// for a date read off paper (a received date set back from a marked PO, Aaron 11/25), and a calendar button for picking
// near today. The value is an ISO day ("2026-11-25") or null; min and max say why a day is refused.

function toDate(v: string | null | undefined): CalendarDate | null {
  if (!v) return null;
  try {
    return parseDate(v);
  } catch {
    return null;
  }
}

export function DateField({
  label,
  value,
  onChange,
  min,
  max,
  description,
  isRequired,
  className,
}: {
  label: string;
  /** ISO day, "2026-11-25". */
  value: string | null;
  onChange: (iso: string | null) => void;
  min?: string;
  max?: string;
  description?: string;
  isRequired?: boolean;
  className?: string;
}) {
  const lo = toDate(min);
  const hi = toDate(max);
  return (
    <DatePicker
      value={toDate(value)}
      onChange={(d) => onChange(d ? d.toString() : null)}
      minValue={lo ?? undefined}
      maxValue={hi ?? undefined}
      isRequired={isRequired}
      validationBehavior="aria"
      shouldForceLeadingZeros={false}
      className={cx("flex flex-col gap-1", className)}
    >
      <Label>{label}</Label>
      <FieldGroup className="w-fit min-w-[13rem]">
        <DateInput className="flex flex-1 items-center px-3 text-cc-input">
          {(segment) => (
            <DateSegment
              segment={segment}
              className="rounded-cc-sm px-0.5 tabular-nums outline-none data-focused:bg-cc-accent data-focused:text-cc-bg data-placeholder:text-cc-muted"
            />
          )}
        </DateInput>
        <AriaButton className={fieldButton} aria-label="Pick from a calendar">
          <CalendarDays size={18} aria-hidden="true" />
        </AriaButton>
      </FieldGroup>
      {description ? <Description>{description}</Description> : null}
      <FieldError>
        {({ validationDetails }) =>
          validationDetails.rangeUnderflow && min
            ? `Pick ${new Date(min + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })} or later`
            : validationDetails.rangeOverflow && max
              ? `Pick ${new Date(max + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })} or earlier`
              : "Enter a full date"
        }
      </FieldError>
      <Popover placement="bottom start">
        <Dialog className="p-3 outline-none" aria-label={label}>
          <Calendar className="w-fit">
            <header className="mb-2 flex items-center gap-1">
              <AriaButton slot="previous" className={cx(fieldButton, "rounded-cc")} aria-label="Previous month">
                <ChevronLeft size={18} aria-hidden="true" />
              </AriaButton>
              <Heading className="m-0 flex-1 text-center text-cc-body font-semibold" />
              <AriaButton slot="next" className={cx(fieldButton, "rounded-cc")} aria-label="Next month">
                <ChevronRight size={18} aria-hidden="true" />
              </AriaButton>
            </header>
            <CalendarGrid className="border-collapse">
              {(date) => (
                <CalendarCell
                  date={date}
                  className={cx(
                    focusRing,
                    "flex size-11 cursor-default items-center justify-center rounded-cc text-cc-body tabular-nums data-hovered:bg-cc-hover data-outside-month:hidden data-selected:bg-cc-accent data-selected:text-cc-bg data-disabled:text-cc-muted data-unavailable:text-cc-muted",
                  )}
                />
              )}
            </CalendarGrid>
          </Calendar>
        </Dialog>
      </Popover>
    </DatePicker>
  );
}
