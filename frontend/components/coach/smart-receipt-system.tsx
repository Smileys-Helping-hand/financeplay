'use client';

import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { X, Check, AlertCircle, Calendar, MapPin, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../lib/api';
import { useFinanceStore } from '../../lib/store';

export interface SmartReceipt {
  id: string;
  placeName: string;
  amount: number;
  category: string;
  date: string;
  estimatedTime?: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'recorded';
  userMessage: string;
}

interface SmartReceiptSystemProps {
  userMessage: string;
  onClose: () => void;
  onCreateReceipt: (receipt: SmartReceipt) => void;
}

export function SmartReceiptSystem({ userMessage, onClose, onCreateReceipt }: SmartReceiptSystemProps) {
  const [step, setStep] = useState<'parse' | 'review' | 'confirm'>('parse');
  const [receipt, setReceipt] = useState<SmartReceipt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const addTransaction = useFinanceStore((s) => s.addTransaction);

  // Parse user message to extract spending intent
  const parseSpendingIntent = async () => {
    setLoading(true);
    try {
      // AI-powered parsing of spending intent
      const parsed = extractSpendingData(userMessage);

      if (!parsed.placeName || !parsed.amount) {
        setError('I couldn\'t detect a place name and amount. Please include both.');
        setLoading(false);
        return;
      }

      const newReceipt: SmartReceipt = {
        id: Math.random().toString(36).slice(2),
        placeName: parsed.placeName,
        amount: parsed.amount,
        category: parsed.category,
        date: new Date().toISOString().split('T')[0],
        estimatedTime: parsed.time,
        notes: userMessage,
        status: 'pending',
        userMessage
      };

      setReceipt(newReceipt);
      setStep('review');
    } catch (err) {
      setError('Failed to parse spending. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Extract spending data from message
  function extractSpendingData(message: string) {
    const lowerMsg = message.toLowerCase();

    // Extract amount (supports various formats: $700, 700, 700.00)
    const amountMatch = message.match(/\$?([\d,]+(?:\.\d{2})?)/);
    const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 0;

    // Extract place name (common patterns)
    const placePatterns = [
      /(?:to|at|going to|visit|shop at)\s+([A-Z][^,\n.]*(?:shop|store|restaurant|cafe|bar|mall|market|outlet|clinic|salon|gym|theater|cinema))/i,
      /(?:to|at|going to|visit|shop at)\s+([A-Z][^,\n.]{2,30})/i,
    ];

    let placeName = '';
    for (const pattern of placePatterns) {
      const match = message.match(pattern);
      if (match) {
        placeName = match[1].trim().replace(/\s+and\s+.*/, '');
        break;
      }
    }

    // Extract category based on keywords
    const categoryMap: Record<string, string[]> = {
      coffee: ['coffee', 'cafe', 'starbucks', 'barista'],
      food: ['lunch', 'dinner', 'breakfast', 'eat', 'restaurant', 'pizza', 'burger'],
      shopping: ['shop', 'shopping', 'buy', 'purchase', 'store', 'mall', 'outlet'],
      entertainment: ['movie', 'cinema', 'theater', 'concert', 'game', 'play'],
      transport: ['uber', 'taxi', 'lyft', 'ride', 'gas', 'fuel', 'parking'],
      utilities: ['electric', 'water', 'wifi', 'internet', 'phone'],
      other: []
    };

    let category = 'other';
    for (const [cat, keywords] of Object.entries(categoryMap)) {
      if (keywords.some(kw => lowerMsg.includes(kw))) {
        category = cat;
        break;
      }
    }

    // Extract time if mentioned
    const timeMatch = message.match(/(?:tonight|tomorrow|later|at\s+(\d{1,2}):?(\d{2})?\s*(?:am|pm)?)/i);
    const time = timeMatch ? timeMatch[0] : 'later today';

    return { placeName, amount, category, time };
  }

  // Record receipt as transaction
  const recordTransaction = async () => {
    if (!receipt) return;

    setLoading(true);
    try {
      await api.post('/data/transactions', {
        amount: -receipt.amount, // Negative for expense
        category: receipt.category,
        description: `${receipt.placeName} (${receipt.notes})`,
        date: new Date(receipt.date).toISOString(),
        accountId: null
      });

      const updatedReceipt = { ...receipt, status: 'recorded' as const };
      setReceipt(updatedReceipt);
      setStep('confirm');

      // Update store
      addTransaction({
        id: receipt.id,
        amount: -receipt.amount,
        category: receipt.category,
        description: `${receipt.placeName}`,
        date: receipt.date,
        accountId: null,
        userId: 'default-user'
      });

      onCreateReceipt(updatedReceipt);
    } catch (err) {
      setError('Failed to record transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update receipt field
  const updateReceipt = (field: keyof SmartReceipt, value: any) => {
    if (receipt) {
      setReceipt({ ...receipt, [field]: value });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <Card className="max-w-md w-full p-6 relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-200"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Parse Step */}
          {step === 'parse' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold mb-2">Smart Receipt Creator</h2>
                <p className="text-sm text-zinc-400">Processing your spending...</p>
              </div>

              {!receipt && (
                <Button
                  onClick={parseSpendingIntent}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Analyzing...' : 'Create Receipt from Message'}
                </Button>
              )}

              {error && (
                <div className="flex gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-100 text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}
            </div>
          )}

          {/* Review Step */}
          {step === 'review' && receipt && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Review Receipt</h2>

              {/* Place */}
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Place Name</label>
                <div className="flex gap-2 items-center">
                  <MapPin className="h-4 w-4 text-primary" />
                  <input
                    type="text"
                    value={receipt.placeName}
                    onChange={(e) => updateReceipt('placeName', e.target.value)}
                    className="flex-1 px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Amount</label>
                <div className="flex gap-2 items-center">
                  <DollarSign className="h-4 w-4 text-neon-green" />
                  <input
                    type="number"
                    value={receipt.amount}
                    onChange={(e) => updateReceipt('amount', parseFloat(e.target.value))}
                    className="flex-1 px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Date</label>
                <div className="flex gap-2 items-center">
                  <Calendar className="h-4 w-4 text-neon-blue" />
                  <input
                    type="date"
                    value={receipt.date}
                    onChange={(e) => updateReceipt('date', e.target.value)}
                    className="flex-1 px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Category</label>
                <select
                  value={receipt.category}
                  onChange={(e) => updateReceipt('category', e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm"
                >
                  <option value="food">Food & Dining</option>
                  <option value="coffee">Coffee & Treats</option>
                  <option value="shopping">Shopping</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="transport">Transport</option>
                  <option value="utilities">Utilities</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Notes</label>
                <input
                  type="text"
                  value={receipt.notes}
                  onChange={(e) => updateReceipt('notes', e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm"
                  placeholder="What was this purchase for?"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setStep('parse')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={recordTransaction}
                  disabled={loading || !receipt.placeName || !receipt.amount}
                  className="flex-1"
                >
                  {loading ? 'Recording...' : 'Record Spend'}
                </Button>
              </div>
            </div>
          )}

          {/* Confirmation Step */}
          {step === 'confirm' && receipt && (
            <div className="space-y-4 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-500/20 rounded-full">
                  <Check className="h-6 w-6 text-green-400" />
                </div>
              </div>

              <h2 className="text-xl font-bold">Spend Recorded!</h2>

              <div className="bg-zinc-800/50 rounded-lg p-4 space-y-2 text-left">
                <p className="text-sm text-zinc-300">
                  <strong>{receipt.placeName}</strong>
                </p>
                <p className="text-2xl font-bold text-neon-red">
                  -R{receipt.amount.toFixed(2)}
                </p>
                <p className="text-xs text-zinc-500">
                  {receipt.category} • {receipt.date}
                </p>
              </div>

              <p className="text-sm text-zinc-400">
                This transaction has been recorded in your account. You can view it in your transaction history.
              </p>

              <Button onClick={onClose} className="w-full">
                Done
              </Button>
            </div>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
