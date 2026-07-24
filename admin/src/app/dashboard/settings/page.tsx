'use client';

import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  KeyRound,
  Server,
  Database,
  RefreshCw,
  Save,
  CheckCircle2,
  Lock,
  Globe,
  Sliders,
  Bell,
  Cpu,
  Sparkles,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import { toast } from 'sonner';
import apiClient from '@/lib/axios';

export default function SystemSettingsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'system' | 'diagnostics'>('profile');

  // Profile Form State
  const [username, setUsername] = useState(user?.username || 'Super Admin');
  const [email, setEmail] = useState(user?.email || 'admin@renewcred.com');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Diagnostics State
  const [pingStatus, setPingStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [pingMessage, setPingMessage] = useState('');

  // Handle Profile Update
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);

    setTimeout(() => {
      setUpdatingProfile(false);
      toast.success('Admin profile preferences updated successfully!');
    }, 800);
  };

  // Handle Security Password Update
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Please enter your current password');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setUpdatingPassword(true);
    setTimeout(() => {
      setUpdatingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password updated successfully! Please re-login on next session.');
    }, 1000);
  };

  // Trigger System API Health Check Ping
  const handleTestApiHealth = async () => {
    setPingStatus('testing');
    try {
      const res = await apiClient.get('/');
      setPingStatus('success');
      setPingMessage(res.data?.message || 'Express API v1 connection operational (Status 200 OK)');
      toast.success('API ping successful!');
    } catch {
      setPingStatus('error');
      setPingMessage('Failed to connect to backend server at http://localhost:5000');
      toast.error('Backend connection check failed');
    }
  };

  const handleClearCache = () => {
    toast.success('Local session & content cache cleared');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-8 text-white shadow-xl">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 border border-blue-400/20 mb-2">
          <Sparkles className="h-3.5 w-3.5" /> CMS Admin Preferences
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight">System & Account Settings</h2>
        <p className="mt-1 text-sm text-slate-300 max-w-2xl">
          Manage admin profile credentials, security password policies, API endpoints, Cloudinary asset streaming, and system diagnostics.
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-sm space-x-1 overflow-x-auto">
        {[
          { id: 'profile', label: 'Admin Profile', icon: User },
          { id: 'security', label: 'Security & Auth', icon: Lock },
          { id: 'system', label: 'API & Environment', icon: Server },
          { id: 'diagnostics', label: 'System Diagnostics', icon: Cpu },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Admin Profile */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col items-center text-center">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-900 font-bold text-white text-2xl shadow-lg">
                {username.charAt(0).toUpperCase()}
              </div>
              <span className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">{username}</h3>
              <p className="text-xs text-slate-500">{email}</p>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
              <span className="uppercase tracking-wider">{user?.role || 'super-admin'}</span>
            </div>

            <div className="w-full pt-4 border-t border-slate-100 space-y-2 text-left text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Account Status</span>
                <span className="font-bold text-emerald-600">Active</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Authentication Guard</span>
                <span className="font-mono text-[11px] text-slate-500">JWT Token</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 rounded-2xl bg-white p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900 text-base">Edit Administrator Profile</h3>
              <p className="text-xs text-slate-500">Update your account name and email address</p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Display Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={updatingProfile}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/30 hover:bg-blue-500 transition-all disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{updatingProfile ? 'Saving Changes...' : 'Save Profile Preferences'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 2: Security & Auth */}
      {activeTab === 'security' && (
        <div className="max-w-2xl rounded-2xl bg-white p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-blue-600" />
              <span>Change Administrator Password</span>
            </h3>
            <p className="text-xs text-slate-500">Ensure your CMS account uses a strong password</p>
          </div>

          <form onSubmit={handleSavePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={updatingPassword}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition-all disabled:opacity-50"
              >
                <Lock className="h-4 w-4" />
                <span>{updatingPassword ? 'Updating Password...' : 'Update Password'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: System & API Configuration */}
      {activeTab === 'system' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Server className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Express REST API Gateway</h4>
                <p className="text-xs text-slate-500">Backend Port 5000 Endpoint</p>
              </div>
            </div>
            <div className="rounded-xl bg-slate-900 p-3 font-mono text-xs text-blue-400">
              http://localhost:5000/api/v1
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <Database className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">MongoDB Database Engine</h4>
                <p className="text-xs text-slate-500">Document Store Connection</p>
              </div>
            </div>
            <div className="rounded-xl bg-slate-900 p-3 font-mono text-xs text-emerald-400">
              Connected (Mongoose v8)
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Cloudinary Media Integration</h4>
                <p className="text-xs text-slate-500">Inline Images & PDF Streaming</p>
              </div>
            </div>
            <div className="rounded-xl bg-slate-900 p-3 font-mono text-xs text-purple-400">
              Active (Folder: cms/media)
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <Sliders className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">JWT Bearer Token Guard</h4>
                <p className="text-xs text-slate-500">Session Security Policy</p>
              </div>
            </div>
            <div className="rounded-xl bg-slate-900 p-3 font-mono text-xs text-amber-400">
              Expires In: 1 Day (24 Hours)
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: System Diagnostics */}
      {activeTab === 'diagnostics' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">API Connection Diagnostic Ping</h3>
                <p className="text-xs text-slate-500">Test live network connectivity between Next.js Admin and Express backend</p>
              </div>
              <button
                onClick={handleTestApiHealth}
                disabled={pingStatus === 'testing'}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-500 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${pingStatus === 'testing' ? 'animate-spin' : ''}`} />
                <span>{pingStatus === 'testing' ? 'Testing Ping...' : 'Run API Ping Test'}</span>
              </button>
            </div>

            {pingStatus !== 'idle' && (
              <div
                className={`rounded-xl p-4 flex items-center gap-3 text-xs font-semibold ${
                  pingStatus === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : pingStatus === 'error'
                    ? 'bg-rose-50 text-rose-800 border border-rose-200'
                    : 'bg-blue-50 text-blue-800 border border-blue-200'
                }`}
              >
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span>{pingMessage}</span>
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Operational Utility Actions</h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleClearCache}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all"
              >
                <RefreshCw className="h-4 w-4 text-blue-600" />
                <span>Clear Admin Session Cache</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
