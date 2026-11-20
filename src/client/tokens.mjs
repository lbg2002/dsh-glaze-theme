import { PALETTE, OTHER_VARIANTS, mix } from './palette.mjs'

function glazeTokens(p, dark) {
  const tx = dark ? p.txD : p.txL
  const bg = dark ? p.bgD : p.bgL
  const m = p.morandi
  const motion = dark ? p.motionD : p.motionL
  const accent = dark ? p.accentD : p.accentL
  return `
  --glaze-morandi: ${m};
  --glaze-accent: ${accent};
  --glaze-bg: ${bg};
  --glaze-tx: ${tx};
  --glaze-motion-1: ${motion[0]};
  --glaze-motion-2: ${motion[1]};
  --glaze-motion-3: ${motion[2]};
  --glaze-aurora-stream-1: color-mix(in oklch, ${motion[0]}, transparent ${dark ? 58 : 74}%);
  --glaze-aurora-stream-2: color-mix(in oklch, ${motion[1]}, transparent ${dark ? 58 : 74}%);
  --glaze-aurora-stream-3: color-mix(in oklch, ${motion[2]}, transparent ${dark ? 58 : 74}%);
  --glaze-shadow-sm: 0 2px 8px ${dark ? 'rgba(0,0,0,0.38)' : mix(tx, 96)};
  --glaze-shadow: 0 10px 30px ${dark ? 'rgba(0,0,0,0.48)' : mix(tx, 94)};
  --glaze-shadow-lg: 0 24px 60px ${dark ? 'rgba(0,0,0,0.58)' : mix(tx, 90)};
  --dsw-alias-state-business-primary: ${accent};
  --glaze-hairline: rgba(${m}, 0.30);
  --glaze-hairline-strong: rgba(${m}, ${dark ? 0.55 : 0.50});
  --glaze-glow: rgba(${m}, ${dark ? 0.32 : 0.20});
  --glaze-code-bg: rgba(${m}, ${dark ? 0.16 : 0.13});
  --glaze-code-fg: ${tx};`
}

function borderStack(p, dark) {
  const m = p.morandi
  const tx = dark ? p.txD : p.txL
  return dark
    ? `  --dsw-alias-border-l1: rgba(${m}, 0.10);
  --dsw-alias-border-l2: rgba(${m}, 0.18);
  --dsw-alias-border-l3: rgba(${m}, 0.28);
  --dsw-alias-border-l4: rgba(${m}, 0.40);`
    : `  --dsw-alias-border-l1: ${mix(tx, 90)};
  --dsw-alias-border-l2: ${mix(tx, 80)};
  --dsw-alias-border-l3: ${mix(tx, 70)};
  --dsw-alias-border-l4: ${mix(tx, 60)};`
}

function labelStack(p, dark) {
  const tx = dark ? p.txD : p.txL
  return dark
    ? `  --dsw-alias-label-secondary: ${mix(tx, 30)};
  --dsw-alias-label-tertiary: ${mix(tx, 35)};
  --dsw-alias-label-caption: ${mix(tx, 40)};
  --dsw-alias-label-dimmed: ${mix(tx, 43)};`
    : `  --dsw-alias-label-secondary: ${mix(tx, 28)};
  --dsw-alias-label-tertiary: ${mix(tx, 32)};
  --dsw-alias-label-caption: ${mix(tx, 35)};
  --dsw-alias-label-dimmed: ${mix(tx, 37)};`
}

