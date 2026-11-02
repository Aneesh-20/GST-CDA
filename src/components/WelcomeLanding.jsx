'use client';

import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Bot, 
  FileText, 
  GitCompare, 
  ChevronRight,
  TrendingUp,
  Receipt,
  HeartHandshake,
  Scale,
  X,
  Lock
} from 'lucide-react';
import { CLEAR_TAX_COMPARISON_MATRIX } from '../lib/showcaseData.js';

export default function WelcomeLanding({ onGetStarted, onExploreDemo }) {
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAF8F5', color: '#0B132B', display: 'flex', flexDirection: 'column' }}>
      {/* Top Quiet Navigation */}
      <header style={{ 
        height: 72, 
        borderBottom: '1px solid #EAE5DC', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '0 36px',
        backgroundColor: 'rgba(250, 248, 245, 0.85)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ 
            width: 36, 
            height: 36, 
            borderRadius: 10, 
            backgroundColor: '#0D6258', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '1rem',
            letterSpacing: '-0.02em',
            boxShadow: '0 4px 12px rgba(13, 98, 88, 0.25)'
          }}>
            TM
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.98rem', letterSpacing: '-0.02em', color: '#0B132B' }}>
              TaxMate
            </div>
            <div style={{ fontSize: '0.7rem', color: '#596579', letterSpacing: '0.02em' }}>
              Smart GST Compliance Companion
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ 
            fontSize: '0.76rem', 
            padding: '4px 10px', 
            borderRadius: 9999, 
            backgroundColor: '#FEF7EC', 
            color: '#B45309', 
            border: '1px solid #F7E1B8',
            fontWeight: 700 
          }}>
            September 2026 Active
          </span>

          <button
            type="button"
            onClick={() => setIsComparisonOpen(true)}
            style={{
              padding: '6px 14px',
              fontSize: '0.8rem',
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
            <Scale style={{ width: 13, height: 13, color: '#C87D0E' }} />
            <span>Why Us vs ClearTax</span>
          </button>

          <button
            type="button"
            onClick={onExploreDemo}
            style={{
              padding: '8px 16px',
              fontSize: '0.84rem',
              fontWeight: 600,
              color: '#0B132B',
              backgroundColor: 'transparent',
              border: '1px solid #DCD5C9',
              borderRadius: 10,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Explore Live App
          </button>

          <button
            type="button"
            onClick={onGetStarted}
            style={{
              padding: '8px 18px',
              fontSize: '0.84rem',
              fontWeight: 700,
              color: '#FFFFFF',
              backgroundColor: '#0D6258',
              border: '1px solid #084039',
              borderRadius: 10,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 4px 14px rgba(13, 98, 88, 0.22)',
              transition: 'all 0.15s ease'
            }}
          >
            <span>Get Started</span>
            <ArrowRight style={{ width: 14, height: 14 }} />
          </button>
        </div>
      </header>

      {/* Main Split Hero Canvas */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '48px 24px 64px', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <div className="dashboard-two-col" style={{ width: '100%', alignItems: 'center' }}>
          
          {/* Left Column: Editorial Value Proposition */}
          <div>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: 7, 
              padding: '6px 12px', 
              borderRadius: 9999, 
              backgroundColor: '#EEF8F6', 
              border: '1px solid #B2DDD7', 
              color: '#0D6258',
              fontSize: '0.78rem',
              fontWeight: 700,
              marginBottom: 20
            }}>
              <Sparkles style={{ width: 14, height: 14, color: '#0D6258' }} />
              <span>GST Made Simple. Business Made Easy.</span>
            </div>

            <h1 className="font-editorial" style={{ 
              fontSize: '3.6rem', 
              fontWeight: 500, 
              lineHeight: 1.08, 
              letterSpacing: '-0.03em', 
              color: '#0B132B',
              marginBottom: 20
            }}>
              GST, without the guesswork.
            </h1>

            <p style={{ 
              fontSize: '1.16rem', 
              lineHeight: 1.6, 
              color: '#596579', 
              maxWidth: 510,
              marginBottom: 32,
              fontWeight: 400
            }}>
              A calm, guided way to keep your business GST-ready. Built specifically for business owners who have never opened an accounting textbook.
            </p>

            {/* 4-Stage Progressive Journey Path */}
            <div style={{ 
              padding: '16px 20px', 
              backgroundColor: '#FFFFFF', 
              borderRadius: 16, 
              border: '1px solid #EAE5DC', 
              boxShadow: '0 2px 8px rgba(11, 19, 43, 0.03)',
              marginBottom: 36,
              maxWidth: 520
            }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8D99AE', fontWeight: 800, marginBottom: 10 }}>
                The 4-Step Confidence Journey
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                {[
                  { step: '1', title: 'Sales', state: 'Complete', color: '#0E7051' },
                  { step: '2', title: 'Purchases', state: 'Organised', color: '#0E7051' },
                  { step: '3', title: 'Review', state: '3 Differences', color: '#B45309' },
                  { step: '4', title: 'Ready', state: 'GSTR-3B', color: '#0D6258' },
                ].map((item, i, arr) => (
                  <React.Fragment key={item.step}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ 
                        width: 24, 
                        height: 24, 
                        borderRadius: '50%', 
                        backgroundColor: i < 2 ? '#ECFDF5' : i === 2 ? '#FEF7EC' : '#EEF8F6',
                        color: item.color,
                        border: `1px solid ${item.color}40`,
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '0.72rem',
                        fontWeight: 800
                      }}>
                        {item.step}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0B132B' }}>{item.title}</div>
                        <div style={{ fontSize: '0.68rem', color: item.color, fontWeight: 600 }}>{item.state}</div>
                      </div>
                    </div>
                    {i < arr.length - 1 && (
                      <div style={{ flex: 1, height: 1, backgroundColor: '#EAE5DC', margin: '0 10px' }} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <button
                type="button"
                onClick={onGetStarted}
                style={{
                  padding: '14px 28px',
                  fontSize: '0.96rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  backgroundColor: '#0D6258',
                  border: '1px solid #084039',
                  borderRadius: 14,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 8px 24px -4px rgba(13, 98, 88, 0.35)',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>Get Started in 60 Seconds</span>
                <ArrowRight style={{ width: 17, height: 17 }} />
              </button>

              <button
                type="button"
                onClick={onExploreDemo}
                style={{
                  padding: '14px 24px',
                  fontSize: '0.96rem',
                  fontWeight: 600,
                  color: '#0B132B',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #DCD5C9',
                  borderRadius: 14,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.15s ease'
                }}
              >
                <span>Explore Live Workspace</span>
                <ChevronRight style={{ width: 16, height: 16, color: '#8D99AE' }} />
              </button>
            </div>

            {/* Trust Proof */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 24, fontSize: '0.78rem', color: '#596579', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 style={{ width: 14, height: 14, color: '#0E7051' }} />
                <span>Zero floating-point tax errors</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck style={{ width: 14, height: 14, color: '#0D6258' }} />
                <span>Statutory 16(2)(aa) compliance</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <HeartHandshake style={{ width: 14, height: 14, color: '#C87D0E' }} />
                <span>CA collaborative vault</span>
              </div>
            </div>

            {/* Product Vision Quote from PDF Page 7 */}
            <div style={{ marginTop: 24, padding: '12px 16px', backgroundColor: '#FFFFFF', borderRadius: 12, border: '1px solid #EAE5DC', fontSize: '0.8rem', color: '#596579', lineHeight: 1.5 }}>
              <span style={{ color: '#0D6258', fontWeight: 700 }}>Vision: </span>
              “India&apos;s simplest digital compliance platform for small businesses — helping an entrepreneur start, register, understand, file and remain compliant without needing to become a GST expert.”
            </div>
          </div>

          {/* Right Column: Editorial Visual Composition of Floating UI Fragments */}
          <div style={{ position: 'relative', height: 530, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            
            {/* Background subtle geometry */}
            <div style={{ 
              position: 'absolute', 
              inset: 20, 
              borderRadius: 28, 
              background: 'radial-gradient(circle at 40% 40%, rgba(13, 98, 88, 0.07) 0%, rgba(200, 125, 14, 0.04) 50%, transparent 75%)', 
              border: '1px dashed #E5E0D8' 
            }} />

            {/* Floating Fragment 1: Next Step Action Card (Hero Focal Point) */}
            <div style={{ 
              position: 'absolute', 
              top: 24, 
              right: 18, 
              width: 380, 
              backgroundColor: '#FFFFFF', 
              borderRadius: 20, 
              padding: 22, 
              boxShadow: '0 20px 45px -10px rgba(11, 19, 43, 0.12), 0 0 0 1px #EAE5DC',
              zIndex: 3 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#B45309', backgroundColor: '#FEF7EC', padding: '3px 8px', borderRadius: 9999 }}>
                  YOUR NEXT STEP
                </span>
                <span style={{ fontSize: '0.72rem', color: '#8D99AE' }}>September 2026</span>
              </div>
              
              <div style={{ fontSize: '1.18rem', fontWeight: 800, color: '#0B132B', marginBottom: 4 }}>
                Review 3 purchase differences
              </div>
              <p style={{ fontSize: '0.82rem', color: '#596579', lineHeight: 1.5, margin: '0 0 14px 0' }}>
                We found a few purchase records that need a quick check before you review your GST summary.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  type="button"
                  onClick={onExploreDemo}
                  style={{
                    flex: 1,
                    padding: '8px 14px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    backgroundColor: '#0D6258',
                    border: 'none',
                    borderRadius: 10,
                    cursor: 'pointer'
                  }}
                >
                  Review Differences
                </button>
                <span style={{ fontSize: '0.76rem', color: '#596579', fontWeight: 600 }}>60 sec check</span>
              </div>
            </div>

            {/* Floating Fragment 2: Difference Comparison Snippet */}
            <div style={{ 
              position: 'absolute', 
              bottom: 40, 
              left: 10, 
              width: 360, 
              backgroundColor: '#FFFFFF', 
              borderRadius: 18, 
              padding: 18, 
              boxShadow: '0 16px 36px -8px rgba(11, 19, 43, 0.1), 0 0 0 1px #EAE5DC',
              zIndex: 4 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#B45309' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#B45309' }}>Calicut Packaging Solutions</span>
                <span style={{ fontSize: '0.68rem', color: '#8D99AE', marginLeft: 'auto' }}>Invoice #CPS-8842</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, backgroundColor: '#FAF8F5', padding: 10, borderRadius: 10, border: '1px solid #EAE5DC' }}>
                <div>
                  <div style={{ fontSize: '0.66rem', color: '#8D99AE', fontWeight: 600 }}>Your Book Record</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0B132B' }}>₹ 42,000</div>
                  <div style={{ fontSize: '0.66rem', color: '#596579' }}>Tax: ₹ 7,560</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.66rem', color: '#8D99AE', fontWeight: 600 }}>Supplier GSTR-2B</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0D6258' }}>₹ 40,000</div>
                  <div style={{ fontSize: '0.66rem', color: '#596579' }}>Tax: ₹ 7,200</div>
                </div>
              </div>

              <div style={{ marginTop: 8, fontSize: '0.72rem', color: '#596579', display: 'flex', alignItems: 'center', gap: 5 }}>
                <CheckCircle2 style={{ width: 13, height: 13, color: '#0E7051' }} />
                <span>₹2,000 post-invoice trade discount noted</span>
              </div>
            </div>

            {/* Floating Fragment 3: Monthly Net Settlement Pill */}
            <div style={{ 
              position: 'absolute', 
              top: 200, 
              left: 4, 
              backgroundColor: '#0B132B', 
              color: '#FFFFFF', 
              borderRadius: 16, 
              padding: '14px 20px', 
              boxShadow: '0 20px 40px rgba(11, 19, 43, 0.25)',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 14
            }}>
              <div style={{ 
                width: 38, 
                height: 38, 
                borderRadius: 10, 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <Receipt style={{ width: 18, height: 18, color: '#A7F3D0' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#8D99AE', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Net Tax Summary (Sample)
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', fontVariantNumeric: 'tabular-nums' }}>
                  ₹ 76,760
                </div>
              </div>
            </div>

            {/* Floating Fragment 4: AI Copilot Concierge Whisper */}
            <div style={{ 
              position: 'absolute', 
              bottom: 12, 
              right: 28, 
              backgroundColor: '#FFFFFF', 
              border: '1px solid #B2DDD7', 
              borderRadius: 14, 
              padding: '10px 16px', 
              boxShadow: '0 10px 25px -5px rgba(13, 98, 88, 0.15)',
              zIndex: 5,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '0.78rem',
              color: '#0D6258',
              fontWeight: 600
            }}>
              <Bot style={{ width: 16, height: 16, color: '#0D6258' }} />
              <span>“Ask me anything in plain everyday English or Tamil.”</span>
            </div>

          </div>
        </div>
      </main>

      {/* Subtle Footer */}
      <footer style={{ 
        borderTop: '1px solid #EAE5DC', 
        padding: '20px 36px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        fontSize: '0.78rem', 
        color: '#8D99AE' 
      }}>
        <div>
          TaxMate • Smart GST Compliance Companion • Quiet Luxury Indian Fintech Showcase
        </div>
        <div>
          Statutory Indian GST compliance • Zero floating-point arithmetic drift
        </div>
      </footer>

      {/* ======================================================== */}
      {/* MODAL: WHY TAXMATE IS BEST (BENCHMARK VS CLEARTAX)       */}
      {/* ======================================================== */}
      {isComparisonOpen && (
        <div className="drawer-overlay" style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <div style={{ 
            width: '100%', 
            maxWidth: 820, 
            backgroundColor: '#FFFFFF', 
            borderRadius: 24, 
            overflow: 'hidden', 
            boxShadow: '0 25px 70px rgba(11, 19, 43, 0.3)', 
            border: '1px solid #EAE5DC',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '90vh'
          }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #EAE5DC', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0A1128', color: '#FFFFFF' }}>
              <div>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: 9999 }}>
                  SUPER PREMIUM BENCHMARK
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: '6px 0 2px 0' }}>
                  Why TaxMate is Best vs ClearTax & Legacy Softwares
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: 0 }}>
                  Crafted for 6.3 Crore MSMEs of Bharat: zero jargon, zero data hostage risk, and verified math.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsComparisonOpen(false)}
                style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            <div style={{ padding: 24, overflowY: 'auto' }}>
              <table className="luxury-comparison-table">
                <thead>
                  <tr>
                    <th>Capability & Dimension</th>
                    <th style={{ backgroundColor: '#0D6258' }}>✨ TaxMate (Ours)</th>
                    <th>ClearTax (Clear)</th>
                    <th>Traditional CA</th>
                  </tr>
                </thead>
                <tbody>
                  {CLEAR_TAX_COMPARISON_MATRIX.map((row, idx) => (
                    <tr key={idx} style={{ backgroundColor: row.highlight ? '#FAFDFB' : '#FFFFFF' }}>
                      <td style={{ fontWeight: 700, color: '#0B132B' }}>{row.feature}</td>
                      <td style={{ fontWeight: 700, color: '#0D6258', backgroundColor: 'rgba(13, 98, 88, 0.04)' }}>
                        ✓ {row.gstCda}
                      </td>
                      <td style={{ color: '#64748B' }}>{row.clearTax}</td>
                      <td style={{ color: '#94A3B8' }}>{row.traditionalCa}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ marginTop: 20, padding: 16, backgroundColor: '#FAF8F5', borderRadius: 14, border: '1px solid #EAE5DC', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Lock style={{ width: 16, height: 16, color: '#0D6258' }} />
                  <span style={{ fontSize: '0.8rem', color: '#596579' }}>
                    <strong>Data Sovereignty Guarantee:</strong> Your records are never held hostage. Free export forever.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsComparisonOpen(false)}
                  style={{ padding: '8px 18px', fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF', backgroundColor: '#0D6258', border: 'none', borderRadius: 8, cursor: 'pointer' }}
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

