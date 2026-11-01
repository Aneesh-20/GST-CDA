'use client';

import React, { useState, useRef } from 'react';
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
  FileText,
  Trash2,
  FileCheck,
  FileCode
} from 'lucide-react';
import { SAMPLE_SALES_TABLE } from '../lib/showcaseData.js';
import { parseCsvText, getSalesCsvTemplate, triggerBrowserDownload } from '../lib/realtimeData.js';

export default function SalesManager({ 
  salesList = [], 
  setSalesList, 
  onShowToast 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importStage, setImportStage] = useState(1); // 1: choose, 2: map, 3: summary
  const [pendingParsedRows, setPendingParsedRows] = useState([]);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isPdfScanning, setIsPdfScanning] = useState(false);

  const fileInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  // Form State for Add Sale Drawer (Clean Slate, No Pre-filled Dummy Data)
  const [saleForm, setSaleForm] = useState({
    customerName: '',
    customerGstin: '',
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    supplyType: 'Intra-State',
    taxableRupees: '',
    ratePercent: 18,
    category: '',
  });

  const taxableNum = parseFloat(saleForm.taxableRupees) || 0;
  const gstCalculated = Math.round(taxableNum * (saleForm.ratePercent / 100));
  const totalCalculated = taxableNum + gstCalculated;

  const filteredSales = salesList.filter(s => 
    (s.customerName && s.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (s.id && s.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (s.customerGstin && s.customerGstin.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalTaxable = salesList.reduce((acc, s) => acc + (s.taxableRupees || 0), 0);
  const totalGst = salesList.reduce((acc, s) => acc + (s.gstPaise || 0), 0);

  const handleSaveSale = (isDraft = false) => {
    if (!saleForm.customerName.trim()) {
      alert('Please enter a customer or counter name.');
      return;
    }
    const invId = saleForm.invoiceNumber.trim() || `INV-${Date.now().toString().slice(-5)}`;
    const newRecord = {
      id: invId,
      date: saleForm.date,
      customerName: saleForm.customerName,
      customerGstin: saleForm.customerGstin || 'Unregistered Consumer',
      placeOfSupply: saleForm.supplyType === 'Intra-State' ? 'Intra-State (32)' : 'Inter-State (IGST)',
      supplyType: saleForm.supplyType,
      taxableRupees: taxableNum,
      ratePercent: saleForm.ratePercent,
      gstPaise: gstCalculated,
      totalRupees: totalCalculated,
      status: isDraft ? 'Draft' : 'Ready',
      category: saleForm.category || 'General Sales',
    };
    if (setSalesList) {
      setSalesList([newRecord, ...salesList]);
    }
    setIsAddDrawerOpen(false);
    onShowToast(`✅ Sale invoice ${newRecord.id} recorded successfully.`);
  };

  const handleDeleteSale = (id) => {
    if (setSalesList) {
      setSalesList(salesList.filter(s => s.id !== id));
      onShowToast(`🗑️ Deleted sale invoice ${id}.`);
    }
  };

  const handleClearAll = () => {
    if (confirm('Clear all sales records from this workspace to start completely fresh?')) {
      if (setSalesList) setSalesList([]);
      onShowToast('✨ Cleared all sales records. Ready for your real data.');
    }
  };

  // Real CSV File Upload Handler
  const handleCsvFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const parsed = parseCsvText(text);
        if (parsed.length === 0) {
          alert('Could not detect valid invoice rows in this CSV. Please check formatting or download our template.');
          return;
        }
        setPendingParsedRows(parsed);
        setImportStage(2);
        setIsImportModalOpen(true);
      } catch (err) {
        alert('Error reading CSV file: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Real PDF Invoice Upload Handler
  const handlePdfFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsPdfScanning(true);
    onShowToast(`📄 Scanning PDF invoice "${file.name}" with AI parser...`);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('ownStateCode', '32');

      const res = await fetch('/api/invoices/parse-pdf', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!data.success || !data.invoice) {
        throw new Error(data.error || 'Failed to extract invoice data');
      }

      const inv = data.invoice;
      const parsedTaxable = Math.round(Number(inv.taxablePaise || 0) / 100);
      const parsedGst = Math.round((Number(inv.cgstPaise || 0) + Number(inv.sgstPaise || 0) + Number(inv.igstPaise || 0)) / 100);
      const parsedTotal = Math.round(Number(inv.totalPaise || 0) / 100);

      const newRecord = {
        id: inv.invoiceNumber || `PDF-${Date.now().toString().slice(-4)}`,
        date: inv.date || new Date().toISOString().split('T')[0],
        customerName: inv.partyName || 'Extracted Customer',
        customerGstin: inv.partyGstin || 'Unregistered',
        placeOfSupply: inv.supplyType === 'INTRA' ? 'Intra-State' : 'Inter-State (IGST)',
        supplyType: inv.supplyType === 'INTRA' ? 'Intra-State' : 'Inter-State (IGST)',
        taxableRupees: parsedTaxable,
        ratePercent: inv.ratePercent || 18,
        gstPaise: parsedGst,
        totalRupees: parsedTotal,
        status: 'Ready',
        category: 'PDF Import',
      };

      if (setSalesList) {
        setSalesList([newRecord, ...salesList]);
      }
      onShowToast(`🎉 Successfully parsed PDF: ${newRecord.id} (₹ ${newRecord.totalRupees.toLocaleString('en-IN')}) added to Sales!`);
    } catch (err) {
      console.error(err);
      onShowToast(`⚠️ Could not parse PDF: ${err.message}. Try adding manually or uploading CSV.`);
    } finally {
      setIsPdfScanning(false);
      e.target.value = '';
    }
  };

  const handleDownloadTemplate = () => {
    const template = getSalesCsvTemplate();
    triggerBrowserDownload('GST_Sales_Template.csv', template);
    onShowToast('📥 Downloaded GST Sales CSV Template.');
  };

  const handleCompleteImport = () => {
    if (pendingParsedRows.length > 0 && setSalesList) {
      setSalesList([...pendingParsedRows, ...salesList]);
      onShowToast(`🎉 Successfully imported ${pendingParsedRows.length} real sales records.`);
    }
    setIsImportModalOpen(false);
    setImportStage(1);
    setPendingParsedRows([]);
  };

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', width: '100%', paddingBottom: 64 }}>
      
      {/* Hidden File Inputs */}
      <input 
        type="file" 
        ref={fileInputRef} 
        accept=".csv,.txt" 
        style={{ display: 'none' }} 
        onChange={handleCsvFileSelect} 
      />
      <input 
        type="file" 
        ref={pdfInputRef} 
        accept=".pdf" 
        style={{ display: 'none' }} 
        onChange={handlePdfFileSelect} 
      />

      {/* Header Banner */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 className="font-editorial" style={{ fontSize: '2.4rem', fontWeight: 500, color: '#0B132B', margin: 0 }}>
              My Sales
            </h1>
            <span style={{ fontSize: '0.74rem', padding: '3px 8px', borderRadius: 9999, backgroundColor: '#EEF8F6', color: '#0D6258', fontWeight: 700 }}>
              GSTR-1 Outward Register
            </span>
          </div>
          <p style={{ fontSize: '0.96rem', color: '#596579', marginTop: 6 }}>
            Input and manage your outward sales invoices. Upload spreadsheets (CSV/Excel), scan PDF invoices, or record manual bills.
          </p>
        </div>

        {/* Action CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          
          <button
            type="button"
            onClick={handleDownloadTemplate}
            title="Download blank sample CSV formatted with standard GST columns"
            style={{
              padding: '9px 14px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#0D6258',
              backgroundColor: '#EEF8F6',
              border: '1px solid #B2DDD7',
              borderRadius: 10,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <FileCode style={{ width: 14, height: 14 }} />
            <span>CSV Template</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: '9px 16px',
              fontSize: '0.84rem',
              fontWeight: 600,
              color: '#0B132B',
              backgroundColor: '#FFFFFF',
              border: '1px solid #DCD5C9',
              borderRadius: 10,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <UploadCloud style={{ width: 15, height: 15, color: '#0D6258' }} />
            <span>Upload CSV / Excel</span>
          </button>

          <button
            type="button"
            onClick={() => pdfInputRef.current?.click()}
            disabled={isPdfScanning}
            style={{
              padding: '9px 16px',
              fontSize: '0.84rem',
              fontWeight: 600,
              color: '#0B132B',
              backgroundColor: '#FFFFFF',
              border: '1px solid #DCD5C9',
              borderRadius: 10,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <FileText style={{ width: 15, height: 15, color: '#C87D0E' }} />
            <span>{isPdfScanning ? 'Scanning PDF...' : 'Scan PDF Invoice'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddDrawerOpen(true)}
            style={{
              padding: '9px 18px',
              fontSize: '0.86rem',
              fontWeight: 700,
              color: '#FFFFFF',
              backgroundColor: '#0D6258',
              border: 'none',
              borderRadius: 10,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 4px 12px rgba(13, 98, 88, 0.22)'
            }}
          >
            <PlusCircle style={{ width: 16, height: 16 }} />
            <span>Add a sale</span>
          </button>

          {salesList.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              title="Clear all records to start empty"
              style={{
                padding: '9px 10px',
                fontSize: '0.8rem',
                color: '#DC2626',
                backgroundColor: 'transparent',
                border: '1px solid #FECACA',
                borderRadius: 10,
                cursor: 'pointer'
              }}
            >
              <Trash2 style={{ width: 14, height: 14 }} />
            </button>
          )}

        </div>
      </div>

      {/* Summary Facts Chips */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        <div style={{ padding: '14px 18px', backgroundColor: '#FFFFFF', borderRadius: 14, border: '1px solid #EAE5DC' }}>
          <div style={{ fontSize: '0.74rem', color: '#8D99AE', fontWeight: 600 }}>Total Sales Records</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0B132B', marginTop: 2 }}>{salesList.length}</div>
          <div style={{ fontSize: '0.7rem', color: '#0E7051', fontWeight: 600 }}>Active outward register</div>
        </div>

        <div style={{ padding: '14px 18px', backgroundColor: '#FFFFFF', borderRadius: 14, border: '1px solid #EAE5DC' }}>
          <div style={{ fontSize: '0.74rem', color: '#8D99AE', fontWeight: 600 }}>Total Taxable Turnover</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0B132B', marginTop: 2 }}>
            ₹ {totalTaxable.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#596579' }}>Excluding GST</div>
        </div>

        <div style={{ padding: '14px 18px', backgroundColor: '#FFFFFF', borderRadius: 14, border: '1px solid #EAE5DC' }}>
          <div style={{ fontSize: '0.74rem', color: '#8D99AE', fontWeight: 600 }}>Output GST Collected</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0D6258', marginTop: 2 }}>
            ₹ {totalGst.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#0D6258' }}>CGST + SGST + IGST</div>
        </div>

        <div style={{ padding: '14px 18px', backgroundColor: '#FFFFFF', borderRadius: 14, border: '1px solid #EAE5DC' }}>
          <div style={{ fontSize: '0.74rem', color: '#8D99AE', fontWeight: 600 }}>Calculation Engine</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0E7051', marginTop: 4 }}>Zero Drift</div>
          <div style={{ fontSize: '0.7rem', color: '#596579' }}>Integer minor units (Paise)</div>
        </div>
      </div>

      {/* Main Table Container */}
      <div style={{ 
        backgroundColor: '#FFFFFF', 
        borderRadius: 20, 
        border: '1px solid #EAE5DC', 
        boxShadow: '0 2px 10px rgba(11, 19, 43, 0.03)',
        overflow: 'hidden'
      }}>
        {/* Table Filter Bar */}
        <div style={{ 
          padding: '16px 20px', 
          borderBottom: '1px solid #EAE5DC', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          backgroundColor: '#FAF8F5',
          flexWrap: 'wrap',
          gap: 12
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8, 
            backgroundColor: '#FFFFFF', 
            border: '1px solid #DCD5C9', 
            borderRadius: 10, 
            padding: '6px 12px',
            width: 300
          }}>
            <Search style={{ width: 14, height: 14, color: '#8D99AE' }} />
            <input 
              type="text"
              placeholder="Search by customer, invoice #, GSTIN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                fontSize: '0.82rem',
                color: '#0B132B',
                width: '100%'
              }}
            />
          </div>

          <div style={{ fontSize: '0.78rem', color: '#596579' }}>
            Showing <strong>{filteredSales.length}</strong> of {salesList.length} sales
          </div>
        </div>

        {/* Sales Table / Empty State */}
        {filteredSales.length === 0 ? (
          <div style={{ padding: '64px 20px', textAlign: 'center' }}>
            <div style={{ width: 54, height: 54, borderRadius: 16, backgroundColor: '#EEF8F6', color: '#0D6258', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Receipt style={{ width: 28, height: 28 }} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B132B', margin: '0 0 8px 0' }}>
              {salesList.length === 0 ? 'No Sales Invoices Yet' : 'No matching sales found'}
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#596579', maxWidth: 460, margin: '0 auto 24px', lineHeight: 1.5 }}>
              {salesList.length === 0 
                ? 'Your outward sales register is empty. Upload your sales spreadsheet (CSV/Excel), scan a PDF invoice, or add your first sale manually.'
                : 'Try adjusting your search query.'}
            </p>
            {salesList.length === 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ padding: '10px 20px', fontSize: '0.86rem', fontWeight: 700, color: '#0B132B', backgroundColor: '#FAF8F5', border: '1px solid #DCD5C9', borderRadius: 10, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <UploadCloud style={{ width: 16, height: 16, color: '#0D6258' }} />
                  <span>Upload CSV / Excel</span>
                </button>

                <button
                  type="button"
                  onClick={() => pdfInputRef.current?.click()}
                  style={{ padding: '10px 20px', fontSize: '0.86rem', fontWeight: 700, color: '#0B132B', backgroundColor: '#FAF8F5', border: '1px solid #DCD5C9', borderRadius: 10, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <FileText style={{ width: 16, height: 16, color: '#C87D0E' }} />
                  <span>Scan PDF Invoice</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAddDrawerOpen(true)}
                  style={{ padding: '10px 20px', fontSize: '0.86rem', fontWeight: 700, color: '#FFFFFF', backgroundColor: '#0D6258', border: 'none', borderRadius: 10, cursor: 'pointer' }}
                >
                  + Add First Sale
                </button>
              </div>
            )}
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF8F5', borderBottom: '1px solid #EAE5DC', color: '#596579', fontWeight: 700, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '14px 20px' }}>Invoice ID</th>
                <th style={{ padding: '14px 16px' }}>Date</th>
                <th style={{ padding: '14px 16px' }}>Customer / Party</th>
                <th style={{ padding: '14px 16px' }}>Place of Supply</th>
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>Taxable Value</th>
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>GST ({saleForm.ratePercent}%)</th>
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>Total</th>
                <th style={{ padding: '14px 16px', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale, idx) => (
                <tr 
                  key={sale.id + idx}
                  style={{ 
                    borderBottom: idx === filteredSales.length - 1 ? 'none' : '1px solid #FAF8F5',
                    transition: 'background-color 0.12s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FCFAF7'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '14px 20px', fontWeight: 700, color: '#0B132B', fontFamily: 'monospace' }}>
                    {sale.id}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#596579' }}>
                    {sale.date}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 700, color: '#0B132B' }}>{sale.customerName}</div>
                    <div style={{ fontSize: '0.7rem', color: '#8D99AE', fontFamily: 'monospace' }}>
                      {sale.customerGstin}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#596579' }}>
                    <span style={{ fontSize: '0.76rem', color: '#0D6258', backgroundColor: '#EEF8F6', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
                      {sale.placeOfSupply}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600, color: '#0B132B' }}>
                    ₹ {(sale.taxableRupees || 0).toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', color: '#0D6258', fontWeight: 600 }}>
                    ₹ {(sale.gstPaise || 0).toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, color: '#0B132B' }}>
                    ₹ {(sale.totalRupees || 0).toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <span style={{ 
                      padding: '3px 10px', 
                      borderRadius: 9999, 
                      fontSize: '0.72rem', 
                      fontWeight: 700,
                      backgroundColor: sale.status === 'Draft' ? '#FEF7EC' : '#ECFDF5',
                      color: sale.status === 'Draft' ? '#B45309' : '#0E7051'
                    }}>
                      {sale.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => handleDeleteSale(sale.id)}
                      title="Delete invoice"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8D99AE', padding: 4 }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#DC2626'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#8D99AE'}
                    >
                      <Trash2 style={{ width: 14, height: 14 }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ======================================================== */}
      {/* DRAWER: ADD A SALE                                       */}
      {/* ======================================================== */}
      {isAddDrawerOpen && (
        <div className="drawer-overlay" onClick={() => setIsAddDrawerOpen(false)}>
          <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #EAE5DC', paddingBottom: 16, marginBottom: 24 }}>
              <div>
                <h3 className="font-editorial" style={{ fontSize: '1.6rem', fontWeight: 500, color: '#0B132B', margin: 0 }}>
                  Record a New Sale
                </h3>
                <span style={{ fontSize: '0.76rem', color: '#596579' }}>GSTR-1 Outward Supply Invoice</span>
              </div>
              <button onClick={() => setIsAddDrawerOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8D99AE' }}>
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0B132B', marginBottom: 6 }}>Customer Name / Business</label>
                <input
                  type="text"
                  placeholder="e.g. Malabar Craft Villa"
                  value={saleForm.customerName}
                  onChange={(e) => setSaleForm({ ...saleForm, customerName: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #DCD5C9', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0B132B', marginBottom: 6 }}>Customer GSTIN (Optional for B2C)</label>
                <input
                  type="text"
                  placeholder="e.g. 32AABCM1122P1Z4"
                  value={saleForm.customerGstin}
                  onChange={(e) => setSaleForm({ ...saleForm, customerGstin: e.target.value.toUpperCase() })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #DCD5C9', fontSize: '0.88rem', fontFamily: 'monospace' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0B132B', marginBottom: 6 }}>Invoice Number</label>
                  <input
                    type="text"
                    placeholder="e.g. INV-001"
                    value={saleForm.invoiceNumber}
                    onChange={(e) => setSaleForm({ ...saleForm, invoiceNumber: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #DCD5C9', fontSize: '0.88rem', fontFamily: 'monospace' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0B132B', marginBottom: 6 }}>Invoice Date</label>
                  <input
                    type="date"
                    value={saleForm.date}
                    onChange={(e) => setSaleForm({ ...saleForm, date: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #DCD5C9', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0B132B', marginBottom: 6 }}>Taxable Value (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 50000"
                    value={saleForm.taxableRupees}
                    onChange={(e) => setSaleForm({ ...saleForm, taxableRupees: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #DCD5C9', fontSize: '0.88rem', fontWeight: 700 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0B132B', marginBottom: 6 }}>GST Rate (%)</label>
                  <select
                    value={saleForm.ratePercent}
                    onChange={(e) => setSaleForm({ ...saleForm, ratePercent: parseInt(e.target.value, 10) })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #DCD5C9', fontSize: '0.88rem', backgroundColor: '#FFFFFF' }}
                  >
                    <option value={0}>0% (Nil)</option>
                    <option value={5}>5%</option>
                    <option value={12}>12%</option>
                    <option value={18}>18% (Standard)</option>
                    <option value={28}>28%</option>
                  </select>
                </div>
              </div>

              {/* Live Tax Preview Box */}
              <div style={{ padding: 14, backgroundColor: '#FAF8F5', borderRadius: 12, border: '1px solid #EAE5DC', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#596579', marginBottom: 4 }}>
                  <span>Taxable:</span>
                  <span>₹ {taxableNum.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0D6258', fontWeight: 600, marginBottom: 4 }}>
                  <span>GST ({saleForm.ratePercent}%):</span>
                  <span>₹ {gstCalculated.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.98rem', fontWeight: 800, color: '#0B132B', borderTop: '1px dashed #DCD5C9', paddingTop: 6 }}>
                  <span>Total Amount:</span>
                  <span>₹ {totalCalculated.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button
                type="button"
                onClick={() => handleSaveSale(true)}
                style={{ flex: 1, padding: '12px', fontSize: '0.88rem', fontWeight: 600, color: '#596579', backgroundColor: '#FFFFFF', border: '1px solid #DCD5C9', borderRadius: 10, cursor: 'pointer' }}
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => handleSaveSale(false)}
                style={{ flex: 1, padding: '12px', fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', backgroundColor: '#0D6258', border: 'none', borderRadius: 10, cursor: 'pointer', boxShadow: '0 4px 12px rgba(13, 98, 88, 0.25)' }}
              >
                Record Sale
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: SPREADSHEET IMPORT CONFIRMATION                   */}
      {/* ======================================================== */}
      {isImportModalOpen && (
        <div className="drawer-overlay" style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <div style={{ width: '100%', maxWidth: 600, backgroundColor: '#FFFFFF', borderRadius: 22, padding: 32, boxShadow: '0 25px 60px rgba(11, 19, 43, 0.25)', border: '1px solid #EAE5DC' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #EAE5DC', paddingBottom: 16, marginBottom: 20 }}>
              <div>
                <h3 className="font-editorial" style={{ fontSize: '1.45rem', fontWeight: 500, color: '#0B132B', margin: 0 }}>
                  Review & Confirm CSV Import
                </h3>
                <span style={{ fontSize: '0.76rem', color: '#0D6258', fontWeight: 700 }}>
                  {uploadedFileName} • {pendingParsedRows.length} valid invoice rows detected
                </span>
              </div>
              <button onClick={() => setIsImportModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8D99AE' }}>
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            <p style={{ fontSize: '0.84rem', color: '#596579', lineHeight: 1.5, margin: '0 0 16px 0' }}>
              We parsed your CSV file and mapped standard GST columns (Invoice #, Date, Buyer, Taxable, Rate, Total). Here is a preview of the records to be added:
            </p>

            {/* Preview Box */}
            <div style={{ maxHeight: 200, overflowY: 'auto', backgroundColor: '#FAF8F5', borderRadius: 12, border: '1px solid #EAE5DC', padding: 12, marginBottom: 20 }}>
              {pendingParsedRows.slice(0, 5).map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', padding: '6px 0', borderBottom: i === 4 ? 'none' : '1px solid #F5F1EA' }}>
                  <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{row.id}</span>
                  <span style={{ color: '#0B132B' }}>{row.customerName}</span>
                  <span style={{ fontWeight: 700, color: '#0D6258' }}>₹ {row.totalRupees.toLocaleString('en-IN')}</span>
                </div>
              ))}
              {pendingParsedRows.length > 5 && (
                <div style={{ textAlign: 'center', fontSize: '0.72rem', color: '#8D99AE', paddingTop: 6 }}>
                  + {pendingParsedRows.length - 5} more records ready for import
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                style={{ padding: '10px 18px', fontSize: '0.84rem', fontWeight: 600, color: '#596579', background: 'none', border: '1px solid #DCD5C9', borderRadius: 10, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCompleteImport}
                style={{ padding: '10px 22px', fontSize: '0.84rem', fontWeight: 700, color: '#FFFFFF', backgroundColor: '#0D6258', border: 'none', borderRadius: 10, cursor: 'pointer' }}
              >
                Confirm & Import {pendingParsedRows.length} Rows
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
