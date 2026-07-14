import React from 'react';

interface Props {
  data: any;
  depth?: number;
}

export const DynamicResultRenderer: React.FC<Props> = ({ data, depth = 0 }) => {
  if (data === null || data === undefined) {
    return <span className="text-slate-500 italic">N/A</span>;
  }

  // Handle strings
  if (typeof data === 'string') {
    if (data.startsWith('http://') || data.startsWith('https://')) {
      return (
        <a href={data} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 hover:underline break-all">
          {data}
        </a>
      );
    }
    return <span className="text-slate-300 break-words whitespace-pre-wrap">{data}</span>;
  }

  // Handle numbers
  if (typeof data === 'number') {
    return <span className="text-electric-indigo font-bold text-lg">{data}</span>;
  }

  // Handle booleans
  if (typeof data === 'boolean') {
    return data ? (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
        <span className="material-symbols-outlined text-[14px]">check_circle</span> Yes
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-error/10 text-error border border-error/20">
        <span className="material-symbols-outlined text-[14px]">cancel</span> No
      </span>
    );
  }

  // Handle arrays
  if (Array.isArray(data)) {
    if (data.length === 0) return <span className="text-slate-500 italic">Empty list</span>;
    
    // If it's an array of simple strings/numbers, render as pills
    if (data.every(item => typeof item === 'string' || typeof item === 'number')) {
      return (
        <div className="flex flex-wrap gap-2">
          {data.map((item, idx) => (
            <span key={idx} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-slate-300">
              {item}
            </span>
          ))}
        </div>
      );
    }
    
    // Array of objects
    return (
      <div className="space-y-4 w-full">
        {data.map((item, idx) => (
          <div key={idx} className="p-4 rounded-xl border border-white/5 bg-black/20">
            <DynamicResultRenderer data={item} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  }

  // Handle Objects
  if (typeof data === 'object') {
    const entries = Object.entries(data).filter(([k]) => k !== 'message' && k !== 'error');
    if (entries.length === 0) return null;

    // Clean up keys (e.g. status_code -> Status Code)
    const formatKey = (key: string) => {
      return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
      <div className={`grid gap-4 ${depth === 0 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
        {entries.map(([key, value]) => (
          <div key={key} className={`glass-card p-4 rounded-xl border border-white/5 bg-slate-900/40 ${typeof value === 'object' && value !== null ? 'md:col-span-2' : ''}`}>
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {formatKey(key)}
            </span>
            <div className="mt-1">
              <DynamicResultRenderer data={value} depth={depth + 1} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <span className="text-slate-300">{String(data)}</span>;
};
