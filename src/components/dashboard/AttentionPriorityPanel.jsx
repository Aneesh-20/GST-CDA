'use client';

import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  MessageSquare, 
  ShieldCheck, 
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function AttentionPriorityPanel({
  purchasesList = [],
  salesList = [],
  onNavigate,
  onOpenNoticeRadarModal
}) {
  // Check if there are any discrepancies or action items
  // In our demo data: Nilgiri Organic Interiors has a trade discount difference (₹95,000 recorded vs ₹90,000 in 2B)
  const hasDiscrepancy = purchasesList.length > 0;

  return (
    <div style={{ marginBottom: 28 }} className="staged-enter-3">
      {hasDiscrepancy ? (
        // Needs Attention State (Actionable exceptions with 1-click resolution)
        <div style={{ 
          backgroundColor: '#FFFFFF', 
          borderRadius: 18, 
          border: '1.5px solid #F7E1B8', 
          padding: '22px 24px',
          boxShadow: '0 8px 30px -6px rgba(217, 119, 6, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ 
                width: 38, 
                height: 38, 
                borderRadius: 10, 
                backgroundColor: '#FEF3C7', 
                color: '#D97706', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0 
              }}>
                <AlertTriangle style={{ width: 20, height: 20 }} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#D97706', backgroundColor: '#FEF3C7', padding: '2px 8px', borderRadius: 9999 }}>
                    Action Required • Section 16(2)(aa)
                  </span>
                  <span style={{ fontSize: '0.74rem', color: '#8D99AE' }}>
                    1 Supplier Difference Detected
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0B132B', margin: '4px 0 6px 0' }}>
                  Supplier GSTR-2B Difference: ₹5,000 Trade Discount
                </h3>

                <p style={{ fontSize: '0.84rem', color: '#596579', maxWidth: 620, lineHeight: 1.5, margin: 0 }}>
                  <strong>Nilgiri Organic Interiors (33AABCN3322E1Z7)</strong>: Your recorded bill is ₹95,000, while supplier uploaded ₹90,000 due to a post-sale trade discount. TaxMate has auto-classified this difference to protect your input credit without notice risk.
                </p>
              </div>
            </div>

            {/* Quick Resolution Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                type="button"
                onClick={() => onNavigate('purchases', 'reconciliation')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '10px 18px',
                  borderRadius: 10,
                  backgroundColor: '#0D6258',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(13, 98, 88, 0.25)',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>Review & Resolve</span>
                <ArrowRight style={{ width: 14, height: 14 }} />
              </button>

              <button
                type="button"
                onClick={onOpenNoticeRadarModal}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '10px 16px',
                  borderRadius: 10,
                  backgroundColor: '#FAF8F5',
                  border: '1px solid #EAE5DC',
                  color: '#0B132B',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  cursor: 'pointer'
                }}
              >
                <ShieldCheck style={{ width: 15, height: 15, color: '#059669' }} />
                <span>Notice Impact</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Reassuring All-Clear State
        <div style={{ 
          backgroundColor: '#FFFFFF', 
          borderRadius: 18, 
          border: '1.5px solid #A7F3D0', 
          padding: '20px 24px',
          boxShadow: '0 8px 30px -6px rgba(5, 150, 105, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 14
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ 
              width: 38, 
              height: 38, 
              borderRadius: 10, 
              backgroundColor: '#ECFDF5', 
              color: '#059669', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0 
            }}>
              <CheckCircle2 style={{ width: 20, height: 20 }} />
            </div>
            <div>
              <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0B132B' }}>
                All Clear • 100% Statutory Audit Safe
              </div>
              <div style={{ fontSize: '0.78rem', color: '#596579', marginTop: 2 }}>
                Zero variances between outward invoices and GSTR-1. Inward purchase credits strictly adhere to Section 16(2)(aa).
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700, backgroundColor: '#ECFDF5', padding: '4px 10px', borderRadius: 9999 }}>
              Rule 88C & 88D Optimal
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
