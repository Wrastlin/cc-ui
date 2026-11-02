"use client";

import type { ReactNode } from "react";
import { Radio, RadioGroup, ToggleButton, ToggleButtonGroup, type Key } from "react-aria-components";

// One of a fixed set, on React Aria's ToggleButtonGroup: the buttons joined as one control, the picked one filled.
// A screen reader hears a radio group; arrow keys move between the choices, Space or Enter picks, Tab leaves the set.
// A picked choice stays picked when tapped again: an answer is changed, not cleared. Pass onClear for a question that
// may go back to unanswered: then tapping the picked choice again clears it.

// An option with an icon draws the icon alone, its text the button's name and tooltip, as a tool row does (Select,
// Box, Paint); its className reaches that one button, so a screen size can hide one choice.
export type ChoiceOption<T extends string = string> =
  | readonly [value: T, text: string]
  | readonly [value: T, text: string, look: { icon?: ReactNode; className?: string }];

type ChoiceGroupProps<T extends string> = {
  label: string;
  value: T | "" | undefined;
  options: readonly ChoiceOption<T>[];
  onPick: (value: T) => void;
  /** Tapping the picked choice again clears it; without this a choice is changed, never cleared. */
  onClear?: () => void;
  /** Lets the buttons run onto more lines instead of squeezing. */
  wrap?: boolean;
  /** The choice a question starts on before anyone says it: outlined, never filled or checked, until a tap says it. */
  suggested?: T;
  isDisabled?: boolean;
  className?: string;
};

export function ChoiceGroup<T extends string>({
  label,
  value,
  options,
  onPick,
  onClear,
  wrap,
  suggested,
  isDisabled,
  className,
}: ChoiceGroupProps<T>) {
  const shown = value ? undefined : suggested;
  return (
    <ToggleButtonGroup
      aria-label={label}
      selectionMode="single"
      disallowEmptySelection={!onClear}
      selectedKeys={value ? [value] : []}
      onSelectionChange={(keys: Set<Key>) => {
        const [k] = keys;
        if (k !== undefined) onPick(String(k) as T);
        else onClear?.();
      }}
      isDisabled={isDisabled}
      className={["ui-seg", wrap ? "ui-seg-wrap" : "", className ?? ""].filter(Boolean).join(" ")}
    >
      {options.map(([v, text, look]) =>
        look?.icon ? (
          <ToggleButton
            key={v}
            id={v}
            aria-label={text}
            className={["ui-seg-btn ui-seg-icon", look.className ?? ""].filter(Boolean).join(" ")}
          >
            <span title={text} className="ui-seg-glyph" aria-hidden>
              {look.icon}
            </span>
          </ToggleButton>
        ) : (
          <ToggleButton
            key={v}
            id={v}
            className={["ui-seg-btn", v === shown ? "ui-seg-suggested" : "", look?.className ?? ""]
              .filter(Boolean)
              .join(" ")}
          >
            {text}
            {v === shown && <span className="ui-seg-hint">, default</span>}
          </ToggleButton>
        ),
      )}
    </ToggleButtonGroup>
  );
}

/** One of a fixed set as stacked 48 px radio rows (PATTERNS P12, ChoiceGroup / radio): for choices whose words do not
 * fit side by side as segments on a phone. inline puts them in one row from 600 px wide, where they fit. */
export function RadioChoice<T extends string>({
  label,
  value,
  options,
  onPick,
  inline,
  isDisabled,
  className,
}: {
  label: string;
  value: T | "" | undefined;
  options: readonly (readonly [value: T, text: string])[];
  onPick: (value: T) => void;
  inline?: boolean;
  isDisabled?: boolean;
  className?: string;
}) {
  return (
    <RadioGroup
      aria-label={label}
      value={value || null}
      onChange={(v) => onPick(v as T)}
      isDisabled={isDisabled}
      className={["ui-radio", inline ? "ui-radio-inline" : "", className ?? ""].filter(Boolean).join(" ")}
    >
      {options.map(([v, text]) => (
        <Radio key={v} value={v} className="ui-radio-row">
          <span className="ui-radio-mark" aria-hidden />
          {text}
        </Radio>
      ))}
    </RadioGroup>
  );
}

const YES_NO = [
  ["yes", "Yes"],
  ["no", "No"],
] as const;

/** Yes or No; anything else stored reads as neither picked. */
export default function YesNo({
  label,
  value,
  onPick,
  isDisabled,
  className,
}: {
  label: string;
  value: string | undefined;
  onPick: (value: "yes" | "no") => void;
  isDisabled?: boolean;
  className?: string;
}) {
  return (
    <ChoiceGroup
      label={label}
      value={value === "yes" || value === "no" ? value : ""}
      options={YES_NO}
      onPick={onPick}
      isDisabled={isDisabled}
      className={className}
    />
  );
}
