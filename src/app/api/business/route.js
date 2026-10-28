import { NextResponse } from 'next/server';
import { getBusinessForUser, updateBusinessForUser } from '../../../lib/db.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('userEmail');

    if (!userEmail) {
      return NextResponse.json({ error: 'userEmail parameter is required' }, { status: 400 });
    }

    const business = getBusinessForUser(userEmail);
    return NextResponse.json({ success: true, business });
  } catch (error) {
    console.error('GET /api/business error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { userEmail, business } = body;

    if (!userEmail || !business) {
      return NextResponse.json({ error: 'userEmail and business data are required' }, { status: 400 });
    }

    const updated = updateBusinessForUser(userEmail, business);
    return NextResponse.json({ success: true, business: updated });
  } catch (error) {
    console.error('PUT /api/business error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

