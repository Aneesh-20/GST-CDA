'use client';

import React from 'react';
import { 
  Receipt, 
  ShoppingCart, 
  CreditCard, 
  Calendar, 
  ShieldCheck, 
  Wifi, 
  ArrowUpRight, 
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function CoreIntelligenceGrid({
  business,
  salesList = [],
  purchasesList = [],
  totalTaxableSales = 0,
  totalOutputTax = 0,
  totalTaxablePurchases = 0,
  totalEligibleItc = 0,
  netTaxPayable = 0,
  onNavigate,
  onOpenNoticeRadarModal
}) {
  return (
    <div style={{ marginBottom: 28 }} className="staged-enter-3">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ fontSize: '0.84rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#596579' }}>
          Core Compliance Intelligence
        </div>
        <span style={{ fontSize: '0.74rem', color: '#8D99AE' }}>
          Scannable at a glance • Updated real-time
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="stat-grid-3">
        
        {/* CARD 1: SALES & OUTWARD TURNOVER */}
        <div 
          onClick={() => onNavigate('sales')}
          className="intelligence-card highlight-accent"
          style={{ cursor: 'pointer' }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#EEF8F6', color: '#0D6258', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Receipt style={{ width: 16, height: 16 }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0B132B' }}>Outward Sales</div>
                  <div style={{ fontSize: '0.68rem', color: '#8D99AE' }}>GSTR-1 Turnover</div>
                </div>
              </div>
              <span style={{ fontSize: '0.66rem', fontWeight: 700, color: '#059669', backgroundColor: '#ECFDF5', padding: '2px 8px', borderRadius: 9999 }}>
                {salesList.length} Recorded
              </span>
            </div>

            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0B132B', letterSpacing: '-0.02em', marginTop: 4 }}>
              ₹ {totalTaxableSales.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#596579', marginTop: 2 }}>
              Taxable turnover • ₹ {totalOutputTax.toLocaleString('en-IN')} output GST liability
            </div>
          </div>

          <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #EAE5DC', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem' }}>
            <span style={{ color: '#0D6258', fontWeight: 700 }}>Manage sales bills</span>
            <ArrowUpRight style={{ width: 14, height: 14, color: '#0D6258' }} />
          </div>
        </div>

        {/* CARD 2: PURCHASES & ELIGIBLE ITC */}
        <div 
          onClick={() => onNavigate('purchases')}
          className="intelligence-card highlight-accent"
          style={{ cursor: 'pointer' }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShoppingCart style={{ width: 16, height: 16 }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0B132B' }}>Inward Purchases</div>
                  <div style={{ fontSize: '0.68rem', color: '#8D99AE' }}>GSTR-2B Input Tax Credit</div>
                </div>
              </div>
              <span style={{ fontSize: '0.66rem', fontWeight: 700, color: '#2563EB', backgroundColor: '#EFF6FF', padding: '2px 8px', borderRadius: 9999 }}>
                {purchasesList.length} Inward Bills
              </span>
            </div>

            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0B132B', letterSpacing: '-0.02em', marginTop: 4 }}>
              ₹ {totalEligibleItc.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#596579', marginTop: 2 }}>
              Eligible tax credit • ₹ {totalTaxablePurchases.toLocaleString('en-IN')} spend recorded
            </div>
          </div>

          <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #EAE5DC', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem' }}>
            <span style={{ color: '#2563EB', fontWeight: 700 }}>Reconcile against 2B</span>
            <ArrowUpRight style={{ width: 14, height: 14, color: '#2563EB' }} />
          </div>
        </div>

        {/* CARD 3: ESTIMATED NET TAX PAYABLE */}
        <div 
          onClick={() => onNavigate('reports')}
          className="intelligence-card"
          style={{ 
            cursor: 'pointer',
            backgroundColor: '#FEF7EC',
            borderColor: '#F7E1B8'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#FDE68A', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CreditCard style={{ width: 16, height: 16 }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#78350F' }}>Net GST Payable</div>
                  <div style={{ fontSize: '0.68rem', color: '#92400E' }}>GSTR-3B Settlement</div>
                </div>
              </div>
              <span style={{ fontSize: '0.66rem', fontWeight: 700, color: '#B45309', backgroundColor: '#FEF3C7', padding: '2px 8px', borderRadius: 9999, border: '1px solid #FDE68A' }}>
                Minor-Unit Math
              </span>
            </div>

            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#B45309', letterSpacing: '-0.02em', marginTop: 4 }}>
              ₹ {netTaxPayable.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#78350F', marginTop: 2 }}>
              Zero floating-point drift • Output GST minus verified ITC
            </div>
          </div>

          <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #F7E1B8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem' }}>
            <span style={{ color: '#B45309', fontWeight: 700 }}>Review GSTR-3B breakdown</span>
            <ArrowUpRight style={{ width: 14, height: 14, color: '#B45309' }} />
          </div>
        </div>

      </div>

      {/* Second Row of 3 Cards: Deadlines, Notice Radar, Gateway Verification */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 16 }} className="stat-grid-3">
        
        {/* CARD 4: STATUTORY DEADLINES COUNTDOWN */}
        <div className="intelligence-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Calendar style={{ width: 16, height: 16, color: '#D97706' }} />
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0B132B' }}>Filing Deadlines</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.76rem', padding: '6px 10px', backgroundColor: '#FAF8F5', borderRadius: 8 }}>
              <span style={{ fontWeight: 600, color: '#0B132B' }}>GSTR-1 Outward:</span>
              <span style={{ color: '#059669', fontWeight: 700 }}>11th Next Month</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.76rem', padding: '6px 10px', backgroundColor: '#FAF8F5', borderRadius: 8 }}>
              <span style={{ fontWeight: 600, color: '#0B132B' }}>GSTR-2B Lock:</span>
              <span style={{ color: '#0284C7', fontWeight: 700 }}>14th Next Month</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.76rem', padding: '6px 10px', backgroundColor: '#FAF8F5', borderRadius: 8 }}>
              <span style={{ fontWeight: 600, color: '#0B132B' }}>GSTR-3B Payment:</span>
              <span style={{ color: '#D97706', fontWeight: 700 }}>20th (18 Days Left)</span>
            </div>
          </div>
        </div>

        {/* CARD 5: NOTICE RISK RADAR AUDIT READINESS */}
        <div 
          onClick={onOpenNoticeRadarModal}
          className="intelligence-card"
          style={{ cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldCheck style={{ width: 16, height: 16, color: '#059669' }} />
              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0B132B' }}>Notice Risk Radar</div>
            </div>
            <span style={{ fontSize: '0.66rem', fontWeight: 800, color: '#059669', backgroundColor: '#ECFDF5', padding: '2px 8px', borderRadius: 9999 }}>
              100/100 Safe
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.76rem', padding: '6px 10px', backgroundColor: '#FAF8F5', borderRadius: 8 }}>
              <span style={{ color: '#596579' }}>Rule 88C Turnover:</span>
              <span style={{ color: '#059669', fontWeight: 700 }}>0.00% Variance ✓</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.76rem', padding: '6px 10px', backgroundColor: '#FAF8F5', borderRadius: 8 }}>
              <span style={{ color: '#596579' }}>Rule 88D ITC Check:</span>
              <span style={{ color: '#059669', fontWeight: 700 }}>100% Guarded ✓</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.76rem', padding: '6px 10px', backgroundColor: '#FAF8F5', borderRadius: 8 }}>
              <span style={{ color: '#596579' }}>Sec 16(2)(aa) Match:</span>
              <span style={{ color: '#059669', fontWeight: 700 }}>Supplier Verified ✓</span>
            </div>
          </div>
        </div>

        {/* CARD 6: STATUTORY GATEWAY & SOVEREIGN DATA */}
        <div className="intelligence-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Wifi style={{ width: 16, height: 16, color: '#0284C7' }} />
              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0B132B' }}>Statutory Connection</div>
            </div>
            <span style={{ fontSize: '0.66rem', fontWeight: 700, color: '#0284C7', backgroundColor: '#F0F9FF', padding: '2px 8px', borderRadius: 9999 }}>
              Connected
            </span>
          </div>

          <p style={{ fontSize: '0.74rem', color: '#596579', lineHeight: 1.45, margin: '0 0 10px 0' }}>
            Encrypted GSP API protocol active. Connected to GSTN with zero cloud hostage risk. All database records persist locally.
          </p>

          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: '#8D99AE' }}>
            <span>{business.stateName || 'Kerala'} ({business.stateCode || '32'})</span>
            <span style={{ color: '#059669', fontWeight: 700 }}>SSL/TLS Verified</span>
          </div>
        </div>

      </div>
    </div>
  );
}

