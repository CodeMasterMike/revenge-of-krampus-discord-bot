import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import type { PatternsFile } from '../types/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Convert pattern string (with * wildcards) to regex
export function patternToRegex(pattern: string): RegExp {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  const regexPattern = escaped.replace(/\*/g, '.*');
  return new RegExp(regexPattern, 'i');
}

// Load patterns from config file (relative to project root)
export function loadPatterns(): PatternsFile {
  const configPath = join(__dirname, '../../patterns.json');
  return JSON.parse(readFileSync(configPath, 'utf8')) as PatternsFile;
}
