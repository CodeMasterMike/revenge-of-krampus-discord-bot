import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import * as ready from './events/ready.js';
import * as messageCreate from './events/messageCreate.js';
import * as interactionCreate from './events/interactionCreate.js';
import type { BotEvent } from './types/index.js';

// Create Discord client with required intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, // Privileged - must enable in Developer Portal
  ]
});

// Register event handlers
const events: BotEvent[] = [ready, messageCreate, interactionCreate];
for (const event of events) {
  if (event.once) {
    client.once(event.name, (...args: unknown[]) => event.execute(...args));
  } else {
    client.on(event.name, (...args: unknown[]) => event.execute(...args));
  }
}

// Login to Discord
client.login(process.env.DISCORD_TOKEN);