function sharedDswTokens(p, dark) {
  const bg = dark ? p.bgD : p.bgL
  const tx = dark ? p.txD : p.txL
  const ok = dark ? 'oklch(72% 0.12 150)' : 'oklch(45% 0.14 150)'
  const err = dark ? 'oklch(72% 0.16 25)' : 'oklch(45% 0.16 25)'
  const warn = dark ? 'oklch(80% 0.12 75)' : 'oklch(45% 0.11 75)'
  const t = (c, pct) => `color-mix(in oklch, ${c}, ${bg} ${pct}%)`
  return `
  --dsw-alias-state-success-primary: ${ok};
  --dsw-alias-state-success-secondary: ${ok};
  --dsw-alias-state-success-tertiary: ${t(ok, dark ? 78 : 88)};
  --dsw-alias-state-error-primary: ${err};
  --dsw-alias-state-error-secondary: ${err};
  --dsw-alias-state-warn-primary: ${warn};
  --dsw-alias-state-warn-secondary: ${warn};
  --dsw-alias-state-warn-tertiary: ${t(warn, dark ? 78 : 88)};
  --dsw-alias-state-warn-label: ${dark ? 'oklch(88% 0.1 75)' : 'oklch(40% 0.09 75)'};
  --dsw-alias-interactive-bg-hover-danger: ${mix(err, dark ? 86 : 90)};
  --dsw-alias-state-business-tertiary: ${t(dark ? p.accentD : p.accentL, dark ? 78 : 88)};
  --dsw-alias-border-inverted: ${mix(bg, 85)};
  --dsw-alias-border-inverted2: ${mix(bg, 70)};
  --dsw-alias-label-primary-inverted: ${bg};
  --dsw-alias-button-contrast-fill: ${tx};
  --dsw-alias-button-elevated-fill: ${bg};
  --dsw-alias-button-tool-bar-fill-invisible: transparent;
  --dsw-alias-markdown-code-block-banner: ${mix(tx, 96)};
  --dsw-alias-tooltip-bg: color-mix(in oklch, ${dark ? bg : tx}, black ${dark ? 22 : 8}%);
  --dsw-alias-toast-bg: color-mix(in oklch, ${dark ? bg : tx}, black ${dark ? 22 : 8}%);
  --dsw-alias-bg-mask-photo: color-mix(in oklch, ${bg}, black ${dark ? 45 : 30}%);`
}

function mistLight(p) {
  const { accentL: aL, bgL, txL, sfL, sf2L } = p
  return `
body:not([data-glaze-variant]), body[data-glaze-variant="mist"] {${glazeTokens(p, false)}${sharedDswTokens(p, false)}
  --dsw-alias-bg-base: ${bgL};
  --dsw-alias-bg-layer-1: ${bgL};
  --dsw-alias-bg-layer-2: ${sfL};
  --dsw-alias-bg-layer-3: ${sf2L};
  --dsw-alias-bg-overlay: ${sfL};
  --dsw-alias-bg-module-platform: ${sfL};
  --dsw-alias-bg-multi-select: ${sf2L};
  --dsw-alias-bg-skeleton: ${mix(txL, 96)};
  --dsw-alias-bg-mask-1: ${mix(txL, 97)};
  --dsw-alias-bg-mask-2: ${mix(txL, 95)};
  --dsw-alias-bg-mask-3: ${mix(txL, 93)};
  --dsw-alias-bg-mask-drop: ${mix(txL, 88)};
  --dsw-alias-label-primary: ${txL};
  --dsw-alias-label-primary-bluish: ${txL};
  --dsw-alias-label-primary-dimmed: ${mix(txL, 25)};
  --dsw-alias-label-primary-foreground: ${bgL};
${labelStack(p, false)}
  --dsw-alias-brand-primary: ${aL};
  --dsw-alias-brand-primary-invert: ${bgL};
  --dsw-alias-brand-text: ${bgL};
${borderStack(p, false)}
  --dsw-alias-button-primary-fill: ${aL};
  --dsw-alias-button-primary-hover: color-mix(in oklch, ${aL}, black 8%);
  --dsw-alias-button-primary-dimmed: ${bgL};
  --dsw-alias-button-tool-bar-fill: ${sfL};
  --dsw-alias-button-tool-bar-hover: ${mix(txL, 95)};
  --dsw-alias-button-floating-fill: ${sfL};
  --dsw-alias-button-floating-hover: ${sf2L};
  --dsw-alias-button-info-fill: ${mix(aL, 90)};
  --dsw-alias-button-info-hover: ${mix(aL, 84)};
  --dsw-alias-button-ghost-active-fill: ${mix(aL, 92)};
  --dsw-alias-button-ghost-active-hover: ${mix(aL, 88)};
  --dsw-alias-button-ghost-active-border: ${mix(aL, 78)};
  --dsw-alias-interactive-bg-hover: ${mix(aL, 92)};
  --dsw-alias-interactive-bg-hover-accent: ${mix(aL, 85)};
  --dsw-alias-interactive-bg-hover-solid: ${mix(aL, 88)};
  --dsw-alias-interactive-bg-active: ${mix(aL, 88)};
  --dsw-alias-markdown-inline-code: var(--glaze-code-bg);
  --dsw-alias-markdown-code-block: ${sfL};
  --dsw-alias-markdown-tag: ${mix(aL, 88)};
  --dsw-alias-markdown-placeholder: ${mix(txL, 50)};
  --dsw-alias-markdown-citation: ${mix(txL, 55)};
  --dsw-alias-scrollbar-bg-l1: ${mix(txL, 90)};
  --dsw-alias-scrollbar-bg-l2: ${mix(txL, 80)};
  --dsw-alias-scrollbar-hover-l1: ${mix(txL, 82)};
  --dsw-alias-scrollbar-hover-l2: ${mix(txL, 72)};
  --dsw-specific-bubble: color-mix(in oklch, ${bgL}, ${txL} 3%);
  --dsw-specific-bubble-highlight: ${mix(aL, 88)};
  --dsw-specific-input-major: ${bgL};
  --dsw-specific-login-input: ${sfL};
  --dsw-specific-menu: ${sf2L};
  --dsw-specific-selector: ${sfL};
  --dsw-specific-sidebar-fill: color-mix(in oklch, ${bgL}, ${txL} 5%);
  --dsw-specific-sidebar-nav-item-active-accent: ${mix(aL, 86)};
  --dsw-specific-sidebar-nav-item-active: ${mix(aL, 93)};
  --dsw-specific-sidebar-nav-item-hover: ${mix(txL, 95)};
  --dsw-specific-tip: ${mix(aL, 90)};
}`
}

