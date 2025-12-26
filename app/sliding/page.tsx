'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

interface LogEntry {
  id: string;
  timestamp: string;
  status: 'ok' | 'error';
  message: string;
  retryIn?: number;
  latency?: number;
}

// Icons
const SearchIcon = () => (
  <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const TerminalIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ChevronDownIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-4 h-4 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ChevronUpIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-4 h-4 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
);

const TokenIcon = () => (
  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DropletIcon = () => (
  <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
  </svg>
);

export default function RateLimiter() {
  const [bucketCapacity, setBucketCapacity] = useState(10);
  const [refillRate, setRefillRate] = useState(1);
  const [availableTokens, setAvailableTokens] = useState(10);
  const [nextRefill, setNextRefill] = useState(1.0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [okCount, setOkCount] = useState(0);
  const [limitedCount, setLimitedCount] = useState(0);
  const [strategy, setStrategy] = useState<'token-bucket' | 'leaky-bucket'>('token-bucket');
  const [expandedAlgorithm, setExpandedAlgorithm] = useState<'token' | 'leaky' | null>('token');
  const [isLoading, setIsLoading] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef(Date.now());

  // Format timestamp
  const getTimestamp = () => {
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    const seconds = elapsed % 60;
    return `${String(10 + hours).padStart(2, '0')}:${String(42 + minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0').slice(0, 6)}`;
  };

  // Initialize log
  useEffect(() => {
    const initLog: LogEntry = {
      id: 'init',
      timestamp: '10:42:01.002',
      status: 'ok',
      message: `INFO TokenLimiter initialized. Capacity: ${bucketCapacity}, Rate: ${refillRate}/s`,
    };
    setLogs([initLog]);
    startTimeRef.current = Date.now();
  }, []);

  // Poll the API to get current token status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/window', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ count: bucketCapacity, duration: bucketCapacity / refillRate }),
        });
        const data = await response.json();
        if (data.capacity !== undefined) {
          setAvailableTokens(data.capacity);
        }
        
        // Use the server-calculated time until next token
        if (data.timeUntilNextToken !== undefined) {
          setNextRefill(data.timeUntilNextToken > 0 ? data.timeUntilNextToken : 0);
        }
      } catch (error) {
        console.error('Failed to fetch token status:', error);
      }
    };

    // Fetch immediately on mount
    fetchStatus();
    
    // Then poll every 200ms for smoother UI
    const interval = setInterval(fetchStatus, 200);

    return () => clearInterval(interval);
  }, [bucketCapacity, refillRate]);

  // Auto-scroll logs (only within the logs container, not the page)
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [logs]);

  // Send request to the REAL API using your TokenLimiter class!
  const sendRequest = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    const timestamp = getTimestamp();
    const startTime = Date.now();

    try {
      // Call the real API endpoint which uses your TokenLimiter class from lib/rateLimiter
      const response = await fetch('/api/window', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          count: bucketCapacity, 
          duration: bucketCapacity / refillRate // duration based on refill rate
        }),
      });

      const data = await response.json();
      const latency = Date.now() - startTime;

      // Update available tokens from server response
      setAvailableTokens(data.capacity);

      if (response.ok) {
        setOkCount((prev) => prev + 1);
        setLogs((prev) => [
          ...prev,
          {
            id: `${Date.now()}-${Math.random()}`,
            timestamp,
            status: 'ok',
            message: 'POST /api/window',
            latency,
          },
        ]);
      } else {
        setLimitedCount((prev) => prev + 1);
        setLogs((prev) => [
          ...prev,
          {
            id: `${Date.now()}-${Math.random()}`,
            timestamp,
            status: 'error',
            message: 'Rate limit exceeded',
            retryIn: data.retryIn,
          },
        ]);
      }
    } catch (error) {
      console.error('API request failed:', error);
      setLogs((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          timestamp,
          status: 'error',
          message: 'Network error',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [bucketCapacity, refillRate, isLoading]);

  return (
    <div className="min-h-screen bg-[#0f1117] text-white font-sans">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-white font-semibold">
              <div className="w-7 h-7 bg-orange-500 rounded flex items-center justify-center text-xs font-bold">
                de
              </div>
              <span>deLeet algo</span>
            </Link>
           
          </div>
     
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="#" className="hover:text-white transition-colors">Algorithms</Link>
          <span>/</span>
          <span className="text-zinc-300">Rate Limiter</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pb-12">
        {/* Title Section */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">API Rate Limiter</h1>
            <p className="text-zinc-400 max-w-xl">
              Interactive playground to visualize rate limiting strategies. Simulates a high-traffic API
              endpoint to demonstrate how requests are throttled under load.
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500 mb-2">STRATEGY</p>
            <div className="relative">
              <select
                value={strategy}
                onChange={(e) => setStrategy(e.target.value as 'token-bucket' | 'leaky-bucket')}
                className="appearance-none bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 pr-10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="token-bucket">Token Bucket</option>
                <option value="leaky-bucket" disabled>Leaky Bucket (comming soon)</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Left Panel - Configuration */}
          <div className="bg-[#1a1d24] rounded-2xl p-6 border border-zinc-800">
            <div className="flex items-center gap-2 mb-6 text-zinc-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium">Configuration</span>
            </div>

            {/* Bucket Capacity Slider */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm text-zinc-400">Bucket Capacity</label>
                <span className="text-sm text-white font-medium">{bucketCapacity}</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                value={bucketCapacity}
                onChange={(e) => setBucketCapacity(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            {/* Refill Rate Slider */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm text-zinc-400">Refill Rate</label>
                <span className="text-sm text-white font-medium">{refillRate} req / sec</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={refillRate}
                onChange={(e) => setRefillRate(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            {/* Token Display */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-[#0f1117] rounded-xl p-4 border border-zinc-800 text-center">
                <p className="text-xs text-zinc-500 mb-1">AVAILABLE TOKENS</p>
                <p className="text-4xl font-bold text-cyan-400">{availableTokens}</p>
                <p className="text-xs text-zinc-500 mt-1">of {bucketCapacity} capacity</p>
              </div>
              <div className="bg-[#0f1117] rounded-xl p-4 border border-zinc-800 text-center">
                <p className="text-xs text-zinc-500 mb-1">NEXT REFILL</p>
                <p className="text-4xl font-bold text-white">{nextRefill.toFixed(1)}s</p>
                <p className="text-xs text-zinc-500 mt-1">auto-refilling</p>
              </div>
            </div>

            {/* Send Request Button */}
            <button
              onClick={sendRequest}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-4 rounded-xl transition-all active:scale-[0.98] flex flex-col items-center gap-1"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">&gt;</span>
                <span className="text-lg font-semibold">Send Request</span>
              </div>
              <span className="text-xs text-cyan-200/70">POST /api/v1/data</span>
            </button>

            {/* Stats */}
            <div className="flex items-center justify-center gap-6 mt-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-zinc-400">{okCount} OK</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-zinc-400">{limitedCount} Limited</span>
              </div>
            </div>
          </div>

          {/* Right Panel - Server Logs */}
          <div className="bg-[#1a1d24] rounded-2xl border border-zinc-800 overflow-hidden">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#161921] border-b border-zinc-800">
              <div className="flex items-center gap-2 text-zinc-400 text-sm">
                <TerminalIcon />
                <span>server_logs ~ zsh</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>

            {/* Log Content */}
            <div className="p-4 h-[340px] overflow-y-auto font-mono text-sm">
              {logs.map((log) => (
                <div key={log.id} className={`flex items-start gap-3 py-1 ${log.status === 'error' ? 'bg-red-500/5' : ''}`}>
                  <span className="text-zinc-500 whitespace-nowrap">{log.timestamp}</span>
                  {log.status === 'ok' && log.message.startsWith('POST') ? (
                    <>
                      <span className="bg-green-600 text-white text-xs px-1.5 py-0.5 rounded font-medium">200 OK</span>
                      <span className="text-zinc-300">{log.message}</span>
                      {log.latency && <span className="text-zinc-500 ml-auto">{log.latency}ms</span>}
                    </>
                  ) : log.status === 'error' ? (
                    <>
                      <span className="bg-red-600 text-white text-xs px-1.5 py-0.5 rounded font-medium">429 ERR</span>
                      <span className="text-red-400">{log.message}</span>
                      {log.retryIn && <span className="text-red-400/70 ml-auto">Try in {log.retryIn}s</span>}
                    </>
                  ) : (
                    <span className="text-cyan-400">{log.message}</span>
                  )}
                </div>
              ))}
              <div className="flex items-center gap-2 py-1">
                <span className="text-zinc-500">→</span>
                <span className="w-2 h-4 bg-zinc-400 animate-pulse"></span>
              </div>
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>

        {/* How it works Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">How it works</h2>
          
          {/* Token Bucket Algorithm */}
          <div className="bg-[#1a1d24] rounded-xl border border-zinc-800 mb-3 overflow-hidden">
            <button
              onClick={() => setExpandedAlgorithm(expandedAlgorithm === 'token' ? null : 'token')}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-zinc-800/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <TokenIcon />
                <span className="font-medium">Token Bucket Algorithm</span>
              </div>
              {expandedAlgorithm === 'token' ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </button>
            {expandedAlgorithm === 'token' && (
              <div className="px-6 pb-6 text-sm text-zinc-400">
                <p className="mb-4">
                  The Token Bucket algorithm is based on an analogy of a bucket filled with tokens at a constant rate. Each request consumes a token.
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>A bucket holds a maximum of <span className="text-white font-medium">N</span> tokens.</li>
                  <li>Tokens are added at a rate of <span className="text-white font-medium">R</span> tokens per second.</li>
                  <li>If a request arrives and the bucket has tokens, one is removed and the request is <span className="text-green-400">Approved</span>.</li>
                  <li>If the bucket is empty, the request is <span className="text-red-400">Rejected (429)</span>.</li>
                </ul>
              </div>
            )}
          </div>

          {/* Leaky Bucket Algorithm */}
          <div className="bg-[#1a1d24] rounded-xl border border-zinc-800 overflow-hidden">
            <button
              onClick={() => setExpandedAlgorithm(expandedAlgorithm === 'leaky' ? null : 'leaky')}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-zinc-800/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <DropletIcon />
                <span className="font-medium">Leaky Bucket Algorithm</span>
              </div>
              {expandedAlgorithm === 'leaky' ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </button>
            {expandedAlgorithm === 'leaky' && (
              <div className="px-6 pb-6 text-sm text-zinc-400">
                <p className="mb-4">
                  The Leaky Bucket algorithm processes requests at a fixed rate, like water leaking from a bucket at a constant rate.
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Requests enter a queue (the bucket) with a fixed capacity.</li>
                  <li>Requests are processed at a constant rate regardless of burst traffic.</li>
                  <li>If the queue is full, new requests are <span className="text-red-400">Rejected (429)</span>.</li>
                  <li>Provides smoother output rate compared to Token Bucket.</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
