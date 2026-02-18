"use client";
import React, { useState, useMemo } from "react";
import { useFinanceStore } from "../../lib/store";

const faqs = [
  {
    q: "What is Riba and why is it prohibited?",
    a: "Riba refers to interest or usury, which is strictly prohibited in Islamic finance. Earning money from money (interest) is not allowed; instead, profit must be generated through legitimate trade and investment in assets."
  },
  {
    q: "How does risk sharing work in Islamic finance?",
    a: "Islamic finance encourages risk sharing between parties. For example, in a Mudarabah contract, one party provides capital and the other provides expertise, and profits are shared according to a pre-agreed ratio."
  },
  {
    q: "What are Sharia-compliant investments?",
    a: "Investments must avoid industries such as alcohol, gambling, pork, and anything considered unethical under Islamic law. Instead, investments should be in productive, real assets or businesses."
  },
  {
    q: "What is Zakat and how does it relate to finance?",
    a: "Zakat is a form of almsgiving and one of the Five Pillars of Islam. It requires Muslims to give a portion of their wealth to those in need, and is an important aspect of wealth management in Islamic finance."
  },
];

const advisors: { name: string; org: string; contact?: string; website?: string }[] = [];

const screener = [
  { name: "iShares MSCI World Islamic", risk: "Moderate", sector: "Broad Market", compliance: "Sharia screened" },
  { name: "SPUS S&P 500 Sharia", risk: "Moderate", sector: "US Large Cap", compliance: "Sharia screened" },
  { name: "Wahed FTSE USA Shariah", risk: "Moderate", sector: "US Multi", compliance: "AAOIFI filters" },
  { name: "Global Sukuk Fund", risk: "Lower", sector: "Sukuk (fixed income alternative)", compliance: "Sukuk-based" },
  { name: "Amana Growth Fund", risk: "Higher", sector: "Growth Equities", compliance: "Sharia supervised" },
];

