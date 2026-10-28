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
export type { BackTarget, BarAction } from "./AppBar";

export { AccountButton, initialsFromEmail } from "./AccountButton";
export type { AccountItem } from "./AccountButton";

export { TabRow, RecordRow, Chip, Breadcrumbs } from "./ContextRow";
export type { Tab, ChipTone, Crumb } from "./ContextRow";

export { default as Button } from "./Button";
export type { ButtonVariant, ButtonSize } from "./Button";

export { default as Field, TextInput, Select } from "./Field";
export { default as TextField } from "./TextField";
export { default as SelectField, type SelectOption } from "./SelectField";
export { default as Row, RowGroup } from "./Row";
export { RowList, ListRow } from "./RowList";
export { default as Sheet } from "./Sheet";
export { default as DialogHost } from "./DialogHost";

export {
  alertDialog,
  confirmDialog,
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
export { menuFor, menuLabel, isCurrent, MENU_FOLD_KEY } from "./menu";
export type { MenuLink } from "./menu";
