# 🚀 XPFinance Dashboard - Setup & Integration Guide

Complete step-by-step guide to integrate the premium redesigned dashboard into your Next.js project.

---

## Prerequisites

- Node.js 16+ or newer
- npm or yarn
- Existing Next.js 13+ project
- TypeScript enabled in your project
- Tailwind CSS configured (v3+)

---

## Installation Steps

### Step 1: Install Dependencies

```bash
npm install framer-motion lucide-react
# or
yarn add framer-motion lucide-react
```

**What these packages do:**
- **framer-motion**: Animation and motion library
- **lucide-react**: Beautiful, consistent icon set

### Step 2: Copy Component Files

Copy the entire `components/dashboard/` directory to your project:

```
src/
├── components/
│   └── dashboard/
│       ├── DashboardLayout.tsx
│       ├── Sidebar.tsx
│       ├── Header.tsx
│       ├── MetricCards.tsx
│       ├── Sparkline.tsx
│       ├── QuickAddTiles.tsx
│       ├── TransactionFilterBar.tsx
│       ├── EmptyState.tsx
│       ├── ProTipsBanner.tsx
│       ├── AICoachWidget.tsx
│       └── index.ts
```

### Step 3: Copy Hooks

Copy `hooks/useIsMobile.ts` to your project:

```
src/
└── hooks/
    └── useIsMobile.ts
```

### Step 4: Add Global Styles

Copy `styles/globals.css` to your project and import it in your `_app.tsx`:

```typescript
// pages/_app.tsx
import '@/styles/globals.css'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
```

### Step 5: Ensure Tailwind Configuration

Make sure your `tailwind.config.js` has:

```javascript
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  darkMode: 'class', // Enable dark mode
  plugins: [],
}
```

### Step 6: Update Path Aliases (Optional)

Ensure your `tsconfig.json` has proper path aliases:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## Basic Implementation

### Option 1: Full Dashboard Layout (Recommended)

Use the complete `DashboardLayout` wrapper:

```typescript
// pages/dashboard.tsx
import { DashboardLayout, MetricCards } from '@/components/dashboard';
import { TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const metrics = [
    {
      label: 'Total Income',
      value: 25000,
      trend: 'up' as const,
      trendValue: '+8%',
      icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
      color: 'emerald' as const,
      data: [100, 150, 200, 250, 300, 350, 400],
    },
    // ... more metrics
  ];

  return (
    <DashboardLayout>
      <MetricCards metrics={metrics} />
    </DashboardLayout>
  );
}
```

### Option 2: Custom Layout

Use individual components without the full layout:

```typescript
import { MetricCards, QuickAddTiles } from '@/components/dashboard';

export default function CustomPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <MetricCards metrics={metrics} />
      <QuickAddTiles tiles={tiles} onTileClick={handleTileClick} />
    </div>
  );
}
```

---

## Component Integration Examples

### MetricCards with Real Data

```typescript
import { MetricCards } from '@/components/dashboard';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useQuery } from 'react-query';

export default function Dashboard() {
  const { data: financials } = useQuery('financials', fetchFinancials);

  const metrics = [
    {
      label: 'Total Income',
      value: financials?.income || 0,
      trend: financials?.incomeTrend > 0 ? 'up' : 'down',
      trendValue: `${financials?.incomeTrend || 0}%`,
      icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
      color: 'emerald' as const,
      data: financials?.incomeHistory || [],
    },
    // ... more metrics
  ];

  return <MetricCards metrics={metrics} />;
}
```

### QuickAddTiles with Click Handler

```typescript
import { QuickAddTiles } from '@/components/dashboard';
import { useRouter } from 'next/router';

export default function Transactions() {
  const router = useRouter();

  const tiles = [
    {
      id: 'uber',
      label: 'Uber to Campus',
      amount: 'R35',
      icon: Car,
      color: 'purple' as const,
    },
    // ... more tiles
  ];

  const handleQuickAdd = (tile) => {
    // Option 1: Open modal
    // openModal('add-transaction', { category: tile.label, amount: tile.amount })

    // Option 2: Navigate
    // router.push(`/transactions/add?type=${tile.id}`)

    // Option 3: Direct API call
    // addTransaction({ type: tile.id, amount: parseFloat(tile.amount) })
  };

  return <QuickAddTiles tiles={tiles} onTileClick={handleQuickAdd} />;
}
```

