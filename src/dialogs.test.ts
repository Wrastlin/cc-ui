import { test } from "node:test";
import assert from "node:assert/strict";
import { choiceDialog, confirmDialog, resolveDialog } from "./dialogs.ts";

test("a choice tells its second action apart from a dismiss (app-cal-fix-1)", async () => {
  const ask = () => choiceDialog({ title: "Keep both?", altLabel: "Open job" });
  let p = ask(); resolveDialog(true); assert.equal(await p, "confirm");
  p = ask(); resolveDialog("alt"); assert.equal(await p, "alt");
  p = ask(); resolveDialog(false); assert.equal(await p, null);
});

test("a confirm stays a yes or no", async () => {
  const p = confirmDialog({ title: "Delete this pin?" }); resolveDialog("alt");
  assert.equal(await p, false);
});
