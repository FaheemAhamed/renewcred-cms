'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema, LoginFormValues } from '@/validators/authSchema';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import { loginAdmin, clearAuthError } from '@/store/slices/authSlice';
import { Shield, Lock, Mail, Loader2, KeyRound } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAuthError());
    }
  }, [error, dispatch]);

  const onSubmit = async (values: LoginFormValues) => {
    const result = await dispatch(loginAdmin(values));
    if (loginAdmin.fulfilled.match(result)) {
      toast.success('Welcome back, Admin!');
      router.push('/dashboard');
    }
  };

  const handleFillDemoCredentials = () => {
    setValue('email', 'admin@renewcred.com');
    setValue('password', 'Admin123');
    toast.info('Demo administrator credentials filled');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-2xl border border-slate-100">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 font-extrabold text-2xl text-white shadow-xl shadow-blue-500/30">
            R
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            RenewCred CMS Access
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Authenticated Administrator Portal
          </p>
        </div>

        {/* Quick Demo Fill Button */}
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-semibold text-slate-700">Demo Admin Seed Credentials</span>
          </div>
          <button
            type="button"
            onClick={handleFillDemoCredentials}
            className="rounded bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-700 transition-colors"
          >
            Auto-fill
          </button>
        </div>

        {/* Login Form */}
        <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Admin Email
            </label>
            <div className="relative mt-1.5 rounded-lg shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-4 w-4 text-slate-400" />
              </div>
              <input
                {...register('email')}
                type="email"
                placeholder="admin@renewcred.com"
                className={`block w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                  errors.email
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600'
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Password
            </label>
            <div className="relative mt-1.5 rounded-lg shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-4 w-4 text-slate-400" />
              </div>
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className={`block w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                  errors.password
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600'
                }`}
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-rose-500">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50 transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <Shield className="h-4 w-4" />
                <span>Sign In to Admin Dashboard</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
