import axios from 'axios';

// Always use /api for unified deployment - works both client and server side
const API_BASE = '/api';

// Create axios instance with interceptors
const api = axios.create({
  baseURL: API_BASE,
});

// Add auth token to all requests
api.interceptors.request.use((config) => {
  const userId = getUserId();
  if (userId) {
    config.headers['x-user-id'] = userId;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid user ID and redirect to home
      if (typeof window !== 'undefined') {
        localStorage.removeItem('financeplay_userId');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// User ID management
export function getUserId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('financeplay_userId');
}

export function setUserId(userId: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('financeplay_userId', userId);
}

export function clearUserId() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('financeplay_userId');
}

export function isAuthenticated(): boolean {
  return !!getUserId();
}

// User API
export async function initializeUser(email: string, name: string) {
  const response = await axios.post(`${API_BASE}/data/user/init`, { email, name });
  const user = response.data;
  setUserId(user.id);
  return user;
}

// Data API
export async function fetchSnapshot() {
  const response = await api.get('/data/snapshot');
  return response.data;
}

export async function createTransaction(data: {
  amount: number;
  category: string;
  description: string;
  date: string;
  accountId?: string;
  halalStatus?: string;
  loanId?: string;
  isRecurring?: boolean;
}) {
  const response = await api.post('/data/transactions', data);
  return response.data;
}

export async function deleteTransaction(id: string) {
  const response = await api.delete(`/data/transactions/${id}`);
  return response.data;
}

export async function createGoal(data: {
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  priority: string;
}) {
  const response = await api.post('/data/goals', data);
  return response.data;
}

export async function updateGoal(id: string, currentAmount: number) {
  const response = await api.put(`/data/goals/${id}`, { currentAmount });
  return response.data;
}

export async function deleteGoal(id: string) {
  const response = await api.delete(`/data/goals/${id}`);
  return response.data;
}

export async function createBursary(data: {
  provider: string;
  monthlyAmount: number;
  nextPaymentDate: string;
  notes?: string;
}) {
  const response = await api.post('/data/bursaries', data);
  return response.data;
}

export async function deleteBursary(id: string) {
  const response = await api.delete(`/data/bursaries/${id}`);
  return response.data;
}

export async function fetchAccounts() {
  const response = await api.get('/data/accounts');
  return response.data;
}

export async function createAccount(data: {
  name: string;
  type: string;
  balance: number;
  currency?: string;
  color?: string;
  icon?: string;
}) {
  const response = await api.post('/data/accounts', data);
  return response.data;
}

export async function updateAccount(id: string, balance: number) {
  const response = await api.put(`/data/accounts/${id}`, { balance });
  return response.data;
}

export async function deleteAccount(id: string) {
  const response = await api.delete(`/data/accounts/${id}`);
  return response.data;
}

export async function askCoach(prompt: string, persona: string, history?: any[]) {
  const response = await api.post('/ai/coach', { prompt, persona, history });
  return response.data;
}

export async function getWeeklyReport() {
  const response = await api.get('/reports/weekly', { responseType: 'blob' });
  return response.data;
}

// Loan API
export async function fetchLoans() {
  const response = await api.get('/data/loans');
  return response.data;
}

export async function createLoan(data: {
  name: string;
  loanType: string;
  totalAmount: number;
  remainingBalance?: number;
  interestRate?: number;
  monthlyPayment: number;
  startDate: string;
  endDate?: string;
  purpose?: string;
  lender?: string;
  isIslamic?: boolean;
  notes?: string;
}) {
  const response = await api.post('/data/loans', data);
  return response.data;
}

export async function updateLoan(id: string, data: Partial<{
  name: string; loanType: string; totalAmount: number; remainingBalance: number;
  interestRate: number; monthlyPayment: number; endDate: string;
  purpose: string; lender: string; isIslamic: boolean; notes: string;
}>) {
  const response = await api.put(`/data/loans/${id}`, data);
  return response.data;
}

export async function deleteLoan(id: string) {
  const response = await api.delete(`/data/loans/${id}`);
  return response.data;
}

export async function addLoanPayment(loanId: string, data: { amount: number; date: string; notes?: string }) {
  const response = await api.post(`/data/loans/${loanId}/payments`, data);
  return response.data;
}

export async function deleteLoanPayment(loanId: string, paymentId: string) {
  const response = await api.delete(`/data/loans/${loanId}/payments/${paymentId}`);
  return response.data;
}

// Budget API
export async function fetchBudgets(month?: string) {
  const response = await api.get('/data/budgets', { params: { month } });
  return response.data;
}

export async function saveBudget(data: { category: string; monthlyLimit: number; month: string }) {
  const response = await api.post('/data/budgets', data);
  return response.data;
}

export async function deleteBudget(id: string) {
  const response = await api.delete(`/data/budgets/${id}`);
  return response.data;
}

// Gamification XP persistence
export async function persistXpGain(data: { xp: number; level: number; streak?: number; badges?: string[] }) {
  const response = await api.put('/data/gamification', data);
  return response.data;
}

// User profile update
export async function updateProfile(data: { name: string; currency?: string }) {
  const response = await api.put('/data/user/profile', data);
  return response.data;
}

export default api;
