'use client';

import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Paperclip, 
  Mic, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle,
  ShieldCheck,
  User,
  Info
} from 'lucide-react';
import { COPILOT_KNOWLEDGE } from '../lib/showcaseData.js';
import { DEFAULT_BUSINESS } from '../lib/realtimeData.js';

export default function CopilotConcierge({ 
  business = DEFAULT_BUSINESS,
  salesList = [],
  purchasesList = [],
  initialQuestion, 
  onNavigate 
}) {
  const totalTaxableSales = salesList.reduce((acc, s) => acc + (s.taxableRupees || 0), 0);
  const totalOutputTax = salesList.reduce((acc, s) => acc + (s.gstPaise || 0), 0);
  const totalTaxablePurchases = purchasesList.reduce((acc, p) => acc + (p.taxableRupees || 0), 0);
  const totalEligibleItc = purchasesList.reduce((acc, p) => acc + (p.gstPaise || 0), 0);
  const netTaxPayable = Math.max(0, totalOutputTax - totalEligibleItc);

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'copilot',
      content: `Hello${business.contactName ? ` ${business.contactName}` : (business.tradeName ? ` ${business.tradeName}` : '')}, I’m your **GST Copilot**.\n\n### “Your GST compliance workspace is ready.”\n\nHere is your current 5-step status:\n- **Step 1 — Sales**: ${salesList.length} sales invoices (₹ ${totalTaxableSales.toLocaleString('en-IN')} taxable)\n- **Step 2 — Purchases**: ${purchasesList.length} purchase bills recorded (₹ ${totalTaxablePurchases.toLocaleString('en-IN')})\n- **Step 3 — ITC**: Your available input tax credit appears to be ₹ ${totalEligibleItc.toLocaleString('en-IN')}.\n- **Step 4 — Tax**: Estimated net GST payable: **₹ ${netTaxPayable.toLocaleString('en-IN')}**.\n- **Step 5 — File**: Your return is ready. Review and authorise filing.\n\nHow can I help you understand your GST compliance today?`,
      provenance: `Deterministic GST Engine • ${business.period || 'Current Period'}`,
      timestamp: 'Now',
      action: {
        label: 'Review Inward Bills',
        tab: 'purchases',
        subTab: 'all-purchases'
      }
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleAskQuestion = (qText) => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: qText,
      timestamp: 'Just now'
    };

    // Find scripted response matching PDF Page 3 questions
    const matched = COPILOT_KNOWLEDGE.find(k => k.question.toLowerCase().trim() === qText.toLowerCase().trim());

    const botReply = matched ? {
      id: `bot-${Date.now()}`,
      sender: 'copilot',
      content: matched.answer.replace(/Anaya/g, business.contactName || business.tradeName),
      provenance: 'Deterministic Rules & Statutory GSP/GSTN Integration',
      timestamp: 'Just now',
      action: matched.action
    } : {
      id: `bot-${Date.now()}`,
      sender: 'copilot',
      content: `Regarding **"${qText}"** for **${business.tradeName}**:\n\nUnder Indian GST rules for ${business.stateName || 'state'} entities (${business.stateCode || '32'}), your outward sales and input tax credits are calculated strictly with integer paise arithmetic. In your current register, **${salesList.length} sales** and **${purchasesList.length} purchase bills** are reconciled to safeguard your **₹ ${totalEligibleItc.toLocaleString('en-IN')}** tax credit without notice risk.`,
      provenance: 'Deterministic Rules & Statutory GSP/GSTN Integration',
      timestamp: 'Just now',
      action: {
        label: `View ${business.period || 'Monthly'} GSTR-3B Summary`,
        tab: 'reports'
      }
    };

    setMessages(prev => [...prev, userMsg, botReply]);
    setInputValue('');
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    handleAskQuestion(inputValue.trim());
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', width: '100%', paddingBottom: 64 }}>
      
      {/* Editorial Greeting Header */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ 
          width: 48, 
          height: 48, 
          borderRadius: 14, 
          backgroundColor: '#EEF8F6', 
          color: '#0D6258', 
          display: 'inline-flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(13, 98, 88, 0.15)',
          marginBottom: 10
        }}>
          <Bot style={{ width: 24, height: 24 }} />
        </div>
        <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0D6258', fontWeight: 800 }}>
          THE BIGGEST DIFFERENTIATOR
        </div>
        <h1 className="font-editorial" style={{ fontSize: '2.5rem', fontWeight: 500, color: '#0B132B', margin: '4px 0 0 0' }}>
          GST Copilot
        </h1>
        <p style={{ fontSize: '0.96rem', color: '#596579', maxWidth: 600, margin: '6px auto 0' }}>
          Conversational compliance guide. Answers the exact questions entrepreneurs face in plain business language with verified mathematical provenance.
        </p>
      </div>

      {/* Scripted Question Chips (The exact 7 from PDF Page 3) */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8D99AE', fontWeight: 800, marginBottom: 8, textAlign: 'center' }}>
          FREQUENT QUESTIONS (TAP TO ASK)
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
          {COPILOT_KNOWLEDGE.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleAskQuestion(item.question)}
              style={{
                padding: '6px 14px',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#0B132B',
                backgroundColor: '#FFFFFF',
                border: '1px solid #DCD5C9',
                borderRadius: 9999,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 2px 6px rgba(11, 19, 43, 0.02)',
                transition: 'all 0.12s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#0D6258';
                e.currentTarget.style.backgroundColor = '#EEF8F6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#DCD5C9';
                e.currentTarget.style.backgroundColor = '#FFFFFF';
              }}
            >
              <Sparkles style={{ width: 12, height: 12, color: '#C87D0E' }} />
              <span>{item.question}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Conversation Stream */}
      <div style={{ 
        backgroundColor: '#FFFFFF', 
        borderRadius: 22, 
        border: '1px solid #EAE5DC', 
        padding: '24px 28px', 
        minHeight: 460,
        boxShadow: '0 8px 30px -6px rgba(11, 19, 43, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 20
      }}>
        {/* Messages List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, overflowY: 'auto' }}>
          {messages.map((m) => {
            const isBot = m.sender === 'copilot';
            return (
              <div 
                key={m.id}
                style={{
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                  alignSelf: isBot ? 'flex-start' : 'flex-end',
                  maxWidth: isBot ? '88%' : '75%'
                }}
              >
                {isBot && (
                  <div style={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: 10, 
                    backgroundColor: '#EEF8F6', 
                    color: '#0D6258', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Bot style={{ width: 16, height: 16 }} />
                  </div>
                )}

                <div>
                  <div style={{
                    padding: '16px 20px',
                    borderRadius: isBot ? '4px 18px 18px 18px' : '18px 4px 18px 18px',
                    backgroundColor: isBot ? '#FAF8F5' : '#0D6258',
                    color: isBot ? '#0B132B' : '#FFFFFF',
                    border: isBot ? '1px solid #EAE5DC' : 'none',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap'
                  }}>
                    {m.content}
                  </div>

                  {/* Bot Provenance & Inline Action */}
                  {isBot && (
                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.7rem', color: '#8D99AE', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <ShieldCheck style={{ width: 12, height: 12, color: '#0D6258' }} />
                        <span>{m.provenance}</span>
                      </span>

                      {m.action && onNavigate && (
                        <button
                          type="button"
                          onClick={() => onNavigate(m.action.tab, m.action.subTab)}
                          style={{
                            padding: '4px 12px',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            color: '#0D6258',
                            backgroundColor: '#EEF8F6',
                            border: '1px solid #B2DDD7',
                            borderRadius: 8,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4
                          }}
                        >
                          <span>{m.action.label}</span>
                          <ArrowRight style={{ width: 12, height: 12 }} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} style={{ borderTop: '1px solid #FAF8F5', paddingTop: 16 }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 10, 
            padding: '8px 12px 8px 16px', 
            backgroundColor: '#FAF8F5', 
            borderRadius: 14, 
            border: '1px solid #EAE5DC' 
          }}>
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything about your sales, purchase credit, or tax deadline..." 
              style={{ 
                flex: 1, 
                border: 'none', 
                backgroundColor: 'transparent', 
                outline: 'none', 
                fontSize: '0.9rem',
                color: '#0B132B'
              }}
            />

            <button
              type="submit"
              disabled={!inputValue.trim()}
              style={{
                padding: '10px 18px',
                fontSize: '0.86rem',
                fontWeight: 700,
                color: '#FFFFFF',
                backgroundColor: inputValue.trim() ? '#0D6258' : '#DCD5C9',
                border: 'none',
                borderRadius: 10,
                cursor: inputValue.trim() ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.15s ease'
              }}
            >
              <span>Ask</span>
              <Send style={{ width: 14, height: 14 }} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