function mistDark(p) {
  const { accentD: aD, bgD, txD, sfD, sf2D } = p
  return `
body[data-ds-dark-theme]:not([data-glaze-variant]), body[data-ds-dark-theme][data-glaze-variant="mist"] {${glazeTokens(p, true)}${sharedDswTokens(p, true)}
  --dsw-alias-bg-base: ${bgD};
  --dsw-alias-bg-layer-1: ${bgD};
  --dsw-alias-bg-layer-2: ${sfD};
  --dsw-alias-bg-layer-3: ${sf2D};
  --dsw-alias-bg-overlay: ${sfD};
  --dsw-alias-bg-module-platform: ${sfD};
  --dsw-alias-bg-multi-select: ${sf2D};
  --dsw-alias-bg-skeleton: ${mix(txD, 94)};
  --dsw-alias-bg-mask-1: ${mix(txD, 96)};
  --dsw-alias-bg-mask-2: ${mix(txD, 93)};
  --dsw-alias-bg-mask-3: ${mix(txD, 90)};
  --dsw-alias-bg-mask-drop: ${mix(txD, 84)};
  --dsw-alias-label-primary: ${txD};
  --dsw-alias-label-primary-bluish: ${txD};
  --dsw-alias-label-primary-dimmed: ${mix(txD, 30)};
  --dsw-alias-label-primary-foreground: ${bgD};
${labelStack(p, true)}
  --dsw-alias-brand-primary: ${aD};
  --dsw-alias-brand-primary-invert: ${bgD};
  --dsw-alias-brand-text: ${bgD};
${borderStack(p, true)}
  --dsw-alias-button-primary-fill: ${aD};
  --dsw-alias-button-primary-hover: color-mix(in oklch, ${aD}, white 8%);
  --dsw-alias-button-primary-dimmed: ${bgD};
  --dsw-alias-button-tool-bar-fill: ${sfD};
  --dsw-alias-button-tool-bar-hover: ${mix(txD, 92)};
  --dsw-alias-button-floating-fill: ${sfD};
  --dsw-alias-button-floating-hover: ${sf2D};
  --dsw-alias-button-info-fill: ${mix(aD, 86)};
  --dsw-alias-button-info-hover: ${mix(aD, 78)};
  --dsw-alias-button-ghost-active-fill: ${mix(aD, 88)};
  --dsw-alias-button-ghost-active-hover: ${mix(aD, 82)};
  --dsw-alias-button-ghost-active-border: ${mix(aD, 70)};
  --dsw-alias-interactive-bg-hover: ${mix(aD, 90)};
  --dsw-alias-interactive-bg-hover-accent: ${mix(aD, 84)};
  --dsw-alias-interactive-bg-hover-solid: ${mix(aD, 82)};
  --dsw-alias-interactive-bg-active: ${mix(aD, 86)};
  --dsw-alias-markdown-inline-code: var(--glaze-code-bg);
  --dsw-alias-markdown-code-block: oklch(24% 0.02 240);
  --dsw-alias-markdown-tag: ${mix(aD, 85)};
  --dsw-alias-markdown-placeholder: ${mix(txD, 40)};
  --dsw-alias-markdown-citation: ${mix(txD, 35)};
  --dsw-alias-scrollbar-bg-l1: ${mix(txD, 86)};
  --dsw-alias-scrollbar-bg-l2: ${mix(txD, 76)};
  --dsw-alias-scrollbar-hover-l1: ${mix(txD, 75)};
  --dsw-alias-scrollbar-hover-l2: ${mix(txD, 65)};
  --dsw-specific-bubble: color-mix(in oklch, ${bgD}, white 3%);
  --dsw-specific-bubble-highlight: ${mix(aD, 82)};
  --dsw-specific-input-major: ${bgD};
  --dsw-specific-login-input: ${sfD};
  --dsw-specific-menu: ${sf2D};
  --dsw-specific-selector: ${sfD};
  --dsw-specific-sidebar-fill: color-mix(in oklch, ${bgD}, black 7%);
  --dsw-specific-sidebar-nav-item-active-accent: ${mix(aD, 80)};
  --dsw-specific-sidebar-nav-item-active: ${mix(aD, 88)};
  --dsw-specific-sidebar-nav-item-hover: ${mix(txD, 95)};
  --dsw-specific-tip: ${mix(aD, 84)};
}`
}

