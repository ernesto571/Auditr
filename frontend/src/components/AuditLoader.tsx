import { useEffect, useRef, useState } from "react";

const STEPS = [
  { pct: 12,  label: "VISITING PAGE..." },
  { pct: 26,  label: "CAPTURING SCREENSHOT..." },
  { pct: 42,  label: "EXTRACTING DOM..." },
  { pct: 58,  label: "FETCHING PAGESPEED DATA..." },
  { pct: 74,  label: "RUNNING AI ANALYSIS..." },
  { pct: 90,  label: "GENERATING REPORT..." },
  { pct: 100, label: "COMPLETE ✓" },
];

// Estimated total scan time in ms (used before real time is known)
const ESTIMATED_MS = 45000;

interface AuditLoaderProps {
  isRunning: boolean;
  domain: string;
}

export const AuditLoader = ({ isRunning, domain }: AuditLoaderProps) => {
  const [stepIndex, setStepIndex]   = useState(0);
  const [progress, setProgress]     = useState(0);
  const [label, setLabel]           = useState(STEPS[0].label);
  const [elapsed, setElapsed]       = useState(0);
  const timerRef                    = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepRef                     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef                    = useRef<number>(0);

  // Tick elapsed seconds
  useEffect(() => {
    if (!isRunning) return;
    startRef.current = Date.now();
    setElapsed(0);
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRunning]);

  // Step through loading stages proportionally across estimated time
  useEffect(() => {
    if (!isRunning) {
      setStepIndex(0);
      setProgress(0);
      setLabel(STEPS[0].label);
      return;
    }

    let idx = 0;

    const advance = () => {
      if (idx >= STEPS.length) return;
      const step = STEPS[idx];
      setProgress(step.pct);
      setLabel(step.label);
      setStepIndex(idx);
      idx++;

      if (idx < STEPS.length) {
        // Distribute time proportionally — earlier steps are faster
        const delay = idx <= 2
          ? ESTIMATED_MS * 0.2   // visiting + screenshot — fast
          : idx <= 4
          ? ESTIMATED_MS * 0.3   // dom + pagespeed — medium
          : ESTIMATED_MS * 0.4;  // ai + report — slowest
        stepRef.current = setTimeout(advance, delay);
      }
    };

    advance();
    return () => { if (stepRef.current) clearTimeout(stepRef.current); };
  }, [isRunning]);

  if (!isRunning) return null;

  const displayUrl = domain.replace(/^https?:\/\/(www\.)?/, "");

  return (
    <div className="border border-t-0 border-[#0a0a08]">
      {/* Header bar */}
      <div className="flex items-center justify-between px-[13px] py-[6px] bg-[#0a0a08]">
        <div className="flex items-center gap-2">
          {/* Animated scanning indicator */}
          <span className="relative flex items-center justify-center w-[8px] h-[8px]">
            <span className="absolute inline-flex w-full h-full bg-[#ff3e00] opacity-60 animate-ping" />
            <span className="relative inline-flex w-[5px] h-[5px] bg-[#ff3e00]" />
          </span>
          <span className="font-jet text-[9px] tracking-[0.1em] text-[rgba(242,240,232,0.42)] uppercase">
            SCANNING
          </span>
          <span className="font-jet text-[9px] text-[rgba(242,240,232,0.28)] ml-1">
            {displayUrl}
          </span>
        </div>
        <span className="font-jet text-[9px] text-[rgba(242,240,232,0.28)] tracking-[0.06em]">
          {elapsed}s elapsed
        </span>
      </div>

      {/* Progress bar row */}
      <div className="flex items-center gap-[11px] px-[17px] py-[15px] bg-[#eae8e0]">
        {/* Label */}
        <span className="font-jet text-[10px] text-[#6b6960] whitespace-nowrap w-[220px]">
          {label}
        </span>

        {/* Track */}
        <div className="flex-1 h-[3px] bg-[#e0ddd4] border border-[#0a0a08] overflow-hidden">
          <div
            className="h-full bg-[#ff3e00] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percentage */}
        <span className="font-jet text-[11px] font-bold text-[#ff3e00] min-w-[34px] text-right">
          {progress}%
        </span>
      </div>

      {/* Step indicators */}
      <div className="flex items-center border-t border-[#0a0a08] bg-[#f2f0e8]">
        {STEPS.slice(0, -1).map((step, i) => (
          <div
            key={i}
            className={`flex-1 py-[6px] px-[8px] border-r border-[#0a0a08] last:border-r-0 transition-all duration-300 ${
              i < stepIndex
                ? "bg-[rgba(255,62,0,0.06)]"
                : i === stepIndex
                ? "bg-[rgba(255,62,0,0.12)]"
                : ""
            }`}
          >
            <div
              className={`font-jet text-[8px] tracking-[0.08em] uppercase truncate transition-colors duration-300 ${
                i < stepIndex
                  ? "text-[#ff3e00] opacity-50"
                  : i === stepIndex
                  ? "text-[#ff3e00]"
                  : "text-[#9b9890]"
              }`}
            >
              {i < stepIndex ? "✓ " : i === stepIndex ? "→ " : ""}
              {step.label.replace("...", "")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};