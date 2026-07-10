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
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const speechRate = useMemo(() => (settings.speechRate === "slow" ? 0.78 : 0.92), [settings.speechRate]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    setLanguage(settings.defaultLanguage);
    if (settings.bedtimeMode) setActiveMode("bedtime");
  }, [settings.defaultLanguage, settings.bedtimeMode]);

  function stopMusic() {
    oscillatorRef.current?.stop();
    oscillatorRef.current = null;
    gainRef.current = null;
    audioRef.current?.close();
    audioRef.current = null;
  }

  function startMusic() {
    if (audioRef.current) {
      audioRef.current.resume();
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const tremolo = context.createOscillator();
    const tremoloGain = context.createGain();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = 196;
    tremolo.type = "sine";
    tremolo.frequency.value = 0.18;
    tremoloGain.gain.value = 0.018;
    gain.gain.value = 0.028;

    tremolo.connect(tremoloGain);
    tremoloGain.connect(gain.gain);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    tremolo.start();

    audioRef.current = context;
    oscillatorRef.current = oscillator;
    gainRef.current = gain;
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
