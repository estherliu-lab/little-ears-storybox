import type { Language } from "../data/stories";
import { assetPath } from "../utils/assets";
import { LanguageToggle } from "./LanguageToggle";

type Props = {
  language: Language;
  onLanguageChange: (language: Language) => void;
  onStart: () => void;
};

export function HomeScreen({ language, onLanguageChange, onStart }: Props) {
  return (
    <section className="home-screen page-shell">
      <LanguageToggle language={language} onChange={onLanguageChange} />
      <div className="cloud cloud-one" />
      <div className="cloud cloud-two" />
      <div className="home-copy">
        <h1>小耳朵故事机</h1>
        <h2>Little Ears StoryBox</h2>
      </div>

      <div className="storybox-hero" aria-label="Cute story machine illustration">
        <img
          src={assetPath("assets/optimized/references/home-reference.jpg")}
          alt=""
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="star star-a">✦</div>
        <div className="star star-b">✧</div>
        <div className="star star-c">✦</div>
      </div>

      <button className="primary-action" onClick={onStart}>
        <strong>开始听故事</strong>
        <span>Start</span>
      </button>

      <p className="home-note">
        适合0~5岁宝宝的温柔小故事
        <br />
        <small>Gentle little stories for ages 0-5</small>
        <span> ♥</span>
      </p>
    </section>
  );
}
