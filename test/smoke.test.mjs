import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import http from 'node:http'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { buildAll } from '../scripts/build.mjs'
import { apply, createConfigHandler } from '../src/index.mjs'
import { PALETTE, VARIANTS, oklchContrastRatio } from '../src/client/palette.mjs'
import { buildTokensCSS } from '../src/client/tokens.mjs'
import { buildCoreCSS, buildUiCSS } from '../src/client/styles.mjs'
import { DEFAULT_CONFIG, getTimeGreeting, resolveHeroHeadlineText, sanitizeConfig } from '../src/client/defaults.mjs'
import { DISPLAY_FONTS, resolveFontUrl } from '../src/client/fonts.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

test('all 10 palettes satisfy WCAG AA (>= 4.5:1) for text & accent on light/dark backgrounds', () => {
  assert.equal(VARIANTS.length, 10)
  for (const key of VARIANTS) {
    const p = PALETTE[key]
    assert.ok(p, `Missing palette ${key}`)
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

test('CSS & bundle contain zero infinite animations, zero @property, zero setInterval polling', () => {
  buildAll()
  const tokensCss = buildTokensCSS()
  const coreCss = buildCoreCSS()
  const uiCss = buildUiCSS()
  const combinedCss = `${tokensCss}\n${coreCss}\n${uiCss}`

  assert.equal(/\binfinite\b/i.test(combinedCss), false, 'CSS must not use infinite animations')
  assert.equal(/@keyframes\b/i.test(combinedCss), false, 'CSS must not define idle keyframe loops')
  assert.equal(/@property\b/i.test(combinedCss), false, 'CSS must not animate @property custom props')

  // Default porcelain mode must not enable backdrop-filter except inside opt-in frosted selector
  const nonFrostedLines = coreCss
    .split('\n')
    .filter((line) => /backdrop-filter/i.test(line))
  assert.ok(nonFrostedLines.length > 0, 'Frosted opt-in styles should exist')
  assert.ok(coreCss.includes('[data-glaze-surface="frosted"]'), 'backdrop-filter must be gated on frosted opt-in')

  const clientBundle = readFileSync(path.join(root, 'lib', 'client.js'), 'utf8')
  assert.equal(/\bsetInterval\b/.test(clientBundle), false, 'Client bundle must not poll with setInterval')
  assert.ok(clientBundle.includes('__ModuleLoader__.load'), 'Client bundle must register with __ModuleLoader__')
  assert.ok(clientBundle.includes('id: PLUGIN_ID') || clientBundle.includes('id: "dsh-glaze-theme"'), 'Bundle must declare plugin id')
  assert.ok(clientBundle.includes('exports.apply'), 'Bundle must export apply()')
})

test('sanitizeConfig & greeting resolvers handle invalid values and presets safely', () => {
  const dirty = sanitizeConfig({
    variant: 'non-existent',
    surfaceMode: 'invalid',
    customAccent: 'not-a-color',
    headlineSizePx: 999,
    brandName: '  My\nStudio  ',
    brandIconImage: 'javascript:alert(1)',
  })

  assert.equal(dirty.variant, DEFAULT_CONFIG.variant)
  assert.equal(dirty.surfaceMode, 'glaze')
  assert.equal(dirty.customAccent, '')
  assert.equal(dirty.headlineSizePx, 42)
  assert.equal(dirty.brandName, 'My Studio')
  assert.equal(dirty.brandIconImage, '')

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
    // 1. Initial GET returns config: null
    let r = await fetch(`${baseUrl}/__glaze/config`)
    assert.equal(r.status, 200)
    let json = await r.json()
    assert.deepEqual(json, { ok: true, config: null })

    // 2. Cross-origin POST is rejected with 403
    r = await fetch(`${baseUrl}/__glaze/config`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'http://evil.example',
      },
      body: JSON.stringify({ config: { variant: 'lapis' } }),
    })
    assert.equal(r.status, 403)

    // 3. Same-origin POST persists config
    r = await fetch(`${baseUrl}/__glaze/config`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: baseUrl,
      },
      body: JSON.stringify({ config: { variant: 'lapis', brandName: '砚台' } }),
    })
    assert.equal(r.status, 200)
    assert.deepEqual(await r.json(), { ok: true })

    // 4. Subsequent GET returns saved config
    r = await fetch(`${baseUrl}/__glaze/config`)
    assert.equal(r.status, 200)
    json = await r.json()
    assert.deepEqual(json, { ok: true, config: { variant: 'lapis', brandName: '砚台' } })
  } finally {
    await new Promise((resolve) => server.close(resolve))
    rmSync(tmpDir, { recursive: true, force: true })
  }
})
