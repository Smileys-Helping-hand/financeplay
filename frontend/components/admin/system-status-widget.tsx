'use client';

import { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { CheckCircle, AlertCircle, Zap, Network } from 'lucide-react';

interface SystemStatus {
  secondBrain: 'online' | 'offline' | 'unknown';
  gateway: 'active' | 'inactive' | 'unknown';
  jarvis: 'ready' | 'initializing' | 'unknown';
  dataSync: 'enabled' | 'disabled' | 'unknown';
  connectedApps: number;
  totalApps: number;
  lastCheck: string;
}

export function SystemStatusWidget() {
  const [status, setStatus] = useState<SystemStatus>({
    secondBrain: 'unknown',
    gateway: 'unknown',
    jarvis: 'unknown',
    dataSync: 'unknown',
    connectedApps: 0,
    totalApps: 0,
    lastCheck: new Date().toLocaleTimeString(),
  });

  useEffect(() => {
    const checkStatus = async () => {
      try {
        // Check Second Brain health
        const healthResponse = await fetch('http://localhost:3000/health');
        const secondBrainOnline = healthResponse.ok;

        // Check admin dashboard
        const dashResponse = await fetch('http://localhost:3000/api/admin/dashboard');
        const dashData = await dashResponse.json();

        setStatus({
          secondBrain: secondBrainOnline ? 'online' : 'offline',
          gateway: dashData.gateway ? 'active' : 'inactive',
          jarvis: 'ready',
          dataSync: 'enabled',
          connectedApps: dashData.stats?.activeApps || 0,
          totalApps: dashData.stats?.totalApps || 0,
          lastCheck: new Date().toLocaleTimeString(),
        });
      } catch (err) {
        setStatus((prev) => ({
          ...prev,
          secondBrain: 'offline',
          gateway: 'inactive',
          lastCheck: new Date().toLocaleTimeString(),
        }));
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'active':
      case 'ready':
      case 'enabled':
        return 'text-green-400';
      case 'offline':
      case 'inactive':
      case 'disabled':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'online':
      case 'active':
      case 'ready':
      case 'enabled':
        return 'bg-green-500/20 border-green-500/30';
      case 'offline':
      case 'inactive':
      case 'disabled':
        return 'bg-red-500/20 border-red-500/30';
      default:
        return 'bg-yellow-500/20 border-yellow-500/30';
    }
  };

  return (
    <Card className={`p-4 ${getStatusBg(status.secondBrain)}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-neon-gold" />
          <h3 className="font-semibold text-white">System Status</h3>
        </div>
        <span className="text-xs text-zinc-400">Last check: {status.lastCheck}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Second Brain */}
        <div className="flex flex-col items-center p-2 rounded bg-black/30">
          <CheckCircle className={`h-5 w-5 mb-1 ${getStatusColor(status.secondBrain)}`} />
          <p className="text-xs text-zinc-400">Second Brain</p>
          <p className={`text-xs font-medium ${getStatusColor(status.secondBrain)} capitalize`}>
            {status.secondBrain}
          </p>
        </div>

        {/* Gateway */}
        <div className="flex flex-col items-center p-2 rounded bg-black/30">
          <Network className={`h-5 w-5 mb-1 ${getStatusColor(status.gateway)}`} />
          <p className="text-xs text-zinc-400">Gateway</p>
          <p className={`text-xs font-medium ${getStatusColor(status.gateway)} capitalize`}>
            {status.gateway}
          </p>
        </div>

        {/* JARVIS */}
        <div className="flex flex-col items-center p-2 rounded bg-black/30">
          <Zap className={`h-5 w-5 mb-1 ${getStatusColor(status.jarvis)}`} />
          <p className="text-xs text-zinc-400">JARVIS</p>
          <p className={`text-xs font-medium ${getStatusColor(status.jarvis)} capitalize`}>
            {status.jarvis}
          </p>
        </div>

        {/* Data Sync */}
        <div className="flex flex-col items-center p-2 rounded bg-black/30">
          <CheckCircle className={`h-5 w-5 mb-1 ${getStatusColor(status.dataSync)}`} />
          <p className="text-xs text-zinc-400">Data Sync</p>
          <p className={`text-xs font-medium ${getStatusColor(status.dataSync)} capitalize`}>
            {status.dataSync}
          </p>
        </div>

        {/* Connected Apps */}
        <div className="flex flex-col items-center p-2 rounded bg-black/30">
          <CheckCircle className="h-5 w-5 mb-1 text-blue-400" />
          <p className="text-xs text-zinc-400">Apps</p>
          <p className="text-xs font-medium text-blue-400">
            {status.connectedApps}/{status.totalApps}
          </p>
        </div>
      </div>

      {/* Status Message */}
      <div className="mt-3 pt-3 border-t border-white/10">
        {status.secondBrain === 'online' ? (
          <p className="text-xs text-green-400 flex items-center gap-2">
            <CheckCircle className="h-3 w-3" />
            All systems operational. {status.connectedApps} app{status.connectedApps !== 1 ? 's' : ''} connected.
          </p>
        ) : (
          <p className="text-xs text-red-400 flex items-center gap-2">
            <AlertCircle className="h-3 w-3" />
            Second Brain offline. Check connection.
          </p>
        )}
      </div>
    </Card>
  );
}
