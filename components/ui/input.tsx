import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, ...props }, ref) => {
    // Extract value from props if it exists (React Hook Form register adds it)
    const propsValue = (props as any).value
    const finalValue = propsValue !== undefined ? propsValue : value
    
    // Prevent NaN from being passed to number inputs
    // Only sanitize if value is explicitly NaN, otherwise let React Hook Form manage it
    let safeValue: string | number | readonly string[] | undefined = finalValue
    
    if (type === 'number') {
      if (typeof finalValue === 'number' && isNaN(finalValue)) {
        safeValue = ''
      } else if (finalValue === undefined || finalValue === null) {
        // Don't set value prop if undefined/null - let React Hook Form manage it
        // This prevents controlled/uncontrolled warnings
        safeValue = undefined
      }
    }
    
    // Remove value from props to avoid override
    const { value: _, ...restProps } = props as any
    
    return (
      <input
        type={type}
        {...(safeValue !== undefined ? { value: safeValue } : {})}
        className={cn(
          "flex h-11 min-h-[44px] md:h-10 w-full rounded-md border border-input bg-background py-3 md:py-2 text-base px-4 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...restProps}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
