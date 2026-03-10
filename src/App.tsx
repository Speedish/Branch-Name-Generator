/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Copy, Check, Hash, Type, GitBranch, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [ticketNumber, setTicketNumber] = useState('');
  const [title, setTitle] = useState('');
  const [touchedTicket, setTouchedTicket] = useState(false);
  const [touchedTitle, setTouchedTitle] = useState(false);
  const [branchName, setBranchName] = useState('');
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('branch-gen-theme');
      return saved ? saved === 'dark' : false;
    }
    return false;
  });

  const isTicketValid = ticketNumber.trim().length > 0;
  const isTitleValid = title.trim().length > 0;
  const isFormValid = isTicketValid && isTitleValid;

  useEffect(() => {
    localStorage.setItem('branch-gen-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const generateBranchName = () => {
      if (!isFormValid) {
        setBranchName('');
        return;
      }

      // Clean ticket number: remove non-alphanumeric except hyphens
      const cleanTicket = ticketNumber.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
      
      // Clean title: replace spaces and special chars with hyphens, lowercase
      const cleanTitle = title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric with hyphen
        .replace(/-+/g, '-'); // Replace multiple hyphens with one

      let result = `${cleanTicket}-${cleanTitle}`;

      // Final pass to ensure no leading/trailing hyphens and single hyphens
      result = result.replace(/^-+|-+$/g, '').replace(/-+/g, '-');
      
      setBranchName(result);
    };

    generateBranchName();
  }, [ticketNumber, title, isFormValid]);

  const copyToClipboard = async () => {
    if (!branchName) return;
    try {
      await navigator.clipboard.writeText(branchName);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 font-sans transition-colors duration-300 ${
      darkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900'
    }`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-md rounded-3xl shadow-xl border p-8 transition-all duration-300 ${
          darkMode 
            ? 'bg-zinc-900 border-zinc-800 shadow-black/50' 
            : 'bg-white border-zinc-100 shadow-zinc-200/50'
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600 rounded-2xl">
              <GitBranch className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Branch Generator</h1>
              <p className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Create clean Git branch names</p>
            </div>
          </div>
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-xl transition-colors ${
              darkMode ? 'bg-zinc-800 hover:bg-zinc-700 text-yellow-400' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
            }`}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="ticket" className={`text-sm font-semibold flex items-center gap-2 ${
              darkMode ? 'text-zinc-300' : 'text-zinc-700'
            }`}>
              <Hash className="w-4 h-4" />
              Ticket Number
            </label>
            <input
              id="ticket"
              type="text"
              placeholder="e.g. 123"
              value={ticketNumber}
              onBlur={() => setTouchedTicket(true)}
              onChange={(e) => setTicketNumber(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                darkMode ? 'bg-zinc-800 text-zinc-100' : 'bg-zinc-50 text-zinc-900'
              } ${
                touchedTicket && !isTicketValid 
                  ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' 
                  : darkMode ? 'border-zinc-700 focus:ring-indigo-500/20 focus:border-indigo-500' : 'border-zinc-200 focus:ring-indigo-500/20 focus:border-indigo-500'
              }`}
            />
            <AnimatePresence>
              {touchedTicket && !isTicketValid && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-red-500 font-medium"
                >
                  Ticket number is required
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-2">
            <label htmlFor="title" className={`text-sm font-semibold flex items-center gap-2 ${
              darkMode ? 'text-zinc-300' : 'text-zinc-700'
            }`}>
              <Type className="w-4 h-4" />
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="e.g. Add user authentication"
              value={title}
              onBlur={() => setTouchedTitle(true)}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                darkMode ? 'bg-zinc-800 text-zinc-100' : 'bg-zinc-50 text-zinc-900'
              } ${
                touchedTitle && !isTitleValid 
                  ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' 
                  : darkMode ? 'border-zinc-700 focus:ring-indigo-500/20 focus:border-indigo-500' : 'border-zinc-200 focus:ring-indigo-500/20 focus:border-indigo-500'
              }`}
            />
            <AnimatePresence>
              {touchedTitle && !isTitleValid && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-red-500 font-medium"
                >
                  Title is required
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="pt-4">
            <label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${
              darkMode ? 'text-zinc-500' : 'text-zinc-400'
            }`}>
              Generated Branch Name
            </label>
            <div className="relative group">
              <div 
                className={`w-full min-h-[3.5rem] px-4 py-4 rounded-2xl font-mono text-sm break-all flex items-center pr-12 transition-all ${
                  darkMode ? 'bg-zinc-950 text-indigo-300' : 'bg-zinc-900 text-zinc-100'
                } ${!branchName ? 'opacity-50 italic' : ''}`}
              >
                {branchName || (isFormValid ? 'Generating...' : 'Fill all fields to generate')}
              </div>
              
              <AnimatePresence>
                {branchName && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={copyToClipboard}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className={`mt-8 pt-6 border-t ${darkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
          <p className={`text-[10px] uppercase tracking-[0.2em] text-center font-medium ${
            darkMode ? 'text-zinc-600' : 'text-zinc-400'
          }`}>
            Standardized • Clean • Fast
          </p>
        </div>
      </motion.div>
      
      <p className={`mt-6 text-xs ${darkMode ? 'text-zinc-600' : 'text-zinc-400'}`}>
        Built for developers who care about clean history.
      </p>
    </div>
  );
}
