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
  ChevronRight
} from 'lucide-react';
import { DEMO_BUSINESS, SAMPLE_SALES_SUMMARY, SAMPLE_PURCHASES_SUMMARY, TIMELINE_SAMPLE_ITEMS } from '../lib/showcaseData.js';

export default function HomeHeroDashboard({ onNavigate, onAskCopilot, onRequestCaSupport }) {
  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', width: '100%', paddingBottom: 64 }}>
      {/* Top Greeting & Demo Workspace Pill */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 className="font-editorial" style={{ fontSize: '2.5rem', fontWeight: 500, color: '#0B132B', margin: 0 }}>
              Good evening, Anaya
            </h1>
            <span style={{ 
              fontSize: '0.72rem', 
              fontWeight: 800, 
              padding: '3px 10px', 
              borderRadius: 9999, 
              backgroundColor: '#ECFDF5', 
              color: '#0E7051', 
              border: '1px solid #A7F3D0',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
              <span>Live Books Active</span>
            </span>
          </div>
          <p style={{ fontSize: '1rem', color: '#596579', marginTop: 6 }}>
            Your September GST review is nearly ready. Period: <strong>September 2026</strong>.
          </p>
        </div>

        {/* Business Context Monogram Pill */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 10, 
          padding: '8px 16px', 
          backgroundColor: '#FFFFFF', 
          borderRadius: 14, 
          border: '1px solid #EAE5DC',
          boxShadow: '0 2px 6px rgba(11, 19, 43, 0.03)'
        }}>
          <div style={{ 
            width: 32, 
            height: 32, 
            borderRadius: 8, 
            backgroundColor: '#0D6258', 
            color: '#FFFFFF', 
            fontWeight: 800, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '0.8rem' 
          }}>
            AH
          </div>
          <div>
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0B132B' }}>
              {DEMO_BUSINESS.tradeName}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#8D99AE' }}>
              Kochi, Kerala • GSTIN: {DEMO_BUSINESS.gstin}
            </div>
          </div>
        </div>
      </div>

      {/* WIDE "NEXT BEST STEP" HERO PANEL */}
      <div style={{ 
        backgroundColor: '#FFFFFF', 
        borderRadius: 22, 
        border: '1px solid #EAE5DC', 
        padding: '28px 32px', 
        boxShadow: '0 8px 30px -6px rgba(11, 19, 43, 0.06)',
        marginBottom: 32,
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: 36,
        alignItems: 'center'
      }}>
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
              YOUR NEXT STEP
            </span>
            <span style={{ fontSize: '0.78rem', color: '#8D99AE' }}>
              Estimated time: ~2 minutes
            </span>
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0B132B', margin: '4px 0 10px 0', letterSpacing: '-0.02em' }}>
            Review 3 purchase differences
          </h2>

          <p style={{ fontSize: '0.94rem', color: '#596579', lineHeight: 1.6, maxWidth: 540, margin: '0 0 22px 0' }}>
            We found a few purchase records that need a quick check before you review your GST summary. Differences like vendor trade discounts are completely normal.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button
              type="button"
              onClick={() => onNavigate('purchases', 'reconciliation')}
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
              <span>Review Differences</span>
              <ArrowRight style={{ width: 16, height: 16 }} />
            </button>

            <button
              type="button"
              onClick={() => onAskCopilot('Why do I have differences?')}
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

        {/* Right side: 4-Stage Progress Journey */}
        <div style={{ 
          backgroundColor: '#FAF8F5', 
          borderRadius: 18, 
          padding: 20, 
          border: '1px solid #EAE5DC' 
        }}>
          <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8D99AE', fontWeight: 800, marginBottom: 14 }}>
            September GST Review Stages
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { title: '1. Sales recorded', detail: '124 sales invoices confirmed', status: 'done', icon: CheckCircle2, color: '#0E7051' },
              { title: '2. Purchases recorded', detail: '86 vendor bills matched', status: 'done', icon: CheckCircle2, color: '#0E7051' },
              { title: '3. Differences to check', detail: '3 items pending your confirmation', status: 'active', icon: Clock, color: '#B45309' },
              { title: '4. GST summary waiting', detail: 'GSTR-3B net payable ready', status: 'waiting', icon: FileText, color: '#8D99AE' },
            ].map((st) => {
              const Icon = st.icon;
              return (
                <div 
                  key={st.title}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 12,
                    backgroundColor: st.status === 'active' ? '#FFFFFF' : 'transparent',
                    border: st.status === 'active' ? '1px solid #F7E1B8' : '1px solid transparent',
                    boxShadow: st.status === 'active' ? '0 2px 8px rgba(180, 83, 9, 0.08)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Icon style={{ width: 16, height: 16, color: st.color }} />
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: st.status === 'waiting' ? '#8D99AE' : '#0B132B' }}>
                        {st.title}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#596579' }}>
                        {st.detail}
                      </div>
                    </div>
                  </div>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    fontWeight: 700, 
                    color: st.color,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em' 
                  }}>
                    {st.status === 'done' ? 'Complete' : st.status === 'active' ? 'Action' : 'Waiting'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ASYMMETRIC TWO-COLUMN COMPOSITION */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 32 }}>

        {/* LEFT COLUMN: AT A GLANCE + GUIDED CHECKLIST + MADE FOR CLARITY */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          
          {/* This Month at a Glance (Concise labelled facts, not huge ticker tiles) */}
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
              <span style={{ fontSize: '0.74rem', color: '#8D99AE' }}>September 2026</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              <div style={{ padding: '14px 16px', backgroundColor: '#FAF8F5', borderRadius: 14, border: '1px solid #EAE5DC' }}>
                <div style={{ fontSize: '0.72rem', color: '#596579', fontWeight: 600 }}>Sales Records</div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0B132B', marginTop: 2 }}>124</div>
                <div style={{ fontSize: '0.72rem', color: '#0E7051', fontWeight: 600, marginTop: 2 }}>₹8.42L taxable (Sample)</div>
              </div>

              <div style={{ padding: '14px 16px', backgroundColor: '#FAF8F5', borderRadius: 14, border: '1px solid #EAE5DC' }}>
                <div style={{ fontSize: '0.72rem', color: '#596579', fontWeight: 600 }}>Purchase Records</div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0B132B', marginTop: 2 }}>86</div>
                <div style={{ fontSize: '0.72rem', color: '#0D6258', fontWeight: 600, marginTop: 2 }}>₹74.8K tax credit (ITC)</div>
              </div>

              <div style={{ padding: '14px 16px', backgroundColor: '#FEF7EC', borderRadius: 14, border: '1px solid #F7E1B8' }}>
                <div style={{ fontSize: '0.72rem', color: '#B45309', fontWeight: 600 }}>GST Summary Status</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#B45309', marginTop: 4 }}>In review</div>
                <div style={{ fontSize: '0.7rem', color: '#596579', marginTop: 2 }}>GSTR-3B draft</div>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { 
                  title: '1. Report your business sales', 
                  sub: 'GSTR-1 • 124 sales invoices recorded and organised', 
                  badge: 'Complete', 
                  color: '#0E7051', 
                  bg: '#ECFDF5',
                  tab: 'sales'
                },
                { 
                  title: '2. Review your purchase bills', 
                  sub: '86 bills uploaded • Potential ITC: ₹ 74,800', 
                  badge: 'Complete', 
                  color: '#0E7051', 
                  bg: '#ECFDF5',
                  tab: 'purchases'
                },
                { 
                  title: '3. Check purchase differences', 
                  sub: 'Purchase reconciliation • 3 items need attention', 
                  badge: 'Action needed', 
                  color: '#B45309', 
                  bg: '#FEF7EC',
                  tab: 'purchases',
                  subTab: 'reconciliation'
                },
                { 
                  title: '4. Review your GST summary', 
                  sub: 'GSTR-3B • Estimated net tax payable: ₹ 76,760 (Sample)', 
                  badge: 'Waiting for review', 
                  color: '#596579', 
                  bg: '#FAF8F5',
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
                Every purchase bill you record from verified suppliers reduces your net GST payment rupee-for-rupee. For September, your 86 matched bills save your business <strong>₹ 74,800</strong> in taxes legally.
              </p>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: TIMELINE + GST CONNECTION + CA SUPPORT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* What's Coming Up (Timeline with sample dates) */}
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
              <span style={{ fontSize: '0.72rem', color: '#B45309', fontWeight: 700, backgroundColor: '#FEF7EC', padding: '2px 8px', borderRadius: 6 }}>
                Sample Dates
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

          {/* Business GST Connection (Active Mode) */}
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
                GST Connection • Active Portal Mode
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#596579', lineHeight: 1.5, margin: '0 0 14px 0' }}>
              Your workspace is securely connected under verified statutory GST Suvidha Provider (GSP) protocols. All outward sales and purchase credits are reconciled.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem', color: '#8D99AE' }}>
              <span>Kerala State Jurisdiction (32)</span>
              <span style={{ color: '#0E7051', fontWeight: 700 }}>Connection Active</span>
            </div>
          </div>

          {/* Need a Human? CA Support Card */}
          <div style={{ 
            backgroundColor: '#FAF8F5', 
            borderRadius: 18, 
            border: '1px solid #EAE5DC', 
            padding: 22,
            boxShadow: '0 2px 8px rgba(11, 19, 43, 0.02)'
          }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8D99AE', fontWeight: 800, marginBottom: 12 }}>
              NEED A HUMAN ADVISOR?
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
                {DEMO_BUSINESS.advisor.avatarInitials}
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0B132B' }}>
                  {DEMO_BUSINESS.advisor.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#596579' }}>
                  {DEMO_BUSINESS.advisor.firm} • Kochi
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

