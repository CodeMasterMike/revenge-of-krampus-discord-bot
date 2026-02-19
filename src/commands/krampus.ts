import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

const krampusFacts = [
  'Krampus originates from Germanic Alpine folklore and has been celebrated for centuries.',
  'The name "Krampus" comes from the German word "Krampen", meaning claw.',
  'Krampusnacht (Krampus Night) is celebrated on December 5th, the eve of St. Nicholas Day.',
  'Krampus carries birch branches called "ruten" to swat naughty children.',
  'In tradition, Krampus stuffs especially wicked children into his basket and carries them away.',
  'Krampus is often depicted with one cloven hoof and one human foot.',
  'In Austria, young men dress as Krampus and roam the streets during Krampuslauf (Krampus Run).',
  'Krampus was banned by the Austrian government in 1934 under the Dollfuss regime, but the tradition survived.',
  'Krampus is the dark companion of St. Nicholas — one rewards the good, the other punishes the bad.',
  'Victorian-era Krampus greeting cards were popular in Europe and are now highly collectible.',
  'Krampus carries heavy chains, which he rattles to announce his arrival.',
  'Some Krampus legends say he drags the naughtiest children straight down to the underworld.',
  'In parts of Bavaria, Krampus is known as "Knecht Ruprecht" or "Dark Servant."',
  'The first known Krampus imagery dates back to the 17th century.',
  'Krampus celebrations have spread worldwide, with Krampus runs now held in cities across the US and Europe.',
  'Traditional Krampus masks are hand-carved from wood and can take weeks to create.',
  'In some regions, Krampus is accompanied by other frightening figures like Perchta and the Wild Hunt.',
  'Krampus bells, called "Schellen", are large cowbells worn around the waist during Krampus runs.',
  'The Catholic Church once tried to ban Krampus celebrations, calling them un-Christian.',
  'Legend says if you hear chains rattling on the night of December 5th, Krampus is near.',
];

export const data = new SlashCommandBuilder()
  .setName('krampus')
  .setDescription('Get a random Krampus fun fact');

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  const fact = krampusFacts[Math.floor(Math.random() * krampusFacts.length)];
  await interaction.reply(`🐐 **Krampus Fact:** ${fact}`);
}
