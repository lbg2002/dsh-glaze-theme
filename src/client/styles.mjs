/**
 * Zero-infinite-animation Glaze stylesheet + Chinese aesthetic textures +
 * Deep UI customization (Sidebar, Canvas, Thinking, Composer, Send button, Bubbles, Brand sizing).
 */

function svgDataUri(svg) {
  return `url("data:image/svg+xml,${encodeURIComponent(svg.trim())}")`
}

const SVG_XUAN_LIGHT = svgDataUri(
  '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="48" viewBox="0 0 120 48"><path d="M0 12h120M0 36h120" stroke="#4a3f35" stroke-opacity="0.045" stroke-width="0.6"/><circle cx="18" cy="22" r="0.7" fill="#4a3f35" fill-opacity="0.06"/><circle cx="74" cy="8" r="0.6" fill="#4a3f35" fill-opacity="0.05"/><circle cx="102" cy="40" r="0.8" fill="#4a3f35" fill-opacity="0.05"/></svg>'
)
const SVG_XUAN_DARK = svgDataUri(
  '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="48" viewBox="0 0 120 48"><path d="M0 12h120M0 36h120" stroke="#e8e2d8" stroke-opacity="0.04" stroke-width="0.6"/><circle cx="18" cy="22" r="0.7" fill="#e8e2d8" fill-opacity="0.05"/><circle cx="74" cy="8" r="0.6" fill="#e8e2d8" fill-opacity="0.045"/><circle cx="102" cy="40" r="0.8" fill="#e8e2d8" fill-opacity="0.045"/></svg>'
)

const SVG_LANDSCAPE_LIGHT = svgDataUri(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 240" preserveAspectRatio="none"><path d="M0 240V165c120-45 240-15 360-58 110-40 210 10 340-36 140-48 250-12 380-46 130-34 250 8 360-20V240z" fill="#2b3d38" fill-opacity="0.055"/><path d="M0 240V195c160-32 290 14 440-26 150-40 270 12 420-28 160-42 320 6 580-18V240z" fill="#2b3d38" fill-opacity="0.075"/></svg>'
)
const SVG_LANDSCAPE_DARK = svgDataUri(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 240" preserveAspectRatio="none"><path d="M0 240V165c120-45 240-15 360-58 110-40 210 10 340-36 140-48 250-12 380-46 130-34 250 8 360-20V240z" fill="#dbe6e3" fill-opacity="0.045"/><path d="M0 240V195c160-32 290 14 440-26 150-40 270 12 420-28 160-42 320 6 580-18V240z" fill="#dbe6e3" fill-opacity="0.06"/></svg>'
)

const SVG_LATTICE_LIGHT = svgDataUri(
  '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none"><path d="M0 32h64M32 0v64M16 16h32v32H16z" stroke="#3c4856" stroke-opacity="0.055" stroke-width="0.8"/><path d="M0 0l16 16M64 0L48 16M0 64l16-16M64 64L48 48" stroke="#3c4856" stroke-opacity="0.04" stroke-width="0.7"/></svg>'
)
const SVG_LATTICE_DARK = svgDataUri(
  '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none"><path d="M0 32h64M32 0v64M16 16h32v32H16z" stroke="#dfe7f0" stroke-opacity="0.045" stroke-width="0.8"/><path d="M0 0l16 16M64 0L48 16M0 64l16-16M64 64L48 48" stroke="#dfe7f0" stroke-opacity="0.032" stroke-width="0.7"/></svg>'
)

const SVG_CLOUD_LIGHT = svgDataUri(
  '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="64" viewBox="0 0 96 64" fill="none"><path d="M12 44c6 0 10-4 14-8 4-4 10-4 14 0s10 4 14 0 10-4 14 0 8 8 16 8M4 22c8 0 10-6 16-6s8 6 14 6 10-6 16-6 10 6 16 6" stroke="#5c4738" stroke-opacity="0.05" stroke-width="1" stroke-linecap="round"/></svg>'
)
const SVG_CLOUD_DARK = svgDataUri(
  '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="64" viewBox="0 0 96 64" fill="none"><path d="M12 44c6 0 10-4 14-8 4-4 10-4 14 0s10 4 14 0 10-4 14 0 8 8 16 8M4 22c8 0 10-6 16-6s8 6 14 6 10-6 16-6 10 6 16 6" stroke="#f0dfc8" stroke-opacity="0.045" stroke-width="1" stroke-linecap="round"/></svg>'
)

