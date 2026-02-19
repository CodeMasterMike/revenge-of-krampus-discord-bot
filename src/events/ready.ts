import { Client, Events, REST, Routes } from 'discord.js';
import * as testCommand from '../commands/test.js';
import * as wordcountCommand from '../commands/wordcount.js';
import type { BotCommand } from '../types/index.js';

const commands: BotCommand[] = [testCommand, wordcountCommand];

export const name = Events.ClientReady;
export const once = true;

export async function execute(c: Client<true>): Promise<void> {
  console.log(`Logged in as ${c.user.tag}`);

  // Register slash commands
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);
  try {
    console.log('Registering slash commands...');
    await rest.put(
      Routes.applicationCommands(process.env.APP_ID!),
      { body: commands.map(cmd => cmd.data.toJSON()) }
    );
    console.log('Slash commands registered.');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
}
