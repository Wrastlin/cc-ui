"use client";

import { FieldError, Label, TextArea as AriaTextArea, TextField as AriaTextField } from "react-aria-components";

// A note box at TextField's field size (16 px or more on a phone, so iOS does not zoom on focus), its label wired to it
// by React Aria. hideLabel is for a box already named by the row it edits in place; the name still reaches a reader.

type TextAreaProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  hideLabel?: boolean;
  name?: string;
  maxLength?: number;
  isRequired?: boolean;
  isDisabled?: boolean;
  /** What went wrong; the box turns red and the line shows under it. */
  error?: string | null;
  autoFocus?: boolean;
  className?: string;
};

export default function TextArea({
  label,
  value,
  onChange,
  rows = 3,
  hideLabel,
  name,
  maxLength,
  isRequired,
  isDisabled,
  error,
  autoFocus,
  className,
}: TextAreaProps) {
  const invalid = Boolean(error);
  return (
    <AriaTextField
      value={value}
      onChange={onChange}
      name={name}
      maxLength={maxLength}
      isRequired={isRequired}
      isDisabled={isDisabled}
      isInvalid={invalid}
      autoFocus={autoFocus}
      aria-label={hideLabel ? label : undefined}
      validationBehavior="aria"
      className={["ui-field", invalid ? "ui-field-err" : "", className ?? ""].filter(Boolean).join(" ")}
    >
      {!hideLabel && <Label className="ui-field-label">{label}</Label>}
      <AriaTextArea className="ui-input ui-textarea" rows={rows} />
      <FieldError className="ui-field-help">{error}</FieldError>
    </AriaTextField>
  );
}
