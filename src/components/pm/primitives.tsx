import { cn } from "@/lib/utils";
import type { Priority, ProjectStatus, Status } from "@/lib/mock-data";
import type { ReactNode } from "react";

const AVATAR_TONES = [
  "bg-primary-soft text-primary",
  "bg-accent-soft text-accent",
  "bg-success-soft text-success",
  "bg-info-soft text-info",
  "bg-warning-soft text-warning",
  "bg-danger-soft text-danger",
];

function toneFor(seed: string) {
  let n = 0;
  for (const ch of seed) n += ch.charCodeAt(0);
  return AVATAR_TONES[n % AVATAR_TONES.length];
}

export function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export function Avatar({
  name,
  size = "md",
  className,
  ring,
}: {
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  ring?: boolean;
}) {
  const sizes = {
    xs: "size-6 text-[10px]",
    sm: "size-8 text-xs",
    md: "size-9 text-xs",
    lg: "size-11 text-sm",
    xl: "size-16 text-lg",
  };
  return (
    <span
      title={name}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold select-none",
        sizes[size],
        toneFor(name),
        ring && "ring-2 ring-card",
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}

export function AvatarStack({ names, max = 4 }: { names: string[]; max?: number }) {
  const shown = names.slice(0, max);
  const rest = names.length - shown.length;
  return (
    <div className="flex -space-x-2">
      {shown.map((n) => (
        <Avatar key={n} name={n} size="sm" ring />
      ))}
      {rest > 0 && (
        <span className="inline-flex size-8 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-muted-foreground ring-2 ring-card">
          +{rest}
        </span>
      )}
    </div>
  );
}

export function Chip({
  children,
  tone = "muted",
  className,
}: {
  children: ReactNode;
  tone?: "muted" | "primary" | "success" | "warning" | "danger" | "info" | "accent";
  className?: string;
}) {
  const tones: Record<string, string> = {
    muted: "bg-muted text-muted-foreground",
    primary: "bg-primary-soft text-primary",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
    danger: "bg-danger-soft text-danger",
    info: "bg-info-soft text-info",
    accent: "bg-accent-soft text-accent",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

const STATUS_TONE: Record<Status, "muted" | "info" | "primary" | "warning" | "danger" | "success"> = {
  Backlog: "muted",
  "To Do": "info",
  "In Progress": "primary",
  "In Review": "warning",
  Blocked: "danger",
  Completed: "success",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <Chip tone={STATUS_TONE[status]}>
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </Chip>
  );
}

const PROJECT_TONE: Record<ProjectStatus, "success" | "warning" | "danger" | "info"> = {
  "On Track": "success",
  "At Risk": "warning",
  Delayed: "danger",
  Completed: "info",
};

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <Chip tone={PROJECT_TONE[status]}>
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </Chip>
  );
}

const PRIORITY_TONE: Record<Priority, "muted" | "info" | "warning" | "danger"> = {
  Low: "muted",
  Medium: "info",
  High: "warning",
  Urgent: "danger",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <Chip tone={PRIORITY_TONE[priority]}>{priority}</Chip>;
}

export function Bar({
  value,
  tone = "primary",
  className,
}: {
  value: number;
  tone?: "primary" | "success" | "warning" | "danger" | "accent";
  className?: string;
}) {
  const tones: Record<string, string> = {
    primary: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
    accent: "bg-accent",
  };
  return (
    <div
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn("h-full rounded-full transition-all duration-500", tones[tone])}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
  className,
  bodyClassName,
  subtitle,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("surface flex flex-col", className)}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div className="min-w-0">
            {title && <h2 className="truncate text-sm font-semibold">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border px-6 py-10 text-center">
      <p className="text-sm font-medium">{title}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
