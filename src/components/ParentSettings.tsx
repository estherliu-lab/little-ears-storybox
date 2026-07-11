import { useEffect, useState } from "react";
import type { Language } from "../data/stories";
import { assetPath } from "../utils/assets";

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
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  useEffect(() => {
    function handleInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
  }, []);

  function patchSettings(next: Partial<ParentSettingsState>) {
    onChange({ ...settings, ...next });
  }

  async function addToHomeScreen() {
    if (installPrompt) {
      installPrompt.prompt();
      await installPrompt.userChoice.catch(() => undefined);
      setInstallPrompt(null);
      return;
    }

    setShowInstallGuide((value) => !value);
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

        <section className="install-card">
          <div className="install-icon-preview" aria-hidden="true">
            <img src={assetPath("icon-192.svg")} alt="" />
          </div>
          <div className="install-copy">
            <strong>添加到桌面</strong>
            <small>Add to Home Screen</small>
          </div>
          <button className="install-action" onClick={addToHomeScreen}>
            安装 / Add
          </button>
        </section>

        {showInstallGuide && (
          <section className="install-guide" aria-label="添加到桌面说明 / Add to Home Screen guide">
            <div>
              <strong>iPhone / iPad</strong>
              <p>用 Safari 打开应用，点底部分享按钮，再选择“添加到主屏幕”。</p>
            </div>
            <div>
              <strong>Android</strong>
              <p>用 Chrome 或微信内置浏览器打开应用，点菜单，再选择“添加到主屏幕”或“安装应用”。</p>
            </div>
          </section>
        )}
      </div>

      <img className="settings-bear" src={assetPath("assets/optimized/characters/bear.jpg")} alt="" loading="lazy" decoding="async" />

      <footer className="settings-footer">
        <p>© 2026 小耳朵故事机 Little Ears StoryBox. All rights reserved.</p>
        <p>X：@hann7712&nbsp;&nbsp;&nbsp;&nbsp;Wechat: Canaan77</p>
        <p>故事、角色与界面素材仅供本应用使用，转载或商用请先联系作者</p>
        <p>内容会不断更新，愿每一次聆听都有新的温柔陪伴。</p>
      </footer>
    </section>
  );
}
