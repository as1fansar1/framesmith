import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { readBrand, readStoryboard, escapeHtml } from './io.js';
import type { Brand, Scene } from './schema.js';

const WIDTH = 1080;
const HEIGHT = 1920;

function repoCards(scene: Scene, brand: Brand): string {
  if (scene.type !== 'evidence') return '';
  const repos = [
    ['mattpocock/skills', '89k★', 'engineering skills'],
    ['andrej-karpathy-skills', '134k★', 'Claude guidelines'],
    ['addyosmani/agent-skills', '43k★', 'agent workflows'],
  ];
  return `<div class="repo-grid">${repos.map(([name, stars, note]) => `
    <div class="repo-card">
      <div class="repo-name">${name}</div>
      <div class="repo-meta"><span>${stars}</span><span>${note}</span></div>
    </div>`).join('')}</div>`;
}

function frameworkCards(scene: Scene): string {
  if (scene.type !== 'framework') return '';
  return `<div class="capability-grid">${['Plan', 'Review', 'Test', 'Document', 'Repeat'].map(x => `<div class="capability">${x}</div>`).join('')}</div>`;
}

function layerDiagram(scene: Scene): string {
  if (scene.type !== 'cta') return '';
  return `<div class="layers">${['Models', 'Agents', 'Skills', 'Artifacts'].map((x, i) => `<div class="layer" style="--i:${i}">${x}</div>`).join('')}</div>`;
}

function comparison(scene: Scene): string {
  if (scene.type !== 'shift') return '';
  return `<div class="compare"><div><b>Model intelligence</b><span>bigger brains</span></div><div><b>Workflow reliability</b><span>repeatable habits</span></div></div>`;
}

function promptToChecklist(scene: Scene): string {
  if (scene.type !== 'claim') return '';
  return `<div class="transform"><div class="bubble">one-off prompt</div><div class="arrow">→</div><div class="checklist"><span>plan</span><span>verify</span><span>ship</span></div></div>`;
}

