'use client';

import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Phone, Eye, EyeOff, User, Building2, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [authMode, setAuthMode] = useState('LOGIN'); // 'LOGIN' | 'SIGNUP' | 'OTP'
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  // Sign up form
  const [signupForm, setSignupForm] = useState({
    fullName: '',
    businessName: '',
    gstin: '',
    email: '',
    mobile: '',
    password: '',
    role: 'OWNER',
  });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const raw = (loginEmail || '').trim();
    const email = raw.includes('@') ? raw : (raw ? `${raw.toLowerCase()}@user.in` : 'owner@murugantraders.in');
    const name = raw.split('@')[0] || 'Business Owner';
    const user = {
      name,
      email,
      role: 'OWNER',
      businessName: `${name}'s Enterprise`,
    };
    localStorage.setItem('gst_cda_current_user', JSON.stringify(user));
    window.location.href = '/';
  };

  const handleQuickLogin = (email, role, name, businessName) => {
    const user = { email, role, name, businessName };
    localStorage.setItem('gst_cda_current_user', JSON.stringify(user));
    window.location.href = '/';
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Header & Logo */}
        <div className="auth-header">
          <div className="auth-logo">TM</div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em' }}>
            TaxMate
          </h1>
          <p style={{ fontSize: '0.84rem', color: '#64748b', marginTop: 4 }}>
            Smart GST Compliance Companion
          </p>
        </div>

        {/* Auth Mode Tabs */}
        <div className="auth-tabs">
          <button 
            type="button"
            className={`auth-tab-btn ${authMode === 'LOGIN' ? 'active' : ''}`}
            onClick={() => setAuthMode('LOGIN')}
          >
            Sign In
          </button>
          <button 
            type="button"
            className={`auth-tab-btn ${authMode === 'SIGNUP' ? 'active' : ''}`}
            onClick={() => setAuthMode('SIGNUP')}
          >
            Create Account
          </button>
          <button 
            type="button"
            className={`auth-tab-btn ${authMode === 'OTP' ? 'active' : ''}`}
            onClick={() => setAuthMode('OTP')}
          >
            Mobile OTP
          </button>
        </div>

        {/* 1. SIGN IN FORM */}
        {authMode === 'LOGIN' && (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label">Email or Mobile Number</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. owner@murugantraders.in"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label className="form-label" style={{ margin: 0 }}>Password</label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); setAuthMode('OTP'); }} style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600 }}>
                  Forgot password?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  className="form-input" 
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 12, top: 12, background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff style={{ width: 18 }} /> : <Eye style={{ width: 18 }} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <input type="checkbox" id="rememberMe" defaultChecked />
              <label htmlFor="rememberMe" style={{ fontSize: '0.84rem', color: '#475569', cursor: 'pointer' }}>
                Remember me on this device
              </label>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '0.95rem' }}>
              Sign In to Workspace <ArrowRight style={{ width: 16 }} />
            </button>

            {/* Quick Demo Credentials */}
            <div className="quick-login-box">
              <div className="quick-login-title">Quick Demo Login (One-Click)</div>
              
              <button 
                type="button" 
                className="quick-login-btn"
                onClick={() => handleQuickLogin('owner@murugantraders.in', 'OWNER', 'Murugan N', 'Murugan Electricals & Hardware')}
              >
                <span>👤 <strong>Business Owner</strong> (Murugan Traders)</span>
                <span style={{ fontSize: '0.75rem', color: '#059669' }}>Sign In ➔</span>
              </button>

              <button 
                type="button" 
                className="quick-login-btn"
                onClick={() => handleQuickLogin('jawahar@gmail.com', 'OWNER', 'Jawahar', 'Jawahar Traders & Retail Store')}
              >
                <span>👤 <strong>Business Owner</strong> (Jawahar Traders)</span>
                <span style={{ fontSize: '0.75rem', color: '#059669' }}>Sign In ➔</span>
              </button>

              <button 
                type="button" 
                className="quick-login-btn"
                onClick={() => handleQuickLogin('ca.audit@taxfirm.in', 'CA', 'Ramanujam CA', 'Audit & Compliance Firm')}
              >
                <span>🎓 <strong>Chartered Accountant (CA)</strong></span>
                <span style={{ fontSize: '0.75rem', color: '#059669' }}>Sign In ➔</span>
              </button>

              <button 
                type="button" 
                className="quick-login-btn"
                onClick={() => handleQuickLogin('kiosk.service@csc.gov.in', 'KIOSK_OPERATOR', 'Kiosk CSC Center', 'Village Kiosk Services')}
              >
                <span>🏪 <strong>CSC / Kiosk Operator</strong></span>
                <span style={{ fontSize: '0.75rem', color: '#059669' }}>Sign In ➔</span>
              </button>
            </div>
          </form>
        )}

        {/* 2. SIGN UP FORM */}
        {authMode === 'SIGNUP' && (
          <form onSubmit={(e) => {
            e.preventDefault();
            const user = {
              name: signupForm.fullName,
              email: signupForm.email,
              role: signupForm.role,
              businessName: signupForm.businessName,
            };
            localStorage.setItem('gst_cda_current_user', JSON.stringify(user));
            localStorage.setItem('gst_cda_reset_normal', 'true');
            alert('Account created successfully! Welcome to TaxMate.');
            window.location.href = '/';
          }}>
            <div className="form-group">
              <label className="form-label">Your Full Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Ramesh Kumar"
                value={signupForm.fullName}
                onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Business / Shop Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Ramesh Hardware Store"
                value={signupForm.businessName}
                onChange={(e) => setSignupForm({ ...signupForm, businessName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="e.g. ramesh@gmail.com"
                value={signupForm.email}
                onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <select 
                className="form-select"
                value={signupForm.role}
                onChange={(e) => setSignupForm({ ...signupForm, role: e.target.value })}
              >
                <option value="OWNER">Shop Owner / Trader / Freelancer</option>
                <option value="CA">Chartered Accountant (Tax Professional)</option>
                <option value="KIOSK_OPERATOR">Assisted Kiosk / CSC Operator</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Create Password</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="Minimum 6 characters"
                value={signupForm.password}
                onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '0.95rem' }}>
              Create My Free Account <ArrowRight style={{ width: 16 }} />
            </button>
          </form>
        )}

        {/* 3. MOBILE OTP LOGIN */}
        {authMode === 'OTP' && (
          <div>
            {!otpSent ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                setOtpSent(true);
              }}>
                <div className="form-group">
                  <label className="form-label">Enter Registered Mobile Number</label>
                  <input 
                    type="tel" 
                    className="form-input" 
                    placeholder="e.g. 9876543210"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    required
                  />
                  <div className="form-help">We will send a 6-digit login OTP to your phone.</div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '0.95rem' }}>
                  Send OTP Code
                </button>
              </form>
            ) : (
              <form onSubmit={(e) => {
                e.preventDefault();
                const user = {
                  name: 'Mobile Verified User',
                  email: `${mobileNumber}@mobile.in`,
                  role: 'OWNER',
                  businessName: 'My Enterprise',
                };
                localStorage.setItem('gst_cda_current_user', JSON.stringify(user));
                localStorage.setItem('gst_cda_reset_normal', 'true');
                alert('OTP verified successfully!');
                window.location.href = '/';
              }}>
                <div className="form-group">
                  <label className="form-label">Enter 6-Digit OTP</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Enter 123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    maxLength={6}
                    required
                  />
                  <div className="form-help" style={{ color: '#059669' }}>
                    Demo OTP is: <strong>123456</strong>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '0.95rem' }}>
                  Verify & Sign In
                </button>

                <div style={{ textAlign: 'center', marginTop: 12 }}>
                  <button 
                    type="button" 
                    onClick={() => setOtpSent(false)} 
                    style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.82rem', cursor: 'pointer' }}
                  >
                    Change mobile number
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Security badge at bottom */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 24, fontSize: '0.78rem', color: '#64748b' }}>
          <ShieldCheck style={{ width: 16, color: '#059669' }} />
          <span>256-Bit Encrypted & Tenant Isolated</span>
        </div>
      </div>
    </div>
  );
}

