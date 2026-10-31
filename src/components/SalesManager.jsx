'use client';

import React, { useState } from 'react';
import { 
  PlusCircle, 
  UploadCloud, 
  Search, 
  Filter, 
  Download, 
  HelpCircle, 
  CheckCircle2, 
  FileSpreadsheet, 
  X, 
  Sparkles,
  ChevronRight,
  Receipt,
  FileText
} from 'lucide-react';
import { SAMPLE_SALES_SUMMARY, SAMPLE_SALES_TABLE } from '../lib/showcaseData.js';

export default function SalesManager({ onShowToast }) {
  const [salesList, setSalesList] = useState(SAMPLE_SALES_TABLE);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importStage, setImportStage] = useState(1); // 1: choose, 2: map, 3: summary

  // Form State for Add Sale Drawer
  const [saleForm, setSaleForm] = useState({
    customerName: '',
    customerGstin: '',
    invoiceNumber: `INV-2026-SEP-0${salesList.length + 1}`,
    date: '2026-09-28',
    supplyType: 'Intra-State',
    taxableRupees: '35000',
    ratePercent: 18,
    category: 'Handcrafted Decor',
  });

  const taxableNum = parseFloat(saleForm.taxableRupees) || 0;
  const gstCalculated = Math.round((taxableNum * (saleForm.ratePercent / 100)));
  const totalCalculated = taxableNum + gstCalculated;

  const filteredSales = salesList.filter(s => 
    s.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveSale = (isDraft = false) => {
    if (!saleForm.customerName.trim()) {
      alert('Please enter a customer or counter name.');
      return;
    }
    const newRecord = {
      id: saleForm.invoiceNumber,
      date: saleForm.date,
      customerName: saleForm.customerName,
      customerGstin: saleForm.customerGstin || 'Unregistered Consumer',
      placeOfSupply: saleForm.supplyType === 'Intra-State' ? 'Kerala (32)' : 'Out-of-State (IGST)',
      supplyType: saleForm.supplyType,
      taxableRupees: taxableNum,
      ratePercent: saleForm.ratePercent,
      gstPaise: gstCalculated,
      totalRupees: totalCalculated,
      status: isDraft ? 'Draft' : 'Ready',
      category: saleForm.category,
    };
    setSalesList([newRecord, ...salesList]);
    setIsAddDrawerOpen(false);
    onShowToast(`✅ Sale invoice ${newRecord.id} recorded successfully (Sample).`);
  };

  const handleCompleteImport = () => {
    setIsImportModalOpen(false);
    setImportStage(1);
    onShowToast('🎉 Successfully imported 124 sales records from spreadsheet (Sample).');
  };

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', width: '100%', paddingBottom: 64 }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 className="font-editorial" style={{ fontSize: '2.4rem', fontWeight: 500, color: '#0B132B', margin: 0 }}>
              My Sales
            </h1>
            <span style={{ fontSize: '0.74rem', padding: '3px 8px', borderRadius: 9999, backgroundColor: '#FEF7EC', color: '#B45309', fontWeight: 700 }}>
              Secondary label: GSTR-1 Outward Register
            </span>
          </div>
          <p style={{ fontSize: '0.96rem', color: '#596579', marginTop: 6 }}>
            Add the sales your business makes. We’ll help organise them for your GST report with zero math errors.
          </p>
        </div>

        {/* Action CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            onClick={() => {
              setImportStage(1);
              setIsImportModalOpen(true);
            }}
            style={{
              padding: '10px 18px',
              fontSize: '0.86rem',
              fontWeight: 600,
              color: '#0B132B',
              backgroundColor: '#FFFFFF',
              border: '1px solid #DCD5C9',
              borderRadius: 12,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.15s ease'
            }}
          >
            <UploadCloud style={{ width: 16, height: 16, color: '#596579' }} />
            <span>Import Excel or CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddDrawerOpen(true)}
            style={{
              padding: '10px 20px',
              fontSize: '0.86rem',
              fontWeight: 700,
              color: '#FFFFFF',
              backgroundColor: '#0D6258',
              border: '1px solid #084039',
              borderRadius: 12,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 14px rgba(13, 98, 88, 0.22)'
            }}
          >
            <PlusCircle style={{ width: 16, height: 16 }} />
            <span>Add a sale</span>
          </button>
        </div>
      </div>

      {/* Summary Chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ padding: '8px 16px', backgroundColor: '#FFFFFF', borderRadius: 12, border: '1px solid #EAE5DC', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.78rem', color: '#596579' }}>Recorded Invoices:</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0B132B' }}>124 records</span>
        </div>

        <div style={{ padding: '8px 16px', backgroundColor: '#FFFFFF', borderRadius: 12, border: '1px solid #EAE5DC', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.78rem', color: '#596579' }}>Taxable Sales (Sample):</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0E7051' }}>₹ 8.42 Lakhs</span>
        </div>

        <div style={{ padding: '8px 16px', backgroundColor: '#FFFFFF', borderRadius: 12, border: '1px solid #EAE5DC', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.78rem', color: '#596579' }}>Output GST Collected:</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0D6258' }}>₹ 1,51,560 (Sample)</span>
        </div>

        <div style={{ padding: '8px 16px', backgroundColor: '#FEF7EC', borderRadius: 12, border: '1px solid #F7E1B8', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.78rem', color: '#B45309' }}>Drafts:</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#B45309' }}>3 saved</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div style={{ 
        backgroundColor: '#FFFFFF', 
        borderRadius: 18, 
        border: '1px solid #EAE5DC', 
        padding: '16px 20px', 
        boxShadow: '0 2px 8px rgba(11, 19, 43, 0.03)',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, maxWidth: 420 }}>
          <Search style={{ width: 17, height: 17, color: '#8D99AE' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer name, GSTIN, or invoice number..."
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontSize: '0.86rem',
              color: '#0B132B',
              backgroundColor: 'transparent'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.8rem', color: '#596579' }}>
          <span>Period: September 2026 (Demo)</span>
        </div>
      </div>

      {/* Data Table */}
      <div style={{ 
        backgroundColor: '#FFFFFF', 
        borderRadius: 18, 
        border: '1px solid #EAE5DC', 
        boxShadow: '0 4px 16px rgba(11, 19, 43, 0.04)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#FAF8F5', borderBottom: '1px solid #EAE5DC', color: '#596579', fontWeight: 700, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <th style={{ padding: '14px 20px' }}>Invoice No.</th>
              <th style={{ padding: '14px 16px' }}>Date</th>
              <th style={{ padding: '14px 16px' }}>Customer / Buyer</th>
              <th style={{ padding: '14px 16px' }}>Place of Supply</th>
              <th style={{ padding: '14px 16px', textAlign: 'right' }}>Taxable Value</th>
              <th style={{ padding: '14px 16px', textAlign: 'right' }}>GST Tax</th>
              <th style={{ padding: '14px 16px', textAlign: 'right' }}>Total (INR)</th>
              <th style={{ padding: '14px 20px', textAlign: 'center' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.map((s, idx) => (
              <tr 
                key={s.id} 
                style={{ 
                  borderBottom: idx === filteredSales.length - 1 ? 'none' : '1px solid #F5F1EA',
                  transition: 'background-color 0.1s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAF8F5'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
              >
                <td style={{ padding: '14px 20px', fontWeight: 700, color: '#0B132B', fontFamily: 'monospace' }}>
                  {s.id}
                </td>
                <td style={{ padding: '14px 16px', color: '#596579' }}>
                  {s.date}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 700, color: '#0B132B' }}>{s.customerName}</div>
                  <div style={{ fontSize: '0.7rem', color: '#8D99AE', fontFamily: 'monospace' }}>{s.customerGstin}</div>
                </td>
                <td style={{ padding: '14px 16px', color: '#596579' }}>
                  {s.placeOfSupply}
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600, color: '#0B132B' }}>
                  ₹ {s.taxableRupees.toLocaleString('en-IN')}
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right', color: '#0D6258', fontWeight: 600 }}>
                  ₹ {s.gstPaise.toLocaleString('en-IN')} ({s.ratePercent}%)
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, color: '#0B132B' }}>
                  ₹ {s.totalRupees.toLocaleString('en-IN')}
                </td>
                <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                  <span style={{ 
                    padding: '3px 10px', 
                    borderRadius: 9999, 
                    fontSize: '0.72rem', 
                    fontWeight: 700,
                    backgroundColor: s.status === 'Ready' ? '#ECFDF5' : '#FEF7EC',
                    color: s.status === 'Ready' ? '#0E7051' : '#B45309'
                  }}>
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ======================================================== */}
      {/* RIGHT-SIDE SLIDE-OVER DRAWER: "ADD A SALE"               */}
      {/* ======================================================== */}
      {isAddDrawerOpen && (
        <div className="drawer-overlay" onClick={() => setIsAddDrawerOpen(false)}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()} style={{ padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #EAE5DC', paddingBottom: 16 }}>
              <div>
                <h3 className="font-editorial" style={{ fontSize: '1.6rem', fontWeight: 500, color: '#0B132B', margin: 0 }}>
                  Add a sale
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#596579', margin: '2px 0 0 0' }}>
                  Record an invoice issued to a client or walk-in customer.
                </p>
              </div>
              <button 
                onClick={() => setIsAddDrawerOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8D99AE' }}
              >
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 22, flex: 1 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0B132B', marginBottom: 6 }}>
                  Customer Name / Store Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Malabar Craft Studio or Counter Sales"
                  value={saleForm.customerName}
                  onChange={(e) => setSaleForm({ ...saleForm, customerName: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #DCD5C9', backgroundColor: '#FAF8F5', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0B132B', marginBottom: 6 }}>
                  Customer GSTIN (Leave empty if unregistered retail buyer)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 32AABCM1122P1Z4"
                  value={saleForm.customerGstin}
                  onChange={(e) => setSaleForm({ ...saleForm, customerGstin: e.target.value.toUpperCase() })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #DCD5C9', backgroundColor: '#FAF8F5', outline: 'none', fontFamily: 'monospace' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0B132B', marginBottom: 6 }}>
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    value={saleForm.invoiceNumber}
                    onChange={(e) => setSaleForm({ ...saleForm, invoiceNumber: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #DCD5C9', backgroundColor: '#FAF8F5', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0B132B', marginBottom: 6 }}>
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    value={saleForm.date}
                    onChange={(e) => setSaleForm({ ...saleForm, date: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #DCD5C9', backgroundColor: '#FAF8F5', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0B132B', marginBottom: 6 }}>
                    Taxable Value (₹) *
                  </label>
                  <input
                    type="number"
                    value={saleForm.taxableRupees}
                    onChange={(e) => setSaleForm({ ...saleForm, taxableRupees: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #DCD5C9', backgroundColor: '#FAF8F5', outline: 'none', fontWeight: 700 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0B132B', marginBottom: 6 }}>
                    GST Tax Rate (%)
                  </label>
                  <select
                    value={saleForm.ratePercent}
                    onChange={(e) => setSaleForm({ ...saleForm, ratePercent: parseInt(e.target.value, 10) })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #DCD5C9', backgroundColor: '#FAF8F5', outline: 'none', fontWeight: 700 }}
                  >
                    <option value="5">5% (Handlooms / Crafts)</option>
                    <option value="12">12% (Apparel / Furnishings)</option>
                    <option value="18">18% (Standard MSME Rate)</option>
                    <option value="28">28% (Luxury / Metal Art)</option>
                  </select>
                </div>
              </div>

              {/* LIVE SAMPLE TAX PREVIEW BOX */}
              <div style={{ 
                padding: '16px 20px', 
                backgroundColor: '#FAF8F5', 
                borderRadius: 14, 
                border: '1px solid #B2DDD7',
                marginTop: 6 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800, color: '#0D6258' }}>
                    Live Sample Tax Preview
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#8D99AE' }}>Zero rounding drift</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', color: '#596579', marginBottom: 4 }}>
                  <span>CGST (9%) + SGST (9%):</span>
                  <span style={{ fontWeight: 700, color: '#0B132B' }}>₹ {gstCalculated.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 800, color: '#0D6258', borderTop: '1px dashed #DCD5C9', paddingTop: 8, marginTop: 8 }}>
                  <span>Invoice Total:</span>
                  <span>₹ {totalCalculated.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#8D99AE', marginTop: 6, fontStyle: 'italic' }}>
                  * Sample calculation for this demonstration.
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', gap: 12, borderTop: '1px solid #EAE5DC', paddingTop: 20, marginTop: 24 }}>
              <button
                type="button"
                onClick={() => handleSaveSale(true)}
                style={{ flex: 1, padding: '12px', fontSize: '0.88rem', fontWeight: 600, color: '#596579', backgroundColor: '#FFFFFF', border: '1px solid #DCD5C9', borderRadius: 12, cursor: 'pointer' }}
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => handleSaveSale(false)}
                style={{ flex: 1, padding: '12px', fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', backgroundColor: '#0D6258', border: 'none', borderRadius: 12, cursor: 'pointer', boxShadow: '0 4px 14px rgba(13, 98, 88, 0.25)' }}
              >
                Record Sale
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3-STAGE MODAL: "IMPORT EXCEL OR CSV"                     */}
      {/* ======================================================== */}
      {isImportModalOpen && (
        <div className="drawer-overlay" style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <div style={{ width: '100%', maxWidth: 640, backgroundColor: '#FFFFFF', borderRadius: 22, padding: 32, boxShadow: '0 25px 60px rgba(11, 19, 43, 0.25)', border: '1px solid #EAE5DC' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #EAE5DC', paddingBottom: 16 }}>
              <div>
                <h3 className="font-editorial" style={{ fontSize: '1.5rem', fontWeight: 500, color: '#0B132B', margin: 0 }}>
                  Import Spreadsheet (3-Step Wizard)
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#596579', marginTop: 2 }}>
                  Stage {importStage} of 3: {importStage === 1 ? 'Select File' : importStage === 2 ? 'Map Columns' : 'Summary & Validation'}
                </div>
              </div>
              <button onClick={() => setIsImportModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8D99AE' }}>
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            {/* STAGE 1: Choose File */}
            {importStage === 1 && (
              <div style={{ padding: '24px 0' }}>
                <div style={{ 
                  border: '2px dashed #0D6258', 
                  borderRadius: 16, 
                  padding: '36px 20px', 
                  textAlign: 'center', 
                  backgroundColor: '#EEF8F6',
                  cursor: 'pointer'
                }}>
                  <FileSpreadsheet style={{ width: 44, height: 44, color: '#0D6258', margin: '0 auto 12px' }} />
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0B132B' }}>
                    sales_register_september_2026.xlsx
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#596579', marginTop: 4 }}>
                    Simulated spreadsheet detected (124 rows, 7 columns)
                  </div>
                  <div style={{ marginTop: 14, fontSize: '0.74rem', color: '#0E7051', fontWeight: 700 }}>
                    ✓ Standard GST format recognised
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
                  <button
                    type="button"
                    onClick={() => setImportStage(2)}
                    style={{ padding: '10px 24px', fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', backgroundColor: '#0D6258', border: 'none', borderRadius: 10, cursor: 'pointer' }}
                  >
                    Next: Review Columns
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 2: Review Columns */}
            {importStage === 2 && (
              <div style={{ padding: '20px 0' }}>
                <div style={{ fontSize: '0.82rem', color: '#596579', marginBottom: 14 }}>
                  Confirm how spreadsheet columns correspond to standard GST fields:
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, backgroundColor: '#FAF8F5', padding: 16, borderRadius: 14, border: '1px solid #EAE5DC' }}>
                  {[
                    { fileCol: 'Inv_No', mapsTo: 'Invoice Number' },
                    { fileCol: 'Customer_Trade_Name', mapsTo: 'Buyer Name' },
                    { fileCol: 'GST_Number', mapsTo: 'Buyer GSTIN' },
                    { fileCol: 'Net_Amount', mapsTo: 'Taxable Value' },
                    { fileCol: 'Tax_Rate_Pct', mapsTo: 'GST Rate (%)' },
                  ].map(m => (
                    <div key={m.fileCol} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                      <span style={{ fontFamily: 'monospace', color: '#596579', fontWeight: 700 }}>{m.fileCol}</span>
                      <ChevronRight style={{ width: 14, height: 14, color: '#8D99AE' }} />
                      <span style={{ fontWeight: 800, color: '#0D6258' }}>{m.mapsTo}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
                  <button
                    type="button"
                    onClick={() => setImportStage(1)}
                    style={{ padding: '10px 18px', fontSize: '0.84rem', fontWeight: 600, color: '#596579', background: 'none', border: '1px solid #DCD5C9', borderRadius: 10, cursor: 'pointer' }}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setImportStage(3)}
                    style={{ padding: '10px 24px', fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', backgroundColor: '#0D6258', border: 'none', borderRadius: 10, cursor: 'pointer' }}
                  >
                    Next: Validate Summary
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 3: Import Summary */}
            {importStage === 3 && (
              <div style={{ padding: '20px 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
                  <div style={{ padding: 14, backgroundColor: '#ECFDF5', borderRadius: 12, border: '1px solid #A7F3D0', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0E7051' }}>124</div>
                    <div style={{ fontSize: '0.72rem', color: '#0E7051', fontWeight: 600 }}>Valid Records</div>
                  </div>
                  <div style={{ padding: 14, backgroundColor: '#FAF8F5', borderRadius: 12, border: '1px solid #EAE5DC', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#596579' }}>0</div>
                    <div style={{ fontSize: '0.72rem', color: '#596579', fontWeight: 600 }}>Duplicates</div>
                  </div>
                  <div style={{ padding: 14, backgroundColor: '#FEF7EC', borderRadius: 12, border: '1px solid #F7E1B8', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#B45309' }}>2</div>
                    <div style={{ fontSize: '0.72rem', color: '#B45309', fontWeight: 600 }}>Retail / B2C</div>
                  </div>
                </div>

                <div style={{ padding: 12, backgroundColor: '#EEF8F6', borderRadius: 12, fontSize: '0.78rem', color: '#0D6258', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 style={{ width: 16, height: 16, color: '#0E7051' }} />
                  <span>All records verified with zero floating-point calculation drift.</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
                  <button
                    type="button"
                    onClick={() => setImportStage(2)}
                    style={{ padding: '10px 18px', fontSize: '0.84rem', fontWeight: 600, color: '#596579', background: 'none', border: '1px solid #DCD5C9', borderRadius: 10, cursor: 'pointer' }}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleCompleteImport}
                    style={{ padding: '10px 24px', fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', backgroundColor: '#0D6258', border: 'none', borderRadius: 10, cursor: 'pointer', boxShadow: '0 4px 14px rgba(13, 98, 88, 0.25)' }}
                  >
                    Confirm & Load 124 Sales
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
