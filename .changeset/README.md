# SloerStudio — Changesets

Changesets permite versionar y hacer releases de cada app **de forma independiente**.

## Cómo funciona

### 1. Cuando haces un cambio importante

```bash
# Desde la raíz del monorepo
npx changeset
```

Esto te preguntará:
- ¿Qué paquete/app cambiaste? (`@sloerstudio/web`, `@sloerstudio/desktop`, `@sloerstudio/voice`)
- ¿Qué tipo de cambio? (`major` = breaking, `minor` = feature, `patch` = bugfix)
- Describe el cambio en una línea

Esto crea un archivo en `.changeset/` que debes commitear con tu PR.

### 2. En el PR / merge a main

El GitHub Action `changeset-release.yml` detecta los archivos `.changeset/` y crea automáticamente un **Release PR** con:
- Los `CHANGELOG.md` de cada app actualizados
- Las versiones de `package.json` bumpeadas

### 3. Cuando apruebes el Release PR

El Action hace `npm publish` (o el release que configures) y limpia los archivos changeset.

---

## Releases independientes por app

| App | Tag de release | Workflow |
|-----|---------------|---------|
| `@sloerstudio/web` | auto (Vercel deploy) | `ci-web.yml` |
| `@sloerstudio/desktop` | `v1.2.0-desktop` | `release-desktop.yml` |
| `@sloerstudio/voice` | `v1.2.0-voice` | `release-voice.yml` |

## Comandos útiles

```bash
npx changeset          # Crear un nuevo changeset
npx changeset version  # Aplicar changesets → bump versions + CHANGELOG
npx changeset status   # Ver qué cambios están pendientes de release
```
