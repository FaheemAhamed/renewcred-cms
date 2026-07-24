'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, FileText, Menu, X, ArrowUpRight, Calculator } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Book Catalog', href: '/books' },
    { name: 'Math Specifications', href: '/pages/math-specifications' },
    { name: 'API Documentation', href: '/pages/documentation' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-extrabold text-white shadow-md shadow-blue-500/30">
            R
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900">RenewCred</span>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-blue-600">
              Decentralized Credit CMS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Admin Portal Button */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="http://localhost:3000/login"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition-colors"
          >
            <span>Admin CMS Portal</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-blue-400" />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-b border-slate-200 bg-white px-4 pt-2 pb-6 md:hidden space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              {link.name}
            </Link>
          ))}
          <a
            href="http://localhost:3000/login"
            target="_blank"
            rel="noreferrer"
            className="block rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white text-center mt-4"
          >
            Admin CMS Portal
          </a>
        </div>
      )}
    </header>
  );
}
