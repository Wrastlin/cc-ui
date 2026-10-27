"use client";

import {
  FieldError,
  Input,
  Label,
  TextArea,
  TextField as AriaTextField,
} from "react-aria-components";

// React Aria wires the label, the control and the error together (ids, aria-invalid, aria-describedby), so a screen
// reader hears what went wrong and a tap on the label lands in the control. Label above, no placeholder, no help
// line: a field is its label and its value.

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** A textarea instead of a one-line input. */
  multiline?: boolean;
  rows?: number;
  type?: "text" | "email" | "tel" | "url" | "number" | "date" | "time";
  name?: string;
  maxLength?: number;
  isRequired?: boolean;
  isDisabled?: boolean;
  /** What went wrong; the field turns red and the line shows under the control. */
  error?: string | null;
  autoFocus?: boolean;
  className?: string;
  inputClassName?: string;
};

export default function TextField({
  label,
  value,
  onChange,
  multiline,
  rows = 2,
  type = "text",
  name,
  maxLength,
  isRequired,
  isDisabled,
  error,
  autoFocus,
  className,
  inputClassName,
}: TextFieldProps) {
  const invalid = Boolean(error);
  const control = ["ui-input", inputClassName ?? ""].filter(Boolean).join(" ");
  return (
    <AriaTextField
      value={value}
      onChange={onChange}
      type={multiline ? undefined : type}
      name={name}
      maxLength={maxLength}
      isRequired={isRequired}
      isDisabled={isDisabled}
      isInvalid={invalid}
      autoFocus={autoFocus}
      validationBehavior="aria"
      className={["ui-field", invalid ? "ui-field-err" : "", className ?? ""]
        .filter(Boolean)
        .join(" ")}
    >
      <Label className="ui-field-label">{label}</Label>
      {multiline ? (
        <TextArea className={control} rows={rows} />
      ) : (
        <Input className={control} />
      )}
      <FieldError className="ui-field-help">{error}</FieldError>
    </AriaTextField>
  );
}
