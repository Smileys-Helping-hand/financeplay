'use client';

import { useState } from 'react';
import {
  BookOpen, Target, Shield, TrendingUp, CreditCard, AlertCircle,
  CheckCircle2, ChevronDown, ChevronUp, Lightbulb, Heart, Banknote,
  PiggyBank, BarChart2
} from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Section {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  content: { heading?: string; body: string; tips?: string[] }[];
}

// ─── Content ─────────────────────────────────────────────────────────────────
const sections: Section[] = [
  {
    id: 'basics',
    title: 'Budgeting Basics',
    icon: BarChart2,
    color: 'text-blue-400',
    content: [
      {
        body: "A budget is simply a plan for your money — telling it where to go instead of wondering where it went. If you\'ve never had a budget before, start here.",
        tips: [
          "Write down every rand you earn each month (salary, allowance, side income).",
          "Write down every expense: rent, food, transport, phone, subscriptions.",
          "Subtract expenses from income. If negative, you are spending more than you earn — you must cut.",
          "Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings & debt repayment.",
          "Review your budget once a week. It takes 5 minutes and saves thousands per year.",
        ]
      },
      {
        heading: "The 50/30/20 Rule",
        body: "Split your take-home pay into three buckets. This is the easiest budgeting system for beginners.",
        tips: [
          "50% → Needs: rent, groceries, utilities, transport, phone.",
          "30% → Wants: eating out, clothes, entertainment, coffee.",
          "20% → Future: savings account, debt payments above minimums, emergency fund.",
        ]
      },
      {
        heading: "Zero-Based Budgeting",
        body: "More powerful for people who overspend. Every rand gets a job. Income minus planned expenses = R0. You still plan for fun — but you plan it intentionally.",
        tips: [
          "List all income.",
          "Assign every rand to a category until the total reaches R0.",
          "If you have money left, assign it to savings or extra debt payments.",
          "Use the Transactions page to track every spend against your plan.",
        ]
      }
    ]
  },
  {
    id: 'emergency',
    title: 'Emergency Fund',
    icon: Shield,
    color: 'text-green-400',
    content: [
      {
        body: "An emergency fund is money you set aside so that an unexpected expense (car repair, medical bill, job loss) doesn\'t destroy your finances. Without one, you borrow — and borrowing costs you more money.",
        tips: [
          "Start with a R1,000 'baby' emergency fund immediately.",
          "Work up to 3 months of expenses (ideally 6 months).",
          "Keep it in a separate savings account — not your everyday account.",
          "Only use it for true emergencies: job loss, medical, critical repairs.",
          "After using it, rebuild it before doing anything else.",
        ]
      },
      {
        heading: "South Africa: Where to Keep Your Emergency Fund",
        body: "Choose an account that earns interest but is still accessible quickly.",
        tips: [
          "Capitec Global One — high interest, no monthly fees, same-day access.",
          "FNB Easy Account / eWallet — easy access.",
          "TymeBank GoalSave — earns up to 10% when untouched for 3 months.",
          "African Bank MySavings — competitive interest rates.",
          "Avoid keeping it in your main cheque account. Out of sight = out of mind.",
        ]
      }
    ]
  },
  {
    id: 'debt',
    title: 'Debt Management',
    icon: CreditCard,
    color: 'text-red-400',
    content: [
      {
        body: "Debt is the biggest barrier to financial freedom for South Africans. The average SA household debt-to-income ratio is above 70%. Here\'s how to fight back.",
        tips: [
          "List all your debts: balance, interest rate, minimum payment.",
          "Always pay all minimums. Never miss a payment.",
          "Choose a strategy: debt avalanche (highest interest first) or debt snowball (smallest balance first).",
          "Avalanche saves the most money. Snowball gives faster psychological wins.",
          "Every extra rand goes to your target debt.",
        ]
      },
      {
        heading: "Debt Avalanche vs Debt Snowball",
        body: "Pick one strategy and commit to it consistently.",
        tips: [
          "Avalanche: Pay minimums on all. Extra money → highest interest rate debt first. Saves the most in interest.",
          "Snowball: Pay minimums on all. Extra money → smallest balance first. Feels better, builds motivation.",
          "Use the Loan Tracker to map your payoff timeline for each strategy.",
        ]
      },
      {
        heading: "South Africa: Avoid These Debt Traps",
        body: "Certain types of debt are particularly destructive for South Africans.",
        tips: [
          "Mashonisa (informal lenders) can charge 30–50% per month. Never use them.",
          "Clothing store accounts (Edgars, Jet, Foschini) charge 21–22% interest. Pay them in full monthly.",
          "'Buy Now Pay Later' (laybye) is fine — it\'s NOT credit. But confirm there are no fees.",
          "Payday loans have APRs above 200%. Avoid entirely.",
          "Credit card debt at 20%+ compounds fast. Pay the full balance every month.",
        ]
      },
      {
        heading: "Debt Review (Debt Counselling)",
        body: "If you cannot afford your minimum payments, consider debt review through the NCR.",
        tips: [
          "Register with a National Credit Regulator (NCR)-accredited debt counsellor.",
          "They negotiate lower interest rates and extended repayment terms with creditors.",
          "While under debt review: creditors cannot sue you or repossess assets.",
          "Find accredited counsellors at ncr.org.za/debt-counselling.",
          "This is a last resort but better than default.",
        ]
      }
    ]
  },
  {
    id: 'savings',
    title: 'Saving Money',
    icon: PiggyBank,
    color: 'text-purple-400',
    content: [
      {
        body: "Saving is not about having extra money — it\'s about choosing to keep some of what you earn. Even R50/month builds a habit that will change your financial life.",
        tips: [
          "Pay yourself first: set up an auto-debit the day after your salary arrives.",
          "Start with any amount. R200/month is better than waiting for R2,000.",
          "Save for specific goals: emergency fund, holiday, car, deposit.",
          "Use the Goals feature in this app to track each savings goal separately.",
          "Never save money in a current account — it gets spent.",
        ]
      },
      {
        heading: "Cutting Expenses Fast",
        body: "Before you can save, you usually need to spend less. These cuts are painless compared to financial stress.",
        tips: [
          "Cancel subscriptions you forgot about (check your bank statement right now).",
          "Cook 3 extra meals at home per week instead of buying takeaways.",
          "Use public transport or carpool twice a week.",
          "Downgrade your phone data plan — most data is wasted.",
          "Buy groceries with a list and never shop hungry.",
          "Switch to generic/store-brand products for staples.",
        ]
      },
      {
        heading: "South Africa: Stokvels & Community Saving",
        body: "Stokvels are a uniquely South African community savings tool used by 11+ million people.",
        tips: [
          "A burial stokvel covers funeral costs — every family should consider one.",
          "A shopping stokvel pools money for year-end grocery packages.",
          "An investment stokvel invests in unit trusts or property collectively.",
          "Always choose trustworthy members and keep written agreements.",
          "South African Stokvel Association: nasasa.co.za for guidance.",
        ]
      }
    ]
  },
  {
    id: 'investing',
    title: 'Starting to Invest',
    icon: TrendingUp,
    color: 'text-primary',
    content: [
      {
        body: "Investing is how you make your money work harder than you do. Start after you have an emergency fund and are not paying high-interest debt.",
        tips: [
          "You don\'t need a lot of money to start. ETFs can be bought from R50/month.",
          "Time in the market beats timing the market. Start now, even small.",
          "Diversify: don\'t put all your money in one stock or one country.",
          "Invest regularly (monthly) regardless of market conditions — this is dollar-cost averaging.",
          "Never invest money you need within the next 3 years.",
        ]
      },
      {
        heading: "South Africa: Beginner Investment Options",
        body: "These are the best starting points for most South Africans.",
        tips: [
          "Tax-Free Savings Account (TFSA): R36,000/year limit, all growth is tax-free. Open at Easy Equities, Capitec, or FNB.",
          "ETFs (Exchange Traded Funds): Buy a basket of stocks. Try Satrix 40 ETF (top 40 JSE companies) or Satrix MSCI World (global).",
          "Unit Trusts: Professional managers invest your money. Available through Allan Gray, Coronation, Ninety One.",
          "Retirement Annuity (RA): Tax deduction on contributions, grows tax-free. For long-term wealth.",
          "Easy Equities: Best app for beginners, fractional shares, R50 minimum.",
        ]
      },
      {
        heading: "Avoid These Investment Traps",
        body: "South Africa has a long history of financial scams targeting people desperate to grow wealth faster.",
        tips: [
          "If it promises guaranteed 20%+ returns, it is a scam (Ponzi scheme).",
          "Crypto can be part of a diversified portfolio but is NOT a savings vehicle.",
          "Multi-Level Marketing (MLM) 'investment opportunities' — avoid.",
          "Always check the FSCA (Financial Sector Conduct Authority) register before investing with anyone.",
          "If an investment opportunity arrived via WhatsApp or social media — extreme caution.",
        ]
      }
    ]
  },
  {
    id: 'goals',
    title: 'Setting Financial Goals',
    icon: Target,
    color: 'text-amber-400',
    content: [
      {
        body: "Goals give your money direction. People with written financial goals are significantly more likely to achieve them. Use the Goals feature in this app.",
        tips: [
          "Make goals SMART: Specific, Measurable, Achievable, Relevant, Time-bound.",
          "Bad goal: 'I want to save money.' Good goal: 'Save R15,000 for a car deposit by December 2025.'",
          "Break big goals into monthly milestones.",
          "Assign a savings account or envelope to each goal.",
          "Review goals monthly and celebrate small wins.",
        ]
      },
      {
        heading: "Priority Order for Your Financial Goals",
        body: "Do these in order. Don\'t invest while in high-interest debt.",
        tips: [
          "1st: Build R1,000 starter emergency fund.",
          "2nd: Pay off all high-interest debt (credit cards, personal loans, clothing accounts).",
          "3rd: Grow emergency fund to 3–6 months of expenses.",
          "4th: Save for medium-term goals (car, holiday, education).",
          "5th: Invest for long-term wealth (retirement, property deposit).",
        ]
      }
    ]
  },
  {
    id: 'psychology',
    title: 'Money Psychology',
    icon: Heart,
    color: 'text-pink-400',
    content: [
      {
        body: "Most money problems are behaviour problems, not math problems. Understanding why you overspend is the key to changing it.",
        tips: [
          "Emotional spending: identify your triggers. Boredom? Stress? Social pressure?",
          "Social comparison: 'keeping up with the Joneses' is the biggest wealth killer. Their BMW may be financed and their account empty.",
          "Instant gratification: train yourself to wait 24–48 hours before non-essential purchases.",
          "Financial shame: many South Africans feel shame about money. You are not your bank balance. Awareness is the first step.",
          "Accountability partner: tell a trusted friend your financial goals. You are 2x more likely to succeed.",
        ]
      },
      {
        heading: "Breaking the Payday Cycle",
        body: "Many people are broke by the 10th of every month. Here\'s how to break the cycle.",
        tips: [
          "The moment your salary arrives: pay bills, auto-debit savings, auto-debit debt payments.",
          "What\'s left is your spending money for the month — nothing else.",
          "Unsubscribe from online shopping notifications and remove saved card details.",
          "Delete social shopping apps from your phone (Takealot, Superbalist, SHEIN).",
          "Use cash envelopes for groceries and entertainment — when it\'s gone, it\'s gone.",
        ]
      }
    ]
  },
  {
    id: 'sa-specific',
    title: 'South Africa: Practical Tips',
    icon: Lightbulb,
    color: 'text-yellow-400',
    content: [
      {
        heading: "Tax Threshold 2024/25",
        body: "If you earn below R95,750/year (R7,979/month) you pay no income tax. SARS offers rebates.",
        tips: [
          "File your tax return even if you earn below the threshold — you may get a refund.",
          "Use eFiling (efiling.sars.gov.za) — it\'s free and takes 20 minutes.",
          "If you have a TFSA, contributions are not tax-deductible but withdrawals are tax-free.",
          "Medical Aid tax credits reduce your tax bill — keep your certificates.",
          "Retirement Annuity contributions are tax-deductible (up to 27.5% of income).",
        ]
      },
      {
        heading: "SASSA & NSFAS",
        body: "Know your entitlements — these are not charity, they are earned rights.",
        tips: [
          "NSFAS covers students at public universities and TVET colleges. Apply at nsfas.org.za.",
          "SASSA Social Relief of Distress (SRD) R370 grant — apply at srd.sassa.gov.za.",
          "Child Support Grant: R510/month per child (under 18) for low-income caregivers.",
          "Old Age Pension: R2,180/month for those over 60 (means tested).",
          "Apply for all grants you qualify for — there is no shame in claiming what is yours.",
        ]
      },
      {
        heading: "Free Financial Counselling in SA",
        body: "You don\'t have to figure this out alone. These services are free.",
        tips: [
          "DEBT RESCUE Free advice: debtrescue.co.za",
          "NCR Consumer Helpline: 0860 627 627 (debt questions, credit disputes)",
          "Financial Sector Conduct Authority: fsca.co.za (check if an advisor is registered)",
          "Legal Aid SA: Free legal help including debt-related court cases — lasa.org.za",
          "Credit Ombud: Free dispute resolution for credit disagreements — creditombud.org.za",
        ]
      }
    ]
  }
];

