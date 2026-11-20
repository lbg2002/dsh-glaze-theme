/**
 * Delegate Light / Dark / System switching to DSH's native Settings buttons so
 * state persists on the host without inventing a second source of truth.
 */

const LABEL_TO_MODE = [
  [/^浅色|^light/i, 'light'],
  [/^深色|^暗色|^dark/i, 'dark'],
  [/跟随系统|system|auto/i, 'system'],
]

function modeOf(el) {
  const text = (el.innerText || el.textContent || '').trim()
  for (const [re, mode] of LABEL_TO_MODE) {
    if (re.test(text)) return mode
  }
  return null
}

export function findHostButtons() {
  const out = new Map()
  for (const el of document.querySelectorAll('[class*="_themeCube"]')) {
    const mode = modeOf(el)
    if (mode && !out.has(mode)) out.set(mode, el)
  }
  return out
}

function findSettingsTrigger() {
  const scope = document.querySelector('[class*="_settingsArea"]') || document
  for (const el of scope.querySelectorAll('button[class*="_trigger"]')) {
    if (el.closest('.dsh-glaze-switcher') || el.closest('.dsh-glaze-modal')) continue
    if (/^设置$|^settings$/i.test((el.innerText || el.textContent || '').trim())) return el
  }
  // AccountMenu wraps settings inside a menu item if signed-in launcher is used; fallback to shortcut or settings button
  return null
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export function currentIsDark() {
  return typeof document !== 'undefined' && document.body.hasAttribute('data-ds-dark-theme')
}

export async function setAppearanceMode(mode) {
  const already = findHostButtons().get(mode)
  if (already) {
    already.click()
    return true
  }
  const trigger = findSettingsTrigger()
  if (trigger) {
    trigger.click()
    let target
    for (let i = 0; i < 10; i++) {
      await sleep(50)
      target = findHostButtons().get(mode)
      if (target) break
    }
    if (target) target.click()
    await sleep(260)
    trigger.click()
    return !!target
  }
  // Fallback when settings button isn't directly exposed (e.g., inside AccountMenu dropdown)
  if (mode === 'dark') {
    document.body.setAttribute('data-ds-dark-theme', '')
  } else if (mode === 'light') {
    document.body.removeAttribute('data-ds-dark-theme')
  } else {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    if (prefersDark) document.body.setAttribute('data-ds-dark-theme', '')
    else document.body.removeAttribute('data-ds-dark-theme')
  }
  return true
}
