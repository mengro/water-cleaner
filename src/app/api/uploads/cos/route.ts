import { uploadStaticFile } from "@/lib/cos";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return await handleCosFileUpload(request);
}

async function handleCosFileUpload(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const contentType = file.type || "";
    const maxBytes = Number(process.env.UPLOAD_MAX_BYTES ?? 10 * 1024 * 1024);

    if (!contentType.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image uploads are allowed" },
        { status: 415 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    if (arrayBuffer.byteLength > maxBytes) {
      return NextResponse.json(
        { error: `File too large (max ${maxBytes} bytes)` },
        { status: 413 }
      );
    }

    const buffer = Buffer.from(arrayBuffer);

    const { key, url } = await uploadStaticFile({
      buffer,
      filename: file.name ?? "upload",
      contentType: contentType || undefined,
    });

    return NextResponse.json({
      key,
      url,
      contentType,
      bytes: buffer.byteLength,
    });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e?.message : "Upload failed" },
      { status: 500 }
    );
  }
}
