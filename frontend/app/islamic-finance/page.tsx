"use client";
import React, { useState, useMemo } from "react";
import { useFinanceStore } from "../../lib/store";
import { askCoach } from "../../lib/api";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Progress } from "../../components/ui/progress";

import {
  Star, BookOpen, TrendingUp, Shield, Heart, ChevronDown, ChevronUp,
  Lightbulb, Globe, AlertCircle, CheckCircle2, Calculator, BookMarked
} from "lucide-react";

// â”€â”€â”€ Static Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const faqs = [
  {
    q: "What is Riba and why is it prohibited?",
    a: "Riba refers to any unjustified excess â€” typically interest. In Islamic finance, money cannot grow by itself; profit must come from real trade, service, or productive investment. Riba creates wealth inequality and encourages debt dependency."
  },
  {
    q: "I already have a conventional interest-bearing loan. What now?",
    a: "Scholars agree you should honour the contract and pay it off as quickly as possible. Make sincere tawbah (repentance), prioritise paying it off, and avoid new interest-based loans going forward. Use the Loan Tracker to manage payoff."
  },
  {
    q: "How does Islamic home finance work in South Africa?",
    a: "Absa, FNB, and Al Baraka Bank offer Diminishing Musharakah home finance. Instead of lending you money with interest, the bank co-buys the property with you. You pay rent on the bank's share and gradually buy them out. No interest is charged â€” you're buying equity."
  },
  {
    q: "What is Zakat and how does it relate to finance?",
    a: "Zakat is obligatory charity â€” 2.5% of wealth held for a full lunar year above the nisab threshold. It purifies wealth and is one of the five pillars of Islam. It is calculated on cash, gold/silver, business stock, and certain investments."
  },
  {
    q: "What is Takaful (Islamic insurance)?",
    a: "Takaful is cooperative insurance where participants contribute to a shared pool. Claims are paid from this pool. It avoids three prohibited elements: excessive uncertainty (gharar), gambling (maysir), and interest (riba). Look for Takaful options for vehicle, home, and life cover."
  },
  {
    q: "Can I invest in the JSE / stock market?",
    a: "Yes, with Sharia screening. Avoid companies in alcohol, gambling, pork, weapons, tobacco, adult content, and conventional interest-bearing finance. Also check: debt/market cap < 33%, interest income < 5% of total revenue."
  },
  {
    q: "What is Murabaha (cost-plus financing)?",
    a: "A bank buys the item you need and immediately sells it to you at a pre-agreed markup, payable in installments. There is no interest â€” the bank's profit is the markup. Used for vehicles, equipment, and goods."
  },
  {
    q: "What is Qard Hassan (interest-free loan)?",
    a: "A benevolent loan with no interest or profit â€” you repay only what you borrowed. Common between family/friends or through Islamic microfinance. This is the most encouraged form of lending in Islam."
  }
];

const halalInvestments = [
  {
    name: "Wahed Invest",
    type: "Robo-advisor",
    description: "Fully Sharia-compliant robo-advisor. Invest from R100/month. Portfolios include sukuk, gold, and ethical equities.",
    risk: "Lowâ€“High (choose your level)",
    available: "South Africa âœ“",
    website: "wahedinvest.com"
  },
  {
    name: "iShares MSCI World Islamic ETF",
    type: "ETF",
    description: "Tracks global equities with Sharia screening. Available on JSE. Diversified across tech, health, and consumer sectors.",
    risk: "Moderate",
    available: "JSE âœ“",
    website: "blackrock.com"
  },
  {
    name: "Satrix Sharia ETF",
    type: "ETF",
    description: "South African Sharia-screened JSE-listed ETF. Check Satrix.co.za for latest availability.",
    risk: "Moderate",
    available: "JSE (check availability)",
    website: "satrix.co.za"
  },
  {
    name: "Al Baraka Bank â€” Mudarabah Savings",
    type: "Savings Account",
    description: "Profit-sharing savings account. No fixed interest â€” profit is shared from the bank's investments.",
    risk: "Low",
    available: "South Africa âœ“",
    website: "albaraka.co.za"
  },
  {
    name: "FNB Islamic Banking",
    type: "Banking & Finance",
    description: "Sharia-compliant transactional banking, vehicle finance (Murabaha), and home finance (Diminishing Musharakah).",
    risk: "N/A",
    available: "South Africa âœ“",
    website: "fnb.co.za/islamic-banking"
  },
  {
    name: "Global Sukuk Fund",
    type: "Sukuk",
    description: "Sukuk are asset-backed certificates â€” like bonds but ownership-based. Lower risk, regular returns.",
    risk: "Lower",
    available: "Via international broker",
    website: "amundi.com"
  },
  {
    name: "Stanlib Shari'ah Fund",
    type: "Unit Trust",
    description: "SA-based Sharia-compliant unit trust. Screened equities and sukuk.",
    risk: "Moderate",
    available: "South Africa âœ“",
    website: "stanlib.com"
  }
];

