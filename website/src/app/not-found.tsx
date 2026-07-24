import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
        <span className="text-6xl font-black text-blue-600">404</span>
        <h1 className="text-2xl font-bold text-slate-900">Page Not Found</h1>
        <p className="text-xs text-slate-500 max-w-sm">
          The page or dynamic resource you are searching for could not be found on RenewCred platform.
        </p>
        <Link
          href="/"
          className="inline-block rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all"
        >
          Return to Homepage
        </Link>
      </main>

      <Footer />
    </div>
  );
}
