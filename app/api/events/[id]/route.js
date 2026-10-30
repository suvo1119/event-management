import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/store';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const event = await dbStore.getEventById(id);
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const deleted = await dbStore.deleteEvent(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Event not found or already deleted' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete event' },
      { status: 500 }
    );
  }
}
