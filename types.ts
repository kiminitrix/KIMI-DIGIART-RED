
export enum AppTab {
  IMAGINABLE = 'Imaginable',
  EDITABLE = 'Editable',
  PROMPTABLE = 'Promptable',
  COLLECTABLE = 'Collectable'
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
}

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '3:2' | '2:3';

export const RATIO_OPTIONS: { label: string; value: AspectRatio }[] = [
  { label: 'Square (1:1)', value: '1:1' },
  { label: 'Landscape (16:9)', value: '16:9' },
  { label: 'Portrait (9:16)', value: '9:16' },
  { label: 'Standard (4:3)', value: '4:3' },
  { label: 'Standard Portrait (3:4)', value: '3:4' },
  { label: 'Classic (3:2)', value: '3:2' },
  { label: 'Classic (2:3)', value: '2:3' },
];
