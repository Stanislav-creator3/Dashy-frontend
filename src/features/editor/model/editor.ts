export type BlockType = 
  | 'paragraph'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'bullet-list'
  | 'numbered-list'
  | 'code'
  | 'quote';

export interface Block {
  id: string;
  type: BlockType;
  content: string;
}