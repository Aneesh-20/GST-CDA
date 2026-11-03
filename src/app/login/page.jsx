'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  ArrowLeft,
  Smartphone,
  Sparkles,
  Award
} from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  // Auth Modes: 'LOGIN' (default with Google, Phone & Password) | 'PHONE_OTP' | 'REGISTER'
  const [authMode, setAuthMode] = useState('LOGIN');
  const [showPassword, setShowPassword] = useState(false);
  
  // Login Form States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Phone OTP States
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  
  // Register Form States
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    businessName: '',
    usernameOrEmail: '',
    mobile: '',
    password: '',
    role: 'OWNER'
  });

  const completeLogin = (user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gst_cda_current_user', JSON.stringify(user));
      window.location.href = '/?view=app';
    }
  };

  // 1. Google One-Click Login
  const handleGoogleLogin = () => {
    const googleUser = {
      name: 'Google Verified Business Owner',
      email: 'owner@gmail.com',
      role: 'OWNER',
      businessName: 'Apex Retails & Trading',
      authProvider: 'google'
    };
    completeLogin(googleUser);
  };

  // 2. Username & Password Login
  const handlePasswordLoginSubmit = (e) => {
    e.preventDefault();
    const raw = (username || '').trim();
    const email = raw.includes('@') ? raw : (raw ? `${raw.toLowerCase()}@user.in` : 'owner@business.in');
    const name = raw.split('@')[0] || 'Business Owner';
    const user = {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email: email,
      role: 'OWNER',
      businessName: `${name.charAt(0).toUpperCase() + name.slice(1)}'s Enterprise`,
      authProvider: 'password'
    };
    completeLogin(user);
  };

  // 3. Phone OTP Submit
  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (!otpSent) {
      if (mobileNumber.trim().length >= 10) {
        setOtpSent(true);
      }
    } else {
      const user = {
        name: `User ${mobileNumber.slice(-4)}`,
        email: `${mobileNumber}@phone.taxmate.in`,
        mobile: mobileNumber,
        role: 'OWNER',
        businessName: 'Mobile Registered Business',
        authProvider: 'phone'
      };
      completeLogin(user);
    }
  };

  // 4. Registration Submit
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const raw = (registerForm.usernameOrEmail || '').trim();
    const email = raw.includes('@') ? raw : `${raw.toLowerCase()}@taxmate.in`;
    const user = {
      name: registerForm.fullName || 'Registered Entrepreneur',
      email: email,
      mobile: registerForm.mobile,
      role: registerForm.role || 'OWNER',
      businessName: registerForm.businessName || 'My Enterprise',
      authProvider: 'registration'
    };
    completeLogin(user);
  };

  // Quick Demo Logins for fast evaluation
  const handleQuickDemoLogin = (email, role, name, businessName) => {
    const user = { email, role, name, businessName, authProvider: 'demo' };
    completeLogin(user);
  };

  return (
    <div className="login-split-page">
      
      {/* ======================================================== */}
      {/* 1. LEFT PANEL: DESKTOP EDITORIAL BRAND SHOWCASE         */}
      {/* (Visible on Laptop / Desktop, Hidden on Mobile Screens)  */}
      {/* ======================================================== */}
      <div className="login-brand-panel hide-on-mobile">
        
        {/* Top Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ 
            width: 38, 
            height: 38, 
            borderRadius: 10, 
            backgroundColor: '#0D6258', 
            color: '#FFFFFF', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1rem',
            boxShadow: '0 4px 12px rgba(13, 98, 88, 0.25)'
          }}>
            TM
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0B132B' }}>TaxMate</div>
            <div style={{ fontSize: '0.7rem', color: '#596579' }}>Smart GST Compliance Companion</div>
          </div>
        </div>

        {/* Center Editorial Showcase with Real Photo */}
        <div style={{ margin: '32px 0' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 9999, backgroundColor: '#EEF8F6', border: '1px solid #B2DDD7', marginBottom: 14 }}>
            <span className="pulse-dot-green" />
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0D6258', letterSpacing: '0.04em' }}>
              INDIA’S SIMPLEST GST PLATFORM
            </span>
          </div>

          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0B132B', lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 0 14px 0' }}>
            GST Made Simple.<br />
            Business Made Easy.
          </h2>

          <p style={{ fontSize: '0.96rem', color: '#596579', lineHeight: 1.6, maxWidth: 480, margin: '0 0 24px 0' }}>
            From starting your business to filing your monthly GST return — one digital platform with 0 notice risk and verified integer math.
          </p>

          {/* Real Photo with Floating Verification Cards */}
          <div style={{ position: 'relative', maxWidth: 420, marginBottom: 28 }}>
            
            <div style={{ 
              borderRadius: 22, 
              overflow: 'hidden', 
              boxShadow: '0 20px 48px -8px rgba(11, 19, 43, 0.16)',
              border: '4px solid #FFFFFF'
            }}>
              <img 
                src="/images/hero-entrepreneur.jpg" 
                alt="Indian business entrepreneur using TaxMate" 
                style={{ width: '100%', height: 'auto', display: 'block', maxHeight: 240, objectFit: 'cover' }}
              />
            </div>

            {/* Floating Live Badge A */}
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '-14px',
              backgroundColor: 'rgba(255, 255, 255, 0.96)',
              backdropFilter: 'blur(12px)',
              padding: '10px 14px',
              borderRadius: 12,
              border: '1px solid #B2DDD7',
              boxShadow: '0 8px 24px rgba(13, 98, 88, 0.16)',
              fontSize: '0.72rem'
            }}>
              <div style={{ color: '#0D6258', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.62rem' }}>GSTR-2B Verified</div>
              <div style={{ fontWeight: 800, color: '#0B132B', marginTop: 2 }}>ITC Matched: ₹1,15,200 ✓</div>
            </div>

            {/* Floating Live Badge B */}
            <div style={{
              position: 'absolute',
              bottom: '12px',
              right: '-14px',
              backgroundColor: '#070B14',
              color: '#FFFFFF',
              padding: '10px 14px',
              borderRadius: 12,
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 12px 28px rgba(0, 0, 0, 0.35)',
              fontSize: '0.72rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#10B981', fontWeight: 800, fontSize: '0.64rem' }}>
                <ShieldCheck style={{ width: 13, height: 13 }} />
                <span>100% NOTICE DEFENSE</span>
              </div>
              <div style={{ fontWeight: 700, color: '#FFFFFF', marginTop: 2 }}>Rule 88C variance: 0.00%</div>
            </div>

          </div>

          {/* 3 Core Bullet Points */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              '5 Plain Steps: Sales → Purchases → ITC → Tax → File',
              'Deterministic BigInt integer math: Zero floating-point rounding drift',
              'Section 16(2)(aa) auto-match with 1-click WhatsApp vendor recovery'
            ].map((pt, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: '#0B132B', fontWeight: 600 }}>
                <CheckCircle2 style={{ width: 16, height: 16, color: '#059669', flexShrink: 0 }} />
                <span>{pt}</span>
              </div>
            ))}
          </div>

        </div>

        {/* Footer Vision Quote from PDF Page 7 */}
        <div style={{ paddingTop: 20, borderTop: '1px solid #EAE5DC' }}>
          <p style={{ fontSize: '0.82rem', fontStyle: 'italic', color: '#596579', margin: 0 }}>
            “India's simplest digital compliance platform — helping entrepreneurs remain compliant without needing to become a GST expert.”
          </p>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 2. RIGHT PANEL: AUTHENTICATION FORM                     */}
      {/* (Fills Full Screen on Mobile, Right Column on Laptop)    */}
      {/* ======================================================== */}
      <div className="login-form-panel">
        
        <div style={{ maxWidth: 440, width: '100%' }}>
          
          {/* Top Row: Back to Website Link & SSL Badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <Link 
              href="/" 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 6, 
                fontSize: '0.84rem', 
                fontWeight: 700, 
                color: '#0D6258', 
                textDecoration: 'none',
                padding: '6px 12px',
                borderRadius: 8,
                backgroundColor: '#EEF8F6',
                border: '1px solid #B2DDD7',
                transition: 'all 0.15s ease'
              }}
            >
              <ArrowLeft style={{ width: 14, height: 14 }} />
              <span>Back to Website</span>
            </Link>

            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#059669', backgroundColor: '#ECFDF5', padding: '4px 10px', borderRadius: 9999, border: '1px solid #A7F3D0' }}>
              SSL SECURE
            </span>
          </div>

          {/* Form Header */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div 
              style={{ 
                width: 48, 
                height: 48, 
                borderRadius: 12, 
                backgroundColor: '#0D6258', 
                color: '#FFFFFF', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontWeight: 800, 
                fontSize: '1.25rem',
                margin: '0 auto 12px',
                boxShadow: '0 4px 16px rgba(13, 98, 88, 0.3)'
              }}
            >
              TM
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0B132B', letterSpacing: '-0.02em', margin: '0 0 6px 0' }}>
              {authMode === 'REGISTER' ? 'Create Your Account' : 'Sign in to TaxMate'}
            </h1>
            <p style={{ fontSize: '0.86rem', color: '#64748B', margin: 0 }}>
              {authMode === 'REGISTER' 
                ? 'Join 6.3 Crore MSMEs for zero-notice-risk GST filing' 
                : 'Sign in to file your monthly return in ~2 minutes'}
            </p>
          </div>

          {/* ======================================================== */}
          {/* LOGIN FLOW (3 OPTIONS: GOOGLE, PHONE & PASSWORD)         */}
          {/* ======================================================== */}
          {authMode === 'LOGIN' && (
            <div>
              {/* OPTION 1: CONTINUE WITH GOOGLE */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                style={{
                  width: '100%',
                  padding: '13px 16px',
                  borderRadius: 12,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #DCD5C9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  color: '#0B132B',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.15s ease',
                  marginBottom: 12
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FAF8F5';
                  e.currentTarget.style.borderColor = '#0D6258';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#DCD5C9';
                }}
              >
                {/* Google Colorful G Icon */}
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* OPTION 2: CONTINUE WITH PHONE */}
              <button
                type="button"
                onClick={() => {
                  setAuthMode('PHONE_OTP');
                  setOtpSent(false);
                }}
                style={{
                  width: '100%',
                  padding: '13px 16px',
                  borderRadius: 12,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #DCD5C9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  color: '#0B132B',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.15s ease',
                  marginBottom: 22
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FAF8F5';
                  e.currentTarget.style.borderColor = '#0D6258';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#DCD5C9';
                }}
              >
                <Smartphone style={{ width: 18, height: 18, color: '#0D6258' }} />
                <span>Continue with Phone</span>
              </button>

              {/* DIVIDER */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
                <div style={{ flex: 1, height: 1, backgroundColor: '#EAE5DC' }} />
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#8D99AE', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  or sign in with password
                </span>
                <div style={{ flex: 1, height: 1, backgroundColor: '#EAE5DC' }} />
              </div>

              {/* OPTION 3: ENTER USERNAME AND PASSWORD */}
              <form onSubmit={handlePasswordLoginSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#0B132B', marginBottom: 6 }}>
                    Username or Email
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. aneesh@business.in or trader_99"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{ 
                      width: '100%', 
                      padding: '12px 14px', 
                      borderRadius: 10, 
                      border: '1px solid #DCD5C9', 
                      fontSize: '0.92rem',
                      outline: 'none',
                      backgroundColor: '#FAF8F5',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#0D6258'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#DCD5C9'}
                  />
                </div>

                <div style={{ marginBottom: 6 }}>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#0B132B', marginBottom: 6 }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{ 
                        width: '100%', 
                        padding: '12px 42px 12px 14px', 
                        borderRadius: 10, 
                        border: '1px solid #DCD5C9', 
                        fontSize: '0.92rem',
                        outline: 'none',
                        backgroundColor: '#FAF8F5',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#0D6258'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#DCD5C9'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: 12, top: 13, background: 'none', border: 'none', color: '#8D99AE', cursor: 'pointer' }}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff style={{ width: 18, height: 18 }} /> : <Eye style={{ width: 18, height: 18 }} />}
                    </button>
                  </div>
                </div>

                {/* DOWN THE PASSWORD BOX: REGISTER? IN BLUE COLOUR */}
                <div style={{ marginTop: 10, marginBottom: 22, fontSize: '0.86rem', color: '#596579', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    Don't have an account?{' '}
                    <span
                      onClick={() => setAuthMode('REGISTER')}
                      style={{ color: '#2563EB', fontWeight: 800, cursor: 'pointer', textDecoration: 'none' }}
                      onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                      onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                    >
                      Register?
                    </span>
                  </div>

                  <a 
                    href="#forgot" 
                    onClick={(e) => { e.preventDefault(); setAuthMode('PHONE_OTP'); }} 
                    style={{ fontSize: '0.8rem', color: '#64748B', textDecoration: 'none' }}
                  >
                    Forgot?
                  </a>
                </div>

                {/* Primary Glowing Action Button */}
                <button
                  type="submit"
                  className="btn-glowing-primary"
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    fontSize: '0.96rem',
                    borderRadius: 12
                  }}
                >
                  <span>Sign In & File Now</span>
                  <ArrowRight style={{ width: 16, height: 16 }} />
                </button>
              </form>
            </div>
          )}

          {/* ======================================================== */}
          {/* PHONE OTP FLOW (OPTION 2 EXPANDED)                       */}
          {/* ======================================================== */}
          {authMode === 'PHONE_OTP' && (
            <div>
              <form onSubmit={handlePhoneSubmit}>
                {!otpSent ? (
                  <div>
                    <div style={{ marginBottom: 18 }}>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#0B132B', marginBottom: 6 }}>
                        Mobile Phone Number
                      </label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ padding: '12px 14px', backgroundColor: '#F1F5F9', borderRadius: 10, border: '1px solid #DCD5C9', fontSize: '0.92rem', fontWeight: 700, color: '#0B132B' }}>
                          +91
                        </div>
                        <input
                          type="tel"
                          placeholder="e.g. 9876543210"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          maxLength={10}
                          required
                          style={{ flex: 1, padding: '12px 14px', borderRadius: 10, border: '1px solid #DCD5C9', fontSize: '0.92rem', outline: 'none', backgroundColor: '#FAF8F5', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: 6 }}>
                        We will send a 6-digit verification code to your phone.
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn-glowing-primary"
                      style={{ width: '100%', padding: '14px 18px', fontSize: '0.96rem', borderRadius: 12 }}
                    >
                      <span>Send Verification Code</span>
                      <ArrowRight style={{ width: 16, height: 16 }} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ marginBottom: 18 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <label style={{ margin: 0, fontSize: '0.84rem', fontWeight: 700, color: '#0B132B' }}>
                          Enter 6-Digit OTP
                        </label>
                        <button
                          type="button"
                          onClick={() => setOtpSent(false)}
                          style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Change Number
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Enter 123456"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        maxLength={6}
                        required
                        style={{ width: '100%', padding: '13px 14px', borderRadius: 10, border: '1.5px solid #0D6258', fontSize: '1.3rem', textAlign: 'center', letterSpacing: '0.3em', fontWeight: 800, boxSizing: 'border-box' }}
                      />
                      <div style={{ fontSize: '0.76rem', color: '#059669', marginTop: 6, fontWeight: 700 }}>
                        ✓ Demo verification code: <strong>123456</strong>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn-glowing-primary"
                      style={{ width: '100%', padding: '14px 18px', fontSize: '0.96rem', borderRadius: 12 }}
                    >
                      <span>Verify & File Now</span>
                      <ArrowRight style={{ width: 16, height: 16 }} />
                    </button>
                  </div>
                )}
              </form>

              {/* Back to password or register */}
              <div style={{ textAlign: 'center', marginTop: 20, fontSize: '0.84rem' }}>
                <span 
                  onClick={() => setAuthMode('LOGIN')} 
                  style={{ color: '#0D6258', fontWeight: 700, cursor: 'pointer' }}
                >
                  ← Back to other login options
                </span>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* REGISTRATION FLOW (TRIGGERED BY "REGISTER?" CLICK)       */}
          {/* ======================================================== */}
          {authMode === 'REGISTER' && (
            <form onSubmit={handleRegisterSubmit}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#0B132B', marginBottom: 5 }}>
                  Your Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aneesh Naren"
                  value={registerForm.fullName}
                  onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                  required
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #DCD5C9', fontSize: '0.9rem', backgroundColor: '#FAF8F5', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#0B132B', marginBottom: 5 }}>
                  Business / Enterprise Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apex Hardware & Spices"
                  value={registerForm.businessName}
                  onChange={(e) => setRegisterForm({ ...registerForm, businessName: e.target.value })}
                  required
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #DCD5C9', fontSize: '0.9rem', backgroundColor: '#FAF8F5', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#0B132B', marginBottom: 5 }}>
                  Username or Email Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. aneesh@business.in"
                  value={registerForm.usernameOrEmail}
                  onChange={(e) => setRegisterForm({ ...registerForm, usernameOrEmail: e.target.value })}
                  required
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #DCD5C9', fontSize: '0.9rem', backgroundColor: '#FAF8F5', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: 6 }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#0B132B', marginBottom: 5 }}>
                  Create Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimum 6 characters"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    required
                    style={{ width: '100%', padding: '11px 42px 11px 14px', borderRadius: 10, border: '1px solid #DCD5C9', fontSize: '0.9rem', backgroundColor: '#FAF8F5', boxSizing: 'border-box' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: 12, top: 12, background: 'none', border: 'none', color: '#8D99AE', cursor: 'pointer' }}
                  >
                    {showPassword ? <EyeOff style={{ width: 17, height: 17 }} /> : <Eye style={{ width: 17, height: 17 }} />}
                  </button>
                </div>
              </div>

              {/* DOWN PASSWORD BOX: ALREADY HAVE AN ACCOUNT? SIGN IN */}
              <div style={{ marginTop: 10, marginBottom: 20, fontSize: '0.86rem', color: '#596579' }}>
                Already have an account?{' '}
                <span
                  onClick={() => setAuthMode('LOGIN')}
                  style={{ color: '#2563EB', fontWeight: 800, cursor: 'pointer', textDecoration: 'none' }}
                  onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                >
                  Sign In
                </span>
              </div>

              <button
                type="submit"
                className="btn-glowing-primary"
                style={{ width: '100%', padding: '14px 18px', fontSize: '0.96rem', borderRadius: 12 }}
              >
                <span>Create Account & File Now</span>
                <ArrowRight style={{ width: 16, height: 16 }} />
              </button>
            </form>
          )}

          {/* ======================================================== */}
          {/* ONE-CLICK DEMO ACCOUNTS (CONVENIENT FOR QUICK EVALUATION)*/}
          {/* ======================================================== */}
          <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid #EAE5DC' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#8D99AE', textAlign: 'center', marginBottom: 10, letterSpacing: '0.06em' }}>
              Instant One-Click Demo Access
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('owner@murugantraders.in', 'OWNER', 'Murugan N', 'Murugan Electricals & Hardware')}
                style={{ padding: '9px 12px', backgroundColor: '#FAF8F5', border: '1px solid #EAE5DC', borderRadius: 10, fontSize: '0.76rem', fontWeight: 700, color: '#0B132B', cursor: 'pointer', textAlign: 'left' }}
              >
                👤 Shop Owner (Murugan)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('ca.audit@taxfirm.in', 'CA', 'Ramanujam CA', 'Audit & Compliance Firm')}
                style={{ padding: '9px 12px', backgroundColor: '#FAF8F5', border: '1px solid #EAE5DC', borderRadius: 10, fontSize: '0.76rem', fontWeight: 700, color: '#0B132B', cursor: 'pointer', textAlign: 'left' }}
              >
                🎓 Chartered Accountant
              </button>
            </div>
          </div>

          {/* Security Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 22, fontSize: '0.76rem', color: '#64748B' }}>
            <ShieldCheck style={{ width: 16, height: 16, color: '#059669' }} />
            <span>256-Bit Encrypted Statutory GSP Session</span>
          </div>

        </div>

      </div>

    </div>
  );
}
