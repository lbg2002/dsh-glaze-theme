import {
  CONFIG_ENDPOINT,
  DEFAULT_CONFIG,
  PLUGIN_ID,
  STORAGE_KEY,
  cssStringLiteral,
  cssUrlLiteral,
  resolveHeroHeadlineText,
  sanitizeConfig,
} from './defaults.mjs'
import { resolveBodyFontFamily, resolveDisplayFontFamily, syncActiveFontLinks } from './fonts.mjs'
import { pickTextColorForHex } from './image-util.mjs'
import { buildCoreCSS, buildUiCSS } from './styles.mjs'
import { buildTokensCSS } from './tokens.mjs'
import { createUIController } from './ui.mjs'

function injectStyleOnce(suffix, cssText) {
  if (typeof document === 'undefined') return
  const key = `${PLUGIN_ID}/${suffix}`
  if (document.querySelector(`style[data-plugin-css="${key}"]`)) return
  const tag = document.createElement('style')
  tag.dataset.plugin = PLUGIN_ID
  tag.dataset.pluginCss = key
  tag.textContent = cssText
  document.head.appendChild(tag)
}

function readLocalConfig() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return sanitizeConfig(JSON.parse(raw))
  } catch {
    return null
  }
}

function writeLocalConfig(config) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  } catch {
    // Ignore storage quota errors
  }
}

async function fetchServerConfig() {
  if (typeof fetch !== 'function') return null
  try {
    const ctrl = typeof AbortController === 'function' ? new AbortController() : null
    const timer = ctrl ? setTimeout(() => ctrl.abort(), 3000) : null
    const res = await fetch(CONFIG_ENDPOINT, { cache: 'no-store', signal: ctrl?.signal })
    if (timer) clearTimeout(timer)
    if (!res.ok) return null
    const data = await res.json()
    if (data && data.ok && data.config && typeof data.config === 'object') {
      return sanitizeConfig(data.config)
    }
    return null
  } catch {
    return null
  }
}

let saveTimer = null
function persistServerConfig(config) {
  if (typeof fetch !== 'function') return
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    saveTimer = null
    fetch(CONFIG_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ config }),
    }).catch(() => {})
  }, 220)
}

let currentConfig = sanitizeConfig(DEFAULT_CONFIG)
let originalTitle = null

