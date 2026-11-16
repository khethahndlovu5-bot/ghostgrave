# GHOSTGRAVE MD WhatsApp Bot

<p align="center">
  <img src="assets/bot_image.jpg" alt="GHOSTGRAVE MD Bot" width="420" />
</p>

<h2 align="center">GHOSTGRAVE MD</h2>

<p align="center">
  A multi-device WhatsApp bot for group administration, moderation, media, stickers, downloads, games, AI tools and entertainment.
</p>

<p align="center">
  <a href="https://github.com/khethahndlovu5-bot/ghostgrave">Repository</a> ·
  <a href="https://github.com/khethahndlovu5-bot/ghostgrave/issues">Issues</a>
</p>

---

## Owner Details

| Field | Details |
|---|---|
| Bot name | **GHOSTGRAVE MD** |
| Owner | **Khethah RSA** |
| WhatsApp owner number | **+27 76 913 4196** |
| GitHub account | [khethahndlovu5-bot](https://github.com/khethahndlovu5-bot) |
| Repository | [khethahndlovu5-bot/ghostgrave](https://github.com/khethahndlovu5-bot/ghostgrave) |
| Command prefix | `.` |
| Command mode | Public |
| Version | 3.0.8 |

> The owner number is written in international format without spaces inside the bot configuration: `27769134196`.

## About GHOSTGRAVE MD

GHOSTGRAVE MD is an unofficial WhatsApp multi-device bot built with Node.js and Baileys. It provides tools for WhatsApp group owners and admins, including moderation, anti-link protection, welcome messages, member management, media tools, stickers, downloads, games, AI features and fun commands.

This project is maintained for the GHOSTGRAVE MD bot by **Khethah RSA**. It is not affiliated with, sponsored by or endorsed by WhatsApp.

## Main Features

- Group welcome messages with the new member's full profile picture, name and group name.
- Group moderation: warnings, mute, ban, kick, promote, demote and member management.
- Anti-link, anti-tag, anti-bad-word and anti-bot protection.
- Anti-media, anti-sticker and anti-group-status controls.
- Stickers, animated text stickers, sticker cropping, background removal and image tools.
- Music and media tools for YouTube, TikTok, Instagram, Facebook, Twitter and Spotify.
- AI, anime, translation, text-to-speech and image generation tools.
- Games, jokes, facts, trivia, truth-or-dare and other entertainment tools.
- Owner controls for auto-read, auto-typing, auto-status, anti-call and session management.

## Installation

### Requirements

- Node.js 18 or newer (Node.js 20 is recommended).
- Git.
- FFmpeg for audio/video and some sticker functions.
- A WhatsApp account used as the bot account.

### Clone the repository

```bash
git clone https://github.com/khethahndlovu5-bot/ghostgrave.git
cd ghostgrave
```

### Install dependencies

```bash
npm install --legacy-peer-deps
```

### Configure the owner

The current owner number is already configured in `settings.js`:

```js
ownerNumber: '27769134196'
```

If you deploy your own copy, update the number to your own WhatsApp number in international format without the `+` sign or spaces.

### Start the bot

```bash
npm start
```

The bot uses the `session/` directory for WhatsApp authentication. Keep the session private and never upload login credentials or pairing codes publicly.

## Welcome Command

Only a group admin can configure the welcome message.

```text
.welcome on
.welcome off
.welcome set Your custom message
```

Available variables for a custom welcome message:

- `{USER}` or `{user}` — mentions the new member.
- `{group}` — inserts the group name.
- `{description}` — inserts the group description.

The default welcome message includes the new member's full profile picture and the GHOSTGRAVE MD family welcome text.

## Command Reference

All commands use the dot prefix. Use `.help` or `.menu` inside WhatsApp to display the menu.

### General

```text
.help / .menu / .bot / .list
.ping
.alive
.owner
.prefix
.time
.country <country>
.joke
.quote
.fact
.weather <city>
.news
.tts <text>
.lyrics <song>
.8ball <question>
.groupinfo
.staff / .admins
.vv
.vv2
.trt <text> <language>
.ss <link>
.jid
.url
```

### Group administration

```text
.welcome on|off|set <message>
.goodbye on|off|set <message>
.tag <message>
.tagall
.tagnotadmin
.hidetag <message>
.kick @user
.ban @user
.unban @user
.warn @user
.warnings @user
.mute [minutes]
.unmute
.promote @user
.demote @user
.delete / .del
.clear
.resetlink
.setgdesc <description>
.setgname <name>
.setgpp (reply to an image)
.groupstatus [caption]
.app
.add <country-code-and-number>
.getpp (reply to or mention a member)
```

### Group protection

```text
.antilink on|off|delete|warn
.antibadword on|off
.antibot on|off|set|get
.antitag on|off
.antimedia on|off
.antisticker on|off
.antigroupstatus on|off
.antispam
.antifake
.antiscam
.mutemember
```

### Owner controls

```text
.mode public|private
.settings
.setpp (reply to an image)
.clearsession
.cleartmp
.update
.antidelete on|off
.autoreact on|off
.autostatus on|off
.autostatus react on|off
.savestatus on|off
.autotyping on|off
.autoread on|off
.anticall on|off
.pmblocker on|off|status
.pmblocker setmsg <message>
.setmention (reply to a message)
.mention on|off
.sudo add|remove|list
```

### Utility tools

```text
.dns <domain>
.ssl <domain>
.speedtest
.whois @member
.note add <name> <text>
.note list
.note del <name>
.rules
.rules set <rules>
.grouprules
.active
.topmembers
.block (reply to a contact)
.devicecheck
.utility
.utilitytool
.converter <value>
.concerter <value>
.font
.color
.theme
.logo <description>
.textsticker <text>
.pair <WhatsApp number>
```

### Image and sticker tools

```text
.sticker (reply to an image/video)
.s / .sticker
.simage (reply to a sticker)
.blur (reply to an image)
.removebg
.remini
.crop (reply to media)
.take <packname>
.attp <text>
.tgsticker <Telegram sticker link>
.stickertelegram <link>
.stickercrop
.emojimix <emoji>+<emoji>
.meme
.igs <Instagram link>
.igsc <Instagram link>
.textmaker commands: .metallic, .ice, .snow, .impressive, .matrix, .light, .neon, .devil, .purple, .thunder, .leaves, .1917, .arena, .hacker, .sand, .blackpink, .glitch, .fire
```

### Downloads and media

```text
.play <song name>
.song <song name>
.spotify <query>
.instagram <link>
.facebook <link>
.twitter <link>
.tiktok <link>
.video <song name>
.ytmp3 <YouTube link>
.ytmp4 <YouTube link>
.gif <query>
```

### AI and anime

```text
.ai <question>
.gpt <question>
.gemini <question>
.imagine <prompt>
.flux <prompt>
.sora <prompt>
.anime / .animu
```

### Games and fun

```text
.tictactoe @user
.hangman
.guess <letter>
.trivia
.answer <answer>
.truth
.dare
.compliment @user
.insult @user
.flirt
.shayari
.goodnight
.roseday
.character @user
.wasted @user
.ship @user
.simp @user
.stupid @user [text]
```

### Anime and reaction commands

```text
.nom
.poke
.cry
.kiss
.pat
.hug
.wink
.facepalm
```

### Miscellaneous

```text
.heart
.horny
.circle
.lgbt
.lolice
.its-so-stupid
.namecard
.oogway
.tweet
.ytcomment
.comrade
.gay
.glass
.jail
.passed
.triggered
```

### GitHub and repository information

```text
.git
.github
.sc
.script
.repo
```

## Data and Privacy

- Keep the `session/` folder private because it contains WhatsApp authentication data.
- Do not publish pairing codes, QR codes, API keys, `.env` files or private credentials.
- The bot is configured to use local JSON files in `data/` for group settings and lightweight storage.
- Always review third-party APIs before using download or media commands.

## Legal Notice

GHOSTGRAVE MD is an independent and unofficial WhatsApp bot. It is not affiliated with WhatsApp or Meta. Use it responsibly and follow WhatsApp's Terms of Service and all applicable laws. Do not use the bot for spam, harassment, fraud, bulk messaging or other illegal activity. The owner and contributors are not responsible for account bans, misuse or damage caused by the software.

## Credits

- GHOSTGRAVE MD maintained by **Khethah RSA**.
- [Baileys](https://github.com/WhiskeySockets/Baileys) for the WhatsApp Web API library.
- Other open-source packages listed in `package.json`.

## License

This project is distributed under the license and notices included in the repository. Keep the relevant upstream notices and package licenses when modifying or redistributing the bot.

## Support and Contributions

For bugs or improvements, open an issue in the [GHOSTGRAVE MD repository](https://github.com/khethahndlovu5-bot/ghostgrave/issues). When reporting a problem, include the command, the error message and the Node.js version. Never include your WhatsApp session files or private credentials.
