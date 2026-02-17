# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Discord bot that monitors messages and reacts/replies based on configurable patterns. Uses Discord Gateway (WebSocket) via discord.js v14. ES module project (`"type": "module"` in package.json).

## Commands

```bash
npm install          # Install dependencies
npm start            # Run the bot (node bot.js)
npm run dev          # Run with nodemon for auto-reload
```

No test or lint tooling is configured.

## Environment Setup

Requires a `.env` file with:
- `APP_ID` - Discord application ID
- `DISCORD_TOKEN` - Bot token
- `PUBLIC_KEY` - Discord application public key

**Important:** Enable MESSAGE_CONTENT privileged intent in Discord Developer Portal (Bot > Privileged Gateway Intents).

## Architecture

Modular discord.js project with JSON-based pattern config (`patterns.json`).

**Project structure:**
```
bot.js                     # Entry point: client setup, event registration, login
src/
  events/
    ready.js               # ClientReady handler + slash command registration via REST API
    messageCreate.js        # Message pattern matching handler
    interactionCreate.js    # Slash command router (Collection-based lookup)
  commands/
    test.js                 # /test command: definition (SlashCommandBuilder) + execute()
  utils/
    patterns.js             # patternToRegex() + loadPatterns() from patterns.json
```

**Event handler convention:** Each event file exports `name` (Discord event), `once` (boolean), and `execute()`. `bot.js` registers them dynamically.

**Adding a new slash command:** Create a file in `src/commands/` exporting `data` (SlashCommandBuilder) and `execute(interaction)`. Then import it in both `src/events/ready.js` (for registration) and `src/events/interactionCreate.js` (for routing).

**Key behaviors:**
- **Pattern matching** (`messageCreate.js`) — Ignores bot authors, iterates patterns in order, first match wins. Type `"react"` adds emoji reaction; type `"reply"` sends a reply message. Includes `[DEBUG]` console logs.
- **`patternToRegex()`** — Converts pattern strings to RegExp: escapes special chars, replaces `*` with `.*`, case-insensitive.
- **Slash command registration** (`ready.js`) — On `ClientReady`, registers commands globally via Discord REST API PUT to `/applications/{APP_ID}/commands`.

**Pattern Config Format (`patterns.json`):**
```json
{
  "patterns": [
    { "pattern": "hello", "type": "react", "emoji": "🇿" },
    { "pattern": "somebody*help", "type": "reply", "message": "I'm here to help!" }
  ]
}
```

Patterns are loaded once at startup — changes to `patterns.json` require a bot restart (or use `npm run dev` for auto-reload).
