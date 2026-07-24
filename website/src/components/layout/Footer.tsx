import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-extrabold text-white">
                R
              </div>
              <span className="font-extrabold text-lg text-white">RenewCred</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Decentralized credit management & dynamic headless CMS rendering actuarial LaTeX models and dynamic block layouts.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/" className="hover:text-white">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link href="/books" className="hover:text-white">
                  Book Catalog
                </Link>
              </li>
              <li>
                <Link href="/pages/math-specifications" className="hover:text-white">
                  Actuarial Math Models
                </Link>
              </li>
              <li>
                <Link href="/pages/documentation" className="hover:text-white">
                  API & Developer Docs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Dynamic Block Rendering</li>
              <li>KaTeX Math Typesetting</li>
              <li>Multi-column Data Tables</li>
              <li>Hierarchical Nested Lists</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              System Gateway
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Content is dynamically served via backend Express REST endpoints.
            </p>
            <a
              href="http://localhost:3000/login"
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-500"
            >
              Sign In to CMS Dashboard
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} RenewCred CMS. Built for enterprise production standards.
        </div>
      </div>
    </footer>
  );
}
