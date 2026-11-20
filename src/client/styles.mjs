/**
 * Zero-infinite-animation Glaze stylesheet + opt-in static Frosted mode +
 * 4-region CSS-driven Brand/Hero/Account customization + Switcher & Settings Modal CSS.
 */

export function buildCoreCSS() {
  return `
/* ═══ 1. Static Four-Corner Porcelain Ambience (0% idle GPU/CPU) ═══ */
body[data-glaze-variant] {
  --glaze-ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  --glaze-dur-fast: 140ms;
  --glaze-dur: 200ms;
  --glaze-ambience:
    radial-gradient(1300px circle at 6% -4%, color-mix(in oklch, var(--glaze-accent, #4e8c97), transparent 82%), transparent 52%),
    radial-gradient(1050px circle at 100% 8%, color-mix(in oklch, var(--glaze-aurora-stream-2), transparent 56%), transparent 60%),
    radial-gradient(900px circle at 96% 100%, color-mix(in oklch, var(--glaze-aurora-stream-3), transparent 56%), transparent 62%),
    radial-gradient(950px circle at 2% 96%, color-mix(in oklch, var(--glaze-aurora-stream-1), transparent 56%), transparent 60%);
}
body[data-glaze-variant][data-glaze-ambience="1"] {
  background-attachment: fixed;
  background-image: var(--glaze-ambience);
}
body[data-glaze-variant][data-glaze-ambience="0"] {
  background-image: none;
}

/* Let body ambience shine cleanly through full-bleed wrappers */
body[data-glaze-variant] [class*="_frame"],
body[data-glaze-variant] [class*="_centerCol"],
body[data-glaze-variant] [class*="_root"]:has([class*="_scrollBody"]),
body[data-glaze-variant] [class*="_scrollBody"] {
  background-color: transparent;
  background-image: none;
}

/* Composer sticky seat: mask-based fade with identical fixed ambience */
body[data-glaze-variant] [class*="_root"] [class*="_composerSeat"] {
  background-image: none;
}
body[data-glaze-variant][data-glaze-ambience="1"] [class*="_root"] [class*="_composerSeat"]::before {
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

/* ═══ 2. Porcelain Glaze Surfaces (Default: Zero Blur, Crisp Specular Edge) ═══ */
body[data-glaze-variant] [class*="_sidebarCol"] {
  position: relative;
  border-right: 0;
  background-color: color-mix(in oklch, var(--glaze-accent, #4e8c97), var(--dsw-alias-bg-layer-1, #fff) 94%);
  background-image: linear-gradient(
    180deg,
    color-mix(in oklch, var(--glaze-accent, #4e8c97), transparent 94%),
    transparent 160px
  );
  background-repeat: no-repeat;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.22),
    1px 0 0 var(--glaze-hairline),
    20px 0 36px -22px color-mix(in oklch, var(--glaze-accent, #4e8c97), transparent 52%);
}
body[data-ds-dark-theme][data-glaze-variant] [class*="_sidebarCol"] {
  background-color: color-mix(in oklch, var(--glaze-accent, #4e8c97), var(--dsw-alias-bg-layer-1, #101010) 93%);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.09),
    1px 0 0 var(--glaze-hairline),
    20px 0 36px -22px color-mix(in oklch, var(--glaze-accent, #4e8c97), transparent 42%);
}

/* Opt-in Static Frosted Mode: strictly on ::before pseudo-elements so fixed modal containing blocks stay untouched */
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

/* Composer Card: 3-layer static depth (specular highlight + crisp contact shadow + warm/cool halo) */
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

/* Message Bubbles: MUST restrict to div[class*="_bubble"] so span[class*="_bubble"] Tooltip stays untouched */
body[data-glaze-variant] div[class*="_bubble"] {
  border-radius: 14px;
  border: 1px solid color-mix(in oklch, var(--glaze-hairline, rgba(146,168,179,0.25)), transparent 35%);
  box-shadow: var(--glaze-shadow-sm);
}

/* Queue Dock */
body[data-glaze-variant] div[class*="_dock"]:has(> [class*="_preview"]) {
  background: color-mix(in oklch, var(--dsw-alias-bg-layer-2, #fff), transparent 10%);
  border: 1px solid var(--glaze-hairline);
  border-radius: 12px;
  box-shadow: var(--glaze-shadow-sm);
}
body[data-glaze-variant] div[class*="_dock"] [class*="_preview"] {
  color: var(--dsw-alias-label-secondary);
}

/* Header & Tabs: crisp hairline + gentle soft shadow instead of hard borders */
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

/* Sidebar Navigation Rows & Buttons */
body[data-glaze-variant] [class*="_sidebarCol"] [role="treeitem"],
body[data-glaze-variant] [class*="_sidebarCol"] [class*="_sessionRow"] {
  border-radius: 8px;
  transition: background var(--glaze-dur-fast) var(--glaze-ease), transform var(--glaze-dur-fast) var(--glaze-ease);
}
body[data-glaze-variant] [class*="_sidebarCol"] [class*="_sessionRow"]:hover,
body[data-glaze-variant] [class*="_sidebarCol"] [role="treeitem"]:hover {
  background: color-mix(in oklch, var(--glaze-accent, #4e8c97), transparent 92%);
  transform: translateX(2px);
}
body[data-glaze-variant] [class*="_sidebarCol"] [class*="_sessionRow"][class*="_selected"],
body[data-glaze-variant] [class*="_sidebarCol"] [class*="_sessionRow"][class*="_active"],
body[data-glaze-variant] [class*="_sidebarCol"] [class*="_sessionRow"][aria-selected="true"],
body[data-glaze-variant] [class*="_sidebarCol"] [role="treeitem"][aria-selected="true"] {
  background: color-mix(in oklch, var(--glaze-accent, #4e8c97), transparent 90%);
  font-weight: 500;
}
body[data-glaze-variant] [class*="_sidebarCol"] button[class*="_newSession"],
body[data-glaze-variant] [class*="_sidebarCol"] button[class*="_newChat"],
body[data-glaze-variant] [class*="_sessionLogButton"],
body[data-glaze-variant] .dsh-glaze-trigger {
  border-color: transparent;
  background: color-mix(in oklch, var(--glaze-accent, #4e8c97), transparent 91%);
  border-radius: 10px;
  transition: background var(--glaze-dur-fast) var(--glaze-ease), transform var(--glaze-dur-fast) var(--glaze-ease);
}
body[data-glaze-variant] [class*="_sidebarCol"] button[class*="_newSession"]:hover,
body[data-glaze-variant] [class*="_sidebarCol"] button[class*="_newChat"]:hover,
body[data-glaze-variant] [class*="_sessionLogButton"]:hover,
body[data-glaze-variant] .dsh-glaze-trigger:hover {
  background: color-mix(in oklch, var(--glaze-accent, #4e8c97), transparent 84%);
  transform: translateY(-1px);
}
body[data-glaze-variant] [class*="_footerActions"] {
  border-top: 0;
  box-shadow: 0 -6px 10px -8px color-mix(in oklch, var(--glaze-accent, #4e8c97), transparent 78%);
}

/* Menus, Selectors & Settings Cards */
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

/* Markdown Polish */
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

/* ═══ 3. Global Body Font Override ═══ */
body[data-glaze-variant][data-glaze-body-font="1"] {
  --dsw-font-family: var(--glaze-body-font);
  font-family: var(--glaze-body-font);
}

/* ═══ 4. Custom Brand, Hero, Headline Fonts & Account Launcher (Zero React DOM Mutation) ═══ */

/* ① Top-left Brand Icon */
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

/* ① Top-left Brand Name & Capsule Badge */
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
  font-size: 15px;
  font-weight: 600;
  line-height: 22px;
  letter-spacing: 0.01em;
  color: var(--dsw-alias-label-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
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

/* ② Center Hero Icon */
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

/* ② Center Hero Headline (Font, Size, Artistic Style & Text) */
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

/* ② Center Hero Badge */
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

/* ② Composer Placeholder */
body[data-glaze-variant][data-glaze-custom-placeholder="1"] [data-composer-placeholder] {
  font-size: 0 !important;
  color: transparent !important;
}
body[data-glaze-variant][data-glaze-custom-placeholder="1"] [data-composer-placeholder]::before {
  content: var(--glaze-composer-placeholder);
  font-size: var(--dsh-content-font-size, 14px);
  color: var(--dsw-alias-markdown-placeholder);
}

/* ④ Bottom-left Account Launcher */
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
/* ═══ Top-bar Capsule Switcher ═══ */
.dsh-glaze-switcher {
  position: relative;
  display: inline-flex;
  align-items: center;
  z-index: 50;
  font-family: var(--dsw-font-family, system-ui, -apple-system, sans-serif);
}
.dsh-glaze-switcher[data-floating="1"] {
  position: fixed;
  top: 12px;
  right: 16px;
}
.dsh-glaze-trigger {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 30px;
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
  width: 318px;
  padding: 12px;
  border-radius: 14px;
  border: 1px solid var(--glaze-hairline-strong, rgba(146,168,179,0.45));
  background: var(--dsw-alias-bg-layer-2, #1f2228);
  color: var(--dsw-alias-label-primary, #eee);
  box-shadow: 0 20px 50px -12px rgba(0,0,0,0.45);
  z-index: 2147482000;
}
.dsh-glaze-menu[hidden] { display: none; }
.dsh-glaze-menu__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 12px;
  color: var(--dsw-alias-label-secondary, #999);
}
.dsh-glaze-menu__head strong {
  color: var(--dsw-alias-label-primary, #fff);
  font-size: 13px;
}
.dsh-glaze-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
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

/* ═══ 4-Tab Customizer Modal ═══ */
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
  width: min(760px, 100%);
  max-height: min(86vh, 720px);
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
  padding: 8px 14px 10px;
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
  margin-bottom: 18px;
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
  margin: 4px 0 0;
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
  min-width: 112px;
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
.dsh-glaze-palette-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 8px;
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
