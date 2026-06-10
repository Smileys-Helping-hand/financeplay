import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Filter } from 'lucide-react';

interface Category {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TransactionFilterBarProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  onSearchChange: (query: string) => void;
  onSortChange: (sort: string) => void;
}

export default function TransactionFilterBar({
  categories,
  selectedCategory,
  onCategoryChange,
  onSearchChange,
  onSortChange,
}: TransactionFilterBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedSort, setSelectedSort] = useState('Date');

  const types = ['All Types', 'Income', 'Expense', 'Transfer'];
  const sortOptions = ['Date', 'Amount (High)', 'Amount (Low)', 'Category'];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearchChange(e.target.value);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setIsTypeOpen(false);
  };

  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
    setIsSortOpen(false);
    onSortChange(sort);
  };

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Search and Dropdowns */}
      <div className="flex flex-col gap-4 mb-6">
        {/* Search Bar */}
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-3 bg-gradient-to-r from-slate-900/40 to-slate-950/40 border border-white/[0.08] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
          />
        </motion.div>

        {/* Dropdowns Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
          {/* Type Dropdown */}
          <motion.div className="relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
            <button
              onClick={() => setIsTypeOpen(!isTypeOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-900/40 to-slate-950/40 border border-white/[0.08] rounded-lg text-slate-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            >
              <span className="text-sm font-medium">{selectedType}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isTypeOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isTypeOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/[0.08] rounded-lg overflow-hidden shadow-xl backdrop-blur-xl z-50"
                >
                  {types.map((type) => (
                    <motion.button
                      key={type}
                      onClick={() => handleTypeChange(type)}
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                      className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                        selectedType === type
                          ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {type}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Sort Dropdown */}
          <motion.div className="relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-900/40 to-slate-950/40 border border-white/[0.08] rounded-lg text-slate-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            >
              <span className="text-sm font-medium">Sort by {selectedSort}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isSortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/[0.08] rounded-lg overflow-hidden shadow-xl backdrop-blur-xl z-50"
                >
                  {sortOptions.map((sort) => (
                    <motion.button
                      key={sort}
                      onClick={() => handleSortChange(sort)}
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                      className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                        selectedSort === sort
                          ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {sort}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Category Pills */}
      <motion.div
        className="flex flex-wrap gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
      >
        {categories.map((category, index) => {
          const isSelected = selectedCategory === category.id;

          return (
            <motion.button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 + 0.25 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                isSelected
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                  : 'bg-white/[0.05] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {category.label}
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
