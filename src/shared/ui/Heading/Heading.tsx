import { cn } from "@/shared/utils/utils";
import { cva, VariantProps } from "cva";

const headingSizes = cva({
  variants: {
    size: {
      sm: "text-lg",
      default: "text-2xl",
      lg: "text-4xl",
      xl: "text-5xl",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface HeadingProps extends VariantProps<typeof headingSizes> {
  title: string;
  description?: string;
}

export default function Heading({ size, title, description }: HeadingProps) {
  return (
    <div className="space-y-2">
      <h1
        className={cn("font-semibold text-foreground", headingSizes({ size }))}
      >
        {title}
      </h1>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
}
