"use client";

import { ChevronDown, Search } from "lucide-react";
import { useRef, type ReactNode } from "react";
import Swatch from "./ColorSwatch";
import {
  Autocomplete,
  Button,
  FieldError,
  Header,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  ListBoxSection,
  Popover,
  SearchField,
  Select as AriaSelect,
  SelectValue,
  useFilter,
} from "react-aria-components";

/** P1: a list this long is searched, not scrolled. Every long select in every app gets the box from here. */
export const SEARCH_FROM = 16;

// The Field + native select pair on React Aria: the label, the button and the error share ids, arrows and typing move
// the pick, Escape closes, and focus goes back to the button. Value and onChange stay strings like a native select,
// so a caller swaps `onChange={(e) => set(e.target.value)}` for `onChange={set}`.

export type SelectOption = {
  value: string;
  label: string;
  /** A CSS color drawn as a chip before the label, in the list and in the button when picked. */
  swatch?: string | null;
  /** A header the option sits under, for a list past seven (HUMAN-UI 1). Options of one group are given together. */
  group?: string;
  /** Listed but not pickable, like a filter value no product has under the other picks. */
  disabled?: boolean;
  /** Steps in from the left in the list, for a tree such as pages under pages; the button shows the label alone. */
  depth?: number;
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
  const chip = (color: string | null | undefined) => (swatches ? <Swatch hex={color} size={18} className="ui-select-swatch" /> : null);
  const groups = options.reduce<{ label: string; options: SelectOption[] }[]>((gs, o) => {
    const last = gs.at(-1), label = o.group ?? "";
    if (last && last.label === label) last.options.push(o);
    else gs.push({ label, options: [o] });
    return gs;
  }, []);
  const item = (o: SelectOption) => (
    <ListBoxItem key={o.value} id={o.value} textValue={o.label} isDisabled={o.disabled} className="ui-select-item"
      style={o.depth ? { paddingInlineStart: 12 + 20 * o.depth } : undefined}>
      {chip(o.swatch)}
      {o.label}
    </ListBoxItem>
  );
  const trigger = useRef<HTMLButtonElement>(null);
  const { contains } = useFilter({ sensitivity: "base" });
  const searched = options.length >= SEARCH_FROM;
  // Inside a Sheet, React Aria hands focus to the sheet's dialog when the list closes, not to the button (walked n64g),
  // so a keyboard user lost their place. Put it back when it landed on the body or on something holding the button.
  const refocus = (open: boolean) => {
    if (open) return;
    window.requestAnimationFrame(() => {
      const b = trigger.current, a = document.activeElement;
      if (b?.isConnected && a !== b && (!a || a === document.body || a.contains(b))) b.focus();
    });
  };
  const list = (
    <ListBox className="ui-select-list">
      {groups.map((g, i) =>
        g.label ? (
          <ListBoxSection key={g.label} id={g.label} className="ui-select-section">
            <Header className="ui-select-header">{g.label}</Header>
            {g.options.map(item)}
          </ListBoxSection>
        ) : (
          <ListBoxSection key={`_${i}`} id={`_${i}`} className="ui-select-section">{g.options.map(item)}</ListBoxSection>
        ),
      )}
    </ListBox>
  );
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
        {/* React Aria's default placeholder reads "Select an item" in every empty field; an empty field shows nothing. */}
        <SelectValue className="ui-select-value">
          {({ isPlaceholder, defaultChildren }) => (isPlaceholder ? null : defaultChildren)}
        </SelectValue>
        <ChevronDown aria-hidden size={16} className="ui-select-chev" />
      </Button>
      {message ? <FieldError className="ui-field-help"><span role="alert">{message}</span></FieldError> : help ? <span className="ui-field-help">{help}</span> : null}
      <Popover className={"ui-select-pop" + (searched ? " ui-select-pop-search" : "")} offset={4}>
        {searched ? (
          <Autocomplete filter={contains}>
            <SearchField aria-label={`Search ${label}`} autoFocus className="ui-select-search">
              <Search aria-hidden size={18} className="ui-select-search-icon" />
              <Input className="ui-input" />
            </SearchField>
            {list}
          </Autocomplete>
        ) : list}
      </Popover>
    </AriaSelect>
  );
}
