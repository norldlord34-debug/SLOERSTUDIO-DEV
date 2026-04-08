import path from "node:path";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import {
  PRODUCT_VIDEO_CONFIGS,
  PRODUCT_VIDEO_IDS,
  type ProductVideoId,
} from "../src/remotion/productVideoConfigs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const entryPoint = path.join(projectRoot, "src", "remotion", "index.ts");
const outputDirectory = path.join(projectRoot, "public", "marketing-videos");

function isProductVideoId(value: string): value is ProductVideoId {
  return PRODUCT_VIDEO_IDS.includes(value as ProductVideoId);
}

async function renderProductVideo(serveUrl: string, productId: ProductVideoId) {
  const config = PRODUCT_VIDEO_CONFIGS[productId];
  const outputLocation = path.join(outputDirectory, `${productId}.mp4`);
  const inputProps = { productId };

  console.log(`\n▶ Rendering ${config.name} → ${outputLocation}`);

  const composition = await selectComposition({
    serveUrl,
    id: config.compositionId,
    inputProps,
  });

  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    outputLocation,
    inputProps,
    overwrite: true,
  });

  console.log(`✅ Finished ${config.name}`);
}

async function main() {
  const requestedId = process.argv[2];
  const selectedProductId = requestedId && isProductVideoId(requestedId) ? requestedId : null;

  if (requestedId && !isProductVideoId(requestedId)) {
    throw new Error(`Unknown product id: ${requestedId}. Valid options: ${PRODUCT_VIDEO_IDS.join(", ")}`);
  }

  await mkdir(outputDirectory, { recursive: true });

  console.log("Bundling Remotion project...");

  const serveUrl = await bundle({
    entryPoint,
    ignoreRegisterRootWarning: true,
  });

  const targets: ProductVideoId[] = selectedProductId ? [selectedProductId] : [...PRODUCT_VIDEO_IDS];

  for (const productId of targets) {
    await renderProductVideo(serveUrl, productId);
  }

  console.log(`\n🎬 Marketing video render complete. Files available in: ${outputDirectory}`);
}

main().catch((error) => {
  console.error("❌ Failed to render product marketing videos.");
  console.error(error);
  process.exit(1);
});
