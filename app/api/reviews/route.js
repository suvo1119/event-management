import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/store';

export async function GET() {
  try {
    const reviews = await dbStore.getReviews();
    const reviewsArray = Array.isArray(reviews) ? reviews : [];
    return NextResponse.json({
      success: true,
      count: reviewsArray.length,
      data: reviewsArray
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch reviews', data: [] },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { event_id, user_email, rating, comment } = await request.json();
    if (!event_id || !user_email || !rating) {
      return NextResponse.json(
        { success: false, error: 'Event, email, and rating are required.' },
        { status: 400 }
      );
    }
    const newRev = await dbStore.createReview({
      event_id,
      user_email,
      rating,
      comment
    });
    return NextResponse.json(
      {
        success: true,
        message: 'Review submitted successfully!',
        data: newRev
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit review' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('id');
    if (!reviewId) {
      return NextResponse.json(
        { success: false, error: 'Review ID is required' },
        { status: 400 }
      );
    }
    const deleted = await dbStore.deleteReview(reviewId);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete review' },
      { status: 500 }
    );
  }
}
