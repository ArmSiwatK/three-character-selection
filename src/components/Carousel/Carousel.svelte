<script lang="ts">
  import characters from '../../assets/characters.json';
  import type { Character, Direction, LockedPanels } from '../../lib/types';
  import CharacterPanels from '../Character/CharacterPanels.svelte';
  import Gallery from '../Gallery/Gallery.svelte';
  import NavigationButtons from '../NavigationButtons/NavigationButtons.svelte';
  import {
    blurActiveControl,
    findCharacterIndex,
    getNextMarkedIndex,
    getRandomAvailableIndex,
    getSlideIndex,
    playSlideTransitionSound
  } from './CarouselUtils';

  const characterList = characters as Character[];

  let currentIndex = $state(0);
  let selectedCharacters = $state<number[]>([]);
  let isMobile = $state(false);

  const selectSound = new Audio('/audio/select.wav');
  const deselectSound = new Audio('/audio/deselect.wav');

  let character = $derived(characterList[currentIndex]);
  let lockedPanels: LockedPanels = $derived({
    panel1: selectedCharacters.length >= 1,
    panel2: selectedCharacters.length >= 2,
    panel3: selectedCharacters.length === 3
  });

  function move(direction: Direction): void {
    currentIndex = getSlideIndex(currentIndex, direction, characterList.length, selectedCharacters);
    playSlideTransitionSound();
    blurActiveControl();
  }

  function moveToIndex(direction: Direction): void {
    currentIndex = getNextMarkedIndex(currentIndex, direction, characterList, selectedCharacters);
    playSlideTransitionSound();
    blurActiveControl();
  }

  function selectCharacter(charID = character.charID): void {
    if (selectedCharacters.length >= 3) return;

    const newIndex = findCharacterIndex(characterList, charID);
    selectedCharacters = [...selectedCharacters, newIndex];
    currentIndex = newIndex;

    if (selectedCharacters.length !== 3) {
      currentIndex = getSlideIndex(newIndex, 'next', characterList.length, selectedCharacters);
    }

    selectSound.currentTime = 0;
    selectSound.play().catch(() => {});
    blurActiveControl();
  }

  function deselectCharacter(): void {
    if (selectedCharacters.length === 0) return;

    selectedCharacters = selectedCharacters.slice(0, -1);
    deselectSound.currentTime = 0;
    deselectSound.play().catch(() => {});
    blurActiveControl();
  }

  function randomCharacter(): void {
    if (selectedCharacters.length >= 3) return;

    currentIndex = getRandomAvailableIndex(characterList, selectedCharacters);
    playSlideTransitionSound();
    blurActiveControl();
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      selectCharacter();
      return;
    }

    if (event.key === 'Backspace') {
      deselectCharacter();
      return;
    }

    if (selectedCharacters.length >= 3) return;

    if (['d', 'D', 'ArrowRight'].includes(event.key)) {
      move('next');
    } else if (['a', 'A', 'ArrowLeft'].includes(event.key)) {
      move('prev');
    } else if (['w', 'W', 'ArrowUp'].includes(event.key)) {
      moveToIndex('next');
    } else if (['s', 'S', 'ArrowDown'].includes(event.key)) {
      moveToIndex('prev');
    } else if (['r', 'R'].includes(event.key)) {
      randomCharacter();
    }
  }

  $effect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const updateViewport = () => {
      isMobile = mediaQuery.matches;
    };

    updateViewport();
    mediaQuery.addEventListener('change', updateViewport);

    return () => mediaQuery.removeEventListener('change', updateViewport);
  });

  $effect(() => {
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  });

  $effect(() => {
    for (const item of characterList) {
      new Image().src = `/portraits/${item.charID}.webp`;
      new Image().src = `/profiles/${item.charID}.webp`;
    }
  });
</script>

<section class="carousel-container" aria-label="Character selection">
  <Gallery {currentIndex} {selectedCharacters} name={character.name} title={character.title} />

  <NavigationButtons
    selectedCount={selectedCharacters.length}
    onPrevious={() => move('prev')}
    onSelect={() => selectCharacter()}
    onDeselect={deselectCharacter}
    onNext={() => move('next')}
    onRandom={randomCharacter}
  />

  <CharacterPanels
    name={character.name}
    image={`/portraits/${character.charID}.webp`}
    {lockedPanels}
    {isMobile}
  />
</section>

<style>
  .carousel-container {
    width: min(100vw, 1600px);
    min-height: 100vh;
    display: grid;
    grid-template-rows: minmax(180px, 0.8fr) auto minmax(360px, 1.6fr);
    align-items: center;
    justify-items: center;
    padding: clamp(1rem, 2vw, 2rem);
  }

  @media (max-width: 768px) {
    .carousel-container {
      grid-template-rows: minmax(150px, 0.7fr) auto 1fr;
      padding: 0.75rem;
    }
  }
</style>
