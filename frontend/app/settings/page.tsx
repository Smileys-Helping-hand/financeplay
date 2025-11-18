'use client';

import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-slate-500">Preferences</p>
        <h1 className="text-2xl font-semibold">Settings</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-3">
          <h3 className="text-lg font-semibold">Profile</h3>
          <Input placeholder="Name" defaultValue="FinancePlay Pilot" />
          <Input placeholder="Email" defaultValue="pilot@financeplay.africa" />
          <Button>Save changes</Button>
        </Card>
        <Card className="space-y-3">
          <h3 className="text-lg font-semibold">Notifications</h3>
          <p className="text-sm text-slate-400">Weekly AI reports, budget nudges, and goal reminders.</p>
          <Button variant="outline">Customize alerts</Button>
        </Card>
      </div>
    </div>
  );
}
