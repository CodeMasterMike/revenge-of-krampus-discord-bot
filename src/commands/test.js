import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('test')
  .setDescription('Basic test command');

export async function execute(interaction) {
  await interaction.reply('Hello! Bot is working.');
}
