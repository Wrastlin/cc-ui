/** The three named widths (tokens.css header). New work reads these; older rules move to them one template at a time. */
export const WIDTHS = { tablet: 600, desk: 1024, content: 1280 } as const;
export type WidthName = keyof typeof WIDTHS;
