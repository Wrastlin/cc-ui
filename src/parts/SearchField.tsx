"use client";
// Adapted from Adobe's React Aria Tailwind starter (react-spectrum/starters/tailwind), Apache-2.0: LICENSES/.

import { Search, X } from "lucide-react";
import { Button, SearchField as AriaSearchField, type SearchFieldProps } from "react-aria-components";
import { withClass } from "./cx";
import { FieldGroup, Input, Label, fieldButton } from "./Field";

/** A search box with its label shown (A13) and a clear button once something is typed. */
export function SearchField({ label, placeholder, ...props }: SearchFieldProps & { label: string; placeholder?: string }) {
  return (
    <AriaSearchField {...props} className={withClass(props.className, "group flex flex-col gap-1")}>
      <Label>{label}</Label>
      <FieldGroup>
        <Search aria-hidden size={18} className="ms-3 shrink-0 text-cc-muted" />
        <Input placeholder={placeholder} className="[&::-webkit-search-cancel-button]:hidden" />
        <Button className={`${fieldButton} group-data-empty:invisible`}>
          <X aria-hidden size={18} />
        </Button>
      </FieldGroup>
    </AriaSearchField>
  );
}
