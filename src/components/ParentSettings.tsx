import type { Language } from "../data/stories";

export type ParentSettingsState = {
  defaultLanguage: Language;
  speechRate: "slow" | "normal";
  bgMusic: boolean;
  bedtimeMode: boolean;
};

type Props = {
  settings: ParentSettingsState;
  onChange: (settings: ParentSettingsState) => void;
  onReset: () => void;
  onBack: () => void;
};

export function ParentSettings({ settings, onChange, onReset, onBack }: Props) {
  function patchSettings(next: Partial<ParentSettingsState>) {
    onChange({ ...settings, ...next });
  }

  return (
    <section className="settings-page page-shell">
      <button className="settings-back" onClick={onBack} aria-label="返回 / Back">
        ‹
      </button>

      <header className="settings-page-header">
        <span className="settings-lock">♡</span>
        <div>
          <h1>家长设置</h1>
          <p>Parent Settings</p>
        </div>
      </header>

      <div className="settings-list">
        <section className="settings-row">
          <span className="settings-row-icon">中</span>
          <span className="settings-row-copy">
            <strong>默认语言</strong>
            <small>Default Language</small>
          </span>
          <div className="settings-segmented" role="group" aria-label="Default Language">
            <button
              className={settings.defaultLanguage === "zh" ? "active" : ""}
              onClick={() => patchSettings({ defaultLanguage: "zh" })}
            >
              中文
            </button>
            <button
              className={settings.defaultLanguage === "en" ? "active" : ""}
              onClick={() => patchSettings({ defaultLanguage: "en" })}
            >
              English
            </button>
          </div>
        </section>

        <section className="settings-row">
          <span className="settings-row-icon">🔊</span>
          <span className="settings-row-copy">
            <strong>朗读速度</strong>
            <small>Reading Speed</small>
          </span>
          <div className="settings-segmented" role="group" aria-label="Reading Speed">
            <button
              className={settings.speechRate === "slow" ? "active" : ""}
              onClick={() => patchSettings({ speechRate: "slow" })}
            >
              慢
            </button>
            <button
              className={settings.speechRate === "normal" ? "active" : ""}
              onClick={() => patchSettings({ speechRate: "normal" })}
            >
              正常
            </button>
          </div>
        </section>

        <section className="settings-row">
          <span className="settings-row-icon">♪</span>
          <span className="settings-row-copy">
            <strong>背景音乐</strong>
            <small>Background Music</small>
          </span>
          <div className="settings-segmented" role="group" aria-label="Background Music">
            <button className={settings.bgMusic ? "active" : ""} onClick={() => patchSettings({ bgMusic: true })}>
              开
            </button>
            <button className={!settings.bgMusic ? "active" : ""} onClick={() => patchSettings({ bgMusic: false })}>
              关
            </button>
          </div>
        </section>

        <section className="settings-row">
          <span className="settings-row-icon">☾</span>
          <span className="settings-row-copy">
            <strong>睡前模式</strong>
            <small>Bedtime Mode</small>
          </span>
          <div className="settings-segmented" role="group" aria-label="Bedtime Mode">
            <button className={settings.bedtimeMode ? "active" : ""} onClick={() => patchSettings({ bedtimeMode: true })}>
              开
            </button>
            <button className={!settings.bedtimeMode ? "active" : ""} onClick={() => patchSettings({ bedtimeMode: false })}>
              关
            </button>
          </div>
        </section>

        <button className="settings-clear" onClick={onReset}>
          <span className="settings-clear-icon">▥</span>
          <span className="settings-clear-copy">
            <strong>清空设置</strong>
            <small>Clear All Settings</small>
          </span>
        </button>
      </div>

      <img className="settings-bear" src="/assets/characters/bear.png" alt="" />

      <footer className="settings-footer">
        <p>© 2026 小耳朵故事机 Little Ears StoryBox. All rights reserved.</p>
        <p>X：@hann7712&nbsp;&nbsp;&nbsp;&nbsp;Wechat: Canaan77</p>
        <p>故事、角色与界面素材仅供本应用使用，转载或商用请先联系作者</p>
        <p>内容会不断更新，愿每一次聆听都有新的温柔陪伴。</p>
      </footer>
    </section>
  );
}
