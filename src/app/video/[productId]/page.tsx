import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PRODUCT_VIDEO_CONFIGS, PRODUCT_VIDEO_IDS, type ProductVideoId } from "@/remotion/productVideoConfigs";
import VideoPlayerClient from "@/components/video/VideoPlayerClient";
import Link from "next/link";

export function generateStaticParams() {
  return PRODUCT_VIDEO_IDS.map((id) => ({ productId: id }));
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://sloerstudio.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ productId: string }>;
}): Promise<Metadata> {
  const { productId } = await params;

  if (!PRODUCT_VIDEO_IDS.includes(productId as ProductVideoId)) {
    return { title: "Video not found — SloerStudio" };
  }

  const config = PRODUCT_VIDEO_CONFIGS[productId as ProductVideoId];
  const title = config.webTitle;
  const description = config.webDescription;
  const url = `${BASE_URL}/video/${productId}`;

  return {
    title,
    description,
    keywords: [
      ...config.webHighlights,
      config.name,
      "SloerStudio",
      "AI video generation",
      "AI video generator",
      "AI product marketing video",
      "cinematic AI video",
      "text-to-video SaaS",
      "Sora alternative",
      "Runway alternative",
      "AI creative infrastructure",
      "controllable AI workflows",
      "code-driven video production",
      "programmatic video generation",
      "AI video rendering engine",
      "developer tools 2026",
    ],
    openGraph: {
      type: "video.other",
      title,
      description,
      url,
      siteName: "SloerStudio",
      locale: "en_US",
      videos: [
        {
          url: `${BASE_URL}/marketing-videos/${productId}.mp4`,
          width: 1280,
          height: 720,
          type: "video/mp4",
        },
      ],
      images: [
        {
          url: `${BASE_URL}/marketing-videos/${productId}.mp4`,
          width: 1280,
          height: 720,
          alt: `${config.name} — ${config.headline} | AI-generated product video`,
        },
      ],
    },
    twitter: {
      card: "player",
      title: `${config.name} — ${config.headline}`,
      description,
      site: "@sloerstudio",
      creator: "@sloerstudio",
      images: [`${BASE_URL}/marketing-videos/${productId}.mp4`],
    },
    alternates: {
      canonical: url,
    },
    other: {
      "video:duration": "30",
      "video:tag": config.webHighlights.join(", "),
    },
  };
}

export default async function VideoPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  if (!PRODUCT_VIDEO_IDS.includes(productId as ProductVideoId)) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-gray-400">Video not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const config = PRODUCT_VIDEO_CONFIGS[productId as ProductVideoId];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: config.webTitle,
    description: config.webDescription,
    thumbnailUrl: `${BASE_URL}/marketing-videos/${productId}.mp4`,
    uploadDate: "2026-03-31T00:00:00Z",
    duration: "PT30S",
    contentUrl: `${BASE_URL}/marketing-videos/${productId}.mp4`,
    embedUrl: `${BASE_URL}/video/${productId}`,
    publisher: {
      "@type": "Organization",
      name: "SloerStudio",
      url: BASE_URL,
    },
    potentialAction: {
      "@type": "WatchAction",
      target: `${BASE_URL}/video/${productId}`,
    },
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 pb-20 pt-10" role="main">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
            aria-label="Back to home"
          >
            ← Back
          </Link>
        </div>
        <section aria-label={`${config.name} product video`}>
          <VideoPlayerClient productId={productId as ProductVideoId} />
        </section>
        <div className="mt-8">
          <h1 className="font-display text-4xl font-bold tracking-[-0.04em] text-white">{config.name}</h1>
          <p className="mt-3 text-lg text-gray-300">{config.headline}</p>
          <p className="mt-2 text-sm uppercase tracking-[0.24em] text-gray-500">{config.runtimeLabel}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {config.webHighlights.map((highlight) => (
              <span key={highlight} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-gray-300">
                {highlight}
              </span>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
