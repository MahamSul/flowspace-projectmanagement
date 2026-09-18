import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell, Button, PageHeader } from "@/components/pm/app-shell";
import { Chip, EmptyState, Panel } from "@/components/pm/primitives";
import type { CalendarEvent } from "@/lib/mock-data";
import { TODAY, formatDate, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — Flowspace" },
      {
        name: "description",
        content:
          "Flowspace calendar with project deadlines, milestones, releases and team meetings in a monthly view.",
      },
      { property: "og:title", content: "Calendar — Flowspace" },
      {
        property: "og:description",
        content: "Deadlines, milestones, releases and meetings in one monthly view.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CalendarPage,
});

const TYPE_TONE: Record<CalendarEvent["type"], "danger" | "accent" | "info" | "success"> = {
  Deadline: "danger",
  Milestone: "accent",
  Meeting: "info",
  Release: "success",
};

const DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

function CalendarPage() {
  const { events, project, tasks } = useStore();
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState(iso(TODAY));

  const view = useMemo(() => {
    const d = new Date(Date.UTC(TODAY.getUTCFullYear(), TODAY.getUTCMonth() + offset, 1));
    return d;
  }, [offset]);

  const allEvents = useMemo<CalendarEvent[]>(
    () => [
      ...events,
      ...tasks.map((t) => ({
        id: `task-${t.id}`,
        title: t.title,
        date: t.due,
        type: "Deadline" as const,
        projectId: t.projectId,
      })),
    ],
    [events, tasks],
  );

  const cells = useMemo(() => {
    const first = new Date(view);
    const shift = (first.getUTCDay() + 6) % 7;
    const startGrid = new Date(first);
    startGrid.setUTCDate(1 - shift);
    return Array.from({ length: 42 }, (_, i) => {
      const day = new Date(startGrid);
      day.setUTCDate(startGrid.getUTCDate() + i);
      return day;
    });
  }, [view]);

  const byDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of allEvents) {
      const arr = map.get(e.date) ?? [];
      arr.push(e);
      map.set(e.date, arr);
    }
    return map;
  }, [allEvents]);

  const dayEvents = byDate.get(selected) ?? [];
  const upcoming = allEvents
    .filter((e) => e.date >= iso(TODAY))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 8);

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Calendar"
          subtitle="Deadlines, milestones, releases and meetings across every project."
          actions={
            <>
              <Button variant="outline" size="sm">
                <CalendarDays className="size-4" /> Month
              </Button>
              <Button size="sm">
                <Plus className="size-4" /> New event
              </Button>
            </>
          }
        />

        <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
          <Panel
            title={view.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
              timeZone: "UTC",
            })}
            action={
              <div className="flex items-center gap-1">
                <button
                  aria-label="Previous month"
                  onClick={() => setOffset((o) => o - 1)}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  onClick={() => setOffset(0)}
                  className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  Today
                </button>
                <button
                  aria-label="Next month"
                  onClick={() => setOffset((o) => o + 1)}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            }
            bodyClassName="p-0"
          >
            <div className="grid grid-cols-7 border-b border-border">
              {DOW.map((d) => (
                <div
                  key={d}
                  className="px-2 py-2 text-center text-[11px] font-semibold tracking-wide text-muted-foreground uppercase"
                >
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {cells.map((day) => {
                const key = iso(day);
                const inMonth = day.getUTCMonth() === view.getUTCMonth();
                const list = byDate.get(key) ?? [];
                const isToday = key === iso(TODAY);
                return (
                  <button
                    key={key}
                    onClick={() => setSelected(key)}
                    className={cn(
                      "min-h-[92px] border-r border-b border-border p-2 text-left align-top transition-colors last:border-r-0 hover:bg-muted/50",
                      !inMonth && "bg-muted/30 text-muted-foreground",
                      selected === key && "bg-primary-soft/60",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-grid size-6 place-items-center rounded-full text-xs font-semibold",
                        isToday && "bg-primary text-primary-foreground",
                      )}
                    >
                      {day.getUTCDate()}
                    </span>
                    <span className="mt-1 block space-y-1">
                      {list.slice(0, 2).map((e) => (
                        <span
                          key={e.id}
                          className={cn(
                            "block truncate rounded px-1.5 py-0.5 text-[10px] font-medium",
                            e.type === "Deadline" && "bg-danger-soft text-danger",
                            e.type === "Milestone" && "bg-accent-soft text-accent",
                            e.type === "Meeting" && "bg-info-soft text-info",
                            e.type === "Release" && "bg-success-soft text-success",
                          )}
                        >
                          {e.title}
                        </span>
                      ))}
                      {list.length > 2 && (
                        <span className="block text-[10px] text-muted-foreground">
                          +{list.length - 2} more
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </Panel>

          <div className="space-y-5">
            <Panel title={formatDate(selected)} subtitle={`${dayEvents.length} scheduled items`}>
              {dayEvents.length === 0 ? (
                <EmptyState title="Nothing scheduled" hint="Pick another day or add an event." />
              ) : (
                <ul className="space-y-3">
                  {dayEvents.map((e) => (
                    <li key={e.id} className="rounded-lg border border-border p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium">{e.title}</p>
                        <Chip tone={TYPE_TONE[e.type]}>{e.type}</Chip>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {project(e.projectId)?.name}
                        {e.time ? ` · ${e.time}` : ""}
                      </p>
                      {e.notes && <p className="mt-2 text-xs text-muted-foreground">{e.notes}</p>}
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <Panel title="Upcoming">
              <ul className="space-y-3">
                {upcoming.map((e) => (
                  <li key={e.id} className="flex items-start gap-3">
                    <span className="grid w-10 shrink-0 place-items-center rounded-lg bg-muted py-1 text-[11px] font-semibold">
                      {new Date(`${e.date}T00:00:00Z`).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        timeZone: "UTC",
                      })}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{e.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {project(e.projectId)?.name}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
