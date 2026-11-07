import { create } from 'zustand';

interface MotionState {
  rpm: number; // 2, 4, 6
  durationSeconds: number; // 3, 5, 10
  aspectRatio: '9:16' | '1:1' | '16:9';
  isRecording: boolean;
  recordingProgress: number; // 0 to 100
  recordedVideoUrl: string | null;

  setRPM: (rpm: number) => void;
  setDurationSeconds: (seconds: number) => void;
  setAspectRatio: (ratio: '9:16' | '1:1' | '16:9') => void;
  setIsRecording: (recording: boolean) => void;
  setRecordingProgress: (progress: number) => void;
  setRecordedVideoUrl: (url: string | null) => void;
}

export const useMotionStore = create<MotionState>((set) => ({
  rpm: 4,
  durationSeconds: 5,
  aspectRatio: '9:16',
  isRecording: false,
  recordingProgress: 0,
  recordedVideoUrl: null,

  setRPM: (rpm) => set({ rpm }),
  setDurationSeconds: (durationSeconds) => set({ durationSeconds }),
  setAspectRatio: (aspectRatio) => set({ aspectRatio }),
  setIsRecording: (isRecording) => set({ isRecording }),
  setRecordingProgress: (recordingProgress) => set({ recordingProgress }),
  setRecordedVideoUrl: (recordedVideoUrl) => set({ recordedVideoUrl }),
}));