export function applyConfigToDOM(config) {
  if (typeof document === 'undefined' || !document.body) return
  const body = document.body

  if (originalTitle === null) {
    originalTitle = document.title || 'DeepSeek Harness'
  }

  body.dataset.glazeVariant = config.variant
  body.dataset.glazeSurface = config.surfaceMode
  body.dataset.glazePattern = config.canvasPattern
  body.dataset.glazeSidebarTone = config.sidebarTone
  body.dataset.glazeThinking = config.thinkingStyle
  body.dataset.glazeComposer = config.composerStyle
  body.dataset.glazeSendBtn = config.sendButtonStyle
  body.dataset.glazeBubble = config.bubbleStyle
  body.dataset.glazeHeadlineStyle = config.headlineStyle
  body.dataset.glazeBrandStyle = config.brandStyle

  if (config.thinkingKaiti) body.dataset.glazeThinkingKaiti = '1'
  else delete body.dataset.glazeThinkingKaiti

  if (config.customAccent) {
    body.dataset.glazeCustomAccent = '1'
    body.style.setProperty('--glaze-user-accent', config.customAccent)
    const fg = pickTextColorForHex(config.customAccent)
    if (fg) body.style.setProperty('--glaze-user-accent-fg', fg)
  } else {
    delete body.dataset.glazeCustomAccent
    body.style.removeProperty('--glaze-user-accent')
    body.style.removeProperty('--glaze-user-accent-fg')
  }

  if (config.sidebarTone === 'custom' && config.customSidebarBg) {
    body.style.setProperty('--glaze-user-sidebar-bg', config.customSidebarBg)
    const sbFg = pickTextColorForHex(config.customSidebarBg)
    body.dataset.glazeSidebarDark = sbFg === '#ffffff' ? '1' : '0'
  } else {
    body.style.removeProperty('--glaze-user-sidebar-bg')
    delete body.dataset.glazeSidebarDark
  }

  if (config.customChatBg) {
    body.dataset.glazeCustomChatBg = '1'
    body.style.setProperty('--glaze-user-chat-bg', config.customChatBg)
  } else {
    delete body.dataset.glazeCustomChatBg
    body.style.removeProperty('--glaze-user-chat-bg')
  }

  // Fonts & Sizes
  syncActiveFontLinks(config)
  body.style.setProperty('--glaze-display-font', resolveDisplayFontFamily(config))
  body.style.setProperty('--glaze-headline-size', `${config.headlineSizePx}px`)
  body.style.setProperty('--glaze-brand-size', `${config.brandFontSizePx}px`)
  const bodyFont = resolveBodyFontFamily(config)
  if (bodyFont) {
    body.dataset.glazeBodyFont = '1'
    body.style.setProperty('--glaze-body-font', bodyFont)
  } else {
    delete body.dataset.glazeBodyFont
    body.style.removeProperty('--glaze-body-font')
  }

  // Area 1: Top-left Brand
  if (config.brandName) {
    body.dataset.glazeCustomBrand = '1'
    body.style.setProperty('--glaze-brand-name', cssStringLiteral(config.brandName))
  } else {
    delete body.dataset.glazeCustomBrand
    body.style.removeProperty('--glaze-brand-name')
  }

  if (config.brandBadgeMode === 'custom' && config.brandBadgeText) {
    body.dataset.glazeBrandBadge = 'custom'
    body.style.setProperty('--glaze-brand-badge', cssStringLiteral(config.brandBadgeText))
  } else if (config.brandBadgeMode === 'hidden') {
    body.dataset.glazeBrandBadge = 'hidden'
    body.style.removeProperty('--glaze-brand-badge')
  } else {
    delete body.dataset.glazeBrandBadge
    body.style.removeProperty('--glaze-brand-badge')
  }

  if (config.brandIconMode !== 'default') {
    body.dataset.glazeBrandIcon = config.brandIconMode
    if (config.brandIconMode === 'emoji') {
      body.style.setProperty('--glaze-brand-icon-emoji', cssStringLiteral(config.brandIconEmoji))
    } else if (config.brandIconMode === 'image' && config.brandIconImage) {
      body.style.setProperty('--glaze-brand-icon-img', cssUrlLiteral(config.brandIconImage))
    } else if (config.brandIconMode === 'image') {
      delete body.dataset.glazeBrandIcon
    }
  } else {
    delete body.dataset.glazeBrandIcon
    body.style.removeProperty('--glaze-brand-icon-emoji')
    body.style.removeProperty('--glaze-brand-icon-img')
  }

  if (config.appTitle) {
    document.title = config.appTitle
  } else if (originalTitle) {
    document.title = originalTitle
  }

  // Area 2: Center Hero
  const resolvedHeadline = resolveHeroHeadlineText(config)
  if (resolvedHeadline) {
    body.dataset.glazeCustomHeadline = '1'
    body.style.setProperty('--glaze-hero-headline', cssStringLiteral(resolvedHeadline))
  } else {
    delete body.dataset.glazeCustomHeadline
    body.style.removeProperty('--glaze-hero-headline')
  }

  if (config.heroBadgeMode === 'custom' && config.heroBadgeText) {
    body.dataset.glazeHeroBadge = 'custom'
    body.style.setProperty('--glaze-hero-badge', cssStringLiteral(config.heroBadgeText))
  } else if (config.heroBadgeMode === 'hidden') {
    body.dataset.glazeHeroBadge = 'hidden'
    body.style.removeProperty('--glaze-hero-badge')
  } else {
    delete body.dataset.glazeHeroBadge
    body.style.removeProperty('--glaze-hero-badge')
  }

  let effectiveHeroIconMode = config.heroIconMode
  let effectiveHeroEmoji = config.heroIconEmoji
  let effectiveHeroImg = config.heroIconImage
  if (config.heroIconMode === 'followBrand') {
    effectiveHeroIconMode = config.brandIconMode
    effectiveHeroEmoji = config.brandIconEmoji
    effectiveHeroImg = config.brandIconImage
  }
  if (effectiveHeroIconMode !== 'default') {
    body.dataset.glazeHeroIcon = effectiveHeroIconMode
    if (effectiveHeroIconMode === 'emoji') {
      body.style.setProperty('--glaze-hero-icon-emoji', cssStringLiteral(effectiveHeroEmoji))
    } else if (effectiveHeroIconMode === 'image' && effectiveHeroImg) {
      body.style.setProperty('--glaze-hero-icon-img', cssUrlLiteral(effectiveHeroImg))
    } else if (effectiveHeroIconMode === 'image') {
      delete body.dataset.glazeHeroIcon
    }
  } else {
    delete body.dataset.glazeHeroIcon
    body.style.removeProperty('--glaze-hero-icon-emoji')
    body.style.removeProperty('--glaze-hero-icon-img')
  }

  if (config.hideHeroCanvas) body.dataset.glazeHideCanvas = '1'
  else delete body.dataset.glazeHideCanvas

  if (config.composerPlaceholder) {
    body.dataset.glazeCustomPlaceholder = '1'
    body.style.setProperty('--glaze-composer-placeholder', cssStringLiteral(config.composerPlaceholder))
  } else {
    delete body.dataset.glazeCustomPlaceholder
    body.style.removeProperty('--glaze-composer-placeholder')
  }

  // Area 4: Bottom-left Account
  if (config.userName) {
    body.dataset.glazeCustomUser = '1'
    body.style.setProperty('--glaze-user-name', cssStringLiteral(config.userName))
  } else {
    delete body.dataset.glazeCustomUser
    body.style.removeProperty('--glaze-user-name')
  }

  if (config.userAvatarMode !== 'default') {
    body.dataset.glazeUserAvatar = config.userAvatarMode
    if (config.userAvatarMode === 'emoji') {
      body.style.setProperty('--glaze-user-avatar-emoji', cssStringLiteral(config.userAvatarEmoji))
    } else if (config.userAvatarMode === 'image' && config.userAvatarImage) {
      body.style.setProperty('--glaze-user-avatar-img', cssUrlLiteral(config.userAvatarImage))
    } else if (config.userAvatarMode === 'image') {
      delete body.dataset.glazeUserAvatar
    }
  } else {
    delete body.dataset.glazeUserAvatar
    body.style.removeProperty('--glaze-user-avatar-emoji')
    body.style.removeProperty('--glaze-user-avatar-img')
  }
}

