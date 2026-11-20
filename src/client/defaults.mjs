import { VARIANTS, VARIANT_LABELS } from './palette.mjs'
import { DISPLAY_FONTS, BODY_FONTS, FONT_CDNS } from './fonts.mjs'

export const PLUGIN_ID = 'dsh-glaze-theme'
export const STORAGE_KEY = 'dsh-glaze-theme-config-v1'
export const CONFIG_ENDPOINT = '/__glaze/config'

export const DEFAULT_CONFIG = {
  version: 1,
  variant: 'ripple',
  surfaceMode: 'glaze', // 'glaze' (zero-blur low GPU) | 'frosted' (static pseudo-element blur)
  ambienceEnabled: true,
  customAccent: '', // '#rrggbb' or ''

  // Artistic & global fonts
  fontCdn: 'loli', // 'loli' | 'google'
  displayFont: 'default', // key in DISPLAY_FONTS
  customDisplayFont: '',
  bodyFont: 'default', // key in BODY_FONTS
  customBodyFont: '',
  headlineStyle: 'solid', // 'solid' | 'gradient' | 'glow'
  headlineSizePx: 28,

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

function cleanStr(value, maxLen = 160) {
  if (typeof value !== 'string') return ''
  return value.replace(/[\r\n\0]/g, ' ').trim().slice(0, maxLen)
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
  return {
    version: 1,
    variant: pickEnum(src.variant, VARIANTS, DEFAULT_CONFIG.variant),
    surfaceMode: pickEnum(src.surfaceMode, ['glaze', 'frosted'], DEFAULT_CONFIG.surfaceMode),
    ambienceEnabled: typeof src.ambienceEnabled === 'boolean' ? src.ambienceEnabled : DEFAULT_CONFIG.ambienceEnabled,
    customAccent: typeof src.customAccent === 'string' && HEX_COLOR_RE.test(src.customAccent.trim())
      ? src.customAccent.trim().toLowerCase()
      : '',

    fontCdn: pickEnum(src.fontCdn, Object.keys(FONT_CDNS), DEFAULT_CONFIG.fontCdn),
    displayFont: pickEnum(src.displayFont, Object.keys(DISPLAY_FONTS), DEFAULT_CONFIG.displayFont),
    customDisplayFont: cleanStr(src.customDisplayFont, 120),
    bodyFont: pickEnum(src.bodyFont, Object.keys(BODY_FONTS), DEFAULT_CONFIG.bodyFont),
    customBodyFont: cleanStr(src.customBodyFont, 120),
    headlineStyle: pickEnum(src.headlineStyle, ['solid', 'gradient', 'glow'], DEFAULT_CONFIG.headlineStyle),
    headlineSizePx: Number.isFinite(headlineSize)
      ? Math.max(20, Math.min(42, Math.round(headlineSize)))
      : DEFAULT_CONFIG.headlineSizePx,

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
