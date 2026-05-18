# FrameSmith Prototype Spec

> **For Hermes:** Use the `prototype` skill if building a throwaway proof of concept from this spec. Use `writing-plans` before turning it into production work.

**Goal:** Prove that FrameSmith can turn one real Source Artifact into a claim-backed 45–60 second vertical premium research explainer video package.

**Architecture:** Build a local-owned, file-first prototype with a generated project folder. The prototype may use hand-authored/LLM-assisted intermediate files for the first demo, but the folder structure and schemas should match the eventual CLI pipeline.

**Tech Stack:** Node/TypeScript, Zod, Playwright, HTML/CSS scene templates, FFmpeg, optional BYOK TTS, markdown/JSON project files.

---

## 1. Product summary

**FrameSmith** is a local-owned, BYOK-powered creator tool that turns articles, PDFs, research reports, notes, or curated source bundles into claim-backed 45–60 second vertical premium research explainer video packages.

The prototype is not a full product. It exists to answer one question:

> Can a source-grounded project-folder pipeline produce a private-demo-quality vertical explainer video that feels premium enough to justify building V1?

## 2. First ICP

Technical founders, indie hackers, and expert creators who publish product-building, AI-tool, and educational content weekly.

They already collect source material such as articles, PDFs, research reports, notes, and curated links. They need to convert that material into consistent short-form assets without becoming full-time video editors.

## 3. First demo source

Use the existing report:

```text
.hermes/reports/2026-05-18-github-popular-lately.md
```

Demo angle:

> The GitHub trend every AI builder should watch: agent skills.

Working title:

> The fastest-growing AI repos are not apps — they are skills.

## 4. Prototype output

The prototype should produce one local project folder:

```text
framesmith-demo-agent-skills/
  source/
    original.md
    extracted.md
  brief.md
  angles.json
  selected-angle.md
  script.md
  storyboard.json
  brand.json
  render/
    scenes.html
    scenes/
      001-hook.png
      002-evidence.png
      003-meaning.png
      004-shift.png
      005-why-it-matters.png
      006-cta.png
    voiceover.mp3          # optional if TTS key exists
    narration.md
    captions.srt
    timings.json
  exports/
    video.mp4
    thumbnail.png
    social-copy.md
```

Required final artifacts:

- `exports/video.mp4`
- `exports/thumbnail.png`
- `exports/social-copy.md`
- `storyboard.json`
- `script.md`

## 5. Definition of done

The prototype is done when:

1. A 9:16 MP4 is generated locally.
2. The video is 45–60 seconds long.
3. It contains at least five scenes.
4. It uses the Premium Research Explainer style:
   - dark background
   - large readable typography
   - subtle motion or polished static cards
   - clean captions
   - source/evidence cards where useful
5. Every key script beat has a `source_ref` in `storyboard.json`.
6. The video uses no AI-generated video clips.
7. It can be regenerated after editing `script.md` or `storyboard.json`.
8. It is good enough to show privately as a demo, not good enough to replace CapCut or Canva.

## 6. Non-goals

Do not build these in the prototype:

- full web UI
- login/accounts
- hosted backend
- social publishing/scheduling
- long-video clipping
- AI avatar generation
- AI-generated B-roll/video clips
- full timeline editor
- multi-brand workspace
- analytics
- automatic virality scoring
- external research enrichment unless sources are manually added

## 7. Brand profile

Create `brand.json`:

```json
{
  "brand_name": "Asif's AI Notes",
  "voice": "clear, curious, confident, practical, not hypey",
  "audience": "technical founders, indie hackers, and AI builders",
  "colors": {
    "background": "#080A0F",
    "surface": "#111827",
    "primary": "#7CDAFF",
    "accent": "#B7FF5A",
    "text": "#F5F7FA",
    "muted": "#94A3B8"
  },
  "font_style": "modern sans",
  "logo_path": null,
  "cta_style": "soft follow for practical AI workflow breakdowns"
}
```

## 8. Source brief

Create `brief.md` from the GitHub trends report.

It should include:

- source title
- 5–8 key claims
- evidence snippets
- candidate hooks
- risk/limitation notes

Suggested key claims:

1. Agent skills are one of the strongest current GitHub momentum clusters.
2. Repos like `mattpocock/skills`, `multica-ai/andrej-karpathy-skills`, and `addyosmani/agent-skills` show the pattern.
3. The core idea is portable operating procedures for AI coding agents.
4. The trend extends beyond coding into design, video, security, and finance workflows.
5. The useful insight is not “another app,” but a new workflow layer between prompts and tools.
6. GitHub stars are directional momentum, not definitive adoption proof.

## 9. Angles

Create `angles.json` with three options:

