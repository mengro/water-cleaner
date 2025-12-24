import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getStaticFileSignedUrl } from "@/lib/cos";

export const runtime = "nodejs";

/**
 * GET /api/uploads/signed-url
 * Generate a signed URL for a private COS object
 * 
 * Query params:
 *   - url: The full COS URL or just the key
 *   - expires: Optional expiration time in seconds (default: 3600)
 */
export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    // Default expiration: 1 hour
    const expires = expiresParam ? parseInt(expiresParam, 10) : 3600;

    // Generate signed URL
    const signedUrl = await getStaticFileSignedUrl(key, expires);

    return NextResponse.json({
      signedUrl,
      key,
      expiresIn: expires,
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
