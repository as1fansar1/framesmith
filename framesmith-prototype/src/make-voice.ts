import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { readBrand, readStoryboard } from './io.js';

async function synthesizeWithOpenAI(text: string): Promise<boolean> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return false;

  const model = process.env.OPENAI_TTS_MODEL || 'gpt-4o-mini-tts';
  const voice = process.env.OPENAI_TTS_VOICE || 'alloy';
  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      voice,
      input: text,
      format: 'mp3',
      instructions: 'Calm, confident, premium research explainer narration. Clear pacing, not hypey.',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI TTS failed: ${response.status} ${errorText}`);
  }

  await writeFile('render/voiceover.mp3', Buffer.from(await response.arrayBuffer()));
  await writeFile('render/voiceover-provider.txt', `openai:${model}:${voice}\n`);
  return true;
}

async function synthesizeWithMacSay(text: string): Promise<boolean> {
  const hasSay = spawnSync('bash', ['-lc', 'command -v say'], { encoding: 'utf8' });
  if (hasSay.status !== 0) return false;

  const voice = process.env.MACOS_TTS_VOICE || 'Samantha';
  await writeFile('render/narration-for-tts.txt', text);
  const say = spawnSync('say', ['-v', voice, '-f', 'render/narration-for-tts.txt', '-o', 'render/voiceover.aiff'], { stdio: 'inherit' });
  if (say.status !== 0) return false;

  const ffmpeg = spawnSync('ffmpeg', ['-y', '-i', 'render/voiceover.aiff', '-codec:a', 'libmp3lame', '-q:a', '4', 'render/voiceover.mp3'], { stdio: 'inherit' });
  if (ffmpeg.status !== 0) return false;

  await writeFile('render/voiceover-provider.txt', `macos-say:${voice}\n`);
  return true;
}

async function synthesizeSilence(totalSeconds: number): Promise<void> {
  const ffmpeg = spawnSync('ffmpeg', [
    '-y',
    '-f', 'lavfi',
    '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100',
    '-t', String(totalSeconds),
    '-codec:a', 'libmp3lame',
    'render/voiceover.mp3',
  ], { stdio: 'inherit' });
  if (ffmpeg.status !== 0) throw new Error(`Silent audio fallback failed with status ${ffmpeg.status}`);
  await writeFile('render/voiceover-provider.txt', 'silent-fallback\n');
}

async function main() {
  const storyboard = await readStoryboard();
  const brand = await readBrand();
  await mkdir('render', { recursive: true });
  await mkdir('exports', { recursive: true });

  const totalSeconds = storyboard.scenes.reduce((sum, scene) => sum + scene.duration_seconds, 0);
  const text = storyboard.scenes.map(scene => scene.voiceover).join('\n\n');
  await writeFile('render/voiceover-script.txt', text);

  let synthesized = false;
  synthesized = await synthesizeWithOpenAI(text);
  if (!synthesized) synthesized = await synthesizeWithMacSay(text);
  if (!synthesized) await synthesizeSilence(totalSeconds);

  if (existsSync('render/voiceover.mp3')) {
    await copyFile('render/voiceover.mp3', 'exports/voiceover.mp3');
  }

  const provider = existsSync('render/voiceover-provider.txt')
    ? (await readFile('render/voiceover-provider.txt', 'utf8')).trim()
    : 'unknown';
  console.log(`Wrote voiceover.mp3 via ${provider} for ${brand.brand_name}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
