import { MASTER_PRESETS, PALETTE, VARIANTS, VARIANT_LABELS } from './palette.mjs'
import { BODY_FONTS, DISPLAY_FONTS, resolveFontUrl } from './fonts.mjs'
import { DEFAULT_CONFIG, sanitizeConfig } from './defaults.mjs'
import { currentIsDark, setAppearanceMode } from './appearance.mjs'
import { compressImageFile } from './image-util.mjs'

function dotBackground(variant) {
  const p = PALETTE[variant] || PALETTE.ripple
  return `linear-gradient(135deg, ${p.accentL} 0%, ${p.motionL[1]} 52%, ${p.motionL[2]} 100%)`
}

function el(tag, props = {}, children = []) {
  const node = document.createElement(tag)
  for (const [k, v] of Object.entries(props)) {
    if (v === undefined || v === null) continue
    if (k === 'className') node.className = v
    else if (k === 'text') node.textContent = v
    else if (k === 'style' && typeof v === 'string') node.setAttribute('style', v)
    else if (k === 'dataset' && typeof v === 'object') {
      for (const [dk, dv] of Object.entries(v)) {
        if (dv !== undefined) node.dataset[dk] = String(dv)
      }
    } else if (k.startsWith('on') && typeof v === 'function') {
      node.addEventListener(k.slice(2).toLowerCase(), v)
    } else if (k === 'checked' || k === 'disabled' || k === 'hidden' || k === 'value') {
      node[k] = v
    } else {
      node.setAttribute(k, String(v))
    }
  }
  for (const child of Array.isArray(children) ? children : [children]) {
    if (child === undefined || child === null) continue
    node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child)
  }
  return node
}

export function findSwitcherTarget() {
  const header =
    document.querySelector('header[class*="_header"]') ||
    document.querySelector('header')
  if (header) {
    const utilities = header.querySelector('[class*="_headerUtilities"]')
    if (utilities) return { host: utilities, mode: 'utilities' }

    const corner = header.querySelector('[data-conversation-header-corner]')
    if (corner) return { host: corner, mode: 'corner' }

    const titleRow = header.querySelector('[class*="_titleRow"]')
    if (titleRow) return { host: titleRow, mode: 'titleRow' }
  }
  return { host: document.body || null, mode: 'floating' }
}

