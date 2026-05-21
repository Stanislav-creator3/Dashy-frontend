import { ITextSegment } from "@/features/editor/model/block.types";
import { cn } from "@/lib/utils";

export function TextPreview({ segments }: { segments: ITextSegment[] }) {
  if (segments.length === 0) return null;

  return (
    <>
      {segments.map((segment, index) => (
        <span
          key={index}
          className={cn(
            segment.bold && "font-semibold",
            segment.italic && "italic",
            segment.underline && "underline",
            segment.strikethrough && "line-through",
          )}
          style={{
            color: segment.color,
            backgroundColor: segment.backgroundColor,
          }}
        >
          {segment.text}
        </span>
      ))}
    </>
  );
}
