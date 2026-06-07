import type { Character, Direction } from '../../lib/types';

const scrollAudio = new Audio('/audio/scroll.wav');

export function playSlideTransitionSound(): void {
  scrollAudio.currentTime = 0;
  scrollAudio.play().catch(() => {});
}

export function getSlideIndex(
  currentIndex: number,
  direction: Direction,
  charactersLength: number,
  selectedCharacters: number[]
): number {
  const offset = direction === 'next' ? 1 : -1;
  let nextIndex = (currentIndex + offset + charactersLength) % charactersLength;

  while (selectedCharacters.includes(nextIndex)) {
    nextIndex = (nextIndex + offset + charactersLength) % charactersLength;
  }

  return nextIndex;
}

export function findCharacterIndex(characters: Character[], charID: string): number {
  return characters.findIndex((character) => character.charID === charID);
}

export function getNextMarkedIndex(
  currentIndex: number,
  direction: Direction,
  characters: Character[],
  selectedCharacters: number[]
): number {
  let nextIndex = getSlideIndex(currentIndex, direction, characters.length, selectedCharacters);

  while (!characters[nextIndex].indexMark) {
    nextIndex = getSlideIndex(nextIndex, direction, characters.length, selectedCharacters);
  }

  return nextIndex;
}

export function getRandomAvailableIndex(characters: Character[], selectedCharacters: number[]): number {
  const available = characters
    .map((_, index) => index)
    .filter((index) => !selectedCharacters.includes(index));

  if (available.length === 0) {
    return selectedCharacters[selectedCharacters.length - 1] ?? 0;
  }

  return available[Math.floor(Math.random() * available.length)];
}

export function blurActiveControl(): void {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
}
