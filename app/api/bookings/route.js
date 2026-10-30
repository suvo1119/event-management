import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/store';

export async function GET() {
  try {
    const bookings = await dbStore.getBookings();
    return NextResponse.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const email = (body.email || body.user_email || '').trim().toLowerCase();
    const eventId = body.eventId || body.event_id;

    if (!email || !eventId) {
      return NextResponse.json(
        { success: false, error: 'A valid email and event ID are required.' },
        { status: 400 }
      );
    }

    const newBooking = await dbStore.createBooking(body);
    return NextResponse.json(
      {
        success: true,
        message: 'Ticket booked successfully! Please pay at Event Counter.',
        data: newBooking
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to book ticket' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('id');
    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: 'Booking ID is required' },
        { status: 400 }
      );
    }
    const deleted = await dbStore.deleteBooking(bookingId);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete booking' },
      { status: 500 }
    );
  }
}
