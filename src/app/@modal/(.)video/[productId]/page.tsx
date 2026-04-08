import VideoModal from "@/components/video/VideoModal";
import { PRODUCT_VIDEO_IDS, type ProductVideoId } from "@/remotion/productVideoConfigs";

export default async function InterceptedVideoPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  if (!PRODUCT_VIDEO_IDS.includes(productId as ProductVideoId)) {
    return null;
  }

  return <VideoModal productId={productId as ProductVideoId} />;
}
