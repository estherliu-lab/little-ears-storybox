import type { Language } from "../data/stories";

type Props = {
  language: Language;
  onChange: (language: Language) => void;
};

export function LanguageToggle({ language, onChange }: Props) {
  return (
    <div className="language-toggle" aria-label="Reading language toggle">
      <button className={language === "zh" ? "active" : ""} onClick={() => onChange("zh")}>
        <strong>中文朗读</strong>
        <small>Chinese</small>
      </button>
      <button className={language === "en" ? "active" : ""} onClick={() => onChange("en")}>
        <strong>English 朗读</strong>
        <small>English</small>
      </button>
    </div>
  );
}
