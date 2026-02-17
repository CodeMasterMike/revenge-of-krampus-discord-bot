import { Events } from 'discord.js';
import { patternToRegex, loadPatterns } from '../utils/patterns.js';

const patternsConfig = loadPatterns();

export const name = Events.MessageCreate;
export const once = false;

export async function execute(message) {
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
}
