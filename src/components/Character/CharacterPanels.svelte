<script lang="ts">
  import { untrack } from 'svelte';
  import type { CharacterPanel, LockedPanels, PanelName } from '../../lib/types';

  type Props = {
    name: string;
    image: string;
    lockedPanels: LockedPanels;
    isMobile?: boolean;
  };

  let { name, image, lockedPanels, isMobile = false }: Props = $props();

  const blankPanel: CharacterPanel = { name: ' ', image: '/portraits/blank.webp' };

  let panels = $state<Record<PanelName, CharacterPanel>>({
    panel1: { name: '', image: '' },
    panel2: blankPanel,
    panel3: blankPanel
  });

  let visiblePanels: PanelName[] = $derived(isMobile ? ['panel1'] : ['panel2', 'panel1', 'panel3']);

  function nextPanel(panel: PanelName): CharacterPanel {
    if (panel === 'panel2' && !lockedPanels.panel1) {
      return blankPanel;
    }

    if (panel === 'panel3' && !lockedPanels.panel2) {
      return blankPanel;
    }

    return { name, image };
  }

  $effect(() => {
    const nextPanels = untrack(() => ({ ...panels }));
    let changed = false;

    for (const panel of ['panel2', 'panel1', 'panel3'] as const) {
      if (!lockedPanels[panel]) {
        const next = nextPanel(panel);

        if (nextPanels[panel].name !== next.name || nextPanels[panel].image !== next.image) {
          nextPanels[panel] = next;
          changed = true;
        }
      }
    }

    if (changed) {
      panels = nextPanels;
    }
  });
</script>

<div class="characters-container">
  {#each visiblePanels as panel (panel)}
    {@const selectedPanel = panels[panel]}
    {@const isBlankPanel = selectedPanel.name === ' ' && selectedPanel.image === blankPanel.image}

    <article class:blank-panel={isBlankPanel} class="character-panel">
      <h2>{selectedPanel.name || name}</h2>
      <img class="character-portrait" src={selectedPanel.image || image} alt={selectedPanel.name || name} />
    </article>
  {/each}
</div>

<style>
  .characters-container {
    width: min(100%, 1380px);
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: end;
    justify-items: center;
    gap: clamp(0.5rem, 1vw, 1.5rem);
  }

  .character-panel {
    min-width: 0;
    display: grid;
    justify-items: center;
    align-items: end;
  }

  h2 {
    z-index: 2;
    max-width: 100%;
    margin: 0;
    padding: 0.28em clamp(2rem, 5vw, 5rem);
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(1.35rem, 2.6vw, 2.25rem);
    line-height: 1.05;
    text-align: center;
    color: #181818;
    background-image: linear-gradient(to right, transparent, white 24%, white 76%, transparent);
  }

  .blank-panel h2 {
    background-image: none;
  }

  .character-portrait {
    z-index: 1;
    width: min(100%, 500px);
    height: auto;
    margin-top: -18%;
    object-fit: contain;
    filter: drop-shadow(0 24px 36px rgba(0, 0, 0, 0.28));
  }

  .blank-panel .character-portrait {
    filter: none;
  }

  @media (max-width: 1200px) {
    h2 {
      display: none;
    }
  }

  @media (max-width: 768px) {
    .characters-container {
      grid-template-columns: minmax(0, 1fr);
      align-self: end;
    }

    .character-portrait {
      width: min(92vw, 540px);
      max-height: 62vh;
      margin-top: 0;
    }
  }
</style>
