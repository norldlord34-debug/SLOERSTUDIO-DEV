# SloerVoice — Deployment Guide

## Whisper Model Setup

SloerVoice requires a Whisper GGML model binary (excluded from git due to size).

| Model | Size | Quality | Download |
|-------|------|---------|----------|
| ggml-tiny.en.bin | 75 MB | Good | [HuggingFace](https://huggingface.co/ggerganov/whisper.cpp) |
| ggml-base.en.bin | 142 MB | High | [HuggingFace](https://huggingface.co/ggerganov/whisper.cpp) |
| ggml-large-v3.bin | 2.9 GB | SOTA | [HuggingFace](https://huggingface.co/ggerganov/whisper.cpp) |

Place the model in: `apps/voice/src-tauri/`

## Development

```bash
# Place model in apps/voice/src-tauri/ggml-base.en.bin first
npm run dev:voice
# or from apps/voice:
npm run tauri:dev
```

## Production Build

```bash
npm run build:voice
# or from apps/voice:
npm run tauri:build
```

## Build Targets

Same as SloerSpace Dev: Windows (MSI/NSIS), macOS (DMG), Linux (AppImage/DEB).

## GitHub Release Workflow

Automated via `.github/workflows/release-voice.yml`:
1. Triggered on tag push `v*.*.*-voice`
2. Model binary is NOT included in releases — users download separately
3. First-launch UI guides users to download & place their model

## Notes

- Audio is processed 100% locally — no network calls from Rust audio pipeline
- cpal handles cross-platform audio capture
- clipboard-manager Tauri plugin handles text injection