const islamicFinancePrinciples = [
  { icon: Shield, title: "No Riba (Interest)", desc: "Wealth must grow through real trade and effort. Seek profit-sharing arrangements instead of interest-bearing accounts." },
  { icon: Globe, title: "No Gharar (Uncertainty)", desc: "Avoid highly speculative instruments â€” options, CFDs, and heavily leveraged products are generally not permitted." },
  { icon: Heart, title: "No Maysir (Gambling)", desc: "Gambling in all forms is prohibited. This includes casino-style investments and certain derivatives." },
  { icon: CheckCircle2, title: "Ethical Asset Screen", desc: "Only invest in halal businesses: avoid alcohol, tobacco, pork, weapons, adult content, and conventional banking." },
  { icon: Star, title: "Zakat (Obligatory Charity)", desc: "2.5% of net wealth held for one lunar year above nisab. This purifies wealth and supports the community." },
  { icon: TrendingUp, title: "Risk & Profit Sharing", desc: "Islamic finance favours Mudarabah (profit-sharing) and Musharakah (partnership) over fixed-interest lending." }
];

export default function IslamicFinancePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const transactions = useFinanceStore((s) => s.transactions);
  const gamification = useFinanceStore((s) => s.gamification);
  const goals = useFinanceStore((s) => s.goals);
  const loans = useFinanceStore((s) => s.loans);

  // Zakat Calculator state
  const [cashAssets, setCashAssets] = useState(0);
  const [investments, setInvestments] = useState(0);
  const [goldSilver, setGoldSilver] = useState(0);
  const [businessStock, setBusinessStock] = useState(0);
  const [debts, setDebts] = useState(0);
  const [silverPrice, setSilverPrice] = useState(18);

  // Islamic AI Advisor
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Budget planner
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [budgetPlan, setBudgetPlan] = useState<{ category: string; amount: number; pct: number }[] | null>(null);

  // Active tab
  const [activeTab, setActiveTab] = useState<'overview' | 'zakat' | 'invest' | 'guide' | 'faq'>('overview');

  // Nisab = 612.36g silver Ã— silver price
  const nisab = Math.round(612.36 * silverPrice);
  const zakatBase = Math.max(cashAssets + investments + goldSilver + businessStock - debts, 0);
  const zakatDue = +(zakatBase * 0.025).toFixed(2);
  const zakatDueMsg = zakatBase >= nisab
    ? `R${zakatDue.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`
    : 'Below nisab â€“ Zakat not due';

  // Halal compliance breakdown
  const halalStats = useMemo(() => {
    let halal = 0, haram = 0, doubtful = 0, untagged = 0;
    transactions.forEach((t) => {
      if (t.halalStatus === 'halal') halal++;
      else if (t.halalStatus === 'haram') haram++;
      else if (t.halalStatus === 'doubtful') doubtful++;
      else untagged++;
    });
    return { halal, haram, doubtful, untagged, total: transactions.length };
  }, [transactions]);

  const islamicLoans = loans.filter(l => l.isIslamic);
  const conventionalLoans = loans.filter(l => !l.isIslamic);

  const handleAskAdvisor = async () => {
    if (!aiQuestion.trim()) return;
    setLoadingAi(true);
    setAiAnswer(null);
    try {
      const prompt = `I am a Muslim managing my finances according to Islamic principles. ${aiQuestion} Please give practical, Sharia-informed advice relevant to South Africa. Keep the answer clear and actionable.`;
      const result = await askCoach(prompt, 'friendly', []);
      setAiAnswer(result.reply || result.message || '');
    } catch {
      setAiAnswer("Islamic Finance AI advisor is currently unavailable. Consult Al Baraka Bank's Sharia advisory team or a local Islamic Finance scholar.");
    } finally {
      setLoadingAi(false);
    }
  };

  const handleBuildBudget = () => {
    const income = parseFloat(monthlyIncome);
    if (!income || income <= 0) return;
    setBudgetPlan([
      { category: 'Necessities (rent, food, transport, utilities)', pct: 50, amount: income * 0.50 },
      { category: 'Halal Wants (clothing, fun, dining out)', pct: 25, amount: income * 0.25 },
      { category: 'Savings & Emergency Fund', pct: 15, amount: income * 0.15 },
      { category: 'Debt Repayment', pct: 5, amount: income * 0.05 },
      { category: 'Sadaqah & Zakat', pct: 5, amount: income * 0.05 },
    ]);
  };

  const tabs: { key: typeof activeTab; label: string; icon: React.ElementType }[] = [
    { key: 'overview', label: 'Overview', icon: Star },
    { key: 'zakat', label: 'Zakat', icon: Calculator },
    { key: 'invest', label: 'Investments', icon: TrendingUp },
    { key: 'guide', label: 'Guide', icon: BookOpen },
    { key: 'faq', label: 'FAQ', icon: BookMarked },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider">Islamic Finance Hub</p>
          <h1 className="text-2xl font-semibold gradient-text">Halal Money Management</h1>
          <p className="text-sm text-slate-400 mt-1">Plan, invest, and manage your finances according to Islamic principles.</p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2">
          <Shield className="h-4 w-4 text-green-400" />
          <span className="text-green-300">Sharia-Compliant Tools</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === key ? 'bg-primary text-white' : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* â”€â”€ OVERVIEW TAB â”€â”€ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Halal Compliance */}
          <Card className="p-5">
            <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-400" />
              Transaction Compliance Overview
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Halal', count: halalStats.halal, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
                { label: 'Haram', count: halalStats.haram, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
                { label: 'Doubtful', count: halalStats.doubtful, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
                { label: 'Untagged', count: halalStats.untagged, color: 'text-slate-400', bg: 'bg-slate-800/60 border-slate-700/40' },
              ].map(item => (
                <div key={item.label} className={`rounded-xl p-3 border ${item.bg}`}>
                  <p className="text-xs text-slate-400">{item.label}</p>
                  <p className={`text-2xl font-bold ${item.color}`}>{item.count}</p>
                  {halalStats.total > 0 && (
                    <p className="text-xs text-slate-500">{Math.round((item.count / halalStats.total) * 100)}%</p>
                  )}
                </div>
              ))}
            </div>
            {halalStats.total === 0 && (
              <p className="text-sm text-slate-400 mt-3 text-center">No transactions yet. Tag transactions as halal, haram, or doubtful when adding them.</p>
            )}
            {halalStats.haram > 0 && (
              <div className="mt-3 flex items-start gap-2 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                <p className="text-xs text-red-300">You have {halalStats.haram} haram-tagged transaction(s). Review and avoid these spending categories.</p>
              </div>
            )}
          </Card>

          {/* Loan Compliance */}
          {loans.length > 0 && (
            <Card className="p-5">
              <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Loan Compliance Status
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                  <p className="text-xs text-slate-400">Sharia-Compliant Loans</p>
                  <p className="text-xl font-bold text-green-400">{islamicLoans.length}</p>
                  {islamicLoans.map(l => <p key={l.id} className="text-xs text-green-300">âœ“ {l.name}</p>)}
                  {islamicLoans.length === 0 && <p className="text-xs text-slate-400">None marked as Islamic yet</p>}
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <p className="text-xs text-slate-400">Conventional Loans (Riba-based)</p>
                  <p className="text-xl font-bold text-amber-400">{conventionalLoans.length}</p>
                  {conventionalLoans.map(l => <p key={l.id} className="text-xs text-amber-300">âš  {l.name} â€” pay off ASAP</p>)}
                  {conventionalLoans.length === 0 && <p className="text-xs text-slate-400">None â€” great!</p>}
                </div>
              </div>
              {conventionalLoans.length > 0 && (
                <p className="text-xs text-slate-400 mt-3">Scholars advise: honour the contract, pay it off as quickly as possible, then avoid new interest-based debt. See Loan Tracker for your payoff strategy.</p>
              )}
            </Card>
          )}

          {/* Principles */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {islamicFinancePrinciples.map((p) => (
              <Card key={p.title} className="p-4 flex gap-3">
                <div className="h-9 w-9 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0">
                  <p.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{p.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{p.desc}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Islamic Budget Planner */}
          <Card className="p-5">
            <h2 className="text-base font-semibold mb-1 flex items-center gap-2">
              <Calculator className="h-4 w-4 text-primary" />
              Islamic Budget Planner (50/25/15/5/5)
            </h2>
            <p className="text-xs text-slate-400 mb-3">Based on Islamic financial principles â€” necessities, halal wants, savings, debt repayment, and sadaqah.</p>
            <div className="flex gap-3 items-end flex-wrap">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Monthly Income (R)</label>
                <Input type="number" value={monthlyIncome} onChange={e => setMonthlyIncome(e.target.value)} placeholder="0.00" className="w-40" />
              </div>
              <Button onClick={handleBuildBudget} className="bg-primary">Build Plan</Button>
            </div>
            {budgetPlan && (
              <div className="mt-4 space-y-3">
                {budgetPlan.map(item => (
                  <div key={item.category}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">{item.category}</span>
                      <span className="text-slate-400">R{item.amount.toFixed(2)} ({item.pct}%)</span>
                    </div>
                    <Progress value={item.pct} className="h-1.5" />
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Islamic AI Advisor */}
          <Card className="p-5">
            <h2 className="text-base font-semibold mb-1 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              Ask the Islamic Finance AI Advisor
            </h2>
            <p className="text-xs text-slate-400 mb-3">Get guidance on halal finance, investments, loan alternatives, and more. Always verify with a local scholar.</p>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2 mb-2">
                {['Is my investment halal?', 'How do I pay off a riba loan?', 'What is Murabaha financing?', 'How do I calculate my Zakat?'].map(q => (
                  <button key={q} onClick={() => setAiQuestion(q)}
                    className="text-xs px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 transition-colors">
                    {q}
                  </button>
                ))}
              </div>
              <textarea
                value={aiQuestion}
                onChange={e => setAiQuestion(e.target.value)}
                placeholder="Ask anything about Islamic finance..."
                className="w-full min-h-[80px] px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Button onClick={handleAskAdvisor} disabled={loadingAi || !aiQuestion.trim()} className="bg-primary">
                {loadingAi ? 'Thinking...' : 'Ask Advisor'}
              </Button>
              {aiAnswer && (
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
                  <p className="text-xs text-primary font-medium mb-1">Islamic Finance Advisor</p>
                  <p className="text-sm text-slate-200 whitespace-pre-line">{aiAnswer}</p>
                  <p className="text-xs text-slate-500 mt-2">âš  AI guidance only. Consult a qualified Islamic scholar for fatwa.</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* â”€â”€ ZAKAT TAB â”€â”€ */}
      {activeTab === 'zakat' && (
        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="text-base font-semibold mb-1 flex items-center gap-2">
              <Calculator className="h-4 w-4 text-primary" />
              Zakat Calculator
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Zakat is 2.5% of net zakatable wealth held for one full lunar year (hawl) above nisab.
              Current nisab (silver standard): <strong className="text-slate-200">R{nisab.toLocaleString()}</strong> (612.36g Ã— R{silverPrice}/g silver)
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { label: 'Cash & Bank Balances (R)', value: cashAssets, setter: setCashAssets },
                { label: 'Investment Value (stocks, unit trusts) (R)', value: investments, setter: setInvestments },
                { label: 'Gold & Silver Value (R)', value: goldSilver, setter: setGoldSilver },
                { label: 'Business Stock / Inventory (R)', value: businessStock, setter: setBusinessStock },
                { label: 'Liabilities / Debts (R)', value: debts, setter: setDebts },
                { label: 'Silver Price (R/gram) â€” for nisab', value: silverPrice, setter: setSilverPrice },
              ].map(({ label, value, setter }) => (
                <div key={label}>
                  <label className="text-xs text-slate-400 block mb-1">{label}</label>
                  <Input type="number" value={value || ''} onChange={e => setter(+e.target.value)} placeholder="0.00" />
                </div>
              ))}
            </div>
            <div className="mt-5 p-4 rounded-xl bg-primary/10 border border-primary/20">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400">Zakatable Wealth</p>
                  <p className="text-xl font-bold text-slate-100">R{zakatBase.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Zakat Due (2.5%)</p>
                  <p className={`text-xl font-bold ${zakatBase >= nisab ? 'text-primary' : 'text-slate-400'}`}>{zakatDueMsg}</p>
                </div>
              </div>
              {zakatBase >= nisab && (
                <div className="mt-3 flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-slate-300">Your wealth is above the nisab. You owe <strong className="text-primary">R{zakatDue.toFixed(2)}</strong> in Zakat this year.</p>
                </div>
              )}
            </div>
            <div className="mt-4 p-3 bg-slate-800/40 rounded-lg">
              <p className="text-xs text-slate-400 font-medium mb-1">Recommended Zakat Organisations (South Africa)</p>
              <ul className="text-xs text-slate-300 space-y-0.5">
                <li>â†’ SANZAF (South African National Zakah Fund) â€” sanzaf.org.za</li>
                <li>â†’ Jamiatul Ulama SA â€” jamiatsa.co.za</li>
                <li>â†’ Al-Imdaad Foundation â€” alimdaad.com</li>
              </ul>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-base font-semibold mb-1">Sadaqah Target</h2>
            <p className="text-xs text-slate-400 mb-3">Aim for at least 2.5% of income as voluntary charity each month.</p>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Monthly Income (R)</label>
              <Input type="number" value={monthlyIncome} onChange={e => setMonthlyIncome(e.target.value)} placeholder="Enter to see sadaqah target" className="w-48" />
            </div>
            {monthlyIncome && parseFloat(monthlyIncome) > 0 && (
              <p className="text-sm text-slate-300 mt-2">
                2.5% sadaqah target = <strong className="text-primary">R{(parseFloat(monthlyIncome) * 0.025).toFixed(2)}/month</strong>
              </p>
            )}
          </Card>
        </div>
      )}

      {/* â”€â”€ INVESTMENTS TAB â”€â”€ */}
      {activeTab === 'invest' && (
        <div className="space-y-4">
          <Card className="p-4 bg-amber-500/10 border border-amber-500/20">
            <div className="flex gap-2 items-start">
              <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-300">
                For informational purposes only. Always perform due diligence and consult a Sharia scholar and registered financial advisor before investing.
              </p>
            </div>
          </Card>
          <div className="grid md:grid-cols-2 gap-4">
            {halalInvestments.map(inv => (
              <Card key={inv.name} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-semibold">{inv.name}</h3>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">{inv.type}</span>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                </div>
                <p className="text-xs text-slate-300 mb-2">{inv.description}</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded">Risk: {inv.risk}</span>
                  <span className="bg-green-500/10 text-green-400 px-2 py-0.5 rounded">{inv.available}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{inv.website}</p>
              </Card>
            ))}
          </div>
          <Card className="p-5">
            <h2 className="text-base font-semibold mb-3">JSE Sharia Screening Criteria</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs font-semibold text-red-400 mb-2">âŒ Excluded Sectors</p>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  <li>Conventional banking & insurance</li>
                  <li>Alcohol production or distribution</li>
                  <li>Gambling & casinos</li>
                  <li>Pork products</li>
                  <li>Tobacco</li>
                  <li>Weapons & defense manufacturing</li>
                  <li>Adult entertainment</li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-green-400 mb-2">âœ“ Financial Ratio Tests</p>
                <ul className="text-xs text-slate-300 space-y-1">
                  <li className="flex gap-2"><CheckCircle2 className="h-3 w-3 text-green-400 mt-0.5 shrink-0" />Debt Ã· Market Cap &lt; 33%</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-3 w-3 text-green-400 mt-0.5 shrink-0" />Interest Income &lt; 5% of total revenue</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-3 w-3 text-green-400 mt-0.5 shrink-0" />Accounts receivable &lt; 50% of total assets</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-3 w-3 text-green-400 mt-0.5 shrink-0" />Purify any remaining non-compliant income portion</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* â”€â”€ GUIDE TAB â”€â”€ */}
      {activeTab === 'guide' && (
        <div className="space-y-4">
          {[
            {
              title: "Step 1: Audit Your Finances",
              color: "border-primary/30",
              items: [
                "List all income sources and tag them: halal (salary, halal business) or haram (interest income).",
                "Review all expenses â€” tag food, transport, utilities as halal; gambling or alcohol as haram.",
                "List all assets: cash, investments, gold, property.",
                "List all liabilities: loans, credit cards, overdrafts."
              ]
            },
            {
              title: "Step 2: Deal With Existing Riba Debt",
              color: "border-amber-500/30",
              items: [
                "Make tawbah (sincere repentance) for past riba dealings.",
                "Do NOT default on existing loans â€” it harms your credit and is against Islamic ethics.",
                "Pay off the highest-interest loan first (debt avalanche) or smallest (debt snowball).",
                "Use the Loan Tracker to build a payoff schedule.",
                "FNB Islamic Banking and Al Baraka Bank offer Sharia-compliant alternatives when you refinance."
              ]
            },
            {
              title: "Step 3: Build a Halal Budget",
              color: "border-green-500/30",
              items: [
                "Use the 50/25/15/5/5 framework: necessities / halal wants / savings / debt / sadaqah.",
                "Set up a Sadaqah envelope â€” even R50/month to a local mosque or charity.",
                "Ensure your savings account is at a Sharia-compliant institution.",
                "Avoid credit card interest â€” pay the full balance monthly."
              ]
            },
            {
              title: "Step 4: Start Halal Investing",
              color: "border-blue-500/30",
              items: [
                "Open a Wahed Invest or Al Baraka Mudarabah savings account.",
                "For the JSE: buy Sharia-screened ETFs (iShares Islamic, Satrix Sharia).",
                "Avoid CFDs, leveraged products, options, and forex speculation.",
                "Invest in property â€” real estate is Sharia-compliant by nature.",
                "Consider Sukuk (Islamic bonds) for lower-risk fixed returns."
              ]
            },
            {
              title: "Step 5: Annual Zakat & Sadaqah",
              color: "border-amber-500/30",
              items: [
                "Calculate your Zakat every Ramadan or a fixed annual date.",
                "Pay Zakat through a registered SA organisation like SANZAF.",
                "Give voluntary sadaqah regularly. The Prophet ï·º said sadaqah stands in the way of calamity.",
                "Consider a Waqf (endowment) for lasting charitable impact."
              ]
            },
            {
              title: "Renovation & Wedding Loan: Islamic Approach",
              color: "border-green-500/30",
              items: [
                "If you already have a conventional loan, fulfil the contract and pay it off using the Loan Tracker.",
                "When the loan is cleared, switch to Islamic financing via FNB Islamic or Al Baraka.",
                "For your wedding: keep things modest and within means â€” excessive debt for a wedding is not encouraged.",
                "Cash gifts (mahr, walima contributions) can go directly toward loan repayment.",
                "Make du'a for barakah in your wealth â€” consistency in ibadah protects wealth spiritually."
              ]
            }
          ].map((section, i) => (
            <Card key={i} className={`p-5 border-l-4 ${section.color}`}>
              <h3 className="text-sm font-semibold mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.items.map((item, j) => (
                  <li key={j} className="flex gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}

      {/* â”€â”€ FAQ TAB â”€â”€ */}
      {activeTab === 'faq' && (
        <div className="space-y-2">
          {faqs.map((faq, idx) => (
            <Card key={idx} className="overflow-hidden">
              <button
                className="w-full text-left p-4 flex items-center justify-between gap-3"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <span className="text-sm font-medium">{faq.q}</span>
                {openFaq === idx
                  ? <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
                  : <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />}
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-sm text-slate-300 border-t border-slate-800 pt-3">{faq.a}</div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
