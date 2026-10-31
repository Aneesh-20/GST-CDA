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
  Info
} from 'lucide-react';
import { DEMO_BUSINESS } from '../lib/showcaseData.js';

export default function BusinessRegistration({ onShowToast }) {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'registration-wizard'
  const [expandedSection, setExpandedSection] = useState(1);

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

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', width: '100%', paddingBottom: 64 }}>
      {/* Top Header & Tab Switcher */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 className="font-editorial" style={{ fontSize: '2.4rem', fontWeight: 500, color: '#0B132B', margin: 0 }}>
              {activeTab === 'profile' ? 'My Business Profile' : 'GST Registration Readiness'}
            </h1>
            <span style={{ fontSize: '0.74rem', padding: '3px 8px', borderRadius: 9999, backgroundColor: '#EEF8F6', color: '#0D6258', fontWeight: 700 }}>
              Kerala State Jurisdiction
            </span>
          </div>
          <p style={{ fontSize: '0.96rem', color: '#596579', marginTop: 6 }}>
            {activeTab === 'profile' 
              ? 'Entity details, GSTIN validation status, and calm descriptive business health overview.'
              : 'Guided checklist to prepare a bulletproof GST application without rejections.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', backgroundColor: '#FFFFFF', padding: 4, borderRadius: 12, border: '1px solid #EAE5DC' }}>
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            style={{
              padding: '8px 18px',
              fontSize: '0.84rem',
              fontWeight: activeTab === 'profile' ? 800 : 600,
              color: activeTab === 'profile' ? '#0D6258' : '#596579',
              backgroundColor: activeTab === 'profile' ? '#EEF8F6' : 'transparent',
              border: activeTab === 'profile' ? '1px solid #B2DDD7' : 'none',
              borderRadius: 8,
              cursor: 'pointer'
            }}
          >
            Business Profile & Health
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('registration-wizard')}
            style={{
              padding: '8px 18px',
              fontSize: '0.84rem',
              fontWeight: activeTab === 'registration-wizard' ? 800 : 600,
              color: activeTab === 'registration-wizard' ? '#0D6258' : '#596579',
              backgroundColor: activeTab === 'registration-wizard' ? '#EEF8F6' : 'transparent',
              border: activeTab === 'registration-wizard' ? '1px solid #B2DDD7' : 'none',
              borderRadius: 8,
              cursor: 'pointer'
            }}
          >
            Register for GST (Checklist)
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: BUSINESS PROFILE & DESCRIPTIVE HEALTH             */}
      {/* ======================================================== */}
      {activeTab === 'profile' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 28 }}>
          
          {/* Left Column: Entity Details Card */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 20, border: '1px solid #EAE5DC', padding: 28, boxShadow: '0 2px 8px rgba(11, 19, 43, 0.03)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0B132B', margin: '0 0 18px 0' }}>
              Entity Information
            </h3>

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
                <span style={{ fontSize: '0.82rem', color: '#8D99AE', fontWeight: 600 }}>GSTIN</span>
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

          {/* Right Column: Descriptive Business Health (NO FAKE NUMERIC SCORE!) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            <div style={{ backgroundColor: '#EEF8F6', borderRadius: 20, border: '1px solid #B2DDD7', padding: 24 }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#0D6258', fontWeight: 800, marginBottom: 8 }}>
                DESCRIPTIVE COMPLIANCE STATE
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0D6258', marginBottom: 6 }}>
                Quietly Compliant
              </div>
              <p style={{ fontSize: '0.84rem', color: '#084039', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                No penalty notices, zero delayed filings on record. 124 sales invoices confirmed for September 2026.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.78rem', color: '#0D6258' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 style={{ width: 14, height: 14, color: '#0E7051' }} />
                  <span>Outward sales registered (₹ 8.42 Lakhs)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 style={{ width: 14, height: 14, color: '#0E7051' }} />
                  <span>Zero floating-point calculation drift</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 style={{ width: 14, height: 14, color: '#0E7051' }} />
                  <span>3 purchase differences pending 2-minute review</span>
                </div>
              </div>
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
      {/* TAB 2: REGISTER FOR GST (6-STAGE READINESS CHECKLIST)     */}
      {/* ======================================================== */}
      {activeTab === 'registration-wizard' && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 22, border: '1px solid #EAE5DC', padding: 32, boxShadow: '0 4px 16px rgba(11, 19, 43, 0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 14, backgroundColor: '#FEF7EC', borderRadius: 14, border: '1px solid #F7E1B8', marginBottom: 24 }}>
            <Info style={{ width: 18, height: 18, color: '#B45309', flexShrink: 0 }} />
            <div style={{ fontSize: '0.82rem', color: '#B45309', lineHeight: 1.5 }}>
              <strong>Preparation Workspace:</strong> Guided readiness checklist for Form GST REG-01 preparation and statutory verification.
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
                    <div style={{ padding: '0 22px 20px 64px', fontSize: '0.86rem', color: '#596579', lineHeight: 1.6, borderTop: '1px solid #EAE5DC', paddingTop: 14 }}>
                      {s.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 28 }}>
            <button
              type="button"
              onClick={() => onShowToast('📋 Registration checklist exported to Document Vault (Sample).')}
              style={{
                padding: '12px 24px',
                fontSize: '0.88rem',
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
              <span>Export Readiness Packet</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

