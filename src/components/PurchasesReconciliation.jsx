'use client';

import React, { useState, useRef } from 'react';
import { 
  GitCompare, 
  CheckCircle2, 
  HelpCircle, 
  AlertTriangle, 
  Check, 
  Edit3, 
  Users, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  ShoppingCart,
  Clock,
  Info,
  PlusCircle,
  UploadCloud,
  FileSpreadsheet,
  FileCheck,
  FileCode,
  FileText,
  Trash2,
  Search,
  X
} from 'lucide-react';
import { SAMPLE_PURCHASE_DIFFERENCES } from '../lib/showcaseData.js';
import { SAMPLE_PURCHASE_TABLE, parseCsvText, getPurchasesCsvTemplate, triggerBrowserDownload } from '../lib/realtimeData.js';

export default function PurchasesReconciliation({ 
  purchasesList = [],
  setPurchasesList,
  initialSubTab = 'reconciliation', 
  onShowToast, 
  onAskCopilot, 
  onRequestCaSupport 
}) {
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab); // 'all-purchases' | 'reconciliation'
  const [differences, setDifferences] = useState([]);
  const [reviewedIds, setReviewedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Drawer & Modal States
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [pendingParsedRows, setPendingParsedRows] = useState([]);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isPdfScanning, setIsPdfScanning] = useState(false);

  const fileInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  // Manual Inward Bill Form State (Clean Slate, No Pre-filled Dummy Data)
  const [billForm, setBillForm] = useState({
    supplierName: '',
    supplierGstin: '',
    billNumber: '',
    date: new Date().toISOString().split('T')[0],
    supplyType: 'Intra-State',
    taxableRupees: '',
    ratePercent: 18,
    category: '',
  });

  const taxableNum = parseFloat(billForm.taxableRupees) || 0;
  const gstCalculated = Math.round(taxableNum * (billForm.ratePercent / 100));
  const totalCalculated = taxableNum + gstCalculated;

  const filteredPurchases = purchasesList.filter(p => 
    (p.vendorName && p.vendorName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.id && p.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.vendorGstin && p.vendorGstin.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalTaxable = purchasesList.reduce((acc, p) => acc + (p.taxableRupees || 0), 0);
  const totalItc = purchasesList.reduce((acc, p) => acc + (p.gstPaise || 0), 0);

  const handleMarkReviewed = (diffId, vendorName) => {
    if (reviewedIds.includes(diffId)) {
      setReviewedIds(reviewedIds.filter(id => id !== diffId));
      if (onShowToast) onShowToast(`Marked ${vendorName} difference as unreviewed.`);
    } else {
      setReviewedIds([...reviewedIds, diffId]);
      if (onShowToast) onShowToast(`✓ Verified & marked ${vendorName} difference as reviewed.`);
    }
  };

  const handleSaveBill = () => {
    if (!billForm.supplierName.trim()) {
      alert('Please enter a supplier or vendor name.');
      return;
    }
    const billId = billForm.billNumber.trim() || `BILL-${Date.now().toString().slice(-5)}`;
    const newRecord = {
      id: billId,
      date: billForm.date,
      vendorName: billForm.supplierName,
      customerName: billForm.supplierName,
      vendorGstin: billForm.supplierGstin || '32AABB00000X1Z1',
      customerGstin: billForm.supplierGstin || '32AABB00000X1Z1',
      placeOfSupply: billForm.supplyType === 'Intra-State' ? 'Kerala (32)' : 'Inter-State (IGST)',
      supplyType: billForm.supplyType,
      taxableRupees: taxableNum,
      ratePercent: billForm.ratePercent,
      gstPaise: gstCalculated,
      totalRupees: totalCalculated,
      status: 'Matched in 2B',
      itcEligible: true,
      category: billForm.category || 'Supplies',
    };
    if (setPurchasesList) {
      setPurchasesList([newRecord, ...purchasesList]);
    }
    setIsAddDrawerOpen(false);
    if (onShowToast) onShowToast(`✅ Inward bill ${newRecord.id} recorded with ₹ ${newRecord.gstPaise.toLocaleString('en-IN')} eligible ITC.`);
  };

  const handleDeleteBill = (id) => {
    if (setPurchasesList) {
      setPurchasesList(purchasesList.filter(p => p.id !== id));
      if (onShowToast) onShowToast(`🗑️ Removed purchase bill ${id}.`);
    }
  };

  const handleClearAll = () => {
    if (confirm('Clear all purchase records to start with a clean slate?')) {
      if (setPurchasesList) setPurchasesList([]);
      if (onShowToast) onShowToast('✨ Cleared all purchase records. Ready for your real data.');
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
        const parsed = parseCsvText(text, 'purchases');
        if (parsed.length === 0) {
          alert('Could not detect valid purchase rows in this CSV. Please check headers or download our template.');
          return;
        }
        setPendingParsedRows(parsed);
        setIsImportModalOpen(true);
      } catch (err) {
        alert('Error reading CSV file: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Real PDF Bill Scanner Handler
  const handlePdfFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsPdfScanning(true);
    if (onShowToast) onShowToast(`📄 Scanning vendor PDF bill "${file.name}"...`);

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
        throw new Error(data.error || 'Failed to extract bill data');
      }

      const inv = data.invoice;
      const parsedTaxable = Math.round(Number(inv.taxablePaise || 0) / 100);
      const parsedGst = Math.round((Number(inv.cgstPaise || 0) + Number(inv.sgstPaise || 0) + Number(inv.igstPaise || 0)) / 100);
      const parsedTotal = Math.round(Number(inv.totalPaise || 0) / 100);

      const newRecord = {
        id: inv.invoiceNumber || `BILL-${Date.now().toString().slice(-4)}`,
        date: inv.date || new Date().toISOString().split('T')[0],
        vendorName: inv.partyName || 'Extracted Supplier',
        customerName: inv.partyName || 'Extracted Supplier',
        vendorGstin: inv.partyGstin || '32AABCC0000P1Z0',
        customerGstin: inv.partyGstin || '32AABCC0000P1Z0',
        placeOfSupply: inv.supplyType === 'INTRA' ? 'Kerala (32)' : 'Inter-State (IGST)',
        supplyType: inv.supplyType === 'INTRA' ? 'Intra-State' : 'Inter-State (IGST)',
        taxableRupees: parsedTaxable,
        ratePercent: inv.ratePercent || 18,
        gstPaise: parsedGst,
        totalRupees: parsedTotal,
        status: 'Matched in 2B',
        itcEligible: true,
        category: 'PDF Supplier Invoice',
      };

      if (setPurchasesList) {
        setPurchasesList([newRecord, ...purchasesList]);
      }
      if (onShowToast) onShowToast(`🎉 Successfully parsed bill: ${newRecord.id} (₹ ${newRecord.totalRupees.toLocaleString('en-IN')}) added to Purchases!`);
    } catch (err) {
      console.error(err);
      if (onShowToast) onShowToast(`⚠️ Could not parse PDF: ${err.message}. Try adding manually or uploading CSV.`);
    } finally {
      setIsPdfScanning(false);
      e.target.value = '';
    }
  };

  const handleDownloadTemplate = () => {
    const template = getPurchasesCsvTemplate();
    triggerBrowserDownload('GST_Purchases_Template.csv', template);
    if (onShowToast) onShowToast('📥 Downloaded GST Purchases CSV Template.');
  };

  const handleCompleteImport = () => {
    if (pendingParsedRows.length > 0 && setPurchasesList) {
      setPurchasesList([...pendingParsedRows, ...purchasesList]);
      if (onShowToast) onShowToast(`🎉 Successfully imported ${pendingParsedRows.length} purchase bills.`);
    }
    setIsImportModalOpen(false);
    setPendingParsedRows([]);
  };

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', width: '100%', paddingBottom: 64 }}>
      
      {/* Hidden File Inputs */}
      <input 
        type="file" 
        ref={fileInputRef} 
        accept=".csv,.txt,.xlsx,.xls" 
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

      {/* Top Header & Sub-Tab Switcher */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 className="font-editorial" style={{ fontSize: '2.4rem', fontWeight: 500, color: '#0B132B', margin: 0 }}>
              {activeSubTab === 'reconciliation' ? 'Check your purchase tax credit' : 'Inward Purchases Register'}
            </h1>
            <span style={{ fontSize: '0.74rem', padding: '3px 10px', borderRadius: 9999, backgroundColor: '#EEF8F6', color: '#0D6258', fontWeight: 700 }}>
              {activeSubTab === 'reconciliation' ? 'GSTR-2B Matching Workbench' : `${purchasesList.length} Bills Tracked`}
            </span>
          </div>
          <p style={{ fontSize: '0.96rem', color: '#596579', marginTop: 6 }}>
            {activeSubTab === 'reconciliation' 
              ? 'Compare your purchase records with supplier filings in GSTR-2B to safely claim maximum eligible Input Tax Credit.'
              : `All ${purchasesList.length} purchase bills recorded from your raw material and service suppliers.`}
          </p>
        </div>

        {/* Action Controls & Tab Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          
          {/* Sub-Tab Pills */}
          <div style={{ display: 'flex', backgroundColor: '#FFFFFF', padding: 4, borderRadius: 12, border: '1px solid #EAE5DC' }}>
            <button
              type="button"
              onClick={() => setActiveSubTab('reconciliation')}
              style={{
                padding: '8px 16px',
                fontSize: '0.84rem',
                fontWeight: activeSubTab === 'reconciliation' ? 800 : 600,
                color: activeSubTab === 'reconciliation' ? '#0D6258' : '#596579',
                backgroundColor: activeSubTab === 'reconciliation' ? '#EEF8F6' : 'transparent',
                border: activeSubTab === 'reconciliation' ? '1px solid #B2DDD7' : 'none',
                borderRadius: 8,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <GitCompare style={{ width: 14, height: 14 }} />
              <span>Differences ({differences.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('all-purchases')}
              style={{
                padding: '8px 16px',
                fontSize: '0.84rem',
                fontWeight: activeSubTab === 'all-purchases' ? 800 : 600,
                color: activeSubTab === 'all-purchases' ? '#0D6258' : '#596579',
                backgroundColor: activeSubTab === 'all-purchases' ? '#EEF8F6' : 'transparent',
                border: activeSubTab === 'all-purchases' ? '1px solid #B2DDD7' : 'none',
                borderRadius: 8,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <ShoppingCart style={{ width: 14, height: 14 }} />
              <span>All Purchases ({purchasesList.length})</span>
            </button>
          </div>

          {/* Upload & Entry Buttons */}
          <button
            type="button"
            onClick={handleDownloadTemplate}
            title="Download formatted CSV spreadsheet template"
            style={{
              padding: '9px 12px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#596579',
              backgroundColor: '#FFFFFF',
              border: '1px solid #DCD5C9',
              borderRadius: 10,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <FileSpreadsheet style={{ width: 14, height: 14, color: '#0D6258' }} />
            <span>CSV Template</span>
          </button>

          <button
            type="button"
            onClick={() => pdfInputRef.current?.click()}
            disabled={isPdfScanning}
            title="Scan single vendor bill from PDF"
            style={{
              padding: '9px 14px',
              fontSize: '0.8rem',
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
            <FileText style={{ width: 14, height: 14, color: '#C87D0E' }} />
            <span>{isPdfScanning ? 'Scanning...' : 'Scan Bill (PDF)'}</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Upload CSV / Excel file containing purchase bills"
            style={{
              padding: '9px 14px',
              fontSize: '0.82rem',
              fontWeight: 700,
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
            <UploadCloud style={{ width: 15, height: 15 }} />
            <span>Upload CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddDrawerOpen(true)}
            style={{
              padding: '9px 16px',
              fontSize: '0.84rem',
              fontWeight: 700,
              color: '#FFFFFF',
              backgroundColor: '#0D6258',
              border: 'none',
              borderRadius: 10,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 4px 12px rgba(13, 98, 88, 0.25)'
            }}
          >
            <PlusCircle style={{ width: 15, height: 15 }} />
            <span>Add Bill</span>
          </button>

          {purchasesList.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              title="Clear all purchase records to start clean"
              style={{
                padding: '9px 10px',
                fontSize: '0.8rem',
                color: '#8D99AE',
                backgroundColor: '#FFFFFF',
                border: '1px solid #EAE5DC',
                borderRadius: 10,
                cursor: 'pointer'
              }}
            >
              <Trash2 style={{ width: 15, height: 15 }} />
            </button>
          )}

        </div>
      </div>

      {/* Top Aggregate Summary Strip */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: 16, 
        marginBottom: 24 
      }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '16px 20px', borderRadius: 14, border: '1px solid #EAE5DC' }}>
          <div style={{ fontSize: '0.72rem', color: '#596579', fontWeight: 600 }}>Total Purchase Bills</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0B132B', marginTop: 4 }}>{purchasesList.length}</div>
          <div style={{ fontSize: '0.7rem', color: '#8D99AE', marginTop: 2 }}>Inward supplier register</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '16px 20px', borderRadius: 14, border: '1px solid #EAE5DC' }}>
          <div style={{ fontSize: '0.72rem', color: '#596579', fontWeight: 600 }}>Taxable Inward Spend</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0B132B', marginTop: 4 }}>
            ₹ {totalTaxable.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#8D99AE', marginTop: 2 }}>Raw materials & services</div>
        </div>

        <div style={{ backgroundColor: '#ECFDF5', padding: '16px 20px', borderRadius: 14, border: '1px solid #A7F3D0' }}>
          <div style={{ fontSize: '0.72rem', color: '#0E7051', fontWeight: 700 }}>Eligible Tax Credit (ITC)</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0E7051', marginTop: 4 }}>
            ₹ {totalItc.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#0E7051', marginTop: 2 }}>Off-sets outward GST</div>
        </div>

        <div style={{ backgroundColor: '#FEF7EC', padding: '16px 20px', borderRadius: 14, border: '1px solid #F7E1B8' }}>
          <div style={{ fontSize: '0.72rem', color: '#B45309', fontWeight: 700 }}>Items Needing Check</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#B45309', marginTop: 4 }}>
            {purchasesList.length > 0 ? differences.length - reviewedIds.length : 0}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#B45309', marginTop: 2 }}>
            {reviewedIds.length > 0 ? `${reviewedIds.length} verified` : 'Supplier GSTR-2B status'}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* VIEW: RECONCILIATION WORKBENCH                           */}
      {/* ======================================================== */}
      {activeSubTab === 'reconciliation' && (
        <div>
          {/* Gentle Summary Card */}
          <div style={{ 
            backgroundColor: '#FFFFFF', 
            borderRadius: 18, 
            border: '1px solid #EAE5DC', 
            padding: '20px 24px', 
            boxShadow: '0 2px 8px rgba(11, 19, 43, 0.03)',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ 
                width: 44, 
                height: 44, 
                borderRadius: 12, 
                backgroundColor: '#FEF7EC', 
                color: '#B45309', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <GitCompare style={{ width: 22, height: 22 }} />
              </div>
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0B132B' }}>
                  {purchasesList.length === 0 
                    ? 'No purchase bills recorded yet' 
                    : `${differences.length - reviewedIds.length} items to verify for maximum ITC`}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#596579', marginTop: 2 }}>
                  {purchasesList.length === 0
                    ? 'Upload your vendor bills or import a CSV file to check against GSTR-2B automatically.'
                    : `${purchasesList.length} inward bills in your register. Minor timing or discount variances protect your eligible tax credits under Section 16(2)(aa).`}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onAskCopilot && onAskCopilot('Why do I have differences in purchases?')}
              style={{
                padding: '8px 14px',
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
              <HelpCircle style={{ width: 14, height: 14 }} />
              <span>Why differences happen</span>
            </button>
          </div>

          {/* 3 Detailed Comparison Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {differences.map((diff) => {
              const isReviewed = reviewedIds.includes(diff.id);
              const isAmber = diff.severity === 'amber';
              const isNeutral = diff.severity === 'neutral';
              const isSoftRed = diff.severity === 'soft-red';

              const cardBorder = isReviewed 
                ? '#A7F3D0' 
                : isAmber ? '#F7E1B8' : isSoftRed ? '#FECACA' : '#EAE5DC';

              const cardBg = isReviewed ? '#FAFDFB' : '#FFFFFF';

              return (
                <div 
                  key={diff.id}
                  style={{
                    backgroundColor: cardBg,
                    borderRadius: 20,
                    border: `1px solid ${cardBorder}`,
                    padding: 24,
                    boxShadow: '0 4px 16px rgba(11, 19, 43, 0.03)',
                    transition: 'all 0.2s ease',
                    opacity: isReviewed ? 0.85 : 1
                  }}
                >
                  {/* Top Bar of Comparison Card */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ 
                        fontSize: '0.72rem', 
                        fontWeight: 800, 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.04em',
                        padding: '3px 10px', 
                        borderRadius: 9999,
                        backgroundColor: isReviewed ? '#ECFDF5' : isAmber ? '#FEF7EC' : isSoftRed ? '#FEF2F2' : '#F5F1EA',
                        color: isReviewed ? '#0E7051' : isAmber ? '#B45309' : isSoftRed ? '#B91C1C' : '#596579'
                      }}>
                        {isReviewed ? '✓ Reviewed' : diff.categoryLabel}
                      </span>
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0B132B' }}>
                        {diff.vendorName}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: '#8D99AE', fontFamily: 'monospace' }}>
                      Invoice #{diff.invoiceNumber} • GSTIN: {diff.vendorGstin}
                    </div>
                  </div>

                  {/* Headline & Explanation */}
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0B132B', marginBottom: 6 }}>
                    {diff.headline}
                  </div>
                  <p style={{ fontSize: '0.86rem', color: '#596579', lineHeight: 1.55, margin: '0 0 18px 0' }}>
                    {diff.explanation}
                  </p>

                  {/* Side-by-Side Comparison Box */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: 16, 
                    backgroundColor: '#FAF8F5', 
                    padding: 16, 
                    borderRadius: 14, 
                    border: '1px solid #EAE5DC',
                    marginBottom: 16 
                  }}>
                    {/* Your Record */}
                    <div>
                      <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#8D99AE', fontWeight: 800, marginBottom: 4 }}>
                        Your Book Record
                      </div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0B132B' }}>
                        {diff.yourRecord.taxable}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#596579', marginTop: 2 }}>
                        Tax: {diff.yourRecord.tax}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#8D99AE', marginTop: 4 }}>
                        Dated: {diff.yourRecord.date}
                      </div>
                    </div>

                    {/* Government Portal GSTR-2B Record */}
                    <div style={{ borderLeft: '1px solid #EAE5DC', paddingLeft: 16 }}>
                      <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#0D6258', fontWeight: 800, marginBottom: 4 }}>
                        Available GST Record (GSTR-2B)
                      </div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0D6258' }}>
                        {diff.gstPortalRecord.taxable}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#596579', marginTop: 2 }}>
                        Tax: {diff.gstPortalRecord.tax}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#8D99AE', marginTop: 4 }}>
                        {diff.gstPortalRecord.gstr1Status}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Actions Row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ fontSize: '0.78rem', color: '#596579', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Info style={{ width: 14, height: 14, color: '#0D6258' }} />
                      <span><strong>Impact:</strong> {diff.itcImpact}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <button
                        type="button"
                        onClick={onRequestCaSupport}
                        style={{
                          padding: '8px 14px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: '#596579',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #DCD5C9',
                          borderRadius: 8,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        <Users style={{ width: 13, height: 13, color: '#0D6258' }} />
                        <span>Ask my CA</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleMarkReviewed(diff.id, diff.vendorName)}
                        style={{
                          padding: '8px 16px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: isReviewed ? '#0B132B' : '#FFFFFF',
                          backgroundColor: isReviewed ? '#FFFFFF' : '#0D6258',
                          border: isReviewed ? '1px solid #DCD5C9' : 'none',
                          borderRadius: 8,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          boxShadow: isReviewed ? 'none' : '0 2px 8px rgba(13, 98, 88, 0.2)'
                        }}
                      >
                        <CheckCircle2 style={{ width: 14, height: 14 }} />
                        <span>{isReviewed ? 'Unmark' : 'Mark Reviewed'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW: ALL PURCHASES LIST                                 */}
      {/* ======================================================== */}
      {activeSubTab === 'all-purchases' && (
        <div>
          {/* Search Bar */}
          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 10, 
              padding: '10px 16px', 
              backgroundColor: '#FFFFFF', 
              borderRadius: 12, 
              border: '1px solid #EAE5DC' 
            }}>
              <Search style={{ width: 16, height: 16, color: '#8D99AE' }} />
              <input 
                type="text" 
                placeholder="Search vendor name, bill number, or GSTIN..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.86rem', backgroundColor: 'transparent' }}
              />
              {searchQuery && (
                <button 
                  type="button" 
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', color: '#8D99AE', cursor: 'pointer' }}
                >
                  <X style={{ width: 14, height: 14 }} />
                </button>
              )}
            </div>
          </div>

          {purchasesList.length === 0 ? (
            /* Clean Slate Empty State */
            <div style={{ 
              backgroundColor: '#FFFFFF', 
              borderRadius: 20, 
              border: '1px dashed #DCD5C9', 
              padding: '48px 32px', 
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(11, 19, 43, 0.02)'
            }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: '#EEF8F6', color: '#0D6258', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <ShoppingCart style={{ width: 28, height: 28 }} />
              </div>
              <h3 className="font-editorial" style={{ fontSize: '1.6rem', fontWeight: 500, color: '#0B132B', margin: '0 0 8px 0' }}>
                Your Purchases Register is Empty
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#596579', maxWidth: 480, margin: '0 auto 24px', lineHeight: 1.55 }}>
                Start recording your real vendor bills to calculate Input Tax Credits (ITC), reconcile against supplier GSTR-2B, and reduce your net GST cash payout.
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    padding: '11px 22px',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    color: '#0D6258',
                    backgroundColor: '#EEF8F6',
                    border: '1px solid #B2DDD7',
                    borderRadius: 12,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  <UploadCloud style={{ width: 16, height: 16 }} />
                  <span>Upload Purchases CSV</span>
                </button>

                <button
                  type="button"
                  onClick={() => pdfInputRef.current?.click()}
                  style={{
                    padding: '11px 22px',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    color: '#0B132B',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #DCD5C9',
                    borderRadius: 12,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  <FileText style={{ width: 16, height: 16, color: '#C87D0E' }} />
                  <span>Scan Vendor Bill (PDF)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAddDrawerOpen(true)}
                  style={{
                    padding: '11px 24px',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    backgroundColor: '#0D6258',
                    border: 'none',
                    borderRadius: 12,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: '0 4px 14px rgba(13, 98, 88, 0.25)'
                  }}
                >
                  <PlusCircle style={{ width: 16, height: 16 }} />
                  <span>Add First Inward Bill</span>
                </button>
              </div>
            </div>
          ) : (
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
                    <th style={{ padding: '14px 20px' }}>Bill No.</th>
                    <th style={{ padding: '14px 16px' }}>Date</th>
                    <th style={{ padding: '14px 16px' }}>Supplier / Vendor</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right' }}>Taxable Value</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right' }}>Rate</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right' }}>Tax (ITC)</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right' }}>Total</th>
                    <th style={{ padding: '14px 16px', textAlign: 'center' }}>2B Match</th>
                    <th style={{ padding: '14px 16px', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPurchases.map((p, idx) => (
                    <tr 
                      key={p.id} 
                      style={{ borderBottom: idx === filteredPurchases.length - 1 ? 'none' : '1px solid #F5F1EA' }}
                    >
                      <td style={{ padding: '14px 20px', fontWeight: 700, fontFamily: 'monospace' }}>{p.id}</td>
                      <td style={{ padding: '14px 16px', color: '#596579' }}>{p.date}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 700, color: '#0B132B' }}>{p.vendorName || p.customerName}</div>
                        <div style={{ fontSize: '0.7rem', color: '#8D99AE', fontFamily: 'monospace' }}>{p.vendorGstin || p.customerGstin}</div>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600 }}>₹ {(p.taxableRupees || 0).toLocaleString('en-IN')}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', color: '#596579' }}>{p.ratePercent || 18}%</td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', color: '#0D6258', fontWeight: 700 }}>₹ {(p.gstPaise || 0).toLocaleString('en-IN')}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800 }}>₹ {(p.totalRupees || 0).toLocaleString('en-IN')}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <span style={{ 
                          padding: '3px 10px', 
                          borderRadius: 9999, 
                          fontSize: '0.72rem', 
                          fontWeight: 700,
                          backgroundColor: (p.status || '').includes('Difference') ? '#FEF7EC' : '#ECFDF5',
                          color: (p.status || '').includes('Difference') ? '#B45309' : '#0E7051'
                        }}>
                          {p.status || 'Matched in 2B'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleDeleteBill(p.id)}
                          title="Delete this purchase bill"
                          style={{ background: 'none', border: 'none', color: '#8D99AE', cursor: 'pointer', padding: 4 }}
                        >
                          <Trash2 style={{ width: 14, height: 14 }} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* DRAWER: ADD INWARD PURCHASE BILL MANUALLY                */}
      {/* ======================================================== */}
      {isAddDrawerOpen && (
        <div className="drawer-overlay" onClick={() => setIsAddDrawerOpen(false)}>
          <div className="drawer-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#EEF8F6', color: '#0D6258', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PlusCircle style={{ width: 20, height: 20 }} />
                </div>
                <div>
                  <h3 className="font-editorial" style={{ fontSize: '1.4rem', fontWeight: 500, color: '#0B132B', margin: 0 }}>
                    Add Inward Purchase Bill
                  </h3>
                  <span style={{ fontSize: '0.74rem', color: '#8D99AE' }}>Single Bill Entry • Integer Paise Math</span>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsAddDrawerOpen(false)}
                style={{ background: 'none', border: 'none', color: '#8D99AE', cursor: 'pointer' }}
              >
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#0B132B', marginBottom: 6 }}>
                  Supplier / Vendor Name *
                </label>
                <input 
                  type="text" 
                  value={billForm.supplierName}
                  onChange={e => setBillForm({ ...billForm, supplierName: e.target.value })}
                  placeholder="e.g. Calicut Packaging Supplies"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #DCD5C9', fontSize: '0.86rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#0B132B', marginBottom: 6 }}>
                    Supplier GSTIN
                  </label>
                  <input 
                    type="text" 
                    value={billForm.supplierGstin}
                    onChange={e => setBillForm({ ...billForm, supplierGstin: e.target.value.toUpperCase() })}
                    placeholder="32AABCC7788P1Z6"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #DCD5C9', fontSize: '0.86rem', fontFamily: 'monospace' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#0B132B', marginBottom: 6 }}>
                    Bill / Invoice #
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. BILL-001"
                    value={billForm.billNumber}
                    onChange={e => setBillForm({ ...billForm, billNumber: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #DCD5C9', fontSize: '0.86rem', fontFamily: 'monospace' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#0B132B', marginBottom: 6 }}>
                    Bill Date
                  </label>
                  <input 
                    type="date" 
                    value={billForm.date}
                    onChange={e => setBillForm({ ...billForm, date: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #DCD5C9', fontSize: '0.86rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#0B132B', marginBottom: 6 }}>
                    Supply Type
                  </label>
                  <select
                    value={billForm.supplyType}
                    onChange={e => setBillForm({ ...billForm, supplyType: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #DCD5C9', fontSize: '0.86rem' }}
                  >
                    <option value="Intra-State">Intra-State (CGST + SGST)</option>
                    <option value="Inter-State (IGST)">Inter-State (IGST)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#0B132B', marginBottom: 6 }}>
                    Taxable Amount (₹) *
                  </label>
                  <input 
                    type="number" 
                    placeholder="e.g. 45000"
                    value={billForm.taxableRupees}
                    onChange={e => setBillForm({ ...billForm, taxableRupees: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #DCD5C9', fontSize: '0.86rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#0B132B', marginBottom: 6 }}>
                    GST Rate
                  </label>
                  <select
                    value={billForm.ratePercent}
                    onChange={e => setBillForm({ ...billForm, ratePercent: parseInt(e.target.value, 10) })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #DCD5C9', fontSize: '0.86rem' }}
                  >
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
                  </select>
                </div>
              </div>

              {/* Calculated Summary Card */}
              <div style={{ padding: 14, backgroundColor: '#FAF8F5', borderRadius: 12, border: '1px solid #EAE5DC' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 6 }}>
                  <span style={{ color: '#596579' }}>Taxable Amount:</span>
                  <span style={{ fontWeight: 600 }}>₹ {taxableNum.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 6 }}>
                  <span style={{ color: '#0D6258' }}>Eligible Tax Credit (ITC):</span>
                  <span style={{ fontWeight: 700, color: '#0D6258' }}>+ ₹ {gstCalculated.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.94rem', fontWeight: 800, borderTop: '1px solid #EAE5DC', paddingTop: 6 }}>
                  <span>Total Bill Amount:</span>
                  <span>₹ {totalCalculated.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setIsAddDrawerOpen(false)}
                  style={{ padding: '10px 18px', fontSize: '0.84rem', fontWeight: 600, color: '#596579', background: 'none', border: '1px solid #DCD5C9', borderRadius: 10, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveBill}
                  style={{ padding: '10px 22px', fontSize: '0.84rem', fontWeight: 700, color: '#FFFFFF', backgroundColor: '#0D6258', border: 'none', borderRadius: 10, cursor: 'pointer', boxShadow: '0 4px 14px rgba(13, 98, 88, 0.25)' }}
                >
                  Save Inward Bill
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CSV IMPORT PREVIEW FOR PURCHASES                  */}
      {/* ======================================================== */}
      {isImportModalOpen && (
        <div className="drawer-overlay" style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <div style={{ width: '100%', maxWidth: 540, backgroundColor: '#FFFFFF', borderRadius: 22, padding: 28, boxShadow: '0 25px 60px rgba(11, 19, 43, 0.25)', border: '1px solid #EAE5DC' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#EEF8F6', color: '#0D6258', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileSpreadsheet style={{ width: 22, height: 22 }} />
              </div>
              <div>
                <h3 className="font-editorial" style={{ fontSize: '1.45rem', fontWeight: 500, color: '#0B132B', margin: 0 }}>
                  Confirm Inward Purchases CSV Import
                </h3>
                <span style={{ fontSize: '0.76rem', color: '#8D99AE' }}>
                  {uploadedFileName} • {pendingParsedRows.length} bills detected
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.84rem', color: '#596579', lineHeight: 1.5, margin: '0 0 16px 0' }}>
              We mapped your inward supplier columns (Bill #, Supplier, GSTIN, Taxable Amount, GST Rate, Total). Here is a preview of rows ready to be imported into your books:
            </p>

            <div style={{ maxHeight: 200, overflowY: 'auto', backgroundColor: '#FAF8F5', borderRadius: 12, border: '1px solid #EAE5DC', padding: 12, marginBottom: 20 }}>
              {pendingParsedRows.slice(0, 5).map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', padding: '6px 0', borderBottom: i === 4 ? 'none' : '1px solid #F5F1EA' }}>
                  <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{row.id}</span>
                  <span style={{ color: '#0B132B' }}>{row.vendorName}</span>
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
                style={{ padding: '10px 22px', fontSize: '0.84rem', fontWeight: 700, color: '#FFFFFF', backgroundColor: '#0D6258', border: 'none', borderRadius: 10, cursor: 'pointer', boxShadow: '0 4px 14px rgba(13, 98, 88, 0.25)' }}
              >
                Confirm & Import {pendingParsedRows.length} Bills
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
