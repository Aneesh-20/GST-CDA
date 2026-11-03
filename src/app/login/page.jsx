'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Phone, 
  Eye, 
  EyeOff, 
  User, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  ArrowLeft,
  Smartphone,
  Sparkles
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
    <div className="auth-wrapper" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
      <div className="auth-card" style={{ maxWidth: 480, width: '100%', borderRadius: 24, boxShadow: '0 25px 70px -15px rgba(0, 0, 0, 0.4)', padding: '36px 32px' }}>
        
        {/* Top Back Navigation to Website */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <Link 
            href="/" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: 6, 
              fontSize: '0.82rem', 
              fontWeight: 700, 
              color: '#0D6258', 
              textDecoration: 'none',
              padding: '4px 10px',
              borderRadius: 8,
              backgroundColor: '#EEF8F6'
            }}
          >
            <ArrowLeft style={{ width: 14, height: 14 }} />
            <span>Back to Website</span>
          </Link>

          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#059669', backgroundColor: '#ECFDF5', padding: '3px 8px', borderRadius: 9999 }}>
            SSL SECURE
          </span>
        </div>

        {/* Brand Header */}
        <div className="auth-header" style={{ textAlign: 'center', marginBottom: 28 }}>
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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0B132B', letterSpacing: '-0.02em', margin: '0 0 6px 0' }}>
            {authMode === 'REGISTER' ? 'Create Your TaxMate Account' : 'Sign in to TaxMate'}
          </h1>
          <p style={{ fontSize: '0.84rem', color: '#64748B', margin: 0 }}>
            {authMode === 'REGISTER' 
              ? 'Join 6.3 Crore MSMEs for 0-notice-risk GST filing' 
              : 'Sign in to file your monthly return in ~2 minutes'}
          </p>
        </div>

        {/* ======================================================== */}
        {/* MAIN SIGN IN FLOW (GOOGLE, PHONE & PASSWORD)             */}
        {/* ======================================================== */}
        {authMode === 'LOGIN' && (
          <div>
            {/* OPTION 1: CONTINUE WITH GOOGLE */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              style={{
                width: '100%',
                padding: '12px 16px',
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
              {/* Google G Logo */}
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
                padding: '12px 16px',
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

            {/* OPTION 3: ENTER USERNAME AND PASSWORD */}
            <form onSubmit={handlePasswordLoginSubmit}>
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0B132B', marginBottom: 6 }}>
                  Username or Email
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. aneesh@business.in or trader_99"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #DCD5C9', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 6 }}>
                <label className="form-label" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0B132B', marginBottom: 6 }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ width: '100%', padding: '11px 40px 11px 14px', borderRadius: 10, border: '1px solid #DCD5C9', fontSize: '0.9rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: 12, top: 12, background: 'none', border: 'none', color: '#8D99AE', cursor: 'pointer' }}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff style={{ width: 17, height: 17 }} /> : <Eye style={{ width: 17, height: 17 }} />}
                  </button>
                </div>
              </div>

              {/* DOWN THE PASSWORD BOX: REGISTER? IN BLUE COLOUR */}
              <div style={{ marginTop: 8, marginBottom: 20, fontSize: '0.84rem', color: '#596579', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                  style={{ fontSize: '0.78rem', color: '#64748B', textDecoration: 'none' }}
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
                  padding: '13px 18px',
                  fontSize: '0.95rem',
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
                  <div className="form-group" style={{ marginBottom: 18 }}>
                    <label className="form-label" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0B132B', marginBottom: 6 }}>
                      Mobile Phone Number
                    </label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <div style={{ padding: '11px 12px', backgroundColor: '#F1F5F9', borderRadius: 10, border: '1px solid #DCD5C9', fontSize: '0.9rem', fontWeight: 700, color: '#0B132B' }}>
                        +91
                      </div>
                      <input
                        type="tel"
                        className="form-input"
                        placeholder="e.g. 9876543210"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        maxLength={10}
                        required
                        style={{ flex: 1, padding: '11px 14px', borderRadius: 10, border: '1px solid #DCD5C9', fontSize: '0.9rem' }}
                      />
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: 6 }}>
                      We will send a 6-digit verification code to your phone.
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-glowing-primary"
                    style={{ width: '100%', padding: '13px 18px', fontSize: '0.95rem', borderRadius: 12 }}
                  >
                    <span>Send Verification Code</span>
                    <ArrowRight style={{ width: 16, height: 16 }} />
                  </button>
                </div>
              ) : (
                <div>
                  <div className="form-group" style={{ marginBottom: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <label className="form-label" style={{ margin: 0, fontSize: '0.82rem', fontWeight: 700, color: '#0B132B' }}>
                        Enter 6-Digit OTP
                      </label>
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Change Number
                      </button>
                    </div>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter 123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      maxLength={6}
                      required
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #0D6258', fontSize: '1.2rem', textAlign: 'center', letterSpacing: '0.3em', fontWeight: 800 }}
                    />
                    <div style={{ fontSize: '0.74rem', color: '#059669', marginTop: 6, fontWeight: 700 }}>
                      ✓ Demo verification code: <strong>123456</strong>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-glowing-primary"
                    style={{ width: '100%', padding: '13px 18px', fontSize: '0.95rem', borderRadius: 12 }}
                  >
                    <span>Verify & File Now</span>
                    <ArrowRight style={{ width: 16, height: 16 }} />
                  </button>
                </div>
              )}
            </form>

            {/* Back to password or register */}
            <div style={{ textAlign: 'center', marginTop: 18, fontSize: '0.82rem', color: '#64748B' }}>
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
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0B132B', marginBottom: 5 }}>
                Your Full Name
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Aneesh Naren"
                value={registerForm.fullName}
                onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #DCD5C9', fontSize: '0.88rem' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0B132B', marginBottom: 5 }}>
                Business / Enterprise Name
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Apex Hardware & Spices"
                value={registerForm.businessName}
                onChange={(e) => setRegisterForm({ ...registerForm, businessName: e.target.value })}
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #DCD5C9', fontSize: '0.88rem' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0B132B', marginBottom: 5 }}>
                Username or Email Address
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. aneesh@business.in"
                value={registerForm.usernameOrEmail}
                onChange={(e) => setRegisterForm({ ...registerForm, usernameOrEmail: e.target.value })}
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #DCD5C9', fontSize: '0.88rem' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 6 }}>
              <label className="form-label" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0B132B', marginBottom: 5 }}>
                Create Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Minimum 6 characters"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 40px 10px 14px', borderRadius: 10, border: '1px solid #DCD5C9', fontSize: '0.88rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 12, top: 11, background: 'none', border: 'none', color: '#8D99AE', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff style={{ width: 17, height: 17 }} /> : <Eye style={{ width: 17, height: 17 }} />}
                </button>
              </div>
            </div>

            {/* DOWN PASSWORD BOX: ALREADY HAVE AN ACCOUNT? SIGN IN */}
            <div style={{ marginTop: 8, marginBottom: 18, fontSize: '0.84rem', color: '#596579' }}>
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
              style={{ width: '100%', padding: '13px 18px', fontSize: '0.95rem', borderRadius: 12 }}
            >
              <span>Create Account & File Now</span>
              <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
          </form>
        )}

        {/* ======================================================== */}
        {/* ONE-CLICK DEMO ACCOUNTS (CONVENIENT FOR TESTING)         */}
        {/* ======================================================== */}
        <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid #EAE5DC' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#8D99AE', textAlign: 'center', marginBottom: 10, letterSpacing: '0.06em' }}>
            Instant One-Click Demo Access
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('owner@murugantraders.in', 'OWNER', 'Murugan N', 'Murugan Electricals & Hardware')}
              style={{ padding: '8px 10px', backgroundColor: '#FAF8F5', border: '1px solid #EAE5DC', borderRadius: 8, fontSize: '0.74rem', fontWeight: 700, color: '#0B132B', cursor: 'pointer', textAlign: 'left' }}
            >
              👤 Shop Owner (Murugan)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('ca.audit@taxfirm.in', 'CA', 'Ramanujam CA', 'Audit & Compliance Firm')}
              style={{ padding: '8px 10px', backgroundColor: '#FAF8F5', border: '1px solid #EAE5DC', borderRadius: 8, fontSize: '0.74rem', fontWeight: 700, color: '#0B132B', cursor: 'pointer', textAlign: 'left' }}
            >
              🎓 Chartered Accountant
            </button>
          </div>
        </div>

        {/* Security Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 20, fontSize: '0.74rem', color: '#64748B' }}>
          <ShieldCheck style={{ width: 15, height: 15, color: '#059669' }} />
          <span>256-Bit Encrypted Statutory GSP Session</span>
        </div>

      </div>
    </div>
  );
}
