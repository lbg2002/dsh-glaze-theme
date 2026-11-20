import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import http from 'node:http'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { buildAll } from '../scripts/build.mjs'
import { apply, createConfigHandler } from '../src/index.mjs'
import { MASTER_PRESETS, PALETTE, VARIANTS, oklchContrastRatio, parseOklch } from '../src/client/palette.mjs'
import { buildTokensCSS } from '../src/client/tokens.mjs'
import { buildCoreCSS, buildUiCSS } from '../src/client/styles.mjs'
import { DEFAULT_CONFIG, getTimeGreeting, resolveHeroHeadlineText, sanitizeConfig } from '../src/client/defaults.mjs'
import { DISPLAY_FONTS, resolveFontUrl } from '../src/client/fonts.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

test('all 16 palettes satisfy WCAG AA (>= 4.5:1) and define 3-hue polychromatic motion triads', () => {
  assert.equal(VARIANTS.length, 16)
  for (const key of VARIANTS) {
    const p = PALETTE[key]
    assert.ok(p, `Missing palette ${key}`)
    assert.ok(p.sbL && p.sbD && p.sbDeep, `Missing sidebar tokens in ${key}`)
    assert.equal(p.motionL?.length, 3, `${key} motionL must have 3 pigments`)
    assert.equal(p.motionD?.length, 3, `${key} motionD must have 3 pigments`)
    assert.equal(new Set(p.motionL).size, 3, `${key} motionL pigments must be distinct`)
    assert.equal(new Set(p.motionD).size, 3, `${key} motionD pigments must be distinct`)
    for (const c of [...p.motionL, ...p.motionD]) {
      assert.doesNotThrow(() => parseOklch(c), `Invalid oklch in ${key}: ${c}`)
    }
    const txLight = oklchContrastRatio(p.txL, p.bgL)
    const txDark = oklchContrastRatio(p.txD, p.bgD)
    const accentLight = oklchContrastRatio(p.accentL, p.bgL)
    const accentDark = oklchContrastRatio(p.accentD, p.bgD)

    assert.ok(txLight >= 4.5, `${key} light text contrast ${txLight.toFixed(2)} < 4.5`)
    assert.ok(txDark >= 4.5, `${key} dark text contrast ${txDark.toFixed(2)} < 4.5`)
    assert.ok(accentLight >= 4.5, `${key} light accent contrast ${accentLight.toFixed(2)} < 4.5`)
    assert.ok(accentDark >= 4.5, `${key} dark accent contrast ${accentDark.toFixed(2)} < 4.5`)
  }
})

test('all 6 Chinese Aesthetic Master Presets sanitize cleanly and match registered options', () => {
  assert.equal(MASTER_PRESETS.length, 6)
  for (const preset of MASTER_PRESETS) {
    const sanitized = sanitizeConfig(preset.patch)
    assert.equal(sanitized.activeMasterPreset, preset.id)
    assert.equal(sanitized.variant, preset.patch.variant)
    assert.equal(sanitized.sidebarTone, preset.patch.sidebarTone)
    assert.equal(sanitized.canvasPattern, preset.patch.canvasPattern)
    assert.equal(sanitized.thinkingStyle, preset.patch.thinkingStyle)
    assert.equal(sanitized.composerStyle, preset.patch.composerStyle)
    assert.equal(sanitized.sendButtonStyle, preset.patch.sendButtonStyle)
    assert.equal(sanitized.bubbleStyle, preset.patch.bubbleStyle)
    assert.equal(sanitized.displayFont, preset.patch.displayFont)
  }
})

test('CSS & bundle contain zero infinite animations, true panoramic seamless rules, and zero polling', () => {
  buildAll()
  const tokensCss = buildTokensCSS()
  const coreCss = buildCoreCSS()
  const uiCss = buildUiCSS()
  const combinedCss = `${tokensCss}\n${coreCss}\n${uiCss}`

  assert.equal(/\binfinite\b/i.test(combinedCss), false, 'CSS must not use infinite animations')
  assert.equal(/@keyframes\b/i.test(combinedCss), false, 'CSS must not define idle keyframe loops')
  assert.equal(/@property\b/i.test(combinedCss), false, 'CSS must not animate @property custom props')

  // Seamless panoramic sidebar must clear inner SidebarRoot, borders, and hairline shadows
  assert.ok(coreCss.includes('[class*="_sidebarCol"] [class*="_root"]'), 'Core CSS must clear SidebarRoot background')
  const seamlessMatch = coreCss.match(
    /body\[data-glaze-variant\]\[data-glaze-sidebar-tone="seamless"\]\s+\[class\*="_frame"\]:not\(\[data-sidebar-drawer\]\)\s+\[class\*="_sidebarCol"\]\s*\{([^}]+)\}/
  )
  assert.ok(seamlessMatch, 'Seamless desktop sidebar rule must exist')
  assert.ok(seamlessMatch[1].includes('--dsw-specific-sidebar-fill: transparent'), 'Seamless mode must set sidebar-fill token transparent')
  assert.ok(seamlessMatch[1].includes('background: transparent !important'), 'Seamless mode must enforce transparent background')
  assert.ok(seamlessMatch[1].includes('border-right: 0 !important'), 'Seamless mode must remove right border')
  assert.ok(seamlessMatch[1].includes('box-shadow: none !important'), 'Seamless mode must remove hairline box-shadow')

  // Default porcelain mode must not enable backdrop-filter except inside opt-in frosted selector
  const nonFrostedLines = coreCss
    .split('\n')
    .filter((line) => /backdrop-filter/i.test(line))
  assert.ok(nonFrostedLines.length > 0, 'Frosted opt-in styles should exist')
  assert.ok(coreCss.includes('[data-glaze-surface="frosted"]'), 'backdrop-filter must be gated on frosted opt-in')
  assert.ok(coreCss.includes('--glaze-composer-trans'), 'Core CSS must support configurable composer opacity')

  const clientBundle = readFileSync(path.join(root, 'lib', 'client.js'), 'utf8')
  assert.equal(/\bsetInterval\b/.test(clientBundle), false, 'Client bundle must not poll with setInterval')
  assert.ok(clientBundle.includes('__ModuleLoader__.load'), 'Client bundle must register with __ModuleLoader__')
  assert.ok(clientBundle.includes('id: PLUGIN_ID') || clientBundle.includes('id: "dsh-glaze-theme"'), 'Bundle must declare plugin id')
  assert.ok(clientBundle.includes('exports.apply'), 'Bundle must export apply()')
  assert.ok(clientBundle.includes('[data-conversation-header-corner]'), 'Bundle must support header corner mounting to avoid overlap')
  assert.ok(clientBundle.includes('--glaze-composer-trans'), 'Client bundle must include composer opacity CSS token')
})

