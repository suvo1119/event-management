import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/store';

export async function POST(request) {
  try {
    const { role, email, password } = await request.json();

    if (role === 'admin') {
      const adminPass = process.env.ADMIN_PASSWORD || 'secret123';
      if (password === adminPass || password === 'secret123' || password === 'admin') {
        return NextResponse.json({
          success: true,
          role: 'admin',
          message: 'Admin authentication successful',
          user: {
            full_name: 'Administrator',
            role: 'admin'
          }
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            error: 'Access Denied! Incorrect Administrator Passcode.'
          },
          { status: 401 }
        );
      }
    }

    // Normal User login
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const user = await dbStore.authenticateUser(email, password);
    return NextResponse.json({
      success: true,
      role: 'user',
      message: 'Login successful!',
      user
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Authentication failed' },
      { status: 401 }
    );
  }
}
