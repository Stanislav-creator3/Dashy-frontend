import { PAGE_TYPE } from "@/entities/pages/model/page.types";
export const BLOCK_TYPES = {
  TEXT: "text",
  H1: "h1",
  H2: "h2",
  H3: "h3",
  QUOTE: "quote",
  CODE: "code",
  BULLET: "bullet",
};

export const BLOCK_CONFIGS = {
  [BLOCK_TYPES.TEXT]: {
    name: "Текст",
    icon: "T",
    description: "Просто текст",
    color: "blue",
    theme: "my-1 text-gray-800 leading-relaxed outline-none min-h-[24px]",
  },
  [BLOCK_TYPES.H1]: {
    name: "Заголовок 1",
    icon: "H1",
    description: "Большой заголовок",
    color: "gray",
    theme: "text-3xl font-bold my-4 text-gray-900 outline-none",
  },
  [BLOCK_TYPES.H2]: {
    name: "Заголовок 2",
    icon: "H2",
    description: "Средний заголовок",
    color: "gray",
    theme: "text-2xl font-bold my-3 text-gray-900 outline-none",
  },
  [BLOCK_TYPES.H3]: {
    name: "Заголовок 3",
    icon: "H3",
    description: "Маленький заголовок",
    color: "gray",
    theme: "text-xl font-bold my-2 text-gray-900 outline-none",
  },
  [BLOCK_TYPES.QUOTE]: {
    name: "Цитата",
    icon: '"',
    description: "Выделение цитаты",
    color: "green",
    theme:
      "border-l-4 border-gray-300 pl-4 italic text-gray-600 my-2 outline-none",
  },
  [BLOCK_TYPES.CODE]: {
    name: "Код",
    icon: "</>",
    description: "Блок с кодом",
    color: "purple",
    theme: "bg-gray-100 font-mono text-sm p-3 rounded border my-2 outline-none",
  },
  [BLOCK_TYPES.BULLET]: {
    name: "Список",
    icon: "•",
    description: "Маркированный список",
    color: "yellow",
    theme: "flex items-start gap-2 outline-none",
  },
};

export const COLOR_CLASSES = {
  blue: "bg-blue-100 text-blue-600",
  gray: "bg-gray-100 text-gray-600",
  green: "bg-green-100 text-green-600",
  purple: "bg-purple-100 text-purple-600",
  yellow: "bg-yellow-100 text-yellow-600",
};

export type BlockType =
  | "Paragraph"
  | "Heading"
  | "Quote"
  | "ListNumber"
  | "Code"
  | "Bullet"
  | "LinkPage"
  | "TodoList"
  | "Callout";

interface IBaseBlock {
  id?: string | null;
  order?: number;
  parentId?: string | null;
  tempId?: string;
  backgroundColor?: string;
  childrenFlag?: boolean;
  children?: IBlock[];
}

export interface IHeadingBlock extends IBaseBlock {
  type: "Heading";
  content: ITextSegment[];
  props: {
    level: number;
    align?: "left" | "center" | "right" | "justify";
    color?: string;
  };
}

export interface ITextSegment {
  text: string;
  color?: string;
  backgroundColor?: string;
  bold?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  underline?: boolean;
}

export interface IListItemSegment {
  content: ITextSegment[];
  indent?: number;
  checked?: boolean;
}

export interface IParagraphBlock extends IBaseBlock {
  type: "Paragraph";
  content: ITextSegment[];
  props: {
    align?: "left" | "center" | "right" | "justify";
    textColor?: string;
    backgroundColor?: string;
  };
}

export interface ILinkPage extends IBaseBlock {
  type: "LinkPage";
  content: {
    text: string;
    icon: string | null;
    id: string;
    typePage: PAGE_TYPE;
  };
}

export interface IBulletBlock extends IBaseBlock {
  type: "Bullet";
  content: IListItemSegment[];
  props: {};
}

export interface IQuoteBlock extends IBaseBlock {
  type: "Quote";
  content: ITextSegment[];
  props: {};
}

export interface ICodeBlock extends IBaseBlock {
  type: "Code";
  content: ITextSegment[];
  props: {};
}

export interface IListNumber extends IBaseBlock {
  type: "ListNumber";
  content: IListItemSegment[];
  props: {};
}

export interface ITodoList extends IBaseBlock {
  type: "TodoList";
  content: IListItemSegment[];
  props: {};
}

export type IBlock =
  | IHeadingBlock
  | IParagraphBlock
  | ILinkPage
  | IBulletBlock
  | IListNumber
  | IQuoteBlock
  | ICodeBlock
  | ITodoList
  | ICalloutBlock;

export interface IBlockCreate {
  type: string;
  content: [];
  children?: IBlock[];
  tempId: string;
  order?: number;
  parentId?: string;
}

export interface ICalloutBlock extends IBaseBlock {
  type: "Callout";
  children: IBlock[] | [];
  props: {
    icon: string;
    backgroundColor?: string;
  };
}

export type IBlockUpdate = IBlock;