function variantBlock(v, dark) {
  const p = PALETTE[v]
  const a = dark ? p.accentD : p.accentL
  const bg = dark ? p.bgD : p.bgL
  const tx = dark ? p.txD : p.txL
  const sf = dark ? p.sfD : p.sfL
  const sf2 = dark ? p.sf2D : p.sf2L
  const sel = dark
    ? `body[data-ds-dark-theme][data-glaze-variant="${v}"]`
    : `body[data-glaze-variant="${v}"]`
  return `
${sel} {${glazeTokens(p, dark)}${sharedDswTokens(p, dark)}
  --dsw-alias-bg-base: ${bg};
  --dsw-alias-bg-layer-1: ${bg};
  --dsw-alias-bg-layer-2: ${sf};
  --dsw-alias-bg-layer-3: ${sf2};
  --dsw-alias-bg-overlay: ${sf};
  --dsw-alias-bg-module-platform: ${sf};
  --dsw-alias-bg-multi-select: ${sf2};
  --dsw-alias-bg-skeleton: ${mix(tx, 95)};
  --dsw-alias-bg-mask-1: ${mix(tx, 97)};
  --dsw-alias-bg-mask-2: ${mix(tx, 95)};
  --dsw-alias-bg-mask-3: ${mix(tx, 93)};
  --dsw-alias-bg-mask-drop: ${mix(tx, 88)};
  --dsw-alias-brand-primary: ${a};
  --dsw-alias-brand-primary-invert: ${bg};
  --dsw-alias-brand-text: ${bg};
  --dsw-alias-button-primary-fill: ${a};
  --dsw-alias-button-primary-hover: color-mix(in oklch, ${a}, ${dark ? 'white' : 'black'} 8%);
  --dsw-alias-button-primary-dimmed: ${bg};
  --dsw-alias-button-info-fill: ${mix(a, dark ? 86 : 90)};
  --dsw-alias-button-info-hover: ${mix(a, dark ? 78 : 84)};
  --dsw-alias-button-ghost-active-fill: ${mix(a, dark ? 88 : 92)};
  --dsw-alias-button-ghost-active-hover: ${mix(a, dark ? 82 : 88)};
  --dsw-alias-button-ghost-active-border: ${mix(a, dark ? 70 : 78)};
  --dsw-alias-button-tool-bar-fill: ${sf};
  --dsw-alias-button-tool-bar-hover: ${mix(tx, dark ? 92 : 95)};
  --dsw-alias-button-floating-fill: ${sf};
  --dsw-alias-button-floating-hover: ${sf2};
  --dsw-alias-interactive-bg-hover: ${mix(a, dark ? 90 : 92)};
  --dsw-alias-interactive-bg-hover-accent: ${mix(a, dark ? 84 : 85)};
  --dsw-alias-interactive-bg-hover-solid: ${mix(a, dark ? 82 : 88)};
  --dsw-alias-interactive-bg-active: ${mix(a, dark ? 86 : 88)};
  --dsw-alias-markdown-tag: ${mix(a, dark ? 85 : 88)};
  --dsw-alias-markdown-inline-code: var(--glaze-code-bg);
  --dsw-alias-markdown-code-block: ${dark ? `color-mix(in oklch, ${bg}, black 12%)` : sf};
  --dsw-alias-scrollbar-bg-l1: ${mix(tx, dark ? 86 : 90)};
  --dsw-alias-scrollbar-bg-l2: ${mix(tx, dark ? 76 : 80)};
  --dsw-alias-scrollbar-hover-l1: ${mix(tx, dark ? 75 : 82)};
  --dsw-alias-scrollbar-hover-l2: ${mix(tx, dark ? 65 : 72)};
  --dsw-alias-label-primary: ${tx};
  --dsw-alias-label-primary-bluish: ${tx};
  --dsw-alias-label-primary-dimmed: ${mix(tx, dark ? 30 : 25)};
  --dsw-alias-label-primary-foreground: ${bg};
${labelStack(p, dark)}
${borderStack(p, dark)}
  --dsw-alias-markdown-placeholder: ${mix(tx, dark ? 40 : 50)};
  --dsw-alias-markdown-citation: ${mix(tx, dark ? 35 : 55)};
  --dsw-specific-bubble: color-mix(in oklch, ${bg}, ${tx} ${dark ? 4 : 3}%);
  --dsw-specific-bubble-highlight: ${mix(a, dark ? 82 : 88)};
  --dsw-specific-input-major: ${bg};
  --dsw-specific-login-input: ${sf};
  --dsw-specific-menu: ${sf2};
  --dsw-specific-selector: ${sf};
  --dsw-specific-sidebar-fill: color-mix(in oklch, ${bg}, ${dark ? 'black' : tx} ${dark ? 7 : 5}%);
  --dsw-specific-sidebar-nav-item-active-accent: ${mix(a, dark ? 80 : 86)};
  --dsw-specific-sidebar-nav-item-active: ${mix(a, dark ? 88 : 93)};
  --dsw-specific-sidebar-nav-item-hover: ${mix(tx, dark ? 95 : 95)};
  --dsw-specific-tip: ${mix(a, dark ? 84 : 90)};
}`
}

