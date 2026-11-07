'use client';

import {
  RotateCw,
  Video,
  Download,
  Play,
  Film,
  Sparkles,
  Smartphone,
  Square,
  Monitor,
} from 'lucide-react';
import { useMotionStore } from '@/stores/motion-store';
import { useStudioStore } from '@/stores/studio-store';

interface MotionControlsProps {
  onStartRecord: () => void;
}

export function MotionControls({ onStartRecord }: MotionControlsProps) {
  const {
    rpm,
    durationSeconds,
    aspectRatio,
    isRecording,
    recordingProgress,
    recordedVideoUrl,
    setRPM,
    setDurationSeconds,
    setAspectRatio,
  } = useMotionStore();

  const { project } = useStudioStore();

  const handleDownloadVideo = () => {
    if (!recordedVideoUrl) return;
    const link = document.createElement('a');
    link.download = `turntable-360-${project.name.toLowerCase().replace(/\s+/g, '-')}-${aspectRatio.replace(':', 'x')}.webm`;
    link.href = recordedVideoUrl;
    link.click();
  };

  return (
    <div className="flex h-full w-84 flex-col border-r border-border bg-[#0C0D10] font-mono text-xs z-20 overflow-y-auto">
      {/* Header */}
      <div className="border-b border-border p-4 bg-[#090A0C]">
        <div className="text-[10px] uppercase tracking-wider text-brand-volt font-bold">
          VIRAL SHOWCASE RENDERER
        </div>
        <h2 className="text-sm font-black text-white uppercase mt-0.5">
          360° Turntable Video
        </h2>
        <p className="text-[11px] text-zinc-400 font-sans mt-1">
          Render rotational apparel loops directly in the browser via canvas stream.
        </p>
      </div>

      <div className="p-4 space-y-6">
        {/* Social Format Presets */}
        <div>
          <label className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-2">
            Social Format & Aspect Ratio
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: '9:16', label: '9:16 Reels', icon: Smartphone },
              { id: '1:1', label: '1:1 Square', icon: Square },
              { id: '16:9', label: '16:9 Hero', icon: Monitor },
            ].map((fmt) => (
              <button
                key={fmt.id}
                onClick={() => setAspectRatio(fmt.id as any)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-sm transition-colors ${
                  aspectRatio === fmt.id
                    ? 'bg-brand-volt text-black font-bold shadow'
                    : 'bg-[#07080A] text-zinc-400 hover:text-white border border-border'
                }`}
              >
                <fmt.icon className="h-4 w-4 mb-1" />
                <span className="text-[10px]">{fmt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Rotation Speed (RPM) */}
        <div>
          <label className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-2">
            Rotational Speed (RPM)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { val: 2, label: '2 RPM Slow' },
              { val: 4, label: '4 RPM Standard' },
              { val: 6, label: '6 RPM Fast' },
            ].map((speed) => (
              <button
                key={speed.val}
                onClick={() => setRPM(speed.val)}
                className={`rounded-sm py-2 text-[11px] font-bold transition-colors ${
                  rpm === speed.val
                    ? 'bg-brand-volt text-black'
                    : 'bg-[#07080A] text-zinc-400 hover:text-white border border-border'
                }`}
              >
                {speed.label}
              </button>
            ))}
          </div>
        </div>

        {/* Video Loop Duration */}
        <div>
          <label className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-2">
            Loop Duration
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[3, 5, 10].map((sec) => (
              <button
                key={sec}
                onClick={() => setDurationSeconds(sec)}
                className={`rounded-sm py-2 text-[11px] font-bold transition-colors ${
                  durationSeconds === sec
                    ? 'bg-brand-volt text-black'
                    : 'bg-[#07080A] text-zinc-400 hover:text-white border border-border'
                }`}
              >
                {sec}s Loop
              </button>
            ))}
          </div>
        </div>

        {/* Recording Action / Progress */}
        <div className="border-t border-border pt-4 space-y-3">
          {isRecording ? (
            <div className="rounded-sm border border-brand-volt/60 bg-brand-volt/10 p-4 text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-brand-volt font-bold text-xs">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                <span>RECORDING 60 FPS STREAM ({recordingProgress}%)</span>
              </div>
              <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-volt transition-all duration-100"
                  style={{ width: `${recordingProgress}%` }}
                />
              </div>
              <div className="text-[10px] text-zinc-400">
                Please do not switch tabs during render.
              </div>
            </div>
          ) : (
            <button
              onClick={onStartRecord}
              className="w-full flex items-center justify-center gap-2 rounded-sm bg-brand-volt py-3 text-xs font-bold text-black hover:bg-brand-volt/90 transition-all shadow-md shadow-brand-volt/20"
            >
              <Video className="h-4 w-4 stroke-[2.5]" />
              <span>RECORD 360° VIDEO ({durationSeconds}S)</span>
            </button>
          )}

          {/* Recorded Clip Preview & Download */}
          {recordedVideoUrl && !isRecording && (
            <div className="rounded-sm border border-border bg-[#07080A] p-3 space-y-3">
              <div className="text-[10px] uppercase text-emerald-400 font-bold flex items-center gap-1.5">
                <Film className="h-3.5 w-3.5" />
                <span>Rendered Clip Ready</span>
              </div>
              <video
                src={recordedVideoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full rounded border border-border max-h-48 object-contain bg-black"
              />
              <button
                onClick={handleDownloadVideo}
                className="w-full flex items-center justify-center gap-2 rounded-sm bg-surface border border-brand-volt text-brand-volt py-2 font-bold hover:bg-brand-volt hover:text-black transition-all"
              >
                <Download className="h-3.5 w-3.5" />
                <span>DOWNLOAD VIDEO (.WEBM)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
