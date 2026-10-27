"use client";

import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import {
  Button,
  FieldError,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select as AriaSelect,
  SelectValue,
} from "react-aria-components";

// The Field + native select pair on React Aria: the label, the button and the error share ids, arrows and typing move
// the pick, Escape closes, and focus goes back to the button. Value and onChange stay strings like a native select,
// so a caller swaps `onChange={(e) => set(e.target.value)}` for `onChange={set}`.

export type SelectOption = { value: string; label: string };

type SelectFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly SelectOption[];
  name?: string;
  isDisabled?: boolean;
  /** What went wrong; the field turns red and the line shows under the control. */
  error?: string | null;
  className?: string;
  /** No label drawn; it still names the control for screen readers. For a filter row or table cell labeled beside it. */
  hideLabel?: boolean;
  /** "inline" sits in a filter row or table cell: as wide as its value, the small control height. */
  size?: "inline";
};

export default function SelectField({
  label,
  value,
  onChange,
  options,
  name,
  isDisabled,
  error,
  className,
  hideLabel,
  size,
}: SelectFieldProps) {
  const invalid = Boolean(error);
  const trigger = useRef<HTMLButtonElement>(null);
  // Inside a Sheet, React Aria hands focus to the sheet's dialog when the list closes, not to the button (walked n64g),
  // so a keyboard user lost their place. Put it back when it landed on the body or on something holding the button.
  const refocus = (open: boolean) => {
    if (open) return;
    window.requestAnimationFrame(() => {
      const b = trigger.current, a = document.activeElement;
      if (b?.isConnected && a !== b && (!a || a === document.body || a.contains(b))) b.focus();
    });
  };
  return (
    <AriaSelect
      value={value}
      onChange={(key) => {
        if (key != null) onChange(String(key));
      }}
      name={name}
      isDisabled={isDisabled}
      isInvalid={invalid}
      validationBehavior="aria"
      onOpenChange={refocus}
      aria-label={hideLabel ? label : undefined}
      className={["ui-field", invalid ? "ui-field-err" : "", size === "inline" ? "ui-select-inline" : "", className ?? ""]
        .filter(Boolean)
        .join(" ")}
    >
      {hideLabel ? null : <Label className="ui-field-label">{label}</Label>}
      <Button ref={trigger} className="ui-input ui-select ui-select-btn">
        <SelectValue className="ui-select-value" />
        <ChevronDown aria-hidden size={16} className="ui-select-chev" />
      </Button>
      <FieldError className="ui-field-help">{error}</FieldError>
      <Popover className="ui-select-pop" offset={4}>
        <ListBox className="ui-select-list" items={options.map((o) => ({ id: o.value, ...o }))}>
          {(o) => (
            <ListBoxItem id={o.id} textValue={o.label} className="ui-select-item">
              {o.label}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </AriaSelect>
  );
}
