import { type HTMLAttributes } from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const qnumberVariants = cva("tracking-tight transition-colors", {
  variants: {
    variant: {
      default: "font-black text-3xl lg:text-4xl",
      small: "text-2xl opacity-80",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface QNumberProps
  extends HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof qnumberVariants> {}

function QNumber({ className, variant, children, ...props }: QNumberProps) {
  return (
    <p className={cn(qnumberVariants({ className, variant }))} {...props}>
      {children}
    </p>
  );
}

export { QNumber };