```json
[
  {
    "id": "agent-skills-are-new-plugins",
    "title": "Agent skills are the new plugins",
    "hook": "The fastest-growing AI repos on GitHub are not apps. They are skills.",
    "why": "Frames the trend in a memorable category shift."
  },
  {
    "id": "coding-agents-need-operating-procedures",
    "title": "Coding agents need operating procedures",
    "hook": "AI coding agents do not just need better models. They need better habits.",
    "why": "Explains why skill repos matter practically."
  },
  {
    "id": "from-prompts-to-workflows",
    "title": "From prompts to workflows",
    "hook": "The next layer of AI tooling is not prompts. It is reusable workflows.",
    "why": "Connects coding-agent skills to broader creator and automation tools."
  }
]
```

Selected angle for the prototype:

```text
agent-skills-are-new-plugins
```

## 10. Script

Create `script.md` with a 45–60 second narration.

Draft script:

```markdown
# The fastest-growing AI repos are not apps — they are skills

The fastest-growing AI repos on GitHub right now are not just new apps.
They are skills.

Repos like Matt Pocock's engineering skills, Karpathy-inspired Claude guidelines, and Addy Osmani's agent skills are all pointing at the same shift.

AI agents are moving from one-off prompts to reusable operating procedures.

A skill tells the agent how to plan, review code, avoid overengineering, write better docs, or follow a repeatable workflow.

That matters because the bottleneck is no longer just model intelligence.
It is reliability.

The bigger pattern is spreading: design tools, video renderers, security scanners, and finance agents are all becoming agent-native.

So the thing to watch is not just which AI app trends next.
Watch the workflow layer that teaches agents how to work.
```

Target duration: about 55 seconds with calm narration.

## 11. Storyboard schema

Use this shape for `storyboard.json`:

```ts
type Storyboard = {
  title: string;
  duration_seconds_target: number;
  aspect_ratio: "9:16";
  style: "premium-research-explainer";
  scenes: Scene[];
};

type Scene = {
  id: string;
  type: "hook" | "evidence" | "claim" | "framework" | "shift" | "cta";
  duration_seconds: number;
  voiceover: string;
  headline: string;
  body?: string;
  visual: string;
  source_ref: string;
  citation_visible: boolean;
};
```

## 12. Storyboard draft

Create `storyboard.json` with six scenes:

```json
{
  "title": "The fastest-growing AI repos are not apps — they are skills",
  "duration_seconds_target": 55,
  "aspect_ratio": "9:16",
  "style": "premium-research-explainer",
  "scenes": [
    {
      "id": "001-hook",
      "type": "hook",
      "duration_seconds": 7,
      "voiceover": "The fastest-growing AI repos on GitHub right now are not just new apps. They are skills.",
      "headline": "The fastest-growing AI repos are not apps.",
      "body": "They are skills.",
      "visual": "Large kinetic text. Word 'skills' glows in accent green.",
      "source_ref": "source/extracted.md#main-themes-1",
      "citation_visible": false
    },
    {
      "id": "002-evidence",
      "type": "evidence",
      "duration_seconds": 10,
      "voiceover": "Repos like Matt Pocock's engineering skills, Karpathy-inspired Claude guidelines, and Addy Osmani's agent skills are all pointing at the same shift.",
      "headline": "The evidence is in the repo list",
      "body": "mattpocock/skills · andrej-karpathy-skills · addyosmani/agent-skills",
      "visual": "Three GitHub-style repo cards stack vertically with star-count badges.",
      "source_ref": "source/extracted.md#evidence-snapshot",
      "citation_visible": true
    },
    {
      "id": "003-meaning",
      "type": "claim",
      "duration_seconds": 8,
      "voiceover": "AI agents are moving from one-off prompts to reusable operating procedures.",
      "headline": "From prompts → operating procedures",
      "body": "Reusable instructions. Repeatable workflows. Better agent behavior.",
      "visual": "Prompt bubble transforms into checklist cards.",
      "source_ref": "source/extracted.md#most-important-trend",
      "citation_visible": false
    },
    {
      "id": "004-skill-definition",
      "type": "framework",
      "duration_seconds": 10,
      "voiceover": "A skill tells the agent how to plan, review code, avoid overengineering, write better docs, or follow a repeatable workflow.",
      "headline": "What does a skill do?",
      "body": "Plan · Review · Test · Document · Repeat",
      "visual": "Five compact capability cards arranged in a clean grid.",
      "source_ref": "source/extracted.md#interpreted-short-summaries",
      "citation_visible": false
    },
    {
      "id": "005-why-it-matters",
      "type": "shift",
      "duration_seconds": 11,
      "voiceover": "That matters because the bottleneck is no longer just model intelligence. It is reliability.",
      "headline": "The bottleneck is reliability",
      "body": "Better models help. Better workflows compound.",
      "visual": "Two-column comparison: Model Intelligence vs Workflow Reliability.",
      "source_ref": "source/extracted.md#big-themes",
      "citation_visible": false
    },
    {
      "id": "006-cta",
      "type": "cta",
      "duration_seconds": 9,
      "voiceover": "So the thing to watch is not just which AI app trends next. Watch the workflow layer that teaches agents how to work.",
      "headline": "Watch the workflow layer",
      "body": "Follow for practical AI workflow breakdowns.",
      "visual": "Layer diagram: models → agents → skills → artifacts.",
      "source_ref": "source/extracted.md#main-themes",
      "citation_visible": false
    }
  ]
}
```

