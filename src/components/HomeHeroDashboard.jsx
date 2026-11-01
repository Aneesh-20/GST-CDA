'use client';

import React from 'react';
import { 
  ArrowRight, 
  HelpCircle, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText, 
  ShieldCheck, 
  Users, 
  Receipt, 
  ShoppingCart, 
  Sparkles, 
  Info, 
  ChevronRight,
  TrendingUp,
  Gift,
  Share2,
  Edit2
} from 'lucide-react';
import { 
  TIMELINE_SAMPLE_ITEMS,
  COMPLIANCE_SCORE,
  COMPLIANCE_STATUS_LIST,
  REFERRAL_ENGINE_DATA
} from '../lib/showcaseData.js';
import { DEFAULT_BUSINESS } from '../lib/realtimeData.js';

export default function HomeHeroDashboard({ 
  business = DEFAULT_BUSINESS,
  salesList = [],
  purchasesList = [],
  onNavigate, 
  onAskCopilot, 
  onRequestCaSupport,
  onOpenBusinessModal
}) {
  const totalTaxableSales = salesList.reduce((acc, s) => acc + (s.taxableRupees || 0), 0);
  const totalOutputTax = salesList.reduce((acc, s) => acc + (s.gstPaise || 0), 0);
  const totalTaxablePurchases = purchasesList.reduce((acc, p) => acc + (p.taxableRupees || 0), 0);
  const totalEligibleItc = purchasesList.reduce((acc, p) => acc + (p.gstPaise || 0), 0);
  const netTaxPayable = Math.max(0, totalOutputTax - totalEligibleItc);

  const advisor = business.advisor || DEFAULT_BUSINESS.advisor;
  const initials = business.tradeName
    ? business.tradeName.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
    : 'GST';

  const dynamic5Steps = [
    {
      step: 1,
      title: 'Sales',
      prompt: salesList.length > 0 ? `${salesList.length} sales invoices recorded` : 'Upload your sales invoices',
      detail: `${salesList.length} sales invoices (₹ ${totalTaxableSales.toLocaleString('en-IN')} taxable)`,
      status: salesList.length > 0 ? 'complete' : 'action',
      badge: salesList.length > 0 ? 'Uploaded' : 'Action needed',
      color: salesList.length > 0 ? '#0E7051' : '#B45309',
      bg: salesList.length > 0 ? '#ECFDF5' : '#FEF7EC',
      tab: 'sales'
    },
    {
      step: 2,
      title: 'Purchases',
      prompt: purchasesList.length > 0 ? `Found ₹ ${totalTaxablePurchases.toLocaleString('en-IN')} of purchase bills` : 'Upload your purchase bills',
      detail: `${purchasesList.length} vendor bills recorded`,
      status: purchasesList.length > 0 ? 'complete' : 'ready',
      badge: purchasesList.length > 0 ? 'Found' : 'Upload',
      color: '#0E7051',
      bg: '#ECFDF5',
      tab: 'purchases'
    },
    {
      step: 3,
      title: 'ITC',
      prompt: `Available input tax credit: ₹ ${totalEligibleItc.toLocaleString('en-IN')}`,
      detail: `${purchasesList.length} bills reconciled for maximum credit`,
      status: 'action',
      badge: purchasesList.length > 0 ? 'Reconciled' : 'Review',
      color: '#B45309',
      bg: '#FEF7EC',
      tab: 'purchases',
      subTab: 'reconciliation'
    },
    {
      step: 4,
      title: 'Tax',
      prompt: `Estimated GST payable: ₹ ${netTaxPayable.toLocaleString('en-IN')}`,
      detail: `Net math: ₹ ${totalOutputTax.toLocaleString('en-IN')} output minus ₹ ${totalEligibleItc.toLocaleString('en-IN')} credit`,
      status: 'ready',
      badge: 'Estimated',
      color: '#0D6258',
      bg: '#EEF8F6',
      tab: 'reports'
    },
    {
      step: 5,
      title: 'File',
      prompt: 'Your return is ready. Review and authorise filing.',
      detail: 'Cryptographic review safeguard before GSP submission',
      status: 'waiting',
      badge: 'Ready to Authorise',
      color: '#596579',
      bg: '#FAF8F5',
      tab: 'reports'
    }
  ];

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', width: '100%', paddingBottom: 64 }}>
      
      {/* Top Greeting & PDF Section 3 Hero Hook */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span style={{ 
              fontSize: '0.74rem', 
              fontWeight: 800, 
              color: '#0D6258', 
              backgroundColor: '#EEF8F6', 
              padding: '3px 10px', 
              borderRadius: 9999,
              border: '1px solid #B2DDD7',
              letterSpacing: '0.04em'
            }}>
              GST Made Simple. Business Made Easy.
            </span>
            <span style={{ fontSize: '0.74rem', color: '#8D99AE' }}>
              Period: {business.period || 'Current Tax Period'}
            </span>
          </div>

          <h1 className="font-editorial hero-greeting-title">
            Good day{business.contactName ? `, ${business.contactName}` : (business.tradeName ? `, ${business.tradeName}` : '')}
          </h1>
          
          <div style={{ fontSize: '1.18rem', fontWeight: 700, color: '#0D6258', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles style={{ width: 18, height: 18, color: '#C87D0E' }} />
            <span>“Your GST review is ready.”</span>
          </div>
        </div>

        {/* Business Monogram & Entity Pill */}
        <div 
          onClick={onOpenBusinessModal}
          title="Click to change company name, GSTIN, and filing period"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12, 
            padding: '10px 18px', 
            backgroundColor: '#FFFFFF', 
            borderRadius: 14, 
            border: '1px solid #EAE5DC',
            boxShadow: '0 2px 6px rgba(11, 19, 43, 0.03)',
            cursor: 'pointer',
            transition: 'border-color 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#0D6258'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = '#EAE5DC'}
        >
          <div style={{ 
            width: 36, 
            height: 36, 
            borderRadius: 10, 
            backgroundColor: '#0D6258', 
            color: '#FFFFFF', 
            fontWeight: 800, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '0.85rem' 
          }}>
            {initials}
          </div>
          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0B132B', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>{business.tradeName || 'Configure Your Business'}</span>
              <span style={{ fontSize: '0.64rem', color: '#0D6258', backgroundColor: '#EEF8F6', padding: '1px 6px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                <Edit2 style={{ width: 10, height: 10 }} />
                <span>{business.tradeName ? 'Edit' : 'Setup'}</span>
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#596579' }}>
              {business.city ? `${business.city}, ` : ''}{business.stateName || 'Kerala'} ({business.stateCode || '32'}) • GSTIN: <span style={{ fontFamily: 'monospace' }}>{business.gstin || 'Not configured'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* PDF SECTION 3: THE 5-STEP MODEL HERO PANEL              */}
      {/* ======================================================== */}
      <div className="hero-five-step-panel">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ 
              fontSize: '0.7rem', 
              fontWeight: 800, 
              textTransform: 'uppercase', 
              letterSpacing: '0.06em', 
              color: '#B45309', 
              backgroundColor: '#FEF7EC', 
              padding: '4px 10px', 
              borderRadius: 9999,
              border: '1px solid #F7E1B8'
            }}>
              YOUR NEXT STEP • STEP 3 OF 5
            </span>
            <span style={{ fontSize: '0.78rem', color: '#8D99AE' }}>
              Estimated time: ~2 minutes
            </span>
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0B132B', margin: '4px 0 10px 0', letterSpacing: '-0.02em' }}>
            {purchasesList.length > 0 ? 'Review purchase credit differences' : 'Upload real sales & purchase data'}
          </h2>

          <p style={{ fontSize: '0.94rem', color: '#596579', lineHeight: 1.6, maxWidth: 540, margin: '0 0 22px 0' }}>
            {purchasesList.length > 0 
              ? 'We compare your recorded purchase bills with supplier filings in GSTR-2B. Differences like trade discounts are handled smoothly to protect your eligible tax credits under Section 16(2)(aa).'
              : 'Add your sales invoices and inward purchase bills using CSV, Excel spreadsheets, or PDF invoice scans. All taxes calculate automatically with zero floating-point drift.'}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => onNavigate(purchasesList.length > 0 ? 'purchases' : 'sales', purchasesList.length > 0 ? 'reconciliation' : undefined)}
              style={{
                padding: '12px 24px',
                fontSize: '0.92rem',
                fontWeight: 700,
                color: '#FFFFFF',
                backgroundColor: '#0D6258',
                border: 'none',
                borderRadius: 12,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 16px rgba(13, 98, 88, 0.28)'
              }}
            >
              <span>{purchasesList.length > 0 ? 'Review Differences' : 'Manage Invoices'}</span>
              <ArrowRight style={{ width: 16, height: 16 }} />
            </button>

            <button
              type="button"
              onClick={() => onAskCopilot && onAskCopilot('How is my net tax calculated?')}
              style={{
                padding: '12px 20px',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: '#596579',
                backgroundColor: 'transparent',
                border: '1px solid #DCD5C9',
                borderRadius: 12,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <HelpCircle style={{ width: 15, height: 15, color: '#8D99AE' }} />
              <span>Ask why this matters</span>
            </button>
          </div>
        </div>

        {/* Right: The 5-Step Model Progression from PDF Page 2 */}
        <div style={{ 
          backgroundColor: '#FAF8F5', 
          borderRadius: 18, 
          padding: 20, 
          border: '1px solid #EAE5DC' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8D99AE', fontWeight: 800 }}>
              The 5-Step GST Copilot Model
            </div>
            <span style={{ fontSize: '0.7rem', color: '#0D6258', fontWeight: 700 }}>
              Step 3 in focus
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {dynamic5Steps.map((step) => {
              const isAction = step.status === 'action';
              const isDone = step.status === 'complete';
              return (
                <div 
                  key={step.step}
                  onClick={() => onNavigate(step.tab, step.subTab)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 10,
                    backgroundColor: isAction ? '#FFFFFF' : 'transparent',
                    border: isAction ? '1px solid #F7E1B8' : '1px solid transparent',
                    boxShadow: isAction ? '0 2px 8px rgba(180, 83, 9, 0.08)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.12s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ 
                      width: 22, 
                      height: 22, 
                      borderRadius: '50%', 
                      backgroundColor: isDone ? '#ECFDF5' : isAction ? '#FEF7EC' : '#EEF8F6',
                      color: step.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      fontWeight: 800
                    }}>
                      {isDone ? '✓' : step.step}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0B132B' }}>
                        Step {step.step} — {step.title}: <span style={{ fontWeight: 500, color: '#596579' }}>“{step.prompt}”</span>
                      </div>
                    </div>
                  </div>
                  <span style={{ 
                    fontSize: '0.66rem', 
                    fontWeight: 700, 
                    color: step.color,
                    backgroundColor: step.bg,
                    padding: '2px 8px',
                    borderRadius: 9999 
                  }}>
                    {step.badge}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2-COLUMN DASHBOARD GRID                                  */}
      {/* ======================================================== */}
      <div className="dashboard-two-col">

        {/* LEFT COLUMN: AT A GLANCE + GUIDED CHECKLIST + MADE FOR CLARITY */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          
          {/* This Month at a Glance */}
          <div style={{ 
            backgroundColor: '#FFFFFF', 
            borderRadius: 18, 
            border: '1px solid #EAE5DC', 
            padding: 24,
            boxShadow: '0 2px 8px rgba(11, 19, 43, 0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0B132B' }}>
                This month at a glance
              </div>
              <span style={{ fontSize: '0.74rem', color: '#8D99AE' }}>{business.period || 'September 2026'}</span>
            </div>

            <div className="stat-grid-3">
              <div style={{ padding: '14px 16px', backgroundColor: '#FAF8F5', borderRadius: 14, border: '1px solid #EAE5DC' }}>
                <div style={{ fontSize: '0.72rem', color: '#596579', fontWeight: 600 }}>Sales Records</div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0B132B', marginTop: 2 }}>{salesList.length}</div>
                <div style={{ fontSize: '0.72rem', color: '#0E7051', fontWeight: 600, marginTop: 2 }}>
                  ₹ {totalTaxableSales.toLocaleString('en-IN')} taxable
                </div>
              </div>

              <div style={{ padding: '14px 16px', backgroundColor: '#FAF8F5', borderRadius: 14, border: '1px solid #EAE5DC' }}>
                <div style={{ fontSize: '0.72rem', color: '#596579', fontWeight: 600 }}>Purchase Records</div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0B132B', marginTop: 2 }}>{purchasesList.length}</div>
                <div style={{ fontSize: '0.72rem', color: '#0D6258', fontWeight: 600, marginTop: 2 }}>
                  ₹ {totalEligibleItc.toLocaleString('en-IN')} tax credit (ITC)
                </div>
              </div>

              <div style={{ padding: '14px 16px', backgroundColor: '#FEF7EC', borderRadius: 14, border: '1px solid #F7E1B8' }}>
                <div style={{ fontSize: '0.72rem', color: '#B45309', fontWeight: 600 }}>Net Tax Payable</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#B45309', marginTop: 4 }}>
                  ₹ {netTaxPayable.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#596579', marginTop: 2 }}>GSTR-3B settlement</div>
              </div>
            </div>
          </div>

          {/* Your GST Journey (Vertical Guided Checklist) */}
          <div style={{ 
            backgroundColor: '#FFFFFF', 
            borderRadius: 18, 
            border: '1px solid #EAE5DC', 
            padding: 24,
            boxShadow: '0 2px 8px rgba(11, 19, 43, 0.03)'
          }}>
            <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0B132B', marginBottom: 16 }}>
              Your GST journey
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { 
                  title: '1. Report your business sales', 
                  sub: `GSTR-1 • ${salesList.length} sales invoices recorded and organised (₹ ${totalTaxableSales.toLocaleString('en-IN')})`, 
                  badge: salesList.length > 0 ? 'Complete' : 'Action needed', 
                  color: salesList.length > 0 ? '#0E7051' : '#B45309', 
                  bg: salesList.length > 0 ? '#ECFDF5' : '#FEF7EC',
                  tab: 'sales'
                },
                { 
                  title: '2. Review your purchase bills', 
                  sub: `${purchasesList.length} bills recorded • Eligible ITC: ₹ ${totalEligibleItc.toLocaleString('en-IN')}`, 
                  badge: purchasesList.length > 0 ? 'Complete' : 'Upload', 
                  color: purchasesList.length > 0 ? '#0E7051' : '#596579', 
                  bg: purchasesList.length > 0 ? '#ECFDF5' : '#FAF8F5',
                  tab: 'purchases'
                },
                { 
                  title: '3. Check purchase differences', 
                  sub: 'Purchase reconciliation • Verified for Section 16(2)(aa)', 
                  badge: 'Verified', 
                  color: '#0E7051', 
                  bg: '#ECFDF5',
                  tab: 'purchases',
                  subTab: 'reconciliation'
                },
                { 
                  title: '4. Review your GST summary', 
                  sub: `GSTR-3B • Estimated net tax payable: ₹ ${netTaxPayable.toLocaleString('en-IN')}`, 
                  badge: 'Ready for review', 
                  color: '#0D6258', 
                  bg: '#EEF8F6',
                  tab: 'reports'
                },
              ].map((j) => (
                <div
                  key={j.title}
                  onClick={() => onNavigate(j.tab, j.subTab)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 12,
                    backgroundColor: '#FAF8F5',
                    border: '1px solid #EAE5DC',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#0D6258'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#EAE5DC'}
                >
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0B132B' }}>
                      {j.title}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#596579', marginTop: 2 }}>
                      {j.sub}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ 
                      fontSize: '0.72rem', 
                      fontWeight: 700, 
                      color: j.color, 
                      backgroundColor: j.bg, 
                      padding: '3px 10px', 
                      borderRadius: 9999 
                    }}>
                      {j.badge}
                    </span>
                    <ChevronRight style={{ width: 14, height: 14, color: '#8D99AE' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PDF Section 8: Referral Engine Growth Card */}
          <div style={{ 
            backgroundColor: '#FEF7EC', 
            borderRadius: 18, 
            border: '1px solid #F7E1B8', 
            padding: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 12, 
                backgroundColor: '#C87D0E', 
                color: '#FFFFFF', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Gift style={{ width: 20, height: 20 }} />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#B45309' }}>
                  {REFERRAL_ENGINE_DATA.postFilingHeadline}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#78350F', marginTop: 2 }}>
                  {REFERRAL_ENGINE_DATA.referrerReward} ({REFERRAL_ENGINE_DATA.refereeReward})
                </div>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => onNavigate('referral')}
              style={{
                padding: '8px 16px',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#FFFFFF',
                backgroundColor: '#B45309',
                border: 'none',
                borderRadius: 10,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Share Code {REFERRAL_ENGINE_DATA.referralCode}
            </button>
          </div>

          {/* "Made for Clarity" Insight Card */}
          <div style={{ 
            backgroundColor: '#EEF8F6', 
            borderRadius: 18, 
            border: '1px solid #B2DDD7', 
            padding: 20,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 14
          }}>
            <div style={{ 
              width: 36, 
              height: 36, 
              borderRadius: 10, 
              backgroundColor: '#0D6258', 
              color: '#FFFFFF', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Sparkles style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0D6258' }}>
                Made for clarity: Why keeping purchase bills matters
              </div>
              <p style={{ fontSize: '0.8rem', color: '#084039', lineHeight: 1.5, margin: '4px 0 0 0' }}>
                Every purchase bill you record from verified suppliers reduces your net GST payment rupee-for-rupee. In your current register, your {purchasesList.length} inward bills save your business <strong>₹ {totalEligibleItc.toLocaleString('en-IN')}</strong> in taxes legally.
              </p>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: TIMELINE + GST CONNECTION + CA SUPPORT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* What's Coming Up (Timeline with Due-Date Engine) */}
          <div style={{ 
            backgroundColor: '#FFFFFF', 
            borderRadius: 18, 
            border: '1px solid #EAE5DC', 
            padding: 24,
            boxShadow: '0 2px 8px rgba(11, 19, 43, 0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0B132B' }}>
                What’s coming up
              </div>
              <span style={{ fontSize: '0.72rem', color: '#0D6258', fontWeight: 700, backgroundColor: '#EEF8F6', padding: '2px 8px', borderRadius: 6 }}>
                Due-Date Engine
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {TIMELINE_SAMPLE_ITEMS.map((item) => (
                <div 
                  key={item.title}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 12,
                    backgroundColor: '#FAF8F5',
                    border: '1px solid #EAE5DC',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12
                  }}
                >
                  <div style={{ 
                    padding: '4px 8px', 
                    borderRadius: 8, 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #DCD5C9', 
                    fontSize: '0.72rem', 
                    fontWeight: 800, 
                    color: '#0B132B',
                    whiteSpace: 'nowrap'
                  }}>
                    {item.date}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0B132B' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#596579', marginTop: 2 }}>
                      {item.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Business GST Connection (Active Portal Mode) */}
          <div style={{ 
            backgroundColor: '#FFFFFF', 
            borderRadius: 18, 
            border: '1px solid #EAE5DC', 
            padding: 22,
            boxShadow: '0 2px 8px rgba(11, 19, 43, 0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <ShieldCheck style={{ width: 18, height: 18, color: '#0D6258' }} />
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0B132B' }}>
                GST Connection • Statutory Portal Mode
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#596579', lineHeight: 1.5, margin: '0 0 14px 0' }}>
              Your workspace connects through verified statutory GST Suvidha Provider (GSP) APIs to GSTN. Deterministic rules govern all outward sales and purchase reconciliations.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem', color: '#8D99AE' }}>
              <span>{business.stateName || 'Kerala'} State Jurisdiction ({business.stateCode || '32'})</span>
              <span style={{ color: '#0E7051', fontWeight: 700 }}>Connection Active</span>
            </div>
          </div>

          {/* CA / Agent Connect Card */}
          <div style={{ 
            backgroundColor: '#FAF8F5', 
            borderRadius: 18, 
            border: '1px solid #EAE5DC', 
            padding: 22,
            boxShadow: '0 2px 8px rgba(11, 19, 43, 0.02)'
          }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8D99AE', fontWeight: 800, marginBottom: 12 }}>
              CA / AGENT CONNECT (OPTIONAL ASSISTANCE)
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ 
                width: 44, 
                height: 44, 
                borderRadius: '50%', 
                backgroundColor: '#0D6258', 
                color: '#FFFFFF', 
                fontWeight: 800, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '0.92rem',
                border: '2px solid #FFFFFF',
                boxShadow: '0 4px 10px rgba(13, 98, 88, 0.2)'
              }}>
                {advisor.avatarInitials || 'CA'}
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0B132B' }}>
                  {advisor.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#596579' }}>
                  {advisor.firm} • {advisor.city || business.city || 'Kochi'}
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.78rem', color: '#596579', lineHeight: 1.45, margin: '0 0 16px 0' }}>
              Your tax accountant can view your verified sales, check vendor differences, and approve your GSTR-3B return in this shared secure vault.
            </p>

            <button
              type="button"
              onClick={onRequestCaSupport}
              style={{
                width: '100%',
                padding: '10px 16px',
                fontSize: '0.84rem',
                fontWeight: 700,
                color: '#0B132B',
                backgroundColor: '#FFFFFF',
                border: '1px solid #DCD5C9',
                borderRadius: 10,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              <Users style={{ width: 14, height: 14, color: '#0D6258' }} />
              <span>Request Advisor Review</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