test('sanitizeConfig & greeting resolvers handle deep UI fields, clamping & presets safely', () => {
  const dirty = sanitizeConfig({
    variant: 'non-existent',
    surfaceMode: 'invalid',
    sidebarTone: 'bogus',
    canvasPattern: 'bogus',
    thinkingStyle: 'bogus',
    composerStyle: 'bogus',
    composerOpacityPct: 180,
    sendButtonStyle: 'bogus',
    bubbleStyle: 'bogus',
    customAccent: 'not-a-color',
    customSidebarBg: 'red',
    customChatBg: '#1A2B3C',
    headlineSizePx: 999,
    brandFontSizePx: 4,
    brandName: '  My\nStudio  ',
    brandIconImage: 'javascript:alert(1)',
    thinkingKaiti: true,
  })

  assert.equal(dirty.variant, DEFAULT_CONFIG.variant)
  assert.equal(dirty.surfaceMode, 'glaze')
  assert.equal(dirty.sidebarTone, 'layered')
  assert.equal(dirty.canvasPattern, 'ambience')
  assert.equal(dirty.thinkingStyle, 'scroll-note')
  assert.equal(dirty.composerStyle, 'porcelain')
  assert.equal(dirty.composerOpacityPct, 100)
  assert.equal(sanitizeConfig({ composerOpacityPct: -20 }).composerOpacityPct, 0)
  assert.equal(sanitizeConfig({}).composerOpacityPct, 92)
  assert.equal(dirty.sendButtonStyle, 'round')
  assert.equal(dirty.bubbleStyle, 'glaze')
  assert.equal(dirty.customAccent, '')
  assert.equal(dirty.customSidebarBg, '')
  assert.equal(dirty.customChatBg, '#1a2b3c')
  assert.equal(dirty.headlineSizePx, 42)
  assert.equal(dirty.brandFontSizePx, 12)
  assert.equal(dirty.brandName, 'My Studio')
  assert.equal(dirty.brandIconImage, '')
  assert.equal(dirty.thinkingKaiti, true)

  const poemCfg = sanitizeConfig({ variant: 'lapis', heroHeadlineMode: 'poem' })
  assert.equal(resolveHeroHeadlineText(poemCfg), '碧海青天夜夜心')

  const timeCfg = sanitizeConfig({ heroHeadlineMode: 'time' })
  assert.equal(resolveHeroHeadlineText(timeCfg, new Date('2026-11-20T08:30:00')), getTimeGreeting(new Date('2026-11-20T08:30:00')))

  assert.equal(resolveFontUrl(DISPLAY_FONTS.default, 'loli'), null)
  assert.match(resolveFontUrl(DISPLAY_FONTS['ma-shan-zheng'], 'loli'), /^https:\/\/fonts\.loli\.net/)
  assert.match(resolveFontUrl(DISPLAY_FONTS['ma-shan-zheng'], 'google'), /^https:\/\/fonts\.googleapis\.com/)
})

test('Node apply() never throws without webServer & /__glaze/config handles GET/POST/origin check', async () => {
  assert.doesNotThrow(() => apply(undefined))
  assert.doesNotThrow(() => apply({}))

  const tmpDir = mkdtempSync(path.join(os.tmpdir(), 'glaze-test-'))
  const configPath = path.join(tmpDir, 'glaze-theme.json')
  const handler = createConfigHandler(() => configPath)
  const server = http.createServer((req, res) => {
    void handler(req, res)
  })

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const port = server.address().port
  const baseUrl = `http://127.0.0.1:${port}`

  try {
    let r = await fetch(`${baseUrl}/__glaze/config`)
    assert.equal(r.status, 200)
    let json = await r.json()
    assert.deepEqual(json, { ok: true, config: null })

    r = await fetch(`${baseUrl}/__glaze/config`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'http://evil.example',
      },
      body: JSON.stringify({ config: { variant: 'lanting' } }),
    })
    assert.equal(r.status, 403)

    r = await fetch(`${baseUrl}/__glaze/config`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: baseUrl,
      },
      body: JSON.stringify({ config: { variant: 'lanting', brandName: '砚台', brandFontSizePx: 20 } }),
    })
    assert.equal(r.status, 200)
    assert.deepEqual(await r.json(), { ok: true })

    r = await fetch(`${baseUrl}/__glaze/config`)
    assert.equal(r.status, 200)
    json = await r.json()
    assert.deepEqual(json, { ok: true, config: { variant: 'lanting', brandName: '砚台', brandFontSizePx: 20 } })
  } finally {
    await new Promise((resolve) => server.close(resolve))
    rmSync(tmpDir, { recursive: true, force: true })
  }
})
