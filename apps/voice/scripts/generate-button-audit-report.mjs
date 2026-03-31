import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const auditPath = path.join(projectRoot, 'src', 'audit', 'button-audit.json')
const artifactsDir = path.join(projectRoot, 'artifacts', 'button-audit')
const resultsPath = path.join(artifactsDir, 'results.json')
const outputPath = path.join(projectRoot, 'html', 'button-audit-report.html')

const loadJson = async (targetPath, fallback) => {
  try {
    const raw = await fs.readFile(targetPath, 'utf8')
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

const fileExists = async (targetPath) => {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

const toPosix = (value) => value.split(path.sep).join('/')

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;')

const getScreenshotCell = async (relativePath, label) => {
  const absolutePath = path.join(projectRoot, relativePath)
  const exists = await fileExists(absolutePath)

  if (!exists) {
    return `<div class="shot shot--missing"><span>${escapeHtml(label)}</span><small>Captura pendiente</small></div>`
  }

  return `<a class="shot" href="../${toPosix(relativePath)}" target="_blank" rel="noreferrer"><img src="../${toPosix(relativePath)}" alt="${escapeHtml(label)}" loading="lazy" /></a>`
}

const render = async () => {
  const auditItems = await loadJson(auditPath, [])
  const resultItems = await loadJson(resultsPath, {})

  const merged = await Promise.all(auditItems.map(async (item) => {
    const result = resultItems[item.id] ?? {}
    return {
      ...item,
      latencyMs: result.latencyMs ?? null,
      latencyPass: typeof result.latencyMs === 'number' ? result.latencyMs <= item.latencyBudgetMs : null,
      a11y: result.a11y ?? 'pending',
      keyboard: result.keyboard ?? 'pending',
      click: result.click ?? 'pending',
      doubleClick: result.doubleClick ?? 'pending',
      beforeShotHtml: await getScreenshotCell(item.beforeScreenshot, `${item.label} before`),
      afterShotHtml: await getScreenshotCell(item.afterScreenshot, `${item.label} after`)
    }
  }))

  const bySurface = merged.reduce((acc, item) => {
    acc[item.surface] = acc[item.surface] ?? []
    acc[item.surface].push(item)
    return acc
  }, {})

  const total = merged.length
  const measuredLatency = merged.filter(item => typeof item.latencyMs === 'number')
  const latencyPass = measuredLatency.filter(item => item.latencyPass).length
  const pendingScreens = merged.filter(item => item.beforeShotHtml.includes('Captura pendiente') || item.afterShotHtml.includes('Captura pendiente')).length

  const summaryCards = [
    { label: 'Controles auditados', value: total },
    { label: 'Latencia medida', value: measuredLatency.length },
    { label: 'Latencia OK', value: latencyPass },
    { label: 'Capturas pendientes', value: pendingScreens }
  ].map(card => `
    <article class="summary-card">
      <span>${escapeHtml(card.label)}</span>
      <strong>${escapeHtml(card.value)}</strong>
    </article>
  `).join('')

  const surfaceSections = await Promise.all(Object.entries(bySurface).map(async ([surface, items]) => {
    const rows = items.map(item => `
      <tr>
        <td><code>${escapeHtml(item.id)}</code></td>
        <td>${escapeHtml(item.label)}</td>
        <td>${escapeHtml(item.normalState)}</td>
        <td>${escapeHtml(item.hoverState)}</td>
        <td>${escapeHtml(item.disabledState)}</td>
        <td>${escapeHtml(item.action)}</td>
        <td>${escapeHtml(item.expectedResult)}</td>
        <td>${item.shortcut ? escapeHtml(item.shortcut) : '—'}</td>
        <td>${typeof item.latencyMs === 'number' ? `${item.latencyMs.toFixed(1)} ms` : 'pendiente'}</td>
        <td><span class="status status--${item.latencyPass === null ? 'pending' : item.latencyPass ? 'ok' : 'error'}">${item.latencyPass === null ? 'Pendiente' : item.latencyPass ? 'OK' : 'Fuera de SLA'}</span></td>
        <td><span class="status status--${escapeHtml(item.click)}">${escapeHtml(item.click)}</span></td>
        <td><span class="status status--${escapeHtml(item.doubleClick)}">${escapeHtml(item.doubleClick)}</span></td>
        <td><span class="status status--${escapeHtml(item.keyboard)}">${escapeHtml(item.keyboard)}</span></td>
        <td><span class="status status--${escapeHtml(item.a11y)}">${escapeHtml(item.a11y)}</span></td>
        <td>${item.beforeShotHtml}</td>
        <td>${item.afterShotHtml}</td>
      </tr>
    `).join('')

    return `
      <section class="surface-section">
        <div class="surface-header">
          <h2>${escapeHtml(surface.toUpperCase())}</h2>
          <span>${items.length} controles</span>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Texto</th>
                <th>Estado normal</th>
                <th>Estado hover</th>
                <th>Estado disabled</th>
                <th>Acción</th>
                <th>Resultado esperado</th>
                <th>Atajo</th>
                <th>Latencia</th>
                <th>SLA</th>
                <th>Click</th>
                <th>Doble click</th>
                <th>Teclado</th>
                <th>WCAG 2.2</th>
                <th>Antes</th>
                <th>Después</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      </section>
    `
  }))

  const html = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SIULK Button Audit Report</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: #050816;
        --panel: rgba(15, 23, 42, 0.82);
        --panel-strong: rgba(15, 23, 42, 0.95);
        --border: rgba(148, 163, 184, 0.16);
        --text: #e2e8f0;
        --text-soft: #94a3b8;
        --accent: #7c3aed;
        --accent-soft: rgba(124, 58, 237, 0.14);
        --ok: #22c55e;
        --warn: #eab308;
        --error: #ef4444;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Inter, system-ui, sans-serif;
        background: radial-gradient(circle at top, rgba(124, 58, 237, 0.18), transparent 30%), var(--bg);
        color: var(--text);
      }
      .page {
        max-width: 1680px;
        margin: 0 auto;
        padding: 40px 24px 72px;
      }
      .hero {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 24px;
        margin-bottom: 28px;
      }
      .hero h1 {
        margin: 0 0 8px;
        font-size: 2.2rem;
      }
      .hero p {
        margin: 0;
        color: var(--text-soft);
        max-width: 760px;
      }
      .summary-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 16px;
        margin-bottom: 28px;
      }
      .summary-card,
      .surface-section {
        border: 1px solid var(--border);
        background: var(--panel);
        backdrop-filter: blur(16px);
        border-radius: 20px;
      }
      .summary-card {
        padding: 18px 20px;
      }
      .summary-card span {
        display: block;
        color: var(--text-soft);
        margin-bottom: 10px;
      }
      .summary-card strong {
        font-size: 1.8rem;
      }
      .surface-section {
        padding: 20px;
        margin-bottom: 20px;
      }
      .surface-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        margin-bottom: 14px;
      }
      .surface-header h2 {
        margin: 0;
        font-size: 1.05rem;
        letter-spacing: 0.12em;
      }
      .surface-header span {
        color: var(--text-soft);
      }
      .table-wrap {
        overflow-x: auto;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        min-width: 1520px;
      }
      th,
      td {
        padding: 12px 10px;
        border-bottom: 1px solid rgba(148, 163, 184, 0.08);
        vertical-align: top;
        text-align: left;
        font-size: 0.9rem;
      }
      th {
        position: sticky;
        top: 0;
        background: var(--panel-strong);
        color: var(--text-soft);
        z-index: 1;
      }
      code {
        display: inline-flex;
        padding: 4px 8px;
        border-radius: 999px;
        background: rgba(15, 23, 42, 0.88);
        border: 1px solid var(--border);
        color: #c4b5fd;
      }
      .status {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 92px;
        padding: 6px 10px;
        border-radius: 999px;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        border: 1px solid transparent;
      }
      .status--ok,
      .status--passed,
      .status--pass {
        color: #86efac;
        background: rgba(34, 197, 94, 0.14);
        border-color: rgba(34, 197, 94, 0.25);
      }
      .status--error,
      .status--failed,
      .status--fail {
        color: #fca5a5;
        background: rgba(239, 68, 68, 0.14);
        border-color: rgba(239, 68, 68, 0.25);
      }
      .status--pending {
        color: #fde68a;
        background: rgba(234, 179, 8, 0.14);
        border-color: rgba(234, 179, 8, 0.25);
      }
      .shot,
      .shot--missing {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 180px;
        min-height: 108px;
        border-radius: 16px;
        overflow: hidden;
        border: 1px solid var(--border);
        background: rgba(15, 23, 42, 0.7);
        text-decoration: none;
      }
      .shot img {
        display: block;
        width: 100%;
        height: 108px;
        object-fit: cover;
      }
      .shot--missing span {
        font-weight: 600;
        margin-bottom: 4px;
      }
      .shot--missing small {
        color: var(--text-soft);
      }
    </style>
  </head>
  <body>
    <div class="page">
      <header class="hero">
        <div>
          <h1>SIULK Button Audit Report</h1>
          <p>Inventario funcional de controles interactivos, estados visuales, accesibilidad, capturas antes/después y cumplimiento de latencia para desktop, widget, tray y landing.</p>
        </div>
        <div>
          <p><strong>Generado:</strong> ${new Date().toLocaleString('es-ES')}</p>
          <p><strong>Fuente:</strong> src/audit/button-audit.json</p>
        </div>
      </header>
      <section class="summary-grid">${summaryCards}</section>
      ${surfaceSections.join('')}
    </div>
  </body>
</html>`

  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await fs.writeFile(outputPath, html, 'utf8')
  console.log(`Button audit report written to ${outputPath}`)
}

render().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
