'use client';

import { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { AlertCircle, Copy, Check, Settings, Globe, Key, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EcosystemApp {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  features: string[];
  dataTypes: string[];
  apiKey: string;
  masterApiKey: string;
}

interface EcosystemStats {
  masterApiKey: string;
  totalApps: number;
  activeApps: number;
  totalUsers: number;
  sharedFeatures: number;
  globalCommands: number;
  apps: any[];
  adminUsers: string[];
}

export function EcosystemAdminPanel() {
  const [stats, setStats] = useState<EcosystemStats | null>(null);
  const [apps, setApps] = useState<EcosystemApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [masterKeyVisible, setMasterKeyVisible] = useState(false);

  useEffect(() => {
    loadEcosystemData();
  }, []);

  const loadEcosystemData = async () => {
    try {
      // Get master key
      const keyResponse = await fetch('http://localhost:3000/api/admin/master-key');
      const keyData = await keyResponse.json();

      // Get apps
      const appsResponse = await fetch('http://localhost:3000/api/admin/apps', {
        headers: {
          'x-master-api-key': keyData.masterApiKey
        }
      });
      const appsData = await appsResponse.json();

      // Get stats
      const statsResponse = await fetch('http://localhost:3000/api/admin/dashboard', {
        headers: {
          'x-master-api-key': keyData.masterApiKey
        }
      });
      const statsData = await statsResponse.json();

      setStats(statsData.stats);
      setApps(appsData.apps);
    } catch (err) {
      console.error('Failed to load ecosystem data:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-sm text-zinc-400">Loading ecosystem...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-100 text-sm">
        Failed to load ecosystem data. Ensure Second Brain is running on port 3000.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Zap className="h-8 w-8 text-neon-gold" />
          Ecosystem Control Panel
        </h1>
        <p className="text-sm text-zinc-400 mt-1">Manage all connected apps and master tokens</p>

        {/* System Status */}
        <div className="mt-4 flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400">Second Brain Online</span>
          </div>
          <div className="w-1 h-1 bg-zinc-600 rounded-full"></div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-blue-400">{stats.activeApps} Active App{stats.activeApps !== 1 ? 's' : ''}</span>
          </div>
          <div className="w-1 h-1 bg-zinc-600 rounded-full"></div>
          <span className="text-zinc-500">Updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Master API Key Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-gradient-to-br from-primary/20 to-purple-500/20 border-primary/40 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-white">Master API Key</h2>
            </div>
            <span className="text-xs bg-primary/30 px-2 py-1 rounded text-primary">ECOSYSTEM</span>
          </div>

          <p className="text-xs text-zinc-400 mb-3">
            Share this key with all apps to grant them full ecosystem access
          </p>

          <div className="bg-black/40 rounded-lg p-4 font-mono text-sm mb-4 relative">
            {masterKeyVisible ? (
              <div className="text-primary break-all">{stats.masterApiKey}</div>
            ) : (
              <div className="text-zinc-500">••••••••••••••••••••••••••••••••••••••••</div>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="absolute top-3 right-3"
              onClick={() => setMasterKeyVisible(!masterKeyVisible)}
            >
              {masterKeyVisible ? 'Hide' : 'Show'}
            </Button>
          </div>

          {masterKeyVisible && (
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                className="flex-1"
                onClick={() => copyToClipboard(stats.masterApiKey, 'master')}
              >
                {copiedKey === 'master' ? (
                  <>
                    <Check className="h-4 w-4 mr-1" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" /> Copy Key
                  </>
                )}
              </Button>

              <Button variant="outline" size="sm">
                Regenerate Key
              </Button>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-amber-300 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>Keep this key secret! Add to each app as: ECOSYSTEM_MASTER_API_KEY=&lt;key&gt;</span>
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Connection Health Status */}
      <Card className="p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/30">
        <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          System Health
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div>
              <p className="text-xs text-zinc-400">Second Brain</p>
              <p className="text-sm font-medium text-green-400">✓ Online</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div>
              <p className="text-xs text-zinc-400">Gateway</p>
              <p className="text-sm font-medium text-blue-400">✓ Active</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div>
              <p className="text-xs text-zinc-400">JARVIS</p>
              <p className="text-sm font-medium text-purple-400">✓ Ready</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <div>
              <p className="text-xs text-zinc-400">Data Sync</p>
              <p className="text-sm font-medium text-amber-400">✓ Enabled</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-neon-green">{stats.totalApps}</div>
          <p className="text-xs text-zinc-400 mt-1">Total Apps</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-neon-blue">{stats.activeApps}</div>
          <p className="text-xs text-zinc-400 mt-1">Active Apps</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{stats.sharedFeatures}</div>
          <p className="text-xs text-zinc-400 mt-1">Shared Features</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-neon-gold">{stats.globalCommands}</div>
          <p className="text-xs text-zinc-400 mt-1">Global Commands</p>
        </Card>
      </div>

      {/* Connected Apps */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5 text-neon-blue" />
          Connected Apps
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {apps.map((app, idx) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card
                  className={`p-4 ${
                    app.status === 'active'
                      ? 'border-green-500/30 bg-green-500/5'
                      : app.status === 'pending'
                      ? 'border-amber-500/30 bg-amber-500/5'
                      : 'border-zinc-700/50 bg-zinc-800/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-white">{app.name}</h3>
                      <p className="text-xs text-zinc-400">{app.id}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        app.status === 'active'
                          ? 'bg-green-500/20 text-green-300'
                          : app.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-zinc-700/50 text-zinc-300'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs mb-4">
                    <div className="text-zinc-400">
                      <span className="text-zinc-500">Features:</span> {app.features.length}
                    </div>
                    <div className="text-zinc-400">
                      <span className="text-zinc-500">Data Types:</span> {app.dataTypes.length}
                    </div>
                  </div>

                  {/* API Key */}
                  <div className="bg-black/40 rounded p-2 font-mono text-xs mb-3 truncate text-zinc-400 hover:text-zinc-200 transition-colors">
                    {app.apiKey.substring(0, 20)}...
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 text-xs">
                      Configure
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(app.apiKey, app.id)}
                    >
                      {copiedKey === app.id ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Admin Users */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Settings className="h-5 w-5 text-neon-amber" />
          Admin Users
        </h2>

        <Card className="p-4">
          <div className="space-y-2">
            {stats.adminUsers.map(admin => (
              <div
                key={admin}
                className="flex items-center justify-between p-2 bg-zinc-800/50 rounded"
              >
                <span className="text-sm text-white">{admin}</span>
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                  ADMIN
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Setup Guide */}
      <Card className="p-4 bg-blue-500/5 border-blue-500/30">
        <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-blue-400" />
          Quick Setup
        </h3>
        <ol className="text-xs text-zinc-300 space-y-1 ml-6 list-decimal">
          <li>Copy the Master API Key above</li>
          <li>Add to each app&apos;s .env file: ECOSYSTEM_MASTER_API_KEY=&lt;key&gt;</li>
          <li>Add ECOSYSTEM_API_URL=http://localhost:3000</li>
          <li>Restart each app</li>
          <li>All apps now have access to ecosystem features!</li>
        </ol>
      </Card>
    </div>
  );
}
