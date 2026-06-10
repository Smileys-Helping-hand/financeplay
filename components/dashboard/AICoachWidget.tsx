import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

interface AICoachWidgetProps {
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
}

export default function AICoachWidget({ isOpen: initialOpen = false, onToggle }: AICoachWidgetProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: 'Hi! I\'m your AI Finance Coach. Ask me anything about optimizing your finances, understanding your spending patterns, or achieving your financial goals.',
    },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleToggle = (open: boolean) => {
    setIsOpen(open);
    onToggle?.(open);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const newMessages = [
      ...messages,
      { role: 'user' as const, content: inputValue },
    ];
    setMessages(newMessages);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I\'m analyzing your question. In a real implementation, this would connect to an AI service for intelligent financial insights.',
        },
      ]);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 w-96 bg-gradient-to-br from-slate-900/95 to-slate-950/95 border border-white/[0.08] rounded-2xl backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col"
            style={{ height: '600px' }}
          >
            {/* Header */}
            <div className="border-b border-white/[0.08] px-6 py-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">AI Coach</h3>
                    <p className="text-xs text-slate-400">Smart nudges + challenges</p>
                  </div>
                </div>
                <motion.button
                  onClick={() => handleToggle(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-white/[0.08] rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </motion.button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-hide">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                        : 'bg-white/[0.05] border border-white/[0.08] text-slate-300'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <div className="border-t border-white/[0.08] px-6 py-4 bg-gradient-to-t from-slate-950/50 to-slate-950/0">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Ask anything..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-4 py-2 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm"
                />
                <motion.button
                  onClick={handleSendMessage}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={() => handleToggle(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center group overflow-hidden"
      >
        {/* Breathing pulse animation */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 opacity-0"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Icon */}
        <motion.div
          animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
          transition={{ type: 'spring', damping: 10 }}
          className="relative z-10"
        >
          {isOpen ? (
            <MessageCircle className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </motion.div>

        {/* Badge when closed and unread */}
        {!isOpen && (
          <motion.div
            className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>
    </div>
  );
}
