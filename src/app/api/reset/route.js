import { NextResponse } from 'next/server';
import { resetUserData, clearUserRecords } from '../../../lib/db.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userEmail, action } = body;

    if (!userEmail) {
      return NextResponse.json({ error: 'userEmail is required' }, { status: 400 });
    }

    if (action === 'clear-all') {
      const result = clearUserRecords(userEmail);
      return NextResponse.json({ success: true, ...result });
    } else {
      const result = resetUserData(userEmail);
      return NextResponse.json({ success: true, ...result });
    }
  } catch (error) {
    console.error('POST /api/reset error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

