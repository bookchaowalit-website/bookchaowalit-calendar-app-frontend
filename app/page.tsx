"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

function Shell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Local mini-app · state in this browser
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">{subtitle}</p>
        </header>
        {children}
        <footer className="mt-10 border-t border-zinc-200 pt-4 text-xs text-zinc-500 dark:border-zinc-800">
          Data is stored in localStorage on this origin only. Portfolio demo — not a multi-user product.
        </footer>
      </div>
    </div>
  );
}

function Button({
  children,
  onClick,
  variant = "primary",
  disabled,
  type = "button",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition disabled:opacity-50 " +
    className;
  const styles =
    variant === "primary"
      ? "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
      : variant === "secondary"
        ? "bg-white text-zinc-900 ring-1 ring-zinc-200 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-100 dark:ring-zinc-700"
        : variant === "danger"
          ? "bg-red-600 text-white hover:bg-red-500"
          : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900";
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}

const inputClass =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950";

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw != null) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, [key]);
  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value, ready]);
  return [value, setValue, ready] as const;
}

function uid() {
  return crypto.randomUUID();
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type CalEvent = { id: string; date: string; title: string; notes: string };

function ymd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function monthMatrix(year: number, month: number) {
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(1 - first.getDay());
  const cells: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    cells.push(d);
  }
  return cells;
}

export default function Home() {
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(ymd(today));
  const [events, setEvents] = useLocalStorage<CalEvent[]>("calendar-app-events-v1", [
    { id: "demo", date: ymd(today), title: "Portfolio demo event", notes: "Click days to add more." },
  ]);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");

  const cells = useMemo(
    () => monthMatrix(cursor.getFullYear(), cursor.getMonth()),
    [cursor]
  );
  const dayEvents = events.filter((e) => e.date === selected);

  const addEvent = () => {
    if (!title.trim()) return;
    setEvents((prev) => [...prev, { id: uid(), date: selected, title: title.trim(), notes: notes.trim() }]);
    setTitle("");
    setNotes("");
  };

  return (
    <Shell title="Calendar App" subtitle="Plan days with a simple month grid. Events stay on this device.">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}>
            ← Prev
          </Button>
          <h2 className="min-w-[10rem] text-center text-lg font-medium">
            {cursor.toLocaleString(undefined, { month: "long", year: "numeric" })}
          </h2>
          <Button variant="secondary" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}>
            Next →
          </Button>
        </div>
        <Button
          variant="ghost"
          onClick={() => {
            const t = new Date();
            setCursor(new Date(t.getFullYear(), t.getMonth(), 1));
            setSelected(ymd(t));
          }}
        >
          Today
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-medium text-zinc-500">
            {WEEKDAYS.map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((d) => {
              const key = ymd(d);
              const inMonth = d.getMonth() === cursor.getMonth();
              const count = events.filter((e) => e.date === key).length;
              const isSelected = key === selected;
              const isToday = key === ymd(today);
              return (
                <button
                  key={key + d.getMonth()}
                  type="button"
                  onClick={() => setSelected(key)}
                  className={`min-h-[4.25rem] rounded-lg border p-1 text-left text-sm transition ${
                    isSelected
                      ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                      : "border-transparent hover:border-zinc-200 hover:bg-zinc-50 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
                  } ${inMonth ? "" : "opacity-40"}`}
                >
                  <div className={`font-medium ${isToday && !isSelected ? "text-blue-600 dark:text-blue-400" : ""}`}>
                    {d.getDate()}
                  </div>
                  {count > 0 ? (
                    <div className={`mt-1 text-[10px] ${isSelected ? "text-zinc-200" : "text-zinc-500"}`}>
                      {count} event{count > 1 ? "s" : ""}
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <h3 className="font-medium">Events on {selected}</h3>
            <ul className="mt-3 space-y-2">
              {dayEvents.length === 0 ? (
                <li className="text-sm text-zinc-500">No events yet.</li>
              ) : (
                dayEvents.map((e) => (
                  <li key={e.id} className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-medium">{e.title}</div>
                        {e.notes ? <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{e.notes}</p> : null}
                      </div>
                      <Button
                        variant="ghost"
                        onClick={() => setEvents((prev) => prev.filter((x) => x.id !== e.id))}
                      >
                        Delete
                      </Button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <h3 className="mb-3 font-medium">Add event</h3>
            <div className="space-y-2">
              <input className={inputClass} placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
              <textarea
                className={`${inputClass} min-h-[80px]`}
                placeholder="Notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <Button onClick={addEvent}>Save event</Button>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
