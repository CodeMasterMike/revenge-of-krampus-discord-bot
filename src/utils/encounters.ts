import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import type { EncountersConfig } from '../types/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

let cachedConfig: EncountersConfig | null = null;

export function loadEncountersConfig(): EncountersConfig {
  if (!cachedConfig) {
    const configPath = join(__dirname, '../../encounters.json');
    cachedConfig = JSON.parse(readFileSync(configPath, 'utf8')) as EncountersConfig;
  }
  return cachedConfig;
}

export function rollEncounter(config: EncountersConfig): { type: 'react' | 'reply'; value: string } | null {
  if (Math.random() >= config.chance) return null;

  if (Math.random() < 0.5) {
    const emoji = config.emojis[Math.floor(Math.random() * config.emojis.length)];
    return { type: 'react', value: emoji };
  } else {
    const message = config.messages[Math.floor(Math.random() * config.messages.length)];
    return { type: 'reply', value: message };
  }
}

export function formatEncounterMessage(message: string, userId: string): string {
  return message.replace(/\{user\}/g, `<@${userId}>`);
}
