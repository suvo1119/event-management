import { NextResponse } from 'next/server';
import { uploadAndCompressImage } from '@/lib/imagekit';

export async function POST(request) {
  try {
    const body = await request.json();
    const { file, fileName } = body;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No image file provided for upload.' },
        { status: 400 }
      );
    }

    const result = await uploadAndCompressImage(file, fileName || 'festival-banner');

    return NextResponse.json({
      success: true,
      url: result.url,
      source: result.source,
      message: result.message || 'Image uploaded and compressed for showcase'
    });
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}
