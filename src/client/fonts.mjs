/**
 * Artistic / Calligraphic font presets and lightweight on-demand <link> loader.
 * Also loads LXGW WenKai automatically when `thinkingKaiti` is enabled.
 */

export const FONT_CDNS = {
  loli: 'https://fonts.loli.net',
  google: 'https://fonts.googleapis.com',
}

export const DISPLAY_FONTS = {
  default: {
    id: 'default',
    label: '系统原生',
    tag: '零请求',
    sample: '探索未至之境 · DeepSeek',
    family: 'inherit',
    kind: 'system',
  },
  'lxgw-wenkai': {
    id: 'lxgw-wenkai',
    label: '霞鹜文楷',
    tag: '温润书卷',
    sample: '雨过天青云破处',
    family: '"LXGW WenKai", "Kaiti SC", "STKaiti", cursive, serif',
    kind: 'jsdelivr',
    href: 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/style.css',
  },
  'ma-shan-zheng': {
    id: 'ma-shan-zheng',
    label: '马善政楷书',
    tag: '毛笔书法',
    sample: '山色有无中 · 砚台',
    family: '"Ma Shan Zheng", "Kaiti SC", cursive',
    kind: 'gf',
    query: 'Ma+Shan+Zheng',
  },
  'zcool-xiaowei': {
    id: 'zcool-xiaowei',
    label: '站酷小薇体',
    tag: '优雅艺术',
    sample: '日出江花红胜火',
    family: '"ZCOOL XiaoWei", "Songti SC", serif',
    kind: 'gf',
    query: 'ZCOOL+XiaoWei',
  },
  'zhi-mang-xing': {
    id: 'zhi-mang-xing',
    label: '志莽行书',
    tag: '飘逸行草',
    sample: '落霞与孤鹜齐飞',
    family: '"Zhi Mang Xing", "Kaiti SC", cursive',
    kind: 'gf',
    query: 'Zhi+Mang+Xing',
  },
  'noto-serif-sc': {
    id: 'noto-serif-sc',
    label: '思源宋体',
    tag: '雅致衬线',
    sample: '碧海青天夜夜心',
    family: '"Noto Serif SC", "Songti SC", "SimSun", serif',
    kind: 'gf',
    query: 'Noto+Serif+SC:wght@500;700',
  },
  'cinzel-serif': {
    id: 'cinzel-serif',
    label: '古典镌刻 Cinzel',
    tag: '英伦铭文',
    sample: 'GLAZE STUDIO · 瓷釉',
    family: '"Cinzel", "Noto Serif SC", "Songti SC", serif',
    kind: 'gf',
    query: 'Cinzel:wght@600;700&family=Noto+Serif+SC:wght@600',
  },
  'space-grotesk': {
    id: 'space-grotesk',
    label: '现代几何 Space',
    tag: '极客现代',
    sample: 'GLAZE WORKSPACE 01',
    family: '"Space Grotesk", system-ui, -apple-system, sans-serif',
    kind: 'gf',
    query: 'Space+Grotesk:wght@500;700',
  },
  'jetbrains-mono': {
    id: 'jetbrains-mono',
    label: '极客等宽 Mono',
    tag: '代码美学',
    sample: 'dsh // glaze-studio',
    family: '"JetBrains Mono", ui-monospace, monospace',
    kind: 'gf',
    query: 'JetBrains+Mono:wght@500;600',
  },
  custom: {
    id: 'custom',
    label: '自定义本机字体',
    tag: '零网络',
    sample: '输入本机已安装字体名',
    family: 'inherit',
    kind: 'custom',
  },
}

export const BODY_FONTS = {
  default: {
    id: 'default',
    label: '系统默认',
    family: '',
    kind: 'system',
  },
  'lxgw-wenkai': {
    id: 'lxgw-wenkai',
    label: '霞鹜文楷',
    family: '"LXGW WenKai", "PingFang SC", "Microsoft YaHei", sans-serif',
    kind: 'jsdelivr',
    href: 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/style.css',
  },
  'noto-serif-sc': {
    id: 'noto-serif-sc',
    label: '思源宋体',
    family: '"Noto Serif SC", "Songti SC", serif',
    kind: 'gf',
    query: 'Noto+Serif+SC:wght@400;600',
  },
  custom: {
    id: 'custom',
    label: '自定义字体',
    family: '',
    kind: 'custom',
  },
}

export function resolveFontUrl(preset, cdnKey) {
  if (!preset || preset.kind === 'system' || preset.kind === 'custom') return null
  if (preset.kind === 'jsdelivr') return preset.href
  const base = FONT_CDNS[cdnKey] || FONT_CDNS.loli
  return `${base}/css2?family=${preset.query}&display=swap`
}

export function resolveDisplayFontFamily(config) {
  if (config.displayFont === 'custom') {
    const raw = (config.customDisplayFont || '').trim()
    return raw || 'inherit'
  }
  const preset = DISPLAY_FONTS[config.displayFont] || DISPLAY_FONTS.default
  return preset.family
}

export function resolveBodyFontFamily(config) {
  if (config.bodyFont === 'custom') {
    return (config.customBodyFont || '').trim()
  }
  const preset = BODY_FONTS[config.bodyFont] || BODY_FONTS.default
  return preset.family
}

function syncFontLink(linkId, href) {
  if (typeof document === 'undefined') return
  const existing = document.getElementById(linkId)
  if (!href) {
    if (existing) existing.remove()
    return
  }
  if (existing && existing.getAttribute('href') === href) return
  if (existing) existing.remove()
  const link = document.createElement('link')
  link.id = linkId
  link.rel = 'stylesheet'
  link.href = href
  document.head.appendChild(link)
}

export function syncActiveFontLinks(config) {
  const displayPreset = DISPLAY_FONTS[config.displayFont] || DISPLAY_FONTS.default
  const bodyPreset = BODY_FONTS[config.bodyFont] || BODY_FONTS.default
  const displayHref = resolveFontUrl(displayPreset, config.fontCdn)
  let bodyHref = resolveFontUrl(bodyPreset, config.fontCdn)
  if (bodyHref && bodyHref === displayHref) bodyHref = null

  let kaitiHref = null
  if (config.thinkingKaiti) {
    const wenkaiHref = resolveFontUrl(DISPLAY_FONTS['lxgw-wenkai'], config.fontCdn)
    if (wenkaiHref !== displayHref && wenkaiHref !== bodyHref) {
      kaitiHref = wenkaiHref
    }
  }

  syncFontLink('dsh-glaze-font-display', displayHref)
  syncFontLink('dsh-glaze-font-body', bodyHref)
  syncFontLink('dsh-glaze-font-kaiti', kaitiHref)
}
