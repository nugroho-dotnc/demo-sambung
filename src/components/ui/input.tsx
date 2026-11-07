import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-border/80 bg-card px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/80 transition-all duration-150 hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:border-transparent focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 shadow-2xs",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"
