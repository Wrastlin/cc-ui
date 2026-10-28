"use client";

import { ChevronDown } from "lucide-react";
import { useRef, type ReactNode } from "react";
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

export type SelectOption = {
  value: string;
  label: string;
  /** A CSS color drawn as a chip before the label, in the list and in the button when picked. */
  swatch?: string | null;
};

type SelectFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly SelectOption[];
  name?: string;
  isDisabled?: boolean;
  /** What went wrong; the field turns red and the line shows under the control. `true` turns it red with no line. */
  error?: string | boolean | null;
  /** Said quietly under the control when there is no error line, like Field's help. */
  help?: ReactNode;
  /** Draw each option's color chip; an option without one gets an empty chip so the labels line up. */
  swatches?: boolean;
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
  help,
  swatches,
}: SelectFieldProps) {
  const invalid = Boolean(error);
  const message = typeof error === "string" && error ? error : null;
  const chip = (color: string | null | undefined) =>
    swatches ? <span aria-hidden className="ui-select-swatch" style={{ background: color ?? undefined }} /> : null;
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
        {chip(options.find((o) => o.value === value)?.swatch)}
        <SelectValue className="ui-select-value" />
        <ChevronDown aria-hidden size={16} className="ui-select-chev" />
      </Button>
      {message ? <FieldError className="ui-field-help">{message}</FieldError> : help ? <span className="ui-field-help">{help}</span> : null}
      <Popover className="ui-select-pop" offset={4}>
        <ListBox className="ui-select-list" items={options.map((o) => ({ id: o.value, ...o }))}>
          {(o) => (
            <ListBoxItem id={o.id} textValue={o.label} className="ui-select-item">
              {chip(o.swatch)}
              {o.label}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </AriaSelect>
  );
}
