export function clampInt(value: number, min: number, max: number): number {
  const v = Math.trunc(value);
  if (v < min) return min;
  if (v > max) return max;
  return v;
}

export function safeText(text: string): string {
  return text.replace(/[\u0000-\u001F\u007F]/g, ' ').trim();
}