function customAccentOverrideBlock() {
  return `
body[data-glaze-variant][data-glaze-custom-accent="1"] {
  --glaze-accent: var(--glaze-user-accent);
  --dsw-alias-brand-primary: var(--glaze-user-accent);
  --dsw-alias-state-business-primary: var(--glaze-user-accent);
  --dsw-alias-state-business-tertiary: color-mix(in oklch, var(--glaze-user-accent), var(--glaze-bg) 82%);
  --dsw-alias-button-primary-fill: var(--glaze-user-accent);
  --dsw-alias-button-primary-hover: color-mix(in oklch, var(--glaze-user-accent), black 10%);
  --dsw-alias-button-primary-dimmed: var(--glaze-user-accent-fg, var(--glaze-bg));
  --dsw-alias-interactive-bg-hover: color-mix(in oklch, var(--glaze-user-accent), transparent 90%);
  --dsw-alias-interactive-bg-active: color-mix(in oklch, var(--glaze-user-accent), transparent 86%);
  --dsw-alias-button-ghost-active-border: color-mix(in oklch, var(--glaze-user-accent), transparent 72%);
}
body[data-ds-dark-theme][data-glaze-variant][data-glaze-custom-accent="1"] {
  --dsw-alias-button-primary-hover: color-mix(in oklch, var(--glaze-user-accent), white 10%);
}`
}

export function buildTokensCSS() {
  const blocks = [mistLight(PALETTE.mist), mistDark(PALETTE.mist)]
  for (const v of OTHER_VARIANTS) {
    blocks.push(variantBlock(v, false), variantBlock(v, true))
  }
  blocks.push(customAccentOverrideBlock())
  return blocks.join('\n')
}
