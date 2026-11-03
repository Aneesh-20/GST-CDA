'use client';

import React, { useState, useEffect } from 'react';
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
  Award,
  KeyRound,
  X,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  // Auth Modes:
  // 'LOGIN' (default with Google, Phone & Password)
  // 'PHONE_OTP' (enter mobile & verify OTP)
  // 'CREATE_PASSWORD' (create password for phone number after OTP verification)
  // 'REGISTER' (standard registration)
  const [authMode, setAuthMode] = useState('LOGIN');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Login Form States (supports phone number, email, or username)
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Phone OTP States
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [otpError, setOtpError] = useState('');
  
  // Create Password States (Step after OTP)
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Google Modal States
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [showCustomGoogleInput, setShowCustomGoogleInput] = useState(false);

  // Register Form States
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    businessName: '',
    usernameOrEmail: '',
    mobile: '',
    password: '',
    role: 'OWNER'
  });

  // Countdown timer for OTP
  useEffect(() => {
    let timer;
    if (otpCountdown > 0) {
      timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpCountdown]);

  const completeLogin = (user, business) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gst_cda_current_user', JSON.stringify(user));
      if (business) {
        localStorage.setItem('gst_cda_business_profile', JSON.stringify(business));
      }
      window.location.href = '/?view=app';
    }
  };

  // ============================================================
  // 1. GOOGLE LOGIN HANDLER
  // ============================================================
  const executeGoogleLogin = async (email, name) => {
    setIsSubmitting(true);
    setLoginError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'GOOGLE_LOGIN',
          email: email || 'aneesh.biz@gmail.com',
          name: name || 'Aneesh Business'
        })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setIsGoogleModalOpen(false);
        completeLogin(data.user, data.business);
      } else {
        setLoginError(data.error || 'Google sign-in failed');
      }
    } catch (err) {
      setLoginError('Network error connecting to authentication server');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // 2. PHONE OTP FLOW: STEP 1 - SEND OTP
  // ============================================================
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    const cleanDigits = mobileNumber.replace(/\D/g, '');
    if (cleanDigits.length < 10) {
      setOtpError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsSubmitting(true);
    setOtpError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'REQUEST_PHONE_OTP',
          phone: cleanDigits
        })
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setOtpCountdown(30);
      } else {
        setOtpError(data.error || 'Failed to send OTP via SMS');
      }
    } catch (err) {
      setOtpError('Could not reach authentication server');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // 2. PHONE OTP FLOW: STEP 2 - VERIFY OTP
  // ============================================================
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const cleanDigits = mobileNumber.replace(/\D/g, '');
    if (!otpCode || otpCode.trim().length < 4) {
      setOtpError('Please enter the 6-digit verification code received on your phone');
      return;
    }

    setIsSubmitting(true);
    setOtpError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'VERIFY_PHONE_OTP',
          phone: cleanDigits,
          otp: otpCode.trim()
        })
      });
      const data = await res.json();
      if (data.success && data.verified) {
        // User is verified! Advance to Step 3: CREATE PASSWORD for their phone number
        setOwnerName(data.user?.name || `Trader ${cleanDigits.slice(-4)}`);
        setBusinessName(data.user?.business_name || `Enterprise ${cleanDigits.slice(-4)}`);
        setAuthMode('CREATE_PASSWORD');
      } else {
        setOtpError(data.error || 'Invalid OTP code');
      }
    } catch (err) {
      setOtpError('Error verifying OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // 2. PHONE OTP FLOW: STEP 3 - CREATE PASSWORD FOR PHONE LOGIN
  // ============================================================
  const handleSetPhonePassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 4) {
      setPasswordError('Password must be at least 4 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    setPasswordError('');
    const cleanDigits = mobileNumber.replace(/\D/g, '');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SET_PHONE_PASSWORD',
          phone: cleanDigits,
          password: newPassword,
          name: ownerName || `Trader ${cleanDigits.slice(-4)}`,
          businessName: businessName || `${ownerName || 'Trader'}'s Enterprise`
        })
      });
      const data = await res.json();
      if (data.success && data.user) {
        completeLogin(data.user, data.business);
      } else {
        setPasswordError(data.error || 'Failed to save password');
      }
    } catch (err) {
      setPasswordError('Error saving password');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // 3. MAIN FORM: LOGIN WITH PHONE NUMBER / USERNAME / EMAIL & PASSWORD
  // ============================================================
  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      setLoginError('Please enter your phone number, email, or username');
      return;
    }

    setIsSubmitting(true);
    setLoginError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'LOGIN_CREDENTIALS',
          identifier: loginIdentifier.trim(),
          password: loginPassword
        })
      });
      const data = await res.json();
      if (data.success && data.user) {
        completeLogin(data.user, data.business);
      } else {
        setLoginError(data.error || 'Invalid credentials. Please verify and try again.');
      }
    } catch (err) {
      setLoginError('Could not connect to authentication service');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // 4. REGISTRATION FORM SUBMIT
  // ============================================================
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError('');
    try {
      const raw = (registerForm.usernameOrEmail || '').trim();
      const email = raw.includes('@') ? raw : `${raw.toLowerCase()}@taxmate.in`;
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          name: registerForm.fullName || 'Registered Entrepreneur',
          role: registerForm.role || 'OWNER',
          businessName: registerForm.businessName || 'My Enterprise'
        })
      });
      const data = await res.json();
      if (data.success && data.user) {
        completeLogin(data.user, data.business);
      } else {
        setLoginError(data.error || 'Registration failed');
      }
    } catch (err) {
      setLoginError('Registration error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Demo Logins
  const handleQuickDemoLogin = async (email, role, name, bName) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role, name, businessName: bName })
      });
      const data = await res.json();
      if (data.success && data.user) {
        completeLogin(data.user, data.business);
      }
    } catch (e) {
      completeLogin({ email, role, name, businessName: bName, authProvider: 'demo' });
    } finally {
      setIsSubmitting(false);
    }
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

        {/* Footer Vision Quote */}
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
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
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div 
              style={{ 
                width: 46, 
                height: 46, 
                borderRadius: 12, 
                backgroundColor: '#0D6258', 
                color: '#FFFFFF', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontWeight: 800, 
                fontSize: '1.2rem',
                margin: '0 auto 10px',
                boxShadow: '0 4px 16px rgba(13, 98, 88, 0.3)'
              }}
            >
              TM
            </div>
            
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0B132B', letterSpacing: '-0.02em', margin: '0 0 4px 0' }}>
              {authMode === 'REGISTER' && 'Create Your Account'}
              {authMode === 'PHONE_OTP' && (otpSent ? 'Verify Phone OTP' : 'Sign in with Phone')}
              {authMode === 'CREATE_PASSWORD' && 'Create Your Password'}
              {authMode === 'LOGIN' && 'Sign in to TaxMate'}
            </h1>

            <p style={{ fontSize: '0.86rem', color: '#64748B', margin: 0 }}>
              {authMode === 'REGISTER' && 'Join 6.3 Crore MSMEs for zero-notice-risk GST filing'}
              {authMode === 'PHONE_OTP' && (otpSent ? `Enter the 6-digit code sent to +91 ${mobileNumber}` : 'Enter your mobile number to receive a verification OTP')}
              {authMode === 'CREATE_PASSWORD' && `Phone +91 ${mobileNumber} verified! Now set your password.`}
              {authMode === 'LOGIN' && 'Sign in to file your monthly return in ~2 minutes'}
            </p>
          </div>

          {/* ======================================================== */}
          {/* FLOW A: DEFAULT LOGIN VIEW (GOOGLE, PHONE, PASSWORD)     */}
          {/* ======================================================== */}
          {authMode === 'LOGIN' && (
            <div>
              {/* Error Alert */}
              {loginError && (
                <div style={{
                  padding: '10px 14px',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  borderRadius: 10,
                  color: '#991B1B',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                  <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} />
                  <span>{loginError}</span>
                </div>
              )}

              {/* OPTION 1: CONTINUE WITH GOOGLE */}
              <button
                type="button"
                onClick={() => setIsGoogleModalOpen(true)}
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
                {/* Google Logo SVG */}
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
                  setOtpError('');
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
                  marginBottom: 20
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ flex: 1, height: 1, backgroundColor: '#EAE5DC' }} />
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#8D99AE', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  or sign in with password
                </span>
                <div style={{ flex: 1, height: 1, backgroundColor: '#EAE5DC' }} />
              </div>

              {/* OPTION 3: PHONE NUMBER, USERNAME, OR EMAIL & PASSWORD */}
              <form onSubmit={handleCredentialsLogin}>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#0B132B', marginBottom: 6 }}>
                    Phone Number, Username, or Email
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 9876543210, aneesh@business.in"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
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
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
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
                <div style={{ marginTop: 10, marginBottom: 20, fontSize: '0.86rem', color: '#596579', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    Don't have an account?{' '}
                    <span
                      onClick={() => {
                        setAuthMode('REGISTER');
                        setLoginError('');
                      }}
                      style={{ color: '#2563EB', fontWeight: 800, cursor: 'pointer', textDecoration: 'none' }}
                      onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                      onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                    >
                      Register?
                    </span>
                  </div>

                  <a 
                    href="#forgot" 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      setAuthMode('PHONE_OTP'); 
                      setOtpSent(false);
                      setOtpError('');
                    }} 
                    style={{ fontSize: '0.8rem', color: '#64748B', textDecoration: 'none' }}
                  >
                    Forgot?
                  </a>
                </div>

                {/* Primary Glowing Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-glowing-primary"
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    fontSize: '0.96rem',
                    borderRadius: 12,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  <span>{isSubmitting ? 'Signing in...' : 'Sign In & File Now'}</span>
                  <ArrowRight style={{ width: 16, height: 16 }} />
                </button>
              </form>
            </div>
          )}

          {/* ======================================================== */}
          {/* FLOW B: PHONE OTP (ENTER MOBILE & ENTER OTP)             */}
          {/* ======================================================== */}
          {authMode === 'PHONE_OTP' && (
            <div>
              {otpError && (
                <div style={{
                  padding: '10px 14px',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  borderRadius: 10,
                  color: '#991B1B',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                  <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} />
                  <span>{otpError}</span>
                </div>
              )}

              {!otpSent ? (
                // SUB-STEP 1: ENTER PHONE NUMBER
                <form onSubmit={handleRequestOtp}>
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#0B132B', marginBottom: 6 }}>
                      Mobile Phone Number
                    </label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <div style={{ 
                        padding: '12px 14px', 
                        backgroundColor: '#F1F5F9', 
                        borderRadius: 10, 
                        border: '1px solid #DCD5C9', 
                        fontSize: '0.92rem', 
                        fontWeight: 700, 
                        color: '#0B132B',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}>
                        <span>🇮🇳</span>
                        <span>+91</span>
                      </div>
                      <input
                        type="tel"
                        placeholder="e.g. 9876543210"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                        maxLength={10}
                        required
                        autoFocus
                        style={{ 
                          flex: 1, 
                          padding: '12px 14px', 
                          borderRadius: 10, 
                          border: '1px solid #DCD5C9', 
                          fontSize: '0.98rem', 
                          fontWeight: 600,
                          outline: 'none', 
                          backgroundColor: '#FAF8F5', 
                          boxSizing: 'border-box' 
                        }}
                      />
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: 8 }}>
                      We will send a 6-digit statutory verification OTP to your phone.
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || mobileNumber.length < 10}
                    className="btn-glowing-primary"
                    style={{ 
                      width: '100%', 
                      padding: '14px 18px', 
                      fontSize: '0.96rem', 
                      borderRadius: 12,
                      opacity: (isSubmitting || mobileNumber.length < 10) ? 0.7 : 1,
                      cursor: (isSubmitting || mobileNumber.length < 10) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <span>{isSubmitting ? 'Sending OTP...' : 'Send Verification Code'}</span>
                    <ArrowRight style={{ width: 16, height: 16 }} />
                  </button>
                </form>
              ) : (
                // SUB-STEP 2: ENTER 6-DIGIT OTP
                <form onSubmit={handleVerifyOtp}>
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <label style={{ margin: 0, fontSize: '0.84rem', fontWeight: 700, color: '#0B132B' }}>
                        Enter 6-Digit OTP
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false);
                          setOtpCode('');
                          setOtpError('');
                        }}
                        style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Change Number (+91 {mobileNumber})
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="• • • • • •"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      maxLength={6}
                      required
                      autoFocus
                      style={{ 
                        width: '100%', 
                        padding: '14px 14px', 
                        borderRadius: 10, 
                        border: '2px solid #0D6258', 
                        fontSize: '1.4rem', 
                        textAlign: 'center', 
                        letterSpacing: '0.35em', 
                        fontWeight: 800, 
                        backgroundColor: '#FFFFFF',
                        boxSizing: 'border-box',
                        color: '#0B132B'
                      }}
                    />

                    {/* Resend SMS row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        Didn't receive SMS?
                      </span>
                      {otpCountdown > 0 ? (
                        <span style={{ fontSize: '0.75rem', color: '#8D99AE', fontWeight: 600 }}>
                          Resend OTP in {otpCountdown}s
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleRequestOtp}
                          style={{ background: 'none', border: 'none', color: '#0D6258', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                        >
                          Resend Code
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || otpCode.length < 4}
                    className="btn-glowing-primary"
                    style={{ 
                      width: '100%', 
                      padding: '14px 18px', 
                      fontSize: '0.96rem', 
                      borderRadius: 12,
                      opacity: (isSubmitting || otpCode.length < 4) ? 0.7 : 1,
                      cursor: (isSubmitting || otpCode.length < 4) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <span>{isSubmitting ? 'Verifying...' : 'Verify OTP & Set Password'}</span>
                    <ArrowRight style={{ width: 16, height: 16 }} />
                  </button>
                </form>
              )}

              {/* Back to other login options */}
              <div style={{ textAlign: 'center', marginTop: 20, fontSize: '0.84rem' }}>
                <span 
                  onClick={() => {
                    setAuthMode('LOGIN');
                    setOtpSent(false);
                    setOtpError('');
                  }} 
                  style={{ color: '#0D6258', fontWeight: 700, cursor: 'pointer' }}
                >
                  ← Back to other login options
                </span>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* FLOW C: CREATE PASSWORD (AFTER OTP IS VERIFIED)          */}
          {/* ======================================================== */}
          {authMode === 'CREATE_PASSWORD' && (
            <div>
              {passwordError && (
                <div style={{
                  padding: '10px 14px',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  borderRadius: 10,
                  color: '#991B1B',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                  <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} />
                  <span>{passwordError}</span>
                </div>
              )}

              {/* Verified Pill */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 9999,
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
                color: '#065F46',
                fontSize: '0.78rem',
                fontWeight: 700,
                marginBottom: 16
              }}>
                <CheckCircle2 style={{ width: 15, height: 15, color: '#059669' }} />
                <span>Mobile +91 {mobileNumber} Verified Successfully</span>
              </div>

              <form onSubmit={handleSetPhonePassword}>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#0B132B', marginBottom: 6 }}>
                    Create Password for +91 {mobileNumber}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Minimum 4 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      autoFocus
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
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: 12, top: 13, background: 'none', border: 'none', color: '#8D99AE', cursor: 'pointer' }}
                    >
                      {showPassword ? <EyeOff style={{ width: 18, height: 18 }} /> : <Eye style={{ width: 18, height: 18 }} />}
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#0B132B', marginBottom: 6 }}>
                    Confirm Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{ position: 'absolute', right: 12, top: 13, background: 'none', border: 'none', color: '#8D99AE', cursor: 'pointer' }}
                    >
                      {showConfirmPassword ? <EyeOff style={{ width: 18, height: 18 }} /> : <Eye style={{ width: 18, height: 18 }} />}
                    </button>
                  </div>

                  {confirmPassword && (
                    <div style={{ 
                      marginTop: 6, 
                      fontSize: '0.74rem', 
                      fontWeight: 700, 
                      color: newPassword === confirmPassword ? '#059669' : '#DC2626' 
                    }}>
                      {newPassword === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#0B132B', marginBottom: 6 }}>
                    Your Name or Business Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Hardware & Electricals"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
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
                  />
                  <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: 4 }}>
                    Used on your GSTR-3B and GSTR-1 returns.
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !newPassword || newPassword !== confirmPassword}
                  className="btn-glowing-primary"
                  style={{ 
                    width: '100%', 
                    padding: '14px 18px', 
                    fontSize: '0.96rem', 
                    borderRadius: 12,
                    opacity: (isSubmitting || !newPassword || newPassword !== confirmPassword) ? 0.7 : 1,
                    cursor: (isSubmitting || !newPassword || newPassword !== confirmPassword) ? 'not-allowed' : 'pointer'
                  }}
                >
                  <span>{isSubmitting ? 'Saving Password...' : 'Save Password & Start Filing'}</span>
                  <ArrowRight style={{ width: 16, height: 16 }} />
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: 18, fontSize: '0.82rem', color: '#64748B' }}>
                You can now log in anytime using <strong>+91 {mobileNumber}</strong> and this password!
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* FLOW D: REGISTRATION FLOW (TRIGGERED BY "REGISTER?")     */}
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
                  Username, Phone, or Email
                </label>
                <input
                  type="text"
                  placeholder="e.g. 9876543210 or aneesh@business.in"
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
                    placeholder="Minimum 4 characters"
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
                disabled={isSubmitting}
                className="btn-glowing-primary"
                style={{ width: '100%', padding: '14px 18px', fontSize: '0.96rem', borderRadius: 12 }}
              >
                <span>{isSubmitting ? 'Creating...' : 'Create Account & File Now'}</span>
                <ArrowRight style={{ width: 16, height: 16 }} />
              </button>
            </form>
          )}

          {/* ======================================================== */}
          {/* ONE-CLICK DEMO ACCOUNTS                                  */}
          {/* ======================================================== */}
          <div style={{ marginTop: 26, paddingTop: 18, borderTop: '1px solid #EAE5DC' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 20, fontSize: '0.76rem', color: '#64748B' }}>
            <ShieldCheck style={{ width: 16, height: 16, color: '#059669' }} />
            <span>256-Bit Encrypted Statutory GSP Session</span>
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* 3. GOOGLE SIGN-IN DARK OAUTH WINDOW (MATCHING GOOGLE UX)  */}
      {/* ======================================================== */}
      {isGoogleModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.78)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#000000',
            borderRadius: 28,
            maxWidth: 820,
            width: '100%',
            boxShadow: '0 25px 70px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            border: '1px solid #303134',
            overflow: 'hidden',
            color: '#FFFFFF',
            fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            position: 'relative'
          }}>

            {/* Indeterminate Google loading progress bar */}
            {isSubmitting && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, backgroundColor: '#1E293B', overflow: 'hidden' }}>
                <div style={{
                  width: '45%',
                  height: '100%',
                  backgroundColor: '#8AB4F8',
                  animation: 'dropdownPop 0.8s infinite ease-in-out alternate'
                }} />
              </div>
            )}

            {/* Top Bar with G Logo & Close Button */}
            <div style={{ padding: '24px 32px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span style={{ fontSize: '0.88rem', fontWeight: 500, color: '#E8EAED', letterSpacing: '0.01em' }}>
                  Sign in with Google
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsGoogleModalOpen(false);
                  setShowCustomGoogleInput(false);
                }}
                style={{ background: 'none', border: 'none', color: '#9AA0A6', cursor: 'pointer', padding: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                aria-label="Close Google sign in"
              >
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            {/* Main Content Area */}
            <div className="google-oauth-grid" style={{
              display: 'grid',
              gridTemplateColumns: '1.05fr 1fr',
              gap: '36px',
              padding: '28px 32px 36px',
              minHeight: '340px'
            }}>
              
              {/* LEFT COLUMN: TITLE & CONTEXT */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <h2 style={{
                  fontSize: '2rem',
                  fontWeight: 400,
                  color: '#FFFFFF',
                  margin: '0 0 10px 0',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2
                }}>
                  Choose an account
                </h2>
                
                <div style={{ fontSize: '1.02rem', color: '#E8EAED', fontWeight: 400 }}>
                  to continue to <span style={{ color: '#8AB4F8', fontWeight: 500 }}>TaxMate</span>
                </div>
              </div>

              {/* RIGHT COLUMN: ACCOUNTS LIST */}
              <div>
                {!showCustomGoogleInput ? (
                  <div>
                    {/* Account 1: Narendaran T.J */}
                    <div 
                      onClick={() => executeGoogleLogin('vasanthinarendren.tj@gmail.com', 'Narendaran T.J')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        padding: '12px 10px',
                        cursor: 'pointer',
                        borderRadius: 8,
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#18191B'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: '#795548',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                        fontSize: '0.88rem',
                        flexShrink: 0
                      }}>
                        N
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.92rem', fontWeight: 500, color: '#FFFFFF', lineHeight: 1.3 }}>
                          Narendaran T.J
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#9AA0A6', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          vasanthinarendren.tj@gmail.com
                        </div>
                      </div>
                    </div>

                    <div style={{ height: 1, backgroundColor: '#303134' }} />

                    {/* Account 2: Aneesh Narendran */}
                    <div 
                      onClick={() => executeGoogleLogin('fftgmessi@gmail.com', 'Aneesh Narendran')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        padding: '12px 10px',
                        cursor: 'pointer',
                        borderRadius: 8,
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#18191B'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: '#00594C',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                        fontSize: '0.88rem',
                        flexShrink: 0
                      }}>
                        A
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.92rem', fontWeight: 500, color: '#FFFFFF', lineHeight: 1.3 }}>
                          Aneesh Narendran
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#9AA0A6', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          fftgmessi@gmail.com
                        </div>
                      </div>
                    </div>

                    <div style={{ height: 1, backgroundColor: '#303134' }} />

                    {/* Account 3: Aneesh TN */}
                    <div 
                      onClick={() => executeGoogleLogin('aneesh.narendaran@gmail.com', 'Aneesh TN')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        padding: '12px 10px',
                        cursor: 'pointer',
                        borderRadius: 8,
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#18191B'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: '#1976D2',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                        fontSize: '0.88rem',
                        flexShrink: 0
                      }}>
                        A
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.92rem', fontWeight: 500, color: '#FFFFFF', lineHeight: 1.3 }}>
                          Aneesh TN
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#9AA0A6', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          aneesh.narendaran@gmail.com
                        </div>
                      </div>
                    </div>

                    <div style={{ height: 1, backgroundColor: '#303134' }} />

                    {/* Account 4: Buk8 */}
                    <div 
                      onClick={() => executeGoogleLogin('buk8tech@gmail.com', 'Buk8')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        padding: '12px 10px',
                        cursor: 'pointer',
                        borderRadius: 8,
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#18191B'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: '#0A0E1A',
                        border: '1px solid #1E293B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {/* Buk8 Dotted Tech Logo */}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <circle cx="8" cy="6" r="2" fill="#4285F4"/>
                          <circle cx="16" cy="6" r="2" fill="#4285F4"/>
                          <circle cx="8" cy="12" r="2" fill="#4285F4"/>
                          <circle cx="16" cy="12" r="2" fill="#4285F4"/>
                          <circle cx="8" cy="18" r="2" fill="#4285F4"/>
                          <circle cx="16" cy="18" r="2" fill="#4285F4"/>
                        </svg>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.92rem', fontWeight: 500, color: '#FFFFFF', lineHeight: 1.3 }}>
                          Buk8
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#9AA0A6', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          buk8tech@gmail.com
                        </div>
                      </div>
                    </div>

                    <div style={{ height: 1, backgroundColor: '#303134' }} />

                    {/* Account 5: Use another account */}
                    <div 
                      onClick={() => setShowCustomGoogleInput(true)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        padding: '12px 10px',
                        cursor: 'pointer',
                        borderRadius: 8,
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#18191B'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div style={{
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9AA0A6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.92rem', fontWeight: 500, color: '#FFFFFF' }}>
                          Use another account
                        </div>
                      </div>
                    </div>

                    <div style={{ height: 1, backgroundColor: '#303134' }} />

                    {/* Bottom Legal Disclaimer matching screenshot */}
                    <div style={{ marginTop: '24px', fontSize: '0.78rem', color: '#9AA0A6', lineHeight: 1.5 }}>
                      Before using this app, you can review TaxMate’s{' '}
                      <span style={{ color: '#8AB4F8', cursor: 'pointer' }}>Privacy Policy</span> and{' '}
                      <span style={{ color: '#8AB4F8', cursor: 'pointer' }}>Terms of Service</span>.
                    </div>
                  </div>
                ) : (
                  /* Custom Google Email Input (Google Dark Theme) */
                  <div style={{ paddingTop: 10 }}>
                    <div style={{ fontSize: '1rem', fontWeight: 500, color: '#FFFFFF', marginBottom: 6 }}>
                      Sign in with another Google account
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#9AA0A6', marginBottom: 18 }}>
                      Enter your Google email address or workspace account
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <input
                        type="email"
                        placeholder="Email or phone"
                        value={customGoogleEmail}
                        onChange={(e) => setCustomGoogleEmail(e.target.value)}
                        autoFocus
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          borderRadius: 8,
                          border: '1px solid #5F6368',
                          backgroundColor: '#000000',
                          color: '#FFFFFF',
                          fontSize: '0.95rem',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#8AB4F8'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#5F6368'}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24 }}>
                      <button
                        type="button"
                        onClick={() => setShowCustomGoogleInput(false)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#8AB4F8',
                          fontSize: '0.88rem',
                          fontWeight: 500,
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        Back
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (customGoogleEmail.trim()) {
                            executeGoogleLogin(customGoogleEmail.trim(), customGoogleEmail.split('@')[0]);
                          }
                        }}
                        disabled={isSubmitting || !customGoogleEmail.includes('@')}
                        style={{
                          padding: '10px 24px',
                          borderRadius: 9999,
                          backgroundColor: '#8AB4F8',
                          color: '#000000',
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          border: 'none',
                          cursor: (isSubmitting || !customGoogleEmail.includes('@')) ? 'not-allowed' : 'pointer',
                          opacity: (isSubmitting || !customGoogleEmail.includes('@')) ? 0.6 : 1
                        }}
                      >
                        {isSubmitting ? 'Signing in...' : 'Next'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
