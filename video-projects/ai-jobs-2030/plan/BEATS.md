# 10 Jobs AI Will Erase by 2030: edit and beat plan

16:9, 1920x1080, 60 fps. 2D character ("Fahim": red hoodie, navy jeans, red sneakers) acting in 2.5D sets built from
layered parallax planes. Camera always moving (dolly, crane, orbit, push-in), never shaking. Text in the Google palette:
blue #4285F4, red #EA4335, yellow #FBBC05, green #34A853, on white/dark.

## Voice edit (source times in the original MP3)

- **Cut a duplicate:** 6:35.9 to 8:34.6 (395.9 s to 514.6 s) repeats jobs #5 and #6 word for word. Keep the first take.
- Voice runs about 10:51 after the cut. Music-only breaths add about 50 s: final length about 11:40.

## Breaths (music only, no voice)

| # | Where | Length | What happens |
|---|---|---|---|
| B0 | before 0:00 | 5 s | Cold open: city at dawn, crane down to one lit window. "2030" fades through haze. |
| B1 | after "...out loud." (18.5) | 2.5 s | Hold on Fahim staring at the spreadsheet wall; music drops to a low pulse. |
| B2 | after "...number one." (28.2) | 3 s | Title world: the road of ten monoliths, camera flies to monolith 01. |
| B3..B11 | before each "Number two..ten" | 3 s each | Chapter card: giant number + job name, light sweep, music changes to the next scene's theme. |
| B12 | after "...repetitive task all day." (743.2) | 4 s | Sunrise: Fahim walks out of the dark office onto the rooftop. Music lifts. |
| B13 | end | 6 s | End card hold, music resolves. |

Also small 0.6 to 1.0 s breaths where a prompt starts ("Open ChatGPT and type this prompt") so the chat window can land.

## Music (generated in Python, no piano), changes per scene

- Intro / hook: dark synth drone + soft heartbeat kick, tension.
- Title world: pulsing arpeggio (saw/pluck), rising.
- Each job: the "threat" half uses a low, ticking pulse in a minor key; the "pivot" half lifts to a major key with brighter
  plucks and pads. Prompt beats: lighter, typing-friendly groove.
- Chapter cards: riser + sub hit, then key change into the next job's palette.
- Finale: wide warm pads, uplifting pluck melody, big resolve.
- SFX (Python): whooshes on camera moves, soft UI ticks for typing, paper rustle, scanner beam, notification pings,
  stamp hits on the job titles, low boom on statistics.

## Scenes

| Scene | Voice | Set and action | Camera | Key text |
|---|---|---|---|---|
| S01 Cold open | (music) | Dawn city skyline, layered haze, window lights switching off | Crane down + push to one window | 2030 |
| S02 Hook | 0:00-0:10 "LinkedIn feed... your job is next" | Dark bedroom, Fahim on bed edge lit blue by phone; the feed floats huge in 3D: "300 workers replaced" | Slow push-in, rack focus phone -> face | 300 REPLACED |
| S03 Boss | 0:10-0:18 "shared spreadsheet... quiet part" | Office: a wall-sized spreadsheet fills row by row, coworker silhouettes | Low-angle dolly sideways | EVERY TASK |
| S04 Title | 0:19-0:28 "Here are 10 jobs..." | Road to the horizon lined with 10 glowing monoliths | Drone fly-over toward 01 | 10 JOBS / 2030 |
| 01 Data Entry Clerk | 0:28-1:33 | Desk under paper towers in 4 PM orange blinds light; scanner bot beams invoices into a database cylinder. Pivot: Fahim with a magnifier over a floating data grid, flags a red cell | Push-in, then orbit around the grid | DATA QUALITY ANALYST |
| 02 Support Rep | 1:33-2:42 | 2 AM call centre, moon in window, bot bubbles in 40 languages; WEF stat towers 92M fall / 170M rise. Pivot: Fahim as conductor of bots | Pull back reveal of the bubble wall | 92M vs 170M |
| 03 Copywriter | 2:42-3:44 | Machine prints 10 drafts in 10 s; the "fast intern" robot reading every website. Pivot: Fahim editing on a big board, funnel | Crane up past paper storm | CONTENT STRATEGIST |
| 04 Bookkeeper | 3:44-4:37 | Ledgers auto-sorting on Friday afternoon. Pivot: Fahim explaining a cash-flow leak to a shop owner | Dolly through a bank-statement tunnel | CASH FLOW ADVISOR |
| 05 Software Tester | 4:37-5:40 | Same login screen 50 times; overnight AI testers run on 1000 screens. Pivot: Fahim hacking at the software creatively. Then the "comment AI JOBS" CTA | Push through a wall of screens | AI QA ENGINEER |
| 06 Translator | 5:40-6:36 | Globe with live subtitles. Pivot: Fahim catching a slogan that offends | Orbit around the globe | LOCALIZATION |
| 07 Graphic Designer | 6:36-7:37 | Text box generates banners. Pivot: Fahim mapping an app user journey | Slide through floating app screens | UX DESIGNER |
| 08 Paralegal | 7:37-8:30 | 10,000 pages scanned, risky clauses glow red. Pivot: Fahim with a privacy shield | Tilt down a tower of pages | LEGAL OPS |
| 09 Cashier / Teller | 8:30-9:26 | Night supermarket, self-checkout kiosks glow, Fahim alone at a register. Pivot: trusted face in a bright showroom | Dolly down the empty aisle | RELATIONSHIP BANKER |
| 10 Telemarketer | 9:26-10:15 | Robot callers dial thousands of leads. Pivot: Fahim closing on a video call | Pull back from phone grid | ACCOUNT EXECUTIVE |
| Finale | 10:15-10:51 | Rooftop at sunrise, Fahim in front of the city "running the update" | Slow crane up + orbit | YOU RUN THE UPDATE |
| End card | | Fahim waves; "Comment AI JOBS" | Gentle drift | AI JOBS |

Every prompt is shown in a floating chat window in the scene's 3D space, typed in time with the voice, with a camera
push onto the line being read.
