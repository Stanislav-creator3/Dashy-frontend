// config/editorConfig.ts
import { InitialConfigType } from '@lexical/react/LexicalComposer';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeNode } from '@lexical/code';
import { LinkNode } from '@lexical/link';

export const editorConfig: InitialConfigType = {
  namespace: 'NotionEditor',
  nodes: [
    HeadingNode,
    QuoteNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    ListItemNode,
    ListNode,
    CodeNode,
    LinkNode,
  ],
  theme: {
    text: {
      bold: 'font-bold',
      italic: 'italic',
      underline: 'underline',
      code: 'bg-gray-100 px-1 py-0.5 rounded text-sm font-mono',
    },
    heading: {
      h1: 'text-3xl font-bold my-4',
      h2: 'text-2xl font-bold my-3',
      h3: 'text-xl font-bold my-2',
    },
    paragraph: 'my-2',
    list: {
      listitem: 'ml-6',
      nested: {
        listitem: 'ml-6',
      },
      ol: 'list-decimal ml-6',
      ul: 'list-disc ml-6',
    },
    code: 'bg-gray-100 p-4 rounded-lg font-mono text-sm block my-2',
    quote: 'border-l-4 border-gray-300 pl-4 italic text-gray-600 my-2',
    table: 'border-collapse border border-gray-300 my-4',
    tableCell: 'border border-gray-300 px-3 py-2',
    tableRow: 'border border-gray-300',
  },
  onError: (error: Error) => {
    console.error('Lexical Error:', error);
  },
};