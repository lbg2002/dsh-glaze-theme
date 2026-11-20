import { MASTER_PRESETS, VARIANTS, VARIANT_LABELS } from './palette.mjs'
import { BODY_FONTS, DISPLAY_FONTS, FONT_CDNS } from './fonts.mjs'

export const PLUGIN_ID = 'dsh-glaze-theme'
export const STORAGE_KEY = 'dsh-glaze-theme-config-v1'
export const CONFIG_ENDPOINT = '/__glaze/config'

export const SIDEBAR_TONES = ['layered', 'deep', 'seamless', 'custom']
export const CANVAS_PATTERNS = ['ambience', 'xuan-paper', 'landscape', 'lattice', 'cloud', 'none']
export const THINKING_STYLES = ['scroll-note', 'bamboo-slip', 'zen-line', 'native']
export const COMPOSER_STYLES = ['porcelain', 'xuan-scroll', 'imperial-seal', 'floating-jade']
export const SEND_BUTTON_STYLES = ['round', 'seal', 'jade-pill']
export const BUBBLE_STYLES = ['glaze', 'letter-paper', 'ink-outline']

export const DEFAULT_CONFIG = {
  version: 2,
  variant: 'ripple',
  activeMasterPreset: '',
  surfaceMode: 'glaze', // 'glaze' | 'frosted'
  ambienceEnabled: true,
  customAccent: '',

  // Deep UI Architecture & Chinese Aesthetics
  sidebarTone: 'layered', // 'layered' | 'deep' | 'seamless' | 'custom'
  customSidebarBg: '',
  customChatBg: '',
  canvasPattern: 'ambience', // 'ambience' | 'xuan-paper' | 'landscape' | 'lattice' | 'cloud' | 'none'
  thinkingStyle: 'scroll-note', // 'scroll-note' | 'bamboo-slip' | 'zen-line' | 'native'
  thinkingKaiti: false,
  composerStyle: 'porcelain', // 'porcelain' | 'xuan-scroll' | 'imperial-seal' | 'floating-jade'
  composerOpacityPct: 92,
  sendButtonStyle: 'round', // 'round' | 'seal' | 'jade-pill'
  bubbleStyle: 'glaze', // 'glaze' | 'letter-paper' | 'ink-outline'

  // Artistic & Global Fonts
  fontCdn: 'loli',
  displayFont: 'default',
  customDisplayFont: '',
  bodyFont: 'default',
  customBodyFont: '',
  headlineStyle: 'solid', // 'solid' | 'gradient' | 'glow'
  headlineSizePx: 28,
  brandStyle: 'solid', // 'solid' | 'gradient' | 'glow'
  brandFontSizePx: 17,

  // Area 1: Top-left sidebar brand + browser title
  brandName: '',
  brandBadgeMode: 'default', // 'default' | 'custom' | 'hidden'
  brandBadgeText: 'STUDIO',
  brandIconMode: 'default', // 'default' | 'emoji' | 'image' | 'hidden'
  brandIconEmoji: '🐋',
  brandIconImage: '',
  appTitle: '',

  // Area 2: Center Hero welcome + composer placeholder
  heroHeadlineMode: 'default', // 'default' | 'custom' | 'poem' | 'time'
  heroHeadline: '',
  heroBadgeMode: 'default', // 'default' | 'custom' | 'hidden'
  heroBadgeText: '',
  heroIconMode: 'default', // 'default' | 'followBrand' | 'emoji' | 'image' | 'hidden'
  heroIconEmoji: '✨',
  heroIconImage: '',
  hideHeroCanvas: false,
  composerPlaceholder: '',

  // Area 4: Bottom-left account launcher
  userName: '',
  userAvatarMode: 'default', // 'default' | 'emoji' | 'image'
  userAvatarEmoji: '🎨',
  userAvatarImage: '',
}

const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/
const SAFE_IMAGE_RE = /^(data:image\/(png|jpeg|webp|gif|svg\+xml);base64,|https?:\/\/)/i
const MASTER_IDS = MASTER_PRESETS.map((p) => p.id)