export function buildCoreCSS() {
  return `
/* ═══ 1. Static Right Conversation Canvas & Chinese Aesthetic Textures (0% idle GPU) ═══ */
body[data-glaze-variant] {
  --glaze-ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  --glaze-dur-fast: 140ms;
  --glaze-dur: 200ms;
  --glaze-ambience:
    radial-gradient(1300px circle at 6% -4%, color-mix(in oklch, var(--glaze-accent, #4e8c97), transparent 82%), transparent 52%),
    radial-gradient(1050px circle at 100% 8%, color-mix(in oklch, var(--glaze-aurora-stream-2), transparent 58%), transparent 60%),
    radial-gradient(900px circle at 96% 100%, color-mix(in oklch, var(--glaze-aurora-stream-3), transparent 58%), transparent 62%),
    radial-gradient(950px circle at 2% 96%, color-mix(in oklch, var(--glaze-aurora-stream-1), transparent 58%), transparent 60%);
}
body[data-glaze-variant][data-glaze-pattern="ambience"] {
  background-attachment: fixed;
  background-image: var(--glaze-ambience);
}
body[data-glaze-variant][data-glaze-pattern="none"] {
  background-image: none;
}
body[data-glaze-variant][data-glaze-pattern="xuan-paper"] {
  background-attachment: fixed;
  background-image: ${SVG_XUAN_LIGHT}, var(--glaze-ambience);
  background-repeat: repeat, no-repeat;
}
body[data-ds-dark-theme][data-glaze-variant][data-glaze-pattern="xuan-paper"] {
  background-image: ${SVG_XUAN_DARK}, var(--glaze-ambience);
}
body[data-glaze-variant][data-glaze-pattern="landscape"] {
  background-attachment: fixed;
  background-image: ${SVG_LANDSCAPE_LIGHT}, var(--glaze-ambience);
  background-repeat: no-repeat, no-repeat;
  background-position: bottom center, center;
  background-size: 100% 240px, cover;
}
body[data-ds-dark-theme][data-glaze-variant][data-glaze-pattern="landscape"] {
  background-image: ${SVG_LANDSCAPE_DARK}, var(--glaze-ambience);
}
body[data-glaze-variant][data-glaze-pattern="lattice"] {
  background-attachment: fixed;
  background-image: ${SVG_LATTICE_LIGHT}, var(--glaze-ambience);
  background-repeat: repeat, no-repeat;
}
body[data-ds-dark-theme][data-glaze-variant][data-glaze-pattern="lattice"] {
  background-image: ${SVG_LATTICE_DARK}, var(--glaze-ambience);
}
body[data-glaze-variant][data-glaze-pattern="cloud"] {
  background-attachment: fixed;
  background-image: ${SVG_CLOUD_LIGHT}, var(--glaze-ambience);
  background-repeat: repeat, no-repeat;
}
body[data-ds-dark-theme][data-glaze-variant][data-glaze-pattern="cloud"] {
  background-image: ${SVG_CLOUD_DARK}, var(--glaze-ambience);
}

/* Transparent pass-through for center column shells */
body[data-glaze-variant] [class*="_frame"],
body[data-glaze-variant] [class*="_centerCol"],
body[data-glaze-variant] [class*="_root"]:has([class*="_scrollBody"]),
body[data-glaze-variant] [class*="_scrollBody"] {
  background-color: transparent;
  background-image: none;
}

/* Sticky composer seat seamless fade */
body[data-glaze-variant] [class*="_root"] [class*="_composerSeat"] {
  background-image: none;
}
body[data-glaze-variant]:not([data-glaze-pattern="none"]) [class*="_root"] [class*="_composerSeat"]::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background-color: var(--dsw-alias-bg-layer-1, #101010);
  background-image: var(--glaze-ambience);
  background-attachment: fixed;
  -webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 56px);
  mask-image: linear-gradient(to bottom, transparent 0, #000 56px);
}
body[data-glaze-variant][data-glaze-pattern="none"] [class*="_root"] [class*="_composerSeat"]::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background-color: var(--dsw-alias-bg-layer-1, #101010);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 56px);
  mask-image: linear-gradient(to bottom, transparent 0, #000 56px);
}

/* ═══ 2. Left Sidebar Architectural Tones ═══ */
body[data-glaze-variant] [class*="_sidebarCol"] > div {
  background-color: transparent;
}
body[data-glaze-variant] [class*="_sidebarCol"] {
  position: relative;
  border-right: 0;
  background-color: var(--glaze-sidebar-bg);
  background-image: linear-gradient(
    180deg,
    color-mix(in oklch, var(--glaze-accent, #4e8c97), transparent 94%),
    transparent 160px
  );
  background-repeat: no-repeat;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.18),
    1px 0 0 var(--glaze-hairline),
    20px 0 36px -22px color-mix(in oklch, var(--glaze-accent, #4e8c97), transparent 52%);
}
body[data-glaze-variant][data-glaze-sidebar-tone="deep"] [class*="_sidebarCol"] {
  background-color: var(--glaze-sidebar-deep-bg);
  background-image: linear-gradient(
    180deg,
    color-mix(in oklch, var(--glaze-accent, #4e8c97), transparent 90%),
    transparent 200px
  );
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.08),
    1px 0 0 rgba(255,255,255,0.08),
    18px 0 38px -20px rgba(0, 0, 0, 0.36);
}
/* Scope light-on-dark ink strictly to sidebar sub-regions so DSH's fixed Settings Modal stays unaffected */
body[data-glaze-variant][data-glaze-sidebar-tone="deep"] [class*="_sidebarCol"] [class*="_logoRow"],
body[data-glaze-variant][data-glaze-sidebar-tone="deep"] [class*="_sidebarCol"] [class*="_newSessionRow"],
body[data-glaze-variant][data-glaze-sidebar-tone="deep"] [class*="_sidebarCol"] [class*="_scrollRegion"],
body[data-glaze-variant][data-glaze-sidebar-tone="deep"] [class*="_sidebarCol"] [class*="_footerActions"],
body[data-glaze-variant][data-glaze-sidebar-tone="deep"] [class*="_sidebarCol"] [class*="_settingsArea"] > div > button,
body[data-glaze-variant][data-glaze-sidebar-tone="custom"][data-glaze-sidebar-dark="1"] [class*="_sidebarCol"] [class*="_logoRow"],
body[data-glaze-variant][data-glaze-sidebar-tone="custom"][data-glaze-sidebar-dark="1"] [class*="_sidebarCol"] [class*="_newSessionRow"],
body[data-glaze-variant][data-glaze-sidebar-tone="custom"][data-glaze-sidebar-dark="1"] [class*="_sidebarCol"] [class*="_scrollRegion"],
body[data-glaze-variant][data-glaze-sidebar-tone="custom"][data-glaze-sidebar-dark="1"] [class*="_sidebarCol"] [class*="_footerActions"],
body[data-glaze-variant][data-glaze-sidebar-tone="custom"][data-glaze-sidebar-dark="1"] [class*="_sidebarCol"] [class*="_settingsArea"] > div > button {
  --dsw-alias-label-primary: oklch(95% 0.01 80);
  --dsw-alias-label-secondary: oklch(84% 0.01 80);
  --dsw-alias-label-tertiary: oklch(76% 0.01 80);
  --dsw-alias-label-caption: oklch(68% 0.01 80);
  --dsw-alias-label-dimmed: oklch(64% 0.01 80);
  --dsw-alias-menu-icon: oklch(86% 0.01 80);
}
body[data-glaze-variant][data-glaze-sidebar-tone="custom"][data-glaze-sidebar-dark="0"] [class*="_sidebarCol"] [class*="_logoRow"],
body[data-glaze-variant][data-glaze-sidebar-tone="custom"][data-glaze-sidebar-dark="0"] [class*="_sidebarCol"] [class*="_newSessionRow"],
body[data-glaze-variant][data-glaze-sidebar-tone="custom"][data-glaze-sidebar-dark="0"] [class*="_sidebarCol"] [class*="_scrollRegion"],
body[data-glaze-variant][data-glaze-sidebar-tone="custom"][data-glaze-sidebar-dark="0"] [class*="_sidebarCol"] [class*="_footerActions"],
body[data-glaze-variant][data-glaze-sidebar-tone="custom"][data-glaze-sidebar-dark="0"] [class*="_sidebarCol"] [class*="_settingsArea"] > div > button {
  --dsw-alias-label-primary: oklch(24% 0.02 240);
  --dsw-alias-label-secondary: oklch(34% 0.02 240);
  --dsw-alias-label-tertiary: oklch(40% 0.02 240);
  --dsw-alias-label-caption: oklch(44% 0.02 240);
  --dsw-alias-label-dimmed: oklch(48% 0.02 240);
  --dsw-alias-menu-icon: oklch(32% 0.02 240);
}
body[data-glaze-variant][data-glaze-sidebar-tone="seamless"] [class*="_sidebarCol"] {
  background-color: transparent;
  background-image: none;
  box-shadow: 1px 0 0 var(--glaze-hairline);
}
body[data-glaze-variant][data-glaze-sidebar-tone="custom"] [class*="_sidebarCol"] {
  background-color: var(--glaze-user-sidebar-bg, var(--glaze-sidebar-bg));
}

/* Opt-in Static Frosted Mode strictly on ::before */
body[data-glaze-variant][data-glaze-surface="frosted"] [class*="_sidebarCol"]::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background-color: color-mix(in oklch, var(--glaze-accent, #4e8c97), var(--dsw-alias-bg-layer-1, #fff) 86%);
  backdrop-filter: blur(16px) saturate(1.2);
  -webkit-backdrop-filter: blur(16px) saturate(1.2);
}
body[data-ds-dark-theme][data-glaze-variant][data-glaze-surface="frosted"] [class*="_sidebarCol"]::before {
  background-color: color-mix(in oklch, var(--glaze-accent, #4e8c97), var(--dsw-alias-bg-layer-1, #101010) 82%);
}

/* ═══ 3. Thinking / Reasoning & Process Styles ═══ */
body[data-glaze-variant][data-glaze-thinking="scroll-note"] button[data-turn-process] {
  height: auto;
  min-height: 32px;
  padding: 5px 12px;
  margin-bottom: 6px;
  border-radius: 8px;
  border: 1px solid var(--glaze-hairline);
  background: var(--glaze-think-bg);
  color: var(--dsw-alias-label-secondary);
}
body[data-glaze-variant][data-glaze-thinking="scroll-note"] button[data-turn-process]::before {
  content: '批';
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  margin-right: 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
  color: var(--dsw-alias-button-primary-dimmed);
  background: var(--glaze-accent);
  flex: none;
}
body[data-glaze-variant][data-glaze-thinking="scroll-note"] [data-step-process] {
  margin: 4px 0;
  padding: 6px 12px;
  border-radius: 10px;
  background: var(--glaze-think-bg);
  border-left: 2.5px solid var(--glaze-accent);
}
body[data-glaze-variant][data-glaze-thinking="scroll-note"] [data-chat-running] {
  width: fit-content;
  padding: 4px 12px;
  border-radius: 999px;
  background: var(--glaze-think-bg);
  border: 1px solid var(--glaze-hairline);
}

body[data-glaze-variant][data-glaze-thinking="bamboo-slip"] button[data-turn-process] {
  height: auto;
  min-height: 32px;
  padding: 5px 12px;
  margin-bottom: 6px;
  border-radius: 4px;
  border-top: 1px solid var(--glaze-hairline);
  border-bottom: 1px solid var(--glaze-hairline-strong);
  border-left: 3px solid var(--glaze-accent);
  background: color-mix(in oklch, var(--glaze-think-bg), transparent 22%);
  color: var(--dsw-alias-label-secondary);
}
body[data-glaze-variant][data-glaze-thinking="bamboo-slip"] button[data-turn-process]::before {
  content: '简';
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  margin-right: 8px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
  color: var(--glaze-accent);
  border: 1px solid var(--glaze-accent);
  flex: none;
}
body[data-glaze-variant][data-glaze-thinking="bamboo-slip"] [data-step-process] {
  margin: 4px 0;
  padding: 6px 12px;
  border-left: 3px double var(--glaze-hairline-strong);
  border-radius: 4px;
  background: color-mix(in oklch, var(--glaze-think-bg), transparent 32%);
}
body[data-glaze-variant][data-glaze-thinking="bamboo-slip"] [data-chat-running] {
  width: fit-content;
  padding: 3px 10px;
  border-left: 3px double var(--glaze-accent);
  border-radius: 4px;
  background: color-mix(in oklch, var(--glaze-think-bg), transparent 30%);
}

body[data-glaze-variant][data-glaze-thinking="zen-line"] button[data-turn-process] {
  border-bottom: 1px solid var(--glaze-hairline);
  color: var(--dsw-alias-label-secondary);
}
body[data-glaze-variant][data-glaze-thinking="zen-line"] [data-step-process] {
  padding: 2px 0 2px 12px;
  border-left: 1.5px solid var(--glaze-hairline-strong);
}
body[data-glaze-variant][data-glaze-thinking="zen-line"] [data-chat-running] {
  padding-left: 10px;
  border-left: 2px solid var(--glaze-accent);
}

/* Optional Kaiti/WenKai calligraphy for thinking process */
body[data-glaze-variant][data-glaze-thinking-kaiti="1"] [data-step-process-body],
body[data-glaze-variant][data-glaze-thinking-kaiti="1"] [class*="_thinkBody"],
body[data-glaze-variant][data-glaze-thinking-kaiti="1"] [data-step-process] button[data-process-activity],
body[data-glaze-variant][data-glaze-thinking-kaiti="1"] [data-chat-running] {
  font-family: "LXGW WenKai", "Kaiti SC", "STKaiti", "楷体", cursive, serif;
}

/* ═══ 4. Composer Card & Send Button Styles ═══ */
/* Prevent inner focus outline inside composer card */
body[data-glaze-variant] [data-composer-input]:focus,
body[data-glaze-variant] [data-composer-input]:focus-visible {
  outline: none !important;
}

body[data-glaze-variant] div[class*="_composer"] div[class*="_card"] {
  position: relative;
  border: 1px solid var(--glaze-hairline);
  border-radius: 16px;
  background-color: color-mix(in oklch, var(--dsw-alias-bg-layer-1, #fff), var(--dsw-alias-bg-layer-2, #fff) 55%);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.30),
    0 1px 2px -1px rgba(0, 0, 0, 0.14),
    0 16px 44px -20px rgba(0, 0, 0, 0.22),
    0 0 36px -16px color-mix(in oklch, var(--glaze-accent, #4e8c97), transparent 76%);
  transition:
    border-color var(--glaze-dur) var(--glaze-ease),
    box-shadow var(--glaze-dur) var(--glaze-ease);
}
body[data-ds-dark-theme][data-glaze-variant] div[class*="_composer"] div[class*="_card"] {
  background-color: color-mix(in oklch, var(--dsw-alias-bg-layer-1, #101010), var(--dsw-alias-bg-layer-2, #181818) 65%);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.11),
    0 1px 2px -1px rgba(0, 0, 0, 0.45),
    0 18px 48px -20px rgba(0, 0, 0, 0.50),
    0 0 48px -18px color-mix(in oklch, var(--glaze-accent, #4e8c97), transparent 72%);
}
body[data-glaze-variant] div[class*="_composer"] div[class*="_card"]:hover {
  border-color: var(--glaze-hairline-strong);
}
body[data-glaze-variant] div[class*="_composer"] div[class*="_card"]:focus-within {
  border-color: var(--glaze-hairline-strong);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.32),
    0 0 0 2px color-mix(in oklch, var(--glaze-accent) 26%, transparent),
    0 18px 48px -18px rgba(0, 0, 0, 0.28),
    0 0 54px -16px color-mix(in oklch, var(--glaze-accent, #4e8c97), transparent 68%);
}

/* Composer variant: xuan-scroll (文人花笺 4-corner L-brackets) */
body[data-glaze-variant][data-glaze-composer="xuan-scroll"] div[class*="_composer"] div[class*="_card"] {
  border-radius: 10px;
  background-image:
    linear-gradient(var(--glaze-hairline-strong), var(--glaze-hairline-strong)),
    linear-gradient(var(--glaze-hairline-strong), var(--glaze-hairline-strong)),
    linear-gradient(var(--glaze-hairline-strong), var(--glaze-hairline-strong)),
    linear-gradient(var(--glaze-hairline-strong), var(--glaze-hairline-strong)),
    linear-gradient(var(--glaze-hairline-strong), var(--glaze-hairline-strong)),
    linear-gradient(var(--glaze-hairline-strong), var(--glaze-hairline-strong)),
    linear-gradient(var(--glaze-hairline-strong), var(--glaze-hairline-strong)),
    linear-gradient(var(--glaze-hairline-strong), var(--glaze-hairline-strong));
  background-size:
    12px 1.5px, 1.5px 12px,
    12px 1.5px, 1.5px 12px,
    12px 1.5px, 1.5px 12px,
    12px 1.5px, 1.5px 12px;
  background-position:
    top 5px left 5px, top 5px left 5px,
    top 5px right 5px, top 5px right 5px,
    bottom 5px left 5px, bottom 5px left 5px,
    bottom 5px right 5px, bottom 5px right 5px;
  background-repeat: no-repeat;
}

/* Composer variant: imperial-seal (文武双线框) */
body[data-glaze-variant][data-glaze-composer="imperial-seal"] div[class*="_composer"] div[class*="_card"] {
  border-radius: 8px;
  border: 1.5px solid var(--glaze-hairline-strong);
  box-shadow:
    inset 0 0 0 3px var(--dsw-alias-bg-layer-1),
    inset 0 0 0 4px var(--glaze-hairline),
    0 18px 46px -20px rgba(0, 0, 0, 0.35);
}

/* Composer variant: floating-jade (悬浮流云) */
body[data-glaze-variant][data-glaze-composer="floating-jade"] div[class*="_composer"] div[class*="_card"] {
  border-radius: 24px;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.22),
    0 20px 56px -18px rgba(0, 0, 0, 0.34),
    0 0 48px -16px color-mix(in oklch, var(--glaze-accent, #4e8c97), transparent 68%);
}

body[data-glaze-variant][data-glaze-surface="frosted"] div[class*="_composer"] div[class*="_card"] {
  background-color: transparent;
}
body[data-glaze-variant][data-glaze-surface="frosted"] div[class*="_composer"] div[class*="_card"]::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  border-radius: inherit;
  background-color: color-mix(in oklch, var(--dsw-alias-bg-layer-1, #fff), transparent 72%);
  backdrop-filter: blur(16px) saturate(1.25);
  -webkit-backdrop-filter: blur(16px) saturate(1.25);
}
body[data-ds-dark-theme][data-glaze-variant][data-glaze-surface="frosted"] div[class*="_composer"] div[class*="_card"]::before {
  background-color: color-mix(in oklch, var(--dsw-alias-bg-layer-1, #101010), transparent 58%);
}

/* Send Button Styles */
body[data-glaze-variant][data-glaze-send-btn="seal"] [data-composer-card] button[class*="_primary"] {
  border-radius: 7px !important;
  box-shadow: inset 0 0 0 1.5px rgba(255,255,255,0.28), 0 2px 6px rgba(0,0,0,0.22);
}
body[data-glaze-variant][data-glaze-send-btn="jade-pill"] [data-composer-card] button[class*="_primary"] {
  border-radius: 10px !important;
}

/* ═══ 5. Message Bubbles (Strictly div[class*="_bubble"], preserving span tooltip) ═══ */
body[data-glaze-variant] div[class*="_bubble"] {
  border-radius: 14px;
  border: 1px solid color-mix(in oklch, var(--glaze-hairline, rgba(146,168,179,0.25)), transparent 35%);
  box-shadow: var(--glaze-shadow-sm);
}
body[data-glaze-variant][data-glaze-bubble="letter-paper"] div[class*="_bubble"] {
  border-radius: 12px 4px 4px 12px !important;
  border-right: 3px solid var(--glaze-accent) !important;
}
body[data-glaze-variant][data-glaze-bubble="ink-outline"] div[class*="_bubble"] {
  background: transparent !important;
  border: 1px solid var(--glaze-hairline-strong) !important;
  border-radius: 10px !important;
  box-shadow: none !important;
}

/* ═══ 6. Chrome, Header Tabs, Sidebar Rows, Menus & Markdown Polish ═══ */
body[data-glaze-variant] div[class*="_dock"]:has(> [class*="_preview"]) {
  background: color-mix(in oklch, var(--dsw-alias-bg-layer-2, #fff), transparent 10%);
  border: 1px solid var(--glaze-hairline);
  border-radius: 12px;
  box-shadow: var(--glaze-shadow-sm);
}
body[data-glaze-variant] div[class*="_dock"] [class*="_preview"] {
  color: var(--dsw-alias-label-secondary);
}
body[data-glaze-variant] [class*="_header"]:has(> [class*="_tabs"]) {
  border-bottom: 0;
  box-shadow: 0 18px 36px -26px color-mix(in oklch, var(--glaze-accent, #4e8c97), transparent 78%);
}
body[data-glaze-variant] [class*="_header"]:has(> [class*="_tabs"])::after {
  display: none;
}
body[data-glaze-variant] div[class*="_tabs"] {
  background-color: transparent;
  box-shadow: inset 0 -1px 0 var(--glaze-hairline, rgba(146,168,179,0.28));
}

body[data-glaze-variant] [class*="_sidebarCol"] [role="treeitem"],
body[data-glaze-variant] [class*="_sidebarCol"] [class*="_sessionRow"] {
  border-radius: 8px;
  transition: background var(--glaze-dur-fast) var(--glaze-ease), transform var(--glaze-dur-fast) var(--glaze-ease);
}
body[data-glaze-variant] [class*="_sidebarCol"] [class*="_sessionRow"]:hover,
body[data-glaze-variant] [class*="_sidebarCol"] [role="treeitem"]:hover {
  background: color-mix(in oklch, var(--glaze-accent, #4e8c97), transparent 90%);
  transform: translateX(2px);
}
body[data-glaze-variant] [class*="_sidebarCol"] [class*="_sessionRow"][class*="_selected"],
body[data-glaze-variant] [class*="_sidebarCol"] [class*="_sessionRow"][class*="_active"],
body[data-glaze-variant] [class*="_sidebarCol"] [class*="_sessionRow"][aria-selected="true"],
body[data-glaze-variant] [class*="_sidebarCol"] [role="treeitem"][aria-selected="true"] {
  background: color-mix(in oklch, var(--glaze-accent, #4e8c97), transparent 88%);
  font-weight: 500;
}
body[data-glaze-variant] [class*="_sidebarCol"] button[class*="_newSession"],
body[data-glaze-variant] [class*="_sidebarCol"] button[class*="_newChat"],
body[data-glaze-variant] [class*="_sessionLogButton"],
body[data-glaze-variant] .dsh-glaze-trigger {
  border-color: transparent;
  background: color-mix(in oklch, var(--glaze-accent, #4e8c97), transparent 90%);
  border-radius: 10px;
  transition: background var(--glaze-dur-fast) var(--glaze-ease), transform var(--glaze-dur-fast) var(--glaze-ease);
}
body[data-glaze-variant] [class*="_sidebarCol"] button[class*="_newSession"]:hover,
body[data-glaze-variant] [class*="_sidebarCol"] button[class*="_newChat"]:hover,
body[data-glaze-variant] [class*="_sessionLogButton"]:hover,
body[data-glaze-variant] .dsh-glaze-trigger:hover {
  background: color-mix(in oklch, var(--glaze-accent, #4e8c97), transparent 82%);
  transform: translateY(-1px);
}
body[data-glaze-variant] [class*="_footerActions"] {
  border-top: 0;
  box-shadow: 0 -6px 10px -8px color-mix(in oklch, var(--glaze-accent, #4e8c97), transparent 78%);
}

body[data-glaze-variant] [class*="_menu"],
body[data-glaze-variant] [class*="_selector"] {
  background-color: color-mix(in oklch, var(--dsw-alias-bg-layer-2, #fff), var(--dsw-alias-bg-layer-1, #fff) 30%);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.16),
    inset 0 0 0 1px var(--glaze-hairline),
    0 18px 46px -16px rgba(0, 0, 0, 0.34);
}
body[data-glaze-variant] [class*="_cardActive"] {
  border-color: var(--glaze-accent);
}
body[data-glaze-variant] button[class*="_themeCube"][class*="_selected"] {
  border-color: var(--glaze-accent);
}
body[data-glaze-variant] button[class*="_primary"]:disabled {
  color: var(--dsw-alias-label-primary);
}
body[data-glaze-variant] :focus-visible {
  outline: 2px solid var(--glaze-accent) !important;
  outline-offset: 2px;
}

body[data-glaze-variant] [class*="_markdown"] h1,
body[data-glaze-variant] [class*="_markdown"] h2,
body[data-glaze-variant] [class*="_markdown"] h3 {
  position: relative;
}
body[data-glaze-variant] [class*="_markdown"] h1::after,
body[data-glaze-variant] [class*="_markdown"] h2::after,
body[data-glaze-variant] [class*="_markdown"] h3::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -0.32em;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(var(--glaze-morandi), 0.45), transparent);
}
body[data-glaze-variant] [class*="_markdown"] h1::after { width: 72px; height: 3px; }
body[data-glaze-variant] [class*="_markdown"] h2::after { width: 52px; }
body[data-glaze-variant] [class*="_markdown"] h3::after { width: 38px; background: linear-gradient(90deg, rgba(var(--glaze-morandi), 0.28), transparent); }
body[data-glaze-variant] hr {
  border: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--glaze-hairline-strong), transparent);
}
body[data-glaze-variant] blockquote {
  border-left: 3px solid rgba(var(--glaze-morandi), 0.55);
  border-radius: 10px;
  background: rgba(var(--glaze-morandi), 0.07);
}
body[data-glaze-variant] .md-code-block {
  border: 1px solid var(--glaze-hairline);
  box-shadow: var(--glaze-shadow-sm);
  overflow: hidden;
}
body[data-glaze-variant] [class*="_tableScroll"] th,
body[data-glaze-variant] [class*="_tableScroll"] td {
  border-color: var(--glaze-hairline-strong);
}
body[data-glaze-variant] [class*="_tableScroll"] thead th {
  background: rgba(var(--glaze-morandi), 0.10);
}
body[data-glaze-variant] ::selection {
  background: color-mix(in oklch, var(--glaze-accent), transparent 76%);
}

/* ═══ 7. Global Body Font Override ═══ */
body[data-glaze-variant][data-glaze-body-font="1"] {
  --dsw-font-family: var(--glaze-body-font);
  font-family: var(--glaze-body-font);
}

/* ═══ 8. Custom Brand (with Size & Style), Hero, Placeholder & Account Launcher ═══ */
body[data-glaze-variant][data-glaze-brand-icon="hidden"] [class*="_logoRow"] [class*="_brandMark"],
body[data-glaze-variant][data-glaze-brand-icon="hidden"] [class*="_railMark"] {
  display: none !important;
}
body[data-glaze-variant][data-glaze-brand-icon="emoji"] [class*="_logoRow"] [class*="_brandMark"] > *,
body[data-glaze-variant][data-glaze-brand-icon="emoji"] [class*="_railMark"] > *,
body[data-glaze-variant][data-glaze-brand-icon="image"] [class*="_logoRow"] [class*="_brandMark"] > *,
body[data-glaze-variant][data-glaze-brand-icon="image"] [class*="_railMark"] > * {
  display: none !important;
}
body[data-glaze-variant][data-glaze-brand-icon="emoji"] [class*="_logoRow"] [class*="_brandMark"]::before,
body[data-glaze-variant][data-glaze-brand-icon="emoji"] [class*="_railMark"]::before {
  content: var(--glaze-brand-icon-emoji);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: 18px;
  line-height: 24px;
}
body[data-glaze-variant][data-glaze-brand-icon="image"] [class*="_logoRow"] [class*="_brandMark"]::before,
body[data-glaze-variant][data-glaze-brand-icon="image"] [class*="_railMark"]::before {
  content: '';
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background-image: var(--glaze-brand-icon-img);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* Top-left Brand Name (with configurable font-size & artistic style) */
body[data-glaze-variant][data-glaze-custom-brand="1"] [class*="_logoRow"] [class*="_brandName"] {
  font-size: 0 !important;
  color: transparent !important;
  display: inline-flex !important;
  align-items: center;
  gap: 6px;
  min-width: 0;
}
body[data-glaze-variant][data-glaze-custom-brand="1"] [class*="_logoRow"] [class*="_brandName"] > * {
  display: none !important;
}
body[data-glaze-variant][data-glaze-custom-brand="1"] [class*="_logoRow"] [class*="_brandName"]::before {
  content: var(--glaze-brand-name);
  font-family: var(--glaze-display-font, inherit);
  font-size: var(--glaze-brand-size, 17px);
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: 0.02em;
  color: var(--dsw-alias-label-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 176px;
}
body[data-glaze-variant][data-glaze-custom-brand="1"][data-glaze-brand-style="gradient"] [class*="_logoRow"] [class*="_brandName"]::before {
  background: linear-gradient(120deg, var(--dsw-alias-label-primary) 15%, var(--glaze-accent) 68%, var(--glaze-motion-2, var(--glaze-accent)) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent !important;
}
body[data-glaze-variant][data-glaze-custom-brand="1"][data-glaze-brand-style="glow"] [class*="_logoRow"] [class*="_brandName"]::before {
  text-shadow: 0 2px 14px color-mix(in oklch, var(--glaze-accent), transparent 35%);
}
body[data-glaze-variant][data-glaze-custom-brand="1"][data-glaze-brand-badge="custom"] [class*="_logoRow"] [class*="_brandName"]::after {
  content: var(--glaze-brand-badge);
  font-family: var(--ds-font-family-code, ui-monospace, monospace);
  font-size: 10px;
  font-weight: 600;
  line-height: 16px;
  padding: 0 6px;
  border-radius: 999px;
  color: var(--glaze-accent);
  background: color-mix(in oklch, var(--glaze-accent), transparent 86%);
  border: 0.5px solid color-mix(in oklch, var(--glaze-accent), transparent 68%);
  white-space: nowrap;
}

/* Center Hero Icon */
body[data-glaze-variant][data-glaze-hero-icon="hidden"] [class*="_headline"] [class*="_fishHitbox"] {
  display: none !important;
}
body[data-glaze-variant][data-glaze-hero-icon="emoji"] [class*="_headline"] [class*="_fishHitbox"] > *,
body[data-glaze-variant][data-glaze-hero-icon="image"] [class*="_headline"] [class*="_fishHitbox"] > * {
  display: none !important;
}
body[data-glaze-variant][data-glaze-hero-icon="emoji"] [class*="_headline"] [class*="_fishHitbox"]::before {
  content: var(--glaze-hero-icon-emoji);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  font-size: 28px;
  line-height: 34px;
}
body[data-glaze-variant][data-glaze-hero-icon="image"] [class*="_headline"] [class*="_fishHitbox"]::before {
  content: '';
  display: inline-block;
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background-image: var(--glaze-hero-icon-img);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* Center Hero Headline */
body[data-glaze-variant] [class*="_headline"] [class*="_titleGroup"] > span:first-child {
  font-family: var(--glaze-display-font, inherit);
  font-size: var(--glaze-headline-size, 28px);
  line-height: 1.3;
  letter-spacing: 0.02em;
}
body[data-glaze-variant][data-glaze-headline-style="gradient"] [class*="_headline"] [class*="_titleGroup"] > span:first-child,
body[data-glaze-variant][data-glaze-headline-style="gradient"] [class*="_headline"] [class*="_titleGroup"] > span:first-child::before {
  background: linear-gradient(120deg, var(--dsw-alias-label-primary) 15%, var(--glaze-accent) 62%, var(--glaze-motion-2, var(--glaze-accent)) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent !important;
}
body[data-glaze-variant][data-glaze-headline-style="glow"] [class*="_headline"] [class*="_titleGroup"] > span:first-child,
body[data-glaze-variant][data-glaze-headline-style="glow"] [class*="_headline"] [class*="_titleGroup"] > span:first-child::before {
  text-shadow: 0 2px 18px color-mix(in oklch, var(--glaze-accent), transparent 45%);
}
body[data-glaze-variant][data-glaze-custom-headline="1"] [class*="_headline"] [class*="_titleGroup"] > span:first-child {
  font-size: 0 !important;
  color: transparent !important;
  background: none !important;
  -webkit-background-clip: border-box !important;
}
body[data-glaze-variant][data-glaze-custom-headline="1"] [class*="_headline"] [class*="_titleGroup"] > span:first-child::before {
  content: var(--glaze-hero-headline);
  font-family: var(--glaze-display-font, inherit);
  font-size: var(--glaze-headline-size, 28px);
  line-height: 1.3;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--dsw-alias-label-primary);
  display: inline-block;
}
body[data-glaze-variant][data-glaze-custom-headline="1"][data-glaze-headline-style="gradient"] [class*="_headline"] [class*="_titleGroup"] > span:first-child::before {
  background: linear-gradient(120deg, var(--dsw-alias-label-primary) 15%, var(--glaze-accent) 62%, var(--glaze-motion-2, var(--glaze-accent)) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent !important;
}

/* Center Hero Badge */
body[data-glaze-variant][data-glaze-hero-badge="hidden"] [class*="_headline"] [class*="_previewBadge"] {
  display: none !important;
}
body[data-glaze-variant][data-glaze-hero-badge="custom"] [class*="_headline"] [class*="_previewBadge"] {
  font-size: 0 !important;
}
body[data-glaze-variant][data-glaze-hero-badge="custom"] [class*="_headline"] [class*="_previewBadge"]::before {
  content: var(--glaze-hero-badge);
  font-size: 12px;
  line-height: 18px;
}

/* Optional: Hide blank-home pixel whale canvas */
body[data-glaze-variant][data-glaze-hide-canvas="1"] [class*="_scrollBody"] canvas {
  display: none !important;
}

/* Composer Placeholder */
body[data-glaze-variant][data-glaze-custom-placeholder="1"] [data-composer-placeholder] {
  font-size: 0 !important;
  color: transparent !important;
}
body[data-glaze-variant][data-glaze-custom-placeholder="1"] [data-composer-placeholder]::before {
  content: var(--glaze-composer-placeholder);
  font-size: var(--dsh-content-font-size, 14px);
  color: var(--dsw-alias-markdown-placeholder);
}

/* Bottom-left Account Launcher */
body[data-glaze-variant][data-glaze-custom-user="1"] [class*="_settingsArea"] button[class*="_trigger"]:not([data-signed-out="true"]) [class*="_label"] {
  font-size: 0 !important;
  color: transparent !important;
}
body[data-glaze-variant][data-glaze-custom-user="1"] [class*="_settingsArea"] button[class*="_trigger"]:not([data-signed-out="true"]) [class*="_label"]::before {
  content: var(--glaze-user-name);
  font-size: 14px;
  line-height: 20px;
  color: var(--dsw-alias-label-primary);
}
body[data-glaze-variant][data-glaze-user-avatar="emoji"] [class*="_settingsArea"] button[class*="_trigger"] [class*="_avatar"] > *,
body[data-glaze-variant][data-glaze-user-avatar="image"] [class*="_settingsArea"] button[class*="_trigger"] [class*="_avatar"] > * {
  display: none !important;
}
body[data-glaze-variant][data-glaze-user-avatar="emoji"] [class*="_settingsArea"] button[class*="_trigger"] [class*="_avatar"]::before {
  content: var(--glaze-user-avatar-emoji);
  font-size: 15px;
  line-height: 24px;
}
body[data-glaze-variant][data-glaze-user-avatar="image"] [class*="_settingsArea"] button[class*="_trigger"] [class*="_avatar"]::before {
  content: '';
  display: block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-image: var(--glaze-user-avatar-img);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
`
}

