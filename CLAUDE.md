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

**Important:** Enable MESSAGE_CONTENT privileged intent in Discord Developer Portal (Bot > Privileged Gateway Intents).

## Architecture

Single-file bot (`bot.js`) with JSON-based pattern config (`patterns.json`).

**bot.js structure:**
- **Client setup** — Creates discord.js Client with Guilds, GuildMessages, and MessageContent intents
- **`patternToRegex()`** — Converts pattern strings to RegExp: escapes special chars, replaces `*` with `.*`, case-insensitive
- **Slash command registration** — On `ClientReady`, registers commands globally via Discord REST API PUT to `/applications/{APP_ID}/commands`
- **`MessageCreate` handler** — Ignores bot authors, iterates patterns in order, first match wins. Type `"react"` adds emoji reaction; type `"reply"` sends a reply message. Includes `[DEBUG]` console logs for each pattern test and action taken.
- **`InteractionCreate` handler** — Routes slash commands (currently only `/test`)

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
