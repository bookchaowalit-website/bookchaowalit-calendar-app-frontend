"use client";

import { useEffect, useMemo, useState } from "react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
type CalEvent = { id: string; date: string; title: string; notes: string };
function ymd(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
function monthMatrix(year: number, month: number) { const first = new Date(year, month, 1); const start = new Date(first); start.setDate(1 - first.getDay()); return Array.from({ length: 42 }, (_, index) => { const day = new Date(start); day.setDate(start.getDate() + index); return day; }); }
function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = localStorage.getItem(key);
        if (saved) setValue(JSON.parse(saved) as T);
      } catch { /* keep the local default */ }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [key]);
  useEffect(() => { if (ready) localStorage.setItem(key, JSON.stringify(value)); }, [key, value, ready]);
  return [value, setValue] as const;
}

export default function Home() {
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(ymd(today));
  const [events, setEvents] = useLocalStorage<CalEvent[]>("calendar-app-events-v1", [{ id: "demo", date: ymd(today), title: "Portfolio demo event", notes: "Click a day to add more." }]);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const cells = useMemo(() => monthMatrix(cursor.getFullYear(), cursor.getMonth()), [cursor]);
  const dayEvents = events.filter((event) => event.date === selected);
  const selectedDate = new Date(`${selected}T12:00:00`);
  const addEvent = () => { if (!title.trim()) return; setEvents((current) => [...current, { id: crypto.randomUUID(), date: selected, title: title.trim(), notes: notes.trim() }]); setTitle(""); setNotes(""); };
  const moveMonth = (delta: number) => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1));
  const goToday = () => { setCursor(new Date(today.getFullYear(), today.getMonth(), 1)); setSelected(ymd(today)); };
  return <div className="station"><main className="station-shell">
    <header className="station-header"><div><div className="station-code">CALENDAR / LOCAL LINE</div><h1>Make room for the days that matter.</h1><p className="station-intro">A single-month planning board for events that belong to your own rhythm. Nothing leaves this browser.</p></div><div className="station-status">LOCAL / BROWSER ONLY</div></header>
    <section className="board-layout" aria-label="Calendar workspace">
      <div className="calendar-board"><div className="board-toolbar"><h2>{cursor.toLocaleString(undefined, { month: "long", year: "numeric" })}</h2><div className="board-buttons"><button className="board-button" type="button" onClick={() => moveMonth(-1)} aria-label="Previous month">Prev</button><button className="board-button" type="button" onClick={goToday}>Today</button><button className="board-button" type="button" onClick={() => moveMonth(1)} aria-label="Next month">Next</button></div></div><div className="weekday-row">{WEEKDAYS.map((day) => <span className="day-name" key={day}>{day}</span>)}</div><div className="day-grid">{cells.map((day) => { const key = ymd(day); const isSelected = key === selected; const isToday = key === ymd(today); const count = events.filter((event) => event.date === key).length; return <button key={key} type="button" className={`day-cell ${day.getMonth() === cursor.getMonth() ? "" : "is-muted"} ${isSelected ? "is-selected" : ""} ${isToday ? "is-today" : ""}`} onClick={() => setSelected(key)} aria-label={`${day.toDateString()}${count ? `, ${count} event${count > 1 ? "s" : ""}` : ""}`}><span className="day-number">{day.getDate()}</span>{count > 0 ? <span className="cell-note">{count} event{count > 1 ? "s" : ""}</span> : null}{count > 0 ? <span className="event-tick" aria-hidden="true" /> : null}</button>; })}</div></div>
      <aside className="dispatch-panel"><div className="dispatch-kicker">Dispatch / selected date</div><h2>{selectedDate.toLocaleDateString(undefined, { weekday: "long" })}</h2><div className="dispatch-date">{selectedDate.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</div><div className="event-list" aria-live="polite">{dayEvents.length ? dayEvents.map((event) => <article className="event-line" key={event.id}><header><h3>{event.title}</h3><button className="delete-button" type="button" onClick={() => setEvents((current) => current.filter((item) => item.id !== event.id))}>Remove</button></header>{event.notes ? <p>{event.notes}</p> : null}</article>) : <p className="empty-state">No departures yet. Add the first event below.</p>}</div><form className="add-event" onSubmit={(event) => { event.preventDefault(); addEvent(); }}><h3>Add to this date</h3><input className="field" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Event title" aria-label="Event title" /><textarea className="field" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Notes (optional)" aria-label="Event notes" rows={3} /><button className="dispatch-button" type="submit">Save event</button></form></aside>
    </section>
    <footer className="station-footer">Local events are saved in localStorage on this origin only. This portfolio boundary is not a shared calendar or a multi-user service.</footer>
  </main></div>;
}
