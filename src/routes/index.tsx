import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { CheckCircle2, Lock, Mail, ShieldCheck, Sparkles, Star } from "lucide-react";
import { useEffect, useState } from "react";

import { Button, Field, Logo, inputClass } from "@/components/pm/app-shell";
import { Avatar, Bar, Chip } from "@/components/pm/primitives";
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — Flowspace Project Management" },
      {
        name: "description",
        content:
          "Sign in to Flowspace to plan projects, run sprint boards, track deadlines and balance your team's workload.",
      },
      { property: "og:title", content: "Sign in — Flowspace Project Management" },
      {
        property: "og:description",
        content: "The project workspace for teams that ship: boards, timelines, workload and reports.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { authed, signIn } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authed) navigate({ to: "/dashboard" });
  }, [authed, navigate]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.includes("@")) return setError("Enter a valid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    setTimeout(() => {
      signIn();
      setLoading(false);
      navigate({ to: "/dashboard" });
    }, 550);
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Marketing panel */}
      <section className="relative hidden overflow-hidden bg-primary px-12 py-14 text-primary-foreground lg:flex lg:flex-col">
        <div className="pointer-events-none absolute -top-32 -right-24 size-[420px] rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-16 size-[380px] rounded-full bg-accent/30 blur-3xl" />

        <div className="relative">
          <span className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-white/15">
              <Sparkles className="size-5" />
            </span>
            <span className="text-[17px] font-bold tracking-tight">Flowspace</span>
          </span>

          <h1 className="mt-14 max-w-lg text-[40px] leading-[1.1] font-extrabold tracking-tight">
            Every project, every deadline, one calm workspace.
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-primary-foreground/85">
            Plan sprints, run boards, watch capacity and keep clients informed — without the endless
            status meetings.
          </p>

          <ul className="mt-8 space-y-3">
            {[
              "Kanban boards, timelines and milestones in sync",
              "Live workload and capacity for every teammate",
              "Burndown, velocity and time reports out of the box",
            ].map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-primary-foreground/90">
                <CheckCircle2 className="size-4.5 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Product preview card */}
        <div className="relative mt-12 rounded-2xl bg-white/10 p-3 backdrop-blur">
          <div className="rounded-xl bg-card p-4 text-card-foreground shadow-[var(--shadow-pop)]">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Website Redesign</p>
              <Chip tone="success">On Track</Chip>
            </div>
            <Bar value={68} className="mt-3" />
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { l: "In Progress", v: "6" },
                { l: "In Review", v: "3" },
                { l: "Done", v: "24" },
              ].map((s) => (
                <div key={s.l} className="rounded-lg bg-muted px-3 py-2">
                  <p className="text-lg font-bold">{s.v}</p>
                  <p className="text-[11px] text-muted-foreground">{s.l}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex -space-x-2">
                {["Sophia Lee", "Ethan Carter", "Olivia Brown", "Noah Williams"].map((n) => (
                  <Avatar key={n} name={n} size="sm" ring />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Due Sep 28</p>
            </div>
          </div>
        </div>

        <div className="relative mt-auto flex items-center gap-6 pt-10 text-xs text-primary-foreground/80">
          <span className="flex items-center gap-1.5">
            <Star className="size-4 fill-current" /> 4.9/5 on G2
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-4" /> SOC 2 Type II
          </span>
          <span>Trusted by 12,000+ teams</span>
        </div>
      </section>

      {/* Form panel */}
      <section className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-[400px]">
          <div className="lg:hidden">
            <Logo />
          </div>

          <h2 className="mt-8 text-2xl font-bold tracking-tight lg:mt-0">Welcome back</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Sign in to your Flowspace workspace to continue.
          </p>

          <button className="mt-7 flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-input bg-card text-sm font-medium transition hover:bg-muted">
            <svg viewBox="0 0 24 24" className="size-4.5" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.4a5.5 5.5 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.6-5.2 3.6-8.8Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3a7.2 7.2 0 0 1-10.7-3.8H1.3v3.1A12 12 0 0 0 12 24Z"
              />
              <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.3a12 12 0 0 0 0 10.8l4-3.1Z" />
              <path
                fill="#EA4335"
                d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.5-3.5A12 12 0 0 0 1.3 6.6l4 3.1A7.2 7.2 0 0 1 12 4.8Z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              or sign in with email
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            <Field label="Work email">
              <span className="relative block">
                <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(inputClass, "h-11 pl-9")}
                  placeholder="you@company.com"
                  autoComplete="email"
                />
              </span>
            </Field>

            <Field label="Password">
              <span className="relative block">
                <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(inputClass, "h-11 pl-9")}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </span>
            </Field>

            {error && (
              <p role="alert" className="rounded-lg bg-danger-soft px-3 py-2 text-xs font-medium text-danger">
                {error}
              </p>
            )}

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="size-4 accent-[var(--color-primary)]"
                />
                Remember me
              </label>
              <button type="button" className="text-sm font-medium text-primary hover:underline">
                Forgot password?
              </button>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in to Flowspace"}
            </Button>
          </form>

          <p className="mt-5 rounded-lg bg-muted px-3 py-2.5 text-xs text-muted-foreground">
            Demo workspace — use <span className="font-semibold text-foreground">{DEMO_EMAIL}</span> /{" "}
            <span className="font-semibold text-foreground">{DEMO_PASSWORD}</span>
          </p>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New to Flowspace?{" "}
            <Link to="/" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
