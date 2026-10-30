'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import CustomDropdown from '@/components/CustomDropdown';
import { Lock, User, Shield, AlertCircle, Eye, EyeOff } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useApp();

  const initialRole = searchParams.get('role') === 'admin' ? 'admin' : 'user';
  const [role, setRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const result = await login({
        role,
        email: role === 'admin' ? '' : email,
        password
      });

      if (result.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/events');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleOptions = [
    { value: 'user', label: 'Attendee Account', icon: <User size={15} /> },
    { value: 'admin', label: 'Administrator', icon: <Shield size={15} /> }
  ];

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-11 h-11 rounded-lg bg-slate-900 text-white flex items-center justify-center mx-auto mb-3">
            <Lock size={20} />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Sign In
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Access your festival reservations or organizer console
          </p>
        </div>

        {/* Role Toggle Selector using CustomDropdown */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Account Type
          </label>
          <CustomDropdown
            options={roleOptions}
            value={role}
            onChange={(val) => {
              setRole(val);
              setErrorMessage('');
            }}
            placeholder="Select Account Type"
            ariaLabel="Select Account Type"
          />
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-2.5 rounded-lg text-xs mb-4 flex items-center gap-1.5">
            <AlertCircle size={15} className="shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email field (Hidden when Admin is selected) */}
          {role === 'user' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
            </div>
          )}

          {/* Password field */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                {role === 'admin' ? 'Admin Passcode' : 'Password'}
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-500 hover:text-slate-700 text-xs flex items-center gap-1 cursor-pointer"
              >
                {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                <span>{showPassword ? 'Hide' : 'Show'}</span>
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={
                role === 'admin'
                  ? 'Enter administrator passcode...'
                  : 'Enter your password...'
              }
              required
              className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSubmitting
              ? 'Signing In...'
              : role === 'admin'
              ? 'Access Admin Portal'
              : 'Sign In to Account'}
          </button>
        </form>

        {/* Register link */}
        {role === 'user' && (
          <div className="mt-4 text-center text-xs text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
              Register Now &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="py-16 text-center text-xs text-slate-500">
          Loading Login...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
