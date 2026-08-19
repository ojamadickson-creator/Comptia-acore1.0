# CompTIA A+ Core 1 — 200-Question Scenario Exam Simulator

A self-contained HTML exam simulator for the **CompTIA A+ Core 1 (220-1101 / 220-1201)** certification, built from the accompanying study guides (wireless technologies, networking, RAM, hardware, mobile devices, and troubleshooting).

## Features

- **200 scenario-based MCQs**, each with exactly one correct answer (A–D)
- Full coverage of all five Core 1 exam domains:

  | Domain | Questions | Approx. exam weight |
  |---|---|---|
  | Mobile Devices | 30 | 15% |
  | Networking | 41 | 20% |
  | Hardware | 49 | 25% |
  | Virtualization & Cloud Computing | 22 | 11% |
  | Hardware & Network Troubleshooting | 58 | 29% |

- 90-minute guide timer, live progress bar, and a clickable question palette
- On submit: total score, pass/fail vs. the ~75% (675/900) threshold, per-domain breakdown
- **Correct answer and explanation revealed for every question**, with a "show only missed" review filter
- Print / save-as-PDF friendly review mode and one-click retake

## Run it

Open `index.html` directly in any browser, or serve it locally:

```bash
npm run dev          # starts a static server on http://localhost:7100/
```

No dependencies or build step required.

## File layout

```
index.html                  — exam simulator UI + grading logic
js/questions-mobile.js      — 30 mobile-device questions
js/questions-network.js     — 41 networking questions
js/questions-hardware.js    — 49 hardware questions
js/questions-cloud.js       — 22 virtualization & cloud questions
js/questions-trouble1.js    — 29 troubleshooting questions (part 1)
js/questions-trouble2.js    — 29 troubleshooting questions (part 2)
server.js                   — tiny zero-dependency static server
```

For study purposes only; not affiliated with CompTIA.
