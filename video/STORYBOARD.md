# Kelana — 56 s explainer · 120 BPM (1 beat = 0.5 s, 1 bar = 2 s)

## What Kelana is (from the Figma exports in the repo)
- Indonesian trip planner: "Rencana jalan-jalan yang beres dalam 5 menit".
- For travellers (wisatawan) who don't want "drama riset 40 tab browser"; also has a partner (mitra) side for local guides/operators.
- Real features used: Penyusun itinerary (3 steps: Dasar → Minat → Rencana, budget slider Rp 500 rb–Rp 15 jt),
  plan with estimasi biaya (Rp 4,85 jt per orang, budget Rp 5,00 jt, sisa Rp 150 rb, 5 cost lines),
  Rencana harian with drag-to-reorder and "jam-nya ikut dihitung ulang otomatis", impossible-schedule warning
  (Pink Beach → Pulau Komodo 75 menit berlayar, 0 menit tersisa, geser Manta Point ke Hari 3),
  Open trip patungan (kuota 5/8; 4 orang Rp 4,85 jt · 5 orang Rp 3,90 jt · 8 orang Rp 3,10 jt).
- Brand: Plus Jakarta Sans; Kelana blue #35A8FF (logo #45ABFF); ink #0F172A; slate #64748B; bg #F8FAFC.
  Logo = the word KELANA cut out of a shoe-sole footprint.

## Through-line object: the blue dot
It is born as the budget-slider knob, and it is the only blue thing on screen (plus one key word).
Every scene starts with it turning into the next UI element: knob → selection check → button icon →
frame-filling field → plan sparkle → cost-bar tip → timeline playhead → "0 menit" gap capsule →
drop-target on the Hari 3 tab → quota-bar fill → full-frame payoff field → shrinks to a dot →
its contour morphs into the footprint silhouette → letters carve in → KELANA logo.

## Unusual techniques
1. Contour morph: the dot's outline is a 240-point polar polygon that interpolates from a circle into the
   logo's footprint silhouette, sampled at runtime from the logo PNG's alpha; letters then carve in as a mask wipe.
2. Directional motion blur: per-axis SVG Gaussian blur driven by each element's measured screen velocity
   (dot, cursor, dragged card, camera), plus 3-subframe temporal blending.
3. The hook is erased by the UI itself: the slider knob sweeps under the headline and wipes it away (mask edge = knob x).
4. Odometer time roll when the schedule recalculates (13.00 → 14.15 = 11.00 + 2 jam + 75 menit, derived from the UI's own numbers).

## Beat sheet (t in seconds)
| t | beat | picture | sound |
|---|---|---|---|
| 0.0 | 1 | Track grows from the knob; knob grows. "40 tab" rises from a mask. | kick |
| 0.5 | 2 | "buat satu" | kick |
| 1.0 | 3 | "liburan." | kick |
| 1.5 | 4 | Knob sweeps right along the track, wiping the headline away. | kick + sweep |
| 2.0 | 5 | HIT. Budget card unfolds out of the track. Caption "Cerita maumu," | hit, groove starts |
| 2.5–3.0 | 6–7 | Cursor arrives, grabs knob (value Rp 15 jt). | tick |
| 3.0–4.0 | 7–9 | Drag down to Rp 5,00 jt; value counts; camera zooms in. | |
| 4.5 | 10 | Note line; camera scrolls to "Apa yang bikin kamu semangat?" grid unfolding | |
| 5.5 / 6.0 / 6.5 | 12–14 | Dot hops into Pemandangan alam, Sunrise & sunset, Snorkeling Laut; leaves an ink check each time. Caption line 2 "Kelana yang nyusun." | ticks |
| 7.0–7.5 | 15–16 | Dot lands in "Susun rencana saya"; click. | tick |
| 7.5–8.0 | 16 | Dot grows past all four corners. | |
| 8.0 | 17 | HIT. Blue shrinks into the plan sparkle, revealing "Rencana 4 hari kamu sudah siap". | hit, arp in |
| 9.0 | 19 | Estimasi biaya card unfolds; caption "Rp 4,85 jt." | |
| 9.5–11.5 | 20–24 | Dot rides the cost-bar tip; one cost line per beat (Kapal & kru 2,09 jt … Lain-lain 435 rb). | |
| 12.0 | 25 | Total Rp 4,85 jt lands; caption "Di bawah budget." | |
| 12.5 | 26 | "Budget kamu Rp 5,00 jt — sisa Rp 150 rb" | |
| 13.5 | 28 | Plan folds away. | |
| 14.0 | 29 | HIT. Dot is the playhead of Hari 2; header unfolds. | hit |
| 14.5–16.0 | 30–33 | One activity card per beat: 07.30 Padar, 11.00 Pink Beach, 13.00 Komodo, 15.30 Manta Point. | |
| 16.5 | 34 | Dot stretches into a capsule between Pink Beach and Komodo. Caption "Jadwal mustahil?" | |
| 17.0–17.5 | 35–36 | Capsule squeezes on each beat (no room). | |
| 18.0 | 37 | Warning card unfolds; caption "Kelana bilang duluan." | |
| 19.5–20.0 | 40–41 | Cursor grabs Manta Point. | tick |
| 20.0–21.0 | 41–43 | Drag to the Hari 3 tab; card collapses into the dot. | tick |
| 21.5 | 44 | Timeline retracts; "4 aktivitas" → "3 aktivitas". | |
| 22.0 | 45 | Komodo card drops 40 px, time rolls 13.00 → 14.15, chip "75 menit berlayar". | |
| 22.5 | 46 | Warning folds shut. | |
| 23.0 | 47 | Caption "Tarik kartunya. Jam dihitung ulang." | |
| 25.0 | 51 | Timeline folds away. | |
| 26.0 | 53 | HIT. Dot stretches into the quota bar (5/8). Caption "Jalan bareng, biaya dibagi rata." | hit |
| 27.0–28.5 | 55–58 | Price tiers unfold one per beat; refund note. | |
| 29.0–30.5 | 59–62 | Trip card: photo, title, guide, five members. | |
| 32.0 | 65 | Caption "Makin banyak yang gabung, makin murah." | |
| 33.0 / 34.0 | 67 / 69 | Cursor hovers 4 orang (fill 4/8), 5 orang (fill 5/8). | |
| 36.0 | 73 | Click "8 orang · penuh". | tick |
| 36.5–37.5 | 74–76 | Seats 6, 7, 8 fill; "8 / 8". | |
| 38.0–39.5 | 77–80 | Camera dives onto the bar. | riser + roll |
| 40.0 | 81 | BIGGEST HIT. Bar floods past all corners. "Rp 3,10 jt" | big hit |
| 40.5–43.0 | 82–87 | "per orang", "dari Rp 4,85 jt" struck, "kalau 8 orang gabung.", refund line | |
| 44.0–45.0 | 89–91 | Lines exit upward. | |
| 45.5 | 92 | Field shrinks back into a dot at center. | |
| 46.0 | 93 | HIT. Dot contour morphs into the footprint. | hit |
| 47.5–48.5 | 96–98 | Letters carve in: KELANA. | |
| 49.5 / 50.0 | 100 / 101 | "Rencana jalan-jalan yang" / "beres dalam 5 menit." | |
| 51.0 | 103 | CTA "Mulai dari Jelajah →" unfolds | |
| 52.5–53.0 | 106–107 | Cursor clicks it. | tick |
| 53.5 | 108 | "Gratis, tanpa perlu daftar dulu." | |
| 54.0–55.5 | 109–112 | Arrow nudges each beat; camera keeps pushing. | outro |
