# Design direction

Calendar is a station departures board for one local life. The month is the
operating surface, while the selected date is a dispatch panel for adding or
removing events.

- Palette: midnight enamel, timetable white, signal amber, and slate dividers.
- Type: Sora gives the board a contemporary public-information voice; Roboto
  Mono carries dates, labels, and event counts.
- Form: dense 7-column board, signal ticks for event presence, and a fixed
  dispatch panel instead of nested cards.
- Content truth: events are localStorage-only and the seeded event is labelled
  as a portfolio demo event.
- Responsive rule: the board stacks above dispatch on small screens and keeps
  the day cells tappable without horizontal overflow.
