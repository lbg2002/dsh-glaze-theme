import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'

export const PACKAGE_ID = 'dsh-glaze-theme'
export const CONFIG_ROUTE = '/__glaze/config'
export const MAX_BODY_BYTES = 524288

/**
 * Resolve the persistent configuration file path under DSH_HOME.
 * @returns {string} Absolute path to glaze-theme.json.
 */
export function resolveConfigPath() {
  const dshHome = process.env.DSH_HOME && process.env.DSH_HOME.trim()
    ? process.env.DSH_HOME.trim()
    : path.join(os.homedir(), '.dsh')
  return path.join(dshHome, 'glaze-theme.json')
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload)
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  })
  res.end(body)
}

function readPersistedConfig(configPath) {
  try {
    const raw = readFileSync(configPath, 'utf8')
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed
    }
    return null
  } catch (err) {
    if (err && err.code === 'ENOENT') return null
    throw err
  }
}

function writePersistedConfig(configPath, config) {
  const dir = path.dirname(configPath)
  mkdirSync(dir, { recursive: true })
  const tmpPath = `${configPath}.tmp-${process.pid}`
  writeFileSync(tmpPath, `${JSON.stringify(config, null, 2)}\n`, {
    encoding: 'utf8',
    mode: 0o600,
  })
  renameSync(tmpPath, configPath)
}

function isSameOrigin(req) {
  const origin = req.headers?.origin
  if (!origin) return true
  const host = req.headers?.host
  if (!host) return false
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let total = 0
    const chunks = []
    let settled = false

    const fail = (status, message) => {
      if (settled) return
      settled = true
      const error = new Error(message)
      error.status = status
      reject(error)
    }

    req.on('data', (chunk) => {
      if (settled) return
      total += chunk.length
      if (total > MAX_BODY_BYTES) {
        fail(413, 'Payload too large')
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      if (settled) return
      settled = true
      try {
        const text = Buffer.concat(chunks).toString('utf8')
        const data = JSON.parse(text)
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
          const error = new Error('Config must be a JSON object')
          error.status = 400
          reject(error)
          return
        }
        resolve(data)
      } catch {
        const error = new Error('Invalid JSON payload')
        error.status = 400
        reject(error)
      }
    })
    req.on('error', (err) => fail(400, err?.message || 'Request error'))
  })
}

/**
 * Create the HTTP handler for `/__glaze/config`.
 * @param {() => string} [getConfigPath] - Optional config path resolver for testing.
 * @returns {(req: import('node:http').IncomingMessage, res: import('node:http').ServerResponse) => Promise<void>}
 */
export function createConfigHandler(getConfigPath = resolveConfigPath) {
  return async (req, res) => {
    const method = (req.method || 'GET').toUpperCase()
    const configPath = getConfigPath()

    if (method === 'HEAD') {
      res.writeHead(200, {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store',
      })
      res.end()
      return
    }

    if (method === 'GET') {
      try {
        const config = readPersistedConfig(configPath)
        sendJson(res, 200, { ok: true, config })
      } catch (err) {
        sendJson(res, 500, { ok: false, error: err?.message || 'Read failed' })
      }
      return
    }

    if (method === 'POST') {
      if (!isSameOrigin(req)) {
        sendJson(res, 403, { ok: false, error: 'Cross-origin request rejected' })
        return
      }
      try {
        const body = await readJsonBody(req)
        const config = body && typeof body.config === 'object' && !Array.isArray(body.config) && body.config !== null
          ? body.config
          : body
        writePersistedConfig(configPath, config)
        sendJson(res, 200, { ok: true })
      } catch (err) {
        const status = err?.status || 500
        sendJson(res, status, { ok: false, error: err?.message || 'Save failed' })
      }
      return
    }

    res.writeHead(405, { allow: 'GET, HEAD, POST' })
    res.end()
  }
}

/**
 * Cordis server plugin entry. Never throws synchronously and avoids top-level `inject`
 * so environments without `webServer` (e.g. Desktop main) still activate cleanly.
 * @param {any} ctx - Cordis plugin context.
 */
export function apply(ctx) {
  try {
    if (!ctx || typeof ctx.inject !== 'function') return
    ctx.inject(['webServer'], (subCtx) => {
      try {
        const handler = createConfigHandler()
        const route = { kind: 'exact', path: CONFIG_ROUTE, handler }
        if (typeof subCtx.effect === 'function') {
          subCtx.effect(() => subCtx.webServer.register(route), `${PACKAGE_ID}:config-route`)
        } else if (subCtx.webServer && typeof subCtx.webServer.register === 'function') {
          subCtx.webServer.register(route)
        }
      } catch (err) {
        ctx.logger?.warn?.(`[${PACKAGE_ID}] config route registration failed: ${err?.message || err}`)
      }
    })
  } catch {
    // Must never throw synchronously during Cordis boot.
  }
}
