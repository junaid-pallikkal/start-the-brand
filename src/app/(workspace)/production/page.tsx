'use client';

import { useState } from 'react';
import { Printer, Sliders, Contrast, Pipette } from 'lucide-react';
import { GangsheetBuilder } from '@/features/production/components/gangsheet-builder';
import { HalftoneTool } from '@/features/production/components/halftone-tool';
import { ThresholdTool } from '@/features/production/components/threshold-tool';
import { KnockoutTool } from '@/features/production/components/knockout-tool';

export default function ProductionPage() {
  const [activeTab, setActiveTab] = useState<'gangsheet' | 'halftone' | 'threshold' | 'knockout'>(
    'gangsheet'
  );

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full flex-col overflow-hidden bg-background font-mono text-xs">
      {/* Top Utility Bar */}
      <div className="flex items-center justify-between border-b border-border bg-[#0B0C0E] px-4 py-2">
        <div className="flex items-center gap-1">
          {[
            { id: 'gangsheet', label: 'DTF Gang Sheet Builder', icon: Printer, badge: '22" & 24"' },
            { id: 'halftone', label: 'Halftone Generator', icon: Sliders, badge: 'LPI' },
            { id: 'threshold', label: 'Color Threshold', icon: Contrast, badge: '1-BIT' },
            { id: 'knockout', label: 'Knockout Color', icon: Pipette, badge: 'ΔE' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 rounded-sm px-3.5 py-1.5 transition-colors ${
                  isActive
                    ? 'bg-brand-volt text-black font-bold shadow-sm'
                    : 'bg-surface text-zinc-300 hover:text-white border border-border/60 hover:border-zinc-500'
                }`}
              >
                <tab.icon className={`h-3.5 w-3.5 ${isActive ? 'stroke-[2.5]' : 'text-zinc-400'}`} />
                <span>{tab.label}</span>
                <span
                  className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${
                    isActive ? 'bg-black/20 text-black' : 'bg-black/50 text-zinc-400'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[10px] text-zinc-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>PRODUCTION-READY OUTPUT (300 DPI)</span>
        </div>
      </div>

      {/* Main Production Workspace Tool */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'gangsheet' && <GangsheetBuilder />}
        {activeTab === 'halftone' && <HalftoneTool />}
        {activeTab === 'threshold' && <ThresholdTool />}
        {activeTab === 'knockout' && <KnockoutTool />}
      </div>
    </div>
  );
}
