import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

const responses = [
  // Extremely positive
  'The stars align in your favor — absolutely yes!',
  'Without a single doubt in any realm.',
  'Even Krampus smiles upon this — YES!',
  'Fate itself has already decided: yes.',
  'A resounding, thunderous YES.',

  // Positive
  'Yes, and it will be glorious.',
  'All signs point to yes.',
  'The chains rattle in agreement.',
  'It is certain.',
  'Most definitely.',
  'You may rely on it.',
  'Yes — but do not squander this fortune.',
  'The birch rod bends in your favor.',

  // Mildly positive
  'Outlook good.',
  'Signs are looking favorable.',
  'Probably yes, but tread carefully.',
  'I sense good tidings ahead.',
  'More likely than not.',

  // Neutral / uncertain
  'The shadows are unclear... ask again.',
  'Even Krampus cannot see through this fog.',
  'The answer hides behind the veil — try again.',
  'Concentrate and ask once more.',
  'The chains are silent on this matter.',
  'Hard to say... the darkness shifts.',

  // Mildly negative
  'I would not count on it.',
  'The outlook is not great.',
  'Doubtful, but stranger things have happened.',
  'The odds are against you.',
  'My sources say no.',

  // Negative
  'No. And do not ask again.',
  'The answer is no. Accept your fate.',
  'Absolutely not.',
  'Not a chance in this frozen wasteland.',
  'The birch rod says NO.',
  'Krampus laughs at the very idea.',

  // Extremely negative
  'No — and you should be afraid you even asked.',
  'Not only no, but you have been added to the naughty list for asking.',
  'The basket awaits anyone foolish enough to hope for this.',
  'Krampus has heard your question and weeps at your audacity.',
  'No. Now run before the bells get closer.',
];

export const data = new SlashCommandBuilder()
  .setName('8ball')
  .setDescription('Ask Krampus\'s magic 8-ball a question')
  .addStringOption(option =>
    option
      .setName('question')
      .setDescription('The question you dare to ask')
      .setRequired(false)
  );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  const question = interaction.options.getString('question');
  const response = responses[Math.floor(Math.random() * responses.length)];
  const header = question ? `🎱 **${question}**` : '🎱';
  await interaction.reply(`${header}\n\n${response}`);
}
