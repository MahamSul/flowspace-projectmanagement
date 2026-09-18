import { createFileRoute } from "@tanstack/react-router";
import { Download, Gauge, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell, Button, inputClass, PageHeader } from "@/components/pm/app-shell";
import { Avatar, Bar, Chip, EmptyState, Panel } from "@/components/pm/primitives";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/workload")({
  head: () => ({
    meta: [
      { title: "Team Workload — Flowspace" },
      {
        name: "description",
        content:
          "Balance team capacity in Flowspace: weekly allocation per member, overloaded teammates and available hours.",
      },
      { property: "og:title", content: "Team Workload — Flowspace" },
      {
        property: "og:description",
        content: "Weekly capacity, allocation and availability for every teammate.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorkloadPage,
});

const WEEKS = ["Sep 7–13", "Sep 14–20", "Sep 21–27", "Sep 28–Oct 4"];
const PER_PAGE = 6;

function label(w: number) {
  if (w > 100) return { text: "Overloaded", tone: "danger" as const };
  if (w > 85) return { text: "At capacity", tone: "warning" as const };
  if (w < 50) return { text: "Available", tone: "accent" as const };
  return { text: "Balanced", tone: "success" as const };
}

function tone(w: number): "danger" | "warning" | "accent" | "success" {
  return label(w).tone;
}

function WorkloadPage() {
  const { members, tasks } = useStore();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);

  const rows = useMemo(
    () =>
      members
        .map((m) => {
          const open = tasks.filter((t) => t.assigneeId === m.id && t.status !== "Completed");
          const hours = open.reduce((s, t) => s + (t.estimate - t.logged), 0);
          const weekly = WEEKS.map((_, i) =>
            Math.max(
              10,
              Math.min(135, Math.round(m.workload + ((i * 7 + m.id.length * 11) % 26) - 13)),
            ),
          );
          return { ...m, open: open.length, hours, weekly };
        })
        .filter(
          (r) =>
            r.name.toLowerCase().includes(q.toLowerCase()) &&
            (status === "All" || label(r.workload).text === status),
        ),
    [members, tasks, q, status],
  );

  const pages = Math.max(1, Math.ceil(rows.length / PER_PAGE));
  const current = Math.min(page, pages);
  const shown = rows.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const overloaded = members.filter((m) => m.workload > 100).length;
  const available = members.filter((m) => m.workload < 50).length;
  const avg = Math.round(members.reduce((s, m) => s + m.workload, 0) / members.length);
  const capacity = members.length * 40;
  const allocated = Math.round((capacity * avg) / 100);

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Team Workload"
          subtitle="Spot overloaded teammates and redistribute work before deadlines slip."
          actions={
            <>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="size-4" /> Capacity settings
              </Button>
              <Button size="sm">
                <Download className="size-4" /> Export report
              </Button>
            </>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Average utilisation", `${avg}%`, "Across the whole team", "primary"],
            ["Overloaded members", `${overloaded}`, "Above 100% capacity", "danger"],
            ["Available capacity", `${available}`, "Below 50% allocated", "success"],
            ["Allocated hours", `${allocated}h`, `of ${capacity}h this week`, "warning"],
          ].map(([l, v, hint, t]) => (
            <div key={l} className="surface p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{l}</p>
                  <p className="mt-2 text-3xl font-bold tracking-tight">{v}</p>
                </div>
                <span
                  className={cn(
                    "grid size-10 place-items-center rounded-xl",
                    t === "primary" && "bg-primary-soft text-primary",
                    t === "danger" && "bg-danger-soft text-danger",
                    t === "success" && "bg-success-soft text-success",
                    t === "warning" && "bg-warning-soft text-warning",
                  )}
                >
                  <Gauge className="size-5" />
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
            </div>
          ))}
        </div>

        <div className="surface flex flex-wrap items-center gap-3 p-4">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Search team member…"
              aria-label="Search team member"
              className={cn(inputClass, "pl-9")}
            />
          </div>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by workload status"
            className={cn(inputClass, "w-auto")}
          >
            {["All", "Overloaded", "At capacity", "Balanced", "Available"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <Panel
          title="Capacity by week"
          subtitle="Allocated percentage of a 40 hour work week"
          bodyClassName="p-0"
        >
          {shown.length === 0 ? (
            <div className="p-5">
              <EmptyState title="No members match these filters" />
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full min-w-[900px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="px-5 py-3 font-medium">Member</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Open tasks</th>
                    <th className="px-5 py-3 font-medium">Remaining</th>
                    {WEEKS.map((w) => (
                      <th key={w} className="px-3 py-3 text-center font-medium">
                        {w}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {shown.map((r) => (
                    <tr key={r.id} className="hover:bg-muted/40">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={r.name} size="sm" />
                          <div className="min-w-0">
                            <p className="truncate font-medium">{r.name}</p>
                            <p className="truncate text-xs text-muted-foreground">{r.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <Chip tone={label(r.workload).tone}>{label(r.workload).text}</Chip>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{r.open}</td>
                      <td className="px-5 py-3 text-muted-foreground">{r.hours}h</td>
                      {r.weekly.map((w, i) => (
                        <td key={i} className="px-3 py-3">
                          <div className="flex flex-col items-center gap-1">
                            <Bar value={Math.min(100, w)} tone={tone(w)} className="w-20" />
                            <span
                              className={cn(
                                "text-[11px] font-medium",
                                w > 100 ? "text-danger" : "text-muted-foreground",
                              )}
                            >
                              {w}%
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3.5">
            <p className="text-xs text-muted-foreground">
              Showing {shown.length} of {rows.length} members
            </p>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={current === 1}
              >
                Previous
              </Button>
              {Array.from({ length: pages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={cn(
                    "size-8 rounded-lg text-xs font-medium transition",
                    current === i + 1
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {i + 1}
                </button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={current === pages}
              >
                Next
              </Button>
            </div>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
