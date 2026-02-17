import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import * as ready from './src/events/ready.js';
import * as messageCreate from './src/events/messageCreate.js';
import * as interactionCreate from './src/events/interactionCreate.js';

// Create Discord client with required intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, // Privileged - must enable in Developer Portal
  ]
});

// Register event handlers
const events = [ready, messageCreate, interactionCreate];
for (const event of events) {
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// Login to Discord
client.login(process.env.DISCORD_TOKEN);
