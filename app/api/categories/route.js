import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/store';

export async function GET() {
  try {
    const categories = await dbStore.getCategories();
    return NextResponse.json({
      success: true,
      data: categories
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
