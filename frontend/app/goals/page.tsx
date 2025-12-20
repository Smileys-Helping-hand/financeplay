'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Progress } from '../../components/ui/progress';
import { Skeleton } from '../../components/ui/skeleton';
import { ErrorBoundary } from '../../components/ui/error-boundary';
import { Trash2, TrendingUp } from 'lucide-react';
import axios from 'axios';
import { loadAllData } from '../../lib/dataLoader';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4002';

type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  priority: string;
  category?: string;
  autoSave?: boolean;
  autoSaveAmount?: number;
};

const goalCategories = [
  'emergency',
  'vacation',
  'purchase',
  'education',
  'home',
  'vehicle',
  'other'
];

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState(new Date().toISOString().split('T')[0]);
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('emergency');
  const [autoSave, setAutoSave] = useState(false);
  const [autoSaveAmount, setAutoSaveAmount] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await axios.get(`${API_URL}/data/snapshot`);
      setGoals(response.data.goals || []);
      // Reload all data to update insights and health
      await loadAllData();
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !target) return;

    try {
      await axios.post(`${API_URL}/data/goals`, {
        name,
        targetAmount: parseFloat(target),
        currentAmount: 0,
        deadline: new Date(deadline).toISOString(),
        priority,
        category,
        autoSave,
        autoSaveAmount: autoSave ? parseFloat(autoSaveAmount) : null
      });
      
      setName('');
      setTarget('');
      setDeadline(new Date().toISOString().split('T')[0]);
      setPriority('medium');
      setCategory('emergency');
      setAutoSave(false);
      setAutoSaveAmount('');
      fetchGoals();
    } catch (error) {
      console.error('Failed to add goal:', error);
      alert('Failed to add goal. Please try again.');
    }
  };

  const handleUpdateProgress = async (goalId: string, currentAmount: number) => {
    const newAmount = prompt(`Update current amount (current: R${currentAmount}):`);
    if (!newAmount) return;

    try {
      await axios.put(`${API_URL}/data/goals/${goalId}`, {
        currentAmount: parseFloat(newAmount)
      });
      fetchGoals();
    } catch (error) {
      console.error('Failed to update goal:', error);
      alert('Failed to update goal.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this goal?')) return;
    
    try {
      await axios.delete(`${API_URL}/data/goals/${id}`);
      fetchGoals();
    } catch (error) {
      console.error('Failed to delete goal:', error);
      alert('Failed to delete goal.');
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <Skeleton key={idx} className="h-36 w-full" />
        ))}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Savings goals</p>
            <h1 className="text-2xl font-semibold">Design goals that feel achievable</h1>
          </div>
        </div>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Create New Goal</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Goal Name</label>
                <Input 
                  placeholder="e.g., Emergency Fund" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Target Amount (R)</label>
                <Input 
                  placeholder="0.00" 
                  type="number" 
                  step="0.01"
                  value={target} 
                  onChange={(e) => setTarget(e.target.value)} 
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Deadline</label>
                <Input 
                  type="date" 
                  value={deadline} 
                  onChange={(e) => setDeadline(e.target.value)} 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md"
                >
                  {goalCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <input
                    type="checkbox"
                    checked={autoSave}
                    onChange={(e) => setAutoSave(e.target.checked)}
                    className="w-4 h-4"
                  />
                  Enable Auto-Save
                </label>
                {autoSave && (
                  <Input
                    type="number"
                    step="0.01"
                    value={autoSaveAmount}
                    onChange={(e) => setAutoSaveAmount(e.target.value)}
                    placeholder="Monthly auto-save amount"
                  />
                )}
              </div>
            </div>
            <Button type="submit">Add Goal</Button>
          </form>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {goals.length === 0 && (
            <Card className="p-8 col-span-full text-center text-slate-400">
              <p>No goals yet. Add your first savings target above!</p>
            </Card>
          )}
          {goals.map((goal) => {
            const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
            return (
              <Card key={goal.id} className="space-y-3 relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(goal.id)}
                  className="absolute top-4 right-4 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="flex items-center justify-between pr-10">
                  <div>
                    <p className="text-sm text-slate-400">{new Date(goal.deadline).toLocaleDateString()}</p>
                    <p className="text-lg font-semibold">{goal.name}</p>
                    {goal.category && (
                      <p className="text-xs text-slate-500 capitalize">{goal.category}</p>
                    )}
                  </div>
                  <span className="text-xs uppercase tracking-wide text-primary">{goal.priority}</span>
                </div>
                <Progress value={pct} />
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>R{goal.currentAmount.toFixed(2)}</span>
                  <span>Target R{goal.targetAmount.toFixed(2)}</span>
                </div>
                {goal.autoSave && goal.autoSaveAmount && (
                  <div className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                    Auto-save: R{goal.autoSaveAmount.toFixed(2)}/month
                  </div>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleUpdateProgress(goal.id, goal.currentAmount)}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Update Progress
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </ErrorBoundary>
  );
}
