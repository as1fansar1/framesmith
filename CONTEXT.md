# Context

## Glossary

### FrameSmith
The working product name for Local Creator Studio V1: a local-owned, BYOK-powered CLI that turns articles, PDFs, research reports, notes, or curated source bundles into claim-backed 45–60 second vertical premium research explainer video packages.

### Local Creator Studio
A local-first, agent-driven content production system that turns existing source material into repeatable branded media assets.

### First ICP
Technical founders and indie hackers who publish product-building, AI-tool, and expert/educational content weekly. They already collect source material such as articles, PDFs, research reports, notes, and curated links, and need to convert it into consistent short-form assets without becoming full-time video editors.

### Source Artifact
An article, PDF, research report, note, or curated source bundle that contains enough substance to be transformed into an explainer. Source Artifacts are knowledge inputs, not necessarily technical project assets.

### Explainer Video Package
The MVP's primary output: a 45–60 second vertical explainer video derived from a Source Artifact, bundled with subtitles, a thumbnail or cover image, social copy, and an editable project folder.

### Local-Owned
Project files, brand memory, source artifacts, intermediate artifacts, and rendered outputs live locally by default. AI/model calls may use BYOK cloud providers or local models, but every external call is explicit, inspectable, and replaceable.

### Checkpointed Workflow
The V1 production flow for an Explainer Video Package: ingest a Source Artifact, extract a source brief, propose angles, have the user choose an angle, generate a script and storyboard, have the user approve them, then render. The product should not create a final video until the angle and script/storyboard have been approved.

### Simple Render
The V1 rendering approach: template-based HTML/CSS scenes, TTS voiceover, captions, screenshots or simple visual cards, and FFmpeg/browser rendering. Simple Render deliberately excludes AI-generated video clips, avatar generation, full timeline editing, and social scheduling.

### Premium Research Explainer
The default V1 visual style for Explainer Video Packages: 9:16 vertical videos with a dark background, large readable typography, citation/source cards, kinetic text emphasis, simple charts or diagrams, subtle motion, clean subtitles, and calm confident narration.

### Claim-Backed Script
The V1 source-grounding standard: every key script beat must map to a source quote, page, paragraph, or URL section. Storyboard beats store internal `source_ref` values, and the rendered video may show subtle citations or source cards when useful. V1 does not enrich with external research unless the user explicitly provides additional sources.

### Project Folder Interface
The first V1 interface: a hybrid CLI plus generated project folder. The CLI runs the pipeline while source files, extracted text, briefs, angles, scripts, storyboards, brand settings, render assets, and exports are stored as editable local files. A local web app can later read and write the same folder structure.

### HTML Scene Renderer
The first renderer for V1: storyboard-driven HTML/CSS scenes with light animation and a static scene-card fallback. Scene types include title or hook card, claim card, quote card, stat card, compare card, timeline card, 3-step framework card, and closing CTA card. V1 avoids AI video generation.

### BYOK Voiceover
The V1 voiceover approach: use an explicit BYOK TTS provider for high-quality narration, with local or no-voice fallback. The script is split into scene voiceover lines, timings are derived from audio duration, captions are generated from the approved script, and outputs include `voiceover.mp3`, `captions.srt`, `timings.json`, and `narration.md`.

### Simple Brand Profile
The V1 brand system: a small local `brand.json` containing brand name, voice, audience, colors, font style, logo path, and CTA style. V1 uses the brand profile to personalize scripts, visuals, captions, thumbnails, and social copy, while deferring full brand memory, style extraction, design-token editing, and multi-client brand libraries.

### V1 Technical Stack
The V1 implementation stack: Node/TypeScript CLI, Zod schemas, Playwright for HTML/CSS scene rendering, FFmpeg for video/audio composition, basic PDF/text/URL extraction, OpenAI-compatible LLM calls first, BYOK TTS provider first, and optional Python helpers later for stronger document processing.

### Guided CLI Workflow
The V1 command surface: a primary guided `creator-studio create <source> --brand <brand.json>` command with interactive checkpoints, plus explicit step commands such as `brief`, `angles`, `script`, `render`, and `export` that operate on a project folder. Users and agents can edit local files between steps.

### V1 Definition of Done
V1 is done when `creator-studio create examples/article.md --brand examples/brand.json` can produce a local project folder containing extracted source text, brief, angles, selected angle, script, storyboard, brand file, render artifacts, and exports including `video.mp4`, `thumbnail.png`, and `social-copy.md`. The MP4 must be a 9:16, 45–60 second Premium Research Explainer with at least five scenes, readable captions, optional BYOK voiceover, Claim-Backed Script grounding, no external research unless user-provided, no AI video generation, and regeneration after editing `script.md` or `storyboard.json`. The V1 quality bar is good enough to prove the pipeline and show a private demo, not to replace CapCut or Canva.

### First Demo Source
The first FrameSmith demo should use the GitHub trends report from 2026-05-18 as its Source Artifact, with a video angle around "the GitHub trend every AI builder should watch: agent skills." The demo should show that FrameSmith can turn a timely research artifact into a grounded premium explainer.
