import { useEffect, useMemo, useRef, useState } from "react";
import { CharacterGrid } from "./components/CharacterGrid";
import { HomeScreen } from "./components/HomeScreen";
import {
  ParentSettings,
  type ParentSettingsState,
} from "./components/ParentSettings";
import { StoryPlayer } from "./components/StoryPlayer";
import type { CharacterId, Language, StoryMode } from "./data/stories";

type Screen = "home" | "characters" | "story" | "settings";

const STORAGE_KEY = "little-ears-settings";

const defaultSettings: ParentSettingsState = {
  defaultLanguage: "zh",
  speechRate: "slow",
  bgMusic: false,
  bedtimeMode: false,
};

function loadSettings(): ParentSettingsState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export default function App() {
  const [settings, setSettings] = useState<ParentSettingsState>(() => loadSettings());
  const [language, setLanguage] = useState<Language>(() => settings.defaultLanguage);
  const [screen, setScreen] = useState<Screen>("home");
  const [activeMode, setActiveMode] = useState<StoryMode | "all">(
    settings.bedtimeMode ? "bedtime" : "all"
  );
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterId>("lamb");
  const audioRef = useRef<AudioContext | null>(null);
  const musicTimerRef = useRef<number | null>(null);
  const musicMasterGainRef = useRef<GainNode | null>(null);
  const musicOscillatorsRef = useRef<Set<OscillatorNode>>(new Set());

  const speechRate = useMemo(() => (settings.speechRate === "slow" ? 0.78 : 0.92), [settings.speechRate]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    setLanguage(settings.defaultLanguage);
    if (settings.bedtimeMode) setActiveMode("bedtime");
  }, [settings.defaultLanguage, settings.bedtimeMode]);

  function stopMusic() {
    if (musicTimerRef.current) {
      window.clearTimeout(musicTimerRef.current);
      musicTimerRef.current = null;
    }

    musicOscillatorsRef.current.forEach((oscillator) => {
      try {
        oscillator.stop();
      } catch {
        // The oscillator may have already completed its envelope.
      }
    });
    musicOscillatorsRef.current.clear();
    musicMasterGainRef.current?.disconnect();
    musicMasterGainRef.current = null;
    audioRef.current?.close().catch(() => undefined);
    audioRef.current = null;
  }

  function playLullabyNote(context: AudioContext, frequency: number, startTime: number, duration: number, volume: number) {
    const masterGain = musicMasterGainRef.current;
    if (!masterGain) return;

    const oscillator = context.createOscillator();
    const noteGain = context.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(frequency, startTime);
    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.exponentialRampToValueAtTime(volume, startTime + 0.14);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    oscillator.connect(noteGain);
    noteGain.connect(masterGain);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration + 0.05);
    musicOscillatorsRef.current.add(oscillator);
    oscillator.onended = () => {
      musicOscillatorsRef.current.delete(oscillator);
      noteGain.disconnect();
    };
  }

  function scheduleLullaby(context: AudioContext, step = 0) {
    if (audioRef.current !== context || !musicMasterGainRef.current) return;

    const melody = [
      { notes: [392, 523], length: 1.25 },
      { notes: [440], length: 1 },
      { notes: [392, 494], length: 1.25 },
      { notes: [330], length: 1.4 },
      { notes: [349, 440], length: 1.15 },
      { notes: [392], length: 1 },
      { notes: [330, 392], length: 1.25 },
      { notes: [294], length: 1.7 },
    ];
    const phrase = melody[step % melody.length];
    const startTime = context.currentTime + 0.04;

    phrase.notes.forEach((frequency, index) => {
      playLullabyNote(context, frequency, startTime + index * 0.035, phrase.length * 0.94, index === 0 ? 0.05 : 0.026);
    });

    musicTimerRef.current = window.setTimeout(() => scheduleLullaby(context, step + 1), phrase.length * 1000);
  }

  function startMusic() {
    if (audioRef.current) {
      audioRef.current.resume().catch(() => undefined);
      if (!musicTimerRef.current) scheduleLullaby(audioRef.current);
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const masterGain = context.createGain();
    masterGain.gain.value = 0.18;
    masterGain.connect(context.destination);

    audioRef.current = context;
    musicMasterGainRef.current = masterGain;
    context.resume().catch(() => undefined);
    scheduleLullaby(context);
  }

  useEffect(() => {
    if (!settings.bgMusic) stopMusic();
  }, [settings.bgMusic]);

  useEffect(() => () => stopMusic(), []);

  function chooseCharacter(character: CharacterId) {
    setSelectedCharacter(character);
    setScreen("story");
  }

  function resetSettings() {
    stopMusic();
    setSettings(defaultSettings);
    setActiveMode("all");
    localStorage.removeItem(STORAGE_KEY);
  }

  function changeSettings(next: ParentSettingsState) {
    setSettings(next);
    if (next.bgMusic) {
      startMusic();
    } else {
      stopMusic();
    }

    if (next.bedtimeMode && !settings.bedtimeMode) {
      setActiveMode("bedtime");
    }
    if (!next.bedtimeMode && settings.bedtimeMode) {
      setActiveMode("all");
    }
  }

  return (
    <main className={`app ${settings.bedtimeMode ? "bedtime" : ""}`}>
      {screen === "home" && (
        <HomeScreen
          language={language}
          onLanguageChange={setLanguage}
          onStart={() => setScreen("characters")}
        />
      )}

      {screen === "characters" && (
        <CharacterGrid
          language={language}
          activeMode={activeMode}
          onModeChange={setActiveMode}
          onSelect={chooseCharacter}
        />
      )}

      {screen === "story" && (
        <StoryPlayer
          language={language}
          characterId={selectedCharacter}
          activeMode={activeMode}
          speechRate={speechRate}
          onLanguageChange={setLanguage}
          onBack={() => setScreen("characters")}
          onHome={() => setScreen("home")}
        />
      )}

      {screen === "settings" && (
        <ParentSettings
          settings={settings}
          onChange={changeSettings}
          onReset={resetSettings}
          onBack={() => setScreen("home")}
        />
      )}

      {screen !== "settings" && (
        <button className="settings-entry" onClick={() => setScreen("settings")} aria-label="设置 / Settings">
          <span>⚙</span>
          <strong>设置</strong>
          <small>Settings</small>
        </button>
      )}
    </main>
  );
}
