<script lang="ts">
  type Props = {
    selectedCount: number;
    onPrevious: () => void;
    onSelect: () => void;
    onDeselect: () => void;
    onNext: () => void;
    onRandom: () => void;
  };

  let { selectedCount, onPrevious, onSelect, onDeselect, onNext, onRandom }: Props = $props();

  let bgmPlaying = $state(false);
  let videoPlaying = $state(true);
  let audio = $state<HTMLAudioElement>();

  function blurActiveControl(): void {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  function toggleBackgroundMusic(): void {
    if (!audio) return;

    if (bgmPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }

    bgmPlaying = !bgmPlaying;
    blurActiveControl();
  }

  function toggleVideoPlayback(): void {
    videoPlaying = !videoPlaying;
    blurActiveControl();
  }

  $effect(() => {
    const bgmAudio = new Audio('/audio/bgm.mp3');
    bgmAudio.loop = true;
    audio = bgmAudio;

    return () => {
      bgmAudio.pause();
      bgmAudio.currentTime = 0;
    };
  });
</script>

<div class="navigation-buttons">
  <div class="navigation-buttons-row">
    <button type="button" class="left-button icon-button" aria-label="Previous character" onclick={onPrevious}>
      ◄
    </button>
    <button type="button" onclick={onSelect} disabled={selectedCount >= 3}>Select</button>
    <button type="button" class:active={videoPlaying} onclick={toggleVideoPlayback}>Video</button>
    <button type="button" onclick={onRandom} disabled={selectedCount >= 3}>Random</button>
    <button type="button" class:active={bgmPlaying} onclick={toggleBackgroundMusic}>BGM</button>
    <button type="button" onclick={onDeselect} disabled={selectedCount === 0}>Deselect</button>
    <button type="button" class="right-button icon-button" aria-label="Next character" onclick={onNext}>
      ►
    </button>
  </div>

  {#if videoPlaying}
    <video class="background-video" autoplay loop muted playsinline>
      <source src="/background.mp4" type="video/mp4" />
    </video>
  {/if}

  <div class="gradient-overlay"></div>
</div>

<style>
  .navigation-buttons {
    width: 100%;
    display: grid;
    justify-items: center;
  }

  .navigation-buttons-row {
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: clamp(0.25rem, 0.8vw, 0.8rem);
    width: min(100%, 1040px);
    padding-inline: 0.5rem;
    font-family: 'Playfair Display', Georgia, serif;
  }

  button {
    min-width: 0;
    min-height: 42px;
    padding: 0.38rem clamp(0.6rem, 1.8vw, 1.2rem) 0.48rem;
    border: 1px solid rgba(255, 255, 255, 0.85);
    border-radius: 5px;
    color: #202020;
    background: rgba(248, 248, 245, 0.92);
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18);
    cursor: pointer;
    font: inherit;
    font-size: clamp(0.75rem, 1.4vw, 1.25rem);
    font-weight: 700;
    letter-spacing: 0;
    text-transform: uppercase;
    transition:
      transform 140ms ease,
      background-color 140ms ease,
      box-shadow 140ms ease,
      opacity 140ms ease;
  }

  button:hover:not(:disabled),
  button.active {
    background: #ffffff;
    box-shadow: 0 12px 34px rgba(0, 0, 0, 0.24);
  }

  button:active:not(:disabled) {
    transform: scale(0.96);
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }

  .icon-button {
    width: clamp(44px, 7vw, 96px);
    padding-inline: 0.4rem;
  }

  .left-button {
    border-radius: 999px 8px 8px 999px;
  }

  .right-button {
    border-radius: 8px 999px 999px 8px;
  }

  .background-video,
  .gradient-overlay {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
  }

  .background-video {
    z-index: -2;
    filter: brightness(0.6) contrast(1.9) saturate(0.72);
  }

  .gradient-overlay {
    z-index: -1;
    opacity: 0.64;
    background:
      linear-gradient(to bottom, rgba(255, 255, 255, 0.72), transparent 45%),
      linear-gradient(to bottom left, rgba(255, 255, 255, 0.85), transparent 62%);
  }

  @media (max-width: 768px) {
    .navigation-buttons-row {
      position: fixed;
      right: 0.5rem;
      bottom: 0.75rem;
      left: 0.5rem;
      gap: 0.25rem;
      padding: 0;
    }

    button {
      min-height: 36px;
      padding-inline: 0.42rem;
      font-size: 0.68rem;
    }

    .icon-button {
      width: 40px;
    }
  }
</style>
