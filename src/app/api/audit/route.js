import { NextResponse } from 'next/server';
import { getAuditRecords, createAuditRecord } from '../../../lib/db.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('userEmail');

    if (!userEmail) {
      return NextResponse.json({ error: 'userEmail parameter is required' }, { status: 400 });
    }

    const records = getAuditRecords(userEmail);
    return NextResponse.json({ success: true, records });
  } catch (error) {
    console.error('GET /api/audit error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { userEmail, businessName, gstin, returnPeriod, returnType, taxableSalesPaise, taxLiabilityPaise, itcClaimedPaise, netPayablePaise, authorizedBy } = body;

    if (!userEmail) {
      return NextResponse.json({ error: 'userEmail is required' }, { status: 400 });
    }

    const records = createAuditRecord({
      userEmail,
      businessName,
      gstin,
      returnPeriod,
      returnType,
      taxableSalesPaise,
      taxLiabilityPaise,
      itcClaimedPaise,
      netPayablePaise,
      authorizedBy
    });

    return NextResponse.json({ success: true, records });
  } catch (error) {
    console.error('POST /api/audit error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

