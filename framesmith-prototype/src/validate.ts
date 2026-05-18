import { stat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { readStoryboard, readBrand } from './io.js';

async function exists(path: string) {
  try { await stat(path); return true; } catch { return false; }
}

async function main() {
  const storyboard = await readStoryboard();
  await readBrand();
  if (storyboard.scenes.some(scene => !scene.source_ref.trim())) {
    throw new Error('Every scene must have a source_ref.');
  }
  const required = ['exports/video.mp4', 'exports/thumbnail.png', 'exports/social-copy.md', 'exports/captions.srt', 'exports/voiceover.mp3', 'render/captions.srt'];
  for (const path of required) {
    if (!(await exists(path))) throw new Error(`Missing ${path}`);
  }
  const probe = spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,duration', '-of', 'csv=p=0', 'exports/video.mp4'], { encoding: 'utf8' });
  if (probe.status !== 0) throw new Error(probe.stderr || 'ffprobe failed');
  const [width, height, durationRaw] = probe.stdout.trim().split(',');
  const duration = Number(durationRaw);
  if (width !== '1080' || height !== '1920') throw new Error(`Expected 1080x1920, got ${width}x${height}`);
  if (duration < 45 || duration > 60.5) throw new Error(`Expected 45-60s duration, got ${duration}`);
  console.log(`Validation passed: ${width}x${height}, ${duration.toFixed(1)}s, ${storyboard.scenes.length} scenes.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
