import { readFile } from 'node:fs/promises';
import { BrandSchema, StoryboardSchema } from './schema.js';

export async function readJson<T>(path: string, schema: { parse: (value: unknown) => T }): Promise<T> {
  const raw = await readFile(path, 'utf8');
  return schema.parse(JSON.parse(raw));
}

export async function readBrand(path = 'demo/brand.json') {
  return readJson(path, BrandSchema);
}

export async function readStoryboard(path = 'demo/storyboard.json') {
  return readJson(path, StoryboardSchema);
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function formatTime(seconds: number): string {
  const ms = Math.round((seconds % 1) * 1000);
  const totalSeconds = Math.floor(seconds);
  const s = totalSeconds % 60;
  const m = Math.floor(totalSeconds / 60) % 60;
  const h = Math.floor(totalSeconds / 3600);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
}
