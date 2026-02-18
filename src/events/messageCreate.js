import { Events } from 'discord.js';
import { patternToRegex, loadPatterns } from '../utils/patterns.js';
import {
  loadWordCountConfig,
  findTrackedWords,
  updateWordCounts,
  checkMilestone,
  formatMilestoneMessage
} from '../utils/wordcounter.js';

const patternsConfig = loadPatterns();
const wordCountConfig = loadWordCountConfig();

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

  // Word counting — track all occurrences of configured words
  const wordOccurrences = findTrackedWords(content, wordCountConfig.trackedWords);
  if (Object.keys(wordOccurrences).length > 0) {
    console.log(`[DEBUG] Tracked words found:`, wordOccurrences);

    const results = updateWordCounts(message.author.id, message.author.username, wordOccurrences);

    // Check for milestones — only announce the highest one
    let highestMilestoneResult = null;
    let highestMilestoneValue = 0;

    for (const { word, previousCount, newCount } of results) {
      const milestone = checkMilestone(previousCount, newCount, wordCountConfig.milestones);
      if (milestone && milestone > highestMilestoneValue) {
        highestMilestoneValue = milestone;
        highestMilestoneResult = { word, count: milestone };
      }
    }

    if (highestMilestoneResult) {
      const templates = wordCountConfig.milestoneMessages;
      const template = templates[Math.floor(Math.random() * templates.length)];
      const callout = formatMilestoneMessage(
        template,
        `<@${message.author.id}>`,
        highestMilestoneResult.word,
        highestMilestoneResult.count
      );
      console.log(`[DEBUG] Milestone reached! Sending callout: ${callout}`);
      try {
        await message.channel.send(callout);
      } catch (error) {
        console.error('Error sending milestone callout:', error);
      }
    }
  }
}
