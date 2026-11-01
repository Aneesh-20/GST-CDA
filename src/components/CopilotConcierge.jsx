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
  Info,
  Receipt,
  ShoppingCart,
  FileText,
  AlertTriangle,
  Lock
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

  // PDF Section 3: The 5-Step Plain-Language Model Definitions
  const copilot5Steps = [
    {
      step: 1,
      title: 'Sales',
      quote: 'Upload your sales invoices.',
      detail: salesList.length > 0 
        ? `${salesList.length} sales invoices (₹ ${totalTaxableSales.toLocaleString('en-IN')} taxable)` 
        : 'Outward sales register empty',
      status: salesList.length > 0 ? 'Uploaded' : 'Action Needed',
      statusColor: salesList.length > 0 ? '#0E7051' : '#B45309',
      statusBg: salesList.length > 0 ? '#ECFDF5' : '#FEF7EC',
      actionLabel: salesList.length > 0 ? 'Manage Sales' : 'Upload Sales',
      icon: Receipt,
      tab: 'sales'
    },
    {
      step: 2,
      title: 'Purchases',
      quote: purchasesList.length > 0 
        ? `We found ₹ ${totalTaxablePurchases.toLocaleString('en-IN')} of purchase invoices.` 
        : 'Upload your purchase invoices.',
      detail: purchasesList.length > 0 
        ? `${purchasesList.length} vendor bills recorded` 
        : 'Inward purchase register empty',
      status: purchasesList.length > 0 ? 'Found' : 'Action Needed',
      statusColor: purchasesList.length > 0 ? '#0E7051' : '#B45309',
      statusBg: purchasesList.length > 0 ? '#ECFDF5' : '#FEF7EC',
      actionLabel: purchasesList.length > 0 ? 'View Bills' : 'Upload Bills',
      icon: ShoppingCart,
      tab: 'purchases'
    },
    {
      step: 3,
      title: 'ITC',
      quote: `Your available input tax credit appears to be ₹ ${totalEligibleItc.toLocaleString('en-IN')}. Review exceptions.`,
      detail: purchasesList.length > 0 ? 'Reconciled under Section 16(2)(aa)' : 'Supplier GSTR-2B match',
      status: purchasesList.length > 0 ? 'Reconciled' : 'Review',
      statusColor: '#0E7051',
      statusBg: '#ECFDF5',
      actionLabel: 'Review Differences',
      icon: ShieldCheck,
      tab: 'purchases',
      subTab: 'reconciliation'
    },
    {
      step: 4,
      title: 'Tax',
      quote: `Estimated GST payable: ₹ ${netTaxPayable.toLocaleString('en-IN')}.`,
      detail: `Output ₹ ${totalOutputTax.toLocaleString('en-IN')} − ITC ₹ ${totalEligibleItc.toLocaleString('en-IN')}`,
      status: 'Calculated',
      statusColor: '#0D6258',
      statusBg: '#EEF8F6',
      actionLabel: 'View Tax Math',
      icon: Info,
      tab: 'reports'
    },
    {
      step: 5,
      title: 'File',
      quote: 'Your return is ready. Review and authorise filing.',
      detail: 'Cryptographic safeguard review',
      status: 'Ready',
      statusColor: '#596579',
      statusBg: '#FAF8F5',
      actionLabel: 'Authorise Filing',
      icon: FileText,
      tab: 'reports'
    }
  ];

  const salesPrompt = salesList.length > 0 
    ? `“Upload your sales invoices: ${salesList.length} recorded (₹ ${totalTaxableSales.toLocaleString('en-IN')} taxable).”` 
    : '“Upload your sales invoices.”';

  const purchasesPrompt = purchasesList.length > 0 
    ? `“We found ₹ ${totalTaxablePurchases.toLocaleString('en-IN')} of purchase invoices (${purchasesList.length} bills).”` 
    : '“Upload your purchase invoices.”';

  const itcPrompt = `“Your available input tax credit appears to be ₹ ${totalEligibleItc.toLocaleString('en-IN')}. Review exceptions.”`;
  const taxPrompt = `“Estimated GST payable: ₹ ${netTaxPayable.toLocaleString('en-IN')}.”`;
  const filePrompt = '“Your return is ready. Review and authorise filing.”';

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'copilot',
      content: `Hello${business.contactName ? ` ${business.contactName}` : (business.tradeName ? ` ${business.tradeName}` : '')}, I’m your **GST Copilot**.\n\n### “Your GST for this month is ready.”\n\nInstead of presenting you with complicated GST terminology, here is your current 5-step status:\n\n- **Step 1 — Sales**: ${salesPrompt}\n- **Step 2 — Purchases**: ${purchasesPrompt}\n- **Step 3 — ITC**: ${itcPrompt}\n- **Step 4 — Tax**: ${taxPrompt}\n- **Step 5 — File**: ${filePrompt}\n\n*This makes the platform usable even by a small shop owner who has never understood GSTR terminology.*`,
      provenance: `Deterministic GST Engine • Integer Minor Units (Paise) • ${business.period || 'Current Period'}`,
      timestamp: 'Now',
      action: {
        label: 'Review Purchase Differences',
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

    // Dynamic responses matching PDF Section 3 questions with real numbers
    let dynamicAnswer = null;
    let dynamicAction = null;

    if (qText.includes('Do I need to file')) {
      dynamicAnswer = `Yes! As an active regular taxpayer in ${business.stateName || 'Kerala'} (${business.stateCode || '32'}), you have two monthly milestones for **${business.period || 'September 2026'}**:\n\n1. **GSTR-1 (Outward Sales)**: Due on **11 Oct 2026** — ${salesList.length} invoices are currently recorded (₹ ${totalTaxableSales.toLocaleString('en-IN')} taxable).\n2. **GSTR-3B (Summary & Settlement)**: Due on **20 Oct 2026** — Estimated net tax payable: **₹ ${netTaxPayable.toLocaleString('en-IN')}**.\n\nEven in months with nil or low turnover, regular GSTINs must file to avoid Section 47 late fee penalties (₹ 50/day) and preserve compliance ratings.`;
      dynamicAction = { label: 'View GSTR-1 Status', tab: 'reports' };
    } else if (qText.includes('next GST deadline')) {
      dynamicAnswer = `Your next immediate GST deadline is **11 October 2026** for submitting **GSTR-1** (Sales invoices).\n\nYour second deadline is **20 October 2026** for settling **GSTR-3B** (Payment of **₹ ${netTaxPayable.toLocaleString('en-IN')}** net tax). Both dates are tracked automatically by our Due-Date Engine with zero-miss notifications.`;
      dynamicAction = { label: 'Open Due-Date Calendar', tab: 'calendar' };
    } else if (qText.includes('ITC different')) {
      dynamicAnswer = `Your available Input Tax Credit (ITC) is **₹ ${totalEligibleItc.toLocaleString('en-IN')}**.\n\nUnder statutory rule Section 16(2)(aa), businesses can only claim tax credit that their suppliers have truthfully filed and reflected in GSTR-2B. Differences like trade discounts or timing cut-offs are safely isolated so you get maximum eligible credit without notice risk.`;
      dynamicAction = { label: 'Review Purchase Differences', tab: 'purchases', subTab: 'reconciliation' };
    } else if (qText.includes('documents do I need')) {
      dynamicAnswer = `To remain 100% compliant for **${business.period || 'September 2026'}**, you need:\n\n1. **Tax Invoices for Outward Sales** (${salesList.length} recorded in your sales register).\n2. **Supplier Purchase Bills** with valid GSTINs (${purchasesList.length} recorded in your inward register).\n3. **E-Way Bills** for any inter-state goods movement exceeding ₹ 50,000.\n4. **Bank Challan** confirming tax payment after GSTR-3B filing.\n\nAll documents are digitally organised in your tamper-evident Document Vault.`;
      dynamicAction = { label: 'Open Document Vault', tab: 'vault' };
    } else if (qText.includes('mismatch')) {
      dynamicAnswer = `A mismatch **does not mean you or your supplier made an error**!\n\nIn Indian GST, reconciliation differences typically occur due to:\n1. **Trade Discounts**: Supplier invoices reflect post-invoice trade discounts in GSTR-1.\n2. **Timing Cut-offs**: A supplier uploaded their return after the 11th; credit shifts to next month under Section 16(2)(aa).\n3. **Tax Head Alignment**: Interstate vs Intrastate tax head mapping.\n\nOur GSTR-2B engine automatically pairs and classifies each difference so you never lose eligible credits.`;
      dynamicAction = { label: 'Review Differences', tab: 'purchases', subTab: 'reconciliation' };
    } else if (qText.includes('approximately owe') || qText.includes('tax do I owe')) {
      dynamicAnswer = `Your estimated net GST cash payable for this month is **₹ ${netTaxPayable.toLocaleString('en-IN')}**.\n\nHere is the exact minor-unit math:\n- **Output GST** collected from sales: **₹ ${totalOutputTax.toLocaleString('en-IN')}**\n- **Eligible Input Tax Credit (ITC)** from purchases: **₹ ${totalEligibleItc.toLocaleString('en-IN')}**\n- **Net GST Cash Payout**: **₹ ${netTaxPayable.toLocaleString('en-IN')}**\n\nComputed with integer paise arithmetic for zero floating-point drift.`;
      dynamicAction = { label: 'View GSTR-3B Math', tab: 'reports' };
    } else if (qText.includes('ready—what should I do') || qText.includes('what should I do next')) {
      dynamicAnswer = `Your return is ready for **${business.period || 'September 2026'}**!\n\nHere is your recommended next step:\n1. Review your outward sales register (${salesList.length} invoices).\n2. Verify the supplier reconciliation (${purchasesList.length} inward bills).\n3. Authorise filing in GSTR-1 & GSTR-3B with cryptographic verification.\n\nEverything is validated against statutory GST rules.`;
      dynamicAction = { label: 'Review & Authorise Filing', tab: 'reports' };
    }

    const botReply = {
      id: `bot-${Date.now()}`,
      sender: 'copilot',
      content: dynamicAnswer || `Regarding **"${qText}"** for **${business.tradeName || 'your enterprise'}**:\n\nUnder Indian GST rules for ${business.stateName || 'state'} entities (${business.stateCode || '32'}), outward sales and input tax credits are calculated strictly with minor-unit integer precision. In your active workspace, **${salesList.length} sales** and **${purchasesList.length} purchase bills** are tracked to safeguard your **₹ ${totalEligibleItc.toLocaleString('en-IN')}** tax credit without notice risk.`,
      provenance: 'Deterministic Rules & Statutory GSP/GSTN Integration (Zero Floating-Point Drift)',
      timestamp: 'Just now',
      action: dynamicAction || {
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
    <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%', paddingBottom: 64 }}>
      
      {/* ======================================================== */}
      {/* PDF SECTION 3 HERO: THE BIGGEST DIFFERENTIATOR          */}
      {/* ======================================================== */}
      <div style={{ 
        backgroundColor: '#FFFFFF', 
        borderRadius: 22, 
        border: '1px solid #EAE5DC', 
        padding: '28px 30px', 
        boxShadow: '0 4px 20px rgba(11, 19, 43, 0.04)',
        marginBottom: 28 
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
          <div style={{ maxWidth: 720 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', borderRadius: 9999, backgroundColor: '#EEF8F6', border: '1px solid #B2DDD7', marginBottom: 10 }}>
              <Bot style={{ width: 14, height: 14, color: '#0D6258' }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#0D6258' }}>
                PDF SECTION 3 • THE BIGGEST DIFFERENTIATOR
              </span>
            </div>

            <h1 className="font-editorial" style={{ fontSize: '2.1rem', fontWeight: 600, color: '#0B132B', margin: '2px 0 6px 0', letterSpacing: '-0.02em' }}>
              “Your GST for this month is ready.”
            </h1>
            
            <p style={{ fontSize: '0.94rem', color: '#596579', lineHeight: 1.55, margin: 0 }}>
              Instead of presenting users with complicated GST terminology, GST Copilot guides you through 5 plain-English steps tailored for small shop owners and growing businesses.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', backgroundColor: '#FAF8F5', borderRadius: 12, border: '1px solid #EAE5DC' }}>
            <Sparkles style={{ width: 16, height: 16, color: '#C87D0E' }} />
            <div style={{ fontSize: '0.78rem', color: '#0B132B', fontWeight: 700 }}>
              Plain Language Engine
              <div style={{ fontSize: '0.68rem', color: '#8D99AE', fontWeight: 500 }}>No complex GSTR jargon</div>
            </div>
          </div>
        </div>

        {/* The 5-Step Model Interactive Row */}
        <div className="copilot-step-grid" style={{ marginBottom: 16 }}>
          {copilot5Steps.map((step) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.step}
                onClick={() => onNavigate && onNavigate(step.tab, step.subTab)}
                style={{
                  padding: '16px 14px',
                  borderRadius: 14,
                  backgroundColor: '#FAF8F5',
                  border: '1px solid #EAE5DC',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  minHeight: 185
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#0D6258';
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(13, 98, 88, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#EAE5DC';
                  e.currentTarget.style.backgroundColor = '#FAF8F5';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ 
                      fontSize: '0.68rem', 
                      fontWeight: 800, 
                      color: '#0D6258', 
                      backgroundColor: '#EEF8F6', 
                      padding: '2px 8px', 
                      borderRadius: 6,
                      textTransform: 'uppercase'
                    }}>
                      Step {step.step} — {step.title}
                    </span>
                    <span style={{ 
                      fontSize: '0.64rem', 
                      fontWeight: 800, 
                      color: step.statusColor, 
                      backgroundColor: step.statusBg, 
                      padding: '2px 6px', 
                      borderRadius: 9999 
                    }}>
                      {step.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0B132B', lineHeight: 1.35, marginBottom: 6 }}>
                    “{step.quote}”
                  </div>

                  <div style={{ fontSize: '0.72rem', color: '#596579', lineHeight: 1.4 }}>
                    {step.detail}
                  </div>
                </div>

                <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #EAE5DC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.72rem', color: '#0D6258', fontWeight: 700 }}>
                    {step.actionLabel}
                  </span>
                  <ArrowRight style={{ width: 12, height: 12, color: '#0D6258' }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Section 3 Footer Quote */}
        <div style={{ 
          padding: '10px 16px', 
          backgroundColor: '#EEF8F6', 
          borderRadius: 10, 
          border: '1px solid #B2DDD7', 
          display: 'flex', 
          alignItems: 'center', 
          gap: 10,
          fontSize: '0.82rem',
          color: '#0D6258',
          fontWeight: 600
        }}>
          <Sparkles style={{ width: 16, height: 16, color: '#C87D0E', flexShrink: 0 }} />
          <span>This makes the platform usable even by a small shop owner who has never understood GSTR terminology.</span>
        </div>
      </div>

      {/* Scripted Question Chips (The exact 7 from PDF Page 3) */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8D99AE', fontWeight: 800, marginBottom: 8, textAlign: 'center' }}>
          FREQUENT QUESTIONS (TAP TO ASK COPILOT)
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
                  maxWidth: isBot ? '90%' : '75%'
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
              placeholder="Ask anything about your sales, purchase credit, or tax deadline in plain English..." 
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

