'use client';

import { useState, useEffect, useRef } from 'react';

export interface UseTypewriterOptions {
  phrases: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  startDelay?: number;
}

type Phase = 'typing' | 'paused' | 'deleting' | 'switching';

export interface UseTypewriterReturn {
  displayText: string;
  isTyping: boolean;
  phase: Phase;
}

export function useTypewriter({
  phrases,
  typingSpeed = 70,
  deletingSpeed = 40,
  pauseDuration = 1800,
  startDelay = 0,
}: UseTypewriterOptions): UseTypewriterReturn {
  const [isReady, setIsReady] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('typing');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setIsReady(true), startDelay);
    return () => clearTimeout(id);
  }, [startDelay]);

  useEffect(() => {
    if (!isReady || !phrases.length) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    const target = phrases[phraseIndex];

    switch (phase) {
      case 'typing':
        if (displayText.length < target.length) {
          timerRef.current = setTimeout(() =>
            setDisplayText(target.slice(0, displayText.length + 1)), typingSpeed);
        } else {
          setPhase('paused');
        }
        break;
      case 'paused':
        timerRef.current = setTimeout(() => setPhase('deleting'), pauseDuration);
        break;
      case 'deleting':
        if (displayText.length > 0) {
          timerRef.current = setTimeout(() =>
            setDisplayText(prev => prev.slice(0, -1)), deletingSpeed);
        } else {
          setPhase('switching');
        }
        break;
      case 'switching':
        setPhraseIndex(prev => (prev + 1) % phrases.length);
        setPhase('typing');
        break;
    }

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isReady, phase, displayText, phraseIndex, phrases, typingSpeed, deletingSpeed, pauseDuration]);

  const isTyping = phase === 'typing' || phase === 'switching';
  return { displayText, isTyping, phase };
}
