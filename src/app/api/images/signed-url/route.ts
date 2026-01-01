import { NextResponse } from "next/server";
import { getStaticFileSignedUrl } from "@/lib/cos";

export const runtime = "nodejs";

/**
 * GET /api/images/signed-url
 * Generate a signed URL for a private COS image (PUBLIC - no auth required)
 *
 * This endpoint is public and intended for displaying product images on the website.
 * For security, signed URLs have a short expiration time.
 *
 * Query params:
 *   - url: The full COS URL or just the key
 *   - expires: Optional expiration time in seconds (default: 1800 = 30 minutes)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    const expiresParam = searchParams.get("expires");

    if (!url) {
      return NextResponse.json(
        { error: "Missing 'url' parameter" },
        { status: 400 }
      );
    }

    // Extract key from URL if it's a full COS URL
    const key = extractKeyFromUrl(url) || url;

    // Default expiration: 30 minutes (shorter than admin's 1 hour for security)
    const expires = expiresParam ? parseInt(expiresParam, 10) : 1800;

    // Limit max expiration to 2 hours
    const finalExpires = Math.min(expires, 7200);

    // Generate signed URL
    const signedUrl = await getStaticFileSignedUrl(key, finalExpires);

    return NextResponse.json({
      signedUrl,
      key,
      expiresIn: finalExpires,
    });
  } catch (e: unknown) {
    console.error("Failed to generate signed URL:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to generate signed URL" },
      { status: 500 }
    );
  }
}

/**
 * Extract the object key from a COS public URL
 */
function extractKeyFromUrl(url: string): string | null {
  try {
    const match = url.match(/\.cos\.[^/]+\.myqcloud\.com\/(.+)$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}