export function buildUiCSS() {
  return `
/* ═══ Top-bar Capsule Switcher & Corner Alignment (Zero Overlap) ═══ */
[data-conversation-header-corner]:has(.dsh-glaze-switcher) {
  display: inline-flex !important;
  align-items: center;
  gap: 8px;
}
.dsh-glaze-switcher {
  position: relative;
  display: inline-flex;
  align-items: center;
  z-index: 50;
  flex: none;
  font-family: var(--dsw-font-family, system-ui, -apple-system, sans-serif);
}
.dsh-glaze-switcher[data-host-mode="utilities"] {
  margin-right: 6px;
}
.dsh-glaze-switcher[data-host-mode="titleRow"] {
  margin-left: auto;
}
.dsh-glaze-switcher[data-floating="1"] {
  position: fixed;
  top: 10px;
  right: 56px;
}
.dsh-glaze-trigger {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 28px;
  padding: 0 11px;
  border: 1px solid var(--glaze-hairline, rgba(146,168,179,0.3));
  border-radius: 999px;
  background: color-mix(in oklch, var(--dsw-alias-bg-layer-2, #fff), transparent 20%);
  color: var(--dsw-alias-label-primary, #222);
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
}
.dsh-glaze-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex: none;
  box-shadow: 0 0 0 1px rgba(255,255,255,0.28);
}
.dsh-glaze-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 356px;
  max-height: 78vh;
  overflow-y: auto;
  padding: 12px;
  border-radius: 14px;
  border: 1px solid var(--glaze-hairline-strong, rgba(146,168,179,0.45));
  background: var(--dsw-alias-bg-layer-2, #1f2228);
  color: var(--dsw-alias-label-primary, #eee);
  box-shadow: 0 20px 50px -12px rgba(0,0,0,0.48);
  z-index: 2147482000;
}
.dsh-glaze-menu[hidden] { display: none; }
.dsh-glaze-menu__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 12px;
  color: var(--dsw-alias-label-secondary, #999);
}
.dsh-glaze-menu__head strong {
  color: var(--dsw-alias-label-primary, #fff);
  font-size: 13px;
}
.dsh-glaze-subhead {
  margin: 8px 0 6px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--dsw-alias-label-tertiary, #888);
}
.dsh-glaze-master-mini {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 5px;
}
.dsh-glaze-master-chip {
  padding: 6px 6px;
  border-radius: 8px;
  border: 1px solid var(--glaze-hairline, rgba(146,168,179,0.25));
  background: color-mix(in oklch, var(--dsw-alias-bg-layer-1, #181a1f), transparent 25%);
  color: var(--dsw-alias-label-primary);
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dsh-glaze-master-chip:hover {
  border-color: var(--glaze-hairline-strong);
  background: color-mix(in oklch, var(--glaze-accent), transparent 86%);
}
.dsh-glaze-master-chip[data-active="true"] {
  border-color: var(--glaze-accent);
  background: color-mix(in oklch, var(--glaze-accent), transparent 80%);
  font-weight: 600;
}
.dsh-glaze-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 5px;
}
.dsh-glaze-swatch {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 6px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: color-mix(in oklch, var(--dsw-alias-bg-layer-1, #181a1f), transparent 35%);
  color: var(--dsw-alias-label-primary, #eee);
  font-size: 11.5px;
  cursor: pointer;
  min-width: 0;
}
.dsh-glaze-swatch:hover {
  border-color: var(--glaze-hairline-strong);
}
.dsh-glaze-swatch[data-active="true"] {
  border-color: var(--glaze-accent);
  background: color-mix(in oklch, var(--glaze-accent), transparent 84%);
  font-weight: 600;
}
.dsh-glaze-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 9px;
  border-radius: 9px;
  border: 1px solid transparent;
  background: color-mix(in oklch, var(--dsw-alias-bg-layer-1, #181a1f), transparent 35%);
  color: var(--dsw-alias-label-primary, #eee);
  cursor: pointer;
  text-align: left;
  transition: border-color 140ms ease, background 140ms ease;
}
.dsh-glaze-option:hover {
  border-color: var(--glaze-hairline-strong);
  background: color-mix(in oklch, var(--glaze-accent), transparent 88%);
}
.dsh-glaze-option[data-active="true"] {
  border-color: var(--glaze-accent);
  background: color-mix(in oklch, var(--glaze-accent), transparent 84%);
}
.dsh-glaze-option__text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.dsh-glaze-option__name {
  font-size: 12.5px;
  font-weight: 600;
  line-height: 1.25;
}
.dsh-glaze-option__poem {
  font-size: 10.5px;
  color: var(--dsw-alias-label-tertiary, #888);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dsh-glaze-appear {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--glaze-hairline, rgba(146,168,179,0.22));
}
.dsh-glaze-appear button {
  padding: 6px 4px;
  border-radius: 8px;
  border: 1px solid var(--glaze-hairline, rgba(146,168,179,0.25));
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font-size: 12px;
  cursor: pointer;
}
.dsh-glaze-appear button[data-active="true"] {
  border-color: var(--glaze-accent);
  background: color-mix(in oklch, var(--glaze-accent), transparent 85%);
  font-weight: 600;
}
.dsh-glaze-menu__cta {
  width: 100%;
  margin-top: 10px;
  padding: 8px 12px;
  border: 0;
  border-radius: 9px;
  background: var(--glaze-accent);
  color: var(--dsw-alias-button-primary-dimmed, #fff);
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
}
.dsh-glaze-menu__cta:hover { filter: brightness(1.06); }

/* ═══ 5-Tab Customizer Modal ═══ */
.dsh-glaze-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2147483000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(8, 12, 18, 0.56);
}
.dsh-glaze-modal-backdrop[hidden] { display: none; }
.dsh-glaze-modal {
  width: min(800px, 100%);
  max-height: min(88vh, 760px);
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  border: 1px solid var(--glaze-hairline-strong, rgba(146,168,179,0.4));
  background: var(--dsw-alias-bg-layer-2, #1f2228);
  color: var(--dsw-alias-label-primary, #f0f0f0);
  box-shadow: 0 28px 70px rgba(0, 0, 0, 0.52);
  overflow: hidden;
  font-family: var(--dsw-font-family, system-ui, -apple-system, sans-serif);
}
.dsh-glaze-modal__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid var(--glaze-hairline, rgba(146,168,179,0.22));
}
.dsh-glaze-modal__title {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.dsh-glaze-modal__title h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}
.dsh-glaze-modal__title span {
  font-size: 12px;
  color: var(--dsw-alias-label-secondary, #999);
}
.dsh-glaze-modal__close {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid var(--glaze-hairline);
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
}
.dsh-glaze-tabs {
  display: flex;
  gap: 6px;
  padding: 10px 20px 0;
  border-bottom: 1px solid var(--glaze-hairline, rgba(146,168,179,0.22));
  overflow-x: auto;
}
.dsh-glaze-tab {
  padding: 8px 13px 10px;
  border: 0;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
}
.dsh-glaze-tab[data-active="true"] {
  color: var(--glaze-accent);
  border-bottom-color: var(--glaze-accent);
  font-weight: 600;
}
.dsh-glaze-modal__body {
  flex: 1;
  overflow-y: auto;
  padding: 18px 20px;
}
.dsh-glaze-panel[hidden] { display: none; }
.dsh-glaze-section {
  margin-bottom: 16px;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid var(--glaze-hairline, rgba(146,168,179,0.22));
  background: color-mix(in oklch, var(--dsw-alias-bg-layer-1, #14161a), transparent 20%);
}
.dsh-glaze-section h3 {
  margin: 0 0 10px;
  font-size: 13.5px;
  font-weight: 600;
}
.dsh-glaze-hint {
  margin: 4px 0 8px;
  font-size: 11.5px;
  color: var(--dsw-alias-label-tertiary, #888);
  line-height: 1.45;
}
.dsh-glaze-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}
.dsh-glaze-row:last-child { margin-bottom: 0; }
.dsh-glaze-row label {
  font-size: 12.5px;
  color: var(--dsw-alias-label-secondary);
  min-width: 118px;
}
.dsh-glaze-input,
.dsh-glaze-select {
  flex: 1;
  min-width: 0;
  height: 34px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid var(--glaze-hairline-strong, rgba(146,168,179,0.35));
  background: var(--dsw-alias-bg-layer-1, #121418);
  color: var(--dsw-alias-label-primary, #f0f0f0);
  font-size: 13px;
}
.dsh-glaze-master-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(215px, 1fr));
  gap: 8px;
}
.dsh-glaze-master-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid var(--glaze-hairline);
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
  text-align: left;
  cursor: pointer;
}
.dsh-glaze-master-card:hover {
  border-color: var(--glaze-hairline-strong);
  background: color-mix(in oklch, var(--glaze-accent), transparent 90%);
}
.dsh-glaze-master-card[data-active="true"] {
  border-color: var(--glaze-accent);
  background: color-mix(in oklch, var(--glaze-accent), transparent 84%);
}
.dsh-glaze-master-card__top {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 600;
}
.dsh-glaze-master-card__desc {
  font-size: 11px;
  color: var(--dsw-alias-label-tertiary);
}
.dsh-glaze-palette-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(145px, 1fr));
  gap: 7px;
}
.dsh-glaze-font-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(195px, 1fr));
  gap: 8px;
}
.dsh-glaze-font-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid var(--glaze-hairline);
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
  text-align: left;
  cursor: pointer;
}
.dsh-glaze-font-card[data-active="true"] {
  border-color: var(--glaze-accent);
  background: color-mix(in oklch, var(--glaze-accent), transparent 88%);
}
.dsh-glaze-font-card__top {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 600;
}
.dsh-glaze-font-card__tag {
  font-size: 10.5px;
  padding: 1px 6px;
  border-radius: 999px;
  background: color-mix(in oklch, var(--glaze-accent), transparent 86%);
  color: var(--glaze-accent);
}
.dsh-glaze-font-card__sample {
  font-size: 15px;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dsh-glaze-btn {
  height: 32px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid var(--glaze-hairline-strong);
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font-size: 12.5px;
  cursor: pointer;
  white-space: nowrap;
}
.dsh-glaze-btn:hover {
  border-color: var(--glaze-accent);
  color: var(--glaze-accent);
}
.dsh-glaze-btn--primary {
  border-color: transparent;
  background: var(--glaze-accent);
  color: var(--dsw-alias-button-primary-dimmed, #fff);
  font-weight: 600;
}
.dsh-glaze-btn--primary:hover {
  color: var(--dsw-alias-button-primary-dimmed, #fff);
  filter: brightness(1.06);
}
.dsh-glaze-modal__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 20px;
  border-top: 1px solid var(--glaze-hairline, rgba(146,168,179,0.22));
  font-size: 12px;
  color: var(--dsw-alias-label-secondary);
}
`
}
