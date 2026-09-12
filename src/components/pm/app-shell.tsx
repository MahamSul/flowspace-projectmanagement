import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Activity as ActivityIcon,
  BarChart3,
  Bell,
  CalendarDays,
  ChevronDown,
  FolderKanban,
  Gauge,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  SquareCheckBig,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { notifications } from "@/lib/mock-data";
import { Avatar } from "./primitives";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tasks", label: "My Tasks", icon: SquareCheckBig },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/team", label: "Team", icon: Users },
  { to: "/workload", label: "Workload", icon: Gauge },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/activity", label: "Activity", icon: ActivityIcon },
] as const;

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[0_6px_16px_-6px_var(--color-primary)]">
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
          <path
            d="M5 7.5A2.5 2.5 0 0 1 7.5 5h9A2.5 2.5 0 0 1 19 7.5v0A2.5 2.5 0 0 1 16.5 10h-9A2.5 2.5 0 0 1 5 7.5Zm0 9A2.5 2.5 0 0 1 7.5 14H12a2.5 2.5 0 0 1 0 5H7.5A2.5 2.5 0 0 1 5 16.5Z"
            fill="currentColor"
          />
        </svg>
      </span>
      {!compact && (
        <span className="text-[17px] font-bold tracking-tight">
          Flow<span className="text-primary">space</span>
        </span>
      )}
    </span>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost" | "soft" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
}) {
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
    outline: "border border-input bg-card text-foreground hover:bg-muted",
    ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
    soft: "bg-primary-soft text-primary hover:bg-primary-soft/70",
    danger: "bg-danger text-white hover:bg-danger/90",
  };
  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-9.5 px-4 text-sm",
    lg: "h-11 px-5 text-sm",
    icon: "size-9.5",
  };
  return (
    <button
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-muted-foreground">{hint}</span>}
    </label>
  );
}

export const inputClass =
  "h-9.5 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { projects, me, signOut } = useStore();
  const navigate = useNavigate();
  const pinned = projects.slice(0, 4);

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex h-16 items-center px-5">
        <Link to="/dashboard" onClick={onNavigate} className="outline-none">
          <Logo />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4 scrollbar-thin">
        <p className="px-2 pt-2 pb-2 text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          Workspace
        </p>
        <ul className="space-y-0.5">
          {NAV.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                onClick={onNavigate}
                className="group flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent data-[status=active]:bg-sidebar-accent data-[status=active]:text-sidebar-accent-foreground"
              >
                <item.icon className="size-4.5 shrink-0 opacity-80" />
                <span className="truncate">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="px-2 pt-5 pb-2 text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          Pinned projects
        </p>
        <ul className="space-y-0.5">
          {pinned.map((p) => (
            <li key={p.id}>
              <Link
                to="/projects/$projectId"
                params={{ projectId: p.id }}
                onClick={onNavigate}
                className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent data-[status=active]:bg-sidebar-accent data-[status=active]:text-sidebar-accent-foreground"
              >
                <span
                  className={cn(
                    "size-2 shrink-0 rounded-full",
                    p.status === "On Track" && "bg-success",
                    p.status === "At Risk" && "bg-warning",
                    p.status === "Delayed" && "bg-danger",
                    p.status === "Completed" && "bg-info",
                  )}
                />
                <span className="truncate">{p.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-xl bg-primary p-4 text-primary-foreground">
          <p className="text-sm font-semibold">Flowspace Pro</p>
          <p className="mt-1 text-xs opacity-85">
            Unlock timeline dependencies, custom fields and unlimited reports.
          </p>
          <button className="mt-3 h-8 w-full rounded-lg bg-white/15 text-xs font-semibold backdrop-blur transition hover:bg-white/25">
            Upgrade plan
          </button>
        </div>
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <Avatar name={me.name} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{me.name}</p>
            <p className="truncate text-[11px] text-muted-foreground">{me.role}</p>
          </div>
          <button
            aria-label="Sign out"
            onClick={() => {
              signOut();
              navigate({ to: "/" });
            }}
            className="rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Topbar({ onMenu }: { onMenu: () => void }) {
  const { me } = useStore();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/85 px-4 backdrop-blur lg:px-8">
      <button
        onClick={onMenu}
        aria-label="Open navigation"
        className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
      >
        <Menu className="size-5" />
      </button>

      <div className="relative hidden max-w-md flex-1 sm:block">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          className={cn(inputClass, "bg-muted/60 pl-9")}
          placeholder="Search projects, tasks or people…"
          aria-label="Search"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Link to="/tasks">
          <Button size="sm" className="hidden sm:inline-flex">
            <Plus className="size-4" /> New task
          </Button>
        </Link>
        <div className="relative">
          <button
            aria-label="Notifications"
            onClick={() => setOpen((v) => !v)}
            className="relative rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <Bell className="size-5" />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-accent ring-2 ring-card" />
          </button>
          {open && (
            <div className="surface absolute right-0 mt-2 w-80 p-0 shadow-[var(--shadow-pop)]">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <p className="text-sm font-semibold">Notifications</p>
                <button onClick={() => setOpen(false)} aria-label="Close">
                  <X className="size-4 text-muted-foreground" />
                </button>
              </div>
              <ul className="divide-y divide-border">
                {notifications.map((n) => (
                  <li key={n.id} className="px-4 py-3">
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.body}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground/80">{n.at}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <Link
          to="/settings"
          className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          aria-label="Settings"
        >
          <Settings className="size-5" />
        </Link>
        <div className="ml-1 flex items-center gap-2">
          <Avatar name={me.name} size="sm" />
          <ChevronDown className="hidden size-4 text-muted-foreground sm:block" />
        </div>
      </div>
    </header>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { authed } = useStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!authed) navigate({ to: "/" });
  }, [authed, navigate]);

  if (!authed) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-6 text-center">
        <div>
          <p className="text-sm font-medium">Redirecting to sign in…</p>
          <Link to="/" className="mt-2 inline-block text-sm text-primary underline">
            Go to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[264px] border-r border-sidebar-border lg:block">
        <Sidebar />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-[280px] border-r border-sidebar-border shadow-[var(--shadow-pop)]">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-[264px]">
        <Topbar onMenu={() => setMobileOpen(true)} />
        <main className="mx-auto w-full max-w-[1480px] px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
