import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const profile = process.argv[2] || 'web'
const dshHome = process.env.DSH_HOME?.trim() || path.join(os.homedir(), '.dsh')
const profileDir = path.join(dshHome, 'profiles', profile)
const pkgPath = path.join(profileDir, 'package.json')

console.log(`Installing dsh-glaze-theme into DSH profile "${profile}" (${profileDir})...`)

execFileSync('dsh', ['plugin', '--profile', profile, 'add', root], {
  stdio: 'inherit',
})

if (existsSync(pkgPath)) {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
  pkg.dsh = pkg.dsh || {}
  pkg.dsh.profile = pkg.dsh.profile || {}
  const bundles = Array.isArray(pkg.dsh.profile.bundles) ? pkg.dsh.profile.bundles : []
  if (!bundles.includes('dsh-glaze-theme')) {
    bundles.push('dsh-glaze-theme')
    pkg.dsh.profile.bundles = bundles
    writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8')
    console.log(`Added "dsh-glaze-theme" to ${pkgPath} -> dsh.profile.bundles`)
  } else {
    console.log(`"dsh-glaze-theme" is already listed in dsh.profile.bundles`)
  }
}

console.log('Done! Restart DeepSeek Harness (e.g. `systemctl --user restart dsh.service`) to load the plugin.')
