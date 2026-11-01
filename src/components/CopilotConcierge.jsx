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
import { COPILOT_KNOWLEDGE, DEMO_BUSINESS, COPILOT_5_STEPS } from '../lib/showcaseData.js';

export default function CopilotConcierge({ initialQuestion, onNavigate }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'copilot',
      content: `Hello Anaya, I’m your **GST Copilot**.\n\n### “Your GST for this month is ready.”\n\nHere is your current 5-step status for **September 2026**:\n- **Step 1 — Sales**: 124 sales invoices uploaded (₹ 8,42,000 taxable)\n- **Step 2 — Purchases**: We found ₹ 4,85,000 of purchase invoices (86 bills)\n- **Step 3 — ITC**: Your available input tax credit appears to be ₹ 74,800. Review 3 exceptions.\n- **Step 4 — Tax**: Estimated GST payable: **₹ 76,760**.\n- **Step 5 — File**: Your return is ready. Review and authorise filing.\n\nHow can I help you understand your GST compliance today?`,
      provenance: 'Deterministic GST Engine • September 2026',
      timestamp: 'Now',
      action: {
        label: 'Review 3 Purchase Differences',
        tab: 'purchases',
        subTab: 'reconciliation'
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
      content: matched.answer,
      provenance: 'Deterministic Rules & Statutory GSP/GSTN Integration',
      timestamp: 'Just now',
      action: matched.action
    } : {
      id: `bot-${Date.now()}`,
      sender: 'copilot',
      content: `Regarding **"${qText}"** for **${DEMO_BUSINESS.tradeName}**:\n\nUnder Indian GST rules for Kerala entities, your outward sales and input tax credits are calculated strictly with integer paise arithmetic. For September 2026, all **124 sales** and **86 purchase bills** are reconciled to safeguard your **₹ 74,800** credit claim without notice risk.`,
      provenance: 'Deterministic Rules & Statutory GSP/GSTN Integration',
      timestamp: 'Just now',
      action: {
        label: 'View September GSTR-3B Summary',
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
        <p style={{ fontSize: '1rem', color: '#596579', maxWidth: 600, margin: '8px auto 0' }}>
          Instead of complicated GST terminology, we guide you through what matters in natural language.
        </p>
      </div>

      {/* PDF Page 3 Architectural Safeguard Callout */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 12, 
        padding: '12px 18px', 
        backgroundColor: '#FFFFFF', 
        borderRadius: 14, 
        border: '1px solid #EAE5DC', 
        marginBottom: 24,
        boxShadow: '0 2px 6px rgba(11, 19, 43, 0.02)'
      }}>
        <ShieldCheck style={{ width: 20, height: 20, color: '#0D6258', flexShrink: 0 }} />
        <div style={{ fontSize: '0.78rem', color: '#596579', lineHeight: 1.5 }}>
          <strong>Deterministic Tax Guard:</strong> AI explains and assists, but all tax computations, eligibility rules, and GSP filings are governed by deterministic rules and authorized GSTN integrations — not hallucinating LLM responses.
        </div>
      </div>

      {/* 7 Suggested Question Chips from PDF Page 3 */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8D99AE', fontWeight: 800, textAlign: 'center', marginBottom: 10 }}>
          Quick Questions Handled by GST Copilot
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
          {COPILOT_KNOWLEDGE.map(k => (
            <button
              key={k.id}
              type="button"
              onClick={() => handleAskQuestion(k.question)}
              style={{
                padding: '7px 14px',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#0D6258',
                backgroundColor: '#FFFFFF',
                border: '1px solid #B2DDD7',
                borderRadius: 9999,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 2px 6px rgba(13, 98, 88, 0.05)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#EEF8F6';
                e.currentTarget.style.borderColor = '#0D6258';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.borderColor = '#B2DDD7';
              }}
            >
              <Sparkles style={{ width: 12, height: 12, color: '#C87D0E' }} />
              <span>{k.question}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Canvas */}
      <div style={{ 
        backgroundColor: '#FFFFFF', 
        borderRadius: 22, 
        border: '1px solid #EAE5DC', 
        boxShadow: '0 4px 20px rgba(11, 19, 43, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 460,
        overflow: 'hidden'
      }}>
        {/* Messages Scroll Area */}
        <div style={{ flex: 1, padding: 28, display: 'flex', flexDirection: 'column', gap: 24, overflowY: 'auto' }}>
          {messages.map((m) => {
            const isBot = m.sender === 'copilot';
            return (
              <div 
                key={m.id}
                style={{
                  display: 'flex',
                  gap: 14,
                  alignItems: 'flex-start',
                  maxWidth: isBot ? '85%' : '75%',
                  alignSelf: isBot ? 'flex-start' : 'flex-end',
                  flexDirection: isBot ? 'row' : 'row-reverse'
                }}
              >
                {/* Avatar */}
                <div style={{ 
                  width: 34, 
                  height: 34, 
                  borderRadius: 10, 
                  backgroundColor: isBot ? '#0D6258' : '#0B132B', 
                  color: '#FFFFFF', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0 
                }}>
                  {isBot ? <Bot style={{ width: 18, height: 18 }} /> : <User style={{ width: 16, height: 16 }} />}
                </div>

                {/* Message Bubble */}
                <div>
                  <div style={{
                    padding: '16px 20px',
                    borderRadius: isBot ? '4px 18px 18px 18px' : '18px 4px 18px 18px',
                    backgroundColor: isBot ? '#FAF8F5' : '#0D6258',
                    color: isBot ? '#0B132B' : '#FFFFFF',
                    border: isBot ? '1px solid #EAE5DC' : 'none',
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-line',
                    boxShadow: isBot ? '0 2px 8px rgba(11, 19, 43, 0.02)' : '0 4px 14px rgba(13, 98, 88, 0.25)'
                  }}>
                    {m.content}
                  </div>

                  {/* Provenance note & contextual action button */}
                  {isBot && (
                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                      <span style={{ fontSize: '0.7rem', color: '#8D99AE' }}>
                        ✓ {m.provenance}
                      </span>

                      {m.action && (
                        <button
                          type="button"
                          onClick={() => onNavigate(m.action.tab, m.action.subTab)}
                          style={{
                            padding: '4px 10px',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            color: '#0D6258',
                            backgroundColor: '#EEF8F6',
                            border: '1px solid #B2DDD7',
                            borderRadius: 6,
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

        {/* Input Composer Field */}
        <div style={{ padding: 18, borderTop: '1px solid #EAE5DC', backgroundColor: '#FAF8F5' }}>
          <form onSubmit={handleSend} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything in plain English: 'Why is my ITC different?' or 'How much tax do I owe?'"
              style={{
                flex: 1,
                padding: '12px 18px',
                fontSize: '0.88rem',
                backgroundColor: '#FFFFFF',
                border: '1px solid #DCD5C9',
                borderRadius: 14,
                outline: 'none',
                color: '#0B132B'
              }}
            />

            <button
              type="submit"
              disabled={!inputValue.trim()}
              style={{
                padding: '12px 20px',
                fontSize: '0.88rem',
                fontWeight: 700,
                color: '#FFFFFF',
                backgroundColor: inputValue.trim() ? '#0D6258' : '#8D99AE',
                border: 'none',
                borderRadius: 12,
                cursor: inputValue.trim() ? 'pointer' : 'default',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: inputValue.trim() ? '0 4px 14px rgba(13, 98, 88, 0.25)' : 'none'
              }}
            >
              <span>Send</span>
              <Send style={{ width: 15, height: 15 }} />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
