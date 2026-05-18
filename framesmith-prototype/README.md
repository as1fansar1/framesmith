# FrameSmith Prototype

Throwaway prototype for proving the FrameSmith V1 pipeline:

```text
source report → storyboard.json → premium 9:16 scene cards → MP4 + thumbnail + social copy
```

## Run

Prerequisites: Node.js and FFmpeg.

```bash
npm install
npx playwright install chromium
npm run demo
```

Optional BYOK cloud voiceover:

```bash
OPENAI_API_KEY=sk-... npm run demo
```

Without an OpenAI key, the prototype falls back to macOS `say` when available, then to silent audio. The fallback keeps the pipeline runnable locally.

Outputs:

```text
exports/video.mp4
exports/thumbnail.png
exports/voiceover.mp3
exports/social-copy.md
exports/captions.srt
```

## Notes

- This prototype now includes light FFmpeg-based motion and an optional BYOK OpenAI TTS path.
- The demo uses hand-authored `demo/storyboard.json` and HTML-rendered scene cards.
- The purpose is to judge whether the structured project-folder + renderer pipeline can produce a private-demo-quality artifact.
