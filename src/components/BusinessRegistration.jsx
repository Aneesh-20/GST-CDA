'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  MapPin, 
  Users, 
  CheckCircle2, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Lock, 
  Sparkles,
  Info,
  Rocket,
  ArrowRight,
  Database,
  Layers
} from 'lucide-react';
import { DEMO_BUSINESS, STARTUP_EXPRESS_DATA } from '../lib/showcaseData.js';

export default function BusinessRegistration({ onShowToast }) {
  const [activeTab, setActiveTab] = useState('startup-express'); // 'startup-express' | 'profile' | 'registration-wizard'
  const [selectedStructure, setSelectedStructure] = useState('llp');
  const [expandedSection, setExpandedSection] = useState(1);
  const [isMcaPulling, setIsMcaPulling] = useState(false);
  const [mcaVerified, setMcaVerified] = useState(true);

  const registrationSteps = [
    {
      num: 1,
      title: 'Business Structure & Constitution',
      desc: 'Selected: Limited Liability Partnership (LLP)',
      status: 'Ready',
      content: 'LLP registered under the Ministry of Corporate Affairs (MCA). Capital contribution: ₹ 10 Lakhs. Requires two designated partners with valid DPIN.'
    },
    {
      num: 2,
      title: 'Business Activities & HSN Codes',
      desc: 'Handcrafted Home Decor, Loom Furnishings, Terracotta Arts',
      status: 'Ready',
      content: 'Principal HSN codes: 6304 (Furnishing articles), 6912 (Ceramic tableware), 4421 (Artisanal woodwork). Estimated annual taxable turnover: ₹ 84.5 Lakhs.'
    },
    {
      num: 3,
      title: 'PAN & Identity Verification',
      desc: 'Entity PAN: AABCA8842P • Verified',
      status: 'Verified',
      content: 'Entity PAN matched with Income Tax Department records. Authorized signatory: Anaya Nair (Designated Partner).'
    },
    {
      num: 4,
      title: 'Principal Place of Business',
      desc: 'Panampilly Nagar, Kochi, Ernakulam, Kerala - 682036',
      status: 'Ready',
      content: 'Commercial lease agreement on stamp paper verified. Electricity bill uploaded as proof of address ownership.'
    },
    {
      num: 5,
      title: 'Bank Account & Statutory Attachments',
      desc: 'Current Account at State Bank of India, Kochi Main Branch',
      status: 'Ready',
      content: 'Cancelled cheque with printed entity name and IFSC SBIN0000858 uploaded to vault.'
    },
    {
      num: 6,
      title: 'Final Readiness Declaration',
      desc: 'Audit checklist complete • Preparation mode only',
      status: 'Ready for CA sign-off',
      content: 'All 5 documentation modules are validated for form GST REG-01 filing with zero discrepancies.'
    }
  ];

  const handleMcaSync = () => {
    setIsMcaPulling(true);
    setTimeout(() => {
      setIsMcaPulling(false);
      setMcaVerified(true);
      onShowToast('✓ MCA corporate master data synced via authorised APIs.');
    }, 1200);
  };

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', width: '100%', paddingBottom: 64 }}>
      {/* Top Header & Tab Switcher */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 className="font-editorial" style={{ fontSize: '2.4rem', fontWeight: 500, color: '#0B132B', margin: 0 }}>
              {activeTab === 'startup-express' ? 'Startup Express' : activeTab === 'profile' ? 'My Business Profile' : 'GST Registration Readiness'}
            </h1>
            <span style={{ fontSize: '0.74rem', padding: '3px 8px', borderRadius: 9999, backgroundColor: '#EEF8F6', color: '#0D6258', fontWeight: 700 }}>
              {activeTab === 'startup-express' ? 'Acquisition Engine' : 'Kerala State Jurisdiction'}
            </span>
          </div>
          <p style={{ fontSize: '0.96rem', color: '#596579', marginTop: 6 }}>
            {activeTab === 'startup-express'
              ? '“From starting your business to filing your GST — one digital platform.”'
              : activeTab === 'profile' 
              ? 'Entity details, MCA master data, and multi-GSTIN management overview.'
              : 'Guided checklist to prepare Form GST REG-01 application without rejections.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', backgroundColor: '#FFFFFF', padding: 4, borderRadius: 12, border: '1px solid #EAE5DC' }}>
          <button
            type="button"
            onClick={() => setActiveTab('startup-express')}
            style={{
              padding: '8px 16px',
              fontSize: '0.84rem',
              fontWeight: activeTab === 'startup-express' ? 800 : 600,
              color: activeTab === 'startup-express' ? '#0D6258' : '#596579',
              backgroundColor: activeTab === 'startup-express' ? '#EEF8F6' : 'transparent',
              border: activeTab === 'startup-express' ? '1px solid #B2DDD7' : 'none',
              borderRadius: 8,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Rocket style={{ width: 14, height: 14 }} />
            <span>Startup Express</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            style={{
              padding: '8px 16px',
              fontSize: '0.84rem',
              fontWeight: activeTab === 'profile' ? 800 : 600,
              color: activeTab === 'profile' ? '#0D6258' : '#596579',
              backgroundColor: activeTab === 'profile' ? '#EEF8F6' : 'transparent',
              border: activeTab === 'profile' ? '1px solid #B2DDD7' : 'none',
              borderRadius: 8,
              cursor: 'pointer'
            }}
          >
            Business Profile & MCA
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('registration-wizard')}
            style={{
              padding: '8px 16px',
              fontSize: '0.84rem',
              fontWeight: activeTab === 'registration-wizard' ? 800 : 600,
              color: activeTab === 'registration-wizard' ? '#0D6258' : '#596579',
              backgroundColor: activeTab === 'registration-wizard' ? '#EEF8F6' : 'transparent',
              border: activeTab === 'registration-wizard' ? '1px solid #B2DDD7' : 'none',
              borderRadius: 8,
              cursor: 'pointer'
            }}
          >
            GST Registration (Checklist)
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: STARTUP EXPRESS (SECTION 5 OF PDF)                */}
      {/* ======================================================== */}
      {activeTab === 'startup-express' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          
          {/* Hero Banner with "START MY BUSINESS" Action */}
          <div style={{ 
            backgroundColor: '#0B132B', 
            color: '#FFFFFF', 
            borderRadius: 22, 
            padding: '36px 40px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 45px -10px rgba(11, 19, 43, 0.3)'
          }}>
            <div style={{ maxWidth: 640 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', borderRadius: 9999, backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#A7F3D0', fontSize: '0.74rem', fontWeight: 700, marginBottom: 14 }}>
                <Rocket style={{ width: 14, height: 14 }} />
                <span>Major Acquisition Engine • Section 5</span>
              </div>
              <h2 className="font-editorial" style={{ fontSize: '2.4rem', fontWeight: 500, margin: '0 0 12px 0', lineHeight: 1.15 }}>
                Start your new venture with zero bureaucratic friction.
              </h2>
              <p style={{ fontSize: '1rem', color: '#8D99AE', lineHeight: 1.6, margin: '0 0 24px 0' }}>
                {STARTUP_EXPRESS_DATA.tagline}
              </p>

              <button
                type="button"
                onClick={() => onShowToast('🚀 Initialized Startup Express wizard. Selecting structure below.')}
                style={{
                  padding: '14px 28px',
                  fontSize: '0.96rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  color: '#FFFFFF',
                  backgroundColor: '#0D6258',
                  border: '1px solid #34D399',
                  borderRadius: 14,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  boxShadow: '0 8px 24px rgba(13, 98, 88, 0.4)'
                }}
              >
                <span>{STARTUP_EXPRESS_DATA.ctaText}</span>
                <ArrowRight style={{ width: 18, height: 18 }} />
              </button>
            </div>
          </div>

          {/* Question: "What are you starting?" */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 20, border: '1px solid #EAE5DC', padding: 28, boxShadow: '0 2px 8px rgba(11, 19, 43, 0.03)' }}>
            <div style={{ marginBottom: 20 }}>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#0D6258', fontWeight: 800 }}>
                STEP 1 OF STARTUP EXPRESS
              </span>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0B132B', margin: '4px 0 0 0' }}>
                {STARTUP_EXPRESS_DATA.question}
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {STARTUP_EXPRESS_DATA.structures.map((s) => {
                const isSelected = selectedStructure === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => {
                      setSelectedStructure(s.id);
                      onShowToast(`Selected structure: ${s.title}`);
                    }}
                    style={{
                      padding: 20,
                      borderRadius: 16,
                      backgroundColor: isSelected ? '#EEF8F6' : '#FAF8F5',
                      border: isSelected ? '2px solid #0D6258' : '1px solid #EAE5DC',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: 180,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div style={{ 
                          width: 32, 
                          height: 32, 
                          borderRadius: 8, 
                          backgroundColor: isSelected ? '#0D6258' : '#FFFFFF', 
                          color: isSelected ? '#FFFFFF' : '#0B132B', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          border: '1px solid #EAE5DC'
                        }}>
                          <Building2 style={{ width: 16, height: 16 }} />
                        </div>
                        {isSelected && (
                          <span style={{ fontSize: '0.66rem', fontWeight: 800, color: '#0D6258', backgroundColor: '#FFFFFF', padding: '2px 8px', borderRadius: 9999 }}>
                            Selected
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0B132B' }}>
                        {s.title}
                      </div>
                      <p style={{ fontSize: '0.76rem', color: '#596579', lineHeight: 1.45, marginTop: 4 }}>
                        {s.desc}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: '#8D99AE', paddingTop: 12, borderTop: '1px solid #EAE5DC' }}>
                      <span>Lead Time: <strong>{s.leadTime}</strong></span>
                      {s.mcaRequired ? <span style={{ color: '#0D6258', fontWeight: 700 }}>MCA API</span> : <span>Direct</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visual Step Pipeline from PDF: PAN → Business registration → MCA → GST → Bank → Invoicing → GST compliance */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 20, border: '1px solid #EAE5DC', padding: 28, boxShadow: '0 2px 8px rgba(11, 19, 43, 0.03)' }}>
            <div style={{ marginBottom: 20 }}>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8D99AE', fontWeight: 800 }}>
                FULL END-TO-END GUIDED JOURNEY
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B132B', margin: '4px 0 0 0' }}>
                Startup Express Workflow Pipeline
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10, position: 'relative' }}>
              {STARTUP_EXPRESS_DATA.workflow.map((item, idx) => (
                <div 
                  key={item.step}
                  style={{
                    padding: '14px 12px',
                    borderRadius: 14,
                    backgroundColor: item.active ? '#EEF8F6' : item.done ? '#FAF8F5' : '#FFFFFF',
                    border: item.active ? '2px solid #0D6258' : '1px solid #EAE5DC',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: 120
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ 
                        fontSize: '0.68rem', 
                        fontWeight: 800, 
                        width: 20, 
                        height: 20, 
                        borderRadius: '50%', 
                        backgroundColor: item.done ? '#0E7051' : item.active ? '#0D6258' : '#DCD5C9',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {item.done ? '✓' : item.step}
                      </span>
                      {item.active && (
                        <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#0D6258', backgroundColor: '#FFFFFF', padding: '1px 6px', borderRadius: 4 }}>
                          Now
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0B132B', lineHeight: 1.3 }}>
                      {item.label}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#596579', marginTop: 4 }}>
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: BUSINESS PROFILE & MCA INTEGRATION                */}
      {/* ======================================================== */}
      {activeTab === 'profile' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 28 }}>
          
          {/* Left Column: Entity Details Card */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 20, border: '1px solid #EAE5DC', padding: 28, boxShadow: '0 2px 8px rgba(11, 19, 43, 0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0B132B', margin: 0 }}>
                Entity Information & GSTIN Management
              </h3>
              <button
                type="button"
                onClick={handleMcaSync}
                style={{
                  padding: '6px 12px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  color: '#0D6258',
                  backgroundColor: '#EEF8F6',
                  border: '1px solid #B2DDD7',
                  borderRadius: 8,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <Database style={{ width: 13, height: 13 }} />
                <span>{isMcaPulling ? 'Syncing MCA...' : 'Sync via MCA API'}</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid #FAF8F5' }}>
                <span style={{ fontSize: '0.82rem', color: '#8D99AE', fontWeight: 600 }}>Trade Name</span>
                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0B132B' }}>{DEMO_BUSINESS.tradeName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid #FAF8F5' }}>
                <span style={{ fontSize: '0.82rem', color: '#8D99AE', fontWeight: 600 }}>Legal Name</span>
                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0B132B' }}>{DEMO_BUSINESS.legalName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid #FAF8F5' }}>
                <span style={{ fontSize: '0.82rem', color: '#8D99AE', fontWeight: 600 }}>Primary GSTIN</span>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0D6258', fontFamily: 'monospace' }}>{DEMO_BUSINESS.gstin}</span>
                  <div style={{ fontSize: '0.7rem', color: '#0E7051', fontWeight: 600 }}>✓ Format Verified (Kerala 32)</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid #FAF8F5' }}>
                <span style={{ fontSize: '0.82rem', color: '#8D99AE', fontWeight: 600 }}>Entity PAN</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0B132B', fontFamily: 'monospace' }}>{DEMO_BUSINESS.pan}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid #FAF8F5' }}>
                <span style={{ fontSize: '0.82rem', color: '#8D99AE', fontWeight: 600 }}>Constitution</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0B132B' }}>{DEMO_BUSINESS.constitution}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid #FAF8F5' }}>
                <span style={{ fontSize: '0.82rem', color: '#8D99AE', fontWeight: 600 }}>Principal Address</span>
                <span style={{ fontSize: '0.86rem', color: '#0B132B', textAlign: 'right', maxWidth: 280 }}>
                  Panampilly Nagar Main Ave, Kochi, Kerala 682036
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.82rem', color: '#8D99AE', fontWeight: 600 }}>Filing Frequency</span>
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0B132B' }}>Monthly (Regular GST)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Multi-GSTIN & Team Roles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            {/* Multi-GSTIN Module (PDF Module 4) */}
            <div style={{ backgroundColor: '#EEF8F6', borderRadius: 20, border: '1px solid #B2DDD7', padding: 24 }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#0D6258', fontWeight: 800, marginBottom: 8 }}>
                GSTIN MANAGEMENT • MODULE 4
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0D6258', marginBottom: 6 }}>
                Active State Registrations (1)
              </div>
              <p style={{ fontSize: '0.82rem', color: '#084039', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                Manage multiple state GST registrations across India under a single corporate PAN: <strong>AABCA8842P</strong>.
              </p>

              <div style={{ padding: '10px 14px', backgroundColor: '#FFFFFF', borderRadius: 12, border: '1px solid #B2DDD7', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0B132B' }}>Kerala (32) — Main Office</div>
                  <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#0D6258' }}>32AABCA8842P1Z9</div>
                </div>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#0E7051', backgroundColor: '#ECFDF5', padding: '2px 8px', borderRadius: 4 }}>
                  Active
                </span>
              </div>

              <button
                type="button"
                onClick={() => onShowToast('Add branch registration wizard (Multi-GSTIN).')}
                style={{
                  width: '100%',
                  marginTop: 12,
                  padding: '8px 14px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#0D6258',
                  backgroundColor: 'transparent',
                  border: '1px dashed #0D6258',
                  borderRadius: 8,
                  cursor: 'pointer'
                }}
              >
                + Add Another State GSTIN
              </button>
            </div>

            {/* Team & Advisor Access Card */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: 20, border: '1px solid #EAE5DC', padding: 22 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0B132B', marginBottom: 12 }}>
                Team & Signatory Roles
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <div>
                    <span style={{ fontWeight: 700, color: '#0B132B' }}>Anaya Nair</span>
                    <span style={{ color: '#8D99AE', marginLeft: 6 }}>• Designated Partner</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 6, backgroundColor: '#FAF8F5', color: '#0B132B', fontWeight: 700 }}>Owner</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <div>
                    <span style={{ fontWeight: 700, color: '#0B132B' }}>CA Priya Ramanujam</span>
                    <span style={{ color: '#8D99AE', marginLeft: 6 }}>• External Auditor</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 6, backgroundColor: '#EEF8F6', color: '#0D6258', fontWeight: 700 }}>Advisor</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: REGISTER FOR GST (6-STAGE READINESS CHECKLIST)     */}
      {/* ======================================================== */}
      {activeTab === 'registration-wizard' && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 22, border: '1px solid #EAE5DC', padding: 32, boxShadow: '0 4px 16px rgba(11, 19, 43, 0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 14, backgroundColor: '#FEF7EC', borderRadius: 14, border: '1px solid #F7E1B8', marginBottom: 24 }}>
            <Info style={{ width: 18, height: 18, color: '#B45309', flexShrink: 0 }} />
            <div style={{ fontSize: '0.82rem', color: '#B45309', lineHeight: 1.5 }}>
              <strong>Guided Workflow:</strong> Section 2 Major Module 1 — Prepare Form GST REG-01 application with automatic validation before GSP portal submission.
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {registrationSteps.map((s) => {
              const isExpanded = expandedSection === s.num;
              return (
                <div 
                  key={s.num}
                  style={{
                    borderRadius: 16,
                    border: '1px solid #EAE5DC',
                    backgroundColor: isExpanded ? '#FAF8F5' : '#FFFFFF',
                    overflow: 'hidden',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div 
                    onClick={() => setExpandedSection(isExpanded ? 0 : s.num)}
                    style={{
                      padding: '18px 22px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ 
                        width: 28, 
                        height: 28, 
                        borderRadius: '50%', 
                        backgroundColor: '#0D6258', 
                        color: '#FFFFFF', 
                        fontSize: '0.8rem', 
                        fontWeight: 800, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                      }}>
                        {s.num}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0B132B' }}>
                          {s.title}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#596579', marginTop: 2 }}>
                          {s.desc}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0E7051', backgroundColor: '#ECFDF5', padding: '3px 10px', borderRadius: 9999 }}>
                        {s.status}
                      </span>
                      {isExpanded ? <ChevronUp style={{ width: 16, height: 16, color: '#8D99AE' }} /> : <ChevronDown style={{ width: 16, height: 16, color: '#8D99AE' }} />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{ padding: '0 22px 20px', borderTop: '1px solid #EAE5DC', paddingTop: 16 }}>
                      <p style={{ fontSize: '0.84rem', color: '#596579', lineHeight: 1.6, margin: '0 0 16px 0' }}>
                        {s.content}
                      </p>
                      <button
                        type="button"
                        onClick={() => onShowToast(`✓ Step ${s.num} confirmed for Form GST REG-01.`)}
                        style={{
                          padding: '8px 16px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: '#FFFFFF',
                          backgroundColor: '#0D6258',
                          border: 'none',
                          borderRadius: 8,
                          cursor: 'pointer'
                        }}
                      >
                        Confirm Step {s.num}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
