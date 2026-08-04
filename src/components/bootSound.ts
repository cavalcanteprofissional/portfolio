declare global {
  interface Window {
    __bootAudioCtx?: AudioContext;
  }
}

export function getBootAudio(): AudioContext | null {
  try {
    if (window.__bootAudioCtx) return window.__bootAudioCtx;
    const ctx = new AudioContext();
    window.__bootAudioCtx = ctx;
    return ctx;
  } catch {
    return null;
  }
}

export function ensureBootAudio(): void {
  const ctx = getBootAudio();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
}

interface BootToneOptions {
  type?: OscillatorType;
  volume?: number;
  when?: number;
}

export function playBootTone(freq: number, duration: number, options: BootToneOptions = {}): void {
  const { type = 'square', volume = 0.2, when = 0 } = options;
  const ctx = getBootAudio();
  if (!ctx || ctx.state !== 'running') return;

  try {
    const t0 = ctx.currentTime + when;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
    osc.start(t0);
    osc.stop(t0 + duration);
  } catch {
    /* áudio indisponível */
  }
}

export function playPostBeep(): void {
  playBootTone(1000, 0.1, { type: 'square', volume: 0.15 });
}

export function playWelcomeChime(): void {
  playBootTone(660, 0.12, { type: 'square', volume: 0.12 });
  playBootTone(880, 0.18, { type: 'square', volume: 0.12, when: 0.14 });
  playBootTone(1320, 0.22, { type: 'square', volume: 0.1, when: 0.32 });
}

export {};
