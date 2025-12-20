'use client';

import { FormEvent, useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Sparkles, UserPlus, LogIn, Award, TrendingUp, Target, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUpWithEmail } from '../../lib/auth';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setLoading(true);
    setError('');
    
    try {
      await signUpWithEmail(email, password, name);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 relative z-10">
        {/* Left Side - Branding */}
        <div className="hidden md:flex flex-col justify-center space-y-8 text-white">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-primary to-purple-500 rounded-2xl">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  XPFinance
                </h1>
                <p className="text-slate-400 text-sm">Level Up Your Money Game</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Start Your Financial Journey</h2>
            <p className="text-slate-300 text-lg">
              Join thousands of users who are taking control of their finances and leveling up!
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Gamified Experience</h3>
                  <p className="text-sm text-slate-400">Earn XP, unlock achievements, level up</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Track Everything</h3>
                  <p className="text-sm text-slate-400">Expenses, income, goals - all in one place</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Target className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Reach Your Goals</h3>
                  <p className="text-sm text-slate-400">Set targets and watch your progress grow</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="flex items-center justify-center">
          <Card className="max-w-md w-full p-8 space-y-6 bg-slate-900/50 backdrop-blur border-slate-800">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center md:hidden gap-2 mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">XPFinance</h1>
              </div>
              <h2 className="text-2xl font-bold">Create Account</h2>
              <p className="text-slate-400">Start your journey to financial freedom</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Your Name</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="text-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="text-lg pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">At least 6 characters</p>
              </div>
              
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">
                  {error}
                </div>
              )}
              
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                <UserPlus className="h-5 w-5 mr-2" />
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-900 text-slate-400">Already have an account?</span>
              </div>
            </div>

            <Link href="/login">
              <Button variant="outline" className="w-full" size="lg">
                <LogIn className="h-5 w-5 mr-2" />
                Sign In
              </Button>
            </Link>

            <div className="text-center text-xs text-slate-500 space-y-1">
              <p>🚀 Get started in seconds</p>
              <p>💯 Completely free to use</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
