import { useState, useCallback } from "react";
import { BLOCK_TYPES } from "../model/block.types";

export function useBlocks(initialBlocks = [{ id: 1, type: BLOCK_TYPES.TEXT }]) {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [focusedBlockId, setFocusedBlockId] = useState(initialBlocks[0]?.id);

  const addBlock = useCallback((afterId: number, type = BLOCK_TYPES.TEXT) => {
    const newBlock = {
      id: Date.now() + Math.random(), 
      type,
    };

    setBlocks((prev) => {
      const index = prev.findIndex((block) => block.id === afterId);
      const newBlocks = [...prev];
      newBlocks.splice(index + 1, 0, newBlock);
      return newBlocks;
    });

    setFocusedBlockId(newBlock.id);
  }, []);

  const deleteBlock = useCallback(
    (id: number) => {
      if (blocks.length <= 1) return;

      setBlocks((prev) => {
        const newBlocks = prev.filter((block) => block.id !== id);
        const deletedIndex = prev.findIndex((block) => block.id === id);

        if (deletedIndex > 0) {
          setFocusedBlockId(prev[deletedIndex - 1].id);
        } else if (newBlocks.length > 0) {
          setFocusedBlockId(newBlocks[0].id);
        }

        return newBlocks;
      });
    },
    [blocks.length]
  );

  const updateBlockType = useCallback((id: number, newType: string) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === id ? { ...block, type: newType } : block
      )
    );
  }, []);

  const addBlockToEnd = useCallback((type = BLOCK_TYPES.TEXT) => {
    const newBlock = {
      id: Date.now() + Math.random(),
      type,
    };
    setBlocks((prev) => [...prev, newBlock]);
    setFocusedBlockId(newBlock.id);
  }, []);

  const focusBlock = useCallback((id: number) => {
    setFocusedBlockId(id);
  }, []);

  return {
    blocks,
    focusedBlockId,
    addBlock,
    deleteBlock,
    updateBlockType,
    addBlockToEnd,
    focusBlock,
    setBlocks,
  };
}
