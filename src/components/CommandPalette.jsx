'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ArrowRight, 
  FileText, 
  ShoppingCart, 
  Receipt, 
  GitCompare, 
  Bot, 
  Users, 
  FolderLock, 
  Calendar, 
  Sparkles,
  Command,
  Rocket,
  Gift,
  Store,
  CreditCard
} from 'lucide-react';

export default function CommandPalette({ isOpen, onClose, onNavigate, onAskCopilot }) {
  const [query, setQuery] = useState('');

  const commands = [
    { id: 'diffs', title: 'Review 3 Purchase Differences', category: 'Action', icon: GitCompare, tab: 'purchases', subTab: 'reconciliation' },
    { id: 'startup', title: 'Startup Express: Start My Business (PAN, MCA, GST)', category: 'Acquisition', icon: Rocket, tab: 'startup-express' },
    { id: 'sales-add', title: 'Invoice Data: Add a new Sale Invoice', category: 'Action', icon: Receipt, tab: 'sales', action: 'add-sale' },
    { id: 'import-csv', title: 'Import Sales / Purchases CSV Spreadsheet', category: 'Action', icon: FileText, tab: 'sales', action: 'import-csv' },
    { id: 'view-3b', title: 'Review GST Summary (GSTR-3B) for September', category: 'Reports', icon: FileText, tab: 'reports' },
    { id: 'referral', title: 'Referral Engine: Refer another business (Get ₹500 credit)', category: 'Growth', icon: Gift, tab: 'referral' },
    { id: 'kiosk', title: 'Kiosk Mode: Assisted GST services at physical locations', category: 'Channels', icon: Store, tab: 'kiosk' },
    { id: 'pricing', title: 'Pricing Strategy & MSME Compliance OS Roadmap', category: 'Platform', icon: CreditCard, tab: 'pricing' },
    { id: 'view-sales', title: 'My Sales (124 records, ₹ 8,42,000)', category: 'Navigation', icon: Receipt, tab: 'sales' },
    { id: 'view-purchases', title: 'GSTR-2B Purchases (86 records, ₹ 74,800 ITC)', category: 'Navigation', icon: ShoppingCart, tab: 'purchases' },
    { id: 'ask-q1', title: 'Ask Copilot: Do I need to file this month?', category: 'Assistant', icon: Bot, query: 'Do I need to file this month?' },
    { id: 'ask-q2', title: 'Ask Copilot: What is my next GST deadline?', category: 'Assistant', icon: Bot, query: 'What is my next GST deadline?' },
    { id: 'ask-q3', title: 'Ask Copilot: Why is my ITC different?', category: 'Assistant', icon: Bot, query: 'Why is my ITC different?' },
    { id: 'ask-q4', title: 'Ask Copilot: What documents do I need?', category: 'Assistant', icon: Bot, query: 'What documents do I need?' },
    { id: 'ask-q5', title: 'Ask Copilot: Why do I have this mismatch?', category: 'Assistant', icon: Bot, query: 'Why do I have this mismatch?' },
    { id: 'ask-q6', title: 'Ask Copilot: How much tax do I approximately owe?', category: 'Assistant', icon: Bot, query: 'How much tax do I approximately owe?' },
    { id: 'ask-q7', title: 'Ask Copilot: My return is ready—what should I do next?', category: 'Assistant', icon: Bot, query: 'My return is ready—what should I do next?' },
    { id: 'ca-support', title: 'CA Connect: Request advisor verification', category: 'Support', icon: Users, tab: 'ca-support' },
    { id: 'vault-upload', title: 'Document Vault: Store Certificate or Return Challan', category: 'Storage', icon: FolderLock, tab: 'vault' },
    { id: 'calendar', title: 'Due-Date Engine: View filing deadlines & reminder channels', category: 'Compliance', icon: Calendar, tab: 'calendar' },
  ];

  const filtered = query.trim() === ''
    ? commands
    : commands.filter(c => c.title.toLowerCase().includes(query.toLowerCase()) || c.category.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(false);
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="cmd-palette-overlay" onClick={onClose}>
      <div className="cmd-palette-box" onClick={(e) => e.stopPropagation()}>
        {/* Search Input Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid #EAE5DC' }}>
          <Search style={{ width: 18, height: 18, color: '#0D6258' }} />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a module, question, or search screen..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              color: '#0B132B',
              backgroundColor: 'transparent'
            }}
          />
          <span style={{ fontSize: '0.72rem', color: '#8D99AE', backgroundColor: '#FAF8F5', border: '1px solid #EAE5DC', padding: '2px 6px', borderRadius: 6, fontWeight: 700 }}>
            ESC to close
          </span>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: 380, overflowY: 'auto', padding: 8 }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: '#8D99AE', fontSize: '0.88rem' }}>
              No matches found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.query) {
                      onAskCopilot(item.query);
                    } else {
                      onNavigate(item.tab, item.subTab, item.action);
                    }
                    onClose();
                  }}
                  className="cmd-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 10,
                    cursor: 'pointer',
                    transition: 'all 0.12s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ 
                      width: 28, 
                      height: 28, 
                      borderRadius: 8, 
                      backgroundColor: '#FAF8F5', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: '#0D6258' 
                    }}>
                      <Icon style={{ width: 15, height: 15 }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0B132B' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#8D99AE' }}>
                        {item.category}
                      </div>
                    </div>
                  </div>
                  <ArrowRight style={{ width: 14, height: 14, color: '#DCD5C9' }} />
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div style={{ 
          padding: '10px 20px', 
          backgroundColor: '#FAF8F5', 
          borderTop: '1px solid #EAE5DC', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          fontSize: '0.72rem',
          color: '#8D99AE'
        }}>
          <span>TaxMate • Smart GST Compliance Companion</span>
          <span>Press ↵ to select</span>
        </div>
      </div>
    </div>
  );
}