### TransactionFilterBar with State Management

```typescript
import { TransactionFilterBar } from '@/components/dashboard';
import { useState } from 'react';

export default function Transactions() {
  const [filters, setFilters] = useState({
    category: 'all',
    searchQuery: '',
    sortBy: 'date',
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    // Fetch filtered transactions
    fetchTransactions(filters);
  };

  return (
    <TransactionFilterBar
      categories={categories}
      selectedCategory={filters.category}
      onCategoryChange={(cat) => handleFilterChange('category', cat)}
      onSearchChange={(query) => handleFilterChange('searchQuery', query)}
      onSortChange={(sort) => handleFilterChange('sortBy', sort)}
    />
  );
}
```

### AICoachWidget with Custom Message Handler

```typescript
import { AICoachWidget } from '@/components/dashboard';

export default function Dashboard() {
  const handleCoachMessage = async (message: string) => {
    // Send to your AI/chatbot API
    const response = await fetch('/api/ai-coach', {
      method: 'POST',
      body: JSON.stringify({ message, userId: currentUser.id }),
    });

    return response.json();
  };

  return <AICoachWidget onMessage={handleCoachMessage} />;
}
```

---

## Styling Customization

### Change Primary Color Scheme

Replace `purple` and `blue` globally:

```bash
# Find and replace in all components
# Before: from-purple-500 to-blue-500
# After: from-indigo-500 to-violet-500
```

Or update in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#a855f7', // purple-500
          dark: '#3b82f6',  // blue-500
        },
      },
    },
  },
}
```

### Adjust Background Darkness

For lighter backgrounds:

```typescript
// In component className
bg-gradient-to-br from-slate-800 to-slate-900 // Lighter
// vs
bg-gradient-to-br from-slate-950 to-slate-950 // Original (darker)
```

### Change Border Opacity

```typescript
// Subtle borders
border-white/[0.05]

// Prominent borders
border-white/[0.12]
```

### Modify Animation Speed

Global animation duration:

```typescript
// In each component transition prop
transition={{ duration: 0.8 }} // Slower
// vs
transition={{ duration: 0.3 }} // Faster
```

---

## Integration with Your Backend

### Example: Fetching Real Metrics

```typescript
import { DashboardLayout, MetricCards } from '@/components/dashboard';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/metrics');
        const data = await response.json();
        
        setMetrics([
          {
            label: 'Total Income',
            value: data.totalIncome,
            trend: data.incomeTrend > 0 ? 'up' : 'down',
            trendValue: `${data.incomeTrend}%`,
            icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
            color: 'emerald' as const,
            data: data.incomeHistory,
          },
          // ... more metrics
        ]);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <DashboardLayout>
      <MetricCards metrics={metrics} />
    </DashboardLayout>
  );
}
```

### Example: Adding Transactions

```typescript
import { QuickAddTiles } from '@/components/dashboard';

export default function TransactionsPage() {
  const handleQuickAdd = async (tile) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: tile.label,
          amount: parseFloat(tile.amount),
          category: categorizeByLabel(tile.label),
        }),
      });

      if (response.ok) {
        // Show success toast
        showToast('Transaction added successfully!');
        // Refresh transactions
        refetchTransactions();
      }
    } catch (error) {
      console.error('Failed to add transaction:', error);
      showToast('Failed to add transaction', 'error');
    }
  };

  return <QuickAddTiles tiles={tiles} onTileClick={handleQuickAdd} />;
}
```

---

## Testing Components

### Unit Tests (Jest + React Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import { MetricCards } from '@/components/dashboard';

describe('MetricCards', () => {
  it('renders metric values correctly', () => {
    const metrics = [
      {
        label: 'Total Income',
        value: 1000,
        trend: 'up' as const,
        trendValue: '+10%',
        icon: null,
        color: 'emerald' as const,
        data: [1, 2, 3],
      },
    ];

    render(<MetricCards metrics={metrics} />);
    expect(screen.getByText('Total Income')).toBeInTheDocument();
    expect(screen.getByText('R1,000.00')).toBeInTheDocument();
  });
});
```

