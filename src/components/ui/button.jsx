import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary button: bright accent on dark background with white text
        default:
          "bg-[#ff3cfe] text-white shadow hover:bg-[#ff3cfe]/90",
        // Destructive actions: red but still high contrast on black
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-700",
        // Outline buttons: transparent with white border/text for dark backgrounds
        outline:
          "border border-white text-white shadow-sm hover:bg-white/10",
        // Secondary buttons: subtle lighter background but still visible on black
        secondary:
          "bg-white/10 text-white shadow-sm hover:bg-white/20",
        // Ghost: minimal but with white text and light hover background
        ghost: "text-white hover:bg-white/10",
        // Links: white text with underline on hover
        link: "text-white underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
