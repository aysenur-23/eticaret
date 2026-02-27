import * as React from "react"
import { cn } from "@/lib/utils"

const baseClass =
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"

function getVariantClass(variant?: string) {
  switch (variant) {
    case "secondary":
      return "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
    case "destructive":
      return "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80"
    case "outline":
      return "text-foreground"
    case "success":
      return "border-transparent bg-green-100 text-green-800 hover:bg-green-200"
    case "warning":
      return "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
    case "default":
    default:
      return "border-transparent bg-primary text-primary-foreground hover:bg-primary/80"
  }
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "success"
    | "warning"
    | (string & {})
  children?: React.ReactNode
}

function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <div className={cn(baseClass, getVariantClass(variant), className)} {...props}>
      {children}
    </div>
  )
}

export { Badge }
