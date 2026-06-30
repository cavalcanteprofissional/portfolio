import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const BOOT_LINES = [
  '  MSI MS-7C56 — American Megatrends UEFI v1.K0',
  '  BIOS Date: 02/09/2025 — Host: MUITOMALAKOI',
  '',
  '  CPU: AMD Ryzen 5 3600 @ 3.60GHz............... [OK]',
  '  RAM: 16384MB DDR4.............................. [OK]',
  '  GPU: NVIDIA GeForce RTX 4060 8GB.............. [OK]',
  '  NVMe: Storage 1024GB.......................... [OK]',
  '',
  '  Enumerating expansion modules:',
  '    labgas-manager [Flask + Supabase].......... [OK]',
  '    sales-dashboard [Streamlit + Pandas]....... [OK]',
  '    chatbot-oficina [LangChain + FAISS]........ [OK]',
  '    human-recognition [OpenCV + sklearn]....... [OK]',
  '    trajectory-prediction [XGBoost + Folium]... [OK]',
  '    br-stocks-pipeline [PyTorch + Prophet]..... [OK]',
  '    tweet-sentiment [BERT + NLTK].............. [OK]',
  '    app-reviews-qa [Hugging Face].............. [OK]',
  '    oficina-manager [Next.js + Supabase]....... [OK]',
  '    paraiso-frames [React + TypeScript]........ [OK]',
  '    ceara-alternativo [Next.js + Tailwind]..... [OK]',
  '    sanova-micromedicao [Cohere + Plotly]...... [OK]',
  '    pro-git-bot [LangChain + Ollama]........... [OK]',
  '    jobmatch-ai [FastAPI + XGBoost + Docker]... [OK]',
  '',
  '  POST complete — all systems nominal.',
  '  Booting C:\\Windows 11 Pro 10.0.26200',
];

function playBeep() {
  try {
    const ctx = (window as any).__bootAudioCtx || new AudioContext();
    ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'square';
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch {}
}

const CHAR_DELAY = 1;
const LINE_GAP = 3;
const SECTION_PAUSE = 67;
const PROMPT_DELAY = 500;
const AUTO_PROCEED = 1500;

interface BootScreenProps {
  onComplete: () => void;
}

export function BootScreen({ onComplete }: BootScreenProps) {
  const [typingLine, setTypingLine] = useState(0);
  const [typingPos, setTypingPos] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    playBeep();
  }, []);

  useEffect(() => {
    if (typingLine >= BOOT_LINES.length) return;

    const line = BOOT_LINES[typingLine];

    if (line === '') {
      const t = setTimeout(() => setTypingLine(t => t + 1), SECTION_PAUSE);
      return () => clearTimeout(t);
    }

    if (typingPos < line.length) {
      const t = setTimeout(() => setTypingPos(p => p + 1), CHAR_DELAY);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      setTypingLine(t => t + 1);
      setTypingPos(0);
    }, LINE_GAP);
    return () => clearTimeout(t);
  }, [typingLine, typingPos]);

  useEffect(() => {
    if (typingLine < BOOT_LINES.length) return;
    const t = setTimeout(() => setShowPrompt(true), PROMPT_DELAY);
    return () => clearTimeout(t);
  }, [typingLine]);

  useEffect(() => {
    if (!showPrompt) return;

    const proceed = () => onCompleteRef.current();

    window.addEventListener('keydown', proceed);
    window.addEventListener('click', proceed);

    const autoTimer = setTimeout(proceed, AUTO_PROCEED);

    return () => {
      window.removeEventListener('keydown', proceed);
      window.removeEventListener('click', proceed);
      clearTimeout(autoTimer);
    };
  }, [showPrompt]);

  return (
    <motion.div
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-hidden"
      style={{ fontFamily: "'Cascadia Code', 'JetBrains Mono', 'Fira Code', 'Consolas', 'Courier New', monospace" }}
    >
      <div className="absolute inset-0 bg-gradient-blue-dark/50" />

      <div className="relative z-10 flex flex-col items-start max-w-xl w-full px-6">
        {BOOT_LINES.map((line, i) => {
          const isFullyRevealed = i < typingLine;
          const isTyping = i === typingLine && typingLine < BOOT_LINES.length;
          const visible = isFullyRevealed || isTyping;

          if (line === '') {
            return <div key={i} className="h-3" />;
          }

          return (
            <p
              key={i}
              className={`text-white text-sm sm:text-base leading-relaxed whitespace-pre ${visible ? '' : 'invisible'}`}
            >
              {isTyping ? line.slice(0, typingPos) : line}
              {isTyping && typingPos < line.length && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                  className="inline-block w-[0.6em] h-[1.15em] bg-white/90 align-text-bottom ml-px"
                />
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
            <span className="text-white text-sm sm:text-base">
              PRESS ANY KEY TO CONTINUE
            </span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
              className="text-white text-sm sm:text-base"
            >
              _
            </motion.span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
