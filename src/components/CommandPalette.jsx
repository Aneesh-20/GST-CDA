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
  Command
} from 'lucide-react';

export default function CommandPalette({ isOpen, onClose, onNavigate, onAskCopilot }) {
  const [query, setQuery] = useState('');

  const commands = [
    { id: 'diffs', title: 'Review 3 Purchase Differences', category: 'Action', icon: GitCompare, tab: 'purchases', subTab: 'reconciliation' },
    { id: 'sales-add', title: 'Add a new Sale Invoice', category: 'Action', icon: Receipt, tab: 'sales', action: 'add-sale' },
    { id: 'import-csv', title: 'Import Sales / Purchases CSV Spreadsheet', category: 'Action', icon: FileText, tab: 'sales', action: 'import-csv' },
    { id: 'view-3b', title: 'Review GST Summary (GSTR-3B) for September', category: 'Reports', icon: FileText, tab: 'reports' },
    { id: 'view-sales', title: 'My Sales (124 records)', category: 'Navigation', icon: Receipt, tab: 'sales' },
    { id: 'view-purchases', title: 'My Purchases (86 records)', category: 'Navigation', icon: ShoppingCart, tab: 'purchases' },
    { id: 'ask-3b', title: 'Ask Copilot: What is GSTR-3B?', category: 'Assistant', icon: Bot, query: 'What is GSTR-3B?' },
    { id: 'ask-diffs', title: 'Ask Copilot: Why do I have differences?', category: 'Assistant', icon: Bot, query: 'Why do I have differences?' },
    { id: 'ca-support', title: 'CA Support: Request advisor review', category: 'Support', icon: Users, tab: 'ca-support' },
    { id: 'vault-upload', title: 'Documents: Upload Invoice or Certificate', category: 'Storage', icon: FolderLock, tab: 'vault' },
    { id: 'calendar', title: 'Calendar: View filing timelines', category: 'Compliance', icon: Calendar, tab: 'calendar' },
  ];

  const filtered = query.trim() === ''
    ? commands
    : commands.filter(c => c.title.toLowerCase().includes(query.toLowerCase()) || c.category.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(false); // toggle trigger handled in parent
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
            placeholder="Type a command, question, or search screen..."
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
        <div style={{ maxHeight: 360, overflowY: 'auto', padding: 8 }}>
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
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 10,
                    cursor: 'pointer',
                    transition: 'all 0.1s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAF8F5'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: '#EEF8F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0D6258' }}>
                      <Icon style={{ width: 16, height: 16 }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0B132B' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#8D99AE' }}>
                        {item.category}
                      </div>
                    </div>
                  </div>
                  <ArrowRight style={{ width: 14, height: 14, color: '#8D99AE' }} />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div style={{ padding: '10px 20px', backgroundColor: '#FAF8F5', borderTop: '1px solid #EAE5DC', display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#8D99AE' }}>
          <span>Navigation • Actions • Natural Language Q&A</span>
          <span>GST CDA Concierge</span>
        </div>
      </div>
    </div>
  );
}
