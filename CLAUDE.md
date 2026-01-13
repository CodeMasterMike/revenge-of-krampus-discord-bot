# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Discord bot that monitors messages and reacts/replies based on configurable patterns. Uses Discord Gateway (WebSocket) via discord.js.

## Commands

```bash
npm install          # Install dependencies
npm start            # Run the bot (node bot.js)
npm run dev          # Run with nodemon for auto-reload
```

## Environment Setup

Requires a `.env` file with:
- `APP_ID` - Discord application ID
- `DISCORD_TOKEN` - Bot token

**Important:** Enable MESSAGE_CONTENT privileged intent in Discord Developer Portal (Bot > Privileged Gateway Intents).

## Architecture

**Key Files:**
- `bot.js` - Main bot file with Gateway client, message handler, and slash command handler
- `patterns.json` - Pattern configuration for reactions and replies

**Pattern Matching:** Patterns support `*` wildcard (matches any characters) and are case-insensitive. First matching pattern wins.

**Pattern Config Format:**
```json
{
  "patterns": [
    { "pattern": "hello", "type": "react", "emoji": "Z" },
    { "pattern": "somebody*help", "type": "reply", "message": "I'm here to help!" }
  ]
}
```

**Slash Commands:** Registered automatically on bot startup via Discord REST API.
