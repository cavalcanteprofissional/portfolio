declare global {
  interface Window {
    __bootAudioCtx?: AudioContext;
  }
}

function getBootAudio(): AudioContext | null {
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
  freqEnd?: number;
}

function playBootTone(freq: number, duration: number, options: BootToneOptions = {}): void {
  const { type = 'square', volume = 0.2, when = 0, freqEnd } = options;
  const ctx = getBootAudio();
  if (!ctx || ctx.state !== 'running') return;

  try {
    const t0 = ctx.currentTime + when;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    if (freqEnd !== undefined) {
      osc.frequency.setValueAtTime(freq, t0);
      osc.frequency.linearRampToValueAtTime(freqEnd, t0 + duration);
    } else {
      osc.frequency.value = freq;
    }
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

const PENTATONIC = [880, 987.77, 1108.73, 1318.51, 1469.83];

export function playBootStart(): void {
  const ctx = getBootAudio();
  if (!ctx || ctx.state !== 'running') return;

  try {
    const duration = 0.32;
    const t0 = ctx.currentTime;
    const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(160, t0);
    filter.frequency.exponentialRampToValueAtTime(2800, t0 + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.02, t0);
    gain.gain.exponentialRampToValueAtTime(0.14, t0 + duration * 0.65);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(t0);
    noise.stop(t0 + duration);
  } catch {
    /* áudio indisponível */
  }
}

export function playOkBlip(step: number): void {
  const freq = PENTATONIC[Math.abs(step) % PENTATONIC.length];
  playBootTone(freq, 0.045, { type: 'triangle', volume: 0.055 });
}

export function playWelcomeChime(): void {
  playBootTone(660, 0.12, { type: 'square', volume: 0.12 });
  playBootTone(880, 0.18, { type: 'square', volume: 0.12, when: 0.14 });
  playBootTone(1320, 0.22, { type: 'square', volume: 0.1, when: 0.32 });
}

export {};
