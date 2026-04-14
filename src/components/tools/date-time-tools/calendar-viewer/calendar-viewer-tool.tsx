'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CalendarDays, Grid, FileDown } from 'lucide-react';

type ViewMode = 'year' | 'month';
type PickerViewMode = 'months' | 'years';

export default function CalendarViewer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [viewMode, setViewMode] = useState<ViewMode>('year');
  const [today, setToday] = useState(new Date());

  // Picker states
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(currentYear);
  const [pickerView, setPickerView] = useState<PickerViewMode>('months');
  
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setToday(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsPickerOpen(false);
      }
    };
    if (isPickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPickerOpen]);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const shortDaysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const goBackward = () => {
    if (viewMode === 'year') {
      setCurrentYear(p => p - 1);
    } else {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(p => p - 1);
      } else {
        setCurrentMonth(p => p - 1);
      }
    }
  };

  const goForward = () => {
    if (viewMode === 'year') {
      setCurrentYear(p => p + 1);
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(p => p + 1);
      } else {
        setCurrentMonth(p => p + 1);
      }
    }
  };

  const jumpToToday = () => {
    const d = new Date();
    setCurrentYear(d.getFullYear());
    setCurrentMonth(d.getMonth());
  };

  const handlePdfDownload = () => {
    window.print();
  };

  const renderMonthGrid = (monthIndex: number, isLarge: boolean = false) => {
    const daysInMonth = getDaysInMonth(currentYear, monthIndex);
    const firstDay = getFirstDayOfMonth(currentYear, monthIndex);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDay }, (_, i) => i);
    const dayHeaders = isLarge ? daysOfWeek : shortDaysOfWeek;

    return (
      <div key={months[monthIndex]} className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 print:shadow-none print:border-gray-300 print:p-2 ${isLarge ? 'min-h-[600px] print:min-h-0 flex flex-col' : 'hover:shadow-md transition-shadow'}`}>
        <h3 className={`font-semibold text-emerald-700 mb-4 print:mb-2 ${isLarge ? 'text-3xl print:text-2xl border-b pb-4 print:pb-2' : 'text-xl print:text-lg'}`}>
          {months[monthIndex]} {isLarge && <span className="text-gray-400 font-normal ml-2">{currentYear}</span>}
        </h3>
        
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {dayHeaders.map(day => (
            <div key={day} className={`font-semibold text-gray-400 py-1 ${isLarge ? 'text-sm' : 'text-xs'}`}>
              {day}
            </div>
          ))}
        </div>

        <div className={`grid grid-cols-7 gap-1 text-center ${isLarge ? 'flex-1 print:flex-none' : ''}`}>
          {blanks.map(blank => (
            <div key={`blank-${blank}`} className={`p-2 border border-transparent ${isLarge ? 'min-h-[80px] print:min-h-0 print:py-6' : ''}`} />
          ))}
          
          {days.map(day => {
            const isToday = today.getDate() === day && 
                          today.getMonth() === monthIndex && 
                          today.getFullYear() === currentYear;
            
            return (
              <div 
                key={day} 
                className={`flex flex-col items-center print:break-inside-avoid
                  ${isLarge ? 'border border-gray-100 p-2 min-h-[80px] print:min-h-0 print:py-6 rounded-lg print:border-gray-300' : 'p-2 rounded-full justify-center'}
                  ${isToday && !isLarge ? 'bg-emerald-500 print:bg-emerald-100 text-white print:text-emerald-800 font-bold shadow-sm' : ''}
                  ${isToday && isLarge ? 'bg-emerald-50 print:bg-emerald-50 border-emerald-500 text-emerald-700 font-bold' : 'text-gray-700'}
                  ${!isToday && !isLarge ? 'hover:bg-emerald-50 transition-colors cursor-default print:border print:border-transparent' : ''}
                `}
              >
                <div className={`
                  ${isLarge ? 'w-full text-right font-medium mb-1' : 'text-sm'}
                  ${isToday && isLarge ? 'text-emerald-700 font-bold' : ''}
                `}>
                  {day}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Logic for the decade picker
  const startDecade = Math.floor(pickerYear / 10) * 10;
  
  // 12 items for decade view (prev decade last year, the decade (10 yrs), next decade first year)
  const decadeYears = Array.from({ length: 12 }, (_, i) => startDecade - 1 + i);

  return (
    <div className="py-8 print:py-0 printable-calendar-container print:h-auto">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          /* Tight margins, specifically targeting standard US Letter/A4 */
          @page { margin: 8mm; size: auto; }
          
          body, html {
            height: auto !important;
            min-height: auto !important;
            overflow: visible !important;
          }
          body * {
            visibility: hidden;
          }
          /* Bring our container into visibility */
          .printable-calendar-container, .printable-calendar-container * {
            visibility: visible;
          }
          
          .printable-calendar-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          .control-panel {
            display: none !important;
          }
          
          .print-year-grid {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            grid-template-rows: auto !important;
            gap: 10px !important;
            page-break-inside: avoid;
            align-content: start;
          }
          
          .print-year-grid > div {
             box-sizing: border-box !important;
             break-inside: avoid;
             page-break-inside: avoid;
             box-shadow: none !important;
             border: 1px solid #d1d5db !important;
             padding: 8px !important;
             margin-bottom: 0 !important;
          }

          /* General spacing reductions to avoid 2nd page spillover */
          h1.print\\:block {
            margin-top: 0 !important;
            margin-bottom: 12px !important;
          }
          
          .print\\:py-6 {
            padding-top: 15px !important;
            padding-bottom: 15px !important;
          }
        }
      `}} />

      <div className="max-w-6xl mx-auto px-4 print:px-0">
        
        {/* Controls */}
        <div className="control-panel mb-8 flex flex-col xl:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-emerald-100 relative z-10">
          
          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('month')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === 'month' ? 'bg-white shadow-sm text-emerald-700' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <CalendarIcon size={18} /> Month
              </button>
              <button
                onClick={() => setViewMode('year')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === 'year' ? 'bg-white shadow-sm text-emerald-700' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <Grid size={18} /> Year
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={jumpToToday}
                className="px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition-colors"
              >
                Today
              </button>
              <div className="flex items-center gap-1">
                <button onClick={goBackward} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors" title="Previous">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={goForward} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors" title="Next">
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Google-Style Dropdown Picker */}
              <div className="relative" ref={pickerRef}>
                <button 
                  onClick={() => {
                    setPickerYear(currentYear);
                    setPickerView('months');
                    setIsPickerOpen(!isPickerOpen);
                  }}
                  className="px-4 py-2 text-2xl font-normal text-gray-800 hover:bg-gray-100 rounded-lg transition-colors min-w-[160px] text-left flex items-center"
                >
                  {viewMode === 'month' ? `${months[currentMonth]} ` : ''}{currentYear}
                </button>

                {isPickerOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 p-4 z-50 w-72">
                    
                    {/* Picker Header */}
                    <div className="flex items-center justify-between mb-4">
                      <button 
                        onClick={() => {
                          if (pickerView === 'months') {
                            setPickerYear(y => y - 1);
                          } else {
                            setPickerYear(y => y - 10);
                          }
                        }} 
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      
                      {pickerView === 'months' ? (
                        <button 
                          onClick={() => setPickerView('years')}
                          className="font-semibold text-gray-900 hover:bg-gray-100 px-3 py-1 rounded-md transition-colors"
                        >
                          {pickerYear}
                        </button>
                      ) : (
                        <span className="font-semibold text-gray-900 px-3 py-1">
                          {startDecade} - {startDecade + 9}
                        </span>
                      )}

                      <button 
                        onClick={() => {
                          if (pickerView === 'months') {
                            setPickerYear(y => y + 1);
                          } else {
                            setPickerYear(y => y + 10);
                          }
                        }} 
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>

                    {/* Picker Body : Months vs Years */}
                    <div className="grid grid-cols-3 gap-2">
                      {pickerView === 'months' ? (
                        months.map((m, idx) => {
                          const isSelected = currentYear === pickerYear && currentMonth === idx;
                          return (
                            <button
                              key={m}
                              onClick={() => {
                                setCurrentYear(pickerYear);
                                setCurrentMonth(idx);
                                if (viewMode === 'year') setViewMode('month');
                                setIsPickerOpen(false);
                              }}
                              className={`p-2 py-3 rounded-lg text-sm font-medium transition-colors
                                ${isSelected 
                                  ? 'bg-emerald-600 text-white' 
                                  : 'hover:bg-emerald-50 text-gray-700'
                                }`}
                            >
                              {m.substring(0, 3)}
                            </button>
                          );
                        })
                      ) : (
                        decadeYears.map((y) => {
                          const isSelected = currentYear === y;
                          const isOutsideDecade = y < startDecade || y > startDecade + 9;
                          
                          return (
                            <button
                              key={y}
                              onClick={() => {
                                setPickerYear(y);
                                setPickerView('months');
                              }}
                              className={`p-2 py-3 rounded-lg text-sm font-medium transition-colors
                                ${isSelected 
                                  ? 'bg-emerald-600 text-white' 
                                  : isOutsideDecade 
                                    ? 'hover:bg-gray-100 text-gray-400' 
                                    : 'hover:bg-emerald-50 text-gray-700'
                                }`}
                            >
                              {y}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePdfDownload}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 font-medium shadow-sm"
            >
              <FileDown size={18} /> Print PDF
            </button>
          </div>
        </div>

        {/* Print Content Wrapper to tightly bind height */}
        <div className="print:h-auto print:min-h-0">
          
          {/* Print Header that only shows during print */}
          <div className="hidden print:block mb-4 text-center border-b border-gray-200 pb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              {viewMode === 'month' ? `${months[currentMonth]} ${currentYear}` : `Calendar Year ${currentYear}`}
            </h1>
          </div>

          {/* Grid display depending on view mode */}
          {viewMode === 'year' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 print-year-grid">
              {months.map((month, idx) => renderMonthGrid(idx, false))}
            </div>
          ) : (
            <div className="w-full relative z-0">
              {renderMonthGrid(currentMonth, true)}
            </div>
          )}

          {/* Print Footer */}
          <div className="hidden print:block text-center mt-6 pt-2 text-gray-500 font-semibold text-sm">
            @FreeDevTools.Studio
          </div>
          
        </div>
      </div>
    </div>
  );
}
