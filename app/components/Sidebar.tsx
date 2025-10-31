'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Category } from '@/types';

interface SidebarProps {
  categories: Category[];
}

export default function Sidebar({ categories }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-14 left-4 z-50 md:hidden glass-effect p-2 rounded-lg hover:border-blue-400 transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-56 
          glass-effect border-r border-blue-500/20
          transition-transform duration-300 z-40
          overflow-y-auto overflow-x-hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-4">
          {/* Navigation Header */}
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span>⚔️</span>
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Навигация
            </span>
          </h2>

          {/* Main Links */}
          <nav className="space-y-1.5 mb-6">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-blue-500/10 transition-colors border border-transparent hover:border-blue-500/30"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🎯</span>
                <span className="text-sm font-medium">Главная</span>
              </div>
            </Link>
            
            <Link
              href="/#catalog"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-blue-500/10 transition-colors border border-transparent hover:border-blue-500/30"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🔫</span>
                <span className="text-sm font-medium">Весь каталог</span>
              </div>
            </Link>
          </nav>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-semibold text-blue-400 uppercase mb-2 px-3">
              Категории
            </h3>
            <nav className="space-y-0.5">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/#category-${category.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-lg hover:bg-blue-500/10 transition-colors border border-transparent hover:border-blue-500/30 group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">⚡</span>
                    <span className="text-xs group-hover:text-blue-300 transition-colors">
                      {category.name}
                    </span>
                  </div>
                </Link>
              ))}
            </nav>
          </div>

          {/* Bottom Section */}
          <div className="mt-6 pt-4 border-t border-blue-500/20">
            <div className="px-3 py-2 rounded-lg bg-blue-500/5 border border-blue-500/20">
              <div className="text-xs text-blue-300 mb-0.5 font-semibold">
                ⚠️ Совет
              </div>
              <div className="text-[10px] text-gray-400 leading-tight">
                Используйте фильтры по категориям для быстрого поиска
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
