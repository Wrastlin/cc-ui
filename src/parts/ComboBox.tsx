"use client";
// Adapted from Adobe's React Aria Tailwind starter (react-spectrum/starters/tailwind), Apache-2.0: LICENSES/.

import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
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
  children: ReactNode | ((item: T) => ReactNode);
}

/** Type to narrow a long list, pick one. Use SelectField when the list is short enough to read whole. */
export function ComboBox<T extends object>({
  label,
  description,
  errorMessage,
  placeholder,
  emptyText = "No match",
  children,
  items,
  ...props
}: ComboBoxProps<T>) {
  return (
    <AriaComboBox {...props} items={items} className={withClass(props.className, "group flex flex-col gap-1")}>
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
          renderEmptyState={() => <p className="px-3 py-3 text-cc-body text-cc-muted">{emptyText}</p>}
        >
          {children}
        </ListBox>
      </Popover>
    </AriaComboBox>
  );
}
