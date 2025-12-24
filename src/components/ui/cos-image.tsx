"use client";

import { useEffect, useState } from "react";

type CosImageProps = {
  src: string;
  alt: string;
  className?: string;
};

/**
 * COS Image component that automatically handles signed URLs for private buckets
 */
export function CosImage({ src, alt, className }: CosImageProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function getSignedUrl() {
      try {
        const response = await fetch(
          `/api/uploads/signed-url?url=${encodeURIComponent(src)}`
        );

        if (!response.ok) {
          throw new Error("Failed to get signed URL");
        }

        const data = await response.json();

        if (mounted) {
          setSignedUrl(data.signedUrl);
        }
      } catch (err) {
        console.error("Failed to load image:", err);
        if (mounted) {
          setError(true);
        }
      }
    }

    void getSignedUrl();

    return () => {
      mounted = false;
    };
  }, [src]);

  if (error) {
    return (
      <div className={`bg-slate-200 flex items-center justify-center ${className}`}>
        <span className="text-xs text-slate-500">加载失败</span>
      </div>
    );
  }

  if (!signedUrl) {
    return (
      <div className={`bg-slate-200 animate-pulse ${className}`} />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={signedUrl} alt={alt} className={className} />
  );
}
