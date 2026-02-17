import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Convert pattern string (with * wildcards) to regex
export function patternToRegex(pattern) {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  const regexPattern = escaped.replace(/\*/g, '.*');
  return new RegExp(regexPattern, 'i');
}

// Load patterns from config file (relative to project root)
export function loadPatterns() {
  const configPath = join(__dirname, '../../patterns.json');
  return JSON.parse(readFileSync(configPath, 'utf8'));
}
