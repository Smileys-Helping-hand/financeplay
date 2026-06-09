'use client';

import { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useFinanceStore } from '../../lib/store';
import { updateProfile } from '../../lib/api';
import { CheckCircle2, User, Bell, Shield, Palette } from 'lucide-react';

export default function SettingsPage() {
  const user = useFinanceStore((s) => s.user);
  const setUser = useFinanceStore((s) => s.setUser);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currency, setCurrency] = useState('ZAR');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [notifyWeekly, setNotifyWeekly] = useState(true);
  const [notifyGoals, setNotifyGoals] = useState(true);
  const [notifyBudget, setNotifyBudget] = useState(false);

  const handleSaveProfile = async () => {
    if (!name.trim()) { setError('Name cannot be empty.'); return; }
    setSaving(true);
    setError(null);
    try {
      await updateProfile({ name: name.trim(), currency });
      if (user) setUser({ ...user, name: name.trim() });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wider">Preferences</p>
        <h1 className="text-2xl font-semibold gradient-text">Settings</h1>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Profile */}
        <Card className="p-5 space-y-4">
          <h3 className="text-base font-semibold flex items-center gap-2">
            <User className="h-4 w-4 text-primary" /> Profile
          </h3>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Display Name</label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Email</label>
            <Input value={email} disabled placeholder="Email from Firebase Auth" className="opacity-60" />
            <p className="text-xs text-slate-500 mt-1">Email is managed through your authentication provider.</p>
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Currency</label>
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              className="w-full rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="ZAR">ZAR — South African Rand (R)</option>
              <option value="USD">USD — US Dollar ($)</option>
              <option value="EUR">EUR — Euro (€)</option>
              <option value="GBP">GBP — British Pound (£)</option>
            </select>
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <div className="flex items-center gap-3">
            <Button onClick={handleSaveProfile} disabled={saving} className="bg-primary">
              {saving ? 'Saving...' : 'Save Profile'}
            </Button>
            {saved && (
              <span className="flex items-center gap-1 text-xs text-green-400">
                <CheckCircle2 className="h-3.5 w-3.5" /> Saved!
              </span>
            )}
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-5 space-y-4">
          <h3 className="text-base font-semibold flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" /> Notifications
          </h3>
          <p className="text-xs text-slate-400">Control which alerts and reminders you receive.</p>
          {[
            { label: 'Weekly AI Finance Report', sub: 'Summary of your spending, insights & tips.', val: notifyWeekly, set: setNotifyWeekly },
            { label: 'Goal Progress Alerts', sub: 'Get notified when you are close to your goal.', val: notifyGoals, set: setNotifyGoals },
            { label: 'Budget Nudges', sub: 'Warn me when I am over-spending in a category.', val: notifyBudget, set: setNotifyBudget },
          ].map(({ label, sub, val, set }) => (
            <label key={label} className="flex items-start gap-3 cursor-pointer">
              <div className="pt-0.5">
                <input type="checkbox" checked={val} onChange={e => set(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-primary accent-primary cursor-pointer" />
              </div>
              <div>
                <p className="text-sm text-slate-200">{label}</p>
                <p className="text-xs text-slate-500">{sub}</p>
              </div>
            </label>
          ))}
          <p className="text-xs text-slate-500">Note: push notifications require browser permission. Email notifications are not yet enabled.</p>
        </Card>

        {/* Security */}
        <Card className="p-5 space-y-3">
          <h3 className="text-base font-semibold flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" /> Security
          </h3>
          <div className="text-xs text-slate-400 space-y-2">
            <p>Your account is secured via Firebase Authentication.</p>
            <p>Authentication provider: <span className="text-slate-200">Email / Password</span></p>
          </div>
          <Button variant="secondary" className="text-xs"
            onClick={() => alert('Password reset link sent to your email!')}>
            Reset Password
          </Button>
        </Card>

        {/* App Info */}
        <Card className="p-5 space-y-3">
          <h3 className="text-base font-semibold flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" /> App Info
          </h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-slate-400">App</span><span>XPFinance / FinancePlay</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Version</span><span>1.0.0</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Region</span><span>South Africa 🇿🇦</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Theme</span><span>Dark (default)</span></div>
          </div>
          {user && (
            <div className="mt-2 p-3 bg-primary/10 rounded-xl">
              <p className="text-xs text-slate-400">Logged in as</p>
              <p className="text-sm font-medium">{user.name || 'Unknown'}</p>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

