# Welcome sequence (Sequenzy)

Paste-ready HTML for the new-subscriber welcome sequence. These files are not part of the Next.js app. The live site still sends signups to Loops through `src/app/api/newsletter/route.ts` until the switch to Sequenzy.

| # | File | Subject | Preheader (already in the HTML) |
|---|---|---|---|
| 1 | `01-welcome-to-the-bureau.html` | Welcome to the Bureau | Your roster addition has been processed. Welcome to the Appalachian Cryptid Division. |
| 2 | `02-the-cryptid-files.html` | What is a cryptid? (The short answer is "hidden.") | If it bleeds, leaves tracks, and needs to eat, it's ours. Your first three case files are inside. |
| 3 | `03-the-anomalies-desk.html` | Not everything strange has a body. | Lights nobody can account for. Sounds nobody wants to answer. The Bureau keeps a separate department for these. |

## Notes

- **No unsubscribe block.** Sequenzy adds its own footer, so the Loops `{{ unsubscribeUrl }}` row was taken out of all three emails.
- **Copy sources.** Email 2 draws on Bulletin BUR-001 (`/bulletin/what-is-a-cryptid`) and the Not Deer, Mothman and Wampus Cat files. Email 3 uses the "Homepage: Anomalies Desk" singleton and the anomaly files.
- **Email 3 styling.** It borrows the ink plate from `AnomaliesDeskBand.tsx`: `bureau-ink` background, rust accents, Rule 1 / Rule 2 and the stamp button.
- **Email 3 is a teaser.** It features The Whistler and hints at three other files without naming them, then sends readers to `/anomalies`. New anomalies won't make it out of date. The featured file is written into the HTML, so if The Whistler is ever renamed or moved, update email 3.
- **Images** come from the Sanity CDN as JPG (`fm=jpg`), because Outlook can't show WebP.
- **Fonts.** Rokkitt, Special Elite and Work Sans load from Google Fonts where the email client allows it. Other clients fall back to Georgia, Courier and the system sans.