let uiCtrl = null

function ensureUI() {
  if (!uiCtrl) {
    uiCtrl = createUIController({
      getConfig: () => currentConfig,
      updateConfig: (patch) => {
        currentConfig = sanitizeConfig({ ...currentConfig, ...patch })
        writeLocalConfig(currentConfig)
        applyConfigToDOM(currentConfig)
        persistServerConfig(currentConfig)
      },
      resetConfig: () => {
        currentConfig = sanitizeConfig(DEFAULT_CONFIG)
        writeLocalConfig(currentConfig)
        applyConfigToDOM(currentConfig)
        persistServerConfig(currentConfig)
      },
    })
  }
  return uiCtrl
}

function installLightweightHeaderWatcher() {
  if (typeof MutationObserver === 'undefined' || !document.body) return
  if (window.__dshGlazeHeaderObserver__) return
  let rafPending = false
  const obs = new MutationObserver(() => {
    const ui = ensureUI()
    if (!ui.needsHostSync()) return
    if (rafPending) return
    rafPending = true
    requestAnimationFrame(() => {
      rafPending = false
      ui.ensureSwitcherMounted()
    })
  })
  obs.observe(document.body, { childList: true, subtree: true })
  window.__dshGlazeHeaderObserver__ = obs
}

function bootGlazeTheme() {
  if (typeof document === 'undefined') return
  injectStyleOnce('tokens.css', buildTokensCSS())
  injectStyleOnce('core.css', buildCoreCSS())
  injectStyleOnce('ui.css', buildUiCSS())

  const local = readLocalConfig()
  if (local) currentConfig = local

  const mount = () => {
    applyConfigToDOM(currentConfig)
    const ui = ensureUI()
    ui.ensureSwitcherMounted()
    installLightweightHeaderWatcher()

    fetchServerConfig().then((remote) => {
      if (!remote) return
      currentConfig = remote
      writeLocalConfig(remote)
      applyConfigToDOM(remote)
      ui.syncSwitcherVisuals()
    })
  }

  if (document.body) mount()
  else document.addEventListener('DOMContentLoaded', mount, { once: true })
}

bootGlazeTheme()

if (typeof window !== 'undefined' && window.__ModuleLoader__ && typeof window.__ModuleLoader__.load === 'function') {
  window.__ModuleLoader__.load({
    id: PLUGIN_ID,
    factory: () => {
      const exports = {}
      Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })
      exports.apply = function apply() {
        bootGlazeTheme()
      }
      return exports
    },
  })
}
