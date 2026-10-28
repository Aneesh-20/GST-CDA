import { NextResponse } from 'next/server';
import { 
  getPurchaseInvoices, 
  createPurchaseInvoice, 
  updatePurchaseInvoice, 
  deletePurchaseInvoice, 
  bulkImportPurchases 
} from '../../../../lib/db.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('userEmail');

    if (!userEmail) {
      return NextResponse.json({ error: 'userEmail parameter is required' }, { status: 400 });
    }

    const purchases = getPurchaseInvoices(userEmail);
    return NextResponse.json({ success: true, purchases });
  } catch (error) {
    console.error('GET /api/invoices/purchases error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { userEmail, invoice, invoices } = body;

    if (!userEmail) {
      return NextResponse.json({ error: 'userEmail is required' }, { status: 400 });
    }

    let updatedPurchases;
    if (Array.isArray(invoices)) {
      updatedPurchases = bulkImportPurchases(userEmail, invoices);
    } else if (invoice) {
      updatedPurchases = createPurchaseInvoice(userEmail, invoice);
    } else {
      return NextResponse.json({ error: 'invoice or invoices array is required' }, { status: 400 });
    }

    return NextResponse.json({ success: true, purchases: updatedPurchases });
  } catch (error) {
    console.error('POST /api/invoices/purchases error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { userEmail, invoice } = body;

    if (!userEmail || !invoice || !invoice.id) {
      return NextResponse.json({ error: 'userEmail and invoice with id are required' }, { status: 400 });
    }

    const updatedPurchases = updatePurchaseInvoice(userEmail, invoice);
    return NextResponse.json({ success: true, purchases: updatedPurchases });
  } catch (error) {
    console.error('PUT /api/invoices/purchases error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('userEmail');
    const id = searchParams.get('id');

    if (!userEmail || !id) {
      return NextResponse.json({ error: 'userEmail and id parameters are required' }, { status: 400 });
    }

    const updatedPurchases = deletePurchaseInvoice(userEmail, id);
    return NextResponse.json({ success: true, purchases: updatedPurchases });
  } catch (error) {
    console.error('DELETE /api/invoices/purchases error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

