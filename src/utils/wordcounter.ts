import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { WordCountConfig, CountData, UserWordData, UpdateResult, WordOccurrences } from '../types/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '../..');
const configPath = join(projectRoot, 'wordcounts.json');
const dataDir = join(projectRoot, 'data');
const dataPath = join(dataDir, 'wordcounts-data.json');

// Cached config loaded once at startup
let cachedConfig: WordCountConfig | null = null;

export function loadWordCountConfig(): WordCountConfig {
  if (!cachedConfig) {
    cachedConfig = JSON.parse(readFileSync(configPath, 'utf8')) as WordCountConfig;
  }
  return cachedConfig;
}

export function loadCountData(): CountData {
  if (!existsSync(dataPath)) {
    return {};
  }
  return JSON.parse(readFileSync(dataPath, 'utf8')) as CountData;
}

export function saveCountData(data: CountData): void {
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }
  writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
}

/**
 * Find all tracked words in message content and count occurrences.
 * Returns an object like { "christmas": 3, "santa": 1 }
 */
export function findTrackedWords(content: string, trackedWords: string[]): WordOccurrences {
  const occurrences: WordOccurrences = {};
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
export function updateWordCounts(userId: string, username: string, wordOccurrences: WordOccurrences): UpdateResult[] {
  const data = loadCountData();

  if (!data[userId]) {
    data[userId] = { username, words: {} };
  }
  data[userId].username = username;

  const results: UpdateResult[] = [];

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
export function checkMilestone(previousCount: number, newCount: number, milestones: number[]): number | null {
  let highest: number | null = null;

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
export function formatMilestoneMessage(template: string, user: string, word: string, count: number): string {
  return template
    .replace(/\{user\}/g, user)
    .replace(/\{word\}/g, word)
    .replace(/\{count\}/g, String(count));
}

/**
 * Get a user's word count stats. Returns null if no data exists.
 */
export function getUserStats(userId: string): UserWordData | null {
  const data = loadCountData();
  return data[userId] || null;
}
