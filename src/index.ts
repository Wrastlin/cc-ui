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
export { ReportButton, openReport, noteTrail } from "./ReportProblem";

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
export { default as Card, Actions, useOneAction } from "./Card";
export { RowList, ListRow, usePaging, SHORT } from "./RowList";
export type { Paging } from "./RowList";
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
