"use client";

import { Minus, Plus } from "lucide-react";
import { Button, Group, Input, NumberField } from "react-aria-components";

// A number moved by its step or typed, on React Aria's NumberField: minus, the number with its unit inside the same
// field, plus, joined as one control. Arrow keys step it, Enter and blur commit it, the buttons hold to repeat.
//
// The value is a string because a blank answer is not 0: blank stays blank until a person sets it.
//
// Typed values are kept as typed, never snapped to the step (23 ft stays 23 with a 5 ft step) and never marked
// invalid for being off the step: commitBehavior "validate" with isInvalid false. The buttons still stop at min and max.

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
}: NumberStepperProps) {
  const n = value.trim() === "" ? NaN : Number(value);
  return (
    <NumberField
      aria-label={label}
      value={Number.isFinite(n) ? n : NaN}
      onChange={(v) => onChange(Number.isFinite(v) ? String(v) : "")}
      step={step}
      minValue={min}
      maxValue={max}
      formatOptions={FORMAT}
      commitBehavior="validate"
      isInvalid={false}
      validationBehavior="aria"
      isWheelDisabled
      isDisabled={isDisabled}
      className={["ui-step", className ?? ""].filter(Boolean).join(" ")}
    >
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
    </NumberField>
  );
}