export function createUIController({ getConfig, updateConfig, resetConfig, onStatus }) {
  let switcherRoot = null
  let menuOpen = false
  let modalBackdrop = null
  let activeTab = 'master'

  const closeMenu = () => {
    menuOpen = false
    const menu = switcherRoot?.querySelector('.dsh-glaze-menu')
    if (menu) menu.hidden = true
    const trig = switcherRoot?.querySelector('.dsh-glaze-trigger')
    if (trig) trig.setAttribute('aria-expanded', 'false')
  }

  const syncSwitcherVisuals = () => {
    if (!switcherRoot) return
    const cfg = getConfig()
    const activeMaster = cfg.activeMasterPreset
      ? MASTER_PRESETS.find((m) => m.id === cfg.activeMasterPreset)
      : null
    const info = VARIANT_LABELS[cfg.variant] || VARIANT_LABELS.ripple
    const dot = switcherRoot.querySelector('.dsh-glaze-trigger .dsh-glaze-dot')
    const label = switcherRoot.querySelector('.dsh-glaze-trigger__name')
    if (dot) dot.setAttribute('style', `background:${dotBackground(cfg.variant)}`)
    if (label) label.textContent = activeMaster ? activeMaster.name : info.zh

    for (const btn of switcherRoot.querySelectorAll('.dsh-glaze-master-chip')) {
      btn.setAttribute('data-active', String(btn.dataset.master === cfg.activeMasterPreset))
    }
    for (const btn of switcherRoot.querySelectorAll('.dsh-glaze-swatch')) {
      const on = btn.dataset.variant === cfg.variant
      btn.setAttribute('data-active', String(on))
      btn.setAttribute('aria-checked', String(on))
    }

    const dark = currentIsDark()
    for (const btn of switcherRoot.querySelectorAll('.dsh-glaze-appear button')) {
      const m = btn.dataset.mode
      const active = (m === 'dark' && dark) || (m === 'light' && !dark)
      btn.setAttribute('data-active', String(active))
    }
  }

  const buildSwitcher = () => {
    const cfg = getConfig()
    const info = VARIANT_LABELS[cfg.variant] || VARIANT_LABELS.ripple

    const trigger = el(
      'button',
      {
        type: 'button',
        className: 'dsh-glaze-trigger',
        'aria-haspopup': 'true',
        'aria-expanded': 'false',
        title: '瓷釉主题与深度 UI 定制',
        onClick: (e) => {
          e.stopPropagation()
          menuOpen = !menuOpen
          menu.hidden = !menuOpen
          trigger.setAttribute('aria-expanded', String(menuOpen))
          if (menuOpen) syncSwitcherVisuals()
        },
      },
      [
        el('span', { className: 'dsh-glaze-dot', style: `background:${dotBackground(cfg.variant)}` }),
        el('span', { className: 'dsh-glaze-trigger__name', text: info.zh }),
      ]
    )

    const masterRow = el(
      'div',
      { className: 'dsh-glaze-master-mini' },
      MASTER_PRESETS.map((preset) =>
        el('button', {
          type: 'button',
          className: 'dsh-glaze-master-chip',
          text: preset.name,
          title: preset.desc,
          dataset: { master: preset.id, active: String(cfg.activeMasterPreset === preset.id) },
          onClick: () => {
            updateConfig(preset.patch)
            syncSwitcherVisuals()
          },
        })
      )
    )

    const grid = el('div', { className: 'dsh-glaze-grid', role: 'radiogroup', 'aria-label': '16色瓷釉色板' })
    for (const v of VARIANTS) {
      const lbl = VARIANT_LABELS[v]
      grid.appendChild(
        el(
          'button',
          {
            type: 'button',
            className: 'dsh-glaze-swatch',
            role: 'radio',
            title: `${lbl.zh} · ${lbl.poem}`,
            dataset: { variant: v, active: String(v === cfg.variant) },
            'aria-checked': String(v === cfg.variant),
            onClick: () => {
              updateConfig({ variant: v, activeMasterPreset: '' })
              syncSwitcherVisuals()
            },
          },
          [
            el('span', { className: 'dsh-glaze-dot', style: `background:${dotBackground(v)}` }),
            el('span', { text: lbl.zh, style: 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;' }),
          ]
        )
      )
    }

    const appearRow = el(
      'div',
      { className: 'dsh-glaze-appear' },
      [
        ['light', '浅色'],
        ['dark', '深色'],
        ['system', '跟随系统'],
      ].map(([mode, text]) =>
        el('button', {
          type: 'button',
          text,
          dataset: { mode },
          onClick: async () => {
            await setAppearanceMode(mode)
            syncSwitcherVisuals()
          },
        })
      )
    )

    const ctaBtn = el('button', {
      type: 'button',
      className: 'dsh-glaze-menu__cta',
      text: '✦ 深度 UI 与品牌定制面板',
      onClick: () => {
        closeMenu()
        openModal()
      },
    })

    const menu = el('div', { className: 'dsh-glaze-menu', hidden: true, onClick: (e) => e.stopPropagation() }, [
      el('div', { className: 'dsh-glaze-menu__head' }, [
        el('strong', { text: '瓷釉 Glaze' }),
        el('span', { text: '零模糊低耗版' }),
      ]),
      el('div', { className: 'dsh-glaze-subhead', text: '东方意境全案（一键联动）' }),
      masterRow,
      el('div', { className: 'dsh-glaze-subhead', text: '16 色瓷釉色板（仅换色）' }),
      grid,
      appearRow,
      ctaBtn,
    ])

    return el('div', { className: 'dsh-glaze-switcher' }, [trigger, menu])
  }

  const ensureSwitcherMounted = () => {
    if (typeof document === 'undefined' || !document.body) return
    const { host, mode } = findSwitcherTarget()
    if (!host) return
    if (!switcherRoot) switcherRoot = buildSwitcher()

    const alreadyInTarget =
      document.contains(switcherRoot) &&
      switcherRoot.parentElement === host &&
      switcherRoot.dataset.hostMode === mode
    if (alreadyInTarget) return

    switcherRoot.dataset.hostMode = mode
    if (mode === 'floating') switcherRoot.setAttribute('data-floating', '1')
    else switcherRoot.removeAttribute('data-floating')

    if (mode === 'utilities' || mode === 'corner') {
      host.prepend(switcherRoot)
    } else {
      host.appendChild(switcherRoot)
    }
    syncSwitcherVisuals()
  }

  const needsHostSync = () => {
    if (!switcherRoot || !document.contains(switcherRoot)) return true
    const { host, mode } = findSwitcherTarget()
    return switcherRoot.dataset.hostMode !== mode || switcherRoot.parentElement !== host
  }

  if (typeof document !== 'undefined' && !window.__dshGlazeOutsideBound__) {
    window.__dshGlazeOutsideBound__ = true
    document.addEventListener('click', (e) => {
      if (!menuOpen || !switcherRoot) return
      if (!switcherRoot.contains(e.target)) closeMenu()
    })
  }

  // ── 5-Tab Deep Customizer Modal ────────────────────────────────────────
  const renderModal = () => {
    if (!modalBackdrop) return
    const cfg = getConfig()
    modalBackdrop.textContent = ''

    const statusLine = el('span', {
      className: 'dsh-glaze-status',
      text: '配置已自动持久化至浏览器与 ~/.dsh/glaze-theme.json',
    })
    const setStatus = (msg) => {
      statusLine.textContent = msg
      onStatus?.(msg)
    }

    const patchAndRefresh = (patch, rerender = false) => {
      updateConfig(patch)
      syncSwitcherVisuals()
      setStatus('✓ 已保存并实时生效')
      if (rerender) renderModal()
    }

    const makeRow = (labelText, control, hintText) =>
      el('div', { style: 'margin-bottom:10px;' }, [
        el('div', { className: 'dsh-glaze-row' }, [el('label', { text: labelText }), control]),
        hintText ? el('p', { className: 'dsh-glaze-hint', text: hintText }) : null,
      ])

    const makeSelect = (value, options, onChange) => {
      const sel = el('select', { className: 'dsh-glaze-select' })
      for (const [val, label] of options) {
        const opt = el('option', { value: val, text: label })
        if (val === value) opt.selected = true
        sel.appendChild(opt)
      }
      sel.addEventListener('change', () => onChange(sel.value))
      return sel
    }

    const makeTextInput = (value, placeholder, onInput) => {
      const inp = el('input', { type: 'text', className: 'dsh-glaze-input', value: value || '', placeholder })
      inp.addEventListener('input', () => onInput(inp.value))
      return inp
    }

    const makeColorField = (currentHex, defaultHex, key, placeholderText) => {
      const picker = el('input', {
        type: 'color',
        value: currentHex || defaultHex,
        style: 'width:38px;height:34px;border:none;background:transparent;cursor:pointer;padding:0;',
        onInput: (e) => patchAndRefresh({ [key]: e.target.value }, false),
      })
      const hexInp = makeTextInput(currentHex, placeholderText, (val) => {
        const trimmed = val.trim()
        if (!trimmed || /^#[0-9a-fA-F]{6}$/.test(trimmed)) {
          patchAndRefresh({ [key]: trimmed }, false)
        }
      })
      const resetBtn = el('button', {
        type: 'button',
        className: 'dsh-glaze-btn',
        text: '跟随主题',
        onClick: () => patchAndRefresh({ [key]: '' }, true),
      })
      return el('div', { style: 'display:flex;gap:8px;flex:1;align-items:center;' }, [picker, hexInp, resetBtn])
    }

    const makeSliderRow = (labelText, value, min, max, key, hintText, unit = 'px') => {
      const readout = el('span', {
        text: `${value}${unit}`,
        style: 'min-width:44px;text-align:right;font-size:12.5px;',
      })
      const range = el('input', {
        type: 'range',
        min,
        max,
        value,
        style: 'flex:1;',
        onInput: (e) => {
          const num = Number(e.target.value)
          readout.textContent = `${num}${unit}`
          patchAndRefresh({ [key]: num }, false)
        },
      })
      return makeRow(labelText, el('div', { style: 'display:flex;align-items:center;gap:10px;flex:1;' }, [range, readout]), hintText)
    }

    const makeImageUploader = (currentImg, onUploaded, onClear) => {
      const fileInp = el('input', { type: 'file', accept: 'image/*', hidden: true })
      fileInp.addEventListener('change', async () => {
        const file = fileInp.files?.[0]
        if (!file) return
        try {
          setStatus('正在压缩图片...')
          const dataUrl = await compressImageFile(file, 128)
          onUploaded(dataUrl)
        } catch (err) {
          setStatus(`图片处理失败: ${err?.message || err}`)
        }
      })
      return el('div', { style: 'display:flex;gap:6px;flex:1;align-items:center;' }, [
        makeTextInput(currentImg, '粘贴图片 URL 或点击右侧上传本地图片', onUploaded),
        el('button', { type: 'button', className: 'dsh-glaze-btn', text: '上传图片', onClick: () => fileInp.click() }),
        currentImg ? el('button', { type: 'button', className: 'dsh-glaze-btn', text: '清除', onClick: onClear }) : null,
        fileInp,
      ])
    }

    // ── Tab 1: 意境与色板 ────────────────────────────────────────────────
    const masterGrid = el(
      'div',
      { className: 'dsh-glaze-master-grid' },
      MASTER_PRESETS.map((preset) =>
        el(
          'button',
          {
            type: 'button',
            className: 'dsh-glaze-master-card',
            dataset: { active: String(cfg.activeMasterPreset === preset.id) },
            onClick: () => patchAndRefresh(preset.patch, true),
          },
          [
            el('div', { className: 'dsh-glaze-master-card__top' }, [
              el('span', { className: 'dsh-glaze-dot', style: `background:${dotBackground(preset.patch.variant)}` }),
              el('span', { text: preset.name }),
            ]),
            el('div', { className: 'dsh-glaze-master-card__desc', text: preset.desc }),
          ]
        )
      )
    )

    const paletteGrid = el('div', { className: 'dsh-glaze-palette-grid' })
    for (const v of VARIANTS) {
      const lbl = VARIANT_LABELS[v]
      paletteGrid.appendChild(
        el(
          'button',
          {
            type: 'button',
            className: 'dsh-glaze-option',
            dataset: { variant: v, active: String(v === cfg.variant) },
            onClick: () => patchAndRefresh({ variant: v, activeMasterPreset: '' }, true),
          },
          [
            el('span', { className: 'dsh-glaze-dot', style: `background:${dotBackground(v)}` }),
            el('span', { className: 'dsh-glaze-option__text' }, [
              el('span', { className: 'dsh-glaze-option__name', text: lbl.zh }),
              el('span', { className: 'dsh-glaze-option__poem', text: lbl.poem }),
            ]),
          ]
        )
      )
    }

    const tabMaster = el('div', { className: 'dsh-glaze-panel', hidden: activeTab !== 'master' }, [
      el('div', { className: 'dsh-glaze-section' }, [
        el('h3', { text: '东方意境全案（一键联动配色、侧栏、底纹、思考框与字体）' }),
        masterGrid,
      ]),
      el('div', { className: 'dsh-glaze-section' }, [
        el('h3', { text: '16 套瓷釉 & 传统色板' }),
        paletteGrid,
      ]),
      el('div', { className: 'dsh-glaze-section' }, [
        el('h3', { text: '侧边栏、右侧对话区底色与主强调色定制' }),
        makeRow(
          '左侧边栏基调',
          makeSelect(
            cfg.sidebarTone,
            [
              ['layered', '分明书案（与右侧对话区呈温和色差分层）'],
              ['deep', '沉檀深栏（紫禁/紫檀深色侧栏，衬托亮色画布）'],
              ['seamless', '通透一体（无界大连屏 · 左右底纹与光晕全贯通）'],
              ['custom', '自定义侧栏底色'],
            ],
            (v) => patchAndRefresh({ sidebarTone: v, activeMasterPreset: '' }, true)
          )
        ),
        cfg.sidebarTone === 'custom'
          ? makeRow('侧边栏颜色', makeColorField(cfg.customSidebarBg, '#1f2937', 'customSidebarBg', '十六进制色值如 #1f2937'))
          : null,
        makeRow(
          '右侧对话区底色',
          makeColorField(cfg.customChatBg, '#141a1c', 'customChatBg', '留空跟随当前色板，或选专属背景色')
        ),
        makeRow(
          '主强调 / 发送按钮色',
          makeColorField(cfg.customAccent, '#4e8c97', 'customAccent', '留空跟随主题，控制发送键与焦点高亮')
        ),
      ]),
    ])

    // ── Tab 2: 深度组件造型 ────────────────────────────────────────────────
    const tabComponents = el('div', { className: 'dsh-glaze-panel', hidden: activeTab !== 'components' }, [
      el('div', { className: 'dsh-glaze-section' }, [
        el('h3', { text: '右侧画布底纹与材质性能' }),
        makeRow(
          '画布静态底纹',
          makeSelect(
            cfg.canvasPattern,
            [
              ['ambience', '四隅流光（四角温和光晕）'],
              ['xuan-paper', '宣纸素笺（细密纸纹 + 光晕）'],
              ['landscape', '远山含黛（底部水墨层峦剪影）'],
              ['lattice', '宋锦冰裂纹（古典几何窗格）'],
              ['cloud', '祥云瑞霭（古典云纹线条）'],
              ['none', '净素无纹（极简纯色底）'],
            ],
            (v) => patchAndRefresh({ canvasPattern: v, activeMasterPreset: '' }, false)
          ),
          '全部采用纯静态矢量/渐变纹理，0% 空载 CPU / 显卡动画消耗。'
        ),
        makeRow(
          '表面质感模式',
          makeSelect(
            cfg.surfaceMode,
            [
              ['glaze', '瓷釉零模糊（推荐 · 0% 显卡占用）'],
              ['frosted', '轻雾静态毛玻璃（仅侧栏与输入卡）'],
            ],
            (v) => patchAndRefresh({ surfaceMode: v }, false)
          )
        ),
      ]),
      el('div', { className: 'dsh-glaze-section' }, [
        el('h3', { text: '对话思考过程（已完成 / 深度求索中 / 折叠步骤块）' }),
        makeRow(
          '思考展示样式',
          makeSelect(
            cfg.thinkingStyle,
            [
              ['scroll-note', '墨卷朱批（「批」字印章条 + 柔底色卡片）'],
              ['bamboo-slip', '竹简经折（「简」字徽标 + 双竖线简牍）'],
              ['zen-line', '极简禅意（细竖线批注流）'],
              ['native', '官方原生样式'],
            ],
            (v) => patchAndRefresh({ thinkingStyle: v, activeMasterPreset: '' }, false)
          )
        ),
        makeRow(
          '思考正文字体',
          makeSelect(
            String(cfg.thinkingKaiti),
            [
              ['false', '随正文默认字体'],
              ['true', '楷体手批风（自动加载霞鹜文楷呈现思考细节）'],
            ],
            (v) => patchAndRefresh({ thinkingKaiti: v === 'true', activeMasterPreset: '' }, false)
          )
        ),
      ]),
      el('div', { className: 'dsh-glaze-section' }, [
        el('h3', { text: '输入框、发送键与用户气泡造型' }),
        makeRow(
          '输入框样式',
          makeSelect(
            cfg.composerStyle,
            [
              ['porcelain', '温润瓷砚（16px 圆角 + 三层柔影）'],
              ['xuan-scroll', '文人花笺（四角中式直角框线）'],
              ['imperial-seal', '文武双线（双层嵌套宫廷边框）'],
              ['floating-jade', '悬浮流云（24px 大圆角空气感）'],
            ],
            (v) => patchAndRefresh({ composerStyle: v, activeMasterPreset: '' }, false)
          )
        ),
        makeSliderRow(
          '输入框不透明度',
          cfg.composerOpacityPct,
          0,
          100,
          'composerOpacityPct',
          '0% 为全透明悬浮线框，100% 为纯实心瓷片；拖动滑块可实时观察下方输入框透底效果。',
          '%'
        ),
        makeRow(
          '发送按钮形状',
          makeSelect(
            cfg.sendButtonStyle,
            [
              ['round', '圆融明珠（默认圆形）'],
              ['seal', '朱印方章（微圆角方印 + 内描边）'],
              ['jade-pill', '温玉圆方（圆角矩形按钮）'],
            ],
            (v) => patchAndRefresh({ sendButtonStyle: v, activeMasterPreset: '' }, false)
          )
        ),
        makeRow(
          '用户消息气泡',
          makeSelect(
            cfg.bubbleStyle,
            [
              ['glaze', '瓷片柔影（主题微染色圆角气泡）'],
              ['letter-paper', '素笺右栏（右端主题竖条书信感）'],
              ['ink-outline', '水墨细框（透明底 + 细线描边）'],
            ],
            (v) => patchAndRefresh({ bubbleStyle: v, activeMasterPreset: '' }, false)
          )
        ),
      ]),
    ])

    // ── Tab 3: 艺术字体 ────────────────────────────────────────────────
    const fontGrid = el('div', { className: 'dsh-glaze-font-grid' })
    for (const preset of Object.values(DISPLAY_FONTS)) {
      const href = resolveFontUrl(preset, cfg.fontCdn)
      if (href && typeof document !== 'undefined') {
        const previewLinkId = `dsh-glaze-preview-font-${preset.id}`
        if (!document.getElementById(previewLinkId)) {
          const l = document.createElement('link')
          l.id = previewLinkId
          l.rel = 'stylesheet'
          l.href = href
          document.head.appendChild(l)
        }
      }
      fontGrid.appendChild(
        el(
          'button',
          {
            type: 'button',
            className: 'dsh-glaze-font-card',
            dataset: { active: String(cfg.displayFont === preset.id) },
            onClick: () => patchAndRefresh({ displayFont: preset.id, activeMasterPreset: '' }, true),
          },
          [
            el('div', { className: 'dsh-glaze-font-card__top' }, [
              el('span', { text: preset.label }),
              el('span', { className: 'dsh-glaze-font-card__tag', text: preset.tag }),
            ]),
            el('div', {
              className: 'dsh-glaze-font-card__sample',
              text: preset.sample,
              style: `font-family:${preset.family};`,
            }),
          ]
        )
      )
    }

    const tabFonts = el('div', { className: 'dsh-glaze-panel', hidden: activeTab !== 'fonts' }, [
      el('div', { className: 'dsh-glaze-section' }, [
        el('h3', { text: '艺术字体库（同时作用于左上角软件名 & 首页主标语）' }),
        fontGrid,
        cfg.displayFont === 'custom'
          ? el('div', { style: 'margin-top:10px;' }, [
              makeRow('自定义艺术字体', makeTextInput(cfg.customDisplayFont, '如 "LXGW WenKai", "PingFang SC"', (v) => patchAndRefresh({ customDisplayFont: v }, false))),
            ])
          : null,
      ]),
      el('div', { className: 'dsh-glaze-section' }, [
        el('h3', { text: '字号与艺术字效调节' }),
        makeSliderRow('左上角软件名字号', cfg.brandFontSizePx, 12, 28, 'brandFontSizePx', '需先在「品牌与欢迎页」填写自定义软件名称后生效。'),
        makeRow(
          '软件名艺术效果',
          makeSelect(
            cfg.brandStyle,
            [
              ['solid', '墨韵纯色'],
              ['gradient', '琉璃双色渐变'],
              ['glow', '微光冷晕'],
            ],
            (v) => patchAndRefresh({ brandStyle: v }, false)
          )
        ),
        makeSliderRow('首页欢迎语字号', cfg.headlineSizePx, 20, 42, 'headlineSizePx'),
        makeRow(
          '欢迎语艺术效果',
          makeSelect(
            cfg.headlineStyle,
            [
              ['solid', '墨韵纯色'],
              ['gradient', '琉璃双色渐变'],
              ['glow', '微光冷晕'],
            ],
            (v) => patchAndRefresh({ headlineStyle: v, activeMasterPreset: '' }, false)
          )
        ),
        makeRow(
          '全局正文字体',
          makeSelect(
            cfg.bodyFont,
            Object.values(BODY_FONTS).map((f) => [f.id, f.label]),
            (v) => patchAndRefresh({ bodyFont: v }, true)
          )
        ),
        cfg.bodyFont === 'custom'
          ? makeRow('自定义正文字体', makeTextInput(cfg.customBodyFont, '如 "Noto Sans SC", sans-serif', (v) => patchAndRefresh({ customBodyFont: v }, false)))
          : null,
        makeRow(
          '字体 CDN 源',
          makeSelect(
            cfg.fontCdn,
            [
              ['loli', '国内加速镜像（fonts.loli.net）'],
              ['google', 'Google Fonts 官方源'],
            ],
            (v) => patchAndRefresh({ fontCdn: v }, true)
          )
        ),
      ]),
    ])

    // ── Tab 4: 品牌与欢迎页 ────────────────────────────────────────────────
    const tabBrand = el('div', { className: 'dsh-glaze-panel', hidden: activeTab !== 'brand' }, [
      el('div', { className: 'dsh-glaze-section' }, [
        el('h3', { text: '① 左上角品牌栏（Sidebar Brand）' }),
        makeRow('软件主名称', makeTextInput(cfg.brandName, '如：砚台 Studio（留空恢复官方图标）', (v) => patchAndRefresh({ brandName: v }, false))),
        makeSliderRow('软件名字号', cfg.brandFontSizePx, 12, 28, 'brandFontSizePx'),
        makeRow(
          '右侧角标模式',
          makeSelect(
            cfg.brandBadgeMode,
            [
              ['default', '默认（留空软件名时显示官方样式）'],
              ['custom', '显示自定义胶囊角标'],
              ['hidden', '隐藏角标'],
            ],
            (v) => patchAndRefresh({ brandBadgeMode: v }, true)
          ),
          '填写自定义“软件主名称”后，自定义角标与字号会立即生效。'
        ),
        cfg.brandBadgeMode === 'custom'
          ? makeRow('角标文字', makeTextInput(cfg.brandBadgeText, '如 STUDIO / PRO / AI', (v) => patchAndRefresh({ brandBadgeText: v }, false)))
          : null,
        makeRow(
          '品牌图标模式',
          makeSelect(
            cfg.brandIconMode,
            [
              ['default', '默认官方鲸鱼'],
              ['emoji', '使用 Emoji 图标'],
              ['image', '自定义图片 / SVG Logo'],
              ['hidden', '隐藏图标'],
            ],
            (v) => patchAndRefresh({ brandIconMode: v }, true)
          )
        ),
        cfg.brandIconMode === 'emoji'
          ? makeRow('品牌 Emoji', makeTextInput(cfg.brandIconEmoji, '如 🐋 / 🫖 / ⚡', (v) => patchAndRefresh({ brandIconEmoji: v }, false)))
          : null,
        cfg.brandIconMode === 'image'
          ? makeRow('品牌图片', makeImageUploader(cfg.brandIconImage, (u) => patchAndRefresh({ brandIconImage: u }, true), () => patchAndRefresh({ brandIconImage: '' }, true)))
          : null,
        makeRow('浏览器窗口标题', makeTextInput(cfg.appTitle, '留空保持默认（DeepSeek Harness）', (v) => patchAndRefresh({ appTitle: v }, false))),
      ]),
      el('div', { className: 'dsh-glaze-section' }, [
        el('h3', { text: '② 首页中央欢迎区（Hero）与输入框' }),
        makeRow(
          '欢迎语模式',
          makeSelect(
            cfg.heroHeadlineMode,
            [
              ['default', '官方默认（探索未至之境）'],
              ['custom', '自定义欢迎语'],
              ['poem', '随当前配色切换古诗词'],
              ['time', '按早/中/晚时段自动问候'],
            ],
            (v) => patchAndRefresh({ heroHeadlineMode: v }, true)
          )
        ),
        cfg.heroHeadlineMode === 'custom'
          ? makeRow('自定义欢迎语', makeTextInput(cfg.heroHeadline, '写一句你喜欢的话', (v) => patchAndRefresh({ heroHeadline: v }, false)))
          : null,
        makeRow(
          '副标徽章',
          makeSelect(
            cfg.heroBadgeMode,
            [
              ['default', '默认（预览版）'],
              ['custom', '自定义徽章文字'],
              ['hidden', '隐藏徽章'],
            ],
            (v) => patchAndRefresh({ heroBadgeMode: v }, true)
          )
        ),
        cfg.heroBadgeMode === 'custom'
          ? makeRow('徽章文字', makeTextInput(cfg.heroBadgeText, '如 v2.0 / 个人工作台', (v) => patchAndRefresh({ heroBadgeText: v }, false)))
          : null,
        makeRow(
          '中央图标',
          makeSelect(
            cfg.heroIconMode,
            [
              ['default', '默认游动鲸鱼'],
              ['followBrand', '跟随左上角品牌图标'],
              ['emoji', '使用 Emoji 图标'],
              ['image', '自定义图片 / Logo'],
              ['hidden', '隐藏中央图标'],
            ],
            (v) => patchAndRefresh({ heroIconMode: v }, true)
          )
        ),
        cfg.heroIconMode === 'emoji'
          ? makeRow('中央 Emoji', makeTextInput(cfg.heroIconEmoji, '如 ✨ / 🚀 / 🌸', (v) => patchAndRefresh({ heroIconEmoji: v }, false)))
          : null,
        cfg.heroIconMode === 'image'
          ? makeRow('中央图片', makeImageUploader(cfg.heroIconImage, (u) => patchAndRefresh({ heroIconImage: u }, true), () => patchAndRefresh({ heroIconImage: '' }, true)))
          : null,
        makeRow(
          '隐藏点击跃鲸鱼背景',
          makeSelect(
            String(cfg.hideHeroCanvas),
            [
              ['false', '保留（默认留白点击可触发）'],
              ['true', '隐藏空白页背景 Canvas'],
            ],
            (v) => patchAndRefresh({ hideHeroCanvas: v === 'true' }, false)
          )
        ),
        makeRow('输入框提示语', makeTextInput(cfg.composerPlaceholder, '留空保持官方默认提示词', (v) => patchAndRefresh({ composerPlaceholder: v }, false))),
      ]),
    ])

    // ── Tab 5: 个人栏与备份 ────────────────────────────────────────────────
    const importFile = el('input', { type: 'file', accept: 'application/json,.json', hidden: true })
    importFile.addEventListener('change', async () => {
      const f = importFile.files?.[0]
      if (!f) return
      try {
        const text = await f.text()
        const parsed = sanitizeConfig(JSON.parse(text))
        updateConfig(parsed)
        syncSwitcherVisuals()
        setStatus('✓ 已导入配置并应用')
        renderModal()
      } catch (err) {
        setStatus(`导入失败: ${err?.message || err}`)
      }
    })

    const tabAccount = el('div', { className: 'dsh-glaze-panel', hidden: activeTab !== 'account' }, [
      el('div', { className: 'dsh-glaze-section' }, [
        el('h3', { text: '④ 左下角账号栏（仅改本地视觉显示，不影响登录与菜单）' }),
        makeRow('显示昵称', makeTextInput(cfg.userName, '留空显示账号原昵称', (v) => patchAndRefresh({ userName: v }, false))),
        makeRow(
          '头像模式',
          makeSelect(
            cfg.userAvatarMode,
            [
              ['default', '默认账号头像'],
              ['emoji', '使用 Emoji 头像'],
              ['image', '上传本地图片 / 图片 URL'],
            ],
            (v) => patchAndRefresh({ userAvatarMode: v }, true)
          )
        ),
        cfg.userAvatarMode === 'emoji'
          ? makeRow('头像 Emoji', makeTextInput(cfg.userAvatarEmoji, '如 🎨 / 🦊 / ☕', (v) => patchAndRefresh({ userAvatarEmoji: v }, false)))
          : null,
        cfg.userAvatarMode === 'image'
          ? makeRow('头像图片', makeImageUploader(cfg.userAvatarImage, (u) => patchAndRefresh({ userAvatarImage: u }, true), () => patchAndRefresh({ userAvatarImage: '' }, true)))
          : null,
      ]),
      el('div', { className: 'dsh-glaze-section' }, [
        el('h3', { text: '配置导出 / 导入 / 重置' }),
        el('div', { style: 'display:flex;gap:10px;flex-wrap:wrap;' }, [
          el('button', {
            type: 'button',
            className: 'dsh-glaze-btn',
            text: '导出配置 JSON',
            onClick: () => {
              const blob = new Blob([JSON.stringify(getConfig(), null, 2)], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'glaze-theme-config.json'
              a.click()
              setTimeout(() => URL.revokeObjectURL(url), 1000)
              setStatus('✓ 已导出 glaze-theme-config.json')
            },
          }),
          el('button', {
            type: 'button',
            className: 'dsh-glaze-btn',
            text: '导入配置 JSON',
            onClick: () => importFile.click(),
          }),
          el('button', {
            type: 'button',
            className: 'dsh-glaze-btn',
            text: '恢复全部默认',
            onClick: () => {
              resetConfig()
              syncSwitcherVisuals()
              setStatus('✓ 已恢复默认配置')
              renderModal()
            },
          }),
          importFile,
        ]),
        el('p', {
          className: 'dsh-glaze-hint',
          text: `所有设置会同时保存在浏览器本地与服务端 ~/.dsh/glaze-theme.json 中（默认配色：${VARIANT_LABELS[DEFAULT_CONFIG.variant].zh}）。`,
        }),
      ]),
    ])

    const tabsBar = el(
      'div',
      { className: 'dsh-glaze-tabs', role: 'tablist' },
      [
        ['master', '意境与色板'],
        ['components', '深度组件造型'],
        ['fonts', '艺术字体'],
        ['brand', '品牌与欢迎页'],
        ['account', '个人栏与备份'],
      ].map(([id, label]) =>
        el('button', {
          type: 'button',
          role: 'tab',
          className: 'dsh-glaze-tab',
          text: label,
          dataset: { active: String(activeTab === id) },
          onClick: () => {
            activeTab = id
            renderModal()
          },
        })
      )
    )

    const modal = el('div', { className: 'dsh-glaze-modal', onClick: (e) => e.stopPropagation() }, [
      el('div', { className: 'dsh-glaze-modal__head' }, [
        el('div', { className: 'dsh-glaze-modal__title' }, [
          el('h2', { text: '瓷釉 Glaze · 深度 UI 与东方美学定制' }),
          el('span', { text: '实时生效 · 零常驻动画 · 0% 空载显卡消耗' }),
        ]),
        el('button', {
          type: 'button',
          className: 'dsh-glaze-modal__close',
          text: '×',
          'aria-label': '关闭设置',
          onClick: closeModal,
        }),
      ]),
      tabsBar,
      el('div', { className: 'dsh-glaze-modal__body' }, [tabMaster, tabComponents, tabFonts, tabBrand, tabAccount]),
      el('div', { className: 'dsh-glaze-modal__foot' }, [
        statusLine,
        el('button', { type: 'button', className: 'dsh-glaze-btn dsh-glaze-btn--primary', text: '完成', onClick: closeModal }),
      ]),
    ])

    modalBackdrop.appendChild(modal)
  }

  const openModal = () => {
    if (typeof document === 'undefined' || !document.body) return
    if (!modalBackdrop) {
      modalBackdrop = el('div', {
        className: 'dsh-glaze-modal-backdrop',
        onClick: closeModal,
      })
      document.body.appendChild(modalBackdrop)
    }
    modalBackdrop.hidden = false
    renderModal()
  }

  const closeModal = () => {
    if (modalBackdrop) modalBackdrop.hidden = true
  }

  return {
    ensureSwitcherMounted,
    needsHostSync,
    syncSwitcherVisuals,
    openModal,
    closeModal,
  }
}
