import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { loadWordCountConfig, getUserStats } from '../utils/wordcounter.js';

export const data = new SlashCommandBuilder()
  .setName('wordcount')
  .setDescription('Check how many times Krampus has caught you saying certain words...')
  .addUserOption(option =>
    option
      .setName('user')
      .setDescription('The user to check (defaults to yourself)')
      .setRequired(false)
  );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  const targetUser = interaction.options.getUser('user') || interaction.user;
  const stats = getUserStats(targetUser.id);
  const config = loadWordCountConfig();
  const milestones = config.milestones;

  if (!stats || Object.keys(stats.words).length === 0) {
    const emptyMessages = [
      `${targetUser} has managed to stay off Krampus's word list... for now.`,
      `Krampus has no records for ${targetUser}. Suspiciously clean...`,
      `${targetUser} has been silent. Krampus does not forget, only waits.`
    ];
    const msg = emptyMessages[Math.floor(Math.random() * emptyMessages.length)];
    await interaction.reply({ content: msg, flags: 64 });
    return;
  }

  const lines: string[] = [];
  const sortedWords = Object.entries(stats.words).sort((a, b) => b[1] - a[1]);

  for (const [word, count] of sortedWords) {
    const nextMilestone = milestones.find(m => m > count) || null;
    const progress = nextMilestone
      ? ` (next milestone: ${nextMilestone})`
      : ' (all milestones reached!)';
    lines.push(`**${word}**: ${count}${progress}`);
  }

  const header = targetUser.id === interaction.user.id
    ? `Krampus's records for you, <@${targetUser.id}>:`
    : `Krampus's records for <@${targetUser.id}>:`;

  const response = `${header}\n${lines.join('\n')}`;
  await interaction.reply({ content: response, flags: 64 });
}
