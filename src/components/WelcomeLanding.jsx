'use client';

import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Bot, 
  FileText, 
  ChevronRight,
  TrendingUp,
  Receipt,
  Scale,
  X,
  Lock,
  Calendar,
  Store,
  Building2,
  Rocket,
  Users,
  Smartphone,
  MessageSquare,
  HelpCircle,
  ExternalLink,
  Zap,
  Check,
  Search,
  CheckCircle,
  Award,
  Layers,
  Briefcase,
  CreditCard,
  Database
} from 'lucide-react';
import { TAXMATE_EXCELLENCE_PILLARS } from '../lib/showcaseData.js';

export default function WelcomeLanding({ onGetStarted, onExploreDemo, onOpenBusinessModal }) {
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [selectedPersona, setSelectedPersona] = useState(0);

  const personas = [
    {
      id: 'retail',
      icon: Store,
      title: 'Shop Owners & Retail Outlets',
      tag: 'B2C Counter Sales',
      desc: 'Point-of-sale counter bills, digital UPI receipts, and 5-step return filing in under 2 minutes without confusing tax terminology.',
      metric: '₹0 Setup Fee • Instant 5-Step Return',
      color: '#0D6258'
    },
    {
      id: 'trader',
      icon: Building2,
      title: 'Traders & Wholesalers',
      tag: 'B2B & E-Way Bills',
      desc: 'Bulk B2B invoice imports, automated e-Way bill mapping, and real-time GSTR-2B reconciliation to recover 100% eligible ITC.',
      metric: 'Section 16(2)(aa) Auto-Matched',
      color: '#2563EB'
    },
    {
      id: 'startup',
      icon: Rocket,
      title: 'Startups & D2C Ventures',
      tag: 'Startup Express',
      desc: 'From incorporation to filing: PAN registration, MCA company verification, and GSTIN setup in one unified digital launchpad.',
      metric: 'PAN → MCA → GST in 1 Flow',
      color: '#D97706'
    },
    {
      id: 'freelancer',
      icon: Sparkles,
      title: 'Freelancers & Consultants',
      tag: 'Service Tax & Nil Returns',
      desc: 'Automated SAC code determination, export invoicing, and 10-second fast-lane Nil filing for zero-revenue months.',
      metric: '10-Second Nil Return Fast Lane',
      color: '#7C3AED'
    },
    {
      id: 'kiosk',
      icon: Smartphone,
      title: 'Kiosk & CSC Operators',
      tag: 'Assisted Commerce',
      desc: 'Physical touchscreen touchpoints for small towns across Kerala and India. Help local merchants file while the central engine handles the math.',
      metric: 'Digital-First + Assisted Commerce',
      color: '#059669'
    },
    {
      id: 'ca',
      icon: Users,
      title: 'CAs & Tax Practitioners',
      tag: 'Advisor Console',
      desc: 'Shared multi-client collaboration console. Review client purchase variances, sign off on returns, and retain zero data hostage.',
      metric: 'Multi-Client Shared Vault',
      color: '#0F172A'
    }
  ];

  const pricingTiers = [
    {
      name: 'Starter',
      price: '₹0',
      period: 'Forever free',
      desc: 'Essential compliance monitoring for early startups and small shops.',
      features: [
        'GST filing reminders via SMS & WhatsApp',
        'Basic compliance calendar & due-date engine',
        'Compliance score & health status (Green/Amber/Red)',
        '10-second Nil return filing fast lane'
      ],
      cta: 'Start Free',
      popular: false,
      color: '#596579'
    },
    {
      name: 'Per-Filing',
      price: '₹199',
      period: 'per filed return',
      desc: 'Pay only when you file. Ideal for businesses with seasonal or flexible volume.',
      features: [
        'Automated GSTR-1 & GSTR-3B return preparation',
        'Direct GSP API filing to GSTN portal',
        'Excel, CSV & PDF invoice data upload',
        'Basic purchase reconciliation & ITC check',
        'Integer paise precision (zero float drift)'
      ],
      cta: 'File a Return',
      popular: true,
      color: '#0D6258'
    },
    {
      name: 'Growth MSME',
      price: '₹499',
      period: 'per month',
      desc: 'Full-featured compliance automation with AI Copilot for growing enterprises.',
      features: [
        'Everything in Per-Filing tier',
        'Advanced Section 16(2)(aa) 2B reconciliation',
        '1-Click automated WhatsApp supplier nudges',
        'Grounded AI GST Copilot conversational support',
        'Manage multiple GSTINs across states',
        'Rules 88C & 88D notice defense radar'
      ],
      cta: 'Start 14-Day Trial',
      popular: false,
      color: '#B45309'
    },
    {
      name: 'Enterprise / CA',
      price: 'Custom',
      period: 'annual billing',
      desc: 'Multi-entity corporate compliance and CA practitioner collaboration.',
      features: [
        'Multiple legal entities & branches',
        'Direct ERP/Tally/SAP API integration',
        'CA / Accountant multi-user access control',
        'Audit defense certificates & cryptographic proof',
        'Dedicated compliance officer support'
      ],
      cta: 'Talk to Expert',
      popular: false,
      color: '#0F172A'
    }
  ];

  const copilotSteps = [
    {
      step: 1,
      name: 'Sales',
      prompt: 'Upload your sales invoices.',
      detail: 'Add your sales invoices using CSV, Excel, or PDF scans. All taxes calculate automatically with zero floating-point drift.'
    },
    {
      step: 2,
      name: 'Purchases',
      prompt: 'We found ₹X of purchase invoices.',
      detail: 'Inward purchase bills are recorded and matched against verified vendor GSTIN numbers across India.'
    },
    {
      step: 3,
      name: 'ITC',
      prompt: 'Your available input tax credit appears to be ₹X. Review exceptions.',
      detail: 'Our engine compares bills with supplier filings in GSTR-2B. Differences like trade discounts are handled under Section 16(2)(aa).'
    },
    {
      step: 4,
      name: 'Tax',
      prompt: 'Estimated GST payable: ₹X.',
      detail: 'Deterministic calculation offsets eligible input tax credit against output liability with integer paise precision.'
    },
    {
      step: 5,
      name: 'File',
      prompt: 'Your return is ready. Review and authorise filing.',
      detail: 'Cryptographic safeguard reviews return before submission through authorized GSP protocols to GSTN.'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAF8F5', color: '#0B132B', display: 'flex', flexDirection: 'column' }}>
      
      {/* ======================================================== */}
      {/* 1. TOP HEADER NAVIGATION                                */}
      {/* ======================================================== */}
      <header style={{ 
        height: 72, 
        borderBottom: '1px solid #EAE5DC', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '0 32px',
        backgroundColor: 'rgba(250, 248, 245, 0.92)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        {/* Brand Monogram */}
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
            <div style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em', color: '#0B132B' }}>
              TaxMate
            </div>
            <div style={{ fontSize: '0.68rem', color: '#596579' }}>
              Smart GST Compliance Companion
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 24 }} className="hide-on-mobile">
          <a href="#copilot" style={{ fontSize: '0.84rem', fontWeight: 600, color: '#596579', textDecoration: 'none' }}>GST Copilot</a>
          <a href="#personas" style={{ fontSize: '0.84rem', fontWeight: 600, color: '#596579', textDecoration: 'none' }}>Solutions</a>
          <a href="#startup-express" style={{ fontSize: '0.84rem', fontWeight: 600, color: '#596579', textDecoration: 'none' }}>Startup Express</a>
          <a href="#kiosk-network" style={{ fontSize: '0.84rem', fontWeight: 600, color: '#596579', textDecoration: 'none' }}>Assisted Kiosks</a>
          <a href="#pricing" style={{ fontSize: '0.84rem', fontWeight: 600, color: '#596579', textDecoration: 'none' }}>Pricing</a>
        </nav>

        {/* Right Action CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            onClick={() => setIsComparisonOpen(true)}
            className="hide-on-mobile"
            style={{
              padding: '6px 14px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#0D6258',
              backgroundColor: '#EEF8F6',
              border: '1px solid #B2DDD7',
              borderRadius: 10,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5
            }}
          >
            <Award style={{ width: 14, height: 14, color: '#0D6258' }} />
            <span>Why TaxMate is Best</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.href = '/login';
              }
            }}
            className="btn-glowing-primary"
            style={{
              padding: '9px 22px',
              fontSize: '0.86rem',
            }}
          >
            <span>File Now</span>
            <ArrowRight style={{ width: 14, height: 14, color: '#FFFFFF' }} />
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. HERO SECTION WITH REAL PHOTO & VERIFICATION CARDS    */}
      {/* ======================================================== */}
      <section style={{ 
        padding: '54px 32px 64px', 
        maxWidth: 1260, 
        margin: '0 auto', 
        width: '100%',
        position: 'relative'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 48, alignItems: 'center' }} className="hero-five-step-panel-grid">
          
          {/* Left Column: Authoritative Editorial Copy & Action Cards */}
          <div>
            
            {/* Status Pill from PDF Page 5 & 6 */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 14px', borderRadius: 9999, backgroundColor: '#EEF8F6', border: '1px solid #B2DDD7', marginBottom: 16 }}>
              <span className="pulse-dot-green" />
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0D6258', letterSpacing: '0.04em' }}>
                INDIA’S SIMPLEST GST PLATFORM FOR MSMEs & STARTUPS
              </span>
            </div>

            {/* Main Headline from PDF Page 6 */}
            <h1 className="hero-greeting-title" style={{ 
              fontSize: '3.2rem', 
              fontWeight: 800, 
              color: '#0B132B', 
              lineHeight: 1.12, 
              letterSpacing: '-0.03em', 
              margin: '0 0 16px 0' 
            }}>
              GST Made Simple.<br />
              Business Made Easy.
            </h1>

            {/* Lead Supporting Paragraph from PDF Page 2 & 7 */}
            <p style={{ 
              fontSize: '1.05rem', 
              color: '#596579', 
              lineHeight: 1.6, 
              maxWidth: 560, 
              margin: '0 0 32px 0' 
            }}>
              From starting your business to filing your GST — one digital platform. Instead of confusing GST tables, our Copilot simply tells you: <strong>“Your GST for this month is ready.”</strong>
            </p>

            {/* DUAL ACTION CARDS: MONTHLY FILING VS STARTUP EXPRESS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }} className="form-grid-2">
              
              {/* Card 1: 5-Step Filing Copilot */}
              <div 
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                  }
                }}
                style={{
                  padding: '20px 22px',
                  borderRadius: 16,
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #0D6258',
                  boxShadow: '0 8px 24px -4px rgba(13, 98, 88, 0.16)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: '#EEF8F6', color: '#0D6258', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ShieldCheck style={{ width: 18, height: 18 }} />
                    </div>
                    <span style={{ fontSize: '0.66rem', fontWeight: 800, color: '#0D6258', backgroundColor: '#EEF8F6', padding: '2px 8px', borderRadius: 9999 }}>
                      5 Plain Steps
                    </span>
                  </div>
                  <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0B132B' }}>
                    File Monthly GST
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#596579', marginTop: 2 }}>
                    In just ~2 minutes • 0 notice risk
                  </div>
                </div>

                <div style={{ marginTop: 16 }}>
                  <button
                    type="button"
                    className="btn-glowing-primary"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      fontSize: '0.86rem',
                    }}
                  >
                    <span>Run Health Check</span>
                    <ArrowRight style={{ width: 14, height: 14, color: '#FFFFFF' }} />
                  </button>
                </div>
              </div>

              {/* Card 2: Startup Express */}
              <div 
                onClick={onGetStarted}
                style={{
                  padding: '20px 22px',
                  borderRadius: 16,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #EAE5DC',
                  boxShadow: '0 2px 10px rgba(11, 19, 43, 0.04)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#D97706';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#EAE5DC';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Rocket style={{ width: 18, height: 18 }} />
                    </div>
                    <span style={{ fontSize: '0.66rem', fontWeight: 800, color: '#D97706', backgroundColor: '#FEF3C7', padding: '2px 8px', borderRadius: 9999 }}>
                      Startup Express
                    </span>
                  </div>
                  <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0B132B' }}>
                    Start My Business
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#596579', marginTop: 2 }}>
                    PAN → MCA → GST Registration
                  </div>
                </div>

                <div style={{ marginTop: 16 }}>
                  <button
                    type="button"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      backgroundColor: '#FAF8F5',
                      color: '#0B132B',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      borderRadius: 10,
                      border: '1px solid #EAE5DC',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6
                    }}
                  >
                    <span>Start Incorporation</span>
                    <ArrowRight style={{ width: 14, height: 14, color: '#D97706' }} />
                  </button>
                </div>
              </div>

            </div>

            {/* TRUST PROOF NUMBERS */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap', paddingTop: 16, borderTop: '1px solid #EAE5DC' }}>
              <div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0B132B', letterSpacing: '-0.02em' }}>₹4.2 Cr+</div>
                <div style={{ fontSize: '0.74rem', color: '#596579' }}>Tax credit (ITC) reclaimed</div>
              </div>
              <div style={{ width: 1, height: 34, backgroundColor: '#EAE5DC' }} />
              <div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0D6258', letterSpacing: '-0.02em' }}>100%</div>
                <div style={{ fontSize: '0.74rem', color: '#596579' }}>Integer math precision (0 drift)</div>
              </div>
              <div style={{ width: 1, height: 34, backgroundColor: '#EAE5DC' }} />
              <div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#059669', letterSpacing: '-0.02em' }}>0.0%</div>
                <div style={{ fontSize: '0.74rem', color: '#596579' }}>Notice exposure rate</div>
              </div>
            </div>

          </div>

          {/* Right Column: Real-time Photo with Floating Verification Cards */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            
            {/* Background Halo */}
            <div style={{ 
              position: 'absolute', 
              top: '5%', 
              left: '5%', 
              right: '5%', 
              bottom: '5%', 
              background: 'radial-gradient(circle, rgba(13, 98, 88, 0.18) 0%, rgba(250, 248, 245, 0) 70%)', 
              borderRadius: '50%', 
              zIndex: 0 
            }} />

            {/* Real Editorial Photo of Indian Entrepreneur */}
            <div style={{ 
              position: 'relative', 
              zIndex: 1, 
              width: '100%', 
              maxWidth: 440, 
              borderRadius: 28, 
              overflow: 'hidden', 
              boxShadow: '0 25px 60px -10px rgba(11, 19, 43, 0.22)',
              border: '6px solid #FFFFFF'
            }}>
              <img 
                src="/images/hero-entrepreneur.jpg" 
                alt="Confident Indian Entrepreneur using TaxMate" 
                style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
              />
            </div>

            {/* FLOATING VERIFICATION CARD A (TOP LEFT) */}
            <div style={{
              position: 'absolute',
              top: '12%',
              left: '-24px',
              zIndex: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(16px)',
              padding: '14px 18px',
              borderRadius: 16,
              border: '1px solid #B2DDD7',
              boxShadow: '0 12px 32px rgba(13, 98, 88, 0.18)',
              maxWidth: 240
            }} className="hide-on-mobile">
              <div style={{ fontSize: '0.64rem', fontWeight: 800, color: '#0D6258', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Auto-Fetching Data from GSTR-2B
              </div>
              <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 3, fontSize: '0.74rem', color: '#0B132B' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Sales:</span>
                  <strong style={{ color: '#0D6258' }}>₹ 7,37,000 ✓</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>ITC Matched:</span>
                  <strong style={{ color: '#059669' }}>₹ 1,15,200 ✓</strong>
                </div>
              </div>
            </div>

            {/* FLOATING VERIFICATION CARD B (BOTTOM RIGHT) */}
            <div style={{
              position: 'absolute',
              bottom: '8%',
              right: '-20px',
              zIndex: 2,
              backgroundColor: '#070B14',
              color: '#FFFFFF',
              padding: '16px 20px',
              borderRadius: 18,
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.35)',
              maxWidth: 260
            }} className="hide-on-mobile">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <ShieldCheck style={{ width: 16, height: 16, color: '#10B981' }} />
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10B981', textTransform: 'uppercase' }}>
                  100% Notice Protected
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFFFFF' }}>
                DRC-01B & 01C Radar: Optimal
              </div>
              <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: 2 }}>
                Rule 88C variance: 0.00% • Sec 16(2)(aa) auto-matched
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. PERSONA CARDS: TAXMATE FOR EVERY INDIAN BUSINESS     */}
      {/* ======================================================== */}
      <section id="personas" style={{ padding: '64px 32px', backgroundColor: '#FFFFFF', borderTop: '1px solid #EAE5DC', borderBottom: '1px solid #EAE5DC' }}>
        <div style={{ maxWidth: 1260, margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 48px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0D6258', backgroundColor: '#EEF8F6', padding: '3px 12px', borderRadius: 9999 }}>
              TAILORED SOLUTIONS
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0B132B', letterSpacing: '-0.02em', margin: '10px 0 12px 0' }}>
              India’s Most Trusted GST Platform For
            </h2>
            <p style={{ fontSize: '0.96rem', color: '#596579', lineHeight: 1.5 }}>
              Engineered specifically for the real statutory needs of retail merchants, traders, startups, and certified professionals.
            </p>
          </div>

          {/* 6 Persona Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="stat-grid-3">
            {personas.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div 
                  key={p.id}
                  onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                  }
                }}
                  style={{
                    padding: 24,
                    borderRadius: 18,
                    backgroundColor: '#FAF8F5',
                    border: '1px solid #EAE5DC',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.borderColor = p.color;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 28px -6px rgba(11, 19, 43, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FAF8F5';
                    e.currentTarget.style.borderColor = '#EAE5DC';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: '#FFFFFF', border: '1px solid #EAE5DC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: p.color }}>
                        <Icon style={{ width: 20, height: 20 }} />
                      </div>
                      <span style={{ fontSize: '0.66rem', fontWeight: 800, color: p.color, backgroundColor: '#FFFFFF', padding: '3px 8px', borderRadius: 9999, border: '1px solid #EAE5DC' }}>
                        {p.tag}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0B132B', marginBottom: 8 }}>
                      {p.title}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#596579', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                      {p.desc}
                    </p>
                  </div>

                  <div style={{ paddingTop: 14, borderTop: '1px solid #EAE5DC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: p.color }}>
                      {p.metric}
                    </span>
                    <ArrowRight style={{ width: 14, height: 14, color: p.color }} />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. WHY CHOOSE TAXMATE (FEATURING CA EXPERT REAL PHOTO)   */}
      {/* ======================================================== */}
      <section style={{ padding: '72px 32px', maxWidth: 1260, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '0.85fr 1.15fr', gap: 48, alignItems: 'center' }} className="hero-five-step-panel-grid">
          
          {/* Left Column: Real Editorial Portrait of CA / Tax Expert */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div style={{ 
              width: '100%', 
              maxWidth: 420, 
              borderRadius: 28, 
              overflow: 'hidden', 
              boxShadow: '0 25px 60px -10px rgba(11, 19, 43, 0.22)',
              border: '6px solid #FFFFFF'
            }}>
              <img 
                src="/images/ca-expert.jpg" 
                alt="Chartered Accountant reviewing TaxMate compliance radar" 
                style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
              />
            </div>

            {/* Floating Trust Card */}
            <div style={{
              position: 'absolute',
              bottom: '24px',
              left: '-20px',
              backgroundColor: '#070B14',
              color: '#FFFFFF',
              padding: '16px 20px',
              borderRadius: 18,
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4)',
              maxWidth: 270
            }} className="hide-on-mobile">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <CheckCircle2 style={{ width: 16, height: 16, color: '#10B981' }} />
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10B981' }}>
                  Statutory Rule Governance
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                100% Deterministic Engine
              </div>
              <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: 2 }}>
                Rules 88C & 88D pre-evaluated. No hallucinating AI calculations.
              </div>
            </div>
          </div>

          {/* Right Column: Key Differentiators */}
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0D6258', backgroundColor: '#EEF8F6', padding: '3px 12px', borderRadius: 9999 }}>
              PRECISION ADVANTAGE
            </span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0B132B', letterSpacing: '-0.02em', margin: '12px 0 16px 0' }}>
              Why Indian Businesses Choose TaxMate to File Their Taxes
            </h2>
            <p style={{ fontSize: '1rem', color: '#596579', lineHeight: 1.6, margin: '0 0 28px 0' }}>
              Unlike generic tax portals with hidden enterprise pricing and floating-point arithmetic errors, TaxMate guarantees <strong>integer-precise math</strong> and zero lock-in data sovereignty.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <Award style={{ width: 18, height: 18 }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0B132B', margin: '0 0 4px 0' }}>
                    100% Calculation Precision (Zero Floating-Point Drift)
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: '#596579', lineHeight: 1.5, margin: 0 }}>
                    All GST liabilities and Input Tax Credits are calculated using minor-unit integer paise. Even a 1-paisa rounding error that could trigger department scrutiny is eliminated.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: '#EEF8F6', color: '#0D6258', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <ShieldCheck style={{ width: 18, height: 18 }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0B132B', margin: '0 0 4px 0' }}>
                    Automated Notice Radar (Rule 88C, 88D & Section 16)
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: '#596579', lineHeight: 1.5, margin: 0 }}>
                    Our pre-audit system scans GSTR-1 vs GSTR-3B turnover variance and cross-checks 100% of purchase claims against GSTR-2B before you authorize filing.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <MessageSquare style={{ width: 18, height: 18 }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0B132B', margin: '0 0 4px 0' }}>
                    1-Click WhatsApp Supplier Nudge
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: '#596579', lineHeight: 1.5, margin: 0 }}>
                    Suppliers forgot to upload invoices? TaxMate generates an instant WhatsApp message with the exact missing invoice numbers and amounts so they file before the 14th cutoff.
                  </p>
                </div>
              </div>

            </div>

            <div style={{ marginTop: 32 }}>
              <button
                type="button"
                onClick={() => setIsComparisonOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 22px',
                  borderRadius: 12,
                  backgroundColor: '#0D6258',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(13, 98, 88, 0.25)'
                }}
              >
                <span>Explore Why TaxMate is Best</span>
                <ChevronRight style={{ width: 16, height: 16 }} />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 4B. 3-CARD AUTO-COMPLIANCE SHOWCASE                      */}
      {/* ======================================================== */}
      <section style={{ padding: '68px 32px 76px', backgroundColor: '#FAF8F5', borderTop: '1px solid #EAE5DC' }}>
        <div style={{ maxWidth: 1260, margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 48px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0D6258', backgroundColor: '#EEF8F6', padding: '3px 12px', borderRadius: 9999 }}>
              STATUTORY RULE AUTOMATION
            </span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0B132B', letterSpacing: '-0.02em', margin: '12px 0 14px 0' }}>
              GST filing, as easy as it gets.<br />
              <span style={{ color: '#0D6258' }}>And as accurate as statutory law demands.</span>
            </h2>
            <p style={{ fontSize: '1rem', color: '#596579', lineHeight: 1.6 }}>
              Direct GSP pipelines and deterministic rule engines replace manual data entry, eliminate human calculation fatigue, and protect your business against GST audit notices.
            </p>
          </div>

          {/* 3 Interactive Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="stat-grid-3">
            
            {/* Card 1: Zero Manual Entry Pre-filled */}
            <div 
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 24,
                border: '1px solid #EAE5DC',
                padding: 28,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 18px rgba(11, 19, 43, 0.04)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 16px 36px -8px rgba(13, 98, 88, 0.12)';
                e.currentTarget.style.borderColor = '#B2DDD7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 18px rgba(11, 19, 43, 0.04)';
                e.currentTarget.style.borderColor = '#EAE5DC';
              }}
            >
              <div>
                {/* Visual Telemetry Header */}
                <div style={{ backgroundColor: '#FAF8F5', borderRadius: 16, border: '1px solid #EAE5DC', padding: 18, marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid #EAE5DC', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <ShieldCheck style={{ width: 14, height: 14, color: '#0D6258' }} />
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#0B132B' }}>GST TELEMETRY</span>
                    </div>
                    <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#0D6258', backgroundColor: '#EEF8F6', padding: '2px 6px', borderRadius: 6 }}>
                      AUTO-FILLED
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.74rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#596579' }}>GSTR-1 Outward Sales</span>
                      <strong style={{ color: '#0B132B' }}>₹ 7,37,000 <span style={{ color: '#059669' }}>✓</span></strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#596579' }}>GSTR-2B Verified ITC</span>
                      <strong style={{ color: '#0B132B' }}>₹ 1,15,200 <span style={{ color: '#059669' }}>✓</span></strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#596579' }}>Net Tax Payable</span>
                      <strong style={{ color: '#0D6258' }}>₹ 17,460</strong>
                    </div>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0B132B', marginBottom: 10, letterSpacing: '-0.01em' }}>
                  Zero manual entry, pre-filled from your GST records
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#596579', lineHeight: 1.55, margin: 0 }}>
                  Never retype invoices. TaxMate pulls your outward turnover and verified supplier credits directly through authorized GSP protocols with Section 16(2)(aa) statutory verification.
                </p>
              </div>

              <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #F1ECE1', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.74rem', fontWeight: 700, color: '#0D6258' }}>
                <span>100% GSP Connected</span>
                <ArrowRight style={{ width: 13, height: 13 }} />
              </div>
            </div>

            {/* Card 2: 100+ Accounting & ERP Connectors */}
            <div 
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 24,
                border: '1px solid #EAE5DC',
                padding: 28,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 18px rgba(11, 19, 43, 0.04)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 16px 36px -8px rgba(37, 99, 235, 0.12)';
                e.currentTarget.style.borderColor = '#BFDBFE';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 18px rgba(11, 19, 43, 0.04)';
                e.currentTarget.style.borderColor = '#EAE5DC';
              }}
            >
              <div>
                {/* Visual Connectors Header */}
                <div style={{ backgroundColor: '#FAF8F5', borderRadius: 16, border: '1px solid #EAE5DC', padding: 18, marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid #EAE5DC', marginBottom: 10 }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#2563EB' }}>100+ ERP & ACCOUNTING APIS</span>
                    <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#2563EB', backgroundColor: '#EFF6FF', padding: '2px 6px', borderRadius: 6 }}>
                      1-CLICK SYNC
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    {[
                      { name: 'Tally Prime', status: 'Sync ✓', color: '#059669' },
                      { name: 'Zoho Books', status: 'Live ✓', color: '#2563EB' },
                      { name: 'Busy ERP', status: 'Active ✓', color: '#D97706' },
                      { name: 'Excel / CSV', status: 'Ready ✓', color: '#0D6258' }
                    ].map((app, i) => (
                      <div key={i} style={{ padding: '6px 8px', backgroundColor: '#FFFFFF', borderRadius: 8, border: '1px solid #EAE5DC', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.68rem' }}>
                        <span style={{ fontWeight: 700, color: '#0B132B' }}>{app.name}</span>
                        <span style={{ fontWeight: 800, color: app.color, fontSize: '0.62rem' }}>{app.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0B132B', marginBottom: 10, letterSpacing: '-0.01em' }}>
                  Every invoice pulled in from 100+ ERPs in 1-click
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#596579', lineHeight: 1.55, margin: 0 }}>
                  Sync your purchase registers and sales ledgers straight from Tally, Zoho Books, Busy, Marg, or custom Excel exports. Clean parsing with zero format corruption.
                </p>
              </div>

              <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #F1ECE1', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.74rem', fontWeight: 700, color: '#2563EB' }}>
                <span>Connect Your Accounting Stack</span>
                <ArrowRight style={{ width: 13, height: 13 }} />
              </div>
            </div>

            {/* Card 3: Deterministic Rule Set-Off & Scrutiny Defense */}
            <div 
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 24,
                border: '1px solid #EAE5DC',
                padding: 28,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 18px rgba(11, 19, 43, 0.04)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 16px 36px -8px rgba(217, 119, 6, 0.12)';
                e.currentTarget.style.borderColor = '#FDE68A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 18px rgba(11, 19, 43, 0.04)';
                e.currentTarget.style.borderColor = '#EAE5DC';
              }}
            >
              <div>
                {/* Visual Set-Off Telemetry Header */}
                <div style={{ backgroundColor: '#FAF8F5', borderRadius: 16, border: '1px solid #EAE5DC', padding: 18, marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid #EAE5DC', marginBottom: 10 }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#D97706' }}>SECTION 49 TAX SET-OFF</span>
                    <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#059669', backgroundColor: '#ECFDF5', padding: '2px 6px', borderRadius: 6 }}>
                      0 FLOAT DRIFT
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.72rem' }}>
                    <div style={{ padding: '4px 8px', backgroundColor: '#FFFFFF', borderRadius: 6, border: '1px solid #EAE5DC', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#596579' }}>Rule 88C Turnover Variance</span>
                      <strong style={{ color: '#059669' }}>0.00% (DRC-01B Safe)</strong>
                    </div>
                    <div style={{ padding: '4px 8px', backgroundColor: '#FFFFFF', borderRadius: 6, border: '1px solid #EAE5DC', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#596579' }}>Rule 88D ITC Variance</span>
                      <strong style={{ color: '#059669' }}>0.00% (DRC-01C Safe)</strong>
                    </div>
                    <div style={{ padding: '4px 8px', backgroundColor: '#FFFFFF', borderRadius: 6, border: '1px solid #EAE5DC', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#596579' }}>IGST → CGST → SGST Order</span>
                      <strong style={{ color: '#0D6258' }}>Statutory Order Applied</strong>
                    </div>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0B132B', marginBottom: 10, letterSpacing: '-0.01em' }}>
                  Statutory tax set-offs & notice defense, all auto-calculated
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#596579', lineHeight: 1.55, margin: 0 }}>
                  Optimal utilization of input tax credit under Section 49 is handled deterministically in integer paise math. Department notice risks under Rules 88C and 88D are neutralized before filing.
                </p>
              </div>

              <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #F1ECE1', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.74rem', fontWeight: 700, color: '#D97706' }}>
                <span>Deterministic Compliance Engine</span>
                <ArrowRight style={{ width: 13, height: 13 }} />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. THE 5-STEP GST COPILOT JOURNEY (PDF PAGE 2-3)        */}
      {/* ======================================================== */}
      <section id="copilot" style={{ padding: '72px 32px', backgroundColor: '#070B14', color: '#FFFFFF' }}>
        <div style={{ maxWidth: 1260, margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 48px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#34D399', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '3px 12px', borderRadius: 9999 }}>
              THE BIGGEST DIFFERENTIATOR
            </span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', margin: '12px 0 14px 0' }}>
              “Your GST for this month is ready.”
            </h2>
            <p style={{ fontSize: '1rem', color: '#94A3B8', lineHeight: 1.6 }}>
              Instead of intimidating taxpayers with GSTR-1 tables, B2CL, or 4(A)(5) formulas, TaxMate distills monthly compliance into 5 human, plain-language steps.
            </p>
          </div>

          {/* 5 Steps Horizontal Track */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }} className="filing-runway-track">
            {copilotSteps.map((s) => (
              <div 
                key={s.step}
                style={{
                  padding: 20,
                  borderRadius: 16,
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#34D399' }}>
                      Step {s.step}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: '#94A3B8' }}>{s.name}</span>
                  </div>

                  <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#FFFFFF', marginBottom: 8, fontStyle: 'italic' }}>
                    “{s.prompt}”
                  </div>

                  <p style={{ fontSize: '0.76rem', color: '#94A3B8', lineHeight: 1.45, margin: 0 }}>
                    {s.detail}
                  </p>
                </div>

                <div style={{ marginTop: 14, height: 2, backgroundColor: 'rgba(16, 185, 129, 0.4)', borderRadius: 9999 }} />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. STARTUP EXPRESS LAUNCHPAD (PDF PAGE 3)               */}
      {/* ======================================================== */}
      <section id="startup-express" style={{ padding: '76px 32px', backgroundColor: '#FFFFFF', borderBottom: '1px solid #EAE5DC' }}>
        <div style={{ maxWidth: 1260, margin: '0 auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 48, alignItems: 'center' }} className="hero-five-step-panel-grid">
            
            {/* Left Column: Vision & 6-Step Flow */}
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#D97706', backgroundColor: '#FEF3C7', padding: '3px 12px', borderRadius: 9999 }}>
                STARTUP EXPRESS LAUNCHPAD • PDF P. 3
              </span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0B132B', letterSpacing: '-0.02em', margin: '12px 0 16px 0' }}>
                “From starting your business to filing your GST — one digital platform.”
              </h2>
              <p style={{ fontSize: '1rem', color: '#596579', lineHeight: 1.6, margin: '0 0 20px 0' }}>
                Starting a new company? Select your entity type and TaxMate walks you step-by-step through PAN application, MCA incorporation, GST registration, bank account setup, and invoice generation.
              </p>

              {/* Entity Selector (From PDF Page 3) */}
              <div style={{ backgroundColor: '#FAF8F5', borderRadius: 16, border: '1px solid #EAE5DC', padding: 18, marginBottom: 24 }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#8D99AE', textTransform: 'uppercase', marginBottom: 10 }}>
                  Select What You Are Starting:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }} className="form-grid-2">
                  {[
                    { label: 'Proprietorship', tag: 'Fastest' },
                    { label: 'Partnership / LLP', tag: 'Deed Sync' },
                    { label: 'Private Limited', tag: 'MCA SPICe+' },
                    { label: 'Other Structure', tag: 'Custom' }
                  ].map((ent, i) => (
                    <div key={i} style={{ padding: '8px 10px', backgroundColor: '#FFFFFF', borderRadius: 10, border: '1px solid #EAE5DC', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0B132B' }}>{ent.label}</div>
                      <div style={{ fontSize: '0.62rem', color: '#D97706', fontWeight: 700, marginTop: 2 }}>{ent.tag}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6-Step Sequence */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }} className="form-grid-2">
                {[
                  { step: '1', title: 'PAN Application', desc: 'Permanent Account Number verification' },
                  { step: '2', title: 'Business Registration', desc: 'Entity constitution & partnership deed' },
                  { step: '3', title: 'MCA Integration', desc: 'Authorized Ministry of Corporate Affairs sync' },
                  { step: '4', title: 'GST Registration', desc: 'Jurisdiction mapping & GSTIN issuance' },
                  { step: '5', title: 'Banking & Invoicing', desc: 'Compliant QR invoice templates' },
                  { step: '6', title: 'Monthly GST Filing', desc: 'Continuous compliance under 5-step model' }
                ].map((s) => (
                  <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', backgroundColor: '#FAF8F5', borderRadius: 10, border: '1px solid #EAE5DC' }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.72rem', flexShrink: 0 }}>
                      {s.step}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0B132B' }}>{s.title}</div>
                      <div style={{ fontSize: '0.66rem', color: '#596579' }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={onGetStarted}
                className="btn-glowing-amber"
                style={{
                  padding: '13px 26px',
                  fontSize: '0.92rem',
                }}
              >
                <span>Launch Startup Express</span>
                <ArrowRight style={{ width: 16, height: 16, color: '#FFFFFF' }} />
              </button>
            </div>

            {/* Right Column: Real Editorial Photo of Indian Startup Founders */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <div style={{ 
                width: '100%', 
                maxWidth: 440, 
                borderRadius: 28, 
                overflow: 'hidden', 
                boxShadow: '0 25px 60px -10px rgba(217, 119, 6, 0.22)',
                border: '6px solid #FFFFFF'
              }}>
                <img 
                  src="/images/startup-founders.jpg" 
                  alt="Young Indian startup co-founders celebrating company incorporation with TaxMate" 
                  style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
                />
              </div>

              {/* Floating Live Badge A (Top Right) */}
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '-16px',
                backgroundColor: '#FFFFFF',
                borderRadius: 14,
                padding: '12px 16px',
                border: '1px solid #FDE68A',
                boxShadow: '0 12px 28px rgba(217, 119, 6, 0.18)',
                maxWidth: 220
              }} className="hide-on-mobile">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <Rocket style={{ width: 14, height: 14, color: '#D97706' }} />
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#D97706' }}>MCA SPICe+ SYNC</span>
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0B132B' }}>
                  Incorporation Approved
                </div>
                <div style={{ fontSize: '0.66rem', color: '#596579' }}>
                  CIN & DIN mapped in 1 flow
                </div>
              </div>

              {/* Floating Live Badge B (Bottom Left) */}
              <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '-16px',
                backgroundColor: '#070B14',
                color: '#FFFFFF',
                borderRadius: 14,
                padding: '12px 16px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 12px 28px rgba(0, 0, 0, 0.35)',
                maxWidth: 220
              }} className="hide-on-mobile">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <CheckCircle2 style={{ width: 14, height: 14, color: '#10B981' }} />
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#10B981' }}>GSTIN ACTIVE</span>
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800 }}>
                  Ready for Monthly Return
                </div>
                <div style={{ fontSize: '0.66rem', color: '#94A3B8' }}>
                  5-step Copilot active
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. ASSISTED KIOSK MODEL (PDF PAGE 1 & 5)                */}
      {/* ======================================================== */}
      <section id="kiosk-network" style={{ padding: '76px 32px', backgroundColor: '#FAF8F5' }}>
        <div style={{ maxWidth: 1260, margin: '0 auto' }}>
          
          <div style={{ backgroundColor: '#0D6258', color: '#FFFFFF', borderRadius: 28, padding: '48px 40px', boxShadow: '0 20px 50px rgba(13, 98, 88, 0.25)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 40, alignItems: 'center' }} className="hero-five-step-panel-grid">
              
              {/* Left Column: Assisted Kiosk Details */}
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#A7F3D0', backgroundColor: 'rgba(255, 255, 255, 0.12)', padding: '3px 12px', borderRadius: 9999 }}>
                  DIGITAL-FIRST + ASSISTED COMMERCE • PDF P. 5
                </span>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', margin: '14px 0 16px 0' }}>
                  Assisted Town Kiosk Network
                </h2>
                <p style={{ fontSize: '1rem', color: '#D1E8E2', lineHeight: 1.6, margin: '0 0 24px 0' }}>
                  Physical touchpoints for smaller towns and MSME markets across Kerala and India. A trained local kiosk operator provides hands-on bill scanning and filing while the backend runs on TaxMate.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }} className="form-grid-2">
                  {[
                    'GST Registration & Monthly Returns',
                    'Physical Counter Bill Scanning',
                    'Instant Cash & UPI Receipts',
                    'PAN & Legal Business Setup',
                    'Local Language (Malayalam / Hindi)',
                    '100% Deterministic Central Engine'
                  ].map((srv, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: '#FFFFFF' }}>
                      <CheckCircle2 style={{ width: 15, height: 15, color: '#34D399' }} />
                      <span>{srv}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                  }
                }}
                  style={{
                    padding: '12px 24px',
                    borderRadius: 12,
                    backgroundColor: '#FFFFFF',
                    color: '#0D6258',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)'
                  }}
                >
                  <span>Explore Kiosk Mode</span>
                  <ArrowRight style={{ width: 14, height: 14 }} />
                </button>
              </div>

              {/* Right Column: Real Photograph of Kerala Merchant in Kochi */}
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                <div style={{ 
                  width: '100%', 
                  maxWidth: 420, 
                  borderRadius: 24, 
                  overflow: 'hidden', 
                  boxShadow: '0 20px 48px rgba(0, 0, 0, 0.35)',
                  border: '5px solid rgba(255, 255, 255, 0.25)'
                }}>
                  <img 
                    src="/images/kerala-merchant.jpg" 
                    alt="Kerala merchant in Kochi using TaxMate assisted kiosk tablet" 
                    style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
                  />
                </div>

                {/* Floating Kiosk Station Badge */}
                <div style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '-16px',
                  backgroundColor: '#FFFFFF',
                  color: '#0B132B',
                  borderRadius: 14,
                  padding: '12px 16px',
                  boxShadow: '0 12px 28px rgba(0, 0, 0, 0.25)',
                  border: '1px solid #B2DDD7',
                  maxWidth: 240
                }} className="hide-on-mobile">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <Store style={{ width: 14, height: 14, color: '#0D6258' }} />
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#0D6258' }}>KOCHI STATION #104</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0B132B' }}>
                    Spices & Handloom Trader
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#596579' }}>
                    Counter bills scanned • Filed in ~2 mins
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 7B. LONG-TERM MSME COMPLIANCE OS (PDF PAGE 6 & 7)        */}
      {/* ======================================================== */}
      <section style={{ padding: '68px 32px 76px', backgroundColor: '#FFFFFF', borderBottom: '1px solid #EAE5DC' }}>
        <div style={{ maxWidth: 1260, margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 44px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2563EB', backgroundColor: '#EFF6FF', padding: '3px 12px', borderRadius: 9999 }}>
              PHASE 2 ROADMAP • PDF P. 6 & 7
            </span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0B132B', letterSpacing: '-0.02em', margin: '12px 0 14px 0' }}>
              More Than Just GST.<br />
              <span style={{ color: '#2563EB' }}>The MSME Compliance Operating System.</span>
            </h2>
            <p style={{ fontSize: '1rem', color: '#596579', lineHeight: 1.6 }}>
              “If executed correctly, this isn't merely a GST filing business. It becomes an MSME Compliance OS: foundational data for MSME intelligence, credit readiness and business capital.”
            </p>
          </div>

          {/* 12-Node Evolutionary Chain Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }} className="stat-grid-3">
            {[
              { id: '1', title: 'GST Filing', status: 'Live & Deterministic', color: '#0D6258' },
              { id: '2', title: 'PAN & MCA', status: 'Startup Express', color: '#D97706' },
              { id: '3', title: 'Invoicing', status: 'E-Way & QR Ready', color: '#2563EB' },
              { id: '4', title: 'Accounting', status: 'Dual Ledger Sync', color: '#7C3AED' },
              { id: '5', title: 'Connected Banking', status: 'Direct Reconciliation', color: '#059669' },
              { id: '6', title: 'Payroll & EPF', status: 'Staff Salary Filing', color: '#B45309' },
              { id: '7', title: 'TDS / TCS', status: 'Tax Deduction At Source', color: '#DC2626' },
              { id: '8', title: 'Income Tax', status: 'Business ITR-3/4', color: '#0284C7' },
              { id: '9', title: 'MCA Compliance', status: 'AOC-4 & MGT-7', color: '#4F46E5' },
              { id: '10', title: 'Credit Scoring', status: 'MSME Health Index', color: '#0D9488' },
              { id: '11', title: 'Working Capital', status: 'Cashflow Lending', color: '#16A34A' },
              { id: '12', title: 'Exports & ICEGATE', status: 'LUT & Refund Filing', color: '#9333EA' }
            ].map((node) => (
              <div 
                key={node.id}
                style={{
                  padding: '16px 14px',
                  backgroundColor: '#FAF8F5',
                  borderRadius: 14,
                  border: '1px solid #EAE5DC',
                  textAlign: 'center',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.borderColor = node.color;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FAF8F5';
                  e.currentTarget.style.borderColor = '#EAE5DC';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ fontSize: '0.66rem', fontWeight: 800, color: node.color, textTransform: 'uppercase', marginBottom: 4 }}>
                  STAGE {node.id}
                </div>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0B132B', marginBottom: 4 }}>
                  {node.title}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#596579' }}>
                  {node.status}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. TRANSPARENT MSME PRICING (PDF PAGE 4)                 */}
      {/* ======================================================== */}
      <section id="pricing" style={{ padding: '72px 32px', backgroundColor: '#FFFFFF', borderTop: '1px solid #EAE5DC' }}>
        <div style={{ maxWidth: 1260, margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 48px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0D6258', backgroundColor: '#EEF8F6', padding: '3px 12px', borderRadius: 9999 }}>
              TRANSPARENT VALUE
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0B132B', letterSpacing: '-0.02em', margin: '12px 0 14px 0' }}>
              Simple, Fair Pricing for Every Stage
            </h2>
            <p style={{ fontSize: '0.96rem', color: '#596579', lineHeight: 1.5 }}>
              No hidden quotes, no annual hostage contracts. Digital automation at transparent, low-cost filing rates.
            </p>
          </div>

          {/* 4 Pricing Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }} className="stat-grid-4">
            {pricingTiers.map((tier) => (
              <div 
                key={tier.name}
                style={{
                  padding: 24,
                  borderRadius: 20,
                  backgroundColor: tier.popular ? '#FFFFFF' : '#FAF8F5',
                  border: tier.popular ? '2px solid #0D6258' : '1px solid #EAE5DC',
                  boxShadow: tier.popular ? '0 12px 36px -4px rgba(13, 98, 88, 0.16)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}
              >
                {tier.popular && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', backgroundColor: '#0D6258', color: '#FFFFFF', fontSize: '0.66rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '3px 12px', borderRadius: 9999 }}>
                    Most Popular
                  </div>
                )}

                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0B132B' }}>{tier.name}</div>
                  <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ fontSize: '2rem', fontWeight: 900, color: '#0B132B' }}>{tier.price}</span>
                    <span style={{ fontSize: '0.74rem', color: '#8D99AE' }}>{tier.period}</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#596579', margin: '8px 0 20px 0', lineHeight: 1.4 }}>
                    {tier.desc}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 16, borderTop: '1px solid #EAE5DC' }}>
                    {tier.features.map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.76rem', color: '#0B132B' }}>
                        <Check style={{ width: 14, height: 14, color: '#059669', flexShrink: 0, marginTop: 2 }} />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: 28 }}>
                  <button
                    type="button"
                    onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                  }
                }}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      backgroundColor: tier.popular ? '#0D6258' : '#FFFFFF',
                      color: tier.popular ? '#FFFFFF' : '#0B132B',
                      border: tier.popular ? 'none' : '1px solid #DCD5C9',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    {tier.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 9. PRODUCT VISION & FOOTER (PDF PAGE 6 & 7)             */}
      {/* ======================================================== */}
      <footer style={{ backgroundColor: '#070B14', color: '#FFFFFF', padding: '64px 32px 40px' }}>
        <div style={{ maxWidth: 1260, margin: '0 auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 40, paddingBottom: 48, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }} className="hero-five-step-panel-grid">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#0D6258', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                  TM
                </div>
                <span style={{ fontSize: '1.15rem', fontWeight: 800 }}>TaxMate</span>
              </div>
              
              <blockquote style={{ fontSize: '1rem', fontStyle: 'italic', color: '#D1E8E2', lineHeight: 1.6, margin: '0 0 16px 0', maxWidth: 540 }}>
                “India's simplest digital compliance platform for small businesses — helping an entrepreneur start, register, understand, file and remain compliant without needing to become a GST expert.”
              </blockquote>
              <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                Long-term MSME Compliance OS: GST → PAN → Invoices → Accounting → Banking → Payroll → Credit Readiness.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                  }
                }}
                style={{
                  padding: '14px 32px',
                  borderRadius: 12,
                  backgroundColor: '#10B981',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.94rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)'
                }}
              >
                <span>Enter Live Workspace Now</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 24, fontSize: '0.74rem', color: '#64748B', flexWrap: 'wrap', gap: 12 }}>
            <div>
              © 2026 TaxMate • Statutory Indian GST Compliance SaaS • 100% Integer Paise Math
            </div>
            <div>
              Authorized GSP Gateway Session • Zero Cloud Data Lock-in Guarantee
            </div>
          </div>

        </div>
      </footer>

      {/* ======================================================== */}
      {/* MODAL: WHY TAXMATE IS THE BEST GST PLATFORM              */}
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
                  STANDARDS OF EXCELLENCE
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: '6px 0 2px 0' }}>
                  Why TaxMate is the Best GST Platform for Your Business
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: 0 }}>
                  Crafted for 6.3 Crore Indian MSMEs: zero confusing jargon, mathematical perfection, and total data freedom.
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

            <div style={{ padding: 24, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {TAXMATE_EXCELLENCE_PILLARS.map((pillar, idx) => (
                <div 
                  key={idx}
                  style={{
                    padding: '16px 18px',
                    borderRadius: 14,
                    backgroundColor: '#FAF8F5',
                    border: '1px solid #EAE5DC',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 14,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: 10, 
                    backgroundColor: '#EEF8F6', 
                    color: '#0D6258', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    flexShrink: 0,
                    marginTop: 2
                  }}>
                    <CheckCircle2 style={{ width: 18, height: 18 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <h4 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0B132B', margin: 0 }}>
                        {pillar.feature}
                      </h4>
                      <span style={{ fontSize: '0.66rem', fontWeight: 800, color: '#0D6258', backgroundColor: '#EEF8F6', padding: '2px 8px', borderRadius: 9999 }}>
                        TaxMate Standard
                      </span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#0B132B', lineHeight: 1.5, margin: '0 0 6px 0', fontWeight: 600 }}>
                      {pillar.taxMate}
                    </p>
                    <div style={{ fontSize: '0.74rem', color: '#596579', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Sparkles style={{ width: 12, height: 12, color: '#D97706' }} />
                      <span><strong>Why it matters:</strong> {pillar.whyBest}</span>
                    </div>
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 10, padding: 16, backgroundColor: '#FFFFFF', borderRadius: 14, border: '1px solid #EAE5DC', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Lock style={{ width: 16, height: 16, color: '#0D6258' }} />
                  <span style={{ fontSize: '0.8rem', color: '#596579' }}>
                    <strong>Data Sovereignty Guarantee:</strong> Your records are never held hostage. Free export forever.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsComparisonOpen(false)}
                  style={{ padding: '8px 20px', fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF', backgroundColor: '#0D6258', border: 'none', borderRadius: 10, cursor: 'pointer' }}
                >
                  Close & Explore
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
