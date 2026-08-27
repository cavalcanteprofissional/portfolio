import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';
import { ensureBootAudio, playBootStart, playOkBlip, playPostBeep, playWelcomeChime } from './bootSound';
import { MONO_FONT, BG_DARK_HSL } from '../lib/constants';

type BootLineType = 'header' | 'hw' | 'module' | 'info' | 'footer';

interface BootLine {
  type: BootLineType | 'gap';
  text: string;
  ok?: boolean;
}

const BOOT_LINES: BootLine[] = [
  { type: 'header', text: '  MSI MS-7C56 — American Megatrends UEFI v1.K0' },
  { type: 'header', text: '  BIOS Date: 02/09/2025 — Host: MUITOMALAKOI' },
  { type: 'gap', text: '' },
  { type: 'hw', text: '  CPU: AMD Ryzen 5 3600 @ 3.60GHz', ok: true },
  { type: 'hw', text: '  RAM: 16384MB DDR4', ok: true },
  { type: 'hw', text: '  GPU: NVIDIA GeForce RTX 4060 8GB', ok: true },
  { type: 'hw', text: '  NVMe: Storage 1024GB', ok: true },
  { type: 'gap', text: '' },
  { type: 'header', text: '  Enumerating expansion modules:' },
  { type: 'module', text: '    labgas-manager [Flask + Supabase]', ok: true },
  { type: 'module', text: '    sales-dashboard [Streamlit + Pandas]', ok: true },
  { type: 'module', text: '    chatbot-oficina [LangChain + FAISS]', ok: true },
  { type: 'module', text: '    human-recognition [OpenCV + sklearn]', ok: true },
  { type: 'module', text: '    trajectory-prediction [XGBoost + Folium]', ok: true },
  { type: 'module', text: '    br-stocks-pipeline [PyTorch + Prophet]', ok: true },
  { type: 'module', text: '    tweet-sentiment [BERT + NLTK]', ok: true },
  { type: 'module', text: '    app-reviews-qa [Hugging Face]', ok: true },
  { type: 'module', text: '    oficina-manager [Next.js + Supabase]', ok: true },
  { type: 'module', text: '    paraiso-frames [React + TypeScript]', ok: true },
  { type: 'module', text: '    ceara-alternativo [Next.js + Tailwind]', ok: true },
  { type: 'module', text: '    sanova-micromedicao [Cohere + Plotly]', ok: true },
  { type: 'module', text: '    pro-git-bot [LangChain + Ollama]', ok: true },
  { type: 'module', text: '    jobmatch-ai [FastAPI + XGBoost + Docker]', ok: true },
  { type: 'module', text: '    cd-price-tracker [Playwright + Next.js]', ok: true },
  { type: 'module', text: '    linktree-cavalcante [Next.js + Three.js]', ok: true },
  { type: 'gap', text: '' },
  { type: 'info', text: '  POST complete — all systems nominal.' },
  { type: 'footer', text: '  Booting: Lucas Cavalcante Systems v2.6.0' },
];

const MIN_BOOT_MS = 2800;
const SECTION_PAUSE = 60;
const LINE_GAP = 8;
const OK_DELAY = 24;
const PROMPT_DELAY = 160;
const TARGET_WIDTH = 48;
const TICK_MS = 3;

const TYPE_STEP: Record<string, number> = {
  header: 14,
  hw: 7,
  module: 12,
  info: 12,
  footer: 12,
};

const POST_LINE_INDEX = BOOT_LINES.findIndex((line) => line.type === 'info');

const lineDots = (line: BootLine): number =>
  line.ok ? Math.max(2, TARGET_WIDTH - line.text.length) : 0;

const typedLen = (line: BootLine): number => line.text.length + lineDots(line);

const stepFor = (line: BootLine): number => Math.max(1, TYPE_STEP[line.type] ?? 5);

function readBootMuted(): boolean {
  try {
    return localStorage.getItem('boot-muted') === '1';
  } catch {
    return false;
  }
}

interface BootScreenProps {
  onComplete: () => void;
  ready: boolean;
}