### Visual Testing

1. Use Chromatic or Percy for visual regression testing
2. Test on multiple screen sizes (mobile, tablet, desktop)
3. Test in both dark mode and light mode (if implemented)

---

## Performance Optimization

### Code Splitting

```typescript
import dynamic from 'next/dynamic';

const AICoachWidget = dynamic(() => import('@/components/dashboard/AICoachWidget'), {
  loading: () => <div>Loading...</div>,
  ssr: false, // Don't server-side render for chat widget
});
```

### Image Optimization

For any images in components:

```typescript
import Image from 'next/image';

<Image src="/icon.svg" alt="Icon" width={24} height={24} />
```

### Memo Components

```typescript
import { memo } from 'react';

export const MetricCard = memo(function MetricCard({ metric }) {
  return (
    // Component render
  );
});
```

---

## Responsive Design Testing

### Tailwind Breakpoints

```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

Test at:
- Mobile: 375px (iPhone SE)
- Tablet: 768px (iPad)
- Desktop: 1920px (HD)

### Mobile-First Approach

All styles apply to mobile by default:

```tsx
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
  {/* 2 cols on mobile, 3 on tablet, 6 on desktop */}
</div>
```

---

## Accessibility Checklist

- [ ] All interactive elements are keyboard accessible
- [ ] Color contrast meets WCAG AA standard
- [ ] Focus states are clearly visible
- [ ] Icons have `aria-label` attributes
- [ ] Forms have associated labels
- [ ] Images have alt text
- [ ] Motion respects `prefers-reduced-motion`
- [ ] Semantic HTML structure used

---

## Deployment Checklist

- [ ] All dependencies installed (`npm install`)
- [ ] Build passes without errors (`npm run build`)
- [ ] No console errors or warnings
- [ ] Tested on target browsers and devices
- [ ] Images optimized (using Next.js Image component)
- [ ] API endpoints verified and working
- [ ] Environment variables configured
- [ ] Analytics/tracking configured
- [ ] Error boundaries implemented
- [ ] Loading states handled

---

## Troubleshooting

### Issue: Animations not working

**Solution**: Ensure Framer Motion is installed:
```bash
npm install framer-motion
```

### Issue: Icons not displaying

**Solution**: Ensure lucide-react is installed:
```bash
npm install lucide-react
```

### Issue: Tailwind styles not applying

**Solution**: Check:
1. CSS file is imported in `_app.tsx`
2. `tailwind.config.js` includes component paths
3. Build cache is cleared (`npm run build --reset`)

### Issue: Sidebar not responsive

**Solution**: Ensure `useIsMobile` hook is imported:
```typescript
import { useIsMobile } from '@/hooks/useIsMobile';
```

### Issue: Dark mode not working

**Solution**: Verify Tailwind `darkMode: 'class'` in config:
```javascript
// tailwind.config.js
darkMode: 'class',
```

---

## Next Steps

1. **Customize Colors**: Update color variables in components
2. **Connect Data**: Integrate with your backend API
3. **Add Modals**: Implement Add/Edit transaction dialogs
4. **Testing**: Write unit and integration tests
5. **Monitoring**: Set up error tracking and analytics
6. **Documentation**: Document any custom modifications

---

## Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Lucide React Icons](https://lucide.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Next.js Documentation](https://nextjs.org/docs)

---

## Support

For questions or issues:
1. Check `DASHBOARD_DESIGN_SYSTEM.md` for detailed documentation
2. Review component prop interfaces
3. Test in isolation using `component-showcase.tsx`
4. Check browser console for errors
5. Contact the development team

---

**Last Updated**: 2026-06-10
**Version**: 1.0.0
