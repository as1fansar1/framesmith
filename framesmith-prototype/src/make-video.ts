import { mkdir, writeFile, copyFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { readStoryboard } from './io.js';

async function main() {
  const storyboard = await readStoryboard();
  await mkdir('exports', { recursive: true });
  const concatLines: string[] = [];

  for (const scene of storyboard.scenes) {
    const image = resolve(`render/scenes/${scene.id}.png`).replaceAll("'", "'\\''");
    concatLines.push(`file '${image}'`);
    concatLines.push(`duration ${scene.duration_seconds}`);
  }
  await writeFile('render/concat.txt', concatLines.join('\n'));

  const ffmpeg = spawnSync('ffmpeg', [
    '-y',
    '-f', 'concat',
    '-safe', '0',
    '-i', 'render/concat.txt',
    '-vf', 'fps=30,scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,format=yuv420p',
    '-movflags', '+faststart',
    'exports/video.mp4',
  ], { stdio: 'inherit' });

  if (ffmpeg.status !== 0) {
    throw new Error(`ffmpeg failed with status ${ffmpeg.status}`);
  }

  await copyFile('render/captions.srt', 'exports/captions.srt');
  await writeFile('exports/social-copy.md', `## LinkedIn/X post\n\nThe fastest-growing AI repos on GitHub right now are not just apps.\n\nThey are skills: reusable operating procedures for agents.\n\nThat matters because the bottleneck is shifting from model intelligence to workflow reliability.\n\nWatch the layer that teaches agents how to work.\n\n#AI #Agents #GitHub #ClaudeCode #Codex\n`);
  console.log('Wrote exports/video.mp4, exports/thumbnail.png, exports/social-copy.md, and exports/captions.srt');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
