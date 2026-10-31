'use client';

import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  FolderLock, 
  Users, 
  Download, 
  UploadCloud, 
  CheckCircle2, 
  FileText, 
  Clock, 
  ShieldCheck, 
  PhoneCall, 
  Mail, 
  Sparkles, 
  X,
  Gift,
  Store,
  CreditCard,
  Layers,
  Share2,
  Check,
  Building2,
  Receipt,
  UserPlus,
  Send
} from 'lucide-react';
import { 
  DEMO_BUSINESS, 
  DOCUMENTS_VAULT_FILES, 
  TIMELINE_SAMPLE_ITEMS,
  REFERRAL_ENGINE_DATA,
  KIOSK_SERVICES_DATA,
  PRICING_STRATEGY_DATA,
  MSME_OS_ROADMAP
} from '../lib/showcaseData.js';

export default function CalendarVaultSupport({ activeSection = 'calendar', onShowToast }) {
  const [currentSection, setCurrentSection] = useState(activeSection); // 'calendar' | 'vault' | 'ca-support' | 'referral' | 'kiosk' | 'pricing'
  const [isCaModalOpen, setIsCaModalOpen] = useState(false);
  const [caMessage, setCaMessage] = useState('Hi Priya, could you review the ₹2,000 difference for Calicut Packaging Solutions?');
  const [vaultFiles, setVaultFiles] = useState(DOCUMENTS_VAULT_FILES);
  const [copiedReferral, setCopiedReferral] = useState(false);

  // Sync with prop if it changes
  React.useEffect(() => {
    if (activeSection) {
      setCurrentSection(activeSection);
    }
  }, [activeSection]);

  const handleSimulateUpload = (e) => {
    e.preventDefault();
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: 'Uploaded_Tax_Invoice_Vault.pdf',
      type: 'Supplier Invoice',
      size: '840 KB',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Anchored in Vault',
      tag: 'New'
    };
    setVaultFiles([newDoc, ...vaultFiles]);
    onShowToast('📄 Document safely vaulted and cryptographically indexed.');
  };

  const handleSendCaRequest = (e) => {
    e.preventDefault();
    setIsCaModalOpen(false);
    onShowToast(`📨 Review request dispatched to ${DEMO_BUSINESS.advisor.name}.`);
  };

  const handleCopyCode = () => {
    setCopiedReferral(true);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(REFERRAL_ENGINE_DATA.referralCode);
    }
    onShowToast(`🎉 Copied referral code ${REFERRAL_ENGINE_DATA.referralCode}!`);
    setTimeout(() => setCopiedReferral(false), 2500);
  };

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', width: '100%', paddingBottom: 64 }}>
      {/* Top Header & Section Switcher */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 className="font-editorial" style={{ fontSize: '2.4rem', fontWeight: 500, color: '#0B132B', margin: 0 }}>
              {currentSection === 'calendar' ? 'Due-Date Engine & Calendar' 
               : currentSection === 'vault' ? 'Document Vault' 
               : currentSection === 'ca-support' ? 'CA / Agent Connect'
               : currentSection === 'referral' ? 'Referral Engine'
               : currentSection === 'kiosk' ? 'Kiosk Mode (Assisted)'
               : 'Pricing & MSME Compliance OS'}
            </h1>
            <span style={{ fontSize: '0.74rem', padding: '3px 8px', borderRadius: 9999, backgroundColor: '#EEF8F6', color: '#0D6258', fontWeight: 700 }}>
              {currentSection === 'referral' ? 'Acquisition Loop' : currentSection === 'kiosk' ? 'Assisted Commerce' : 'Active Portal'}
            </span>
          </div>
          <p style={{ fontSize: '0.96rem', color: '#596579', marginTop: 6 }}>
            {currentSection === 'calendar' 
              ? 'Automatically determine applicable filing deadlines with SMS, WhatsApp, and voice reminders.'
              : currentSection === 'vault' 
              ? 'Store GST certificates, returns, challans and acknowledgements with cryptographic integrity.'
              : currentSection === 'ca-support'
              ? 'Optional professional assistance: collaborative review desk with your chartered accountant.'
              : currentSection === 'referral'
              ? 'Customer acquisition loop: earn filing credits on every successful return filed.'
              : currentSection === 'kiosk'
              ? 'Assisted physical kiosk for small towns and MSME markets across Kerala & India.'
              : 'Digital automation + low-cost filing proposition and MSME Compliance OS roadmap.'}
          </p>
        </div>

        {/* Section Switcher Bar */}
        <div style={{ display: 'flex', backgroundColor: '#FFFFFF', padding: 4, borderRadius: 12, border: '1px solid #EAE5DC', flexWrap: 'wrap', gap: 4 }}>
          {[
            { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
            { id: 'vault', label: 'Document Vault', icon: FolderLock },
            { id: 'ca-support', label: 'CA Connect', icon: Users },
            { id: 'referral', label: 'Referral Engine', icon: Gift },
            { id: 'kiosk', label: 'Kiosk Mode', icon: Store },
            { id: 'pricing', label: 'Pricing & Roadmap', icon: CreditCard },
          ].map(tab => {
            const Icon = tab.icon;
            const isSel = currentSection === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCurrentSection(tab.id)}
                style={{
                  padding: '7px 12px',
                  fontSize: '0.8rem',
                  fontWeight: isSel ? 800 : 600,
                  color: isSel ? '#0D6258' : '#596579',
                  backgroundColor: isSel ? '#EEF8F6' : 'transparent',
                  border: isSel ? '1px solid #B2DDD7' : '1px solid transparent',
                  borderRadius: 8,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <Icon style={{ width: 14, height: 14, color: isSel ? '#0D6258' : '#8D99AE' }} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 1: CALENDAR & DUE-DATE ENGINE                    */}
      {/* ======================================================== */}
      {currentSection === 'calendar' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 28 }}>
          
          {/* Interactive Monthly Grid */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 20, border: '1px solid #EAE5DC', padding: 28, boxShadow: '0 2px 8px rgba(11, 19, 43, 0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0B132B' }}>
                October 2026 (Compliance for Sep Records)
              </div>
              <span style={{ fontSize: '0.74rem', color: '#0D6258', backgroundColor: '#EEF8F6', padding: '3px 8px', borderRadius: 6, fontWeight: 700 }}>
                Due-Date Engine Active
              </span>
            </div>

            {/* Days of week header */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: '0.74rem', color: '#8D99AE', fontWeight: 700, paddingBottom: 12, borderBottom: '1px solid #FAF8F5' }}>
              <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
            </div>

            {/* Calendar Days */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginTop: 12 }}>
              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                const is11th = day === 11;
                const is14th = day === 14;
                const is20th = day === 20;

                const bg = is11th ? '#ECFDF5' : is14th ? '#EEF8F6' : is20th ? '#FEF7EC' : '#FAF8F5';
                const borderColor = is11th ? '#A7F3D0' : is14th ? '#B2DDD7' : is20th ? '#F7E1B8' : 'transparent';
                const textColor = is20th ? '#B45309' : (is11th || is14th) ? '#0D6258' : '#0B132B';

                return (
                  <div
                    key={day}
                    style={{
                      height: 54,
                      borderRadius: 10,
                      backgroundColor: bg,
                      border: `1px solid ${borderColor}`,
                      padding: 6,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      fontSize: '0.8rem',
                      fontWeight: (is11th || is14th || is20th) ? 800 : 500,
                      color: textColor
                    }}
                  >
                    <span>{day}</span>
                    {is11th && <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#0E7051' }}>GSTR-1</span>}
                    {is14th && <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#0D6258' }}>2B Statement</span>}
                    {is20th && <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#B45309' }}>GSTR-3B</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Automated Reminders (SMS/WhatsApp/Email) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            
            {/* Reminder Configuration Card (PDF Module 12) */}
            <div style={{ backgroundColor: '#EEF8F6', borderRadius: 18, border: '1px solid #B2DDD7', padding: 22 }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#0D6258', fontWeight: 800, marginBottom: 8 }}>
                REMINDERS ENGINE • MODULE 12
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0D6258', marginBottom: 4 }}>
                Multi-Channel Alerts Active
              </div>
              <p style={{ fontSize: '0.8rem', color: '#084039', lineHeight: 1.5, margin: '0 0 14px 0' }}>
                Never miss a statutory deadline. Automated dispatch 5 days, 2 days, and on the morning of due dates.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.78rem', color: '#0D6258' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', backgroundColor: '#FFFFFF', borderRadius: 8 }}>
                  <span>💬 WhatsApp Reminders</span>
                  <strong style={{ color: '#0E7051' }}>Enabled (+91 98470...)</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', backgroundColor: '#FFFFFF', borderRadius: 8 }}>
                  <span>📱 SMS Compliance Alerts</span>
                  <strong style={{ color: '#0E7051' }}>Enabled</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', backgroundColor: '#FFFFFF', borderRadius: 8 }}>
                  <span>✉️ Email Summary Digest</span>
                  <strong style={{ color: '#0E7051' }}>Enabled</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', backgroundColor: '#FFFFFF', borderRadius: 8 }}>
                  <span>📞 Voice Call Alert (Due Date)</span>
                  <strong style={{ color: '#0D6258' }}>Optional</strong>
                </div>
              </div>
            </div>

            {/* Milestones list */}
            {TIMELINE_SAMPLE_ITEMS.map(item => (
              <div 
                key={item.title}
                style={{ 
                  backgroundColor: '#FFFFFF', 
                  borderRadius: 16, 
                  border: '1px solid #EAE5DC', 
                  padding: 18, 
                  boxShadow: '0 2px 6px rgba(11, 19, 43, 0.02)' 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#B45309', backgroundColor: '#FEF7EC', padding: '2px 8px', borderRadius: 6 }}>
                    {item.date}
                  </span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: item.completed ? '#0E7051' : '#B45309' }}>
                    {item.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0B132B' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '0.76rem', color: '#596579', marginTop: 4 }}>
                  {item.description}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 2: DOCUMENT VAULT                                */}
      {/* ======================================================== */}
      {currentSection === 'vault' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Dropzone */}
          <div 
            onClick={handleSimulateUpload}
            style={{ 
              border: '2px dashed #0D6258', 
              borderRadius: 20, 
              padding: '36px 20px', 
              textAlign: 'center', 
              backgroundColor: '#EEF8F6',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(13, 98, 88, 0.05)'
            }}
          >
            <UploadCloud style={{ width: 44, height: 44, color: '#0D6258', margin: '0 auto 10px' }} />
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0B132B' }}>
              Click to Vault a Purchase Bill or Tax Document
            </div>
            <div style={{ fontSize: '0.8rem', color: '#596579', marginTop: 4 }}>
              Supports PDF, PNG, JPG, and XLSX. Stored with SHA-256 integrity hash.
            </div>
          </div>

          {/* Files Table */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 20, border: '1px solid #EAE5DC', overflow: 'hidden', boxShadow: '0 2px 8px rgba(11, 19, 43, 0.03)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAF8F5', borderBottom: '1px solid #EAE5DC', color: '#596579', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '14px 20px' }}>Document Name</th>
                  <th style={{ padding: '14px 16px' }}>Category</th>
                  <th style={{ padding: '14px 16px' }}>Size</th>
                  <th style={{ padding: '14px 16px' }}>Date Added</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vaultFiles.map((doc, idx) => (
                  <tr 
                    key={doc.id}
                    style={{ borderBottom: idx === vaultFiles.length - 1 ? 'none' : '1px solid #FAF8F5' }}
                  >
                    <td style={{ padding: '14px 20px', fontWeight: 700, color: '#0B132B' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FileText style={{ width: 16, height: 16, color: '#0D6258' }} />
                        <span>{doc.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#596579' }}>{doc.type}</td>
                    <td style={{ padding: '14px 16px', color: '#8D99AE' }}>{doc.size}</td>
                    <td style={{ padding: '14px 16px', color: '#596579' }}>{doc.date}</td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => onShowToast(`📥 Downloaded ${doc.name}.`)}
                        style={{ padding: '4px 10px', fontSize: '0.76rem', fontWeight: 700, color: '#0D6258', backgroundColor: '#EEF8F6', border: '1px solid #B2DDD7', borderRadius: 6, cursor: 'pointer' }}
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 3: CA / AGENT CONNECT                            */}
      {/* ======================================================== */}
      {currentSection === 'ca-support' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
          
          {/* Advisor Card */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 20, border: '1px solid #EAE5DC', padding: 28, boxShadow: '0 2px 8px rgba(11, 19, 43, 0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div style={{ 
                width: 60, 
                height: 60, 
                borderRadius: '50%', 
                backgroundColor: '#0D6258', 
                color: '#FFFFFF', 
                fontSize: '1.3rem', 
                fontWeight: 800, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(13, 98, 88, 0.25)' 
              }}>
                {DEMO_BUSINESS.advisor.avatarInitials}
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B132B', margin: 0 }}>
                  {DEMO_BUSINESS.advisor.name}
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#596579', marginTop: 2 }}>
                  {DEMO_BUSINESS.advisor.firm}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#8D99AE', marginTop: 2 }}>
                  Membership: {DEMO_BUSINESS.advisor.membershipNo} • Kochi, Kerala
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.82rem', color: '#596579', borderTop: '1px solid #FAF8F5', paddingTop: 16, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <PhoneCall style={{ width: 14, height: 14, color: '#0D6258' }} />
                <span>{DEMO_BUSINESS.advisor.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Mail style={{ width: 14, height: 14, color: '#0D6258' }} />
                <span>{DEMO_BUSINESS.advisor.email}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCaModalOpen(true)}
              style={{
                width: '100%',
                padding: '12px 20px',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: '#FFFFFF',
                backgroundColor: '#0D6258',
                border: 'none',
                borderRadius: 12,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 14px rgba(13, 98, 88, 0.22)'
              }}
            >
              <Users style={{ width: 16, height: 16 }} />
              <span>Request Review for September</span>
            </button>
          </div>

          {/* Secure Sharing Transparency */}
          <div style={{ backgroundColor: '#EEF8F6', borderRadius: 20, border: '1px solid #B2DDD7', padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <ShieldCheck style={{ width: 20, height: 20, color: '#0D6258' }} />
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0D6258' }}>
                Secure Client-Advisor Vault
              </div>
            </div>

            <p style={{ fontSize: '0.86rem', color: '#084039', lineHeight: 1.6, margin: '0 0 18px 0' }}>
              Your chartered accountant has read-only verification access to your recorded sales invoices and purchase credit claims. They cannot modify your business records without your express approval.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.8rem', color: '#084039' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 style={{ width: 14, height: 14, color: '#0E7051' }} />
                <span>Zero login credential sharing (OTP protected)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 style={{ width: 14, height: 14, color: '#0E7051' }} />
                <span>Audit trail timestamped in SQLite ledger</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 style={{ width: 14, height: 14, color: '#0E7051' }} />
                <span>Direct reconciliation note exchange</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 4: REFERRAL ENGINE (PDF SECTION 8)               */}
      {/* ======================================================== */}
      {currentSection === 'referral' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          
          {/* Post-Filing Banner */}
          <div style={{ 
            backgroundColor: '#FEF7EC', 
            borderRadius: 22, 
            border: '2px solid #F7E1B8', 
            padding: '32px 36px',
            boxShadow: '0 10px 30px -6px rgba(180, 83, 9, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 18 }}>
              <div>
                <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#B45309', fontWeight: 800, marginBottom: 6 }}>
                  PDF SECTION 8 • CUSTOMER ACQUISITION ENGINE
                </div>
                <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#78350F', margin: '0 0 6px 0' }}>
                  {REFERRAL_ENGINE_DATA.postFilingHeadline}
                </h2>
                <p style={{ fontSize: '1.05rem', color: '#92400E', margin: '0 0 16px 0', maxWidth: 640 }}>
                  <strong>{REFERRAL_ENGINE_DATA.referrerReward}</strong>
                  <br />
                  The referred business receives: <em>“{REFERRAL_ENGINE_DATA.refereeReward}”</em>
                </p>
              </div>

              {/* Referral Code Box */}
              <div style={{ 
                backgroundColor: '#FFFFFF', 
                padding: '16px 24px', 
                borderRadius: 16, 
                border: '1px solid #F7E1B8',
                textAlign: 'center',
                boxShadow: '0 4px 14px rgba(180, 83, 9, 0.08)'
              }}>
                <div style={{ fontSize: '0.68rem', color: '#8D99AE', textTransform: 'uppercase', fontWeight: 700 }}>
                  Your Shareable Code
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#B45309', letterSpacing: '0.08em', fontFamily: 'monospace', margin: '4px 0 10px' }}>
                  {REFERRAL_ENGINE_DATA.referralCode}
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  style={{
                    padding: '8px 18px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    backgroundColor: '#B45309',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  {copiedReferral ? <Check style={{ width: 14, height: 14 }} /> : <Share2 style={{ width: 14, height: 14 }} />}
                  <span>{copiedReferral ? 'Copied Link!' : 'Copy Code & Link'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Growth Loop Diagram from PDF Page 5 */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 20, border: '1px solid #EAE5DC', padding: 28, boxShadow: '0 2px 8px rgba(11, 19, 43, 0.03)' }}>
            <div style={{ marginBottom: 18 }}>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#0D6258', fontWeight: 800 }}>
                VIRAL FLYWHEEL
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B132B', margin: '2px 0 0 0' }}>
                The GST CDA Growth Loop
              </h3>
              <p style={{ fontSize: '0.84rem', color: '#596579', marginTop: 4 }}>
                Every monthly return filed turns into a referral event, onboarding new MSMEs from registration to monthly filing.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FAF8F5', padding: '18px 24px', borderRadius: 16, border: '1px solid #EAE5DC', flexWrap: 'wrap', gap: 12 }}>
              {REFERRAL_ENGINE_DATA.growthLoop.map((node, i, arr) => (
                <React.Fragment key={i}>
                  <div style={{ 
                    padding: '8px 16px', 
                    borderRadius: 10, 
                    backgroundColor: i === 0 || i === 4 ? '#EEF8F6' : i === 1 || i === 5 ? '#FEF7EC' : '#FFFFFF',
                    border: i === 0 || i === 4 ? '1px solid #B2DDD7' : i === 1 || i === 5 ? '1px solid #F7E1B8' : '1px solid #EAE5DC',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    color: i === 0 || i === 4 ? '#0D6258' : i === 1 || i === 5 ? '#B45309' : '#0B132B'
                  }}>
                    {node}
                  </div>
                  {i < arr.length - 1 && (
                    <span style={{ color: '#8D99AE', fontWeight: 800 }}>→</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 20 }}>
              <div style={{ padding: 16, backgroundColor: '#FAF8F5', borderRadius: 12, border: '1px solid #EAE5DC' }}>
                <div style={{ fontSize: '0.74rem', color: '#8D99AE', fontWeight: 600 }}>Total Referral Credits Earned</div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0E7051', marginTop: 4 }}>₹ {REFERRAL_ENGINE_DATA.totalEarnedRupees}</div>
                <div style={{ fontSize: '0.72rem', color: '#596579', marginTop: 2 }}>Automatically discounted from next filing fees</div>
              </div>

              <div style={{ padding: 16, backgroundColor: '#FAF8F5', borderRadius: 12, border: '1px solid #EAE5DC' }}>
                <div style={{ fontSize: '0.74rem', color: '#8D99AE', fontWeight: 600 }}>Businesses Successfully Onboarded</div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0B132B', marginTop: 4 }}>{REFERRAL_ENGINE_DATA.successfulReferralsCount} Businesses</div>
                <div style={{ fontSize: '0.72rem', color: '#596579', marginTop: 2 }}>Kerala retail boutique, artisanal loom, and cafe</div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 5: KIOSK MODE (PDF SECTION 9)                    */}
      {/* ======================================================== */}
      {currentSection === 'kiosk' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          
          {/* Kiosk Hero */}
          <div style={{ 
            backgroundColor: '#0D6258', 
            color: '#FFFFFF', 
            borderRadius: 22, 
            padding: '32px 36px',
            boxShadow: '0 12px 36px rgba(13, 98, 88, 0.25)'
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', borderRadius: 9999, backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#A7F3D0', fontSize: '0.74rem', fontWeight: 700, marginBottom: 12 }}>
              <Store style={{ width: 14, height: 14 }} />
              <span>Digital-First + Assisted Commerce • Section 9</span>
            </div>
            <h2 className="font-editorial" style={{ fontSize: '2.2rem', fontWeight: 500, margin: '0 0 10px 0' }}>
              Assisted GST Services at Physical Locations
            </h2>
            <p style={{ fontSize: '0.96rem', color: '#E6F4F1', lineHeight: 1.6, maxWidth: 680, margin: 0 }}>
              Physical touchpoints for smaller towns and MSME markets across Kerala and India. A trained local kiosk operator provides hands-on assistance while the backend runs on GST CDA.
            </p>
          </div>

          {/* 6 Kiosk Services from PDF Page 5 */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 20, border: '1px solid #EAE5DC', padding: 28, boxShadow: '0 2px 8px rgba(11, 19, 43, 0.03)' }}>
            <div style={{ marginBottom: 20 }}>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#0D6258', fontWeight: 800 }}>
                OPERATOR SERVICE MENU
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B132B', margin: '2px 0 0 0' }}>
                6 Assisted Services Offered at Kiosks
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {KIOSK_SERVICES_DATA.map((srv) => (
                <div
                  key={srv.id}
                  onClick={() => onShowToast(`Activated assisted service: ${srv.title}`)}
                  style={{
                    padding: 20,
                    borderRadius: 16,
                    backgroundColor: '#FAF8F5',
                    border: '1px solid #EAE5DC',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: 140,
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#0D6258';
                    e.currentTarget.style.backgroundColor = '#EEF8F6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#EAE5DC';
                    e.currentTarget.style.backgroundColor = '#FAF8F5';
                  }}
                >
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0B132B' }}>
                      {srv.title}
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#596579', lineHeight: 1.45, marginTop: 4 }}>
                      {srv.desc}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: '#0D6258', fontWeight: 700, paddingTop: 10, borderTop: '1px solid #EAE5DC' }}>
                    <span>Launch Touchflow</span>
                    <span>→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 6: PRICING STRATEGY & MSME OS ROADMAP            */}
      {/* ======================================================== */}
      {currentSection === 'pricing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          
          {/* Pricing Grid from PDF Section 7 */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 20, border: '1px solid #EAE5DC', padding: 28, boxShadow: '0 2px 8px rgba(11, 19, 43, 0.03)' }}>
            <div style={{ marginBottom: 20 }}>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#0D6258', fontWeight: 800 }}>
                PDF SECTION 7 • PRICING STRATEGY
              </span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0B132B', margin: '2px 0 0 0' }}>
                Digital Automation + Low-Cost Filing Proposition
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {PRICING_STRATEGY_DATA.map((tier) => (
                <div
                  key={tier.id}
                  style={{
                    padding: 22,
                    borderRadius: 16,
                    backgroundColor: tier.highlight ? '#EEF8F6' : '#FAF8F5',
                    border: tier.highlight ? '2px solid #0D6258' : '1px solid #EAE5DC',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: 340,
                    boxShadow: tier.highlight ? '0 8px 24px -4px rgba(13, 98, 88, 0.15)' : 'none'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0B132B' }}>{tier.tier}</span>
                      {tier.highlight && (
                        <span style={{ fontSize: '0.64rem', fontWeight: 800, color: '#FFFFFF', backgroundColor: '#0D6258', padding: '2px 6px', borderRadius: 4 }}>
                          Current
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0B132B', lineHeight: 1 }}>
                      {tier.price} <span style={{ fontSize: '0.74rem', color: '#8D99AE', fontWeight: 500 }}>/{tier.frequency}</span>
                    </div>
                    <p style={{ fontSize: '0.74rem', color: '#596579', margin: '8px 0 16px 0', lineHeight: 1.4 }}>
                      {tier.headline}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid #EAE5DC', paddingTop: 14 }}>
                      {tier.features.map((f, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: '0.74rem', color: '#0B132B' }}>
                          <CheckCircle2 style={{ width: 13, height: 13, color: '#0E7051', flexShrink: 0, marginTop: 2 }} />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onShowToast(`Selected plan: ${tier.tier}`)}
                    style={{
                      width: '100%',
                      marginTop: 20,
                      padding: '10px 14px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: tier.highlight ? '#FFFFFF' : '#0B132B',
                      backgroundColor: tier.highlight ? '#0D6258' : '#FFFFFF',
                      border: tier.highlight ? 'none' : '1px solid #DCD5C9',
                      borderRadius: 10,
                      cursor: 'pointer'
                    }}
                  >
                    {tier.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Phase 2: MSME Compliance OS Roadmap (PDF Section 11) */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 20, border: '1px solid #EAE5DC', padding: 28, boxShadow: '0 2px 8px rgba(11, 19, 43, 0.03)' }}>
            <div style={{ marginBottom: 18 }}>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8D99AE', fontWeight: 800 }}>
                PDF SECTION 11 • LONG-TERM OPPORTUNITY (PHASE 2)
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B132B', margin: '2px 0 0 0' }}>
                MSME Compliance OS Expansion Stack
              </h3>
              <p style={{ fontSize: '0.84rem', color: '#596579', marginTop: 4 }}>
                “If executed correctly, this isn't merely a GST filing business. It becomes the foundational operating system for Indian MSMEs.”
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', backgroundColor: '#FAF8F5', padding: 18, borderRadius: 16, border: '1px solid #EAE5DC' }}>
              {MSME_OS_ROADMAP.map((item, idx, arr) => (
                <React.Fragment key={item}>
                  <div style={{ 
                    padding: '6px 12px', 
                    borderRadius: 8, 
                    backgroundColor: idx === 0 ? '#0D6258' : '#FFFFFF',
                    color: idx === 0 ? '#FFFFFF' : '#0B132B',
                    border: '1px solid #EAE5DC',
                    fontSize: '0.78rem',
                    fontWeight: 700
                  }}>
                    {item}
                  </div>
                  {idx < arr.length - 1 && (
                    <span style={{ color: '#8D99AE', fontSize: '0.78rem' }}>↓</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: REQUEST ADVISOR REVIEW                            */}
      {/* ======================================================== */}
      {isCaModalOpen && (
        <div className="drawer-overlay" style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <div style={{ width: '100%', maxWidth: 520, backgroundColor: '#FFFFFF', borderRadius: 22, padding: 32, boxShadow: '0 25px 60px rgba(11, 19, 43, 0.25)', border: '1px solid #EAE5DC' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #EAE5DC', paddingBottom: 16, marginBottom: 20 }}>
              <div>
                <h3 className="font-editorial" style={{ fontSize: '1.45rem', fontWeight: 500, color: '#0B132B', margin: 0 }}>
                  Request Advisor Review
                </h3>
                <span style={{ fontSize: '0.76rem', color: '#596579' }}>
                  {DEMO_BUSINESS.advisor.name} ({DEMO_BUSINESS.advisor.firm})
                </span>
              </div>
              <button 
                type="button"
                onClick={() => setIsCaModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8D99AE' }}
              >
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            <p style={{ fontSize: '0.84rem', color: '#596579', lineHeight: 1.5, margin: '0 0 16px 0' }}>
              Send an encrypted review note. Your chartered accountant can inspect your September outward sales register and 3 purchase differences without touching your books.
            </p>

            <textarea
              value={caMessage}
              onChange={(e) => setCaMessage(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                padding: '12px 14px',
                fontSize: '0.86rem',
                borderRadius: 10,
                border: '1px solid #DCD5C9',
                backgroundColor: '#FAF8F5',
                color: '#0B132B',
                outline: 'none',
                marginBottom: 20,
                lineHeight: 1.5
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                onClick={() => setIsCaModalOpen(false)}
                style={{ padding: '10px 18px', fontSize: '0.84rem', fontWeight: 600, color: '#596579', background: 'none', border: '1px solid #DCD5C9', borderRadius: 10, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendCaRequest}
                style={{ padding: '10px 22px', fontSize: '0.84rem', fontWeight: 700, color: '#FFFFFF', backgroundColor: '#0D6258', border: 'none', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <span>Send Note</span>
                <Send style={{ width: 14, height: 14 }} />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
