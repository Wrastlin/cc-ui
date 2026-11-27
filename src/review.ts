/** The next item still open after `at` (0-based), wrapping to the start; -1 when none is left. A decision moves here,
 * not to the next row in list order, so a reviewer never lands on one already done. */
export function nextOpen<T>(items: readonly T[], at: number, isOpen: (item: T) => boolean): number {
  for (let k = 1; k <= items.length; k++) {
    const i = (at + k) % items.length;
    if (i !== at && isOpen(items[i])) return i;
  }
  return -1;
}