function cleanStr(value, maxLen = 160) {
  if (typeof value !== 'string') return ''
  return value.replace(/[\r\n\0]/g, ' ').trim().slice(0, maxLen)
}

function cleanHex(value) {
  if (typeof value !== 'string') return ''
  const trimmed = value.trim()
  return HEX_COLOR_RE.test(trimmed) ? trimmed.toLowerCase() : ''
}

function cleanImage(value) {
  if (typeof value !== 'string') return ''
  const trimmed = value.trim()
  if (!trimmed || trimmed.length > 350000) return ''
  return SAFE_IMAGE_RE.test(trimmed) ? trimmed : ''
}

function pickEnum(value, allowed, fallback) {
  return allowed.includes(value) ? value : fallback
}

export function sanitizeConfig(raw) {
  const src = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {}
  const headlineSize = Number(src.headlineSizePx)
  const brandSize = Number(src.brandFontSizePx)
  const composerOpacity = Number(src.composerOpacityPct)
  const ambienceEnabled = typeof src.ambienceEnabled === 'boolean'
    ? src.ambienceEnabled
    : DEFAULT_CONFIG.ambienceEnabled

  let canvasPattern = pickEnum(src.canvasPattern, CANVAS_PATTERNS, '')
  if (!canvasPattern) {
    canvasPattern = ambienceEnabled ? DEFAULT_CONFIG.canvasPattern : 'none'
  }

  return {
    version: 2,
    variant: pickEnum(src.variant, VARIANTS, DEFAULT_CONFIG.variant),
    activeMasterPreset: MASTER_IDS.includes(src.activeMasterPreset) ? src.activeMasterPreset : '',
    surfaceMode: pickEnum(src.surfaceMode, ['glaze', 'frosted'], DEFAULT_CONFIG.surfaceMode),
    ambienceEnabled: canvasPattern !== 'none',
    customAccent: cleanHex(src.customAccent),

    sidebarTone: pickEnum(src.sidebarTone, SIDEBAR_TONES, DEFAULT_CONFIG.sidebarTone),
    customSidebarBg: cleanHex(src.customSidebarBg),
    customChatBg: cleanHex(src.customChatBg),
    canvasPattern,
    thinkingStyle: pickEnum(src.thinkingStyle, THINKING_STYLES, DEFAULT_CONFIG.thinkingStyle),
    thinkingKaiti: typeof src.thinkingKaiti === 'boolean' ? src.thinkingKaiti : DEFAULT_CONFIG.thinkingKaiti,
    composerStyle: pickEnum(src.composerStyle, COMPOSER_STYLES, DEFAULT_CONFIG.composerStyle),
    composerOpacityPct: Number.isFinite(composerOpacity)
      ? Math.max(0, Math.min(100, Math.round(composerOpacity)))
      : DEFAULT_CONFIG.composerOpacityPct,
    sendButtonStyle: pickEnum(src.sendButtonStyle, SEND_BUTTON_STYLES, DEFAULT_CONFIG.sendButtonStyle),
    bubbleStyle: pickEnum(src.bubbleStyle, BUBBLE_STYLES, DEFAULT_CONFIG.bubbleStyle),

    fontCdn: pickEnum(src.fontCdn, Object.keys(FONT_CDNS), DEFAULT_CONFIG.fontCdn),
    displayFont: pickEnum(src.displayFont, Object.keys(DISPLAY_FONTS), DEFAULT_CONFIG.displayFont),
    customDisplayFont: cleanStr(src.customDisplayFont, 120),
    bodyFont: pickEnum(src.bodyFont, Object.keys(BODY_FONTS), DEFAULT_CONFIG.bodyFont),
    customBodyFont: cleanStr(src.customBodyFont, 120),
    headlineStyle: pickEnum(src.headlineStyle, ['solid', 'gradient', 'glow'], DEFAULT_CONFIG.headlineStyle),
    headlineSizePx: Number.isFinite(headlineSize)
      ? Math.max(20, Math.min(42, Math.round(headlineSize)))
      : DEFAULT_CONFIG.headlineSizePx,
    brandStyle: pickEnum(src.brandStyle, ['solid', 'gradient', 'glow'], DEFAULT_CONFIG.brandStyle),
    brandFontSizePx: Number.isFinite(brandSize)
      ? Math.max(12, Math.min(28, Math.round(brandSize)))
      : DEFAULT_CONFIG.brandFontSizePx,

    brandName: cleanStr(src.brandName, 40),
    brandBadgeMode: pickEnum(src.brandBadgeMode, ['default', 'custom', 'hidden'], DEFAULT_CONFIG.brandBadgeMode),
    brandBadgeText: cleanStr(src.brandBadgeText, 18) || DEFAULT_CONFIG.brandBadgeText,
    brandIconMode: pickEnum(src.brandIconMode, ['default', 'emoji', 'image', 'hidden'], DEFAULT_CONFIG.brandIconMode),
    brandIconEmoji: cleanStr(src.brandIconEmoji, 8) || DEFAULT_CONFIG.brandIconEmoji,
    brandIconImage: cleanImage(src.brandIconImage),
    appTitle: cleanStr(src.appTitle, 60),

    heroHeadlineMode: pickEnum(src.heroHeadlineMode, ['default', 'custom', 'poem', 'time'], DEFAULT_CONFIG.heroHeadlineMode),
    heroHeadline: cleanStr(src.heroHeadline, 60),
    heroBadgeMode: pickEnum(src.heroBadgeMode, ['default', 'custom', 'hidden'], DEFAULT_CONFIG.heroBadgeMode),
    heroBadgeText: cleanStr(src.heroBadgeText, 18),
    heroIconMode: pickEnum(src.heroIconMode, ['default', 'followBrand', 'emoji', 'image', 'hidden'], DEFAULT_CONFIG.heroIconMode),
    heroIconEmoji: cleanStr(src.heroIconEmoji, 8) || DEFAULT_CONFIG.heroIconEmoji,
    heroIconImage: cleanImage(src.heroIconImage),
    hideHeroCanvas: typeof src.hideHeroCanvas === 'boolean' ? src.hideHeroCanvas : DEFAULT_CONFIG.hideHeroCanvas,
    composerPlaceholder: cleanStr(src.composerPlaceholder, 80),

    userName: cleanStr(src.userName, 36),
    userAvatarMode: pickEnum(src.userAvatarMode, ['default', 'emoji', 'image'], DEFAULT_CONFIG.userAvatarMode),
    userAvatarEmoji: cleanStr(src.userAvatarEmoji, 8) || DEFAULT_CONFIG.userAvatarEmoji,
    userAvatarImage: cleanImage(src.userAvatarImage),
  }
}

export function getTimeGreeting(date = new Date()) {
  const hour = date.getHours()
  if (hour >= 5 && hour < 11) return '早安，开启今日创作'
  if (hour >= 11 && hour < 14) return '午安，灵感正当时'
  if (hour >= 14 && hour < 18) return '午后好，从容构建'
  if (hour >= 18 && hour < 23) return '晚上好，静享心流'
  return '夜深了，星河伴码'
}

export function resolveHeroHeadlineText(config, date = new Date()) {
  switch (config.heroHeadlineMode) {
    case 'custom':
      return config.heroHeadline || ''
    case 'poem':
      return VARIANT_LABELS[config.variant]?.poem || VARIANT_LABELS.ripple.poem
    case 'time':
      return getTimeGreeting(date)
    default:
      return ''
  }
}

export function cssStringLiteral(value) {
  return JSON.stringify(String(value ?? ''))
}

export function cssUrlLiteral(url) {
  if (!url) return 'none'
  const safe = url.replace(/["\\\n\r]/g, '')
  return `url("${safe}")`
}
