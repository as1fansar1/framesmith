# FrameSmith

FrameSmith is a local-owned, BYOK-powered creator tool concept that turns articles, PDFs, research reports, notes, or curated source bundles into claim-backed 45–60 second vertical premium research explainer video packages.

This repo currently contains:

- `CONTEXT.md` — product/domain glossary captured from the grilling session.
- `FRAMESMITH-PROTOTYPE-SPEC.md` — prototype specification.
- `framesmith-prototype/` — throwaway prototype that renders the first demo video from a storyboard.

## Run the prototype

```bash
cd framesmith-prototype
npm install
npx playwright install chromium
npm run demo
```

Outputs:

```text
framesmith-prototype/exports/video.mp4
framesmith-prototype/exports/thumbnail.png
framesmith-prototype/exports/social-copy.md
```

The prototype intentionally skips LLM generation and BYOK TTS for now. It proves the source → storyboard → HTML scene cards → MP4 pipeline.
