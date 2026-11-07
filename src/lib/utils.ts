import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(prefix = "id"): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Universal browser-safe file download trigger.
 * Converts large base64 data URLs to Blobs to prevent Chromium/Firefox sandbox truncation
 * and memory limit drops. Safely appends the anchor to document.body.
 */
export function downloadFile(urlOrDataUrl: string, filename: string): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  let objectUrl: string | null = null;
  let finalUrl = urlOrDataUrl;

  try {
    if (urlOrDataUrl.startsWith('data:')) {
      const parts = urlOrDataUrl.split(';base64,');
      if (parts.length === 2) {
        const contentType = parts[0].split(':')[1] || 'image/png';
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);
        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }
        const blob = new Blob([uInt8Array], { type: contentType });
        objectUrl = URL.createObjectURL(blob);
        finalUrl = objectUrl;
      }
    }
  } catch (err) {
    console.warn('downloadFile fallback to original URL:', err);
    finalUrl = urlOrDataUrl;
  }

  const link = document.createElement('a');
  link.style.display = 'none';
  link.download = filename;
  link.href = finalUrl;

  document.body.appendChild(link);
  link.click();

  // Cleanup after trigger
  setTimeout(() => {
    if (document.body.contains(link)) {
      document.body.removeChild(link);
    }
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }
  }, 1000);
}
