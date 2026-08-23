import type { Metadata } from "next";
import { Roboto_Mono, Sora } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const calendarSans = Sora({ variable: "--font-calendar-sans", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const calendarMono = Roboto_Mono({ variable: "--font-calendar-mono", subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata: Metadata = { title: "Calendar App | Bookchaowalit", description: "A local calendar for shaping days and keeping events on this device.", authors: [{ name: "Bookchaowalit", url: "https://bookchaowalit.com" }], metadataBase: new URL("https://bookchaowalit.com"), robots: { index: true, follow: true } };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${calendarSans.variable} ${calendarMono.variable}`}><body className="antialiased"><span hidden aria-hidden="true" dangerouslySetInnerHTML={{ __html: "<!-- THESIS: station departures board for one local life. OWN-WORLD: midnight enamel, timetable white, signal amber, mono timecodes. STORY: read the month, select a date, dispatch an event. FIRST VIEWPORT: month board left, selected-date dispatch right. FORM: candidate 3, station departures board; seed key 7dbc6988. FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance -->" }} />{/* THESIS: Calendar is a station departures board for a single local life, not a generic rounded month widget.
OWN-WORLD: midnight enamel, timetable white, signal amber, mono timecodes, and a fixed rail that keeps days legible.
STORY: The visitor reads the month as a route, selects a date, then dispatches or removes an event in the side panel.
FIRST VIEWPORT: the month board dominates the left and the selected-date dispatch panel sits to its right; Save event is the primary action.
FORM: candidate 3 of the grounded list, a station departures board; seed key 7dbc6988.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance */}<Analytics /><SpeedInsights />{children}</body></html>;
}
