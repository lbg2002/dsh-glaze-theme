# Glaze · `dsh-glaze-theme`

English | [中文](README.md)

A Chinese aesthetic, deep-UI-customizable, **zero-idle-GPU/CPU** theme plugin for **DeepSeek Harness (`dsh`)** featuring 16 WCAG AA OKLCH palettes and 6 one-click Chinese Master Presets.

---

## Highlights

* **Zero Idle Overhead**: Defaults to zero-blur Porcelain Glaze surfaces, with zero `infinite` CSS animations, zero `@property` loops, and zero `setInterval` polling.
* **6 Chinese Aesthetic Master Presets & 16 Polychromatic Palettes**: *Lanting Ink*, *Qianli Landscape* (seamless panoramic scroll), *Dunhuang Fresco*, *Forbidden Crimson*, *Jiangnan Bamboo* (seamless), and *Song Ruyao* (seamless), plus 10 Porcelain palettes with rich polychromatic Light Mode pigment triads and WCAG AA contrast.
* **Deep Component Customization**:
  * **Panoramic Left Sidebar & Canvas**: Layered / Deep Lacquer / True Seamless (boundary-free full-window canvas) / Custom hex sidebar tones, custom chat background color, and static SVG textures (*Gold-Flecked Xuan Paper*, *Polychrome Ink Mountains*, *Song Lattice*, *Dual-Tone Clouds*).
  * **Thinking / Reasoning Blocks**: *Scroll Note*, *Bamboo Slip*, *Zen Line*, or *Native*, with optional calligraphic WenKai script for thinking details.
  * **Composer, Send Button & Bubbles**: *Porcelain*, *Xuan Scroll Brackets*, *Imperial Double-Border*, or *Floating Jade* composer cards; *Round*, *Seal Stamp*, or *Jade Pill* send buttons; *Glaze*, *Letter Paper*, or *Ink Outline* user bubbles.
* **Artistic Fonts & Brand Customizer**: Independently resize top-left brand name (`12–28px`) and hero headline (`20–42px`), choose on-demand artistic/calligraphic fonts, customize brand logo/badge, hero greetings (static, time-of-day, or palette poetry), placeholder, and bottom-left nickname/avatar with JSON export/import & `~/.dsh/glaze-theme.json` persistence.

## Installation

```bash
dsh plugin --profile web add <path-or-github-repo>
```

Ensure `"dsh-glaze-theme"` is in `dsh.profile.bundles` inside `~/.dsh/profiles/web/package.json` (or run `node scripts/install-local.mjs web`), then restart DeepSeek Harness.

## Build & Test

```bash
npm run build
npm test
```

## License

[MIT](LICENSE)
