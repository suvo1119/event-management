import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/store';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'User email is required' },
        { status: 400 }
      );
    }
    const bookings = await dbStore.getBookingsByUser(email);
    const bookingsArray = Array.isArray(bookings) ? bookings : [];
    return NextResponse.json({
      success: true,
      count: bookingsArray.length,
      data: bookingsArray
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch user bookings', data: [] },
      { status: 500 }
    );
  }
}
