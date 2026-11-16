# GHOSTGRAVE MD command update

This update adds command routing and menu entries for the requested tools.

## Working with the current codebase
- Existing commands retained: `.groupstatus`, `.removebg`, `.song`, `.ytmp3`, `.ytmp4`, `.facebook`, `.spotify`, `.topmembers`, `.translate`, `.sudo`, `.pair`, `.video`.
- New local utilities: `.prefix`, `.time`, `.dns <domain>`, `.ssl <domain>`, `.speedtest` (DNS latency check, not a bandwidth test), `.whois` (WhatsApp registration check for a mentioned/replied contact), `.note add/list/del`, `.rules` / `.rules set`, `.active`, `.block` (owner only), `.devicecheck`, `.utility`, `.entertainment`, `.kid`, `.logo`, `.textsticker`.
- `.font`, `.color`, `.theme` point users to the existing text-maker styles.

## External integrations not configured
`.mediafire`, `.apk`, `.gdrive`, `.carbon`, `.stickersearch`, `.uploader`, `.converter` require a compatible API/service and credentials. They respond with a clear setup message rather than pretending to download or convert content.

## WhatsApp/API limitations
- Individual member muting is not supported by the standard WhatsApp group API; `.mutemember` explains the limitation.
- Exact device model detection is not exposed reliably; `.devicecheck` explains this.
- `.antispam`, `.antifake`, `.antiscam` report existing protections and that separate modules are not configured.
- `.password` and `.getcode` do not collect passwords or one-time login codes.
- `.eval` and `.devtools` are intentionally disabled to prevent remote code execution and session compromise.

## Deployment
Run `npm install --legacy-peer-deps`, then `npm start` on Node.js 20. Set your own owner number in `settings.js` or environment configuration before starting. Pairing requires the WhatsApp pairing service to be reachable.
