import { NextResponse } from 'next/server';
import { 
  getSalesInvoices, 
  createSalesInvoice, 
  updateSalesInvoice, 
  deleteSalesInvoice, 
  bulkImportSales 
} from '../../../../lib/db.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('userEmail');

    if (!userEmail) {
      return NextResponse.json({ error: 'userEmail parameter is required' }, { status: 400 });
    }

    const sales = getSalesInvoices(userEmail);
    return NextResponse.json({ success: true, sales });
  } catch (error) {
    console.error('GET /api/invoices/sales error:', error);
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

    let updatedSales;
    if (Array.isArray(invoices)) {
      updatedSales = bulkImportSales(userEmail, invoices);
    } else if (invoice) {
      updatedSales = createSalesInvoice(userEmail, invoice);
    } else {
      return NextResponse.json({ error: 'invoice or invoices array is required' }, { status: 400 });
    }

    return NextResponse.json({ success: true, sales: updatedSales });
  } catch (error) {
    console.error('POST /api/invoices/sales error:', error);
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

    const updatedSales = updateSalesInvoice(userEmail, invoice);
    return NextResponse.json({ success: true, sales: updatedSales });
  } catch (error) {
    console.error('PUT /api/invoices/sales error:', error);
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

    const updatedSales = deleteSalesInvoice(userEmail, id);
    return NextResponse.json({ success: true, sales: updatedSales });
  } catch (error) {
    console.error('DELETE /api/invoices/sales error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

