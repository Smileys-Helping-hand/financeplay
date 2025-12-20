'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../lib/api';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Sparkles, TrendingUp, Target, Zap, Award, Users, Shield, BarChart3, Rocket, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard');
    } else {
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 px-4 pt-20 pb-16">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          {/* Logo & Brand */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-4 bg-gradient-to-br from-primary to-purple-500 rounded-3xl shadow-2xl shadow-primary/20">
              <Sparkles className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold">
            <span className="bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
              XPFinance
            </span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-slate-300 font-semibold max-w-3xl mx-auto">
            Level Up Your Money Game 🎮
          </p>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Transform boring budgeting into an exciting adventure. Track expenses, crush goals, and earn XP while building wealth!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-6 w-full sm:w-auto shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all">
                <Rocket className="mr-2 h-6 w-6" />
                Start Free Today
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 w-full sm:w-auto border-slate-700 hover:bg-slate-800">
                <ArrowRight className="mr-2 h-5 w-5" />
                Sign In
              </Button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <span>No Credit Card</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <span>Private & Secure</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-white">
            Why XPFinance?
          </h2>
          <p className="text-center text-slate-400 text-lg mb-12">
            Everything you need to take control of your finances
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card className="p-6 bg-slate-900/50 backdrop-blur border-slate-800 hover:border-primary/50 transition-all">
              <div className="p-3 bg-primary/20 rounded-xl w-fit mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Smart Tracking</h3>
              <p className="text-slate-400">
                Monitor every dollar with 19+ categories. See exactly where your money goes with beautiful visualizations.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="p-6 bg-slate-900/50 backdrop-blur border-slate-800 hover:border-purple-500/50 transition-all">
              <div className="p-3 bg-purple-500/20 rounded-xl w-fit mb-4">
                <Target className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Goal Crushing</h3>
              <p className="text-slate-400">
                Set savings goals and watch your progress grow. Stay motivated with real-time achievement tracking.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="p-6 bg-slate-900/50 backdrop-blur border-slate-800 hover:border-blue-500/50 transition-all">
              <div className="p-3 bg-blue-500/20 rounded-xl w-fit mb-4">
                <Zap className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Earn XP & Level Up</h3>
              <p className="text-slate-400">
                Turn financial discipline into a game. Complete challenges, earn experience points, unlock achievements.
              </p>
            </Card>

            {/* Feature 4 */}
            <Card className="p-6 bg-slate-900/50 backdrop-blur border-slate-800 hover:border-green-500/50 transition-all">
              <div className="p-3 bg-green-500/20 rounded-xl w-fit mb-4">
                <BarChart3 className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Insights</h3>
              <p className="text-slate-400">
                Get personalized recommendations powered by AI. Understand spending patterns and optimize your budget.
              </p>
            </Card>

            {/* Feature 5 */}
            <Card className="p-6 bg-slate-900/50 backdrop-blur border-slate-800 hover:border-yellow-500/50 transition-all">
              <div className="p-3 bg-yellow-500/20 rounded-xl w-fit mb-4">
                <Award className="h-8 w-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Achievements</h3>
              <p className="text-slate-400">
                Unlock badges for saving streaks, hitting milestones, and building healthy money habits.
              </p>
            </Card>

            {/* Feature 6 */}
            <Card className="p-6 bg-slate-900/50 backdrop-blur border-slate-800 hover:border-pink-500/50 transition-all">
              <div className="p-3 bg-pink-500/20 rounded-xl w-fit mb-4">
                <Shield className="h-8 w-8 text-pink-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Privacy First</h3>
              <p className="text-slate-400">
                Your data stays yours. Bank-level security with complete account isolation. We never sell your info.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="relative z-10 px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <Card className="p-12 bg-gradient-to-br from-primary/10 to-purple-500/10 backdrop-blur border-primary/20 text-center">
            <Users className="h-16 w-16 mx-auto mb-6 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the Community</h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Thousands of users are already leveling up their finances with XPFinance
            </p>
            <Link href="/signup">
              <Button size="lg" className="text-lg px-10 py-6 shadow-2xl shadow-primary/30">
                <Rocket className="mr-2 h-6 w-6" />
                Get Started - It&apos;s Free!
              </Button>
            </Link>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 px-4 py-8 text-center text-slate-500 border-t border-slate-800">
        <p className="mb-2">© 2024 XPFinance. Level up your money game.</p>
        <p className="text-sm">Made with ❤️ for students and young professionals</p>
      </div>
    </div>
  );
}
