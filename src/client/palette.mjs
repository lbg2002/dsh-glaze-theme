/**
 * Ten Chinese porcelain / Morandi OKLCH palettes using the dual-track system:
 * - accentL / accentD ("readability track"): buttons, focus rings, active text (WCAG AA >= 4.5:1)
 * - morandi ("atmosphere track"): low-chroma RGB triple for subtle ambient tints, hairlines, and borders
 */

export const VARIANTS = [
  'ripple',
  'mist',
  'cinnabar',
  'petal',
  'sage',
  'stone',
  'lapis',
  'amber',
  'aurora',
  'lavender',
]

export const OTHER_VARIANTS = [
  'ripple',
  'cinnabar',
  'petal',
  'sage',
  'stone',
  'lapis',
  'amber',
  'aurora',
  'lavender',
]

export const PALETTE = {
  mist: {
    accentL: 'oklch(50% 0.08 240)',
    accentD: 'oklch(72% 0.12 240)',
    morandi: '146, 168, 179',
    bgL: 'oklch(96% 0.01 240)',
    bgD: 'oklch(28% 0.02 240)',
    txL: 'oklch(25% 0.02 240)',
    txD: 'oklch(96% 0.01 240)',
    sfL: 'oklch(94% 0.01 240)',
    sfD: 'oklch(34% 0.02 240)',
    sf2L: 'oklch(91% 0.01 240)',
    sf2D: 'oklch(40% 0.02 240)',
    motionL: ['oklch(50% 0.08 240)', 'oklch(50% 0.10 210)', 'oklch(50% 0.09 275)'],
    motionD: ['oklch(72% 0.12 240)', 'oklch(74% 0.13 210)', 'oklch(74% 0.11 275)'],
  },
  cinnabar: {
    accentL: 'oklch(55% 0.18 25)',
    accentD: 'oklch(72% 0.12 25)',
    morandi: '215, 75, 75',
    bgL: 'oklch(97% 0.005 25)',
    bgD: 'oklch(28% 0.02 25)',
    txL: 'oklch(25% 0.02 25)',
    txD: 'oklch(96% 0.01 25)',
    sfL: 'oklch(95% 0.005 25)',
    sfD: 'oklch(34% 0.02 25)',
    sf2L: 'oklch(92% 0.005 25)',
    sf2D: 'oklch(40% 0.02 25)',
    motionL: ['oklch(55% 0.18 25)', 'oklch(55% 0.16 65)', 'oklch(55% 0.15 350)'],
    motionD: ['oklch(72% 0.12 25)', 'oklch(74% 0.14 65)', 'oklch(73% 0.13 350)'],
  },
  petal: {
    accentL: 'oklch(58% 0.22 350)',
    accentD: 'oklch(75% 0.18 350)',
    morandi: '232, 133, 155',
    bgL: 'oklch(98% 0.01 350)',
    bgD: 'oklch(28% 0.02 350)',
    txL: 'oklch(25% 0.02 354)',
    txD: 'oklch(98% 0.01 350)',
    sfL: 'oklch(96% 0.015 350)',
    sfD: 'oklch(34% 0.02 350)',
    sf2L: 'oklch(94% 0.015 350)',
    sf2D: 'oklch(40% 0.02 350)',
    motionL: ['oklch(58% 0.22 350)', 'oklch(58% 0.17 310)', 'oklch(58% 0.17 20)'],
    motionD: ['oklch(75% 0.18 350)', 'oklch(75% 0.14 310)', 'oklch(76% 0.14 20)'],
  },
  ripple: {
    accentL: 'oklch(51% 0.12 195)',
    accentD: 'oklch(75% 0.12 195)',
    morandi: '95, 168, 178',
    bgL: 'oklch(96% 0.01 195)',
    bgD: 'oklch(20% 0.02 195)',
    txL: 'oklch(25% 0.02 195)',
    txD: 'oklch(96% 0.01 195)',
    sfL: 'oklch(94% 0.01 195)',
    sfD: 'oklch(28% 0.02 195)',
    sf2L: 'oklch(92% 0.01 195)',
    sf2D: 'oklch(38% 0.02 195)',
    motionL: ['oklch(51% 0.12 195)', 'oklch(51% 0.13 225)', 'oklch(51% 0.11 165)'],
    motionD: ['oklch(75% 0.12 195)', 'oklch(76% 0.14 225)', 'oklch(77% 0.12 165)'],
  },
  sage: {
    accentL: 'oklch(54.1% 0.111 115)',
    accentD: 'oklch(71.9% 0.120 115)',
    morandi: '138, 154, 91',
    bgL: 'oklch(97% 0.011 112)',
    bgD: 'oklch(20% 0.019 113)',
    txL: 'oklch(25% 0.02 116)',
    txD: 'oklch(96% 0.011 118)',
    sfL: 'oklch(94.9% 0.009 113)',
    sfD: 'oklch(27.9% 0.02 116)',
    sf2L: 'oklch(91.9% 0.009 113)',
    sf2D: 'oklch(34% 0.03 116)',
    motionL: ['oklch(54.1% 0.111 115)', 'oklch(54.1% 0.12 83)', 'oklch(54.1% 0.10 152)'],
    motionD: ['oklch(71.9% 0.120 115)', 'oklch(71.9% 0.13 83)', 'oklch(71.9% 0.11 152)'],
  },
  stone: {
    accentL: 'oklch(49.9% 0.06 29)',
    accentD: 'oklch(75% 0.12 30)',
    morandi: '180, 160, 155',
    bgL: 'oklch(95.9% 0.01 25)',
    bgD: 'oklch(20.1% 0.019 30)',
    txL: 'oklch(25% 0.02 29)',
    txD: 'oklch(95.9% 0.01 25)',
    sfL: 'oklch(94.1% 0.01 33)',
    sfD: 'oklch(27.9% 0.02 28)',
    sf2L: 'oklch(91% 0.01 33)',
    sf2D: 'oklch(33.9% 0.03 28)',
    motionL: ['oklch(49.9% 0.06 29)', 'oklch(49.9% 0.075 0)', 'oklch(49.9% 0.07 60)'],
    motionD: ['oklch(75% 0.12 30)', 'oklch(75% 0.13 0)', 'oklch(75% 0.11 62)'],
  },
  lapis: {
    accentL: 'oklch(50% 0.13 258)',
    accentD: 'oklch(74% 0.10 255)',
    morandi: '47, 98, 172',
    bgL: 'oklch(97.4% 0.006 240)',
    bgD: 'oklch(23.1% 0.019 249)',
    txL: 'oklch(23% 0.02 249)',
    txD: 'oklch(96.1% 0.008 237)',
    sfL: 'oklch(95.6% 0.008 242)',
    sfD: 'oklch(30.1% 0.022 251)',
    sf2L: 'oklch(92.4% 0.013 244)',
    sf2D: 'oklch(35.9% 0.025 251)',
    motionL: ['oklch(50% 0.13 258)', 'oklch(50% 0.12 226)', 'oklch(50% 0.11 295)'],
    motionD: ['oklch(74% 0.10 255)', 'oklch(74% 0.11 225)', 'oklch(74% 0.10 292)'],
  },
  amber: {
    accentL: 'oklch(55.5% 0.12 70)',
    accentD: 'oklch(78% 0.11 70)',
    morandi: '159, 100, 1',
    bgL: 'oklch(97.5% 0.008 74)',
    bgD: 'oklch(26% 0.018 60)',
    txL: 'oklch(24% 0.02 74)',
    txD: 'oklch(95% 0.008 70)',
    sfL: 'oklch(95.6% 0.01 82)',
    sfD: 'oklch(32% 0.020 60)',
    sf2L: 'oklch(93% 0.014 78)',
    sf2D: 'oklch(38% 0.022 60)',
    motionL: ['oklch(55.5% 0.12 70)', 'oklch(55.5% 0.11 38)', 'oklch(55.5% 0.12 100)'],
    motionD: ['oklch(78% 0.11 70)', 'oklch(78% 0.12 38)', 'oklch(78% 0.11 100)'],
  },
  aurora: {
    accentL: 'oklch(55% 0.145 72)',
    accentD: 'oklch(80% 0.13 72)',
    morandi: '218, 158, 72',
    bgL: 'oklch(98% 0.004 72)',
    bgD: 'oklch(24.5% 0.008 70)',
    txL: 'oklch(24% 0.012 72)',
    txD: 'oklch(95% 0.005 72)',
    sfL: 'oklch(96.2% 0.005 72)',
    sfD: 'oklch(30.5% 0.01 70)',
    sf2L: 'oklch(93.4% 0.007 72)',
    sf2D: 'oklch(36.5% 0.012 70)',
    motionL: ['oklch(55% 0.145 72)', 'oklch(56% 0.15 50)', 'oklch(56% 0.13 32)'],
    motionD: ['oklch(80% 0.13 72)', 'oklch(80% 0.14 50)', 'oklch(80% 0.12 32)'],
  },
  lavender: {
    accentL: 'oklch(52% 0.11 295)',
    accentD: 'oklch(75% 0.11 295)',
    morandi: '164, 148, 190',
    bgL: 'oklch(97% 0.012 295)',
    bgD: 'oklch(26% 0.02 295)',
    txL: 'oklch(25% 0.02 295)',
    txD: 'oklch(96% 0.012 295)',
    sfL: 'oklch(95% 0.014 295)',
    sfD: 'oklch(32% 0.022 295)',
    sf2L: 'oklch(92.5% 0.016 295)',
    sf2D: 'oklch(38% 0.024 295)',
    motionL: ['oklch(52% 0.11 295)', 'oklch(52% 0.10 265)', 'oklch(53% 0.12 325)'],
    motionD: ['oklch(75% 0.11 295)', 'oklch(75% 0.11 265)', 'oklch(76% 0.12 325)'],
  },
}

