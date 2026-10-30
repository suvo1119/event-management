'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Ticket,
  Shield,
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
  AlertTriangle
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, isAdmin, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef(null);

  const isActive = (path) => pathname === path;

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    setProfileDropdownOpen(false);
    router.push('/');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Ticket size={18} />
            </div>
            <div>
              <div className="text-base font-extrabold tracking-tight text-slate-900 leading-tight">
                Festivault
              </div>
              <div className="text-[10px] text-slate-500 font-semibold leading-none">
                Event Management
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links - No Admin Portal button */}
          <nav className="hidden md:flex items-center gap-1.5">
            <Link
              href="/"
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </Link>
            <Link
              href="/events"
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive('/events')
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Explore Events
            </Link>
            <Link
              href="/bookings"
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive('/bookings')
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              My Bookings
            </Link>
            <Link
              href="/menu"
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive('/menu')
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Menu
            </Link>
          </nav>

          {/* User Account Actions */}
          <div className="flex items-center gap-2.5">
            {currentUser || isAdmin ? (
              <div className="relative" ref={dropdownRef}>
                {/* Profile Avatar Button */}
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
                  aria-expanded={profileDropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                    {isAdmin ? (
                      <Shield size={14} className="text-white" />
                    ) : (
                      currentUser?.full_name?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>
                  <span className="hidden sm:inline-block text-xs font-semibold text-slate-800 max-w-[120px] truncate">
                    {isAdmin ? 'Administrator' : currentUser?.full_name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>

                {/* Profile Popover Dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg p-3 z-50">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                        {isAdmin ? (
                          <Shield size={18} />
                        ) : (
                          currentUser?.full_name?.charAt(0).toUpperCase() || 'U'
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-slate-900 truncate">
                          {isAdmin ? 'Administrator' : currentUser?.full_name}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {isAdmin ? 'admin@festivault.local' : currentUser?.email}
                        </div>
                        <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {isAdmin ? 'Admin Console' : 'Attendee Account'}
                        </span>
                      </div>
                    </div>

                    <div className="py-2 space-y-1">
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                          <Shield size={14} className="text-blue-600" />
                          <span>Admin Portal Dashboard</span>
                        </Link>
                      )}
                      <Link
                        href="/bookings"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        <Ticket size={14} className="text-slate-500" />
                        <span>My Booked Tickets</span>
                      </Link>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          setShowLogoutConfirm(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer text-left"
                      >
                        <LogOut size={14} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown - No Admin Portal button */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/') ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              Home
            </Link>
            <Link
              href="/events"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/events') ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              Explore Events
            </Link>
            <Link
              href="/bookings"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/bookings') ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              My Bookings
            </Link>
            <Link
              href="/menu"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/menu') ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              Menu
            </Link>
          </div>
        )}
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="w-full max-w-sm bg-white border border-slate-200 rounded-xl p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <AlertTriangle size={20} />
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-1.5">
              Confirm Sign Out
            </h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Are you sure you want to sign out of your account? Any unsaved progress will be cleared.
            </p>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2 px-3.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="flex-1 py-2 px-3.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
