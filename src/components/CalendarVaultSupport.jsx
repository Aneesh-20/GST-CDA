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
  X
} from 'lucide-react';
import { DEMO_BUSINESS, DOCUMENTS_VAULT_FILES, TIMELINE_SAMPLE_ITEMS } from '../lib/showcaseData.js';

export default function CalendarVaultSupport({ activeSection = 'calendar', onShowToast }) {
  const [currentSection, setCurrentSection] = useState(activeSection); // 'calendar' | 'vault' | 'ca-support'
  const [isCaModalOpen, setIsCaModalOpen] = useState(false);
  const [caMessage, setCaMessage] = useState('Hi Priya, could you review the ₹2,000 difference for Calicut Packaging Solutions?');
  const [vaultFiles, setVaultFiles] = useState(DOCUMENTS_VAULT_FILES);

  const handleSimulateUpload = (e) => {
    e.preventDefault();
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: 'Uploaded_Tax_Invoice_Sample.pdf',
      type: 'Supplier Invoice',
      size: '840 KB',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Anchored in Vault (Demo)',
      tag: 'New'
    };
    setVaultFiles([newDoc, ...vaultFiles]);
    onShowToast('📄 Document safely vaulted and cryptographically indexed (Sample).');
  };

  const handleSendCaRequest = (e) => {
    e.preventDefault();
    setIsCaModalOpen(false);
    onShowToast(`📨 Review request dispatched to ${DEMO_BUSINESS.advisor.name}.`);
  };

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', width: '100%', paddingBottom: 64 }}>
      {/* Top Header & Section Switcher */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 className="font-editorial" style={{ fontSize: '2.4rem', fontWeight: 500, color: '#0B132B', margin: 0 }}>
              {currentSection === 'calendar' ? 'Compliance Calendar' : currentSection === 'vault' ? 'Document Vault' : 'Chartered Accountant Support'}
            </h1>
            <span style={{ fontSize: '0.74rem', padding: '3px 8px', borderRadius: 9999, backgroundColor: '#FEF7EC', color: '#B45309', fontWeight: 700 }}>
              Fictional Demo Environment
            </span>
          </div>
          <p style={{ fontSize: '0.96rem', color: '#596579', marginTop: 6 }}>
            {currentSection === 'calendar' 
              ? 'Upcoming filing milestones and statutory checkpoints for September 2026.'
              : currentSection === 'vault' 
              ? 'Immutable cryptographic document storage for invoices, receipts, and returns.'
              : 'Collaborative desk with your verified tax advisor.'}
          </p>
        </div>

        {/* Section Switcher */}
        <div style={{ display: 'flex', backgroundColor: '#FFFFFF', padding: 4, borderRadius: 12, border: '1px solid #EAE5DC' }}>
          <button
            type="button"
            onClick={() => setCurrentSection('calendar')}
            style={{
              padding: '8px 16px',
              fontSize: '0.84rem',
              fontWeight: currentSection === 'calendar' ? 800 : 600,
              color: currentSection === 'calendar' ? '#0D6258' : '#596579',
              backgroundColor: currentSection === 'calendar' ? '#EEF8F6' : 'transparent',
              border: currentSection === 'calendar' ? '1px solid #B2DDD7' : 'none',
              borderRadius: 8,
              cursor: 'pointer'
            }}
          >
            Calendar
          </button>
          <button
            type="button"
            onClick={() => setCurrentSection('vault')}
            style={{
              padding: '8px 16px',
              fontSize: '0.84rem',
              fontWeight: currentSection === 'vault' ? 800 : 600,
              color: currentSection === 'vault' ? '#0D6258' : '#596579',
              backgroundColor: currentSection === 'vault' ? '#EEF8F6' : 'transparent',
              border: currentSection === 'vault' ? '1px solid #B2DDD7' : 'none',
              borderRadius: 8,
              cursor: 'pointer'
            }}
          >
            Document Vault
          </button>
          <button
            type="button"
            onClick={() => setCurrentSection('ca-support')}
            style={{
              padding: '8px 16px',
              fontSize: '0.84rem',
              fontWeight: currentSection === 'ca-support' ? 800 : 600,
              color: currentSection === 'ca-support' ? '#0D6258' : '#596579',
              backgroundColor: currentSection === 'ca-support' ? '#EEF8F6' : 'transparent',
              border: currentSection === 'ca-support' ? '1px solid #B2DDD7' : 'none',
              borderRadius: 8,
              cursor: 'pointer'
            }}
          >
            CA Support
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 1: CALENDAR                                      */}
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
                Sample Calendar
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

          {/* Right Column: Key Statutory Milestones */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {TIMELINE_SAMPLE_ITEMS.map(item => (
              <div 
                key={item.title}
                style={{ 
                  backgroundColor: '#FFFFFF', 
                  borderRadius: 18, 
                  border: '1px solid #EAE5DC', 
                  padding: 20, 
                  boxShadow: '0 2px 8px rgba(11, 19, 43, 0.02)' 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#B45309', backgroundColor: '#FEF7EC', padding: '2px 8px', borderRadius: 6 }}>
                    {item.date} (Sample)
                  </span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: item.completed ? '#0E7051' : '#B45309' }}>
                    {item.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0B132B' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#596579', marginTop: 4 }}>
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
          {/* Upload Dropzone Simulator */}
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

          {/* Vault Files Table */}
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
                        onClick={() => onShowToast(`📥 Downloaded ${doc.name} (Sample).`)}
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
      {/* SECTION 3: CHARTERED ACCOUNTANT SUPPORT                  */}
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
      {/* MODAL: REQUEST ADVISOR REVIEW                            */}
      {/* ======================================================== */}
      {isCaModalOpen && (
        <div className="drawer-overlay" style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <div style={{ width: '100%', maxWidth: 520, backgroundColor: '#FFFFFF', borderRadius: 22, padding: 32, boxShadow: '0 25px 60px rgba(11, 19, 43, 0.25)', border: '1px solid #EAE5DC' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #EAE5DC', paddingBottom: 16, marginBottom: 20 }}>
              <div>
                <h3 className="font-editorial" style={{ fontSize: '1.45rem', fontWeight: 500, color: '#0B132B', margin: 0 }}>
                  Request Review from CA Priya
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#596579', marginTop: 2 }}>
                  Period: September 2026 (Demo)
                </div>
              </div>
              <button onClick={() => setIsCaModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8D99AE' }}>
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            <form onSubmit={handleSendCaRequest}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0B132B', marginBottom: 6 }}>
                Note for your Chartered Accountant:
              </label>
              <textarea
                rows={4}
                value={caMessage}
                onChange={(e) => setCaMessage(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 12,
                  border: '1px solid #DCD5C9',
                  backgroundColor: '#FAF8F5',
                  fontSize: '0.86rem',
                  color: '#0B132B',
                  outline: 'none',
                  lineHeight: 1.5,
                  marginBottom: 20
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
                  type="submit"
                  style={{ padding: '10px 22px', fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', backgroundColor: '#0D6258', border: 'none', borderRadius: 10, cursor: 'pointer' }}
                >
                  Send to Accountant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
