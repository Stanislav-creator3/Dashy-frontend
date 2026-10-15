import { cn } from "@/lib/utils";
import { cva, VariantProps } from "cva";

const variants = cva({
  base: "focus:outline-none empty:before:content-['Без_названия'] empty:before:text-gray-400",
  variants: {
    size: {
      h1: "text-4xl",
      h2: "text-3xl",
      h3: "text-2xl",
      h4: "text-xl",
      h5: "text-lg",
      h6: "text-base",
    },
  },
  defaultVariants: {
    size: "h1",
  },
});

interface Props extends VariantProps<typeof variants> {
  titleRef: React.RefObject<HTMLHeadingElement | null>;
  onSubmit: (title: string) => void;
  className?: string;
}

export default function TitleContentEditable({
  titleRef,
  onSubmit,
  size,
  className,
}: Props) {
  const HeadingTag = size ?? "h1";

  return (
    <HeadingTag
      ref={titleRef}
      className={cn(variants({ size }), className)}
      contentEditable="true"
      suppressContentEditableWarning
      onInput={(e) => {
        let text = e.currentTarget.textContent.trim();
        if (text === "") {
          text = "Без названия";
          e.currentTarget.textContent = "";
        }
        onSubmit(text);
      }}
    />
  );
}
