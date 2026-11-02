'use client';

import React from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  Receipt, 
  ShoppingCart, 
  FileText,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

export default function FilingRunway({
  salesList = [],
  purchasesList = [],
  totalTaxableSales = 0,
  totalOutputTax = 0,
  totalTaxablePurchases = 0,
  totalEligibleItc = 0,
  netTaxPayable = 0,
  onNavigate
}) {
  const hasSales = salesList.length > 0;
  const hasPurchases = purchasesList.length > 0;

  const runwayStations = [
    {
      step: 1,
      name: 'Sales',
      code: 'GSTR-1',
      metric: hasSales ? `${salesList.length} Invoices` : '0 Invoices',
      subMetric: hasSales ? `₹ ${totalTaxableSales.toLocaleString('en-IN')} Taxable` : 'Awaiting bills',
      status: hasSales ? 'complete' : 'action',
      statusLabel: hasSales ? 'Recorded' : 'Action Needed',
      badgeColor: hasSales ? '#059669' : '#D97706',
      badgeBg: hasSales ? '#ECFDF5' : '#FEF3C7',
      tab: 'sales',
      isCurrent: !hasSales
    },
    {
      step: 2,
      name: 'Purchases',
      code: 'Inward Bills',
      metric: hasPurchases ? `${purchasesList.length} Bills` : '0 Bills',
      subMetric: hasPurchases ? `₹ ${totalTaxablePurchases.toLocaleString('en-IN')} Spend` : 'Awaiting entry',
      status: hasPurchases ? 'complete' : hasSales ? 'action' : 'waiting',
      statusLabel: hasPurchases ? 'Recorded' : hasSales ? 'Action Needed' : 'Pending',
      badgeColor: hasPurchases ? '#059669' : '#596579',
      badgeBg: hasPurchases ? '#ECFDF5' : '#F1F5F9',
      tab: 'purchases',
      isCurrent: hasSales && !hasPurchases
    },
    {
      step: 3,
      name: 'ITC',
      code: 'GSTR-2B Match',
      metric: `₹ ${totalEligibleItc.toLocaleString('en-IN')}`,
      subMetric: hasPurchases ? 'Section 16(2)(aa) verified' : 'ITC claimable',
      status: hasPurchases ? 'action' : 'waiting',
      statusLabel: hasPurchases ? 'Reconcile' : 'Pending',
      badgeColor: hasPurchases ? '#0D6258' : '#8D99AE',
      badgeBg: hasPurchases ? '#EEF8F6' : '#FAF8F5',
      tab: 'purchases',
      subTab: 'reconciliation',
      isCurrent: hasSales && hasPurchases
    },
    {
      step: 4,
      name: 'Tax',
      code: 'GSTR-3B Math',
      metric: `₹ ${netTaxPayable.toLocaleString('en-IN')}`,
      subMetric: `₹ ${totalOutputTax.toLocaleString('en-IN')} out - ITC`,
      status: hasSales ? 'ready' : 'waiting',
      statusLabel: hasSales ? 'Computed' : 'Waiting',
      badgeColor: '#059669',
      badgeBg: '#ECFDF5',
      tab: 'reports',
      isCurrent: false
    },
    {
      step: 5,
      name: 'File',
      code: 'Authorisation',
      metric: 'Ready',
      subMetric: 'Cryptographic safeguard',
      status: 'ready',
      statusLabel: 'Safe to File',
      badgeColor: '#0284C7',
      badgeBg: '#F0F9FF',
      tab: 'reports',
      isCurrent: false
    }
  ];

  return (
    <div className="filing-runway-container staged-enter-2" style={{ marginBottom: 28 }}>
      {/* Runway Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ 
            width: 30, 
            height: 30, 
            borderRadius: 8, 
            backgroundColor: '#0D6258', 
            color: '#FFFFFF', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '0.82rem',
            fontWeight: 800 
          }}>
            ⚡
          </div>
          <div>
            <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0B132B', letterSpacing: '-0.01em' }}>
              Statutory Filing Runway
            </div>
            <div style={{ fontSize: '0.74rem', color: '#596579' }}>
              5-Step Plain English Workflow • Verified from Invoice to Return Settlement
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.74rem', color: '#596579' }}>
          <span className="hide-on-mobile">Step 3 of 5 active</span>
          <button
            type="button"
            onClick={() => onNavigate('copilot')}
            style={{
              padding: '5px 12px',
              borderRadius: 8,
              backgroundColor: '#FAF8F5',
              border: '1px solid #EAE5DC',
              fontSize: '0.74rem',
              fontWeight: 700,
              color: '#0D6258',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <span>Open Copilot</span>
            <ChevronRight style={{ width: 13, height: 13 }} />
          </button>
        </div>
      </div>

      {/* Runway Station Cards Track */}
      <div className="filing-runway-track">
        {runwayStations.map((station) => {
          return (
            <div
              key={station.step}
              onClick={() => onNavigate(station.tab, station.subTab)}
              className={`filing-runway-station ${station.isCurrent ? 'active-station' : ''}`}
            >
              {/* Station Number & Code */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ 
                  fontSize: '0.68rem', 
                  fontWeight: 800, 
                  color: station.isCurrent ? '#0D6258' : '#8D99AE',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em' 
                }}>
                  0{station.step} • {station.code}
                </span>

                <span style={{ 
                  fontSize: '0.64rem', 
                  fontWeight: 700, 
                  color: station.badgeColor, 
                  backgroundColor: station.badgeBg, 
                  padding: '2px 7px', 
                  borderRadius: 9999 
                }}>
                  {station.statusLabel}
                </span>
              </div>

              {/* Station Name & Core Metric */}
              <div>
                <div style={{ fontSize: '1.02rem', fontWeight: 800, color: '#0B132B' }}>
                  {station.name}
                </div>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0D6258', marginTop: 2 }}>
                  {station.metric}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#596579', marginTop: 2, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {station.subMetric}
                </div>
              </div>

              {/* Station Bottom Progress Indicator */}
              <div style={{ 
                marginTop: 10, 
                height: 3, 
                backgroundColor: station.isCurrent ? '#0D6258' : station.status === 'complete' ? '#10B981' : '#EAE5DC', 
                borderRadius: 9999,
                transition: 'all 0.2s ease'
              }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

