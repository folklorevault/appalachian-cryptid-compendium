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
- **Email 3 styling.** It borrows the ink plate from `AnomaliesDeskBand.tsx`: `bureau-ink` background, rust accents, Rule 1 / Rule 2, the file-number ledger and the stamp button. File numbers follow the site's creation order (001 = oldest).
- **Stays current by hand.** The anomaly ledger and featured file are written into the HTML and don't pull from Sanity. When you add or change anomalies, update email 3 to match.
- **Images** come from the Sanity CDN as JPG (`fm=jpg`), because Outlook can't show WebP.
- **Fonts.** Rokkitt, Special Elite and Work Sans load from Google Fonts where the email client allows it. Other clients fall back to Georgia, Courier and the system sans.
