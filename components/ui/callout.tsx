import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const calloutVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        warning: "border-yellow-200 bg-yellow-50 text-yellow-800 [&>svg]:text-yellow-600",
        info: "border-blue-200 bg-blue-50 text-blue-800 [&>svg]:text-blue-600",
        error: "border-red-200 bg-red-50 text-red-800 [&>svg]:text-red-600",
        success: "border-green-200 bg-green-50 text-green-800 [&>svg]:text-green-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface CalloutProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof calloutVariants> {
  icon?: React.ReactNode
}

const Callout = React.forwardRef<HTMLDivElement, CalloutProps>(
  ({ className, variant, icon, children, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(calloutVariants({ variant }), className)}
      {...props}
    >
      {icon}
      <div className="text-sm [&_p]:leading-relaxed">
        {children}
      </div>
    </div>
  )
)
Callout.displayName = "Callout"

const CalloutTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className="mb-1 font-medium leading-none tracking-tight"
    {...props}
  />
))
CalloutTitle.displayName = "CalloutTitle"

const CalloutDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className="text-sm [&_p]:leading-relaxed"
    {...props}
  />
))
CalloutDescription.displayName = "CalloutDescription"

export { Callout, CalloutTitle, CalloutDescription }
