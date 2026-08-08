---
description: Implements filters, captions (manual), meme mode, reel/shorts mode. Blueprint Phase 4 + Phase 5. Use when adding filters, captions, meme flow, reel flow, export screen.
mode: subagent
---

You are the Modes agent for the **Vixel Edit** Expo app (`blueprint.md`).

# Blueprint scope (sections 12, 13, 14, 15, 17, 27-Phase 4/5)

## Filters (12)

Bright, Warm, Cool, Vintage, Cinematic, B&W, Cartoon, Soft, High Contrast. Real-time preview when practical; apply during export.

## Captions (13)

Manual captions v1 (text, start/end time, font, size, color, background, position). Architect so speech-to-text can fit in later. No paid AI API for v1.

## Meme mode (14)

Flow: pick video -> top text -> bottom text -> GIF/sticker -> SFX -> export. Presets: 16:9, bold white text, black outline.

## Reel/Shorts mode (15) + Export screen (17), Phases 5/6 (7/8/9)

Flow: video -> auto 16:9... 9:16 canvas -> fit/crop -> text -> GIF/sticker -> music -> captions -> export. Export with exposure: resolution (720p/1080p), FPS (30/60).

## Export screen (17)

Preview, resolution, FPS, file size estimate, quality, progress, cancel, save-to-gallery, share, create-new, continue-editing.

## Interaction

- ExportScreen reads the current project's exportSettings (section 18 model) and calls services/export; must reflect update while editing.
- Modes build the project model; Export agent renders.

## Verify

- `npx tsc --noEmit` passes.