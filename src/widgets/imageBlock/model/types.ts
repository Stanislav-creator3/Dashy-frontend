export type ImageLayout = 1 | 2 | 3 | 4;

export interface IImageItem {
  id: string;
  url?: string | null;
  alt?: string | null;
  description?: string | null;
}

export const isImageLayout = (value: number): value is ImageLayout =>
  value === 1 || value === 2 || value === 3 || value === 4;
