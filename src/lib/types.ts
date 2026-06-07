export type Character = {
  charID: string;
  name: string;
  title: string;
  indexMark?: boolean;
};

export type Direction = 'next' | 'prev';

export type PanelName = 'panel1' | 'panel2' | 'panel3';

export type LockedPanels = Record<PanelName, boolean>;

export type CharacterPanel = {
  name: string;
  image: string;
};