export function BootScreen({ onComplete, ready }: BootScreenProps) {
  const [typingLine, setTypingLine] = useState(0);
  const [typingPos, setTypingPos] = useState(0);
  const [okLines, setOkLines] = useState<number[]>([]);
  const [showPrompt, setShowPrompt] = useState(false);
  const [muted, setMuted] = useState(readBootMuted);
  const mutedRef = useRef(muted);
  const onCompleteRef = useRef(onComplete);
  const startRef = useRef(0);
  const bootStartedRef = useRef(false);
  const okCountRef = useRef(0);

  useEffect(() => {
    startRef.current = performance.now();
  }, []);

  useEffect(() => {
    if (bootStartedRef.current) return;
    bootStartedRef.current = true;
    if (!mutedRef.current) {
      playBootStart();
    }
  }, []);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    mutedRef.current = muted;
  }, [onComplete, muted]);

  useEffect(() => {
    try {
      localStorage.setItem('boot-muted', muted ? '1' : '0');
    } catch {
      /* localStorage indisponível */
    }
  }, [muted]);

  useEffect(() => {
    const handleGesture = () => ensureBootAudio();
    window.addEventListener('pointerdown', handleGesture);
    window.addEventListener('keydown', handleGesture);
    return () => {
      window.removeEventListener('pointerdown', handleGesture);
      window.removeEventListener('keydown', handleGesture);
    };
  }, []);

  useEffect(() => {
    const line = BOOT_LINES[typingLine];
    if (!line) return;

    if (line.type === 'gap') {
      const t = setTimeout(() => setTypingLine((l) => l + 1), SECTION_PAUSE);
      return () => clearTimeout(t);
    }

    if (typingPos < typedLen(line)) {
      const step = stepFor(line);
      const t = setTimeout(
        () => setTypingPos((p) => Math.min(typedLen(line), p + step)),
        TICK_MS
      );
      return () => clearTimeout(t);
    }

    if (line.ok && !okLines.includes(typingLine)) {
      const t = setTimeout(() => {
        setOkLines((lines) => [...lines, typingLine]);
        if (!mutedRef.current) {
          playOkBlip(okCountRef.current);
          okCountRef.current += 1;
        }
      }, OK_DELAY);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      setTypingLine((l) => l + 1);
      setTypingPos(0);
    }, LINE_GAP);
    return () => clearTimeout(t);
  }, [typingLine, typingPos, okLines]);

  useEffect(() => {
    if (typingLine === POST_LINE_INDEX && !mutedRef.current) {
      playPostBeep();
    }
  }, [typingLine]);

  useEffect(() => {
    if (typingLine < BOOT_LINES.length) return;
    const t = setTimeout(() => setShowPrompt(true), PROMPT_DELAY);
    return () => clearTimeout(t);
  }, [typingLine]);

  useEffect(() => {
    if (showPrompt && !mutedRef.current) {
      playWelcomeChime();
    }
  }, [showPrompt]);

  useEffect(() => {
    if (!showPrompt) return;

    const proceed = () => onCompleteRef.current();

    window.addEventListener('keydown', proceed);
    window.addEventListener('click', proceed);

    const autoTimer = setInterval(() => {
      if (ready && performance.now() - startRef.current >= MIN_BOOT_MS) {
        onCompleteRef.current();
      }
    }, 100);

    return () => {
      window.removeEventListener('keydown', proceed);
      window.removeEventListener('click', proceed);
      clearInterval(autoTimer);
    };
  }, [showPrompt, ready]);

  return (
    <motion.div
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: BG_DARK_HSL,
        fontFamily: MONO_FONT,
      }}
    >
      <div className="absolute inset-0 bg-gradient-blue-dark/40" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 boot-vignette z-[55]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 z-[60] boot-scanlines" aria-hidden="true" />

      <button
        type="button"
        onClick={() => setMuted((m) => !m)}
        aria-label={muted ? 'Ativar som do boot' : 'Silenciar som do boot'}
        aria-pressed={muted}
        className="absolute top-3 right-3 sm:top-5 sm:right-6 z-[70] p-2.5 rounded-full border border-white/15 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
      >
        {muted ? (
          <VolumeX className="w-5 h-5" aria-hidden="true" />
        ) : (
          <Volume2 className="w-5 h-5" aria-hidden="true" />
        )}
      </button>

      <div className="relative z-10 w-full py-6 sm:py-10 boot-flicker">
        {BOOT_LINES.map((line, i) => {
          if (line.type === 'gap') return <div key={i} className="h-2.5 sm:h-3" />;

          const isFullyRevealed = i < typingLine;
          const isTyping = i === typingLine && typingLine < BOOT_LINES.length;
          const okShown = !!line.ok && okLines.includes(i);
          const visible = isFullyRevealed || isTyping;

          return (
            <p
              key={i}
              className={`whitespace-pre leading-relaxed text-white boot-glow-text ${
                visible ? '' : 'invisible'
              } text-[11px] sm:text-sm md:text-base lg:text-lg`}
            >
              {isTyping ? (
                <>
                  {line.text.slice(0, Math.min(typingPos, line.text.length))}
                  {'.'.repeat(
                    Math.max(0, Math.min(lineDots(line), typingPos - line.text.length))
                  )}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    className="inline-block w-[0.6em] h-[1.15em] bg-white/90 align-text-bottom ml-px"
                    aria-hidden="true"
                  />
                </>
              ) : (
                <>
                  {line.text}
                  {lineDots(line) > 0 && '.'.repeat(lineDots(line))}
                </>
              )}

              {okShown && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.18 }}
                  className="boot-ok inline-block font-semibold"
                >
                  {' '}[OK]
                </motion.span>
              )}
            </p>
          );
        })}

        {showPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-6 flex items-center gap-1"
          >
            <span className="text-white text-sm sm:text-base boot-glow-text">
              PRESS ANY KEY TO CONTINUE
            </span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
              className="text-white text-sm sm:text-base"
              aria-hidden="true"
            >
              _
            </motion.span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