## 13. Rendering approach

### Preferred path

1. Read `storyboard.json` and `brand.json`.
2. Generate one HTML document containing all scenes.
3. Use CSS animations for:
   - fade in/out
   - slide up
   - scale emphasis
   - glowing accent text
   - simple progress bar
4. Render scenes to video with Playwright/browser capture or export PNG frames and compose with FFmpeg.
5. Generate captions from `script.md` or scene voiceover lines.
6. Add optional `voiceover.mp3` if a TTS key exists.
7. Compose final MP4 with FFmpeg.

### Fallback path

If animation capture is too slow, render static PNG scene cards and use FFmpeg to concatenate them with crossfades.

Example fallback FFmpeg concept:

```bash
ffmpeg \
  -loop 1 -t 7 -i render/scenes/001-hook.png \
  -loop 1 -t 10 -i render/scenes/002-evidence.png \
  -filter_complex "[0:v][1:v]xfade=transition=fade:duration=0.5:offset=6.5[v1]" \
  -map "[v1]" exports/video.mp4
```

The exact command can be generated programmatically.

## 14. Captions

Create `captions.srt` from scene voiceover lines and durations.

For the prototype, exact forced alignment is not required. Scene-level or sentence-level timing is acceptable.

Example:

```srt
1
00:00:00,000 --> 00:00:07,000
The fastest-growing AI repos on GitHub right now are not just new apps. They are skills.
```

## 15. Thumbnail

Create `exports/thumbnail.png` from the hook scene or a dedicated thumbnail scene.

Thumbnail text:

```text
AI's new GitHub trend:
SKILLS
```

Visual:

- dark premium background
- glowing green `SKILLS`
- three repo cards behind it
- small subtitle: `The workflow layer is here`

## 16. Social copy

Create `exports/social-copy.md`:

```markdown
## LinkedIn/X post

The fastest-growing AI repos on GitHub right now are not just apps.

They are skills: reusable operating procedures for agents.

That matters because the bottleneck is shifting from model intelligence to workflow reliability.

Watch the layer that teaches agents how to work.

#AI #Agents #GitHub #ClaudeCode #Codex
```

## 17. Suggested prototype CLI surface

The prototype can start with scripts instead of a packaged CLI:

```bash
npm run demo:init
npm run demo:brief
npm run demo:storyboard
npm run demo:render
npm run demo:export
```

Eventual CLI shape:

```bash
creator-studio create .hermes/reports/2026-05-18-github-popular-lately.md --brand examples/brand.json
creator-studio render framesmith-demo-agent-skills
```

## 18. Validation checklist

Before considering the prototype successful:

- [ ] `storyboard.json` validates against the intended schema.
- [ ] Every scene has a non-empty `source_ref`.
- [ ] `brand.json` is used by the renderer.
- [ ] `exports/video.mp4` exists.
- [ ] `exports/video.mp4` is 9:16.
- [ ] `exports/video.mp4` is between 45 and 60 seconds.
- [ ] Captions are readable on mobile.
- [ ] The video has at least five scenes.
- [ ] `exports/thumbnail.png` exists.
- [ ] `exports/social-copy.md` exists.
- [ ] Editing `storyboard.json` and rerunning render changes the output.

## 19. Open questions after prototype

Use the prototype to answer:

1. Does the Premium Research Explainer style feel compelling enough?
2. Is the project-folder interface pleasant or too clunky?
3. Is template-based rendering enough for V1?
4. How much manual approval is necessary before rendering?
5. Should V1 ship as a CLI, local web app, or agent skill first?
6. Which TTS provider should be the first-class BYOK integration?
7. Should the first paid product focus on individual creators or small agencies?

## 20. Next step

If building next, create a throwaway prototype in a dedicated folder such as:

```text
framesmith-prototype/
```

Start with static scene cards before animated capture. The core learning is whether the structured source → script → storyboard → render loop produces a compelling video.
