import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $isElementNode, $isTextNode, ElementNode, LexicalNode } from 'lexical';
import { useEffect } from 'react';

export interface BlockData {
  id: string;
  type: string;
  content: string;
  children?: BlockData[];
  format?: any;
}

export function DataExtractorPlugin({ 
  onDataChange 
}: { 
  onDataChange: (data: BlockData[]) => void 
}) {
  const [editor] = useLexicalComposerContext();

  const extractBlockData = (): BlockData[] => {
    let blocks: BlockData[] = [];
    
    editor.getEditorState().read(() => {
      const root = $getRoot();
      const children = root.getChildren();
      
      blocks = children.map((node, index) => {
        if ($isElementNode(node)) {
          return extractElementData(node, `${index}`);
        }
        return extractTextData(node, `${index}`);
      });
    });
    
    return blocks;
  };

  const extractElementData = (node: ElementNode, id: string): BlockData => {
    const children = node.getChildren();
    const childBlocks = children.map((child, childIndex) => 
      $isElementNode(child) 
        ? extractElementData(child, `${id}.${childIndex}`)
        : extractTextData(child, `${id}.${childIndex}`)
    );

    return {
      id,
      type: node.getType(),
      content: node.getTextContent(),
      children: childBlocks.length > 0 ? childBlocks : undefined,
      format: node.getFormatType?.() || undefined
    };
  };

  const extractTextData = (node: LexicalNode, id: string): BlockData => {
    return {
      id,
      type: node.getType(),
      content: node.getTextContent(),
      format: ($isTextNode(node) && node.getFormat()) || undefined
    };
  };

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      const blocksData = extractBlockData();
      onDataChange(blocksData);
    });
  }, [editor, onDataChange]);

  return null;
}