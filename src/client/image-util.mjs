/**
 * Compress uploaded avatar/brand images client-side into lightweight <= 128x128 DataURLs
 * so configs stay fast in localStorage and under the server JSON size cap.
 */

export function compressImageFile(file, maxSize = 128) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file selected'))
      return
    }
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.onload = () => {
      const dataUrl = String(reader.result || '')
      if (file.type === 'image/svg+xml' && dataUrl.length <= 120000) {
        resolve(dataUrl)
        return
      }
      const img = new Image()
      img.onerror = () => reject(new Error('Invalid image file'))
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width || maxSize, img.height || maxSize))
        const w = Math.max(1, Math.round((img.width || maxSize) * scale))
        const h = Math.max(1, Math.round((img.height || maxSize) * scale))
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(dataUrl)
          return
        }
        ctx.drawImage(img, 0, 0, w, h)
        let out = canvas.toDataURL('image/webp', 0.86)
        if (!out.startsWith('data:image/webp')) {
          out = canvas.toDataURL('image/png')
        }
        resolve(out)
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  })
}

export function pickTextColorForHex(hex) {
  const m = /^#([0-9a-fA-F]{6})$/.exec((hex || '').trim())
  if (!m) return ''
  const v = parseInt(m[1], 16)
  const toLin = (c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  const r = toLin((v >> 16) & 255)
  const g = toLin((v >> 8) & 255)
  const b = toLin(v & 255)
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
  const contrastWhite = 1.05 / (lum + 0.05)
  const contrastDark = (lum + 0.05) / 0.06
  return contrastWhite >= contrastDark ? '#ffffff' : '#14171c'
}
