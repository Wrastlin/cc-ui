/*
 * cc-ui: the shared C&C Services shell, primitives and tokens.
 *
 * Import the stylesheet once, in the root layout:
 *   import "cc-ui/styles.css";
 *
 * Next must be told to transpile this package, since it ships as source:
 *   transpilePackages: ["cc-ui"]
 */

export { CCLogo, CC_MARK_RATIO, CC_LOCKUP_RATIO } from "./CCLogo";
export type { LogoVariant } from "./CCLogo";

export { AppBar, IdentityBar } from "./AppBar";
export { OverlayBar } from "./OverlayBar";
export { BackButton } from "./BackButton";
export type { BackTarget, BarAction } from "./AppBar";

export { AccountButton, initialsFromEmail } from "./AccountButton";
export type { AccountItem } from "./AccountButton";
export { ReportButton, HelperInBar, openReport, noteTrail } from "./ReportProblem";

export { TabRow, SectionTabRow, RecordRow, Chip, Breadcrumbs } from "./ContextRow";
export type { Tab, ChipTone, Crumb } from "./ContextRow";

export { default as Button } from "./Button";
export type { ButtonVariant, ButtonSize } from "./Button";

export { default as Field, TextInput, Select } from "./Field";
export { default as TextField } from "./TextField";
export { default as TextArea } from "./TextArea";
export { default as SelectField, type SelectOption } from "./SelectField";
export { needsEdge } from "./swatch";
export { default as Swatch } from "./ColorSwatch";
export { default as NumberStepper } from "./NumberStepper";
export { default as YesNo, ChoiceGroup, RadioChoice, type ChoiceOption } from "./YesNo";
export { default as Row, RowGroup } from "./Row";
export { default as CountRow, CountHead, type CountMark, type CountTool } from "./CountRow";
export { default as ReceivingLine, ReceivingHead, type ReceivingLineProps } from "./ReceivingLine";
export { default as SplitView } from "./SplitView";
export { default as FieldRow } from "./FieldRow";
export { default as Card, Actions, useOneAction } from "./Card";
export { default as InlineMessage, type MessageTone } from "./InlineMessage";
export { toast, ToastHost } from "./Toast";
export { default as Form, ErrorSummary, useFieldError, type FormErrors } from "./Form";
export { RowList, ListRow, usePaging, SHORT } from "./RowList";
export type { Paging, ListState } from "./RowList";
export { SkeletonRows, EmptyState } from "./States";
export { default as ActionBar, type BulkAction } from "./ActionBar";
export { default as DescriptionList, type Fact } from "./DescriptionList";
export { money, count, date, time, range, ago } from "./format";
export { MoneyText, NumberText } from "./NumberText";
export { default as Sheet } from "./Sheet";
export { default as Menu, type MenuEntry, type MenuChecks } from "./ActionMenu";
export { default as DialogHost } from "./DialogHost";

export {
  alertDialog,
  confirmDialog,
  choiceDialog,
  promptDialog,
  subscribeDialogs,
  currentDialog,
  resolveDialog,
} from "./dialogs";
export type { DialogKind, DialogRequest } from "./dialogs";

export { SideMenu, MenuLinks, ExtraLinks, menuIcon } from "./SideMenu";
export { HubFrame } from "./HubFrame";
export { PhoneTabs, MenuSheet, phoneTabs } from "./PhoneMenu";
export type { MenuLinkProps } from "./SideMenu";
export { menuFor, menuSections, sectionTabs, rowTwo, SECTION_HREFS, menuLabel, isCurrent, MENU_FOLD_KEY } from "./menu";
export type { MenuLink, MenuSection, SectionTabs } from "./menu";
export { WIDTHS } from "./widths";
export type { WidthName } from "./widths";