export const VARIANT_LABELS = {
  ripple: { zh: '天青', en: 'Ripple', poem: '雨过天青云破处' },
  mist: { zh: '黛蓝', en: 'Mist', poem: '山色有无中' },
  cinnabar: { zh: '朱砂', en: 'Cinnabar', poem: '日出江花红胜火' },
  petal: { zh: '桃夭', en: 'Petal', poem: '灼灼其华' },
  sage: { zh: '竹青', en: 'Sage', poem: '绿竹猗猗' },
  stone: { zh: '赭石', en: 'Stone', poem: '秋山敛余照' },
  lapis: { zh: '青金', en: 'Lapis', poem: '碧海青天夜夜心' },
  amber: { zh: '琥珀', en: 'Amber', poem: '玉碗盛来琥珀光' },
  aurora: { zh: '落霞', en: 'Afterglow', poem: '落霞与孤鹜齐飞' },
  lavender: { zh: '青莲', en: 'Lavender', poem: '清水出芙蓉' },
}

export const mix = (color, pct) => `color-mix(in oklch, ${color}, transparent ${pct}%)`

/**
 * Parse an `oklch(L% C H)` string and compute its WCAG relative luminance in sRGB.
 * Used by tests to enforce WCAG AA contrast ratios across all 10 palettes.
 */
export function parseOklch(spec) {
  const m = /oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)\s*\)/i.exec(spec)
  if (!m) throw new Error(`Invalid oklch color: ${spec}`)
  return {
    L: Number(m[1]) / 100,
    C: Number(m[2]),
    H: (Number(m[3]) * Math.PI) / 180,
  }
}

function clamp01(v) {
  return Math.max(0, Math.min(1, v))
}

export function oklchToLinearRgb(spec) {
  const { L, C, H } = parseOklch(spec)
  const a = C * Math.cos(H)
  const b = C * Math.sin(H)

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b

  const l = l_ * l_ * l_
  const m = m_ * m_ * m_
  const s = s_ * s_ * s_

  const r = clamp01(+4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s)
  const g = clamp01(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s)
  const bl = clamp01(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s)
  return [r, g, bl]
}

export function oklchRelativeLuminance(spec) {
  const [r, g, b] = oklchToLinearRgb(spec)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function oklchContrastRatio(specA, specB) {
  const l1 = oklchRelativeLuminance(specA)
  const l2 = oklchRelativeLuminance(specB)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}
