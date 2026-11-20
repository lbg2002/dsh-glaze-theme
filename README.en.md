# Glaze · `dsh-glaze-theme`

English | [中文](README.md)

An ultra-low-overhead Chinese Porcelain / Morandi theme and full UI brand customizer plugin for **DeepSeek Harness (`dsh`)**.

Designed to deliver refined visual depth with **zero idle GPU/CPU animations**, while letting you customize the app name, badge, logo, hero welcome headline, artistic fonts, primary send-button accent color, bottom-left display name & avatar — all persisted in `~/.dsh/glaze-theme.json`.

---

## Features

* **Zero Idle GPU/CPU Overhead**:
  * Defaults to **Glaze (Zero-Blur Porcelain)** mode using OKLCH tonal layering, `1px` top specular highlights, and static multi-layer shadows instead of continuous `backdrop-filter: blur(...)` repaints.
  * **No `infinite` CSS animations**, no `@property` shadow loops, no `setInterval` polling.
  * Optional **Static Frosted Glass** toggle strictly scoped to sidebar and composer `::before` layers.
* **10 WCAG AA OKLCH Palettes + Custom Accent**:
  * Light & dark adaptive palettes (*Ripple*, *Mist*, *Cinnabar*, *Petal*, *Sage*, *Stone*, *Lapis*, *Amber*, *Afterglow*, *Lavender*), plus a custom hex accent color picker.
* **On-Demand Artistic Typography**:
  * Curated presets including *LXGW WenKai*, *Ma Shan Zheng*, *ZCOOL XiaoWei*, *Zhi Mang Xing*, *Noto Serif SC*, *Cinzel*, *Space Grotesk*, and *JetBrains Mono*, or local system fonts.
  * Solid, two-tone gradient, and subtle glow headline styles with configurable font size.
* **4-Tab Visual Customizer**:
  * Customize sidebar brand name/badge/logo, browser window title, hero greeting (static, time-of-day, or palette-matched poetry), composer placeholder, and bottom-left user nickname/avatar (with local image upload & auto-compression).
  * JSON export/import and server-side persistence at `/__glaze/config` (`$DSH_HOME/glaze-theme.json`).

## Installation

```bash
dsh plugin --profile web add <path-or-github-repo>
```

Ensure `"dsh-glaze-theme"` is listed in `dsh.profile.bundles` inside `~/.dsh/profiles/web/package.json` (or run `node scripts/install-local.mjs web` from this repo), then restart DeepSeek Harness.

## Build & Test

```bash
npm run build
npm test
```

## License

[MIT](LICENSE)
