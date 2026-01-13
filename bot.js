import 'dotenv/config';
import { Client, GatewayIntentBits, Events, REST, Routes, SlashCommandBuilder } from 'discord.js';
import { readFileSync } from 'fs';

// Load patterns from config
const patternsConfig = JSON.parse(readFileSync('./patterns.json', 'utf8'));

// Create Discord client with required intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, // Privileged - must enable in Developer Portal
  ]
});

// Convert pattern string (with * wildcards) to regex
function patternToRegex(pattern) {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  const regexPattern = escaped.replace(/\*/g, '.*');
  return new RegExp(regexPattern, 'i');
}

// Define slash commands
const commands = [
  new SlashCommandBuilder()
    .setName('test')
    .setDescription('Basic test command')
    .toJSON()
];

// Register commands on startup
async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
  try {
    console.log('Registering slash commands...');
    await rest.put(
      Routes.applicationCommands(process.env.APP_ID),
      { body: commands }
    );
    console.log('Slash commands registered.');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
}

// Handle ready event
client.once(Events.ClientReady, (c) => {
  console.log(`Logged in as ${c.user.tag}`);
  registerCommands();
});

// Handle slash commands
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'test') {
    await interaction.reply('Hello! Bot is working.');
  }
});

// Handle message monitoring
client.on(Events.MessageCreate, async (message) => {
  // Ignore bot messages to prevent loops
  if (message.author.bot) return;

  const content = message.content;
  console.log(`[DEBUG] Message from ${message.author.tag} in #${message.channel.name}: "${content}"`);

  for (const patternConfig of patternsConfig.patterns) {
    const regex = patternToRegex(patternConfig.pattern);
    const matched = regex.test(content);
    console.log(`[DEBUG]   Pattern "${patternConfig.pattern}" (${regex}) → ${matched ? 'MATCH' : 'no match'}`);

    if (matched) {
      try {
        if (patternConfig.type === 'react') {
          console.log(`[DEBUG]   → Reacting with: ${patternConfig.emoji}`);
          await message.react(patternConfig.emoji);
        } else if (patternConfig.type === 'reply') {
          console.log(`[DEBUG]   → Replying with: ${patternConfig.message}`);
          await message.reply(patternConfig.message);
        }
      } catch (error) {
        console.error(`Error processing pattern "${patternConfig.pattern}":`, error);
      }
      break; // Stop after first match
    }
  }
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN);