export default function IslamicFinancePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const transactions = useFinanceStore((s) => s.transactions);
  const gamification = useFinanceStore((s) => s.gamification);

  const [cashAssets, setCashAssets] = useState(0);
  const [investments, setInvestments] = useState(0);
  const [goldSilver, setGoldSilver] = useState(0);
  const [debts, setDebts] = useState(0);
  const nisab = 8500; // Example placeholder; confirm locally

  const zakatBase = Math.max(cashAssets + investments + goldSilver - debts, 0);
  const zakatDue = +(zakatBase * 0.025).toFixed(2);
  // Calculate halal/haram/doubtful breakdown
  const halalStats = useMemo(() => {
    let halal = 0, haram = 0, doubtful = 0, total = 0;
    transactions.forEach((t) => {
      if (t.halalStatus === 'halal') halal++;
      else if (t.halalStatus === 'haram') haram++;
      else if (t.halalStatus === 'doubtful') doubtful++;
      total++;
    });
    return { halal, haram, doubtful, total };
  }, [transactions]);

  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex items-center gap-4 mb-8">
        <img src="/logo.svg" alt="Islamic Finance" className="h-12 w-12" />
        <h1 className="text-3xl font-bold gradient-text">Islamic Finance Hub</h1>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Your Halal Compliance Overview</h2>
        <div className="flex gap-6 items-center mb-2">
          <div className="bg-green-900/60 rounded-xl px-4 py-2">
            <span className="font-bold text-green-300">Halal:</span> {halalStats.halal}
          </div>
          <div className="bg-red-900/60 rounded-xl px-4 py-2">
            <span className="font-bold text-red-300">Haram:</span> {halalStats.haram}
          </div>
          <div className="bg-yellow-900/60 rounded-xl px-4 py-2">
            <span className="font-bold text-yellow-200">Doubtful:</span> {halalStats.doubtful}
          </div>
          <div className="bg-slate-800/60 rounded-xl px-4 py-2">
            <span className="font-bold text-slate-200">Total:</span> {halalStats.total}
          </div>
        </div>
        <div className="text-slate-400 text-sm mb-2">
          {halalStats.total > 0 ? (
            <>
              {((halalStats.halal / halalStats.total) * 100).toFixed(0)}% of your transactions are marked as halal.
              {halalStats.haram > 0 && (
                <> <span className="text-red-400">({((halalStats.haram / halalStats.total) * 100).toFixed(0)}% haram)</span></>
              )}
            </>
          ) : (
            <>No transactions yet. Start tracking to see your halal compliance!</>
          )}
        </div>
        <p className="text-xs text-slate-500">You can tag each transaction as halal, haram, or doubtful for better compliance tracking.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Zakat Calculator (2.5%)</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Cash & equivalents</label>
            <input type="number" className="w-full rounded-lg bg-slate-900 border border-slate-800 p-2" value={cashAssets} onChange={(e) => setCashAssets(+e.target.value || 0)} />
            <label className="text-sm text-slate-300">Investments (halal)</label>
            <input type="number" className="w-full rounded-lg bg-slate-900 border border-slate-800 p-2" value={investments} onChange={(e) => setInvestments(+e.target.value || 0)} />
            <label className="text-sm text-slate-300">Gold/Silver</label>
            <input type="number" className="w-full rounded-lg bg-slate-900 border border-slate-800 p-2" value={goldSilver} onChange={(e) => setGoldSilver(+e.target.value || 0)} />
            <label className="text-sm text-slate-300">Deductible debts</label>
            <input type="number" className="w-full rounded-lg bg-slate-900 border border-slate-800 p-2" value={debts} onChange={(e) => setDebts(+e.target.value || 0)} />
          </div>
          <div className="card space-y-2">
            <div className="text-slate-300">Nisab (example): <span className="font-semibold text-white">{nisab}</span></div>
            <div className="text-slate-300">Zakat base: <span className="font-semibold text-white">{zakatBase}</span></div>
            <div className="text-xl font-bold text-primary">Zakat due: {zakatDue}</div>
            <p className="text-xs text-slate-500">Confirm nisab per market/madhab. This is a simplified 2.5% calculator.</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">What is Islamic Finance?</h2>
        <p>
          Islamic finance is a system of managing money and investments in accordance with Sharia (Islamic law). It prohibits interest (Riba), promotes risk sharing, and ensures all investments are ethical and asset-backed.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Key Principles</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><b>Prohibition of Interest (Riba):</b> No earning or paying of interest.</li>
          <li><b>Risk Sharing:</b> Both parties share profit and loss.</li>
          <li><b>Ethical Investments:</b> No alcohol, gambling, pork, or unethical businesses.</li>
          <li><b>Asset-Backed Financing:</b> All transactions must be linked to tangible assets.</li>
          <li><b>Zakat:</b> Charitable giving as a form of wealth purification.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Interactive FAQ</h2>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-slate-800 rounded-xl p-4 bg-slate-900/60">
              <button
                className="w-full text-left font-medium text-lg text-primary focus:outline-none"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                {faq.q}
              </button>
              {openFaq === idx && (
                <p className="mt-2 text-slate-200 text-base">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Guides & Tools</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><a href="https://www.islamicfinance.com/education/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Islamic Finance Education Portal</a></li>
          <li><a href="https://www.investopedia.com/terms/i/islamicfinance.asp" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Investopedia: Islamic Finance</a></li>
          <li><a href="https://www.aaofi.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">AAOIFI Official Site</a></li>
          <li><a href="https://www.zakatcalculator.co.za/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Zakat Calculator (South Africa)</a></li>
          <li><a href="https://www.halalstocklist.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Halal Stock Screening Tool</a></li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Halal Investment Screener</h2>
        <p className="text-sm text-slate-400 mb-3">Sample screened products. Verify compliance with your advisor.</p>
        <div className="grid gap-3 md:grid-cols-2">
          {screener.map((item) => (
            <div key={item.name} className="border border-slate-800 rounded-xl p-4 bg-slate-900/60">
              <div className="font-semibold text-primary">{item.name}</div>
              <div className="text-slate-300 text-sm">Sector: {item.sector}</div>
              <div className="text-slate-300 text-sm">Risk: {item.risk}</div>
              <div className="text-green-300 text-xs">Compliance: {item.compliance}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-2">Always consult a Sharia scholar before investing.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Find an Islamic Finance Advisor</h2>
        <div className="card space-y-2">
          <p className="text-slate-300 text-sm">We’re curating a verified list of Sharia-compliant advisors. Want to be notified?</p>
          <a className="text-blue-500 underline text-sm" href="mailto:advisors@islamicfinancehub.com?subject=Advisor%20Request">Email to request an intro</a>
          <p className="text-xs text-slate-500">We’ll only connect you after explicit consent from both sides.</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Gamification & Progress</h2>
        <div className="card space-y-2">
          <div className="text-slate-200">Level: <span className="font-bold text-primary">{gamification.level}</span> (XP: {gamification.xp})</div>
          <div className="text-slate-300 text-sm">Streak: {gamification.streak} days</div>
          <div className="text-slate-300 text-sm">Daily challenge: {gamification.dailyChallenge}</div>
          <p className="text-xs text-slate-500">Earn XP for logging halal-compliant transactions, completing goals, and finishing learning modules.</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Community Q&A</h2>
        <div className="card space-y-3">
          <p className="text-slate-300 text-sm">Ask anonymously and get AI + advisor-aligned responses.</p>
          <a className="text-blue-500 underline text-sm" href="mailto:questions@islamicfinancehub.com?subject=Community%20Question">Email your question</a>
          <p className="text-xs text-slate-500">We anonymize submissions and summarize answers on this page.</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Privacy & Ethics</h2>
        <ul className="list-disc pl-6 space-y-1 text-sm text-slate-300">
          <li>Data is used only to deliver personalized Islamic finance guidance.</li>
          <li>No sharing with advisors unless you explicitly contact them.</li>
          <li>Anonymous Q&A available; avoid sharing sensitive identifiers.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Personalized Guidance</h2>
        <p>
          Use the AI Coach (bottom right) and ask for Islamic finance advice. Share your goals, and tag transactions for halal compliance to get sharper insights.
        </p>
      </section>
    </main>
  );
}
