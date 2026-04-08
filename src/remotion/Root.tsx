import { Composition } from "remotion";
import { ProductMarketingVideo } from "./PremiumProductMarketingVideo";
import {
  PRODUCT_VIDEO_CONFIGS,
  PRODUCT_VIDEO_IDS,
  VIDEO_DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "./productVideoConfigs";

export function RemotionRoot() {
  return (
    <>
      {PRODUCT_VIDEO_IDS.map((productId) => {
        const config = PRODUCT_VIDEO_CONFIGS[productId];

        return (
          <Composition
            key={config.compositionId}
            id={config.compositionId}
            component={ProductMarketingVideo}
            durationInFrames={VIDEO_DURATION_IN_FRAMES}
            fps={VIDEO_FPS}
            width={VIDEO_WIDTH}
            height={VIDEO_HEIGHT}
            defaultProps={{ productId }}
          />
        );
      })}
    </>
  );
}

export default RemotionRoot;
