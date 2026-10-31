'use client';

import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Store, 
  ShoppingBag, 
  Building2, 
  Rocket, 
  Sparkles, 
  ShieldCheck, 
  UserCheck, 
  Briefcase, 
  CheckCircle2,
  Info
} from 'lucide-react';

export default function ConversationalOnboarding({ onComplete, onCancel }) {
  const [step, setStep] = useState(1);
  const [hasBusiness, setHasBusiness] = useState('yes'); // 'yes' | 'starting'
  const [persona, setPersona] = useState('small_business');
  const [gstStatus, setGstStatus] = useState('yes'); // 'yes' | 'no' | 'not_sure'
  const [gstinInput, setGstinInput] = useState('32AABCA8842P1Z9');
  const [gstinFormatValid, setGstinFormatValid] = useState(true);

  const handleGstinChange = (val) => {
    const cleaned = val.toUpperCase().trim();
    setGstinInput(cleaned);
    const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    setGstinFormatValid(regex.test(cleaned) || cleaned.length === 0);
  };

  const personas = [
    { id: 'shop_owner', title: 'Shop Owner', desc: 'Retail store, boutique, or counter outlet', icon: Store },
    { id: 'trader', title: 'Trader & Merchant', desc: 'Wholesale, distributor, or B2B goods', icon: ShoppingBag },
    { id: 'small_business', title: 'Small Business Owner', desc: 'Lifestyle brand, studio, or enterprise', icon: Building2 },
    { id: 'startup', title: 'Startup Founder', desc: 'Digital commerce, tech, or D2C venture', icon: Rocket },
    { id: 'freelancer', title: 'Freelancer / Consultant', desc: 'Independent services or creative studio', icon: Sparkles },
    { id: 'accountant', title: 'Accountant / Tax CA', desc: 'Managing compliance for client books', icon: Briefcase },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAF8F5', color: '#0B132B', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header with Thin Line Progress */}
      <header style={{ 
        height: 68, 
        borderBottom: '1px solid #EAE5DC', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '0 32px',
        backgroundColor: '#FFFFFF' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ 
            width: 32, 
            height: 32, 
            borderRadius: 8, 
            backgroundColor: '#0D6258', 
            color: '#FFFFFF', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontWeight: 800, 
            fontSize: '0.85rem' 
          }}>
            CDA
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0B132B' }}>GST CDA</div>
            <div style={{ fontSize: '0.68rem', color: '#8D99AE' }}>Guided Onboarding Concierge</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '0.78rem', color: '#596579', fontWeight: 600 }}>
            Step {step} of 4
          </span>
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '0.78rem',
              color: '#8D99AE',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Skip to dashboard
          </button>
        </div>
      </header>

      {/* Thin Elegant Progress Line */}
      <div style={{ height: 3, width: '100%', backgroundColor: '#EAE5DC', position: 'relative' }}>
        <div style={{ 
          height: '100%', 
          width: `${(step / 4) * 100}%`, 
          backgroundColor: '#0D6258', 
          transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)' 
        }} />
      </div>

      {/* Main Wizard Form Body */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '36px 20px' }}>
        <div style={{ width: '100%', maxWidth: 640 }}>

          {/* STEP 1: Business Status */}
          {step === 1 && (
            <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#0D6258', fontWeight: 800, marginBottom: 8 }}>
                WELCOME TO GST CDA
              </div>
              <h2 className="font-editorial" style={{ fontSize: '2.4rem', fontWeight: 500, lineHeight: 1.15, color: '#0B132B', margin: '0 0 10px 0' }}>
                Do you already have a business?
              </h2>
              <p style={{ fontSize: '0.96rem', color: '#596579', margin: '0 0 28px 0' }}>
                We tailor our guidance whether you have active transactions or are preparing to launch.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 36 }}>
                <div 
                  onClick={() => setHasBusiness('yes')}
                  style={{
                    padding: 24,
                    borderRadius: 16,
                    backgroundColor: hasBusiness === 'yes' ? '#EEF8F6' : '#FFFFFF',
                    border: hasBusiness === 'yes' ? '2px solid #0D6258' : '1px solid #EAE5DC',
                    cursor: 'pointer',
                    boxShadow: hasBusiness === 'yes' ? '0 10px 24px -6px rgba(13, 98, 88, 0.15)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ 
                    width: 36, 
                    height: 36, 
                    borderRadius: 10, 
                    backgroundColor: hasBusiness === 'yes' ? '#0D6258' : '#F5F1EA', 
                    color: hasBusiness === 'yes' ? '#FFFFFF' : '#0B132B',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    marginBottom: 14 
                  }}>
                    <Building2 style={{ width: 18, height: 18 }} />
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0B132B', marginBottom: 4 }}>
                    I already have a business
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#596579', lineHeight: 1.5 }}>
                    I have sales, purchase bills, and need quiet GST compliance.
                  </div>
                </div>

                <div 
                  onClick={() => setHasBusiness('starting')}
                  style={{
                    padding: 24,
                    borderRadius: 16,
                    backgroundColor: hasBusiness === 'starting' ? '#EEF8F6' : '#FFFFFF',
                    border: hasBusiness === 'starting' ? '2px solid #0D6258' : '1px solid #EAE5DC',
                    cursor: 'pointer',
                    boxShadow: hasBusiness === 'starting' ? '0 10px 24px -6px rgba(13, 98, 88, 0.15)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ 
                    width: 36, 
                    height: 36, 
                    borderRadius: 10, 
                    backgroundColor: hasBusiness === 'starting' ? '#0D6258' : '#F5F1EA', 
                    color: hasBusiness === 'starting' ? '#FFFFFF' : '#0B132B',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    marginBottom: 14 
                  }}>
                    <Rocket style={{ width: 18, height: 18 }} />
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0B132B', marginBottom: 4 }}>
                    I’m starting one
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#596579', lineHeight: 1.5 }}>
                    I’m exploring whether I need GST and preparing my setup.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  style={{
                    padding: '12px 28px',
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
                    boxShadow: '0 6px 18px rgba(13, 98, 88, 0.25)'
                  }}
                >
                  <span>Continue</span>
                  <ArrowRight style={{ width: 16, height: 16 }} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Persona Description */}
          {step === 2 && (
            <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#0D6258', fontWeight: 800, marginBottom: 8 }}>
                STEP 2 OF 4 • YOUR PROFILE
              </div>
              <h2 className="font-editorial" style={{ fontSize: '2.4rem', fontWeight: 500, lineHeight: 1.15, color: '#0B132B', margin: '0 0 10px 0' }}>
                What best describes you?
              </h2>
              <p style={{ fontSize: '0.96rem', color: '#596579', margin: '0 0 24px 0' }}>
                We calibrate terminology, tax thresholds, and suggested categories based on your sector.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 32 }}>
                {personas.map(p => {
                  const Icon = p.icon;
                  const isSelected = persona === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setPersona(p.id)}
                      style={{
                        padding: '16px 18px',
                        borderRadius: 14,
                        backgroundColor: isSelected ? '#EEF8F6' : '#FFFFFF',
                        border: isSelected ? '2px solid #0D6258' : '1px solid #EAE5DC',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 12,
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ 
                        width: 32, 
                        height: 32, 
                        borderRadius: 8, 
                        backgroundColor: isSelected ? '#0D6258' : '#FAF8F5', 
                        color: isSelected ? '#FFFFFF' : '#0B132B',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Icon style={{ width: 16, height: 16 }} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0B132B' }}>{p.title}</div>
                        <div style={{ fontSize: '0.74rem', color: '#596579', marginTop: 2, lineHeight: 1.4 }}>{p.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    padding: '10px 20px',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    color: '#596579',
                    backgroundColor: 'transparent',
                    border: '1px solid #DCD5C9',
                    borderRadius: 10,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <ArrowLeft style={{ width: 14, height: 14 }} />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  style={{
                    padding: '12px 28px',
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
                    boxShadow: '0 6px 18px rgba(13, 98, 88, 0.25)'
                  }}
                >
                  <span>Continue</span>
                  <ArrowRight style={{ width: 16, height: 16 }} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: GST Number */}
          {step === 3 && (
            <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#0D6258', fontWeight: 800, marginBottom: 8 }}>
                STEP 3 OF 4 • GST STATUS
              </div>
              <h2 className="font-editorial" style={{ fontSize: '2.4rem', fontWeight: 500, lineHeight: 1.15, color: '#0B132B', margin: '0 0 10px 0' }}>
                Do you have a GST number?
              </h2>
              <p style={{ fontSize: '0.96rem', color: '#596579', margin: '0 0 24px 0' }}>
                If you already have a 15-character GSTIN, we’ll verify its structure and configure your regional rules.
              </p>

              {/* 3 Status Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
                {[
                  { id: 'yes', label: 'Yes, I have one' },
                  { id: 'no', label: 'Not yet' },
                  { id: 'not_sure', label: 'I’m not sure' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setGstStatus(opt.id)}
                    style={{
                      padding: '14px 10px',
                      borderRadius: 12,
                      backgroundColor: gstStatus === opt.id ? '#EEF8F6' : '#FFFFFF',
                      border: gstStatus === opt.id ? '2px solid #0D6258' : '1px solid #EAE5DC',
                      color: gstStatus === opt.id ? '#0D6258' : '#0B132B',
                      fontWeight: 700,
                      fontSize: '0.86rem',
                      cursor: 'pointer'
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Revealed GSTIN Input */}
              {gstStatus === 'yes' && (
                <div style={{ 
                  padding: 20, 
                  backgroundColor: '#FFFFFF', 
                  borderRadius: 16, 
                  border: '1px solid #EAE5DC', 
                  marginBottom: 24 
                }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0B132B', marginBottom: 8 }}>
                    Enter 15-Digit GSTIN (Goods and Services Tax ID)
                  </label>
                  <input
                    type="text"
                    value={gstinInput}
                    onChange={(e) => handleGstinChange(e.target.value)}
                    placeholder="e.g. 32AABCA8842P1Z9"
                    maxLength={15}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      fontFamily: 'monospace',
                      letterSpacing: '0.08em',
                      borderRadius: 10,
                      border: gstinFormatValid ? '1px solid #DCD5C9' : '2px solid #DC2626',
                      backgroundColor: '#FAF8F5',
                      outline: 'none',
                      color: '#0B132B'
                    }}
                  />

                  {gstinFormatValid ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: '0.78rem', color: '#0E7051' }}>
                      <CheckCircle2 style={{ width: 14, height: 14 }} />
                      <span>Format valid: State Code 32 (Kerala) • PAN: AABCA8842P</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: '0.78rem', color: '#DC2626' }}>
                      <Info style={{ width: 14, height: 14 }} />
                      <span>Standard Indian GSTIN is 15 alphanumeric characters.</span>
                    </div>
                  )}

                  <div style={{ 
                    marginTop: 14, 
                    padding: '10px 14px', 
                    backgroundColor: '#FAF8F5', 
                    borderRadius: 10, 
                    fontSize: '0.76rem', 
                    color: '#596579', 
                    lineHeight: 1.5,
                    border: '1px solid #EAE5DC'
                  }}>
                    <ShieldCheck style={{ width: 14, height: 14, color: '#0D6258', display: 'inline', marginRight: 5 }} />
                    <strong>Non-technical reassurance:</strong> We check the format locally. Connecting to government GST portal services happens only when you explicitly authorise it.
                  </div>
                </div>
              )}

              {gstStatus !== 'yes' && (
                <div style={{ 
                  padding: 18, 
                  backgroundColor: '#FEF7EC', 
                  borderRadius: 14, 
                  border: '1px solid #F7E1B8', 
                  marginBottom: 24, 
                  fontSize: '0.82rem', 
                  color: '#B45309',
                  lineHeight: 1.5
                }}>
                  <strong>No worries!</strong> In India, you only need mandatory GST registration if your annual turnover exceeds ₹40 Lakhs (goods) or ₹20 Lakhs (services). We’ll set up your workspace in preparation mode.
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  style={{
                    padding: '10px 20px',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    color: '#596579',
                    backgroundColor: 'transparent',
                    border: '1px solid #DCD5C9',
                    borderRadius: 10,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <ArrowLeft style={{ width: 14, height: 14 }} />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(4)}
                  style={{
                    padding: '12px 28px',
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
                    boxShadow: '0 6px 18px rgba(13, 98, 88, 0.25)'
                  }}
                >
                  <span>Continue</span>
                  <ArrowRight style={{ width: 16, height: 16 }} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Space Ready */}
          {step === 4 && (
            <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
              <div style={{ 
                width: 48, 
                height: 48, 
                borderRadius: 14, 
                backgroundColor: '#ECFDF5', 
                color: '#0E7051', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginBottom: 16 
              }}>
                <CheckCircle2 style={{ width: 28, height: 28 }} />
              </div>

              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#0E7051', fontWeight: 800, marginBottom: 6 }}>
                READINESS CONFIRMED
              </div>

              <h2 className="font-editorial" style={{ fontSize: '2.4rem', fontWeight: 500, lineHeight: 1.15, color: '#0B132B', margin: '0 0 10px 0' }}>
                Your space is ready.
              </h2>
              <p style={{ fontSize: '0.96rem', color: '#596579', margin: '0 0 28px 0' }}>
                We have configured your digital desk for <strong>Anaya Home & Living</strong> based in Kochi, Kerala.
              </p>

              {/* Personalized Readiness Summary Card */}
              <div style={{ 
                padding: '20px 24px', 
                backgroundColor: '#FFFFFF', 
                borderRadius: 18, 
                border: '1px solid #EAE5DC', 
                marginBottom: 32,
                boxShadow: '0 10px 30px -6px rgba(11, 19, 43, 0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 14, borderBottom: '1px solid #FAF8F5' }}>
                  <span style={{ fontSize: '0.82rem', color: '#8D99AE', fontWeight: 600 }}>Legal Entity</span>
                  <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0B132B' }}>Anaya Home & Living LLP</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #FAF8F5' }}>
                  <span style={{ fontSize: '0.82rem', color: '#8D99AE', fontWeight: 600 }}>Jurisdiction</span>
                  <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0B132B' }}>Kerala (State Code 32)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #FAF8F5' }}>
                  <span style={{ fontSize: '0.82rem', color: '#8D99AE', fontWeight: 600 }}>Active Period</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0D6258', backgroundColor: '#EEF8F6', padding: '3px 8px', borderRadius: 6 }}>September 2026</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14 }}>
                  <span style={{ fontSize: '0.82rem', color: '#8D99AE', fontWeight: 600 }}>First Next Step</span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#B45309' }}>Review 3 purchase differences</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  style={{
                    padding: '10px 20px',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    color: '#596579',
                    backgroundColor: 'transparent',
                    border: '1px solid #DCD5C9',
                    borderRadius: 10,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <ArrowLeft style={{ width: 14, height: 14 }} />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const onboardingState = {
                      hasBusiness,
                      persona,
                      gstStatus,
                      gstin: gstinInput,
                      completedAt: new Date().toISOString()
                    };
                    try {
                      localStorage.setItem('gst_cda_onboarding', JSON.stringify(onboardingState));
                    } catch (e) {}
                    onComplete(onboardingState);
                  }}
                  style={{
                    padding: '14px 32px',
                    fontSize: '0.98rem',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    backgroundColor: '#0D6258',
                    border: 'none',
                    borderRadius: 14,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: '0 8px 24px -4px rgba(13, 98, 88, 0.35)'
                  }}
                >
                  <span>Take me to my home</span>
                  <ArrowRight style={{ width: 17, height: 17 }} />
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

