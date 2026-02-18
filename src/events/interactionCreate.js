import { Collection, Events } from 'discord.js';
import * as testCommand from '../commands/test.js';
import * as wordcountCommand from '../commands/wordcount.js';

const commands = new Collection();
commands.set(testCommand.data.name, testCommand);
commands.set(wordcountCommand.data.name, wordcountCommand);

export const name = Events.InteractionCreate;
export const once = false;

export async function execute(interaction) {
  console.log(`[DEBUG] Slash command received: /${interaction.commandName} by ${interaction.user.tag}`);
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error handling /${interaction.commandName}:`, error.message);
  }
}
