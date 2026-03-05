'use client';

import { FormEvent, useEffect, useState, useMemo } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Skeleton } from '../../components/ui/skeleton';
import { ErrorBoundary } from '../../components/ui/error-boundary';
import { Progress } from '../../components/ui/progress';
import {
  Banknote, Plus, Trash2, ChevronDown, ChevronUp, CreditCard,
  Home, Car, GraduationCap, Heart, Lightbulb, TrendingDown, CheckCircle2, AlertCircle
} from 'lucide-react';
import {
  fetchLoans, createLoan, deleteLoan, addLoanPayment, deleteLoanPayment, askCoach
} from '../../lib/api';
import type { Loan } from '../../lib/types';

const loanTypeOptions = [
  { value: 'personal', label: 'Personal Loan', icon: CreditCard },
  { value: 'home-improvement', label: 'Home / Renovation', icon: Home },
  { value: 'vehicle', label: 'Vehicle', icon: Car },
  { value: 'student', label: 'Student / Education', icon: GraduationCap },
  { value: 'wedding', label: 'Wedding / Event', icon: Heart },
  { value: 'other', label: 'Other', icon: Banknote }
];

function getLoanIcon(type: string) {
  const found = loanTypeOptions.find(o => o.value === type);
  const Icon = found?.icon || Banknote;
  return <Icon className="h-5 w-5" />;
}

