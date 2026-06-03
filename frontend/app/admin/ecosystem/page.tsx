'use client';

import { EcosystemAdminPanel } from '@/components/admin/ecosystem-admin-panel';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminEcosystemPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-white/10 bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-zinc-400" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
              <p className="text-xs text-zinc-400">Ecosystem Management & Configuration</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EcosystemAdminPanel />
      </div>
    </div>
  );
}
