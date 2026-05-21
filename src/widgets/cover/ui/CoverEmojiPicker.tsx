"use client";

import { EmojiPicker } from "@/widgets/emojiPicker";
import { EmojiClickData } from "emoji-picker-react";

interface CoverEmojiPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (emoji: EmojiClickData) => void;
}

export function CoverEmojiPicker({
  open,
  onClose,
  onSelect,
}: CoverEmojiPickerProps) {
  if (!open) return null;

  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 z-20">
      <EmojiPicker
        open={open}
        onEmojiClick={(emoji) => {
          onSelect(emoji);
          onClose();
        }}
      />
    </div>
  );
}
