'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Lock, 
  ShieldCheck, 
  Info, 
  ArrowRight, 
  Download, 
  HelpCircle,
  Clock,
  Sparkles,
  X
} from 'lucide-react';
import { DEMO_BUSINESS, SAMPLE_REPORTS_DATA } from '../lib/showcaseData.js';

export default function ReportsHub({ onShowToast, onAskCopilot }) {
  const [selectedReport, setSelectedReport] = useState('gstr3b'); // 'gstr1' | 'gstr3b'
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const r1 = SAMPLE_REPORTS_DATA.gstr1;
  const r3 = SAMPLE_REPORTS_DATA.gstr3b;

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', width: '100%', paddingBottom: 64 }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 26, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 className="font-editorial" style={{ fontSize: '2.4rem', fontWeight: 500, color: '#0B132B', margin: 0 }}>
              GST Reports & Summaries
            </h1>
            <span style={{ fontSize: '0.74rem', padding: '3px 8px', borderRadius: 9999, backgroundColor: '#EEF8F6', color: '#0D6258', fontWeight: 700 }}>
              Period: September 2026 (Demo)
            </span>
          </div>
          <p style={{ fontSize: '0.96rem', color: '#596579', marginTop: 6 }}>
            Human-friendly reporting pathways. Review your outward sales declaration and monthly tax settlement.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onShowToast('📥 Exported September GSTR-3B draft summary report (Sample PDF).')}
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
            gap: 8
          }}
        >
          <Download style={{ width: 15, height: 15, color: '#596579' }} />
          <span>Export Summary (PDF)</span>
        </button>
      </div>

      {/* Two Prominent Pathways Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
        
        {/* Pathway 1: GSTR-1 */}
        <div 
          onClick={() => setSelectedReport('gstr1')}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            border: selectedReport === 'gstr1' ? '2px solid #0D6258' : '1px solid #EAE5DC',
            padding: 24,
            cursor: 'pointer',
            boxShadow: selectedReport === 'gstr1' ? '0 10px 28px -6px rgba(13, 98, 88, 0.15)' : '0 2px 8px rgba(11, 19, 43, 0.03)',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#0D6258', backgroundColor: '#EEF8F6', padding: '3px 8px', borderRadius: 6 }}>
              {r1.technicalCode}
            </span>
            <span style={{ fontSize: '0.74rem', color: '#0E7051', fontWeight: 700 }}>
              {r1.badge}
            </span>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B132B', margin: '0 0 6px 0' }}>
            {r1.title}
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#596579', lineHeight: 1.5, margin: '0 0 16px 0' }}>
            {r1.explanation}
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '10px 0', borderTop: '1px solid #FAF8F5' }}>
            <span style={{ color: '#8D99AE' }}>Taxable Sales:</span>
            <span style={{ fontWeight: 800, color: '#0B132B' }}>₹ {r1.taxableSalesRupees.toLocaleString('en-IN')} (Sample)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
            <span style={{ color: '#8D99AE' }}>Output GST Collected:</span>
            <span style={{ fontWeight: 800, color: '#0D6258' }}>₹ {r1.outputTaxRupees.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Pathway 2: GSTR-3B */}
        <div 
          onClick={() => setSelectedReport('gstr3b')}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            border: selectedReport === 'gstr3b' ? '2px solid #0D6258' : '1px solid #EAE5DC',
            padding: 24,
            cursor: 'pointer',
            boxShadow: selectedReport === 'gstr3b' ? '0 10px 28px -6px rgba(13, 98, 88, 0.15)' : '0 2px 8px rgba(11, 19, 43, 0.03)',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#B45309', backgroundColor: '#FEF7EC', padding: '3px 8px', borderRadius: 6 }}>
              {r3.technicalCode}
            </span>
            <span style={{ fontSize: '0.74rem', color: '#B45309', fontWeight: 700 }}>
              {r3.badge}
            </span>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B132B', margin: '0 0 6px 0' }}>
            {r3.title}
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#596579', lineHeight: 1.5, margin: '0 0 16px 0' }}>
            {r3.explanation}
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '10px 0', borderTop: '1px solid #FAF8F5' }}>
            <span style={{ color: '#8D99AE' }}>Eligible Purchase Credit:</span>
            <span style={{ fontWeight: 800, color: '#0D6258' }}>- ₹ {r3.eligibleItcCreditRupees.toLocaleString('en-IN')} (Sample)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
            <span style={{ color: '#8D99AE' }}>Estimated Net Tax to Settle:</span>
            <span style={{ fontWeight: 800, color: '#B45309' }}>₹ {r3.netTaxPayableRupees.toLocaleString('en-IN')} (Sample)</span>
          </div>
        </div>

      </div>

      {/* DETAILED REPORT REVIEW CANVAS */}
      <div style={{ 
        backgroundColor: '#FFFFFF', 
        borderRadius: 22, 
        border: '1px solid #EAE5DC', 
        padding: '32px 36px', 
        boxShadow: '0 4px 20px rgba(11, 19, 43, 0.04)' 
      }}>
        {/* Report Top Meta */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 20, borderBottom: '1px solid #EAE5DC', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8D99AE', fontWeight: 800 }}>
              REPORT REVIEW DRAFT • {selectedReport === 'gstr3b' ? 'GSTR-3B' : 'GSTR-1'}
            </div>
            <h2 className="font-editorial" style={{ fontSize: '1.85rem', fontWeight: 500, color: '#0B132B', margin: '4px 0 0 0' }}>
              {selectedReport === 'gstr3b' ? 'Monthly Tax Settlement & Credit Claim' : 'Outward Business Sales Schedule'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '0.78rem', color: '#596579', backgroundColor: '#FAF8F5', border: '1px solid #EAE5DC', padding: '6px 12px', borderRadius: 8 }}>
              {DEMO_BUSINESS.legalName} • {DEMO_BUSINESS.gstin}
            </span>
          </div>
        </div>

        {/* Breakdown Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Section 1: Sales Tax Collection */}
          <div style={{ padding: '18px 20px', backgroundColor: '#FAF8F5', borderRadius: 16, border: '1px solid #EAE5DC' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0B132B' }}>
                1. Outward Taxable Sales (Output GST Collected)
              </span>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0B132B' }}>
                ₹ 1,51,560 (Sample)
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#596579', margin: 0 }}>
              Computed across 124 sales invoices: ₹85,200 CGST + ₹85,200 SGST (Intra-Kerala) + ₹66,360 IGST (Inter-State).
            </p>
          </div>

          {/* Section 2: Purchase Tax Credit Claim */}
          <div style={{ padding: '18px 20px', backgroundColor: '#EEF8F6', borderRadius: 16, border: '1px solid #B2DDD7' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0D6258' }}>
                2. Eligible Input Tax Credit (ITC Paid to Suppliers)
              </span>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0D6258' }}>
                - ₹ 74,800 (Sample)
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#084039', margin: 0 }}>
              Eligible tax credits verified under Section 16(2)(aa) from 83 matched supplier purchase bills.
            </p>
          </div>

          {/* Section 3: Net Tax Liability */}
          <div style={{ padding: '22px 24px', backgroundColor: '#FAF8F5', borderRadius: 18, border: '2px solid #F7E1B8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#B45309', fontWeight: 800 }}>
                  NET TAX LIABILITY (SAMPLE ESTIMATE)
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0B132B', marginTop: 2 }}>
                  Net Cash Required to Settle September 2026
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#B45309', fontVariantNumeric: 'tabular-nums' }}>
                  ₹ 76,760
                </div>
                <div style={{ fontSize: '0.72rem', color: '#8D99AE' }}>
                  Zero penalty risk • Verified integer math
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Final Review & Filing Panel */}
        <div style={{ 
          marginTop: 28, 
          padding: 22, 
          backgroundColor: '#FFFFFF', 
          borderRadius: 16, 
          border: '1px solid #EAE5DC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ShieldCheck style={{ width: 22, height: 22, color: '#0D6258' }} />
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0B132B' }}>
                Statutory Review & Authorization Safeguard
              </div>
              <div style={{ fontSize: '0.78rem', color: '#596579' }}>
                Real government GSP transmission requires authorized biometric / OTP credentials.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsDemoModalOpen(true)}
            style={{
              padding: '12px 26px',
              fontSize: '0.9rem',
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
            <Lock style={{ width: 15, height: 15 }} />
            <span>Authorise filing</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL: DEMO WORKSPACE REALITY SAFEGUARD                  */}
      {/* ======================================================== */}
      {isDemoModalOpen && (
        <div className="drawer-overlay" style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <div style={{ width: '100%', maxWidth: 520, backgroundColor: '#FFFFFF', borderRadius: 22, padding: 32, boxShadow: '0 25px 60px rgba(11, 19, 43, 0.25)', border: '1px solid #EAE5DC' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#EEF8F6', color: '#0D6258', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck style={{ width: 22, height: 22 }} />
              </div>
              <div>
                <h3 className="font-editorial" style={{ fontSize: '1.45rem', fontWeight: 500, color: '#0B132B', margin: 0 }}>
                  Demo Workspace Active
                </h3>
                <span style={{ fontSize: '0.76rem', color: '#8D99AE' }}>Statutory Safeguard</span>
              </div>
            </div>

            <p style={{ fontSize: '0.92rem', color: '#596579', lineHeight: 1.6, margin: '0 0 20px 0' }}>
              <strong>This is a demo workspace.</strong> Real GST filing becomes available only after a certified, secure GST Suvidha Provider (GSP) connection is configured with your business credentials and authorized signatory OTP.
            </p>

            <div style={{ padding: '12px 16px', backgroundColor: '#FAF8F5', borderRadius: 12, border: '1px solid #EAE5DC', fontSize: '0.8rem', color: '#0B132B', marginBottom: 24 }}>
              <strong>Sample Summary:</strong> Net tax payable of <strong>₹ 76,760</strong> for September 2026 is mathematically validated and ready for accountant review.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                onClick={() => setIsDemoModalOpen(false)}
                style={{ padding: '10px 20px', fontSize: '0.86rem', fontWeight: 700, color: '#FFFFFF', backgroundColor: '#0D6258', border: 'none', borderRadius: 10, cursor: 'pointer' }}
              >
                Understood, Return to Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
