import {
  characters,
  modeLabels,
  stories,
  type CharacterId,
  type Language,
  type StoryMode,
} from "../data/stories";
import { ModeTabs } from "./ModeTabs";
import type { CSSProperties } from "react";

type Props = {
  language: Language;
  activeMode: StoryMode | "all";
  onModeChange: (mode: StoryMode | "all") => void;
  onSelect: (character: CharacterId) => void;
};

export function CharacterGrid({ language, activeMode, onModeChange, onSelect }: Props) {
  const visibleCharacters = (Object.keys(characters) as CharacterId[]).filter((id) => {
    return activeMode === "all" || stories.some((story) => story.character === id && story.mode === activeMode);
  });
  const activeLabel = modeLabels[activeMode];

  return (
    <section className="character-screen page-shell">
      <div className="section-heading">
        <p className="eyebrow">{language === "zh" ? "选一个小朋友" : "Pick a little friend"}</p>
        <h1>{language === "zh" ? "今天想听谁的故事？" : "Who would you like to hear today?"}</h1>
      </div>

      <ModeTabs language={language} activeMode={activeMode} onChange={onModeChange} />

      <p className="active-mode-note" role="status">
        {activeLabel.icon} 当前栏目：{activeLabel.zh}
        <span>Current: {activeLabel.en}</span>
      </p>

      <div className="character-grid">
        {visibleCharacters.map((id) => {
          const character = characters[id];
          return (
            <button
              className="character-card"
              key={id}
              onClick={() => onSelect(id)}
              style={{ "--card-color": character.color } as CSSProperties}
            >
              <span className="animal-photo">
                <img src={character.image} alt={character[language]} />
              </span>
              <span className="character-nameplate">
                <strong>{character.zh}</strong>
                <small>{character.en}</small>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