function sceneHtml(scene: Scene, index: number, total: number, brand: Brand): string {
  const progress = Math.round(((index + 1) / total) * 100);
  const kicker = scene.type.replace('-', ' ').toUpperCase();
  const body = scene.body ? `<p class="body">${escapeHtml(scene.body)}</p>` : '';
  const citation = scene.citation_visible ? `<div class="citation">Source: ${escapeHtml(scene.source_ref)}</div>` : '';
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    :root {
      --bg: ${brand.colors.background};
      --surface: ${brand.colors.surface};
      --primary: ${brand.colors.primary};
      --accent: ${brand.colors.accent};
      --text: ${brand.colors.text};
      --muted: ${brand.colors.muted};
    }
    * { box-sizing: border-box; }
    body { margin: 0; width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: var(--text); background: radial-gradient(circle at 20% 10%, rgba(124,218,255,.25), transparent 28%), radial-gradient(circle at 90% 25%, rgba(183,255,90,.16), transparent 24%), var(--bg); }
    .frame { position: relative; width: ${WIDTH}px; height: ${HEIGHT}px; padding: 96px 76px; display: flex; flex-direction: column; justify-content: space-between; }
    .grid-bg { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px); background-size: 54px 54px; mask-image: linear-gradient(to bottom, black, transparent 90%); }
    .top { position: relative; display: flex; justify-content: space-between; align-items: center; color: var(--muted); font-size: 28px; letter-spacing: .12em; text-transform: uppercase; }
    .brand { color: var(--primary); }
    .content { position: relative; margin-top: 80px; }
    .kicker { color: var(--accent); font-size: 30px; font-weight: 800; letter-spacing: .14em; margin-bottom: 36px; }
    h1 { font-size: ${scene.type === 'hook' ? 88 : 72}px; line-height: .98; letter-spacing: -0.06em; margin: 0; text-wrap: balance; }
    h1 .accent, .skills-word { color: var(--accent); text-shadow: 0 0 36px rgba(183,255,90,.35); }
    .body { font-size: 40px; line-height: 1.22; color: var(--muted); margin-top: 34px; max-width: 900px; }
    .visual { margin-top: 54px; }
    .repo-grid { display: grid; gap: 22px; }
    .repo-card, .capability, .compare > div, .bubble, .checklist, .layer { border: 1px solid rgba(255,255,255,.12); background: rgba(17,24,39,.78); box-shadow: 0 24px 80px rgba(0,0,0,.28); backdrop-filter: blur(18px); border-radius: 28px; }
    .repo-card { padding: 30px; }
    .repo-name { font-size: 34px; font-weight: 850; color: var(--text); }
    .repo-meta { margin-top: 16px; color: var(--muted); font-size: 26px; display: flex; justify-content: space-between; }
    .capability-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }
    .capability { padding: 30px; font-size: 38px; font-weight: 850; text-align: center; }
    .compare { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .compare > div { padding: 34px; min-height: 190px; }
    .compare b { font-size: 33px; display:block; color: var(--primary); }
    .compare span { display:block; margin-top: 24px; font-size: 30px; color: var(--muted); }
    .transform { display:flex; align-items:center; gap:22px; }
    .bubble, .checklist { padding: 30px; font-size: 30px; }
    .arrow { color: var(--accent); font-size: 58px; font-weight: 900; }
    .checklist { display:grid; gap:12px; color: var(--accent); }
    .layers { display:grid; gap:18px; }
    .layer { padding: 24px 34px; font-size: 34px; font-weight: 850; transform: translateX(calc(var(--i) * 36px)); border-color: rgba(124,218,255,.22); }
    .citation { position: relative; color: var(--muted); font-size: 22px; margin-top: 28px; padding: 18px 22px; border-left: 4px solid var(--primary); background: rgba(124,218,255,.08); border-radius: 12px; }
    .caption { position: relative; font-size: 34px; line-height: 1.25; color: var(--text); background: rgba(0,0,0,.45); border: 1px solid rgba(255,255,255,.1); border-radius: 24px; padding: 24px 28px; box-shadow: 0 18px 60px rgba(0,0,0,.24); }
    .progress { position: absolute; left: 76px; right: 76px; bottom: 52px; height: 8px; background: rgba(255,255,255,.1); border-radius: 999px; overflow: hidden; }
    .progress span { display:block; width: ${progress}%; height: 100%; background: linear-gradient(90deg, var(--primary), var(--accent)); }
  </style>
</head>
<body>
  <main class="frame">
    <div class="grid-bg"></div>
    <section class="top"><span class="brand">${escapeHtml(brand.brand_name)}</span><span>${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span></section>
    <section class="content">
      <div class="kicker">${kicker}</div>
      <h1>${escapeHtml(scene.headline).replaceAll('skills', '<span class="skills-word">skills</span>').replaceAll('SKILLS', '<span class="skills-word">SKILLS</span>')}</h1>
      ${body}
      <div class="visual">${repoCards(scene, brand)}${promptToChecklist(scene)}${frameworkCards(scene)}${comparison(scene)}${layerDiagram(scene)}</div>
      ${citation}
    </section>
    <section class="caption">${escapeHtml(scene.voiceover)}</section>
    <div class="progress"><span></span></div>
  </main>
</body>
</html>`;
}

async function main() {
  const storyboard = await readStoryboard();
  const brand = await readBrand();
  await mkdir('render/scenes', { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 });
  const allScenes: string[] = [];

  for (const [index, scene] of storyboard.scenes.entries()) {
    const html = sceneHtml(scene, index, storyboard.scenes.length, brand);
    await writeFile(`render/${scene.id}.html`, html);
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.screenshot({ path: `render/scenes/${scene.id}.png`, fullPage: false });
    allScenes.push(`<section style="width:${WIDTH}px;height:${HEIGHT}px">${html}</section>`);
  }

  const first = storyboard.scenes[0];
  await page.setContent(sceneHtml({ ...first, headline: "AI's new GitHub trend:", body: 'SKILLS\nThe workflow layer is here' }, 0, storyboard.scenes.length, brand), { waitUntil: 'networkidle' });
  await mkdir('exports', { recursive: true });
  await page.screenshot({ path: 'exports/thumbnail.png', fullPage: false });
  await browser.close();

  await writeFile('render/scenes.html', allScenes.join('\n'));
  console.log(`Rendered ${storyboard.scenes.length} scenes and thumbnail.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
