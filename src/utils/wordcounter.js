import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '../..');
const configPath = join(projectRoot, 'wordcounts.json');
const dataDir = join(projectRoot, 'data');
const dataPath = join(dataDir, 'wordcounts-data.json');

// Cached config loaded once at startup
let cachedConfig = null;

export function loadWordCountConfig() {
  if (!cachedConfig) {
    cachedConfig = JSON.parse(readFileSync(configPath, 'utf8'));
  }
  return cachedConfig;
}

export function loadCountData() {
  if (!existsSync(dataPath)) {
    return {};
  }
  return JSON.parse(readFileSync(dataPath, 'utf8'));
}

export function saveCountData(data) {
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }
  writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
}

/**
 * Find all tracked words in message content and count occurrences.
 * Returns an object like { "christmas": 3, "santa": 1 }
 */
export function findTrackedWords(content, trackedWords) {
  const occurrences = {};
  const lowerContent = content.toLowerCase();

  for (const word of trackedWords) {
    const regex = new RegExp(`\\b${word}`, 'gi');
    const matches = lowerContent.match(regex);
    if (matches) {
      occurrences[word] = matches.length;
    }
  }

  return occurrences;
}

/**
 * Update persisted word counts for a user.
 * Returns an array of { word, previousCount, newCount } for milestone checking.
 */
export function updateWordCounts(userId, username, wordOccurrences) {
  const data = loadCountData();

  if (!data[userId]) {
    data[userId] = { username, words: {} };
  }
  data[userId].username = username;

  const results = [];

  for (const [word, count] of Object.entries(wordOccurrences)) {
    const previousCount = data[userId].words[word] || 0;
    const newCount = previousCount + count;
    data[userId].words[word] = newCount;
    results.push({ word, previousCount, newCount });
  }

  saveCountData(data);
  return results;
}

/**
 * Check if a milestone was crossed between previousCount and newCount.
 * Returns the highest crossed milestone, or null.
 */
export function checkMilestone(previousCount, newCount, milestones) {
  let highest = null;

  for (const milestone of milestones) {
    if (previousCount < milestone && newCount >= milestone) {
      highest = milestone;
    }
  }

  return highest;
}

/**
 * Replace {user}, {word}, {count} placeholders in a template string.
 */
export function formatMilestoneMessage(template, user, word, count) {
  return template
    .replace(/\{user\}/g, user)
    .replace(/\{word\}/g, word)
    .replace(/\{count\}/g, String(count));
}

/**
 * Get a user's word count stats. Returns null if no data exists.
 */
export function getUserStats(userId) {
  const data = loadCountData();
  return data[userId] || null;
}
