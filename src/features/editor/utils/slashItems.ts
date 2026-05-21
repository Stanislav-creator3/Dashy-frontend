import { MenuOption } from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { $createParagraphNode } from "lexical";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import {
  setBlockIdForNode,
  setOrderForNode,
  setParentBlockIdForNode,
} from "./nodeId";
import { $createListNode } from "@lexical/list";
import { $createCalloutNode } from "../nodes/CalloutNode";
import { setBlockTempId } from "../model/blockState";

export type SlashCommandType =
  | "text"
  | "h1"
  | "h2"
  | "h3"
  | "bullet"
  | "quote"
  | "ListNumber"
  | "todo"
  | "callout";

export type SlashCommandItem = {
  title: string;
  description: string;
  type: SlashCommandType;
  keywords: string[];
  markdown?: string;
  category: string;
};

export const SLASH_COMMANDS: SlashCommandItem[] = [
  {
    title: "Текст",
    description: "Обычный текст",
    type: "text",
    keywords: ["text", "paragraph", "p"],
    category: "Базовые блоки",
  },
  {
    title: "Заголовок 1",
    description: "Крупный заголовок",
    type: "h1",
    keywords: ["heading", "h1", "title", "h"],
    markdown: "#",
    category: "Базовые блоки",
  },
  {
    title: "Заголовок 2",
    description: "Средний заголовок",
    type: "h2",
    keywords: ["heading", "h2", "subtitle", "h"],
    markdown: "##",
    category: "Базовые блоки",
  },
  {
    title: "Заголовок 3",
    description: "Небольшой заголовок",
    type: "h3",
    keywords: ["heading", "h3", "h"],
    markdown: "###",
    category: "Базовые блоки",
  },
  {
    title: "Маркированный список",
    description: "Маркированный список",
    type: "bullet",
    keywords: ["list", "bullet", "ul"],
    category: "Базовые блоки",
  },
  {
    title: "Нумерованный список",
    description: "Нумерованный список",
    type: "ListNumber",
    keywords: ["list", "number", "ol"],
    category: "Базовые блоки",
  },
  {
    title: "Tody-Лист",
    description: "Список задач с чекбоксами",
    type: "todo",
    keywords: ["list", "todo", "task"],
    category: "Базовые блоки",
  },
  {
    title: "Цитата",
    description: "Блок цитаты",
    type: "quote",
    keywords: ["quote", "blockquote"],
    category: "Базовые блоки",
  },
  {
    title: "Коллаут",
    description: "Блок с иконкой для выделения важной информации",
    type: "callout",
    keywords: ["callout", "notice", "important"],
    category: "Базовые блоки",
  },
];

export class SlashMenuOption extends MenuOption {
  title: string;
  description: string;
  commandType: SlashCommandType;
  type: string;
  markdown?: string;
  category: string;

  constructor(item: SlashCommandItem) {
    super(item.title);
    this.title = item.title;
    this.description = item.description;
    this.commandType = item.type;
    this.type = item.type;
    this.markdown = item.markdown;
    this.category = item.category;
  }
}

export const getNode = (
  type: SlashCommandType,
  nodeId: string,
  order: number,
  tempId: string | null,
  parentId: string | null,
) => {
  let replacement;
  switch (type) {
    case "text":
      replacement = $createParagraphNode();
      setBlockIdForNode(replacement, nodeId);
      setBlockTempId(replacement, tempId);
      setOrderForNode(replacement, order);
      setParentBlockIdForNode(replacement, parentId);
      return replacement;
    case "h1":
      replacement = $createHeadingNode("h1");
      setBlockIdForNode(replacement, nodeId);
      setBlockTempId(replacement, tempId);
      setOrderForNode(replacement, order);
      setParentBlockIdForNode(replacement, parentId);
      return replacement;
    case "h2":
      replacement = $createHeadingNode("h2");
      setBlockIdForNode(replacement, nodeId);
      setBlockTempId(replacement, tempId);
      setOrderForNode(replacement, order);
      setParentBlockIdForNode(replacement, parentId);
      return replacement;
    case "h3":
      replacement = $createHeadingNode("h3");
      setBlockIdForNode(replacement, nodeId);
      setBlockTempId(replacement, tempId);
      setOrderForNode(replacement, order);
      setParentBlockIdForNode(replacement, parentId);
      return replacement;

    case "bullet":
      replacement = $createListNode("bullet");
      setBlockIdForNode(replacement, nodeId);
      setBlockTempId(replacement, tempId);
      setOrderForNode(replacement, order);
      setParentBlockIdForNode(replacement, parentId);
      return replacement;
    case "ListNumber":
      replacement = $createListNode("number");
      setBlockIdForNode(replacement, nodeId);
      setBlockTempId(replacement, tempId);
      setOrderForNode(replacement, order);
      setParentBlockIdForNode(replacement, parentId);
      return replacement;
    case "quote":
      replacement = $createQuoteNode();
      setBlockIdForNode(replacement, nodeId);
      setBlockTempId(replacement, tempId);
      setOrderForNode(replacement, order);
      setParentBlockIdForNode(replacement, parentId);
      return replacement;

    case "todo":
      replacement = $createListNode("check");
      setBlockIdForNode(replacement, nodeId);
      setBlockTempId(replacement, tempId);
      setOrderForNode(replacement, order);
      setParentBlockIdForNode(replacement, parentId);
      return replacement;

    case "callout":
      replacement = $createCalloutNode();
      setBlockIdForNode(replacement, nodeId);
      setBlockTempId(replacement, tempId);
      setOrderForNode(replacement, order);
      setParentBlockIdForNode(replacement, parentId);
      return replacement;

    default:
      replacement = $createParagraphNode();
      setBlockIdForNode(replacement, nodeId);
      setBlockTempId(replacement, tempId);
      setOrderForNode(replacement, order);
      setParentBlockIdForNode(replacement, parentId);
      return replacement;
  }
};
