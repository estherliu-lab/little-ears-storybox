import { useEffect, useMemo, useRef, useState } from "react";
import {
  characters,
  modeLabels,
  pickStory,
  type CharacterId,
  type Language,
  type Story,
  type StoryMode,
} from "../data/stories";
import { useSpeech } from "../hooks/useSpeech";
import { assetPath } from "../utils/assets";
import { LanguageToggle } from "./LanguageToggle";
import type { CSSProperties } from "react";

type Props = {
  language: Language;
  characterId: CharacterId;
  activeMode: StoryMode | "all";
  speechRate: number;
  onLanguageChange: (language: Language) => void;
  onBack: () => void;
  onHome: () => void;
};

export function StoryPlayer({
  language,
  characterId,
  activeMode,
  speechRate,
  onLanguageChange,
  onBack,
  onHome,
}: Props) {
  const [storyOffset, setStoryOffset] = useState(0);
  const [finished, setFinished] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
  const [sharePanelOpen, setSharePanelOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioPaused, setAudioPaused] = useState(false);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { speak, pause, resume, stop, isSpeaking, isPaused, isSupported } = useSpeech();
  const character = characters[characterId];

  const story: Story = useMemo(
    () => pickStory(characterId, activeMode, storyOffset),
    [activeMode, characterId, storyOffset]
  );

  useEffect(() => {
    stopStory();
    setFinished(false);
  }, [language, story.id]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = audioPlaybackRate();
    } else if (isSpeaking && !isPaused) {
      playStory(progress);
    }
  }, [speechRate]);

  useEffect(() => () => stopStory(), []);

  const storyDuration = durationSeconds || story.durationSeconds;
  const isPlaying = audioPlaying || isSpeaking;
  const isPlaybackPaused = audioPaused || isPaused;

  function storyTextFromProgress(ratio: number) {
    const text = story.text[language];
    const startIndex = Math.min(text.length - 1, Math.max(0, Math.floor(text.length * ratio)));
    return text.slice(startIndex);
  }

  function audioPlaybackRate() {
    return speechRate < 0.85 ? 0.9 : 1;
  }

  function clearAudio(resetProgress = false) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.onloadedmetadata = null;
    audio.ontimeupdate = null;
    audio.onended = null;
    audio.onerror = null;
    audioRef.current = null;
    setAudioPlaying(false);
    setAudioPaused(false);
    if (resetProgress) {
      setProgress(0);
      setCurrentSeconds(0);
      setDurationSeconds(0);
    }
  }

  function playStory(startRatio = 0) {
    const safeRatio = Math.min(0.98, Math.max(0, startRatio));
    const audioSrc = story.audio[language];

    stop();
    clearAudio(false);
    setFinished(false);
    setProgress(safeRatio);
    setCurrentSeconds(Math.floor(safeRatio * storyDuration));

    if (audioSrc) {
      const audio = new Audio(audioSrc);
      audio.preload = "auto";
      audio.playbackRate = audioPlaybackRate();
      audioRef.current = audio;

      audio.onloadedmetadata = () => {
        const duration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : story.durationSeconds;
        setDurationSeconds(duration);
        if (safeRatio > 0 && Number.isFinite(audio.duration)) {
          audio.currentTime = safeRatio * audio.duration;
        }
      };
      audio.ontimeupdate = () => {
        const duration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : story.durationSeconds;
        setDurationSeconds(duration);
        setCurrentSeconds(audio.currentTime);
        setProgress(Math.min(1, audio.currentTime / duration));
      };
      audio.onended = () => {
        setProgress(1);
        setCurrentSeconds(durationSeconds || story.durationSeconds);
        setAudioPlaying(false);
        setAudioPaused(false);
        setFinished(true);
      };
      audio.onerror = () => {
        clearAudio(false);
        speak(storyTextFromProgress(safeRatio), language === "zh" ? "zh-CN" : "en-US", {
          rate: speechRate,
          onEnd: () => {
            setProgress(1);
            setFinished(true);
          },
        });
      };

      audio.play()
        .then(() => {
          setAudioPlaying(true);
          setAudioPaused(false);
        })
        .catch(() => {
          clearAudio(false);
          speak(storyTextFromProgress(safeRatio), language === "zh" ? "zh-CN" : "en-US", {
            rate: speechRate,
            onEnd: () => {
              setProgress(1);
              setFinished(true);
            },
          });
        });
      return;
    }

    speak(storyTextFromProgress(safeRatio), language === "zh" ? "zh-CN" : "en-US", {
      rate: speechRate,
      onEnd: () => {
        setProgress(1);
        setFinished(true);
      },
    });
  }

  function changeStory() {
    stopStory();
    setStoryOffset((current) => current + 1);
  }

  function stopStory() {
    stop();
    clearAudio(true);
  }

  function togglePlayback() {
    const audio = audioRef.current;
    if (audio) {
      if (!audio.paused) {
        audio.pause();
        setAudioPlaying(false);
        setAudioPaused(true);
        return;
      }
      audio.play().then(() => {
        setAudioPlaying(true);
        setAudioPaused(false);
      });
      return;
    }

    if (isSpeaking && !isPaused) {
      pause();
      return;
    }
    if (isPaused) {
      resume();
      return;
    }
    playStory(progress);
  }

  function seekStory(nextValue: string) {
    const nextProgress = Number(nextValue) / 100;
    setProgress(nextProgress);
    const audio = audioRef.current;
    if (audio && Number.isFinite(audio.duration) && audio.duration > 0) {
      audio.currentTime = nextProgress * audio.duration;
      setCurrentSeconds(audio.currentTime);
      return;
    }
    if (isSpeaking || isPaused || audioPlaying || audioPaused) {
      playStory(nextProgress);
    }
  }

  async function copyShareText(extraText = "") {
    const shareTitle = "小耳朵故事机 Little Ears StoryBox";
    const shareText = `我刚听完《${story.title.zh} / ${story.title.en}》，一起来听温柔小故事吧。`;
    const shareUrl = window.location.origin;
    const fullText = `${shareText}${extraText ? `\n${extraText}` : ""}\n${shareUrl}`;

    try {
      await navigator.clipboard.writeText(fullText);
      return true;
    } catch {
      return false;
    }
  }

  async function shareStory(target: "system" | "wechat" | "moments" | "copy" = "system") {
    const shareTitle = "小耳朵故事机 Little Ears StoryBox";
    const shareText = `我刚听完《${story.title.zh} / ${story.title.en}》，一起来听温柔小故事吧。`;
    const shareUrl = window.location.origin;

    try {
      if (target === "system" && navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        setShareStatus("已打开分享 / Sharing opened");
        setSharePanelOpen(false);
        return;
      }

      if ((target === "wechat" || target === "moments") && navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: target === "moments" ? `${shareText} 分享到朋友圈～` : shareText,
          url: shareUrl,
        });
        setShareStatus(target === "moments" ? "已打开分享，可选择微信朋友圈" : "已打开分享，可选择微信聊天");
        setSharePanelOpen(false);
        return;
      }

      const copied = await copyShareText(target === "moments" ? "分享到朋友圈文案已准备好。" : "");
      if (target === "wechat") {
        setShareStatus(copied ? "已复制，打开微信聊天粘贴发送" : "请手动复制链接后发到微信聊天");
      } else if (target === "moments") {
        setShareStatus(copied ? "已复制，打开微信朋友圈粘贴发布" : "请手动复制链接后发到朋友圈");
      } else {
        setShareStatus(copied ? "链接已复制 / Link copied" : "请手动复制当前页面链接");
      }
      setSharePanelOpen(false);
    } catch {
      const copied = await copyShareText();
      setShareStatus(copied ? "分享未打开，链接已复制" : "可用浏览器菜单分享 / Use browser menu to share");
      setSharePanelOpen(false);
    }
  }

  function toggleSharePanel() {
    setShareStatus("");
    setSharePanelOpen((open) => !open);
  }

  function renderSharePanel() {
    if (!sharePanelOpen) return null;

    return (
      <div className="share-panel" role="dialog" aria-label="分享故事 / Share story">
        <button className="share-option wechat" onClick={() => shareStory("wechat")}>
          <span>微</span>
          <strong>微信聊天</strong>
          <small>WeChat Chat</small>
        </button>
        <button className="share-option moments" onClick={() => shareStory("moments")}>
          <span>朋</span>
          <strong>朋友圈</strong>
          <small>Moments</small>
        </button>
        <button className="share-option" onClick={() => shareStory("system")}>
          <span>↗</span>
          <strong>系统分享</strong>
          <small>System Share</small>
        </button>
        <button className="share-option copy" onClick={() => shareStory("copy")}>
          <span>⧉</span>
          <strong>复制链接</strong>
          <small>Copy Link</small>
        </button>
      </div>
    );
  }

  function listenOtherLanguage() {
    const nextLanguage = language === "zh" ? "en" : "zh";
    onLanguageChange(nextLanguage);
    setFinished(false);
  }

  if (finished) {
    return (
      <section className="completion-screen page-shell">
        <div
          className="completion-card"
          role="img"
          aria-label="你的小耳朵听完啦！Your little ears finished the story!"
          style={{ backgroundImage: `url(${assetPath("assets/references/finish-reference.png")})` }}
        />

        <div className="completion-actions">
          <button className="completion-action blue" onClick={() => playStory(0)}>
            <span>↻</span>
            <strong>再听一次</strong>
            <small>Listen Again</small>
          </button>
          <button className="completion-action blue" onClick={listenOtherLanguage}>
            <span>A</span>
            <strong>{language === "zh" ? "换英文听" : "换中文听"}</strong>
            <small>{language === "zh" ? "Listen in English" : "Listen in Chinese"}</small>
          </button>
          <button className="completion-action gold" onClick={toggleSharePanel}>
            <span>↗</span>
            <strong>分享</strong>
            <small>Share</small>
          </button>
          <button className="completion-action green" onClick={onHome}>
            <span>⌂</span>
            <strong>回到故事机</strong>
            <small>Back to Home</small>
          </button>
        </div>

        {renderSharePanel()}
        {shareStatus && <p className="share-status">{shareStatus}</p>}
      </section>
    );
  }

  return (
    <section className={`story-player page-shell ${isSpeaking ? "playing" : ""}`}>
      <div className="player-topbar">
        <button className="circle-back" onClick={onBack} aria-label="返回 / Back">
          ‹
        </button>
        <LanguageToggle language={language} onChange={onLanguageChange} />
      </div>

      <div className="cloud cloud-three" />
      <div className="cloud cloud-four" />

      <div className="player-scene">
        <div className="animal-stage" style={{ "--card-color": character.color } as CSSProperties}>
          <img src={character.image} alt={character[language]} />
          <span className="sparkle s1">✦</span>
          <span className="sparkle s2">✧</span>
          <span className="sparkle s3">✦</span>
        </div>

        <div className="story-copy-panel">
          <h1>{story.title[language]}</h1>
          <p className="story-mode">
            {modeLabels[story.mode].icon} {modeLabels[story.mode].zh} / {modeLabels[story.mode].en}
          </p>
          <p className="story-text">{story.text[language]}</p>
          <p className="story-moral">{story.moral[language]}</p>
        </div>
      </div>

      <div className="player-card">
        <div className="story-progress">
          <span>00:{String(Math.floor(currentSeconds)).padStart(2, "0")}</span>
          <label className="story-progress-track" aria-label="播放进度 / Playback progress">
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(progress * 100)}
              onChange={(event) => seekStory(event.currentTarget.value)}
            />
            <i style={{ width: `${Math.round(progress * 100)}%` }} />
          </label>
          <span>00:{String(Math.round(storyDuration)).padStart(2, "0")}</span>
        </div>

        {!isSupported && (
          <p className="speech-warning">
            当前浏览器不支持朗读，可以换 Chrome / Safari 再试。
            <br />
            This browser does not support reading aloud. Try Chrome or Safari.
          </p>
        )}

        <div className="player-actions" aria-label="Story controls">
          <button className="round-control" onClick={() => playStory(0)}>
            <span>↻</span>
            再听一次
            <small>Listen Again</small>
          </button>
          <button className="round-control main-control" onClick={togglePlayback}>
            <span>{isPlaying && !isPlaybackPaused ? "Ⅱ" : "▶"}</span>
            {isPlaying && !isPlaybackPaused ? "暂停" : "播放"}
            <small>{isPlaying && !isPlaybackPaused ? "Pause" : "Play"}</small>
          </button>
          <button className="round-control" onClick={changeStory}>
            <span>▶▶</span>
            换一个故事
            <small>Next Story</small>
          </button>
          <button className="round-control share-control" onClick={toggleSharePanel}>
            <span>↗</span>
            分享
            <small>Share</small>
          </button>
          <button className="stop-link" onClick={stopStory}>
            停止 / Stop
          </button>
        </div>

        {renderSharePanel()}
        {shareStatus && <p className="share-status inline-share-status">{shareStatus}</p>}

        {finished && (
          <div className="finish-message" role="status">
            <span>✨</span>
            你的小耳朵听完啦。
            <br />
            Your little ears finished the story.
          </div>
        )}
      </div>
    </section>
  );
}
