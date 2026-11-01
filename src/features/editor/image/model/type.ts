export interface IImageItem {
  id: string;
  url?: string | null;
  alt?: string | null;
  description?: string | null;
}

export interface ImageBlockProps {
  imageList?: IImageItem[];
  layout?: 1 | 2 | 3 | 4;
}
