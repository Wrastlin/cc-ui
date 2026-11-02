/*
 * cc-ui/parts: the component library on React Aria and Tailwind (GOALS 13, briefs/ui-stack.md "Smarter path" 2).
 *
 * The base is Adobe's React Aria Tailwind starter, the multi-select, table, modal and button group follow Untitled
 * UI's, all themed to the visual system's tokens through parts.css. Licenses in LICENSES/.
 *
 * Needs Tailwind v4 in the app and, once in its global CSS after Tailwind:
 *   @import "cc-ui/parts.css";
 * The classic primitives (Button, SelectField, Sheet, Row ...) stay on the root "cc-ui" export with their names and
 * props; a part here never shares a name with one there.
 */

export { cx, focusRing, focusRingInset } from "./cx";
export { useNarrow } from "./useNarrow";
export { Label, Description, FieldError, FieldGroup, Input } from "./Field";
export { Popover } from "./Popover";
export { ListBox, ListItem, ListSection } from "./ListBox";
export { Checkbox, CheckboxGroup, type CheckboxGroupProps } from "./Checkbox";
export { Switch } from "./Switch";
export { ComboBox, type ComboBoxProps } from "./ComboBox";
export { MultiSelect, type MultiSelectOption, type MultiSelectProps } from "./MultiSelect";
export { Modal, ModalTrigger, type ModalProps } from "./Modal";
export { Tabs, TabList, TabItem, TabPanel, Segmented, type SegmentedOption } from "./Tabs";
export { ButtonGroup, ButtonGroupItem } from "./ButtonGroup";
export { TagGroup, TagItem, type TagGroupProps } from "./TagGroup";
export { SearchField } from "./SearchField";
export { Table, type TableColumn, type TableProps } from "./Table";
export { Section, SectionRow } from "./Section";
export { Panel } from "./Panel";
export { Disclosure } from "./Disclosure";
export { ProgressBar } from "./ProgressBar";
export { Tooltip, TooltipTrigger } from "./Tooltip";
