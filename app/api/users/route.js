import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/store';

export async function GET() {
  try {
    const rawUsers = await dbStore.getUsers();
    const usersArray = Array.isArray(rawUsers) ? rawUsers : [];
    const users = usersArray.map((u) => ({
      user_id: u.user_id,
      full_name: u.full_name,
      email: u.email,
      registered_at: u.registered_at
    }));
    return NextResponse.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch users', data: [] },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }
    const deleted = await dbStore.deleteUser(userId);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: 'User removed successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete user' },
      { status: 500 }
    );
  }
}
