'use client';

import React from 'react';
import { 
  Users, 
  Sparkles, 
  Gift, 
  ChevronRight, 
  ExternalLink,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { REFERRAL_ENGINE_DATA } from '../../lib/showcaseData.js';

export default function SecondaryIntelligence({
  business,
  purchasesList = [],
  totalEligibleItc = 0,
  onNavigate,
  onRequestCaSupport
}) {
  const advisor = business.advisor || {
    name: 'V. Ramanathan & Co.',
    firm: 'Chartered Accountants',
    city: 'Kochi',
    avatarInitials: 'VR'
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }} className="stat-grid-3 staged-enter-4">
      
      {/* 1. CA / ADVISOR SUPPORT */}
      <div style={{ 
        backgroundColor: '#FFFFFF', 
        borderRadius: 16, 
        border: '1px solid #EAE5DC', 
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8D99AE', fontWeight: 800, marginBottom: 10 }}>
            CA & Advisor Support
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ 
              width: 38, 
              height: 38, 
              borderRadius: '50%', 
              backgroundColor: '#0D6258', 
              color: '#FFFFFF', 
              fontWeight: 800, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '0.85rem' 
            }}>
              {advisor.avatarInitials || 'CA'}
            </div>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0B132B' }}>
                {advisor.name}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#596579' }}>
                {advisor.firm} • {advisor.city || 'Kochi'}
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.76rem', color: '#596579', lineHeight: 1.45, margin: 0 }}>
            Share verified ledgers, review vendor variances, and authorise returns in a shared sovereign workspace.
          </p>
        </div>

        <button
          type="button"
          onClick={onRequestCaSupport}
          style={{
            marginTop: 16,
            padding: '8px 14px',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#0B132B',
            backgroundColor: '#FAF8F5',
            border: '1px solid #EAE5DC',
            borderRadius: 8,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            transition: 'all 0.12s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#0D6258'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = '#EAE5DC'}
        >
          <Users style={{ width: 14, height: 14, color: '#0D6258' }} />
          <span>Request CA Consultation</span>
        </button>
      </div>

      {/* 2. STATUTORY CLARITY / WHY IT MATTERS */}
      <div style={{ 
        backgroundColor: '#FFFFFF', 
        borderRadius: 16, 
        border: '1px solid #EAE5DC', 
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#0D6258', fontWeight: 800, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Sparkles style={{ width: 12, height: 12 }} />
            <span>Statutory Intelligence</span>
          </div>

          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0B132B', marginBottom: 6 }}>
            Why keeping purchase bills matters
          </div>

          <p style={{ fontSize: '0.76rem', color: '#596579', lineHeight: 1.45, margin: 0 }}>
            Every verified purchase bill legally reduces your net cash tax liability. Your recorded inward bills protect <strong>₹ {totalEligibleItc.toLocaleString('en-IN')}</strong> from being paid out in cash.
          </p>
        </div>

        <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #FAF8F5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem' }}>
          <span style={{ color: '#0D6258', fontWeight: 700 }}>Section 16(2)(aa) guide</span>
          <ArrowRight style={{ width: 13, height: 13, color: '#0D6258' }} />
        </div>
      </div>

      {/* 3. REFERRAL FLYWHEEL / MSME GROWTH */}
      <div style={{ 
        backgroundColor: '#FEF7EC', 
        borderRadius: 16, 
        border: '1px solid #F7E1B8', 
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#B45309', fontWeight: 800, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Gift style={{ width: 12, height: 12 }} />
            <span>MSME Growth Loop</span>
          </div>

          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#78350F', marginBottom: 4 }}>
            {REFERRAL_ENGINE_DATA.postFilingHeadline}
          </div>

          <p style={{ fontSize: '0.76rem', color: '#92400E', lineHeight: 1.45, margin: 0 }}>
            {REFERRAL_ENGINE_DATA.referrerReward} ({REFERRAL_ENGINE_DATA.refereeReward}) for every fellow entrepreneur you onboard to verified compliance.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('referral')}
          style={{
            marginTop: 16,
            padding: '8px 14px',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#FFFFFF',
            backgroundColor: '#B45309',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6
          }}
        >
          <span>Share Code: {REFERRAL_ENGINE_DATA.referralCode}</span>
        </button>
      </div>

    </div>
  );
}
