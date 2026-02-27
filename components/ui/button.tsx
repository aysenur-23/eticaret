import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-brand text-brand-foreground shadow-md hover:bg-brand-hover hover:shadow-lg hover:scale-105 active:scale-100",
        destructive:
          "bg-destructive text-destructive-foreground shadow-md hover:opacity-90 hover:shadow-lg hover:scale-105 active:scale-100",
        outline:
          "border-2 border-palette bg-background shadow-sm hover:bg-surface hover:border-brand/50 hover:scale-105 active:scale-100",
        secondary:
          "bg-surface text-ink shadow-sm hover:bg-muted hover:shadow-md hover:scale-105 active:scale-100",
        ghost: "hover:bg-surface hover:scale-105 active:scale-100",
        link: "text-brand underline-offset-4 hover:text-brand-hover hover:underline",
      },
      size: {
        default: "h-11 min-h-[44px] md:h-9 md:min-h-0 px-4 py-2.5 md:py-2 text-base md:text-sm",
        sm: "h-10 min-h-[44px] md:h-8 md:min-h-0 rounded-md px-3.5 md:px-3 text-sm md:text-xs",
        lg: "h-12 min-h-[48px] md:h-10 md:min-h-0 rounded-md px-8 text-lg md:text-base",
        icon: "h-11 w-11 min-h-[44px] min-w-[44px] md:h-9 md:w-9 md:min-h-0 md:min-w-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
