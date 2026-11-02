"use client";
// Adapted from Untitled UI React (untitleduico/react), MIT: LICENSES/.
// The trigger, search and footer follow Untitled UI's multi-select; the list, focus and keyboard are React Aria's.

import { ChevronDown, Search, X } from "lucide-react";
import { useId, useState } from "react";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  Input as AriaInput,
  Modal as AriaModal,
  ModalOverlay,
  SearchField as AriaSearchField,
  useFilter,
  type Key,
  type Selection,
} from "react-aria-components";
import { controlBox, cx, focusRing } from "./cx";
import { ListBox, ListItem } from "./ListBox";
import { Popover } from "./Popover";
import { useNarrow } from "./useNarrow";

export interface MultiSelectOption {
  id: Key;
  label: string;
}

export interface MultiSelectProps {
  label: string;
  options: MultiSelectOption[];
  /** Picked ids. Controlled: the screen owns the list. */
  value: Key[];
  onChange: (ids: Key[]) => void;
  placeholder?: string;
  /** A search box over the list; on by default past eight options. */
  searchable?: boolean;
  isDisabled?: boolean;
  errorMessage?: string;
  className?: string;
}

/**
 * Pick any number from a list. The trigger names what is picked (the names wrap, never "3 selected"). On a desk the
 * list drops under the trigger; on a phone it rises as a sheet with the list full width and a Done button, because a
 * popover under a thumb hides the very field it fills.
 */
export function MultiSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "None",
  searchable,
  isDisabled,
  errorMessage,
  className,
}: MultiSelectProps) {
  const narrow = useNarrow();
  const [query, setQuery] = useState("");
  const { contains } = useFilter({ sensitivity: "base" });
  const picked = options.filter((o) => value.includes(o.id));
  const showSearch = searchable ?? options.length > 8;
  const invalid = !!errorMessage;
  const id = useId();

  const setSelection = (keys: Selection) =>
    onChange(keys === "all" ? options.map((o) => o.id) : options.filter((o) => keys.has(o.id)).map((o) => o.id));

  const list = (
    <Autocomplete filter={contains} inputValue={query} onInputChange={setQuery}>
      {showSearch && (
        <AriaSearchField aria-label={`Search ${label}`} value={query} onChange={setQuery} autoFocus className="border-b border-solid border-cc-line p-2">
          <div className="flex min-h-(--cc-ctl-h) items-center gap-2 px-2 text-cc-muted">
            <Search aria-hidden size={18} />
            <AriaInput placeholder="Search" className="min-w-0 flex-1 border-0 bg-transparent text-cc-input text-cc-text outline-none placeholder:text-cc-faint [&::-webkit-search-cancel-button]:hidden" />
          </div>
        </AriaSearchField>
      )}
      <ListBox
        aria-label={label}
        items={options}
        selectionMode="multiple"
        selectedKeys={new Set(value)}
        onSelectionChange={setSelection}
        renderEmptyState={() => <p className="px-3 py-3 text-cc-body text-cc-muted">No match</p>}
        className={narrow ? "flex-1 overflow-y-auto" : "max-h-72 overflow-y-auto"}
      >
        {(o) => <ListItem id={o.id}>{o.label}</ListItem>}
      </ListBox>
    </Autocomplete>
  );

  const footer = (close: () => void) => (
    <div className="flex items-center justify-between gap-2 border-t border-solid border-cc-line p-2">
      <Button
        className={cx(focusRing, "min-h-(--cc-ctl-h) cursor-default rounded-cc border-0 bg-transparent px-3 text-cc-body font-semibold text-cc-accent data-pressed:bg-cc-selected data-disabled:text-cc-faint")}
        isDisabled={value.length === 0}
        onPress={() => onChange([])}
      >
        Clear
      </Button>
      <Button
        className={cx(focusRing, "min-h-(--cc-ctl-h) cursor-default rounded-cc border-0 bg-cc-accent px-5 text-cc-body font-semibold text-cc-bg data-hovered:bg-cc-accent-hover data-pressed:bg-cc-accent-press")}
        onPress={close}
      >
        Done
      </Button>
    </div>
  );

  return (
    <div className={cx("flex flex-col gap-1", className)}>
      <DialogTrigger onOpenChange={(open) => !open && setQuery("")}>
        <span id={`${id}-l`} className="w-fit text-cc-meta font-medium text-cc-muted">
          {label}
        </span>
        <Button
          aria-labelledby={`${id}-l ${id}-v`}
          aria-describedby={errorMessage ? `${id}-e` : undefined}
          isDisabled={isDisabled}
          aria-invalid={invalid || undefined}
          className={cx(
            focusRing,
            controlBox,
            "flex w-full cursor-default items-center gap-2 px-3 py-2 text-start data-pressed:border-cc-accent data-disabled:bg-cc-panel-2",
            invalid && "border-cc-danger",
          )}
        >
          <span id={`${id}-v`} className={cx("flex-1", picked.length === 0 && "text-cc-faint")}>
            {picked.length ? picked.map((o) => o.label).join(", ") : placeholder}
          </span>
          <ChevronDown aria-hidden size={20} className="shrink-0 text-cc-muted" />
        </Button>
        {narrow ? (
          <ModalOverlay
            data-cc-part
            isDismissable
            className="fixed inset-0 z-50 flex items-end bg-cc-scrim data-entering:animate-cc-fade-in data-exiting:animate-cc-fade-out"
          >
            <AriaModal
              data-cc-part
              className="flex max-h-[85dvh] w-full flex-col rounded-t-cc-lg bg-cc-bg pb-[env(safe-area-inset-bottom)] shadow-cc-modal outline-none data-entering:animate-cc-sheet-in data-exiting:animate-cc-sheet-out"
            >
              <Dialog className="flex min-h-0 flex-1 flex-col outline-none">
                {({ close }) => (
                  <>
                    <div className="flex items-center justify-between gap-2 border-b border-solid border-cc-line py-1 ps-4 pe-1">
                      <Heading slot="title" className="m-0 text-cc-title font-semibold text-cc-text">
                        {label}
                      </Heading>
                      <Button aria-label="Close" onPress={close} className={cx(focusRing, "flex size-12 cursor-default items-center justify-center rounded-cc border-0 bg-transparent text-cc-muted data-pressed:bg-cc-selected")}>
                        <X aria-hidden size={20} />
                      </Button>
                    </div>
                    {list}
                    {footer(close)}
                  </>
                )}
              </Dialog>
            </AriaModal>
          </ModalOverlay>
        ) : (
          <Popover placement="bottom start" className="w-(--trigger-width)">
            <Dialog aria-label={label} className="flex flex-col outline-none">
              {({ close }) => (
                <>
                  {list}
                  {footer(close)}
                </>
              )}
            </Dialog>
          </Popover>
        )}
      </DialogTrigger>
      {errorMessage && <p id={`${id}-e`} className="m-0 text-cc-meta font-medium text-cc-danger">{errorMessage}</p>}
    </div>
  );
}
