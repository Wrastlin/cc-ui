"use client";

import { ToggleButton, ToggleButtonGroup, type Key } from "react-aria-components";

// One of a fixed set, on React Aria's ToggleButtonGroup: the buttons joined as one control, the picked one filled.
// A screen reader hears a radio group; arrow keys move between the choices, Space or Enter picks, Tab leaves the set.
// A picked choice stays picked when tapped again: an answer is changed, not cleared.

export type ChoiceOption<T extends string = string> = readonly [value: T, text: string];

type ChoiceGroupProps<T extends string> = {
  label: string;
  value: T | "" | undefined;
  options: readonly ChoiceOption<T>[];
  onPick: (value: T) => void;
  /** Lets the buttons run onto more lines instead of squeezing. */
  wrap?: boolean;
  isDisabled?: boolean;
  className?: string;
};

export function ChoiceGroup<T extends string>({
  label,
  value,
  options,
  onPick,
  wrap,
  isDisabled,
  className,
}: ChoiceGroupProps<T>) {
  return (
    <ToggleButtonGroup
      aria-label={label}
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={value ? [value] : []}
      onSelectionChange={(keys: Set<Key>) => {
        const [k] = keys;
        if (k !== undefined) onPick(String(k) as T);
      }}
      isDisabled={isDisabled}
      className={["ui-seg", wrap ? "ui-seg-wrap" : "", className ?? ""].filter(Boolean).join(" ")}
    >
      {options.map(([v, text]) => (
        <ToggleButton key={v} id={v} className="ui-seg-btn">
          {text}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
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
