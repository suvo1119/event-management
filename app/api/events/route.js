import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/store';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword') || '';
    const category_id = searchParams.get('category_id') || '';
    const date = searchParams.get('date') || '';

    const events = await dbStore.getEvents({ keyword, category_id, date });
    return NextResponse.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, start_date, category_id } = body;

    if (!title || !start_date || !category_id) {
      return NextResponse.json(
        { success: false, error: 'Title, date, and category are required.' },
        { status: 400 }
      );
    }

    const newEvent = await dbStore.createEvent(body);
    return NextResponse.json(
      {
        success: true,
        message: 'Event published successfully!',
        data: newEvent
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create event' },
      { status: 500 }
    );
  }
}
