import { useState, useEffect } from 'react';
import { Users, Package, TrendingUp, DollarSign, LogOut, Menu, X } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import AdminUsers from '../components/admin/AdminUsers';
import AdminItems from '../components/admin/AdminItems';
import AdminRentals from '../components/admin/AdminRentals';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface DashboardStats {
  totalUsers: number;
  totalItems: number;
  activeRentals: number;
  totalRevenue: number;
}

type TabType = 'overview' | 'users' | 'items' | 'rentals';

export default function AdminDashboard() {
  const { admin, logout, isLoading } = useAdmin();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalItems: 0,
    activeRentals: 0,
    totalRevenue: 0,
  });
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [statsLoading, setStatsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !admin) {
      navigate('/admin/login');
    }
  }, [admin, isLoading, navigate]);

  useEffect(() => {
    if (!admin) return;

    const fetchStats = async () => {
      try {
        const [usersRes, itemsRes, rentalsRes, transactionsRes] = await Promise.all([
          supabase.from('users').select('id', { count: 'exact' }),
          supabase.from('items').select('id', { count: 'exact' }),
          supabase.from('rentals').select('id', { count: 'exact' }).eq('status', 'active'),
          supabase.from('transactions').select('amount').eq('status', 'completed'),
        ]);

        const totalRevenue = transactionsRes.data?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

        setStats({
          totalUsers: usersRes.count || 0,
          totalItems: itemsRes.count || 0,
          activeRentals: rentalsRes.count || 0,
          totalRevenue,
        });
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [admin]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            <div className="hidden md:flex items-center gap-4">
              <span className="text-slate-600">{admin?.full_name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-slate-600"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
          {mobileMenuOpen && (
            <div className="mt-4 pt-4 border-t flex flex-col gap-3">
              <span className="text-slate-600 text-sm">{admin?.full_name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors w-full justify-center"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {statsLoading ? '-' : stats.totalUsers}
                </p>
              </div>
              <Users className="h-12 w-12 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Items</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {statsLoading ? '-' : stats.totalItems}
                </p>
              </div>
              <Package className="h-12 w-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Active Rentals</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {statsLoading ? '-' : stats.activeRentals}
                </p>
              </div>
              <TrendingUp className="h-12 w-12 text-orange-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  ₱{statsLoading ? '-' : stats.totalRevenue.toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-12 w-12 text-cyan-600 opacity-20" />
            </div>
          </div>
        </div>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('items')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'items'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            Items
          </button>
          <button
            onClick={() => setActiveTab('rentals')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'rentals'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            Rentals
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Platform Overview</h2>
            <p className="text-slate-600">
              Welcome to the UniBorrow administration dashboard. Use the tabs above to manage users, items, and rental operations.
            </p>
          </div>
        )}

        {activeTab === 'users' && <AdminUsers />}
        {activeTab === 'items' && <AdminItems />}
        {activeTab === 'rentals' && <AdminRentals />}
      </div>
    </div>
  );
}
