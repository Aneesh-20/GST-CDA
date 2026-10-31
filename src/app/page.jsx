'use client';

import React, { useState } from 'react';
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
  RotateCcw,
  Rocket,
  Gift,
  Store,
  CreditCard,
  PhoneCall,
  Smartphone,
  Laptop,
  MessageSquare
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
import { DEMO_BUSINESS, COMPLIANCE_SCORE, EXPERIENCE_CHANNELS } from '../lib/showcaseData.js';

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

  // Notifications popover toggle
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Channel switcher state
  const [selectedChannel, setSelectedChannel] = useState('web');
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

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
      if (tab === 'calendar' || tab === 'vault' || tab === 'ca-support' || tab === 'referral' || tab === 'kiosk' || tab === 'pricing') {
        setCalendarSubSection(subTab);
      }
    }
    if (tab === 'referral') {
      setActiveNav('referral');
      setCalendarSubSection('referral');
    }
    if (tab === 'kiosk') {
      setActiveNav('kiosk');
      setCalendarSubSection('kiosk');
    }
  };

  const handleChannelSelect = (channelId) => {
    setSelectedChannel(channelId);
    if (channelId === 'kiosk') {
      setActiveNav('kiosk');
      setCalendarSubSection('kiosk');
      showToast('🏢 Switched to Assisted Kiosk mode.');
    } else if (channelId === 'ca_desk') {
      setActiveNav('ca-support');
      setCalendarSubSection('ca-support');
      showToast('👨‍💼 Switched to CA / Professional Dashboard.');
    } else if (channelId === 'voice_wa') {
      setIsWhatsAppModalOpen(true);
    } else if (channelId === 'mobile') {
      showToast('📱 Switched to Mobile companion view.');
    } else {
      showToast('💻 Switched to Web Portal view.');
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
      {/* DESKTOP SIDEBAR (ALIGNED WITH PDF MAJOR MODULES)        */}
      {/* ======================================================== */}
      <aside style={{ 
        width: 268, 
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
              <div style={{ fontSize: '0.66rem', color: '#596579' }}>
                GST Compliance Digital Assistant
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
              Score: 92
            </span>
          </div>
        </div>

        {/* Navigation Items List (PDF Major Modules 1-18) */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
          
          <div style={{ fontSize: '0.66rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8D99AE', fontWeight: 800, padding: '4px 12px' }}>
            Core Modules
          </div>

          {[
            { id: 'home', label: 'Compliance Dashboard', icon: LayoutDashboard, pill: `${COMPLIANCE_SCORE.score}/100`, pillColor: '#0E7051' },
            { id: 'copilot', label: 'GST Copilot', icon: Bot, pill: '5-Step', highlight: true },
            { id: 'startup-express', label: 'Startup Express', icon: Rocket, pill: 'PAN & MCA' },
            { id: 'sales', label: 'Invoice Data (Sales)', icon: Receipt, pill: '124' },
            { id: 'purchases', label: 'GSTR-2B / Reconciliation', icon: ShoppingCart, pill: '3 diffs', pillColor: '#B45309' },
            { id: 'reports', label: 'GSTR-1 & GSTR-3B', icon: FileText, pill: 'Ready' },
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
                  padding: '8px 12px',
                  borderRadius: 10,
                  border: isActive ? '1px solid #B2DDD7' : '1px solid transparent',
                  backgroundColor: isActive ? '#EEF8F6' : item.highlight ? '#FCFAF7' : 'transparent',
                  color: isActive ? '#0D6258' : '#596579',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.12s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon style={{ width: 16, height: 16, color: isActive ? '#0D6258' : item.highlight ? '#C87D0E' : '#8D99AE' }} />
                  <span>{item.label}</span>
                </div>
                {item.pill && (
                  <span style={{ 
                    fontSize: '0.66rem', 
                    fontWeight: 800, 
                    color: item.pillColor || '#0D6258', 
                    backgroundColor: item.pillColor ? '#FEF7EC' : '#EEF8F6', 
                    padding: '2px 6px', 
                    borderRadius: 9999 
                  }}>
                    {item.pill}
                  </span>
                )}
              </button>
            );
          })}

          <div style={{ fontSize: '0.66rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8D99AE', fontWeight: 800, padding: '14px 12px 4px' }}>
            Compliance & Growth Modules
          </div>

          {[
            { id: 'calendar', label: 'Due-Date Engine', icon: CalendarIcon },
            { id: 'vault', label: 'Document Vault', icon: FolderLock },
            { id: 'ca-support', label: 'CA / Agent Connect', icon: Users },
            { id: 'referral', label: 'Referral Engine', icon: Gift, pill: '₹500 Credit', pillColor: '#C87D0E' },
            { id: 'kiosk', label: 'Kiosk Mode', icon: Store },
            { id: 'pricing', label: 'Pricing & Roadmap', icon: CreditCard },
          ].map(item => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveNav(item.id);
                  setCalendarSubSection(item.id);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: 10,
                  border: isActive ? '1px solid #B2DDD7' : '1px solid transparent',
                  backgroundColor: isActive ? '#EEF8F6' : 'transparent',
                  color: isActive ? '#0D6258' : '#596579',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.12s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon style={{ width: 16, height: 16, color: isActive ? '#0D6258' : '#8D99AE' }} />
                  <span>{item.label}</span>
                </div>
                {item.pill && (
                  <span style={{ 
                    fontSize: '0.66rem', 
                    fontWeight: 800, 
                    color: item.pillColor || '#0D6258', 
                    backgroundColor: item.pillColor ? '#FEF7EC' : '#EEF8F6', 
                    padding: '2px 6px', 
                    borderRadius: 9999 
                  }}>
                    {item.pill}
                  </span>
                )}
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
        
        {/* TOP BAR WITH EXPERIENCE CHANNELS */}
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
                {activeNav === 'home' ? 'Compliance Dashboard' 
                 : activeNav === 'copilot' ? 'GST Copilot' 
                 : activeNav === 'startup-express' ? 'Startup Express'
                 : activeNav === 'sales' ? 'Invoice Data (Sales)' 
                 : activeNav === 'purchases' ? 'GSTR-2B Reconciliation' 
                 : activeNav === 'reports' ? 'GSTR-1 & GSTR-3B' 
                 : activeNav === 'referral' ? 'Referral Engine'
                 : activeNav === 'kiosk' ? 'Kiosk Mode'
                 : activeNav === 'pricing' ? 'Pricing & MSME OS'
                 : activeNav}
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
                minWidth: 200,
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

          {/* Right: Experience Channels (PDF Page 1) & View Mode */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            
            {/* 5 Channels from PDF Page 1 */}
            <div style={{ display: 'flex', backgroundColor: '#FAF8F5', padding: 3, borderRadius: 10, border: '1px solid #EAE5DC' }}>
              {EXPERIENCE_CHANNELS.map(ch => (
                <button
                  key={ch.id}
                  type="button"
                  title={ch.desc}
                  onClick={() => handleChannelSelect(ch.id)}
                  style={{
                    padding: '4px 8px',
                    fontSize: '0.72rem',
                    fontWeight: selectedChannel === ch.id ? 800 : 500,
                    color: selectedChannel === ch.id ? '#0D6258' : '#596579',
                    backgroundColor: selectedChannel === ch.id ? '#FFFFFF' : 'transparent',
                    border: selectedChannel === ch.id ? '1px solid #B2DDD7' : 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  <span>{ch.icon}</span>
                  <span className="hide-on-tablet">{ch.name}</span>
                </button>
              ))}
            </div>

            {/* Showcase View Switcher */}
            <div style={{ display: 'flex', backgroundColor: '#FAF8F5', padding: 3, borderRadius: 10, border: '1px solid #EAE5DC' }}>
              <button
                type="button"
                onClick={() => setViewMode('landing')}
                style={{ padding: '4px 8px', fontSize: '0.7rem', fontWeight: 600, color: '#596579', background: 'none', border: 'none', borderRadius: 6, cursor: 'pointer' }}
              >
                Welcome
              </button>
              <button
                type="button"
                onClick={() => setViewMode('onboarding')}
                style={{ padding: '4px 8px', fontSize: '0.7rem', fontWeight: 600, color: '#596579', background: 'none', border: 'none', borderRadius: 6, cursor: 'pointer' }}
              >
                Onboarding
              </button>
              <button
                type="button"
                onClick={() => setViewMode('app')}
                style={{ padding: '4px 8px', fontSize: '0.7rem', fontWeight: 800, color: '#0D6258', backgroundColor: '#EEF8F6', border: '1px solid #B2DDD7', borderRadius: 6, cursor: 'pointer' }}
              >
                App
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
                    Compliance Checkpoints (Due-Date Engine)
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ padding: 10, backgroundColor: '#FEF7EC', borderRadius: 10, border: '1px solid #F7E1B8' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#B45309' }}>Review 3 purchase differences</div>
                      <div style={{ fontSize: '0.7rem', color: '#596579', marginTop: 2 }}>Ready before September GSTR-3B settlement (20 Oct).</div>
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

          {activeNav === 'copilot' && (
            <CopilotConcierge 
              onNavigate={handleNavigate}
            />
          )}

          {activeNav === 'startup-express' && (
            <BusinessRegistration onShowToast={showToast} />
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

          {activeNav === 'business' && (
            <BusinessRegistration onShowToast={showToast} />
          )}

          {activeNav === 'registration' && (
            <BusinessRegistration onShowToast={showToast} />
          )}

          {(activeNav === 'calendar' || activeNav === 'vault' || activeNav === 'ca-support' || activeNav === 'referral' || activeNav === 'kiosk' || activeNav === 'pricing') && (
            <CalendarVaultSupport 
              activeSection={calendarSubSection} 
              onShowToast={showToast}
            />
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
      {/* WHATSAPP / VOICE COMPLIANCE SIMULATOR MODAL             */}
      {/* ======================================================== */}
      {isWhatsAppModalOpen && (
        <div className="drawer-overlay" style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <div style={{ width: '100%', maxWidth: 460, backgroundColor: '#FFFFFF', borderRadius: 22, overflow: 'hidden', boxShadow: '0 25px 60px rgba(11, 19, 43, 0.25)', border: '1px solid #EAE5DC' }}>
            {/* WhatsApp Green Header */}
            <div style={{ backgroundColor: '#075E54', color: '#FFFFFF', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', backgroundColor: '#25D366', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                  <MessageSquare style={{ width: 20, height: 20 }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.94rem', fontWeight: 800 }}>GST CDA Concierge</div>
                  <div style={{ fontSize: '0.72rem', color: '#DCF8C6' }}>Official Business Account • Online</div>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsWhatsAppModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
              >
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            {/* Chat Body */}
            <div style={{ backgroundColor: '#ECE5DD', padding: 20, display: 'flex', flexDirection: 'column', gap: 14, maxHeight: 360, overflowY: 'auto' }}>
              <div style={{ alignSelf: 'center', padding: '4px 10px', backgroundColor: '#D1E8E2', borderRadius: 8, fontSize: '0.68rem', color: '#0B132B' }}>
                TODAY • VOICE & WHATSAPP ASSISTED CHANNEL
              </div>
              
              <div style={{ alignSelf: 'flex-start', maxWidth: '85%', padding: '10px 14px', backgroundColor: '#FFFFFF', borderRadius: '0 12px 12px 12px', fontSize: '0.84rem', color: '#0B132B', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                Namaste Anaya! Your **September 2026** GST review is ready. 
                <br /><br />
                - 124 sales uploaded
                - Net tax estimate: **₹ 76,760**
                - GSTR-3B deadline: **20 October**
                <br /><br />
                Reply **1** to review purchase differences, or send a voice note with your questions!
              </div>

              <div style={{ alignSelf: 'flex-end', maxWidth: '80%', padding: '8px 12px', backgroundColor: '#DCF8C6', borderRadius: '12px 0 12px 12px', fontSize: '0.84rem', color: '#0B132B', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                Why do I have 3 purchase differences?
              </div>

              <div style={{ alignSelf: 'flex-start', maxWidth: '85%', padding: '10px 14px', backgroundColor: '#FFFFFF', borderRadius: '0 12px 12px 12px', fontSize: '0.84rem', color: '#0B132B', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                Calicut Packaging gave a ₹2,000 trade discount on bill #CPS-8842. Under Section 16(2)(aa), we adjusted this so you claim full credit without notice risk.
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: 14, backgroundColor: '#F0F0F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.74rem', color: '#596579' }}>Multi-channel voice & WhatsApp gateway active</span>
              <button
                type="button"
                onClick={() => {
                  setIsWhatsAppModalOpen(false);
                  setActiveNav('copilot');
                }}
                style={{ padding: '6px 14px', fontSize: '0.78rem', fontWeight: 700, color: '#FFFFFF', backgroundColor: '#075E54', border: 'none', borderRadius: 8, cursor: 'pointer' }}
              >
                Open in Web Copilot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MOBILE BOTTOM NAVIGATION                                 */}
      {/* ======================================================== */}
      <div className="mobile-bottom-nav">
        {[
          { id: 'home', label: 'Home', icon: LayoutDashboard },
          { id: 'sales', label: 'Sales', icon: Receipt },
          { id: 'purchases', label: 'Purchases', icon: ShoppingCart },
          { id: 'copilot', label: 'Copilot', icon: Bot },
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
