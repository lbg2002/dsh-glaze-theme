import { PALETTE, VARIANTS, VARIANT_LABELS } from './palette.mjs'
import { BODY_FONTS, DISPLAY_FONTS, resolveFontUrl } from './fonts.mjs'
import { DEFAULT_CONFIG, sanitizeConfig } from './defaults.mjs'
import { currentIsDark, setAppearanceMode } from './appearance.mjs'
import { compressImageFile } from './image-util.mjs'

function dotBackground(variant) {
  const p = PALETTE[variant] || PALETTE.ripple
  return `linear-gradient(135deg, rgb(${p.morandi}) 0%, ${p.accentL} 100%)`
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

export function findSwitcherHost() {
  const header =
    document.querySelector('header[class*="_header"]') ||
    document.querySelector('header')
  if (!header) return null
  return (
    header.querySelector('[class*="_headerUtilities"]') ||
    header.querySelector('[class*="_headerActions"]') ||
    null
  )
}

export function createUIController({ getConfig, updateConfig, resetConfig, onStatus }) {
  let switcherRoot = null
  let menuOpen = false
  let modalBackdrop = null
  let activeTab = 'palette'

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
    const info = VARIANT_LABELS[cfg.variant] || VARIANT_LABELS.ripple
    const dot = switcherRoot.querySelector('.dsh-glaze-trigger .dsh-glaze-dot')
    const label = switcherRoot.querySelector('.dsh-glaze-trigger__name')
    if (dot) dot.setAttribute('style', `background:${dotBackground(cfg.variant)}`)
    if (label) label.textContent = info.zh

    for (const btn of switcherRoot.querySelectorAll('.dsh-glaze-option')) {
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
        title: '瓷釉主题与品牌设置',
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

    const grid = el('div', { className: 'dsh-glaze-grid', role: 'radiogroup', 'aria-label': '莫兰迪配色' })
    for (const v of VARIANTS) {
      const lbl = VARIANT_LABELS[v]
      grid.appendChild(
        el(
          'button',
          {
            type: 'button',
            className: 'dsh-glaze-option',
            role: 'radio',
            dataset: { variant: v, active: String(v === cfg.variant) },
            'aria-checked': String(v === cfg.variant),
            onClick: () => {
              updateConfig({ variant: v })
              syncSwitcherVisuals()
            },
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

    const appearRow = el('div', { className: 'dsh-glaze-appear' }, [
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
    ))

    const ctaBtn = el('button', {
      type: 'button',
      className: 'dsh-glaze-menu__cta',
      text: '✦ 品牌 / 字体 / 个性化设置',
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
      grid,
      appearRow,
      ctaBtn,
    ])

    const root = el('div', { className: 'dsh-glaze-switcher' }, [trigger, menu])
    return root
  }

  const ensureSwitcherMounted = () => {
    if (typeof document === 'undefined' || !document.body) return
    const host = findSwitcherHost()
    if (switcherRoot && document.contains(switcherRoot)) {
      if (host && switcherRoot.parentElement !== host) {
        switcherRoot.removeAttribute('data-floating')
        host.prepend(switcherRoot)
      }
      return
    }
    if (!switcherRoot) switcherRoot = buildSwitcher()
    if (host) {
      switcherRoot.removeAttribute('data-floating')
      host.prepend(switcherRoot)
    } else {
      switcherRoot.setAttribute('data-floating', '1')
      document.body.appendChild(switcherRoot)
    }
    syncSwitcherVisuals()
  }

  // Click-outside dismissal registered once
  if (typeof document !== 'undefined' && !window.__dshGlazeOutsideBound__) {
    window.__dshGlazeOutsideBound__ = true
    document.addEventListener('click', (e) => {
      if (!menuOpen || !switcherRoot) return
      if (!switcherRoot.contains(e.target)) closeMenu()
    })
  }

  // ── 4-Tab Settings Modal ────────────────────────────────────────
  const renderModal = () => {
    if (!modalBackdrop) return
    const cfg = getConfig()
    modalBackdrop.textContent = ''

    const statusLine = el('span', { className: 'dsh-glaze-status', text: '配置已自动持久化到本地与 ~/.dsh/glaze-theme.json' })
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

    const makeRow = (labelText, control, hintText) => {
      const wrap = el('div', {}, [
        el('div', { className: 'dsh-glaze-row' }, [el('label', { text: labelText }), control]),
        hintText ? el('p', { className: 'dsh-glaze-hint', text: hintText }) : null,
      ])
      return wrap
    }

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

    // Tab 1: 配色与质感
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
            onClick: () => patchAndRefresh({ variant: v }, true),
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

    const accentPicker = el('input', {
      type: 'color',
      value: cfg.customAccent || '#4e8c97',
      style: 'width:38px;height:34px;border:none;background:transparent;cursor:pointer;padding:0;',
      onInput: (e) => patchAndRefresh({ customAccent: e.target.value }, false),
    })
    const accentHex = makeTextInput(cfg.customAccent, '留空则跟随当前配色（如 #3b82f6）', (val) => {
      const trimmed = val.trim()
      if (!trimmed || /^#[0-9a-fA-F]{6}$/.test(trimmed)) {
        patchAndRefresh({ customAccent: trimmed }, false)
      }
    })
    const accentReset = el('button', {
      type: 'button',
      className: 'dsh-glaze-btn',
      text: '跟随主题',
      onClick: () => patchAndRefresh({ customAccent: '' }, true),
    })

    const tabPalette = el('div', { className: 'dsh-glaze-panel', hidden: activeTab !== 'palette' }, [
      el('div', { className: 'dsh-glaze-section' }, [
        el('h3', { text: '10 套瓷釉莫兰迪配色' }),
        paletteGrid,
      ]),
      el('div', { className: 'dsh-glaze-section' }, [
        el('h3', { text: '主强调色 & 发送按钮颜色（对应截图 ③）' }),
        makeRow(
          '自定义主色',
          el('div', { style: 'display:flex;gap:8px;flex:1;align-items:center;' }, [accentPicker, accentHex, accentReset]),
          '同时控制发送按钮、高亮边框与选中态；留空自动使用当前配色的 WCAG AA 达标主色。'
        ),
      ]),
      el('div', { className: 'dsh-glaze-section' }, [
        el('h3', { text: '材质与能耗模式' }),
        makeRow(
          '表面质感',
          makeSelect(
            cfg.surfaceMode,
            [
              ['glaze', '瓷釉零模糊（推荐 · 0% 显卡占用）'],
              ['frosted', '轻雾静态毛玻璃（仅侧栏与输入卡）'],
            ],
            (val) => patchAndRefresh({ surfaceMode: val }, false)
          ),
          '默认“瓷釉零模糊”通过通透色阶 + 顶部高光模拟质感，不跑高斯模糊也不跑循环动画。'
        ),
        makeRow(
          '四角氛围光晕',
          makeSelect(
            String(cfg.ambienceEnabled),
            [
              ['true', '开启（静态渐变，零 GPU 负载）'],
              ['false', '关闭（极简纯色底）'],
            ],
            (val) => patchAndRefresh({ ambienceEnabled: val === 'true' }, false)
          )
        ),
      ]),
    ])

    // Tab 2: 艺术字体
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
            onClick: () => patchAndRefresh({ displayFont: preset.id }, true),
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

    const sizeValueSpan = el('span', { text: `${cfg.headlineSizePx}px`, style: 'min-width:42px;text-align:right;font-size:12.5px;' })
    const sizeRange = el('input', {
      type: 'range',
      min: 20,
      max: 42,
      value: cfg.headlineSizePx,
      style: 'flex:1;',
      onInput: (e) => {
        const val = Number(e.target.value)
        sizeValueSpan.textContent = `${val}px`
        patchAndRefresh({ headlineSizePx: val }, false)
      },
    })

    const tabFonts = el('div', { className: 'dsh-glaze-panel', hidden: activeTab !== 'fonts' }, [
      el('div', { className: 'dsh-glaze-section' }, [
        el('h3', { text: '标题与欢迎语艺术字体（作用于左上角软件名 & 首页主标语）' }),
        fontGrid,
        cfg.displayFont === 'custom'
          ? el('div', { style: 'margin-top:10px;' }, [
              makeRow('自定义字体名', makeTextInput(cfg.customDisplayFont, '如 "LXGW WenKai", "PingFang SC"', (v) => patchAndRefresh({ customDisplayFont: v }, false))),
            ])
          : null,
      ]),
      el('div', { className: 'dsh-glaze-section' }, [
        el('h3', { text: '字体特效与全局字体' }),
        makeRow(
          '欢迎语艺术样式',
          makeSelect(
            cfg.headlineStyle,
            [
              ['solid', '墨韵纯色（清晰锐利）'],
              ['gradient', '琉璃渐变（双色文字渐变）'],
              ['glow', '微光冷晕（静态淡影）'],
            ],
            (v) => patchAndRefresh({ headlineStyle: v }, false)
          )
        ),
        makeRow('欢迎语字号', el('div', { style: 'display:flex;align-items:center;gap:10px;flex:1;' }, [sizeRange, sizeValueSpan])),
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

    // Tab 3: 品牌与欢迎页（截图 ① & ②）
    const tabBrand = el('div', { className: 'dsh-glaze-panel', hidden: activeTab !== 'brand' }, [
      el('div', { className: 'dsh-glaze-section' }, [
        el('h3', { text: '① 左上角品牌栏（Sidebar Brand）' }),
        makeRow('软件主名称', makeTextInput(cfg.brandName, '如：砚台 Studio（留空恢复官方图标）', (v) => patchAndRefresh({ brandName: v }, false))),
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
          '设置自定义“软件主名称”后，自定义角标与隐藏角标会立即生效。'
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

    // Tab 4: 个人栏与备份（截图 ④）
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

    const tabsBar = el('div', { className: 'dsh-glaze-tabs', role: 'tablist' }, [
      ['palette', '配色与质感'],
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
    ))

    const modal = el('div', { className: 'dsh-glaze-modal', onClick: (e) => e.stopPropagation() }, [
      el('div', { className: 'dsh-glaze-modal__head' }, [
        el('div', { className: 'dsh-glaze-modal__title' }, [
          el('h2', { text: '瓷釉 Glaze · 主题与品牌定制' }),
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
      el('div', { className: 'dsh-glaze-modal__body' }, [tabPalette, tabFonts, tabBrand, tabAccount]),
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
    syncSwitcherVisuals,
    openModal,
    closeModal,
  }
}