// ─── Quick Calculator ─────────────────────────────────────────────────────────
function DebtPayoffCalc() {
  const [balance, setBalance] = useState('');
  const [rate, setRate] = useState('');
  const [payment, setPayment] = useState('');
  const [result, setResult] = useState<{ months: number; totalInterest: number } | null>(null);

  const calculate = () => {
    const b = parseFloat(balance);
    const r = parseFloat(rate) / 100 / 12;
    const p = parseFloat(payment);
    if (!b || !r || !p || p <= b * r) {
      setResult(null);
      return;
    }
    const months = Math.ceil(-Math.log(1 - (b * r) / p) / Math.log(1 + r));
    const totalPaid = p * months;
    const totalInterest = totalPaid - b;
    setResult({ months, totalInterest: Math.round(totalInterest) });
  };

  return (
    <Card className="p-5">
      <h3 className="text-base font-semibold mb-1 flex items-center gap-2">
        <CreditCard className="h-4 w-4 text-primary" /> Debt Payoff Calculator
      </h3>
      <p className="text-xs text-slate-400 mb-3">How long will it take to pay off your debt?</p>
      <div className="grid md:grid-cols-3 gap-3 mb-3">
        <div>
          <label className="text-xs text-slate-400 block mb-1">Balance (R)</label>
          <Input type="number" value={balance} onChange={e => setBalance(e.target.value)} placeholder="e.g. 50000" />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Interest Rate (%/year)</label>
          <Input type="number" value={rate} onChange={e => setRate(e.target.value)} placeholder="e.g. 21" />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Monthly Payment (R)</label>
          <Input type="number" value={payment} onChange={e => setPayment(e.target.value)} placeholder="e.g. 1500" />
        </div>
      </div>
      <Button onClick={calculate} className="bg-primary">Calculate</Button>
      {result && (
        <div className="mt-3 p-3 bg-primary/10 border border-primary/20 rounded-xl grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-400">Time to pay off</p>
            <p className="text-xl font-bold text-slate-100">{result.months} months</p>
            <p className="text-xs text-slate-400">({(result.months / 12).toFixed(1)} years)</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Total interest paid</p>
            <p className="text-xl font-bold text-red-400">R{result.totalInterest.toLocaleString()}</p>
          </div>
        </div>
      )}
      {result === null && balance && rate && payment && (
        <p className="text-xs text-red-400 mt-2">Payment is too low to cover interest. Increase monthly payment.</p>
      )}
    </Card>
  );
}

