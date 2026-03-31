import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const tauriConfigPath = path.join(projectRoot, 'src-tauri', 'tauri.conf.json')
const tauriReleaseDir = path.join(projectRoot, 'src-tauri', 'target', 'release')
const bundleDir = path.join(tauriReleaseDir, 'bundle')
const releaseDir = path.join(projectRoot, 'release', 'windows')

const fileExists = async (targetPath) => {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

const sanitizeName = (value) => String(value)
  .replace(/[<>:"/\\|?*\x00-\x1F]/g, '-')
  .trim()

const pickLatestFile = async (directory, extension) => {
  if (!(await fileExists(directory))) {
    return null
  }

  const entries = await fs.readdir(directory, { withFileTypes: true })
  const candidates = await Promise.all(
    entries
      .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(extension))
      .map(async (entry) => {
        const absolutePath = path.join(directory, entry.name)
        const stats = await fs.stat(absolutePath)
        return { absolutePath, stats }
      })
  )

  if (candidates.length === 0) {
    return null
  }

  candidates.sort((left, right) => right.stats.mtimeMs - left.stats.mtimeMs)
  return candidates[0].absolutePath
}

const copyArtifact = async (sourcePath, fileName) => {
  const destinationPath = path.join(releaseDir, fileName)
  await fs.copyFile(sourcePath, destinationPath)
  return destinationPath
}

const main = async () => {
  const tauriConfig = JSON.parse(await fs.readFile(tauriConfigPath, 'utf8'))
  const productName = sanitizeName(tauriConfig.productName ?? 'SIULK-VOICE')
  const portableExePath = path.join(tauriReleaseDir, 'app.exe')

  if (!(await fileExists(portableExePath))) {
    throw new Error(`No se encontró ${portableExePath}. Ejecuta primero npm run tauri:build.`)
  }

  const nsisInstallerPath = await pickLatestFile(path.join(bundleDir, 'nsis'), '.exe')
  const msiInstallerPath = await pickLatestFile(path.join(bundleDir, 'msi'), '.msi')

  await fs.mkdir(releaseDir, { recursive: true })

  const copiedFiles = [
    await copyArtifact(portableExePath, `${productName}-portable.exe`),
  ]

  if (nsisInstallerPath) {
    copiedFiles.push(await copyArtifact(nsisInstallerPath, `${productName}-setup.exe`))
  }

  if (msiInstallerPath) {
    copiedFiles.push(await copyArtifact(msiInstallerPath, `${productName}.msi`))
  }

  console.log(`Windows release preparada en ${releaseDir}`)
  copiedFiles.forEach((targetPath) => {
    console.log(targetPath)
  })
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
