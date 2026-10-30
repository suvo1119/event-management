import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/store';

export async function POST(request) {
  try {
    const { full_name, email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Full name, email, and password are required.' },
        { status: 400 }
      );
    }

    const newUser = await dbStore.registerUser({ full_name, email, password });
    return NextResponse.json(
      {
        success: true,
        message: 'Account registered successfully! Please log in.',
        user: newUser
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Registration failed' },
      { status: 400 }
    );
  }
}
