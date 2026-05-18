import { mkdir, writeFile } from 'node:fs/promises';
import { readStoryboard, formatTime } from './io.js';

async function main() {
  const storyboard = await readStoryboard();
  await mkdir('render', { recursive: true });
  let cursor = 0;
  const srt: string[] = [];
  const timings = [];
  const narration: string[] = [`# ${storyboard.title}`, ''];

  storyboard.scenes.forEach((scene, index) => {
    const start = cursor;
    const end = cursor + scene.duration_seconds;
    srt.push(String(index + 1));
    srt.push(`${formatTime(start)} --> ${formatTime(end)}`);
    srt.push(scene.voiceover);
    srt.push('');
    timings.push({ id: scene.id, start, end, duration_seconds: scene.duration_seconds });
    narration.push(`## ${scene.id}`);
    narration.push(scene.voiceover);
    narration.push('');
    cursor = end;
  });

  await writeFile('render/captions.srt', srt.join('\n'));
  await writeFile('render/timings.json', JSON.stringify(timings, null, 2));
  await writeFile('render/narration.md', narration.join('\n'));
  console.log(`Wrote captions and timings (${cursor}s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
