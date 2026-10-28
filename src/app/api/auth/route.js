import { NextResponse } from 'next/server';
import { findOrCreateUser, getSalesInvoices, getPurchaseInvoices } from '../../../lib/db.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name, role, businessName } = body;

    if (!email && !name) {
      return NextResponse.json({ error: 'Email or name is required' }, { status: 400 });
    }

    const { user, business } = findOrCreateUser(email || `${name.toLowerCase()}@user.in`, name, role || 'OWNER', businessName);
    const sales = getSalesInvoices(user.email);
    const purchases = getPurchaseInvoices(user.email);

    return NextResponse.json({
      success: true,
      user,
      business,
      sales,
      purchases
    });
  } catch (error) {
    console.error('API /auth error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

