import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-[transform,background-color,box-shadow,color] duration-150 ease-out disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96] min-h-11",
  {
    variants: {
      variant: {
        primary: "bg-accent text-accent-fg shadow-[var(--shadow-border)] hover:opacity-90",
        ghost: "bg-transparent text-fg shadow-[var(--shadow-border)] hover:bg-subtle",
        quiet: "bg-transparent text-muted hover:text-fg",
        mark: "bg-mark text-accent-fg",
      },
      size: {
        md: "rounded-[var(--radius-sm)] px-4 text-sm",
        sm: "rounded-[var(--radius-xs)] px-3 text-xs min-h-11",
        lg: "rounded-[var(--radius-md)] px-5 text-sm min-h-12",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>) {
  return (
    <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
