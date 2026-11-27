"use client";
// Adapted from Adobe's React Aria Tailwind starter (react-spectrum/starters/tailwind), Apache-2.0: LICENSES/.

import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";
import {
  Button,
  ComboBox as AriaComboBox,
  type ComboBoxProps as AriaComboBoxProps,
  type ValidationResult,
} from "react-aria-components";
import { withClass } from "./cx";
import { Description, FieldError, FieldGroup, Input, Label, fieldButton } from "./Field";
import { ListBox } from "./ListBox";
import { Popover } from "./Popover";

export interface ComboBoxProps<T extends object> extends Omit<AriaComboBoxProps<T>, "children"> {
  label: string;
  description?: string;
  errorMessage?: string | ((v: ValidationResult) => string);
  placeholder?: string;
  /** What the list says when nothing matches what was typed. */
  emptyText?: string;
  /** An open set (his 11/10: "Why can't we type?"): what is typed is kept as the value, and a no-match list offers
   * "Add <typed>" as one tap. Never a separate "Something else" button beside the field. */
  onCreate?: (text: string) => void;
  /** Options are still coming: the list shows a loading row in place of "No match". */
  loading?: boolean;
  children: ReactNode | ((item: T) => ReactNode);
}

/** Type to narrow a long list, pick one. Use SelectField when the list is short enough to read whole. */
export function ComboBox<T extends object>({
  label,
  description,
  errorMessage,
  placeholder,
  emptyText = "No match",
  onCreate,
  loading,
  children,
  items,
  ...props
}: ComboBoxProps<T>) {
  const [typed, setTyped] = useState(props.defaultInputValue ?? "");
  const text = (props.inputValue ?? typed).trim();
  return (
    <AriaComboBox
      menuTrigger="focus"
      allowsEmptyCollection
      allowsCustomValue={!!onCreate}
      {...props}
      onInputChange={(v) => {
        setTyped(v);
        props.onInputChange?.(v);
      }}
      // React Aria filters by what is typed only for defaultItems; `items` means the caller filters. Every caller here
      // passed `items` and got no filtering, so the list is handed over as defaultItems unless the caller controls
      // inputValue (then it filters itself).
      {...(props.inputValue === undefined ? { defaultItems: items ?? props.defaultItems } : { items })}
      className={withClass(props.className, "group flex flex-col gap-1")}
    >
      <Label>{label}</Label>
      <FieldGroup>
        <Input placeholder={placeholder} />
        <Button className={fieldButton}>
          <ChevronDown aria-hidden size={20} />
        </Button>
      </FieldGroup>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
      <Popover className="max-h-80 w-(--trigger-width)">
        <ListBox
          renderEmptyState={() =>
            loading ? (
              <p role="status" className="flex items-center gap-2 px-3 py-3 text-cc-body text-cc-muted">
                <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-cc-line border-t-cc-accent" />
                Loading
              </p>
            ) : onCreate && text ? (
              <button
                type="button"
                className="w-full px-3 py-3 text-left text-cc-body text-cc-accent hover:bg-cc-selected"
                onClick={() => onCreate(text)}
              >
                Add “{text}”
              </button>
            ) : (
              <p className="px-3 py-3 text-cc-body text-cc-muted">{emptyText}</p>
            )
          }
        >
          {children}
        </ListBox>
      </Popover>
    </AriaComboBox>
  );
}
