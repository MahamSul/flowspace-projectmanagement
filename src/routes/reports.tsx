import { createFileRoute } from "@tanstack/react-router";
import { Download, TrendingUp } from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar as RBar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AppShell, Button, inputClass, PageHeader } from "@/components/pm/app-shell";
import { Avatar, Bar, Chip, Panel } from "@/components/pm/primitives";
import { burndown, completionTrend, timeByProject, velocity } from "@/lib/mock-data";
import { projectProgress, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports & Analytics — Flowspace" },
      {
        name: "description",
        content:
          "Flowspace analytics: sprint burndown, velocity, completion rates per teammate, project health and time tracking.",
      },
      { property: "og:title", content: "Reports & Analytics — Flowspace" },
      {
        property: "og:description",
        content: "Burndown, velocity, completion rates and time tracking across projects.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReportsPage,
});

const AXIS = {
  stroke: "var(--color-border)",
  tick: { fill: "var(--color-muted-foreground)", fontSize: 11 },
};

const TOOLTIP = {
  contentStyle: {
    background: "var(--color-card)",
    border: "1px solid var(--color-border)",
    borderRadius: 12,
    fontSize: 12,
    boxShadow: "var(--shadow-pop)",
  },
};

function ReportsPage() {
  const { tasks, projects, members, member } = useStore();
  const [range, setRange] = useState("Last 30 days");

  const completed = tasks.filter((t) => t.status === "Completed").length;
  const logged = tasks.reduce((s, t) => s + t.logged, 0);
  const onTime = Math.round((completed / Math.max(1, tasks.length)) * 100);

  const perMember = members
    .map((m) => {
      const mine = tasks.filter((t) => t.assigneeId === m.id);
      const done = mine.filter((t) => t.status === "Completed").length;
      return {
        id: m.id,
        name: m.name,
        role: m.role,
        total: mine.length,
        done,
        rate: mine.length ? Math.round((done / mine.length) * 100) : 0,
      };
    })
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 6);

  const statusMix = (["On Track", "At Risk", "Delayed", "Completed"] as const).map((s) => ({
    name: s,
    value: projects.filter((p) => p.status === s).length,
    color:
      s === "On Track"
        ? "var(--color-success)"
        : s === "At Risk"
          ? "var(--color-warning)"
          : s === "Delayed"
            ? "var(--color-danger)"
            : "var(--color-info)",
  }));

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Reports & Analytics"
          subtitle="Delivery health, velocity and time tracking across the workspace."
          actions={
            <>
              <select
                value={range}
                onChange={(e) => setRange(e.target.value)}
                aria-label="Report range"
                className={cn(inputClass, "w-auto")}
              >
                {["Last 7 days", "Last 30 days", "This quarter", "This year"].map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
              <Button size="sm">
                <Download className="size-4" /> Export PDF
              </Button>
            </>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Tasks completed", `${completed}`, `${onTime}% of all tasks`],
            ["Hours logged", `${logged}h`, "Tracked across projects"],
            ["Active projects", `${projects.filter((p) => p.status !== "Completed").length}`, "In delivery"],
            ["Avg velocity", `${Math.round(velocity.reduce((s, v) => s + v.points, 0) / velocity.length)} pts`, "Per sprint"],
          ].map(([l, v, hint]) => (
            <div key={l} className="surface p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{l}</p>
                  <p className="mt-2 text-3xl font-bold tracking-tight">{v}</p>
                </div>
                <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
                  <TrendingUp className="size-5" />
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          <Panel
            title="Sprint burndown"
            subtitle="Remaining work versus the ideal trend"
            className="xl:col-span-2"
          >
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={burndown} margin={{ top: 6, right: 8, bottom: 0, left: -18 }}>
                  <defs>
                    <linearGradient id="bdActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="day" {...AXIS} />
                  <YAxis {...AXIS} />
                  <Tooltip {...TOOLTIP} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    name="Actual"
                    stroke="var(--color-primary)"
                    strokeWidth={2.5}
                    fill="url(#bdActual)"
                  />
                  <Line
                    type="monotone"
                    dataKey="ideal"
                    name="Ideal"
                    stroke="var(--color-muted-foreground)"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Project status" subtitle="Health across all projects">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusMix}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={54}
                    outerRadius={84}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {statusMix.map((s) => (
                      <Cell key={s.name} fill={s.color} />
                    ))}
                  </Pie>
                  <Tooltip {...TOOLTIP} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-3 space-y-2">
              {statusMix.map((s) => (
                <li key={s.name} className="flex items-center gap-2 text-sm">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ background: s.color }}
                    aria-hidden="true"
                  />
                  <span className="flex-1 text-muted-foreground">{s.name}</span>
                  <span className="font-semibold">{s.value}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <Panel title="Team velocity" subtitle="Story points delivered per sprint">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={velocity} margin={{ top: 6, right: 8, bottom: 0, left: -18 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="sprint" {...AXIS} />
                  <YAxis {...AXIS} />
                  <Tooltip {...TOOLTIP} />
                  <RBar dataKey="points" name="Points" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Created vs completed" subtitle="Weekly task throughput">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={completionTrend} margin={{ top: 6, right: 8, bottom: 0, left: -18 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="week" {...AXIS} />
                  <YAxis {...AXIS} />
                  <Tooltip {...TOOLTIP} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line
                    type="monotone"
                    dataKey="created"
                    name="Created"
                    stroke="var(--color-accent)"
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    name="Completed"
                    stroke="var(--color-success)"
                    strokeWidth={2.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <Panel title="Completion rate by member" subtitle="Top performers this period">
            <ul className="space-y-4">
              {perMember.map((m) => (
                <li key={m.id} className="flex items-center gap-3">
                  <Avatar name={m.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium">{m.name}</p>
                      <span className="text-xs font-semibold">{m.rate}%</span>
                    </div>
                    <Bar
                      value={m.rate}
                      tone={m.rate >= 70 ? "success" : m.rate >= 40 ? "primary" : "warning"}
                      className="mt-1.5"
                    />
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {m.done} of {m.total} tasks completed · {m.role}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Time tracked by project" subtitle="Hours logged this month">
            <ul className="space-y-4">
              {timeByProject.map((p) => (
                <li key={p.name}>
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="truncate font-medium">{p.name}</span>
                    <span className="text-muted-foreground">{p.hours}h</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${p.pct}%`, background: p.color }}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-5 rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Total tracked</p>
              <p className="mt-1 text-2xl font-bold">
                {timeByProject.reduce((s, p) => s + p.hours, 0).toFixed(2)}h
              </p>
            </div>
          </Panel>
        </div>

        <Panel title="Project health" subtitle="Progress and budget consumption" bodyClassName="p-0">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Project</th>
                  <th className="px-5 py-3 font-medium">Manager</th>
                  <th className="px-5 py-3 font-medium">Progress</th>
                  <th className="px-5 py-3 font-medium">Budget used</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {projects.map((p) => {
                  const prog = projectProgress(tasks, p.id);
                  const spent = Math.round((p.spent / p.budget) * 100);
                  return (
                    <tr key={p.id} className="hover:bg-muted/40">
                      <td className="px-5 py-3 font-medium">{p.name}</td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {member(p.managerId).name}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <Bar value={prog} className="w-24" />
                          <span className="text-xs">{prog}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <Bar
                            value={spent}
                            tone={spent > 85 ? "danger" : "success"}
                            className="w-24"
                          />
                          <span className="text-xs">{spent}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <Chip
                          tone={
                            p.status === "On Track"
                              ? "success"
                              : p.status === "At Risk"
                                ? "warning"
                                : p.status === "Delayed"
                                  ? "danger"
                                  : "info"
                          }
                        >
                          {p.status}
                        </Chip>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
