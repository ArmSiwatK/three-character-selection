<script lang="ts">
  import characters from '../../assets/characters.json';
  import type { Character } from '../../lib/types';

  type Props = {
    currentIndex: number;
    selectedCharacters: number[];
    name: string;
    title: string;
  };

  const characterList = characters as Character[];

  let { currentIndex, selectedCharacters, name, title }: Props = $props();

  let displayCount = $state(9);
  let isCompact = $state(false);

  const circularIndex = (index: number, length: number): number => (index + length) % length;

  let displayedCharacters = $derived.by(() => {
    const count = Math.min(displayCount, characterList.length);

    return Array.from({ length: count }, (_, index) => {
      const characterIndex = circularIndex(
        currentIndex - Math.floor(displayCount / 2) + index,
        characterList.length
      );

      return {
        character: characterList[characterIndex],
        index: characterIndex,
        hidden: index === 0 || index === count - 1
      };
    });
  });

  $effect(() => {
    const updateDisplayCount = () => {
      isCompact = window.matchMedia('(max-width: 1200px)').matches;

      if (window.matchMedia('(max-width: 768px)').matches) {
        displayCount = 5;
      } else if (window.matchMedia('(max-width: 1200px)').matches) {
        displayCount = 7;
      } else {
        displayCount = 9;
      }
    };

    updateDisplayCount();
    window.addEventListener('resize', updateDisplayCount);

    return () => window.removeEventListener('resize', updateDisplayCount);
  });
</script>

<div class="gallery-side">
  <h1 class="character-title">{isCompact ? name : title}</h1>

  <div class="gallery-set" aria-label="Character carousel">
    {#each displayedCharacters as item (item.character.charID)}
      <div
        class:hidden={item.hidden}
        class:active={item.index === currentIndex}
        class:chosen={selectedCharacters.includes(item.index)}
        class="gallery-wrapper"
      >
        <img src={`/profiles/${item.character.charID}.webp`} alt={item.character.name} />
      </div>
    {/each}
  </div>
</div>

<style>
  .gallery-side {
    display: grid;
    gap: clamp(0.4rem, 1vw, 1rem);
    justify-items: center;
    width: 100%;
  }

  .character-title {
    max-width: min(90vw, 980px);
    margin: 0;
    padding: 0.18em 2.6em;
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(1.5rem, 3vw, 3.2rem);
    line-height: 1.05;
    text-align: center;
    color: #181818;
    background-image: linear-gradient(
      to right,
      transparent,
      rgba(255, 255, 255, 0.55),
      white 32%,
      white 68%,
      rgba(255, 255, 255, 0.55),
      transparent
    );
  }

  .gallery-set {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: clamp(92px, 12vw, 178px);
  }

  .gallery-wrapper {
    width: clamp(76px, 10vw, 150px);
    aspect-ratio: 1;
    margin-inline: clamp(0.25rem, 0.7vw, 0.65rem);
    overflow: hidden;
    border: 2px solid rgba(255, 255, 255, 0.65);
    border-radius: 50%;
    opacity: 0.5;
    transform: scale(0.9);
    transition:
      transform 160ms ease,
      box-shadow 160ms ease,
      opacity 160ms ease,
      width 160ms ease,
      border-color 160ms ease;
  }

  .gallery-wrapper.active {
    opacity: 1;
    transform: translateY(-0.5em) scale(1.1);
    border-color: white;
    box-shadow: 0 0 0 4px rgba(45, 45, 45, 0.42), 0 18px 42px rgba(0, 0, 0, 0.3);
  }

  .gallery-wrapper.chosen {
    opacity: 1;
    filter: saturate(0.45);
    box-shadow: inset 0 0 0 999px rgba(255, 255, 255, 0.35);
  }

  .gallery-wrapper.hidden {
    width: 0;
    margin-inline: 0;
    border-width: 0;
    opacity: 0;
  }

  .gallery-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px), (max-height: 800px) {
    .character-title {
      padding-inline: 1.4em;
      font-size: 1.55rem;
    }
  }
</style>
