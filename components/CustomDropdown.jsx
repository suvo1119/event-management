'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomDropdown({
  options = [],
  value,
  onChange,
  placeholder = 'Select option',
  ariaLabel = 'Select option',
  disabled = false,
  className = '',
  style = {}
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') setIsOpen(false);
    }
    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  const handleSelect = (optValue) => {
    onChange(optValue);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`} style={style}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        className={`w-full flex items-center justify-between gap-2.5 bg-white border rounded-lg px-3.5 py-2.5 text-sm text-left transition-colors duration-150 ${
          disabled
            ? 'cursor-not-allowed opacity-60 bg-slate-100 border-slate-200'
            : 'cursor-pointer'
        } ${
          isOpen
            ? 'border-slate-900 ring-1 ring-slate-900'
            : 'border-slate-300 hover:border-slate-400'
        } ${selectedOption ? 'text-slate-900 font-medium' : 'text-slate-400'}`}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption?.icon && (
            <span className="inline-flex shrink-0 text-slate-500">
              {selectedOption.icon}
            </span>
          )}
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-slate-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 bg-white border border-slate-200 rounded-lg p-1 max-h-60 overflow-y-auto shadow-xl"
        >
          {options.map((opt) => {
            const isSelected = String(opt.value) === String(value);
            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.value)}
                className={`flex items-center justify-between px-3 py-2 rounded-md text-sm cursor-pointer transition-colors duration-100 ${
                  isSelected
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {opt.icon && (
                    <span className="inline-flex shrink-0 text-slate-500">
                      {opt.icon}
                    </span>
                  )}
                  <span className="truncate">{opt.label}</span>
                </div>
                {isSelected && (
                  <Check size={16} className="shrink-0 text-slate-900 ml-2" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
