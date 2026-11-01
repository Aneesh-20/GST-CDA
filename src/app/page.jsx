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
  MessageSquare,
  Edit2,
  Check,
  Trash2,
  Database
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
import { COMPLIANCE_SCORE, EXPERIENCE_CHANNELS, SAMPLE_SALES_TABLE } from '../lib/showcaseData.js';
import { BLANK_BUSINESS, STARTER_BUSINESS, SAMPLE_PURCHASE_TABLE } from '../lib/realtimeData.js';

export default function GSTCDAShowcaseApp() {
  // Main view state: 'app' (default hero showcase) | 'landing' | 'onboarding'
  const [viewMode, setViewMode] = useState('app');
  
  // Navigation tabs in main app
  const [activeNav, setActiveNav] = useState('home');
  const [purchasesSubTab, setPurchasesSubTab] = useState('reconciliation');
  const [calendarSubSection, setCalendarSubSection] = useState('calendar');

  // Command Palette State
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Mobile Navigation Drawer State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // In-App Toast State
  const [toastMessage, setToastMessage] = useState(null);

  // Notifications popover toggle
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Channel switcher state
  const [selectedChannel, setSelectedChannel] = useState('web');
  const [isChannelDropdownOpen, setIsChannelDropdownOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

  // Business Profile Management (Clean Slate by Default - No Dummy Values)
  const [businessProfile, setBusinessProfile] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gst_cda_business_profile');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.tradeName && parsed.tradeName !== 'My Enterprise' && !parsed.tradeName.includes('Anaya')) {
            return parsed;
          }
          localStorage.removeItem('gst_cda_business_profile');
        } catch (e) {}
      }
    }
    return BLANK_BUSINESS;
  });

  // Sales and Purchases Registers (Empty Arrays by Default - No Sample Rows)
  const [salesList, setSalesList] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gst_cda_sales_list');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const hasDummy = parsed.some(s => 
              s.customerName === 'Cochin Living Boutique' || 
              s.id === 'INV-2026-SEP-02' ||
              s.customerName === 'Bengaluru Studio Homes'
            );
            if (hasDummy) {
              localStorage.removeItem('gst_cda_sales_list');
              return [];
            }
            return parsed;
          }
        } catch (e) {}
      }
    }
    return [];
  });

  const [purchasesList, setPurchasesList] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gst_cda_purchases_list');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const hasDummy = parsed.some(p => 
              p.vendorName === 'Kerala Handloom Weavers' || 
              p.id === 'HND-2026-901'
            );
            if (hasDummy) {
              localStorage.removeItem('gst_cda_purchases_list');
              return [];
            }
            return parsed;
          }
        } catch (e) {}
      }
    }
    return [];
  });

  // Business Switcher / Edit Modal State
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(businessProfile);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const updateBusinessProfile = (newProfile) => {
    setBusinessProfile(newProfile);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gst_cda_business_profile', JSON.stringify(newProfile));
    }
  };

  const updateSalesList = (newList) => {
    setSalesList(newList);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gst_cda_sales_list', JSON.stringify(newList));
    }
  };

  const updatePurchasesList = (newList) => {
    setPurchasesList(newList);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gst_cda_purchases_list', JSON.stringify(newList));
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateBusinessProfile(editForm);
    setIsBusinessModalOpen(false);
    showToast(`🏢 Business details updated for ${editForm.tradeName || 'your enterprise'}.`);
  };

  const handleResetToCleanSlate = () => {
    if (confirm('Start a completely clean workspace? All current sales and purchase rows will be cleared so you can upload your real records.')) {
      updateSalesList([]);
      updatePurchasesList([]);
      updateBusinessProfile(BLANK_BUSINESS);
      setEditForm(BLANK_BUSINESS);
      setIsBusinessModalOpen(false);
      showToast('✨ Reset to clean slate (0 sales, 0 purchases, blank business details).');
    }
  };

  const handleLoadSampleStarterData = () => {
    updateSalesList(SAMPLE_SALES_TABLE);
    updatePurchasesList(SAMPLE_PURCHASE_TABLE);
    updateBusinessProfile(STARTER_BUSINESS);
    setEditForm(STARTER_BUSINESS);
    setIsBusinessModalOpen(false);
    showToast('📦 Loaded sample starter records for preview.');
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
          showToast(`🎉 Welcome to ${businessProfile.tradeName}! Your workspace is ready.`);
        }}
        onCancel={() => {
          setViewMode('app');
          setActiveNav('home');
        }}
      />
    );
  }

  const monogram = businessProfile.tradeName
    ? businessProfile.tradeName.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
    : 'GST';

  // MAIN APPLICATION SHELL
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FAF8F5', color: '#0B132B' }}>
      
      {/* ======================================================== */}
      {/* DESKTOP SIDEBAR (ALIGNED WITH PDF MAJOR MODULES)        */}
      {/* ======================================================== */}
      <aside className="desktop-sidebar hide-on-mobile">
        
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
          <div 
            onClick={() => {
              setEditForm(businessProfile);
              setIsBusinessModalOpen(true);
            }}
            title="Click to edit company details or switch workspace"
            style={{ 
              marginTop: 14, 
              padding: '8px 12px', 
              backgroundColor: '#FAF8F5', 
              borderRadius: 12, 
              border: '1px solid #EAE5DC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'border-color 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#0D6258'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#EAE5DC'}
          >
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0B132B', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>{businessProfile.tradeName || 'Configure Business'}</span>
                <Edit2 style={{ width: 10, height: 10, color: '#8D99AE' }} />
              </div>
              <div style={{ fontSize: '0.68rem', color: '#596579' }}>
                {businessProfile.city ? `${businessProfile.city}, ` : ''}{businessProfile.stateName || 'Kerala'} ({businessProfile.stateCode || '32'})
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
            { id: 'sales', label: 'Invoice Data (Sales)', icon: Receipt, pill: `${salesList.length}` },
            { id: 'purchases', label: 'GSTR-2B / Reconciliation', icon: ShoppingCart, pill: `${purchasesList.length}`, pillColor: '#B45309' },
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
              {monogram}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0B132B', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {businessProfile.contactName || businessProfile.tradeName || 'Authorized Signatory'}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#8D99AE' }}>
                Authorized Signatory
              </div>
            </div>
          </div>
        </div>

      </aside>

      {/* ======================================================== */}
      {/* MOBILE NAVIGATION DRAWER (OFF-CANVAS FOR MOBILE/TABLET)  */}
      {/* ======================================================== */}
      {isMobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="mobile-drawer-content" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header with Close Button */}
            <div style={{ padding: '18px 16px', borderBottom: '1px solid #EAE5DC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                  <div style={{ fontWeight: 800, fontSize: '0.94rem', color: '#0B132B' }}>GST CDA</div>
                  <div style={{ fontSize: '0.64rem', color: '#596579' }}>Compliance Digital Assistant</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ 
                  width: 32, 
                  height: 32, 
                  borderRadius: 8, 
                  backgroundColor: '#FAF8F5', 
                  border: '1px solid #EAE5DC', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#596579',
                  cursor: 'pointer'
                }}
              >
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>

            {/* Mobile Business Switcher Card */}
            <div style={{ padding: '12px 14px 6px' }}>
              <div 
                onClick={() => {
                  setEditForm(businessProfile);
                  setIsBusinessModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                style={{ 
                  padding: '10px 12px', 
                  backgroundColor: '#FAF8F5', 
                  borderRadius: 12, 
                  border: '1px solid #EAE5DC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0B132B', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>{businessProfile.tradeName || 'Configure Business'}</span>
                    <Edit2 style={{ width: 10, height: 10, color: '#8D99AE' }} />
                  </div>
                  <div style={{ fontSize: '0.66rem', color: '#596579' }}>
                    {businessProfile.stateName || 'Kerala'} ({businessProfile.stateCode || '32'})
                  </div>
                </div>
                <span style={{ fontSize: '0.66rem', color: '#0D6258', fontWeight: 800, backgroundColor: '#EEF8F6', padding: '2px 6px', borderRadius: 4 }}>
                  Score: 92
                </span>
              </div>
            </div>

            {/* Navigation Links inside Mobile Drawer */}
            <nav style={{ flex: 1, padding: '10px 10px', display: 'flex', flexDirection: 'column', gap: 3, overflowY: 'auto' }}>
              <div style={{ fontSize: '0.64rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8D99AE', fontWeight: 800, padding: '4px 10px' }}>
                Core Modules
              </div>
              {[
                { id: 'home', label: 'Compliance Dashboard', icon: LayoutDashboard, pill: `${COMPLIANCE_SCORE.score}/100`, pillColor: '#0E7051' },
                { id: 'copilot', label: 'GST Copilot', icon: Bot, pill: '5-Step', highlight: true },
                { id: 'startup-express', label: 'Startup Express', icon: Rocket, pill: 'PAN & MCA' },
                { id: 'sales', label: 'Invoice Data (Sales)', icon: Receipt, pill: `${salesList.length}` },
                { id: 'purchases', label: 'GSTR-2B / Reconciliation', icon: ShoppingCart, pill: `${purchasesList.length}`, pillColor: '#B45309' },
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
                      setIsMobileMenuOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '9px 12px',
                      borderRadius: 10,
                      border: isActive ? '1px solid #B2DDD7' : '1px solid transparent',
                      backgroundColor: isActive ? '#EEF8F6' : 'transparent',
                      color: isActive ? '#0D6258' : '#0B132B',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Icon style={{ width: 16, height: 16, color: isActive ? '#0D6258' : '#8D99AE' }} />
                      <span>{item.label}</span>
                    </div>
                    {item.pill && (
                      <span style={{ 
                        fontSize: '0.64rem', 
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

              <div style={{ fontSize: '0.64rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8D99AE', fontWeight: 800, padding: '12px 10px 4px' }}>
                Compliance & Growth
              </div>
              {[
                { id: 'calendar', label: 'Due-Date Engine', icon: CalendarIcon },
                { id: 'vault', label: 'Document Vault', icon: FolderLock },
                { id: 'ca-support', label: 'CA / Agent Connect', icon: Users },
                { id: 'referral', label: 'Referral Engine', icon: Gift, pill: '₹500', pillColor: '#C87D0E' },
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
                      setIsMobileMenuOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '9px 12px',
                      borderRadius: 10,
                      border: isActive ? '1px solid #B2DDD7' : '1px solid transparent',
                      backgroundColor: isActive ? '#EEF8F6' : 'transparent',
                      color: isActive ? '#0D6258' : '#0B132B',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Icon style={{ width: 16, height: 16, color: isActive ? '#0D6258' : '#8D99AE' }} />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* Bottom Signatory in Drawer */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid #EAE5DC', backgroundColor: '#FAF8F5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: '#0B132B', color: '#FFFFFF', fontWeight: 800, fontSize: '0.72rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {monogram}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0B132B', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {businessProfile.contactName || businessProfile.tradeName || 'Authorized Signatory'}
                  </div>
                  <div style={{ fontSize: '0.64rem', color: '#8D99AE' }}>
                    Authorized Signatory
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MAIN CONTENT AREA                                        */}
      {/* ======================================================== */}
      <div className="main-content-canvas">
        
        {/* TOP BAR WITH EXPERIENCE CHANNELS */}
        <header className="top-navbar">
          {/* Left: Hamburger (Mobile) + Breadcrumbs + Search Trigger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            {/* Mobile Hamburger Trigger */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="hide-on-desktop"
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                backgroundColor: '#FAF8F5',
                border: '1px solid #EAE5DC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#0B132B',
                flexShrink: 0
              }}
              aria-label="Open Navigation Menu"
            >
              <Menu style={{ width: 18, height: 18 }} />
            </button>

            <div style={{ fontSize: '0.84rem', color: '#596579', fontWeight: 600, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              <span className="hide-on-mobile">
                <span 
                  onClick={() => {
                    setEditForm(businessProfile);
                    setIsBusinessModalOpen(true);
                  }}
                  style={{ color: '#0B132B', cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' }}
                  title="Click to edit business profile"
                >
                  {businessProfile.tradeName || 'Configure Enterprise'}
                </span>
                <span style={{ margin: '0 6px', color: '#DCD5C9' }}>/</span>
              </span>
              <span style={{ color: '#0D6258', fontWeight: 700 }}>
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

            {/* Desktop Command Search Box */}
            <div 
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hide-on-mobile"
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
                minWidth: 190,
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

            {/* Mobile Search Icon Button */}
            <button
              type="button"
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hide-on-desktop"
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                backgroundColor: '#FAF8F5',
                border: '1px solid #EAE5DC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#0D6258',
                flexShrink: 0
              }}
              aria-label="Search or Ask GST CDA"
            >
              <Search style={{ width: 15, height: 15 }} />
            </button>
          </div>

          {/* Right: Experience Channels & Edit Workspace Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            
            {/* Experience Channels Dropdown - Single Option with Down Arrow */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setIsChannelDropdownOpen(!isChannelDropdownOpen)}
                style={{
                  padding: '6px 10px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  color: '#0D6258',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #B2DDD7',
                  borderRadius: 10,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 1px 4px rgba(11, 19, 43, 0.04)',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{EXPERIENCE_CHANNELS.find(c => c.id === selectedChannel)?.icon || '💻'}</span>
                <span className="hide-on-mobile">{EXPERIENCE_CHANNELS.find(c => c.id === selectedChannel)?.name || 'Web Portal'}</span>
                <ChevronDown style={{ 
                  width: 13, 
                  height: 13, 
                  color: '#0D6258', 
                  transition: 'transform 0.2s ease', 
                  transform: isChannelDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' 
                }} />
              </button>

              {isChannelDropdownOpen && (
                <>
                  <div 
                    onClick={() => setIsChannelDropdownOpen(false)} 
                    style={{ position: 'fixed', inset: 0, zIndex: 45 }} 
                  />
                  <div style={{
                    position: 'absolute',
                    top: 38,
                    right: 0,
                    width: 210,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 14,
                    border: '1px solid #EAE5DC',
                    boxShadow: '0 12px 32px rgba(11, 19, 43, 0.12)',
                    padding: 6,
                    zIndex: 50,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                  }}>
                    <div style={{ fontSize: '0.66rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8D99AE', fontWeight: 800, padding: '6px 10px 4px' }}>
                      Switch Channel
                    </div>
                    {EXPERIENCE_CHANNELS.map(ch => {
                      const isSelected = selectedChannel === ch.id;
                      return (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => {
                            handleChannelSelect(ch.id);
                            setIsChannelDropdownOpen(false);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 10px',
                            borderRadius: 8,
                            border: isSelected ? '1px solid #B2DDD7' : '1px solid transparent',
                            backgroundColor: isSelected ? '#EEF8F6' : 'transparent',
                            color: isSelected ? '#0D6258' : '#0B132B',
                            fontWeight: isSelected ? 700 : 500,
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            textAlign: 'left',
                            width: '100%',
                            transition: 'all 0.12s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) e.currentTarget.style.backgroundColor = '#FAF8F5';
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span>{ch.icon}</span>
                            <span>{ch.name}</span>
                          </div>
                          {isSelected && <Check style={{ width: 14, height: 14, color: '#0D6258' }} />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Quick Workspace Switcher Button */}
            <button
              type="button"
              onClick={() => {
                setEditForm(businessProfile);
                setIsBusinessModalOpen(true);
              }}
              style={{
                padding: '5px 10px',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#0D6258',
                backgroundColor: '#EEF8F6',
                border: '1px solid #B2DDD7',
                borderRadius: 8,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}
              title="Edit Business Profile"
            >
              <SettingsIcon style={{ width: 13, height: 13 }} />
              <span className="hide-on-mobile">Workspace Profile</span>
            </button>

            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                style={{ 
                  width: 32, 
                  height: 32, 
                  borderRadius: 8, 
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
                <Bell style={{ width: 15, height: 15 }} />
                <span style={{ position: 'absolute', top: 5, right: 5, width: 6, height: 6, borderRadius: '50%', backgroundColor: '#B45309' }} />
              </button>

              {/* Notification Popover */}
              {isNotificationsOpen && (
                <div style={{
                  position: 'absolute',
                  top: 40,
                  right: 0,
                  width: 290,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 14,
                  border: '1px solid #EAE5DC',
                  boxShadow: '0 10px 30px rgba(11, 19, 43, 0.12)',
                  padding: 16,
                  zIndex: 50
                }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0B132B', marginBottom: 10 }}>
                    Compliance Notifications
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.78rem' }}>
                    <div style={{ padding: 8, backgroundColor: '#FAF8F5', borderRadius: 8 }}>
                      <span style={{ fontWeight: 700, color: '#0D6258' }}>GSTR-1 Due Soon</span>
                      <div style={{ color: '#596579', marginTop: 2 }}>Submission cut-off on 11th of this month.</div>
                    </div>
                    <div style={{ padding: 8, backgroundColor: '#FAF8F5', borderRadius: 8 }}>
                      <span style={{ fontWeight: 700, color: '#B45309' }}>2B Reconciled</span>
                      <div style={{ color: '#596579', marginTop: 2 }}>{purchasesList.length} inward bills synced with supplier filings.</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* MAIN BODY CANVAS */}
        <main className="main-body-container">
          
          {activeNav === 'home' && (
            <HomeHeroDashboard 
              business={businessProfile}
              salesList={salesList}
              purchasesList={purchasesList}
              onNavigate={handleNavigate}
              onAskCopilot={(q) => {
                setActiveNav('copilot');
              }}
              onRequestCaSupport={() => {
                setActiveNav('ca-support');
                setCalendarSubSection('ca-support');
              }}
              onOpenBusinessModal={() => {
                setEditForm(businessProfile);
                setIsBusinessModalOpen(true);
              }}
            />
          )}

          {activeNav === 'copilot' && (
            <CopilotConcierge 
              business={businessProfile}
              salesList={salesList}
              purchasesList={purchasesList}
              onNavigate={handleNavigate}
            />
          )}

          {activeNav === 'startup-express' && (
            <BusinessRegistration onShowToast={showToast} />
          )}

          {activeNav === 'sales' && (
            <SalesManager 
              salesList={salesList}
              setSalesList={updateSalesList}
              onShowToast={showToast} 
            />
          )}

          {activeNav === 'purchases' && (
            <PurchasesReconciliation 
              purchasesList={purchasesList}
              setPurchasesList={updatePurchasesList}
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
              business={businessProfile}
              salesList={salesList}
              purchasesList={purchasesList}
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
      {/* MODAL: EDIT WORKSPACE & ENTITY PROFILE                   */}
      {/* ======================================================== */}
      {isBusinessModalOpen && (
        <div className="drawer-overlay" style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <div style={{ width: '100%', maxWidth: 540, backgroundColor: '#FFFFFF', borderRadius: 22, padding: 30, boxShadow: '0 25px 60px rgba(11, 19, 43, 0.25)', border: '1px solid #EAE5DC' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#EEF8F6', color: '#0D6258', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 style={{ width: 22, height: 22 }} />
                </div>
                <div>
                  <h3 className="font-editorial" style={{ fontSize: '1.45rem', fontWeight: 500, color: '#0B132B', margin: 0 }}>
                    Workspace & Entity Setup
                  </h3>
                  <span style={{ fontSize: '0.76rem', color: '#8D99AE' }}>Configure your real business details</span>
                </div>
              </div>

              <button 
                type="button" 
                onClick={() => setIsBusinessModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#8D99AE', cursor: 'pointer' }}
              >
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#0B132B', marginBottom: 4 }}>
                  Trade / Display Name *
                </label>
                <input 
                  type="text" 
                  value={editForm.tradeName || ''}
                  onChange={e => setEditForm({ ...editForm, tradeName: e.target.value })}
                  placeholder="e.g. Apex Hardware & Electricals"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1px solid #DCD5C9', fontSize: '0.86rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#0B132B', marginBottom: 4 }}>
                    Legal Registered Name
                  </label>
                  <input 
                    type="text" 
                    value={editForm.legalName || ''}
                    onChange={e => setEditForm({ ...editForm, legalName: e.target.value })}
                    placeholder="e.g. Apex Enterprises LLP"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1px solid #DCD5C9', fontSize: '0.86rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#0B132B', marginBottom: 4 }}>
                    Contact Person Name
                  </label>
                  <input 
                    type="text" 
                    value={editForm.contactName || ''}
                    onChange={e => setEditForm({ ...editForm, contactName: e.target.value })}
                    placeholder="e.g. Suresh Kumar"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1px solid #DCD5C9', fontSize: '0.86rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#0B132B', marginBottom: 4 }}>
                    GSTIN (15 Chars)
                  </label>
                  <input 
                    type="text" 
                    value={editForm.gstin || ''}
                    onChange={e => setEditForm({ ...editForm, gstin: e.target.value.toUpperCase() })}
                    placeholder="e.g. 32AABCA8842P1Z9"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1px solid #DCD5C9', fontSize: '0.86rem', fontFamily: 'monospace' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#0B132B', marginBottom: 4 }}>
                    Filing Tax Period
                  </label>
                  <input 
                    type="text" 
                    value={editForm.period || ''}
                    onChange={e => setEditForm({ ...editForm, period: e.target.value })}
                    placeholder="e.g. October 2026"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1px solid #DCD5C9', fontSize: '0.86rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#0B132B', marginBottom: 4 }}>
                    State & Jurisdiction
                  </label>
                  <select
                    value={`${editForm.stateCode || '32'}-${editForm.stateName || 'Kerala'}`}
                    onChange={e => {
                      const [code, name] = e.target.value.split('-');
                      setEditForm({ ...editForm, stateCode: code, stateName: name });
                    }}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1px solid #DCD5C9', fontSize: '0.86rem' }}
                  >
                    <option value="32-Kerala">Kerala (32)</option>
                    <option value="29-Karnataka">Karnataka (29)</option>
                    <option value="33-Tamil Nadu">Tamil Nadu (33)</option>
                    <option value="27-Maharashtra">Maharashtra (27)</option>
                    <option value="07-Delhi">Delhi (07)</option>
                    <option value="19-West Bengal">West Bengal (19)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#0B132B', marginBottom: 4 }}>
                    City
                  </label>
                  <input 
                    type="text" 
                    value={editForm.city || ''}
                    onChange={e => setEditForm({ ...editForm, city: e.target.value })}
                    placeholder="e.g. Kochi"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1px solid #DCD5C9', fontSize: '0.86rem' }}
                  />
                </div>
              </div>

              {/* Quick Actions Row */}
              <div style={{ marginTop: 8, padding: 12, backgroundColor: '#FAF8F5', borderRadius: 12, border: '1px solid #EAE5DC', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0B132B' }}>Workspace Mode</div>
                  <div style={{ fontSize: '0.7rem', color: '#8D99AE' }}>
                    {salesList.length} sales • {purchasesList.length} purchase bills loaded
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    onClick={handleResetToCleanSlate}
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      color: '#B91C1C',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #FECACA',
                      borderRadius: 8,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <Trash2 style={{ width: 12, height: 12 }} />
                    <span>Clean Slate (0 records)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLoadSampleStarterData}
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      color: '#0D6258',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #B2DDD7',
                      borderRadius: 8,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <Database style={{ width: 12, height: 12 }} />
                    <span>Starter Data</span>
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setIsBusinessModalOpen(false)}
                  style={{ padding: '9px 16px', fontSize: '0.84rem', fontWeight: 600, color: '#596579', background: 'none', border: '1px solid #DCD5C9', borderRadius: 10, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '9px 22px', fontSize: '0.84rem', fontWeight: 700, color: '#FFFFFF', backgroundColor: '#0D6258', border: 'none', borderRadius: 10, cursor: 'pointer', boxShadow: '0 4px 14px rgba(13, 98, 88, 0.25)' }}
                >
                  Save Business Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                Namaste {businessProfile.contactName || businessProfile.tradeName}! Your **{businessProfile.period || 'current period'}** GST review is ready. 
                <br /><br />
                - {salesList.length} sales recorded
                - {purchasesList.length} purchase bills recorded
                - Net tax estimate: **₹ {Math.max(0, salesList.reduce((acc, s) => acc + (s.gstPaise || 0), 0) - purchasesList.reduce((acc, p) => acc + (p.gstPaise || 0), 0)).toLocaleString('en-IN')}**
                <br /><br />
                Reply **1** to review purchase differences, or send a voice note with your questions!
              </div>

              <div style={{ alignSelf: 'flex-end', maxWidth: '80%', padding: '8px 12px', backgroundColor: '#DCF8C6', borderRadius: '12px 0 12px 12px', fontSize: '0.84rem', color: '#0B132B', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                Why do I have purchase differences?
              </div>

              <div style={{ alignSelf: 'flex-start', maxWidth: '85%', padding: '10px 14px', backgroundColor: '#FFFFFF', borderRadius: '0 12px 12px 12px', fontSize: '0.84rem', color: '#0B132B', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                Vendor trade discounts or delayed supplier filings are normal. Under Section 16(2)(aa), we protect your credits so you claim full credit without notice risk.
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
      {/* IN-APP TOAST                                             */}
      {/* ======================================================== */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          padding: '12px 20px',
          backgroundColor: '#0B132B',
          color: '#FFFFFF',
          borderRadius: 12,
          fontSize: '0.86rem',
          fontWeight: 600,
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          animation: 'fadeIn 0.2s ease'
        }}>
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
