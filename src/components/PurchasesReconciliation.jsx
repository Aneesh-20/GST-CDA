'use client';

import React, { useState } from 'react';
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
  Info
} from 'lucide-react';
import { SAMPLE_PURCHASES_SUMMARY, SAMPLE_PURCHASE_DIFFERENCES } from '../lib/showcaseData.js';

export default function PurchasesReconciliation({ initialSubTab = 'reconciliation', onShowToast, onAskCopilot, onRequestCaSupport }) {
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab); // 'all-purchases' | 'reconciliation'
  const [differences, setDifferences] = useState(SAMPLE_PURCHASE_DIFFERENCES);
  const [reviewedIds, setReviewedIds] = useState([]);

  const handleMarkReviewed = (diffId, vendorName) => {
    if (reviewedIds.includes(diffId)) {
      setReviewedIds(reviewedIds.filter(id => id !== diffId));
      onShowToast(`Marked ${vendorName} difference as unreviewed.`);
    } else {
      setReviewedIds([...reviewedIds, diffId]);
      onShowToast(`✓ Verified & marked ${vendorName} difference as reviewed.`);
    }
  };

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', width: '100%', paddingBottom: 64 }}>
      {/* Top Header & Sub-Tab Switcher */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 className="font-editorial" style={{ fontSize: '2.4rem', fontWeight: 500, color: '#0B132B', margin: 0 }}>
              {activeSubTab === 'reconciliation' ? 'Check your purchase tax credit' : 'My Purchases'}
            </h1>
            <span style={{ fontSize: '0.74rem', padding: '3px 8px', borderRadius: 9999, backgroundColor: '#EEF8F6', color: '#0D6258', fontWeight: 700 }}>
              {activeSubTab === 'reconciliation' ? 'GSTR-2B Matching Workbench' : 'Inward Bills Register'}
            </span>
          </div>
          <p style={{ fontSize: '0.96rem', color: '#596579', marginTop: 6 }}>
            {activeSubTab === 'reconciliation' 
              ? 'Compare your purchase records with available GST information. A difference does not necessarily mean something is wrong.'
              : 'All 86 purchase bills recorded from your raw material and service suppliers for September 2026.'}
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div style={{ display: 'flex', backgroundColor: '#FFFFFF', padding: 4, borderRadius: 12, border: '1px solid #EAE5DC' }}>
          <button
            type="button"
            onClick={() => setActiveSubTab('reconciliation')}
            style={{
              padding: '8px 18px',
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
            <span>Check differences (3)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('all-purchases')}
            style={{
              padding: '8px 18px',
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
            <span>All Purchases (86)</span>
          </button>
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
            marginBottom: 26,
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
                  {differences.length - reviewedIds.length} items need your review
                </div>
                <div style={{ fontSize: '0.82rem', color: '#596579', marginTop: 2 }}>
                  83 bills matched automatically. 3 items have minor timing, discount, or state classification differences.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onAskCopilot('Why do I have differences?')}
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
      {/* VIEW: ALL PURCHASES LIST (86 BILLS)                      */}
      {/* ======================================================== */}
      {activeSubTab === 'all-purchases' && (
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
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>Tax (ITC)</th>
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>Total</th>
                <th style={{ padding: '14px 20px', textAlign: 'center' }}>2B Match Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { num: 'HND-2026-901', date: '04 Sep 2026', vendor: 'Kerala Handloom Weavers', gstin: '32AAACK1100R1Z2', taxable: 140000, tax: 16800, total: 156800, status: 'Matched in 2B' },
                { num: 'CPS-8842', date: '12 Sep 2026', vendor: 'Calicut Packaging Solutions', gstin: '32AABCC7788P1Z6', taxable: 42000, tax: 7560, total: 49560, status: 'Difference (₹2K)' },
                { num: 'SRW-991', date: '18 Sep 2026', vendor: 'Spice Route Woodcraft Artisans', gstin: '32AAACS9900L1Z9', taxable: 65000, tax: 11700, total: 76700, status: 'Timing Delay (Oct)' },
                { num: 'MFL-204', date: '22 Sep 2026', vendor: 'Malabar Freight Logistics', gstin: '32AABCM4433D1Z1', taxable: 28000, tax: 5040, total: 33040, status: 'State Tag Check' },
                { num: 'CPP-4421', date: '27 Sep 2026', vendor: 'Cochin Paper & Printworks', gstin: '32AAACC3311N1Z5', taxable: 16000, tax: 2880, total: 18880, status: 'Matched in 2B' },
              ].map((p, idx) => (
                <tr 
                  key={p.num} 
                  style={{ borderBottom: idx === 4 ? 'none' : '1px solid #F5F1EA' }}
                >
                  <td style={{ padding: '14px 20px', fontWeight: 700, fontFamily: 'monospace' }}>{p.num}</td>
                  <td style={{ padding: '14px 16px', color: '#596579' }}>{p.date}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 700, color: '#0B132B' }}>{p.vendor}</div>
                    <div style={{ fontSize: '0.7rem', color: '#8D99AE', fontFamily: 'monospace' }}>{p.gstin}</div>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600 }}>₹ {p.taxable.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', color: '#0D6258', fontWeight: 600 }}>₹ {p.tax.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800 }}>₹ {p.total.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                    <span style={{ 
                      padding: '3px 10px', 
                      borderRadius: 9999, 
                      fontSize: '0.72rem', 
                      fontWeight: 700,
                      backgroundColor: p.status.includes('Matched') ? '#ECFDF5' : '#FEF7EC',
                      color: p.status.includes('Matched') ? '#0E7051' : '#B45309'
                    }}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

