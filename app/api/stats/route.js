import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/store';

export async function GET() {
  try {
    const stats = await dbStore.getStats();
    return NextResponse.json({
      success: true,
      data: stats
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch dashboard metrics' },
      { status: 500 }
    );
  }
}
