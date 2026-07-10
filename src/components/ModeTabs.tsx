import { modeLabels, type Language, type StoryMode } from "../data/stories";

type Props = {
  language: Language;
  activeMode: StoryMode | "all";
  onChange: (mode: StoryMode | "all") => void;
};

const modes: Array<StoryMode | "all"> = ["all", "bedtime", "brave", "meal", "hug"];

export function ModeTabs({ language, activeMode, onChange }: Props) {
  return (
    <div className="mode-tabs" role="tablist" aria-label="Story modes">
      {modes.map((mode) => (
        <button
          key={mode}
          className={activeMode === mode ? "active" : ""}
          onClick={() => onChange(mode)}
          role="tab"
          aria-selected={activeMode === mode}
        >
          <span>{modeLabels[mode].icon}</span>
          <strong>{modeLabels[mode].zh}</strong>
          <small>{modeLabels[mode].en}</small>
        </button>
      ))}
    </div>
  );
}
