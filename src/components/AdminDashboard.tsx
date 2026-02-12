import { useState, useEffect } from 'react';
import { LogOut, LayoutDashboard, MapPin, TrendingUp, Users, Package } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AdminDashboardProps {
  onLogout: () => void;
  userEmail: string;
}

export default function AdminDashboard({ onLogout, userEmail }: AdminDashboardProps) {
  const [stats, setStats] = useState({
    activeItems: 2543,
    totalUsers: 847,
    safeZones: 3,
    monthlyRevenue: 12500,
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-slate-600">{userEmail}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Active Items</p>
                <p className="text-3xl font-bold text-slate-900">{stats.activeItems}</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-full">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-slate-900">{stats.totalUsers}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-full">
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Safe Zones</p>
                <p className="text-3xl font-bold text-slate-900">{stats.safeZones}</p>
              </div>
              <div className="bg-orange-100 p-4 rounded-full">
                <MapPin className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Monthly Revenue</p>
                <p className="text-3xl font-bold text-slate-900">${stats.monthlyRevenue}</p>
              </div>
              <div className="bg-cyan-100 p-4 rounded-full">
                <TrendingUp className="h-8 w-8 text-cyan-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Transactions</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-slate-200">
                <div>
                  <p className="font-semibold text-slate-900">Camera Rental</p>
                  <p className="text-sm text-slate-600">John D. → Sarah M.</p>
                </div>
                <span className="text-green-600 font-semibold">+$50</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-200">
                <div>
                  <p className="font-semibold text-slate-900">Bike Rental</p>
                  <p className="text-sm text-slate-600">Mike J. → Emma L.</p>
                </div>
                <span className="text-green-600 font-semibold">+$30</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-200">
                <div>
                  <p className="font-semibold text-slate-900">Guitar Rental</p>
                  <p className="text-sm text-slate-600">Alex K. → Taylor B.</p>
                </div>
                <span className="text-green-600 font-semibold">+$35</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Safe Zones</h2>
            <div className="space-y-4">
              <div className="p-4 border border-slate-200 rounded-lg">
                <p className="font-semibold text-slate-900">Student Union</p>
                <p className="text-sm text-slate-600">Main lobby, near information desk</p>
                <span className="inline-block mt-2 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">Active</span>
              </div>
              <div className="p-4 border border-slate-200 rounded-lg">
                <p className="font-semibold text-slate-900">Library Entrance</p>
                <p className="text-sm text-slate-600">Main entrance, security desk area</p>
                <span className="inline-block mt-2 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">Active</span>
              </div>
              <div className="p-4 border border-slate-200 rounded-lg">
                <p className="font-semibold text-slate-900">Recreation Center</p>
                <p className="text-sm text-slate-600">Front desk, monitored area</p>
                <span className="inline-block mt-2 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
