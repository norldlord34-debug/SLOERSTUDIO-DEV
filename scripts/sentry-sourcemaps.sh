#!/usr/bin/env bash
# Upload source maps to Sentry after `next build`.
# Required env vars: SENTRY_AUTH_TOKEN, SENTRY_ORG, SENTRY_PROJECT
# Usage: bash scripts/sentry-sourcemaps.sh

set -euo pipefail

VERSION="${SENTRY_RELEASE:-$(git rev-parse --short HEAD)}"

echo "▸ Creating Sentry release ${VERSION}..."
npx @sentry/cli releases new "$VERSION"

echo "▸ Uploading source maps..."
npx @sentry/cli sourcemaps upload \
  --release="$VERSION" \
  --url-prefix="~/_next" \
  .next/static

echo "▸ Finalizing release..."
npx @sentry/cli releases finalize "$VERSION"

echo "▸ Cleaning source maps from build output..."
find .next/static -name "*.map" -delete

echo "✓ Done"
