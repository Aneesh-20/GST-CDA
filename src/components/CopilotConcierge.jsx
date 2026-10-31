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
  User
} from 'lucide-react';
import { COPILOT_KNOWLEDGE, DEMO_BUSINESS } from '../lib/showcaseData.js';

export default function CopilotConcierge({ initialQuestion, onNavigate }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'copilot',
      content: `Hello Anaya, I’m your **GST Guide**.\n\nAll **124 sales** for September 2026 are recorded. Your primary next step is checking the **3 purchase differences** before reviewing your **₹ 76,760** net tax summary. How can I assist you today?`,
      provenance: 'Based on your verified records • September 2026',
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

    // Find scripted response or default intelligent concierge answer
    const matched = COPILOT_KNOWLEDGE.find(k => k.question.toLowerCase() === qText.toLowerCase());

    const botReply = matched ? {
      id: `bot-${Date.now()}`,
      sender: 'copilot',
      content: matched.answer,
      provenance: 'Based on verified records • September 2026',
      timestamp: 'Just now',
      action: matched.action
    } : {
      id: `bot-${Date.now()}`,
      sender: 'copilot',
      content: `Regarding **"${qText}"** for **${DEMO_BUSINESS.tradeName}**:\n\nUnder Indian GST rules for Kerala businesses, your outward sales are calculated on integer paise math. For September 2026, keeping your purchase invoices matched ensures you claim all **₹ 74,800** in eligible tax credits without notice exposure.`,
      provenance: 'General GST compliance explanation',
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
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
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
          marginBottom: 12
        }}>
          <Bot style={{ width: 24, height: 24 }} />
        </div>
        <h1 className="font-editorial" style={{ fontSize: '2.5rem', fontWeight: 500, color: '#0B132B', margin: 0 }}>
          Hello, I’m your GST guide.
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#596579', maxWidth: 540, margin: '8px auto 0' }}>
          Ask in plain language. I’ll explain what your records show and what to do next without accounting jargon.
        </p>
      </div>

      {/* 4 Suggested Question Chips */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
        {COPILOT_KNOWLEDGE.map(k => (
          <button
            key={k.id}
            type="button"
            onClick={() => handleAskQuestion(k.question)}
            style={{
              padding: '8px 16px',
              fontSize: '0.82rem',
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
            <Sparkles style={{ width: 13, height: 13, color: '#C87D0E' }} />
            <span>{k.question}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Canvas */}
      <div style={{ 
        backgroundColor: '#FFFFFF', 
        borderRadius: 22, 
        border: '1px solid #EAE5DC', 
        boxShadow: '0 4px 20px rgba(11, 19, 43, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 440,
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
                  justifyContent: isBot ? 'flex-start' : 'flex-end'
                }}
              >
                {isBot && (
                  <div style={{ 
                    width: 34, 
                    height: 34, 
                    borderRadius: 10, 
                    backgroundColor: '#0D6258', 
                    color: '#FFFFFF', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    flexShrink: 0,
                    marginTop: 2 
                  }}>
                    <Bot style={{ width: 18, height: 18 }} />
                  </div>
                )}

                <div style={{ maxWidth: '82%' }}>
                  <div style={{
                    padding: '16px 20px',
                    borderRadius: 16,
                    backgroundColor: isBot ? '#FAF8F5' : '#0B132B',
                    color: isBot ? '#0B132B' : '#FFFFFF',
                    border: isBot ? '1px solid #EAE5DC' : 'none',
                    fontSize: '0.92rem',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-line'
                  }}>
                    {m.content}
                  </div>

                  {/* Provenance Tag & Interactive Action */}
                  {isBot && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, padding: '0 4px', flexWrap: 'wrap', gap: 8 }}>
                      <span style={{ fontSize: '0.7rem', color: '#8D99AE' }}>
                        {m.provenance}
                      </span>

                      {m.action && (
                        <button
                          type="button"
                          onClick={() => onNavigate(m.action.tab, m.action.subTab)}
                          style={{
                            padding: '6px 12px',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            color: '#0D6258',
                            backgroundColor: '#EEF8F6',
                            border: '1px solid #B2DDD7',
                            borderRadius: 8,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5
                          }}
                        >
                          <span>{m.action.label}</span>
                          <ArrowRight style={{ width: 13, height: 13 }} />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {!isBot && (
                  <div style={{ 
                    width: 34, 
                    height: 34, 
                    borderRadius: 10, 
                    backgroundColor: '#0B132B', 
                    color: '#FFFFFF', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    flexShrink: 0,
                    marginTop: 2 
                  }}>
                    <User style={{ width: 16, height: 16 }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Input Composer Bar */}
        <form 
          onSubmit={handleSend}
          style={{ 
            borderTop: '1px solid #EAE5DC', 
            padding: '16px 20px', 
            backgroundColor: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            gap: 8
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              title="Attach invoice or receipt"
              style={{ background: 'none', border: 'none', color: '#8D99AE', cursor: 'pointer', padding: 4 }}
            >
              <Paperclip style={{ width: 18, height: 18 }} />
            </button>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about your sales, purchase bills, differences, or deadlines..."
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '0.92rem',
                color: '#0B132B',
                backgroundColor: 'transparent'
              }}
            />

            <button
              type="button"
              title="Voice assistant placeholder"
              style={{ background: 'none', border: 'none', color: '#8D99AE', cursor: 'pointer', padding: 4 }}
            >
              <Mic style={{ width: 18, height: 18 }} />
            </button>

            <button
              type="submit"
              disabled={!inputValue.trim()}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: inputValue.trim() ? '#0D6258' : '#FAF8F5',
                color: inputValue.trim() ? '#FFFFFF' : '#8D99AE',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inputValue.trim() ? 'pointer' : 'default',
                transition: 'all 0.15s ease'
              }}
            >
              <Send style={{ width: 16, height: 16 }} />
            </button>
          </div>

          <div style={{ textAlign: 'center', fontSize: '0.7rem', color: '#8D99AE' }}>
            GST CDA Copilot guidance provides real-time mathematical assistance for your business records.
          </div>
        </form>
      </div>
    </div>
  );
}

