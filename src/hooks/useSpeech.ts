import { useCallback, useEffect, useRef, useState } from "react";

type SpeechLang = "zh-CN" | "en-US";

type SpeakOptions = {
  rate?: number;
  onEnd?: () => void;
};

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setIsSupported("speechSynthesis" in window && "SpeechSynthesisUtterance" in window);

    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const stop = useCallback(() => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  const speak = useCallback(
    (text: string, lang: SpeechLang, options: SpeakOptions = {}) => {
      if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
        setIsSupported(false);
        return;
      }

      stop();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = options.rate ?? 0.82;
      utterance.pitch = 1.02;
      utterance.volume = 1;
      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        utteranceRef.current = null;
        options.onEnd?.();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        utteranceRef.current = null;
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      setIsPaused(false);
    },
    [stop]
  );

  const pause = useCallback(() => {
    if (!("speechSynthesis" in window) || !isSpeaking) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, [isSpeaking]);

  const resume = useCallback(() => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
    setIsSpeaking(true);
  }, []);

  return {
    speak,
    pause,
    resume,
    stop,
    isSpeaking,
    isPaused,
    isSupported,
  };
}
