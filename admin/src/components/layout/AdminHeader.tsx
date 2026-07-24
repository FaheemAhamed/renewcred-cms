'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, LogOut, User, Bell } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import { logout } from '@/store/slices/authSlice';
import { toast } from 'sonner';

interface HeaderProps {
  setMobileOpen: (open: boolean) => void;
}

export default function AdminHeader({ setMobileOpen }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const getPageTitle = () => {
    if (pathname.includes('/pages')) return 'Content & Page CMS Builder';
    if (pathname.includes('/books')) return 'Book Catalog Management';
    if (pathname.includes('/media')) return 'Media Asset Library';
    if (pathname.includes('/settings')) return 'System Settings';
    return 'Admin Dashboard';
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur transition-colors">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div>
          <h1 className="text-lg font-bold text-slate-800">{getPageTitle()}</h1>
          <p className="text-xs text-slate-500 hidden sm:block">
            RenewCred Production Administrative Panel
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          title="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600" />
        </button>

        <div className="h-6 w-px bg-slate-200" />

        {/* User Info Dropdown */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 font-semibold text-blue-700 border border-slate-200">
            <User className="h-4 w-4" />
          </div>

          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-800">{user?.username || 'Administrator'}</p>
            <span className="inline-block rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 uppercase">
              {user?.role || 'admin'}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all"
            title="Logout of admin panel"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
