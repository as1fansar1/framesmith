import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { readStoryboard } from './io.js';

function run(command: string, args: string[]) {
  const result = spawnSync(command, args, { stdio: 'inherit' });
  if (result.status !== 0) {
    throw new Error(`${command} failed with status ${result.status}`);
  }
}

function shellEscapeForConcat(path: string): string {
  return resolve(path).replaceAll("'", "'\\''");
}

async function main() {
  const storyboard = await readStoryboard();
  await mkdir('render/segments', { recursive: true });
  await mkdir('exports', { recursive: true });

  const segmentFiles: string[] = [];

  for (const [index, scene] of storyboard.scenes.entries()) {
    const input = `render/scenes/${scene.id}.png`;
    const output = `render/segments/${scene.id}.mp4`;
    const frames = Math.round(scene.duration_seconds * 30);
    const direction = index % 2 === 0 ? 'in' : 'out';
    const zoom = direction === 'in'
      ? `z='min(zoom+0.00042,1.035)'`
      : `z='max(1.035-on*0.00042,1.0)'`;
    const xDrift = index % 3 === 0 ? `x='iw/2-(iw/zoom/2)+sin(on/38)*10'` : `x='iw/2-(iw/zoom/2)-sin(on/42)*8'`;
    const yDrift = index % 3 === 1 ? `y='ih/2-(ih/zoom/2)+cos(on/45)*9'` : `y='ih/2-(ih/zoom/2)'`;

    run('ffmpeg', [
      '-y',
      '-loop', '1',
      '-i', input,
      '-vf', `scale=1140:2027,crop=1080:1920,zoompan=${zoom}:d=${frames}:s=1080x1920:${xDrift}:${yDrift}:fps=30,format=yuv420p`,
      '-t', String(scene.duration_seconds),
      '-r', '30',
      '-an',
      output,
    ]);

    segmentFiles.push(output);
  }

  await writeFile('render/segments.txt', segmentFiles.map(file => `file '${shellEscapeForConcat(file)}'`).join('\n'));

  run('ffmpeg', [
    '-y',
    '-f', 'concat',
    '-safe', '0',
    '-i', 'render/segments.txt',
    '-c', 'copy',
    'render/video-silent.mp4',
  ]);

  if (existsSync('render/voiceover.mp3')) {
    run('ffmpeg', [
      '-y',
      '-i', 'render/video-silent.mp4',
      '-i', 'render/voiceover.mp3',
      '-filter_complex', '[1:a]apad=whole_dur=60,volume=0.95[a]',
      '-map', '0:v:0',
      '-map', '[a]',
      '-c:v', 'copy',
      '-c:a', 'aac',
      '-b:a', '160k',
      '-shortest',
      '-movflags', '+faststart',
      'exports/video.mp4',
    ]);
  } else {
    await copyFile('render/video-silent.mp4', 'exports/video.mp4');
  }

  await copyFile('render/captions.srt', 'exports/captions.srt');
  await writeFile('exports/social-copy.md', `## LinkedIn/X post\n\nThe fastest-growing AI repos on GitHub right now are not just apps.\n\nThey are skills: reusable operating procedures for agents.\n\nThat matters because the bottleneck is shifting from model intelligence to workflow reliability.\n\nWatch the layer that teaches agents how to work.\n\n#AI #Agents #GitHub #ClaudeCode #Codex\n`);
  console.log('Wrote animated exports/video.mp4, exports/thumbnail.png, exports/social-copy.md, exports/captions.srt, and optional exports/voiceover.mp3');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
