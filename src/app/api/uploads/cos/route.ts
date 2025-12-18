import { uploadToCos } from '@/lib/cos';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { key, url } = await uploadToCos({
      buffer,
      filename: file.name ?? 'upload',
      contentType: file.type || undefined,
    });

    return NextResponse.json({ key, url });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? 'Upload failed' },
      { status: 500 }
    );
  }
}
