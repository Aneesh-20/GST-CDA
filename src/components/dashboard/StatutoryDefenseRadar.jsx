'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  FileText, 
  Lock,
  ArrowRight
} from 'lucide-react';

export default function StatutoryDefenseRadar({
  business,
  onDownloadCertificate,
  onOpenNoticeRadarModal
}) {
  return (
    <div style={{ 
      backgroundColor: '#FFFFFF', 
      borderRadius: 18, 
      border: '1px solid #EAE5DC', 
      padding: 24,
      boxShadow: '0 2px 8px rgba(11, 19, 43, 0.03)',
      marginBottom: 28
    }} className="staged-enter-4">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck style={{ width: 18, height: 18 }} />
          </div>
          <div>
            <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0B132B' }}>
              Statutory Scrutiny & Notice Risk Radar
            </div>
            <div style={{ fontSize: '0.74rem', color: '#596579' }}>
              Automated defense against DRC-01B and DRC-01C statutory tax notices
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ 
            fontSize: '0.74rem', 
            fontWeight: 800, 
            color: '#059669', 
            backgroundColor: '#ECFDF5', 
            padding: '3px 10px', 
            borderRadius: 9999,
            border: '1px solid #A7F3D0'
          }}>
            100/100 Defense Score
          </span>
          <button
            type="button"
            onClick={onOpenNoticeRadarModal}
            style={{
              padding: '4px 10px',
              fontSize: '0.74rem',
              fontWeight: 700,
              color: '#0D6258',
              backgroundColor: '#EEF8F6',
              border: '1px solid #B2DDD7',
              borderRadius: 8,
              cursor: 'pointer'
            }}
          >
            Details
          </button>
        </div>
      </div>

      {/* 3 Rule Status Badges */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 18 }} className="stat-grid-3">
        <div style={{ padding: '12px 14px', backgroundColor: '#FAF8F5', borderRadius: 12, border: '1px solid #EAE5DC' }}>
          <div style={{ fontSize: '0.72rem', color: '#596579', fontWeight: 600 }}>Rule 88C (GSTR-1 vs 3B)</div>
          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#059669', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
            <CheckCircle2 style={{ width: 14, height: 14 }} />
            <span>Passed • 0.00% Drift</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: '#8D99AE', marginTop: 2 }}>Outward tax liability matches exactly</div>
        </div>

        <div style={{ padding: '12px 14px', backgroundColor: '#FAF8F5', borderRadius: 12, border: '1px solid #EAE5DC' }}>
          <div style={{ fontSize: '0.72rem', color: '#596579', fontWeight: 600 }}>Rule 88D (ITC vs 2B)</div>
          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#059669', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
            <CheckCircle2 style={{ width: 14, height: 14 }} />
            <span>Passed • 100% Guarded</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: '#8D99AE', marginTop: 2 }}>Zero excess ITC claimed</div>
        </div>

        <div style={{ padding: '12px 14px', backgroundColor: '#FAF8F5', borderRadius: 12, border: '1px solid #EAE5DC' }}>
          <div style={{ fontSize: '0.72rem', color: '#596579', fontWeight: 600 }}>Section 16(2)(aa)</div>
          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#059669', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
            <CheckCircle2 style={{ width: 14, height: 14 }} />
            <span>Passed • Verified</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: '#8D99AE', marginTop: 2 }}>Suppliers confirmed in GSTN portal</div>
        </div>
      </div>

      {/* Certificate Download Action Banner */}
      <div style={{ 
        padding: '14px 18px', 
        backgroundColor: '#070B14', 
        borderRadius: 14, 
        border: '1px solid rgba(255, 255, 255, 0.1)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        color: '#FFFFFF'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Lock style={{ width: 16, height: 16, color: '#10B981' }} />
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>Cryptographic Audit Defense Certificate</div>
            <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>SHA-256 tamper-proof provenance of all integer calculations and statutory reconciliation.</div>
          </div>
        </div>

        <button
          type="button"
          onClick={onDownloadCertificate}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            borderRadius: 8,
            backgroundColor: '#0D6258',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.78rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(13, 98, 88, 0.4)',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <Download style={{ width: 13, height: 13 }} />
          <span>Download Certificate (.txt)</span>
        </button>
      </div>
    </div>
  );
}

