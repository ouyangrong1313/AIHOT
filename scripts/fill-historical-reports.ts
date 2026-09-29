// Fills in daily / weekly / monthly editions for a past range from archived ("backfill") material.
//
// Why this exists: a field archived on discovery is deliberately excluded from the scheduled edition
// ("旧文不刷屏"), so a site whose sources were all added at once shows empty report pages even though
// the items themselves carry their real publication dates. This script rebuilds those editions by
// placing each archived item on the day it is actually about, which is a faithful historical record
// rather than presenting old news as today's.
//
// It never touches today or the future, and it only writes issues that have at least `--min` items.
// Receipts make repeat runs free; existing issues are overwritten and revisioned.
//
// Usage:
//   node --env-file=.env scripts/fill-historical-reports.ts [--days 60] [--min 1] [--dry-run] [--kind daily|weekly|monthly|all]
import { parseArgs } from "node:util";
import { closeDb, sql } from "@aihot/backend/db";
import { stopBoss } from "@aihot/backend/jobs/queue";
import { candidates, composeDaily, composeMonthly, composeWeekly } from "@aihot/backend/reports/compose";
import { addDays, beijingDate, beijingMidnight, isoWeekLabel } from "@aihot/contracts/time";

const { values } = parseArgs({
  options: {
    days: { type: "string", default: "60" },
    min: { type: "string", default: "1" },
    kind: { type: "string", default: "all" },
    "dry-run": { type: "boolean", default: false },
  },
});

const days = Number(values.days);
const min = Number(values.min);
const kind = String(values.kind);
const dryRun = Boolean(values["dry-run"]);
const today = beijingDate(Date.now());

/** How many archived items fall in a window — the same rule compose uses, without writing anything. */
async function countIn(start: Date, end: Date): Promise<number> {
  return (await candidates(start, end, true)).length;
}

const planned: string[] = [];

if (kind === "all" || kind === "daily") {
  for (let i = days; i >= 1; i--) {
    const date = addDays(today, -i);                      // never today
    const end = new Date(beijingMidnight(date).getTime() + 8 * 3600 * 1000);
    const start = new Date(end.getTime() - 86400000);
    const n = await countIn(start, end);
    if (n >= min) planned.push(`daily ${date} (${n})`);
  }
}

if (kind === "all" || kind === "weekly") {
  // Only complete weeks.
  for (let w = 1; w <= Math.ceil(days / 7); w++) {
    const label = isoWeekLabel(addDays(today, -7 * w));
    const [s0, e0] = isoWeekRangeSafe(label);
    const n = s0 && e0 ? await countIn(beijingMidnight(s0), new Date(beijingMidnight(addDays(e0, 1)).getTime())) : 0;
    if (n >= min) planned.push(`weekly ${label} (${n})`);
  }
}

if (kind === "all" || kind === "monthly") {
  const [ty, tm] = today.split("-").map(Number) as [number, number];
  for (let k = 1; k <= Math.ceil(days / 30); k++) {
    const d = new Date(Date.UTC(ty, tm - 1 - k, 1));
    const label = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    const start = `${label}-01`;
    const nxt = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1));
    const end = `${nxt.getUTCFullYear()}-${String(nxt.getUTCMonth() + 1).padStart(2, "0")}-01`;
    const n = await countIn(beijingMidnight(start), beijingMidnight(end));
    if (n >= min) planned.push(`monthly ${label} (${n})`);
  }
}

if (planned.length === 0) {
  console.log(`没有可补的期刊（近 ${days} 天内没有达到 ${min} 条的窗口）。`);
} else {
  console.log(`计划补 ${planned.length} 期：`);
  for (const p of planned) console.log(`  ${p}`);
}

if (!dryRun) {
  for (const entry of planned) {
    const [k, key] = entry.split(" ") as [string, string];
    const res = k === "daily" ? await composeDaily(key, "backfill-fill", true)
      : k === "weekly" ? await composeWeekly(key, "backfill-fill", true)
      : await composeMonthly(key, "backfill-fill", true);
    console.log(`  ✓ ${k} ${key} → ${res.entries} 条`);
  }
}

/** Local ISO-week range; kept here so the script does not depend on the web layer. */
function isoWeekRangeSafe(key: string): [string, string] | [null, null] {
  const m = /^(\d{4})-W(\d{2})$/.exec(key);
  if (!m) return [null, null];
  const [y, w] = [Number(m[1]), Number(m[2])];
  const jan4 = new Date(Date.UTC(y, 0, 4));
  const monday = new Date(jan4.getTime() - ((jan4.getUTCDay() + 6) % 7) * 86400000 + (w - 1) * 7 * 86400000);
  const ymd = (d: Date) => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
  return [ymd(monday), ymd(new Date(monday.getTime() + 6 * 86400000))];
}

await stopBoss();
await closeDb();
