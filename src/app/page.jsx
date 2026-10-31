'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Receipt, 
  ShoppingCart, 
  FileText, 
  UserPlus, 
  Calendar as CalendarIcon, 
  FolderLock, 
  Bot, 
  Users, 
  Settings as SettingsIcon,
  Search,
  Bell,
  Sparkles,
  CheckCircle2,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Zap,
  RotateCcw
} from 'lucide-react';

import WelcomeLanding from '../components/WelcomeLanding.jsx';
import ConversationalOnboarding from '../components/ConversationalOnboarding.jsx';
import CommandPalette from '../components/CommandPalette.jsx';
import HomeHeroDashboard from '../components/HomeHeroDashboard.jsx';
import SalesManager from '../components/SalesManager.jsx';
import PurchasesReconciliation from '../components/PurchasesReconciliation.jsx';
import ReportsHub from '../components/ReportsHub.jsx';
import CopilotConcierge from '../components/CopilotConcierge.jsx';
import BusinessRegistration from '../components/BusinessRegistration.jsx';
import CalendarVaultSupport from '../components/CalendarVaultSupport.jsx';
import { DEMO_BUSINESS } from '../lib/showcaseData.js';

export default function GSTCDAShowcaseApp() {
  // Main view state: 'app' (default hero showcase) | 'landing' | 'onboarding'
  const [viewMode, setViewMode] = useState('app');
  
  // Navigation tabs in main app
  const [activeNav, setActiveNav] = useState('home');
  const [purchasesSubTab, setPurchasesSubTab] = useState('reconciliation');
  const [calendarSubSection, setCalendarSubSection] = useState('calendar');

  // Command Palette State
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // In-App Toast State
  const [toastMessage, setToastMessage] = useState(null);

  // Mobile drawer toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Notifications popover toggle
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleNavigate = (tab, subTab, action) => {
    setActiveNav(tab);
    if (subTab) {
      if (tab === 'purchases') setPurchasesSubTab(subTab);
      if (tab === 'calendar' || tab === 'vault' || tab === 'ca-support') setCalendarSubSection(subTab);
    }
    if (tab === 'copilot' && action) {
      // triggered Copilot with specific query
    }
  };

  const handleAskCopilotFromCommand = (query) => {
    setActiveNav('copilot');
  };

  // If user is on landing screen
  if (viewMode === 'landing') {
    return (
      <WelcomeLanding 
        onGetStarted={() => setViewMode('onboarding')}
        onExploreDemo={() => {
          setViewMode('app');
          setActiveNav('home');
        }}
      />
    );
  }

  // If user is in conversational onboarding wizard
  if (viewMode === 'onboarding') {
    return (
      <ConversationalOnboarding 
        onComplete={(state) => {
          setViewMode('app');
          setActiveNav('home');
          showToast('🎉 Welcome to Anaya Home & Living! Your September 2026 space is ready.');
        }}
        onCancel={() => {
          setViewMode('app');
          setActiveNav('home');
        }}
      />
    );
  }

  // MAIN APPLICATION SHELL
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FAF8F5', color: '#0B132B' }}>
      
      {/* ======================================================== */}
      {/* DESKTOP SIDEBAR                                          */}
      {/* ======================================================== */}
      <aside style={{ 
        width: 256, 
        backgroundColor: '#FFFFFF', 
        borderRight: '1px solid #EAE5DC', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 40
      }} className="hide-on-mobile">
        
        {/* Brand Monogram & Name */}
        <div style={{ padding: '24px 20px 18px', borderBottom: '1px solid #FAF8F5' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ 
              width: 34, 
              height: 34, 
              borderRadius: 10, 
              backgroundColor: '#0D6258', 
              color: '#FFFFFF', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontWeight: 800, 
              fontSize: '0.88rem',
              boxShadow: '0 4px 12px rgba(13, 98, 88, 0.25)'
            }}>
              CDA
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.98rem', letterSpacing: '-0.02em', color: '#0B132B' }}>
                GST CDA
              </div>
              <div style={{ fontSize: '0.68rem', color: '#8D99AE' }}>
                Compliance Assistant
              </div>
            </div>
          </div>

          {/* Business Switcher Card */}
          <div style={{ 
            marginTop: 14, 
            padding: '8px 12px', 
            backgroundColor: '#FAF8F5', 
            borderRadius: 12, 
            border: '1px solid #EAE5DC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0B132B', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {DEMO_BUSINESS.tradeName}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#596579' }}>
                Kochi, Kerala (32)
              </div>
            </div>
            <span style={{ fontSize: '0.66rem', color: '#0D6258', fontWeight: 800, backgroundColor: '#EEF8F6', padding: '2px 6px', borderRadius: 4 }}>
              Active
            </span>
          </div>
        </div>

        {/* Navigation Items List */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
          
          <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8D99AE', fontWeight: 800, padding: '6px 12px' }}>
            Compliance Workspace
          </div>

          {[
            { id: 'home', label: 'Home Dashboard', icon: LayoutDashboard },
            { id: 'business', label: 'My Business', icon: Building2 },
            { id: 'sales', label: 'My Sales', icon: Receipt, pill: '124' },
            { id: 'purchases', label: 'My Purchases', icon: ShoppingCart, pill: '3 diffs', pillColor: '#B45309' },
            { id: 'reports', label: 'GST Reports', icon: FileText, pill: 'Ready' },
          ].map(item => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveNav(item.id);
                  if (item.id === 'purchases') setPurchasesSubTab('reconciliation');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: 10,
                  border: isActive ? '1px solid #B2DDD7' : '1px solid transparent',
                  backgroundColor: isActive ? '#EEF8F6' : 'transparent',
                  color: isActive ? '#0D6258' : '#596579',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.12s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon style={{ width: 17, height: 17, color: isActive ? '#0D6258' : '#8D99AE' }} />
                  <span>{item.label}</span>
                </div>
                {item.pill && (
                  <span style={{ 
                    fontSize: '0.68rem', 
                    fontWeight: 800, 
                    color: item.pillColor || '#0D6258', 
                    backgroundColor: item.pillColor ? '#FEF7EC' : '#EEF8F6', 
                    padding: '2px 7px', 
                    borderRadius: 9999 
                  }}>
                    {item.pill}
                  </span>
                )}
              </button>
            );
          })}

          <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8D99AE', fontWeight: 800, padding: '16px 12px 6px' }}>
            Concierge & Tools
          </div>

          {[
            { id: 'copilot', label: 'GST Assistant (Copilot)', icon: Bot, highlight: true },
            { id: 'registration', label: 'GST Registration', icon: UserPlus },
            { id: 'calendar', label: 'Filing Calendar', icon: CalendarIcon },
            { id: 'vault', label: 'Document Vault', icon: FolderLock },
            { id: 'ca-support', label: 'CA Support & Team', icon: Users },
          ].map(item => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveNav(item.id);
                  if (item.id === 'vault') setCalendarSubSection('vault');
                  if (item.id === 'ca-support') setCalendarSubSection('ca-support');
                  if (item.id === 'calendar') setCalendarSubSection('calendar');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: 10,
                  border: isActive ? '1px solid #B2DDD7' : '1px solid transparent',
                  backgroundColor: isActive ? '#EEF8F6' : item.highlight ? '#FCFAF7' : 'transparent',
                  color: isActive ? '#0D6258' : '#596579',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.12s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon style={{ width: 17, height: 17, color: isActive ? '#0D6258' : item.highlight ? '#C87D0E' : '#8D99AE' }} />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}

        </nav>

        {/* Bottom Profile Area */}
        <div style={{ padding: 14, borderTop: '1px solid #EAE5DC', backgroundColor: '#FAF8F5' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ 
              width: 32, 
              height: 32, 
              borderRadius: '50%', 
              backgroundColor: '#0B132B', 
              color: '#FFFFFF', 
              fontWeight: 800, 
              fontSize: '0.78rem',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              AN
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0B132B', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                Anaya Nair
              </div>
              <div style={{ fontSize: '0.68rem', color: '#8D99AE' }}>
                Designated Partner
              </div>
            </div>
          </div>
        </div>

      </aside>

      {/* ======================================================== */}
      {/* MAIN CONTENT AREA                                        */}
      {/* ======================================================== */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* TOP BAR */}
        <header style={{ 
          height: 68, 
          backgroundColor: '#FFFFFF', 
          borderBottom: '1px solid #EAE5DC', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '0 32px',
          position: 'sticky',
          top: 0,
          zIndex: 30
        }}>
          {/* Left: Breadcrumbs & Global Command Trigger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: '0.84rem', color: '#596579', fontWeight: 600 }}>
              <span style={{ color: '#8D99AE' }}>Anaya Home & Living</span>
              <span style={{ margin: '0 6px', color: '#DCD5C9' }}>/</span>
              <span style={{ color: '#0B132B', fontWeight: 700 }}>
                {activeNav === 'home' ? 'Overview' : activeNav === 'sales' ? 'My Sales' : activeNav === 'purchases' ? 'Purchases & Reconciliation' : activeNav === 'reports' ? 'GST Reports' : activeNav === 'copilot' ? 'GST Assistant' : activeNav}
              </span>
            </div>

            {/* Global Command Search Box */}
            <div 
              onClick={() => setIsCommandPaletteOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px',
                backgroundColor: '#FAF8F5',
                border: '1px solid #EAE5DC',
                borderRadius: 9999,
                cursor: 'pointer',
                color: '#8D99AE',
                fontSize: '0.78rem',
                minWidth: 220,
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#0D6258'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#EAE5DC'}
            >
              <Search style={{ width: 14, height: 14, color: '#0D6258' }} />
              <span style={{ flex: 1 }}>Ask GST CDA...</span>
              <kbd style={{ 
                fontSize: '0.68rem', 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #DCD5C9', 
                padding: '1px 5px', 
                borderRadius: 4, 
                fontWeight: 700, 
                color: '#596579' 
              }}>
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Right: Showcase View Switcher & Demo Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            
            {/* Quick Switcher for Showcase Presentation */}
            <div style={{ display: 'flex', backgroundColor: '#FAF8F5', padding: 3, borderRadius: 10, border: '1px solid #EAE5DC' }}>
              <button
                type="button"
                onClick={() => setViewMode('landing')}
                style={{ padding: '4px 10px', fontSize: '0.72rem', fontWeight: 600, color: '#596579', background: 'none', border: 'none', borderRadius: 6, cursor: 'pointer' }}
              >
                Welcome Screen
              </button>
              <button
                type="button"
                onClick={() => setViewMode('onboarding')}
                style={{ padding: '4px 10px', fontSize: '0.72rem', fontWeight: 600, color: '#596579', background: 'none', border: 'none', borderRadius: 6, cursor: 'pointer' }}
              >
                Onboarding Flow
              </button>
              <button
                type="button"
                onClick={() => setViewMode('app')}
                style={{ padding: '4px 10px', fontSize: '0.72rem', fontWeight: 800, color: '#0D6258', backgroundColor: '#EEF8F6', border: '1px solid #B2DDD7', borderRadius: 6, cursor: 'pointer' }}
              >
                App Showcase
              </button>
            </div>

            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                style={{ 
                  width: 34, 
                  height: 34, 
                  borderRadius: 10, 
                  backgroundColor: '#FAF8F5', 
                  border: '1px solid #EAE5DC', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  cursor: 'pointer',
                  color: '#596579',
                  position: 'relative'
                }}
              >
                <Bell style={{ width: 16, height: 16 }} />
                <span style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: '50%', backgroundColor: '#B45309' }} />
              </button>

              {/* Notification Popover */}
              {isNotificationsOpen && (
                <div style={{
                  position: 'absolute',
                  top: 42,
                  right: 0,
                  width: 320,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 16,
                  border: '1px solid #EAE5DC',
                  boxShadow: '0 10px 30px rgba(11, 19, 43, 0.12)',
                  padding: 16,
                  zIndex: 50
                }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0B132B', marginBottom: 10 }}>
                    Compliance Checkpoints
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ padding: 10, backgroundColor: '#FEF7EC', borderRadius: 10, border: '1px solid #F7E1B8' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#B45309' }}>Review 3 purchase differences</div>
                      <div style={{ fontSize: '0.7rem', color: '#596579', marginTop: 2 }}>Ready before September GSTR-3B settlement.</div>
                    </div>
                    <div style={{ padding: 10, backgroundColor: '#FAF8F5', borderRadius: 10, border: '1px solid #EAE5DC' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0B132B' }}>124 Sales Invoices Compiled</div>
                      <div style={{ fontSize: '0.7rem', color: '#596579', marginTop: 2 }}>All September sales verified with zero math drift.</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Active Period Badge */}
            <span style={{ 
              fontSize: '0.74rem', 
              fontWeight: 800, 
              color: '#0D6258', 
              backgroundColor: '#EEF8F6', 
              padding: '4px 10px', 
              borderRadius: 9999,
              border: '1px solid #B2DDD7'
            }}>
              September 2026
            </span>

          </div>
        </header>

        {/* MAIN BODY CANVAS */}
        <main style={{ flex: 1, padding: '36px 36px 48px', overflowY: 'auto' }}>
          
          {activeNav === 'home' && (
            <HomeHeroDashboard 
              onNavigate={handleNavigate}
              onAskCopilot={(q) => {
                setActiveNav('copilot');
              }}
              onRequestCaSupport={() => {
                setActiveNav('ca-support');
                setCalendarSubSection('ca-support');
              }}
            />
          )}

          {activeNav === 'sales' && (
            <SalesManager onShowToast={showToast} />
          )}

          {activeNav === 'purchases' && (
            <PurchasesReconciliation 
              initialSubTab={purchasesSubTab}
              onShowToast={showToast}
              onAskCopilot={(q) => setActiveNav('copilot')}
              onRequestCaSupport={() => {
                setActiveNav('ca-support');
                setCalendarSubSection('ca-support');
              }}
            />
          )}

          {activeNav === 'reports' && (
            <ReportsHub 
              onShowToast={showToast}
              onAskCopilot={(q) => setActiveNav('copilot')}
            />
          )}

          {activeNav === 'copilot' && (
            <CopilotConcierge 
              onNavigate={handleNavigate}
            />
          )}

          {activeNav === 'business' && (
            <BusinessRegistration onShowToast={showToast} />
          )}

          {activeNav === 'registration' && (
            <BusinessRegistration onShowToast={showToast} />
          )}

          {(activeNav === 'calendar' || activeNav === 'vault' || activeNav === 'ca-support') && (
            <CalendarVaultSupport 
              activeSection={calendarSubSection} 
              onShowToast={showToast}
            />
          )}

          {activeNav === 'settings' && (
            <div style={{ maxWidth: 680, margin: '0 auto', backgroundColor: '#FFFFFF', borderRadius: 20, border: '1px solid #EAE5DC', padding: 32 }}>
              <h2 className="font-editorial" style={{ fontSize: '1.8rem', fontWeight: 500, color: '#0B132B', margin: '0 0 12px 0' }}>
                Workspace Settings
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#596579', lineHeight: 1.6 }}>
                Configure multi-user access, regional Kerala GST rules, and audit logs. All demonstration state is stored locally in your browser session.
              </p>
              <div style={{ marginTop: 24, padding: 16, backgroundColor: '#FAF8F5', borderRadius: 12, border: '1px solid #EAE5DC', fontSize: '0.8rem', color: '#596579' }}>
                Connected to local SQLite persistence layer • Multi-tenant isolation verified.
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ======================================================== */}
      {/* GLOBAL COMMAND PALETTE (CMD + K)                         */}
      {/* ======================================================== */}
      <CommandPalette 
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={handleNavigate}
        onAskCopilot={handleAskCopilotFromCommand}
      />

      {/* ======================================================== */}
      {/* MOBILE BOTTOM NAVIGATION                                 */}
      {/* ======================================================== */}
      <div className="mobile-bottom-nav">
        {[
          { id: 'home', label: 'Home', icon: LayoutDashboard },
          { id: 'sales', label: 'Sales', icon: Receipt },
          { id: 'purchases', label: 'Purchases', icon: ShoppingCart },
          { id: 'copilot', label: 'Assistant', icon: Bot },
          { id: 'reports', label: 'Reports', icon: FileText },
        ].map(m => {
          const Icon = m.icon;
          const isActive = activeNav === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setActiveNav(m.id)}
              style={{
                background: 'none',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                color: isActive ? '#0D6258' : '#8D99AE',
                cursor: 'pointer'
              }}
            >
              <Icon style={{ width: 20, height: 20 }} />
              <span style={{ fontSize: '0.68rem', fontWeight: isActive ? 800 : 500 }}>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* LUXURY IN-APP TOAST NOTIFICATION                         */}
      {/* ======================================================== */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          zIndex: 99999,
          backgroundColor: '#0B132B',
          color: '#FFFFFF',
          padding: '12px 22px',
          borderRadius: 14,
          boxShadow: '0 16px 36px -4px rgba(11, 19, 43, 0.4)',
          border: '1px solid rgba(13, 98, 88, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: '0.86rem',
          fontWeight: 600,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <CheckCircle2 style={{ width: 17, height: 17, color: '#34D399', flexShrink: 0 }} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