function formatCurrency(n: number) {
  return `R${n.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function monthsBetween(start: Date, end: Date) {
  return Math.max(0, (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()));
}

/** Simple flat-rate or reducing-balance monthly breakdown */
function buildAmortization(loan: Loan, rows = 12) {
  if (loan.remainingBalance <= 0) return [];
  const monthly = loan.monthlyPayment;
  const monthlyRate = loan.interestRate / 100 / 12;
  let balance = loan.remainingBalance;
  const schedule = [];

  for (let i = 1; i <= rows && balance > 0; i++) {
    const interest = monthlyRate > 0 ? balance * monthlyRate : 0;
    const principal = Math.max(0, monthly - interest);
    balance = Math.max(0, balance - principal);
    schedule.push({ month: i, payment: monthly, interest: +interest.toFixed(2), principal: +principal.toFixed(2), balance: +balance.toFixed(2) });
  }
  return schedule;
}

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expandedLoan, setExpandedLoan] = useState<string | null>(null);
  const [showSchedule, setShowSchedule] = useState<string | null>(null);
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [loadingTip, setLoadingTip] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [loanType, setLoanType] = useState('personal');
  const [totalAmount, setTotalAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [purpose, setPurpose] = useState('');
  const [lender, setLender] = useState('');
  const [isIslamic, setIsIslamic] = useState(false);

  // Payment form state
  const [payingLoanId, setPayingLoanId] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState('');
  const [payDate, setPayDate] = useState(new Date().toISOString().split('T')[0]);
  const [payNotes, setPayNotes] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const data = await fetchLoans();
      setLoans(data || []);
    } catch { /* silently fail */ }
    finally { setLoading(false); }
  };

  const totalDebt = useMemo(() => loans.reduce((s, l) => s + l.remainingBalance, 0), [loans]);
  const totalOriginal = useMemo(() => loans.reduce((s, l) => s + l.totalAmount, 0), [loans]);
  const totalMonthly = useMemo(() => loans.reduce((s, l) => s + l.monthlyPayment, 0), [loans]);
  const overallProgress = totalOriginal > 0 ? Math.round(((totalOriginal - totalDebt) / totalOriginal) * 100) : 0;

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !totalAmount || !monthlyPayment) return;
    try {
      await createLoan({
        name,
        loanType,
        totalAmount: parseFloat(totalAmount),
        remainingBalance: parseFloat(totalAmount),
        interestRate: interestRate ? parseFloat(interestRate) : 0,
        monthlyPayment: parseFloat(monthlyPayment),
        startDate: new Date(startDate).toISOString(),
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
        purpose,
        lender,
        isIslamic
      });
      setName(''); setLoanType('personal'); setTotalAmount(''); setInterestRate('');
      setMonthlyPayment(''); setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate(''); setPurpose(''); setLender(''); setIsIslamic(false);
      setShowForm(false);
      await load();
    } catch {
      alert('Failed to add loan. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this loan? All payment history will also be deleted.')) return;
    try {
      await deleteLoan(id);
      await load();
    } catch { alert('Failed to delete loan.'); }
  };

  const handleAddPayment = async (loanId: string) => {
    if (!payAmount) return;
    try {
      await addLoanPayment(loanId, {
        amount: parseFloat(payAmount),
        date: new Date(payDate).toISOString(),
        notes: payNotes
      });
      setPayingLoanId(null); setPayAmount(''); setPayNotes('');
      setPayDate(new Date().toISOString().split('T')[0]);
      await load();
    } catch { alert('Failed to record payment.'); }
  };

  const handleDeletePayment = async (loanId: string, paymentId: string) => {
    if (!confirm('Remove this payment? The balance will be restored.')) return;
    try {
      await deleteLoanPayment(loanId, paymentId);
      await load();
    } catch { alert('Failed to remove payment.'); }
  };

  const handleGetTip = async (loan: Loan) => {
    setLoadingTip(true);
    setAiTip(null);
    try {
      const paid = loan.totalAmount - loan.remainingBalance;
      const pct = Math.round((paid / loan.totalAmount) * 100);
      const prompt = `I have a ${loan.loanType} loan called "${loan.name}"${loan.purpose ? ` for ${loan.purpose}` : ''}. Total: ${formatCurrency(loan.totalAmount)}, remaining: ${formatCurrency(loan.remainingBalance)} (${pct}% paid), monthly payment: ${formatCurrency(loan.monthlyPayment)}, interest rate: ${loan.interestRate}% p.a. ${loan.isIslamic ? 'This is a sharia-compliant arrangement.' : ''} Give me 3 practical tips to pay this off faster and manage it better. Keep it concise and actionable.`;
      const result = await askCoach(prompt, 'strict', []);
      setAiTip(result.reply || result.message || '');
    } catch { setAiTip('AI coach unavailable. Tip: Pay extra towards principal each month!'); }
    finally { setLoadingTip(false); }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map(i => <Skeleton key={i} className="h-40 w-full" />)}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Loan Management</p>
            <h1 className="text-2xl font-semibold">Debt Tracker & Payoff Planner</h1>
            <p className="text-sm text-slate-400 mt-1">Track renovation, wedding, and any other loans — all in one place.</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="bg-primary hover:bg-primary/80">
            <Plus className="h-4 w-4 mr-2" />
            Add Loan
          </Button>
        </div>

        {/* Summary Cards */}
        {loans.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-gradient-to-br from-red-500/20 to-red-900/10 border-red-500/20">
              <p className="text-xs text-slate-400">Total Outstanding</p>
              <p className="text-2xl font-bold text-red-400">{formatCurrency(totalDebt)}</p>
              <p className="text-xs text-slate-500 mt-1">Across {loans.length} loan{loans.length > 1 ? 's' : ''}</p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-amber-500/20 to-amber-900/10 border-amber-500/20">
              <p className="text-xs text-slate-400">Monthly Payments</p>
              <p className="text-2xl font-bold text-amber-400">{formatCurrency(totalMonthly)}</p>
              <p className="text-xs text-slate-500 mt-1">Per month combined</p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-green-500/20 to-green-900/10 border-green-500/20">
              <p className="text-xs text-slate-400">Already Paid</p>
              <p className="text-2xl font-bold text-green-400">{formatCurrency(totalOriginal - totalDebt)}</p>
              <p className="text-xs text-slate-500 mt-1">Keep going!</p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-primary/20 to-purple-900/10 border-primary/20">
              <p className="text-xs text-slate-400">Overall Progress</p>
              <p className="text-2xl font-bold text-primary">{overallProgress}%</p>
              <Progress value={overallProgress} className="mt-2 h-1.5" />
            </Card>
          </div>
        )}

        {/* Tips Banner */}
        {loans.length > 0 && totalDebt > 0 && (
          <Card className="p-4 flex gap-3 items-start bg-amber-500/10 border-amber-500/20">
            <Lightbulb className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-300">Loan Management Tips</p>
              <ul className="text-xs text-slate-300 mt-1 space-y-0.5 list-disc list-inside">
                <li>Pay more than the minimum whenever possible — even R200 extra on principal saves significantly on interest.</li>
                <li>Tackle the highest-interest loan first (debt avalanche) or the smallest balance first for quick wins (debt snowball).</li>
                <li>If you have multiple loans, consider consolidating for a single lower-rate payment.</li>
                <li>Avoid new debt while paying off existing loans — pause non-essential spending categories.</li>
              </ul>
            </div>
          </Card>
        )}

        {/* Add Loan Form */}
        {showForm && (
          <Card className="p-6 border-primary/30">
            <h2 className="text-lg font-semibold mb-4">Add New Loan</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Loan Name *</label>
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Wedding Loan, SA Home Loan" required />
                </div>
                <div>
                  <label className="label">Loan Type</label>
                  <select value={loanType} onChange={e => setLoanType(e.target.value)} className="select-field">
                    {loanTypeOptions.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="label">Total Amount (R) *</label>
                  <Input type="number" step="0.01" value={totalAmount} onChange={e => setTotalAmount(e.target.value)} placeholder="0.00" required />
                </div>
                <div>
                  <label className="label">Monthly Payment (R) *</label>
                  <Input type="number" step="0.01" value={monthlyPayment} onChange={e => setMonthlyPayment(e.target.value)} placeholder="0.00" required />
                </div>
                <div>
                  <label className="label">Annual Interest Rate (%)</label>
                  <Input type="number" step="0.01" value={interestRate} onChange={e => setInterestRate(e.target.value)} placeholder="0 if interest-free" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Start Date</label>
                  <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div>
                  <label className="label">End Date (optional)</label>
                  <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Purpose / Description</label>
                  <Input value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="e.g., Wedding venue, kitchen renovation" />
                </div>
                <div>
                  <label className="label">Lender</label>
                  <Input value={lender} onChange={e => setLender(e.target.value)} placeholder="e.g., FNB, family member" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="islamic" checked={isIslamic} onChange={e => setIsIslamic(e.target.checked)} className="accent-primary" />
                <label htmlFor="islamic" className="text-sm text-slate-300">This is a Sharia-compliant / interest-free arrangement</label>
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" className="bg-primary">Add Loan</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </Card>
        )}

        {/* Loan Cards */}
        {loans.length === 0 ? (
          <Card className="p-12 text-center text-slate-400">
            <TrendingDown className="h-10 w-10 mx-auto mb-3 text-slate-600" />
            <p className="font-medium">No loans tracked yet</p>
            <p className="text-sm mt-1">Add your renovation loan, wedding loan, or any debt to start planning your payoff strategy.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {loans.map(loan => {
              const paid = loan.totalAmount - loan.remainingBalance;
              const pct = loan.totalAmount > 0 ? Math.round((paid / loan.totalAmount) * 100) : 0;
              const isExpanded = expandedLoan === loan.id;
              const hasSchedule = showSchedule === loan.id;
              const schedule = hasSchedule ? buildAmortization(loan) : [];

              return (
                <Card key={loan.id} className="overflow-hidden">
                  {/* Loan Header */}
                  <div className="p-4 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${loan.isIslamic ? 'bg-green-500/20 text-green-400' : 'bg-primary/20 text-primary'}`}>
                        {getLoanIcon(loan.loanType)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold truncate">{loan.name}</h3>
                          {loan.isIslamic && (
                            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">
                              Halal
                            </span>
                          )}
                        </div>
                        {loan.purpose && <p className="text-xs text-slate-400 truncate">{loan.purpose}</p>}
                        {loan.lender && <p className="text-xs text-slate-500">Lender: {loan.lender}</p>}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-sm text-slate-400">Remaining</p>
                      <p className="text-xl font-bold text-red-400">{formatCurrency(loan.remainingBalance)}</p>
                      <p className="text-xs text-slate-500">of {formatCurrency(loan.totalAmount)}</p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="px-4 pb-2">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Paid: {formatCurrency(paid)} ({pct}%)</span>
                      <span>Monthly: {formatCurrency(loan.monthlyPayment)}{loan.interestRate > 0 ? ` @ ${loan.interestRate}% p.a.` : ''}</span>
                    </div>
                    <Progress value={pct} className="h-2" />
                    {loan.remainingBalance === 0 && (
                      <div className="flex items-center gap-1.5 mt-2 text-green-400 text-xs">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Fully paid off! Well done!</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="px-4 pb-3 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => setPayingLoanId(payingLoanId === loan.id ? null : loan.id)}>
                      + Record Payment
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setExpandedLoan(isExpanded ? null : loan.id)}>
                      {isExpanded ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
                      History ({loan.payments.length})
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowSchedule(hasSchedule ? null : loan.id)}>
                      Repayment Schedule
                    </Button>
                    <Button size="sm" variant="outline" className="text-primary" onClick={() => handleGetTip(loan)} disabled={loadingTip}>
                      {loadingTip ? '...' : 'AI Tips'}
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-400 ml-auto" onClick={() => handleDelete(loan.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  {/* Payment Form */}
                  {payingLoanId === loan.id && (
                    <div className="mx-4 mb-4 p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                      <p className="text-sm font-medium mb-3">Record a Payment</p>
                      <div className="flex flex-wrap gap-3 items-end">
                        <div>
                          <label className="label">Amount (R)</label>
                          <Input type="number" step="0.01" value={payAmount} onChange={e => setPayAmount(e.target.value)} placeholder="0.00" className="w-32" />
                        </div>
                        <div>
                          <label className="label">Date</label>
                          <Input type="date" value={payDate} onChange={e => setPayDate(e.target.value)} className="w-40" />
                        </div>
                        <div className="flex-1 min-w-[150px]">
                          <label className="label">Notes (optional)</label>
                          <Input value={payNotes} onChange={e => setPayNotes(e.target.value)} placeholder="e.g., March instalment" />
                        </div>
                        <Button size="sm" onClick={() => handleAddPayment(loan.id)} className="bg-primary">Save</Button>
                        <Button size="sm" variant="outline" onClick={() => setPayingLoanId(null)}>Cancel</Button>
                      </div>
                    </div>
                  )}

                  {/* Payment History */}
                  {isExpanded && (
                    <div className="mx-4 mb-4 overflow-hidden rounded-xl border border-slate-800">
                      {loan.payments.length === 0 ? (
                        <p className="p-3 text-xs text-slate-400 text-center">No payments recorded yet.</p>
                      ) : (
                        <table className="w-full text-xs">
                          <thead className="bg-slate-900/60">
                            <tr>
                              <th className="text-left px-3 py-2 text-slate-400">Date</th>
                              <th className="text-right px-3 py-2 text-slate-400">Amount</th>
                              <th className="px-3 py-2 text-slate-400">Notes</th>
                              <th className="px-3 py-2"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {loan.payments.map((p, idx) => (
                              <tr key={p.id} className={idx % 2 === 0 ? 'bg-slate-950/30' : ''}>
                                <td className="px-3 py-2 text-slate-300">{new Date(p.date).toLocaleDateString('en-ZA')}</td>
                                <td className="px-3 py-2 text-right text-green-400 font-medium">{formatCurrency(p.amount)}</td>
                                <td className="px-3 py-2 text-slate-400">{p.notes || '—'}</td>
                                <td className="px-3 py-2 text-center">
                                  <button onClick={() => handleDeletePayment(loan.id, p.id)} className="text-red-400 hover:text-red-300">
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}

                  {/* Repayment Schedule */}
                  {hasSchedule && schedule.length > 0 && (
                    <div className="mx-4 mb-4 overflow-x-auto rounded-xl border border-slate-800">
                      <p className="px-3 pt-2 text-xs text-slate-400 font-medium">Next 12-month repayment schedule</p>
                      <table className="w-full text-xs">
                        <thead className="bg-slate-900/60">
                          <tr>
                            <th className="text-left px-3 py-2 text-slate-400">Month</th>
                            <th className="text-right px-3 py-2 text-slate-400">Payment</th>
                            <th className="text-right px-3 py-2 text-slate-400">Interest</th>
                            <th className="text-right px-3 py-2 text-slate-400">Principal</th>
                            <th className="text-right px-3 py-2 text-slate-400">Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {schedule.map((row, idx) => (
                            <tr key={row.month} className={idx % 2 === 0 ? 'bg-slate-950/30' : ''}>
                              <td className="px-3 py-2 text-slate-300">Month {row.month}</td>
                              <td className="px-3 py-2 text-right text-slate-200">{formatCurrency(row.payment)}</td>
                              <td className="px-3 py-2 text-right text-amber-400">{formatCurrency(row.interest)}</td>
                              <td className="px-3 py-2 text-right text-green-400">{formatCurrency(row.principal)}</td>
                              <td className="px-3 py-2 text-right text-slate-300">{formatCurrency(row.balance)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {/* AI Tip Card */}
        {aiTip && (
          <Card className="p-4 bg-primary/10 border-primary/30">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold text-primary">AI Loan Coach</p>
            </div>
            <p className="text-sm text-slate-200 whitespace-pre-line">{aiTip}</p>
          </Card>
        )}

        {/* Guide Section */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-400" />
            Loan Management Guide
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-primary mb-2">Renovation Loan Tips</h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li className="flex gap-2"><span className="text-primary">→</span> Track every renovation expense under this loan to stay within budget.</li>
                <li className="flex gap-2"><span className="text-primary">→</span> Add 10–15% contingency buffer for unexpected renovation costs.</li>
                <li className="flex gap-2"><span className="text-primary">→</span> Pay off high-interest portions first before structural work.</li>
                <li className="flex gap-2"><span className="text-primary">→</span> Keep all receipts — renovation loans may have tax implications.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-amber-400 mb-2">Wedding Loan Tips</h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li className="flex gap-2"><span className="text-amber-400">→</span> Avoid adding more debt for the honeymoon — plan it separately.</li>
                <li className="flex gap-2"><span className="text-amber-400">→</span> Cash gifts received can go directly toward reducing the loan.</li>
                <li className="flex gap-2"><span className="text-amber-400">→</span> Set up automatic monthly debit orders so you never miss a payment.</li>
                <li className="flex gap-2"><span className="text-amber-400">→</span> Pay off the wedding loan before making any major new purchases.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-green-400 mb-2">Debt Payoff Strategies</h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li className="flex gap-2"><span className="text-green-400">❄</span> <strong>Debt Snowball:</strong> Pay minimum on all loans, put extra onto the smallest first for quick wins.</li>
                <li className="flex gap-2"><span className="text-green-400">🏔</span> <strong>Debt Avalanche:</strong> Pay extra onto the highest-interest loan first — saves the most money.</li>
                <li className="flex gap-2"><span className="text-green-400">→</span> Any windfall (bonus, tax return) — put 50% toward loan repayment.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-red-400 mb-2">Warning Signs</h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li className="flex gap-2"><span className="text-red-400">⚠</span> If monthly payments exceed 35% of income, seek debt counselling.</li>
                <li className="flex gap-2"><span className="text-red-400">⚠</span> Never skip payments — fees and credit score damage compound quickly.</li>
                <li className="flex gap-2"><span className="text-red-400">⚠</span> Avoid borrowing to pay other loans (debt spiral).</li>
              </ul>
            </div>
          </div>
        </Card>

      </div>
    </ErrorBoundary>
  );
}
