"use client";

import { Minus, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { Button, FieldError, Group, Input, Label, NumberField, Text } from "react-aria-components";

// A number moved by its step or typed, on React Aria's NumberField: minus, the number with its unit inside the same
// field, plus, joined as one control. Arrow keys step it, Enter and blur commit it, the buttons hold to repeat.
//
// The value is a string because a blank answer is not 0: blank stays blank until a person sets it.
//
// Typed values are kept as typed, never snapped to the step (23 ft stays 23 with a 5 ft step) and never marked
// invalid for being off the step: commitBehavior "validate" with isInvalid false. The buttons still stop at min and max.
//
// showLabel draws the label, help and error itself, as SelectField does. Wrapping the stepper in Field instead puts the
// buttons inside a <label>, and a tap on the label text then presses the minus button, its first labelable child.

type NumberStepperProps = {
  /** Read by a screen reader and spoken on the buttons: "Less Feet", "More Feet". */
  label: string;
  value: string;
  /** Fires with the committed value: after a step, on Enter, on blur. "" when cleared. */
  onChange: (value: string) => void;
  step?: number;
  min?: number;
  max?: number;
  /** Drawn inside the number's field, after the number. */
  unit?: string;
  isDisabled?: boolean;
  className?: string;
  /** Draw the label above the control, like Field; otherwise it only names the control for screen readers. */
  showLabel?: boolean;
  /** Said quietly under the control when there is no error line, like Field's help. */
  help?: ReactNode;
  /** What went wrong; the field turns red and the line shows under the control. `true` turns it red with no line. */
  error?: string | boolean | null;
};

const FORMAT: Intl.NumberFormatOptions = { useGrouping: false, maximumFractionDigits: 4 };

export default function NumberStepper({
  label,
  value,
  onChange,
  step = 1,
  min = 0,
  max,
  unit,
  isDisabled,
  className,
  showLabel,
  help,
  error,
}: NumberStepperProps) {
  const invalid = Boolean(error);
  const message = typeof error === "string" && error ? error : null;
  const n = value.trim() === "" ? NaN : Number(value);
  return (
    <NumberField
      aria-label={showLabel ? undefined : label}
      value={Number.isFinite(n) ? n : NaN}
      onChange={(v) => onChange(Number.isFinite(v) ? String(v) : "")}
      step={step}
      minValue={min}
      maxValue={max}
      formatOptions={FORMAT}
      commitBehavior="validate"
      isInvalid={invalid}
      validationBehavior="aria"
      isWheelDisabled
      isDisabled={isDisabled}
      className={["ui-step", showLabel ? "ui-field" : "", invalid ? "ui-field-err" : "", className ?? ""].filter(Boolean).join(" ")}
    >
      {showLabel ? <Label className="ui-field-label">{label}</Label> : null}
      <Group className="ui-step-box">
        <Button slot="decrement" className="ui-step-btn" aria-label={`Less ${label}`}>
          <Minus size={18} aria-hidden />
        </Button>
        <span className="ui-step-num">
          <Input className="ui-step-input" />
          {unit ? <span className="ui-step-unit" aria-hidden>{unit}</span> : null}
        </span>
        <Button slot="increment" className="ui-step-btn" aria-label={`More ${label}`}>
          <Plus size={18} aria-hidden />
        </Button>
      </Group>
      {message ? (
        <FieldError className="ui-field-help"><span role="alert">{message}</span></FieldError>
      ) : help ? (
        <Text slot="description" className="ui-field-help">{help}</Text>
      ) : null}
    </NumberField>
  );
}
