# Vixel Edit

A fast, Android-first mobile creator toolkit for making Reels, Shorts, memes and GIFs — local/on-device video editing + GIFs + stickers in Expo React Native.

Built from `blueprint.md` (keep it in the parent `yoga/` folder alongside this app).

## Agent work split

Each opencode subagent owns a blueprint phase. See `.opencode/agents/` (Phase 1 → 7):

| Phase | Agent file |
|-------|-----------|
| 1 | `expo-foundation.md` |
| 2 | `editor-timeline.md` |
| 3 | `overlays-text-gif-audio.md` |
| 4/5 | `filters-captions-modes.md` |
| 5 | `export-engine.md` |
| 6 | `storage-backend-offline.md` |
| 7 | `quality-system-qa.md` |

## Orientation

Android-first, portrait mobile app. 9:16 is the default Reel/Short canvas; 16:9 / 1:1 / 4:5 selectable per project.