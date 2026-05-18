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

Outputs:

```text
exports/video.mp4
exports/thumbnail.png
exports/social-copy.md
exports/captions.srt
```

## Notes

- This prototype intentionally skips LLM generation and BYOK TTS.
- The demo uses hand-authored `demo/storyboard.json` and static/HTML-rendered scene cards.
- The purpose is to judge whether the structured project-folder + renderer pipeline can produce a private-demo-quality artifact.
