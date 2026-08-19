# CompTIA A+ Core 1 — 200-Question Scenario Exam Simulator

A self-contained HTML exam simulator for the **CompTIA A+ Core 1 (220-1101 / 220-1201)** certification, built from the accompanying study guides (wireless technologies, networking, RAM, hardware, mobile devices, and troubleshooting).

## Features

**Section 1 — 200 scenario-based MCQs**, each with exactly one correct answer (A–D), covering all five Core 1 exam domains:

  | Domain | Questions | Approx. exam weight |
  |---|---|---|
  | Mobile Devices | 30 | 15% |
  | Networking | 41 | 20% |
  | Hardware | 49 | 25% |
  | Virtualization & Cloud Computing | 22 | 11% |
  | Hardware & Network Troubleshooting | 58 | 29% |

**Section 2 — 10 interactive performance-based questions (PBQs)**, 10 points each with partial credit:

1. Build-a-PC — select the correct parts for a video-editing workstation
2. SOHO router configuration — security mode, channel choice, guest network, admin hardening
3. Cable & connector matching — Cat6a, coax/F-type, RJ11, fiber, Cat5e
4. Troubleshooting methodology — order the six CompTIA steps
5. Simulated terminal — repair an APIPA (169.254.x.x) connection with `ipconfig`
6. Printer fleet diagnosis — match symptoms to fuser, drum, transfer roller, rollers, driver
7. RAID design — pick the level and compute usable capacity and fault tolerance
8. Laptop diagram hotspots — find the components behind post-repair failures
9. Simulated terminal — diagnose a stale name-resolution entry with `ping`/`nslookup`
10. Cloud models + safe malware-sandbox VM settings

- Single **90-minute timer covering both sections**, live progress bar, and a clickable question palette
- On submit: MCQ score + PBQ score, pass/fail vs. the ~75% (675/900) threshold, per-domain breakdown
- **Correct answer and explanation revealed for every question and PBQ**, with a "show only missed" review filter
- Print / save-as-PDF friendly review mode and one-click retake

## Run it

Open `index.html` directly in any browser, or serve it locally:

```bash
npm run dev          # starts a static server on http://localhost:7100/
```

No dependencies or build step required.

## File layout

```
index.html                  — exam simulator UI + grading logic (Sections 1 & 2)
js/questions-mobile.js      — 30 mobile-device questions
js/questions-network.js     — 41 networking questions
js/questions-hardware.js    — 49 hardware questions
js/questions-cloud.js       — 22 virtualization & cloud questions
js/questions-trouble1.js    — 29 troubleshooting questions (part 1)
js/questions-trouble2.js    — 29 troubleshooting questions (part 2)
js/pbqs.js                  — 10 interactive performance-based questions (Section 2)
server.js                   — tiny zero-dependency static server
```

For study purposes only; not affiliated with CompTIA.
