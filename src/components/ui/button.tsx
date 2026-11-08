import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-150 ease-out cursor-pointer disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white dark:text-[#05200E] hover:bg-primary-hover shadow-xs active:shadow-none border border-primary/20 font-semibold hover:-translate-y-0.5 active:translate-y-0",
        primary:
          "bg-primary text-white dark:text-[#05200E] hover:bg-primary-hover shadow-xs active:shadow-none border border-primary/20 font-semibold hover:-translate-y-0.5 active:translate-y-0",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 shadow-xs border border-destructive/20 font-semibold hover:-translate-y-0.5 active:translate-y-0",
        outline:
          "border border-border/90 bg-card text-foreground hover:bg-muted/80 hover:text-foreground hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs font-medium hover:-translate-y-0.5 active:translate-y-0",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/60 font-medium",
        ghost:
          "hover:bg-muted text-muted-foreground hover:text-foreground font-medium",
        link:
          "text-primary underline-offset-4 hover:underline !min-h-0 !min-w-0 p-0 h-auto font-medium",
        success:
          "bg-[#15803D] text-white hover:bg-[#166534] dark:bg-[#4ADE80] dark:text-[#05200E] dark:hover:bg-[#38C46E] shadow-xs border border-[#15803D]/20 font-semibold hover:-translate-y-0.5 active:translate-y-0",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm",
        sm: "h-8.5 px-3 py-1 text-xs font-medium rounded-lg",
        lg: "h-11.5 px-5 py-2.5 text-base font-semibold rounded-xl",
        icon: "h-10 w-10 p-0 rounded-xl",
        iconSm: "h-8.5 w-8.5 p-0 rounded-lg",
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
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