// ─── Savings Growth Calc ─────────────────────────────────────────────────────
function SavingsCalc() {
  const [monthly, setMonthly] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const m = parseFloat(monthly);
    const r = parseFloat(rate) / 100 / 12;
    const n = parseFloat(years) * 12;
    if (!m || !r || !n) return;
    const fv = m * ((Math.pow(1 + r, n) - 1) / r);
    setResult(Math.round(fv));
  };

  return (
    <Card className="p-5">
      <h3 className="text-base font-semibold mb-1 flex items-center gap-2">
        <PiggyBank className="h-4 w-4 text-primary" /> Savings Growth Calculator
      </h3>
      <p className="text-xs text-slate-400 mb-3">How much will your savings grow over time?</p>
      <div className="grid md:grid-cols-3 gap-3 mb-3">
        <div>
          <label className="text-xs text-slate-400 block mb-1">Monthly Saving (R)</label>
          <Input type="number" value={monthly} onChange={e => setMonthly(e.target.value)} placeholder="e.g. 500" />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Interest Rate (%/year)</label>
          <Input type="number" value={rate} onChange={e => setRate(e.target.value)} placeholder="e.g. 8" />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Years</label>
          <Input type="number" value={years} onChange={e => setYears(e.target.value)} placeholder="e.g. 5" />
        </div>
      </div>
      <Button onClick={calculate} className="bg-primary">Calculate</Button>
      {result !== null && (
        <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
          <p className="text-xs text-slate-400">Future value</p>
          <p className="text-2xl font-bold text-green-400">R{result.toLocaleString()}</p>
          <p className="text-xs text-slate-400">
            Total deposited: R{Math.round(parseFloat(monthly) * parseFloat(years) * 12).toLocaleString()} • 
            Interest earned: R{(result - Math.round(parseFloat(monthly) * parseFloat(years) * 12)).toLocaleString()}
          </p>
        </div>
      )}
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function GuidePage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<Record<string, number | null>>({});

  const toggleItem = (sectionId: string, idx: number) => {
    setOpenItems(prev => ({
      ...prev,
      [sectionId]: prev[sectionId] === idx ? null : idx
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wider">Financial Education</p>
        <h1 className="text-2xl font-semibold gradient-text">Finance Guide</h1>
        <p className="text-sm text-slate-400 mt-1">
          Practical, honest financial advice — especially for people who are new to managing money.
        </p>
      </div>

      {/* Intro banner */}
      <Card className="p-4 bg-primary/10 border-primary/20">
        <div className="flex gap-3 items-start">
          <BookOpen className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">You don&apos;t have to be great with money to start.</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Most financial struggles are not caused by intelligence — they&apos;re caused by nobody ever teaching us this.
              This guide is practical, jargon-free, and built for South Africans.
            </p>
          </div>
        </div>
      </Card>

      {/* Quick nav */}
      <div className="flex flex-wrap gap-2">
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(activeSection === s.id ? null : s.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              activeSection === s.id ? 'bg-primary text-white' : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <s.icon className="h-3.5 w-3.5" />
            {s.title}
          </button>
        ))}
      </div>

      {/* Calculators */}
      <div className="grid md:grid-cols-2 gap-5">
        <DebtPayoffCalc />
        <SavingsCalc />
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {sections
          .filter(s => !activeSection || s.id === activeSection)
          .map(section => (
            <Card key={section.id} className="overflow-hidden">
              <button
                className="w-full text-left p-5 flex items-center justify-between"
                onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
              >
                <div className="flex items-center gap-3">
                  <section.icon className={`h-5 w-5 ${section.color}`} />
                  <span className="text-base font-semibold">{section.title}</span>
                </div>
                {activeSection === section.id
                  ? <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
                  : <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                }
              </button>
              {activeSection === section.id && (
                <div className="px-5 pb-5 space-y-3 border-t border-slate-800 pt-4">
                  {section.content.map((item, idx) => (
                    <div key={idx} className="rounded-xl border border-slate-800 overflow-hidden">
                      <button
                        className="w-full text-left px-4 py-3 flex items-start gap-3"
                        onClick={() => toggleItem(section.id, idx)}
                      >
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.heading || section.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{item.body}</p>
                        </div>
                        {openItems[section.id] === idx
                          ? <ChevronUp className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
                          : <ChevronDown className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
                        }
                      </button>
                      {openItems[section.id] === idx && (
                        <div className="px-4 pb-4 bg-slate-900/30 border-t border-slate-800">
                          <p className="text-sm text-slate-300 mt-3 mb-3">{item.body}</p>
                          {item.tips && (
                            <ul className="space-y-2">
                              {item.tips.map((tip, ti) => (
                                <li key={ti} className="flex gap-2 text-sm text-slate-300">
                                  <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))
        }
      </div>

      {/* Footer note */}
      <Card className="p-4 bg-amber-500/10 border-amber-500/20">
        <div className="flex gap-2 items-start">
          <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-300">
            This guide is for general educational information only. For personalised financial advice, 
            consult an FSP-registered financial advisor. Check the FSCA register at <span className="underline">fsca.co.za</span>.
          </p>
        </div>
      </Card>
    </div>
  );
}
