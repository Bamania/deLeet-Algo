'use client';

import { useState, useEffect, useCallback } from 'react';
// @ts-ignore
import { ChevronRight, RotateCcw, Zap } from 'lucide-react';

interface Request {
  id: string;
  timestamp: number;
  allowed: boolean;
}

export default function SlidingWindow() {
  const [mode, setMode] = useState<'fixed' | 'sliding'>('fixed');
  const [currentTime, setCurrentTime] = useState(0);
  const [windowSize, setWindowSize] = useState(60);
  const [maxRequests, setMaxRequests] = useState(5);
  const [requests, setRequests] = useState<Request[]>([]);
  const [insight, setInsight] = useState('Ready to send requests.');

  // Calculate allowed/blocked counts based on algorithm
  const getAlgorithmStats = useCallback(() => {
    if (mode === 'fixed') {
      // Fixed counter: resets every windowSize seconds
      const lastResetTime = Math.floor(currentTime / windowSize) * windowSize;
      const requestsInCurrentWindow = requests.filter(
        (r) => r.timestamp >= lastResetTime && r.timestamp < lastResetTime + windowSize
      );
      return {
        allowed: requestsInCurrentWindow.filter((r) => r.allowed).length,
        blocked: requestsInCurrentWindow.filter((r) => !r.allowed).length,
        requestsInWindow: requestsInCurrentWindow,
      };
    } else {
      // Sliding window: tracks last windowSize seconds
      const windowStart = Math.max(0, currentTime - windowSize);
      const requestsInWindow = requests.filter(
        (r) => r.timestamp >= windowStart && r.timestamp <= currentTime
      );
      return {
        allowed: requestsInWindow.filter((r) => r.allowed).length,
        blocked: requestsInWindow.filter((r) => !r.allowed).length,
        requestsInWindow: requestsInWindow,
      };
    }
  }, [mode, currentTime, windowSize, requests, maxRequests]);

  const stats = getAlgorithmStats();

  // Send single request
  const sendRequest = useCallback(() => {
    const newRequest: Request = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: currentTime,
      allowed: stats.allowed < maxRequests,
    };

    setRequests((prev) => [...prev, newRequest]);

    if (newRequest.allowed) {
      setInsight('✓ Request allowed.');
    } else {
      setInsight(`✗ Blocked: window contains ${stats.allowed} requests.`);
    }
  }, [currentTime, stats.allowed, maxRequests]);

  // Send 5 burst requests
  const sendBurst = useCallback(() => {
    let allowedCount = 0;
    let blockedCount = 0;
    const newRequests: Request[] = [];

    for (let i = 0; i < 5; i++) {
      const isAllowed = allowedCount < maxRequests;
      newRequests.push({
        id: `${Date.now()}-${i}-${Math.random()}`,
        timestamp: currentTime + i * 0.1,
        allowed: isAllowed,
      });
      if (isAllowed) allowedCount++;
      else blockedCount++;
    }

    setRequests((prev) => [...prev, ...newRequests]);
    if (blockedCount > 0) {
      setInsight(`Burst sent: ${allowedCount} allowed, ${blockedCount} blocked.`);
    } else {
      setInsight('Burst sent: all 5 requests allowed.');
    }
  }, [currentTime, maxRequests]);

  // Advance time
  const advanceTime = useCallback((seconds: number) => {
    setCurrentTime((prev) => prev + seconds);
    setInsight(`⏱ Time advanced by ${seconds}s.`);
  }, []);

  // Reset simulation
  const reset = useCallback(() => {
    setCurrentTime(0);
    setRequests([]);
    setInsight('Simulation reset.');
  }, []);

  // Auto-fade old requests
  useEffect(() => {
    if (mode === 'sliding') {
      const windowStart = Math.max(0, currentTime - windowSize);
      setRequests((prev) =>
        prev.filter((r) => r.timestamp >= windowStart - 5) // Keep 5s grace period for animation
      );
    }
  }, [currentTime, windowSize, mode]);

  // Timeline visualization
  const timelineStart = Math.max(0, currentTime - windowSize - 10);
  const timelineEnd = currentTime + 10;
  const timelineLength = timelineEnd - timelineStart;

  const getRequestPosition = (timestamp: number) => {
    return ((timestamp - timelineStart) / timelineLength) * 100;
  };

  const getWindowStart = () => {
    if (mode === 'fixed') {
      const lastResetTime = Math.floor(currentTime / windowSize) * windowSize;
      return ((lastResetTime - timelineStart) / timelineLength) * 100;
    } else {
      return ((Math.max(0, currentTime - windowSize) - timelineStart) / timelineLength) * 100;
    }
  };

  const windowStartPercent = getWindowStart();
  const windowEndPercent = ((currentTime - timelineStart) / timelineLength) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Sliding Window</h1>
            <p className="text-slate-600">
              See why rate limiting needs sliding window, not just a counter.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-600">DeLeet Algo</p>
            <p className="text-xs text-slate-500">Stop grinding. Start understanding.</p>
          </div>
        </div>
      </div>

      {/* Main Three-Column Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-3 gap-6">
        {/* LEFT PANEL - Controls */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Attack Zone</h2>

          {/* Algorithm Toggle */}
          <div className="mb-8">
            <label className="text-sm font-medium text-slate-700 block mb-3">
              Algorithm Mode
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setMode('fixed')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                  mode === 'fixed'
                    ? 'bg-red-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Fixed Counter
              </button>
              <button
                onClick={() => setMode('sliding')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                  mode === 'sliding'
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Sliding Window
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {mode === 'fixed'
                ? 'Counter resets every period. Bursts slip through.'
                : 'Tracks last N seconds. No escape.'}
            </p>
          </div>

          {/* Request Buttons */}
          <div className="space-y-2 mb-8">
            <button
              onClick={sendRequest}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-all active:scale-95 shadow-sm"
            >
              Send Request
            </button>
            <button
              onClick={sendBurst}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 rounded-lg transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2"
            >
              <Zap size={16} />
              Burst Requests (×5)
            </button>
          </div>

          {/* Time Controls */}
          <div className="mb-8">
            <label className="text-sm font-medium text-slate-700 block mb-3">
              Advance Time
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => advanceTime(5)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 rounded-lg transition-all text-sm"
              >
                +5s
              </button>
              <button
                onClick={() => advanceTime(10)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 rounded-lg transition-all text-sm"
              >
                +10s
              </button>
              <button
                onClick={() => advanceTime(30)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 rounded-lg transition-all text-sm col-span-2"
              >
                +30s
              </button>
            </div>
          </div>

          {/* Reset */}
          <button
            onClick={reset}
            className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-2 mb-8"
          >
            <RotateCcw size={16} />
            Reset Simulation
          </button>

          {/* Sliders */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-slate-700">Window Size</label>
                <span className="text-sm font-semibold text-blue-600">{windowSize}s</span>
              </div>
              <input
                type="range"
                min="20"
                max="120"
                step="10"
                value={windowSize}
                onChange={(e) => setWindowSize(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-slate-700">Max Requests</label>
                <span className="text-sm font-semibold text-emerald-600">{maxRequests}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={maxRequests}
                onChange={(e) => setMaxRequests(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* CENTER PANEL - Visualization */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Aha Zone</h2>

          {/* Timeline Container */}
          <div className="space-y-6">
            {/* Time Labels */}
            <div className="text-xs text-slate-500 flex justify-between px-1">
              <span>{Math.max(0, Math.floor(timelineStart))}s</span>
              <span>{Math.floor(currentTime)}s (now)</span>
              <span>{Math.ceil(timelineEnd)}s</span>
            </div>

            {/* Timeline Track */}
            <div className="relative h-64 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 overflow-hidden">
              {/* Window Background Highlight */}
              <div
                className={`absolute top-0 bottom-0 transition-all ${
                  mode === 'fixed' ? 'bg-red-50' : 'bg-emerald-50'
                }`}
                style={{
                  left: `${windowStartPercent}%`,
                  width: `${Math.max(0, windowEndPercent - windowStartPercent)}%`,
                }}
              />

              {/* Window Border */}
              <div
                className={`absolute top-0 bottom-0 border-l-2 transition-all ${
                  mode === 'fixed' ? 'border-red-300' : 'border-emerald-300'
                }`}
                style={{ left: `${windowStartPercent}%` }}
              />
              <div
                className={`absolute top-0 bottom-0 border-r-2 transition-all ${
                  mode === 'fixed' ? 'border-red-400' : 'border-emerald-400'
                }`}
                style={{ left: `${windowEndPercent}%` }}
              />

              {/* Request Dots */}
              <div className="absolute inset-0 flex items-center">
                {requests.map((req) => {
                  const position = getRequestPosition(req.timestamp);
                  const isInWindow =
                    position >= windowStartPercent && position <= windowEndPercent;
                  const isExpired = req.timestamp < timelineStart;

                  return (
                    <div
                      key={req.id}
                      className={`absolute w-3 h-3 rounded-full transition-all ${
                        isExpired
                          ? 'opacity-10 bg-slate-400'
                          : req.allowed
                            ? 'opacity-100 bg-emerald-500 shadow-lg'
                            : 'opacity-100 bg-red-500 shadow-lg'
                      }`}
                      style={{
                        left: `calc(${position}% - 6px)`,
                        top: `${20 + (Math.random() * 60)}px`,
                      }}
                      title={`${req.allowed ? '✓' : '✗'} at ${req.timestamp.toFixed(1)}s`}
                    />
                  );
                })}
              </div>

              {/* Current Time Indicator */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-blue-500 transition-all"
                style={{ left: `${windowEndPercent}%` }}
              >
                <div className="absolute top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-slate-600">Allowed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-slate-600">Blocked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-300" />
                <span className="text-slate-600">Expired</span>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-slate-700">
              <p className="font-medium text-blue-900 mb-1">💡 Try this:</p>
              <p>
                {mode === 'fixed'
                  ? 'Send a burst, advance time by 30s, then burst again. See how the counter resets?'
                  : 'Send a burst, advance time by 30s, then burst again. The window prevents the trick.'}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Insights */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Silent Teacher</h2>

          <div className="space-y-6">
            {/* Live Stats */}
            <div className="space-y-3">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-xs text-slate-600 mb-1">Current Time</p>
                <p className="text-2xl font-bold text-blue-600">{currentTime.toFixed(1)}s</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                  <p className="text-xs text-slate-600 mb-1">Allowed</p>
                  <p className="text-2xl font-bold text-emerald-600">{stats.allowed}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <p className="text-xs text-slate-600 mb-1">Blocked</p>
                  <p className="text-2xl font-bold text-red-600">{stats.blocked}</p>
                </div>
              </div>

              <div className="bg-slate-100 rounded-lg p-4">
                <p className="text-xs text-slate-600 mb-1">Total in Window</p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.requestsInWindow.length} / {maxRequests}
                </p>
              </div>
            </div>

            {/* Reactive Insight */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-300 rounded-lg p-4">
              <p className="text-sm font-medium text-amber-900 leading-relaxed">{insight}</p>
            </div>

            {/* Algorithm Explanation */}
            <div className="bg-slate-50 border border-slate-300 rounded-lg p-4 space-y-3">
              <p className="text-xs font-semibold text-slate-900 uppercase tracking-wide">
                {mode === 'fixed' ? 'Fixed Counter' : 'Sliding Window'}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                {mode === 'fixed'
                  ? 'Resets every period. Bad actors wait for reset, then burst.'
                  : 'Always tracks the last N seconds. Bursts never slip through.'}
              </p>

              {/* Comparison */}
              <div className="text-xs space-y-1 pt-2 border-t border-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-600">Predictable</span>
                  <span className="text-slate-900 font-medium">
                    {mode === 'fixed' ? '❌' : '✓'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Exploitable</span>
                  <span className="text-slate-900 font-medium">
                    {mode === 'fixed' ? '✓' : '❌'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-12 text-center text-xs text-slate-500">
        <p>Real-world rate limiting playground. No LeetCode. No blog. Just understanding.</p>
      </div>
    </div>
  );
}
