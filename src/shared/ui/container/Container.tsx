import { cva, VariantProps } from "cva";

export interface IContainer extends VariantProps<typeof variantsContainer>, React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

const variantsContainer = cva({
  base: "m-auto w-full",
  variants: {
    maxWidth: {
      xs: "max-w-[444px]",
      sm: "max-w-[600px]",
      md: "max-w-[800px]",
      lg: "max-w-[1024px]",
      xl: "max-w-[1280px]",
    },
  },
});

export default function Container({
  children,
  maxWidth = "lg",
  className,
  ...props
}: IContainer) {
  return (
    <div className={variantsContainer({ maxWidth, className })} {...props}>{children}</div>
  );
}
