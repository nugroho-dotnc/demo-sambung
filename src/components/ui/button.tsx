import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 ease-out cursor-pointer disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white dark:text-[#182117] hover:bg-primary-hover shadow-xs border border-transparent font-semibold",
        primary:
          "bg-primary text-white dark:text-[#182117] hover:bg-primary-hover shadow-xs border border-transparent font-semibold",
        destructive:
          "bg-destructive text-white hover:opacity-90 shadow-xs border border-transparent font-semibold",
        outline:
          "border border-border/80 bg-card text-foreground hover:bg-muted/70 hover:text-foreground hover:border-border shadow-2xs font-medium",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/50 font-medium",
        ghost:
          "hover:bg-muted/70 text-muted-foreground hover:text-foreground font-medium",
        link:
          "text-primary underline-offset-4 hover:underline !min-h-0 !min-w-0 p-0 h-auto font-medium",
        success:
          "bg-[#246447] text-white hover:bg-[#1B4D36] dark:bg-[#A9D6B0] dark:text-[#182117] dark:hover:bg-[#97C59E] shadow-xs border border-transparent font-semibold",
      },
      size: {
        default: "h-9.5 px-4 py-2 text-sm",
        sm: "h-8 px-3 py-1 text-xs font-medium rounded-md",
        lg: "h-11 px-5 py-2.5 text-sm font-semibold rounded-lg",
        icon: "h-9.5 w-9.5 p-0 rounded-lg",
        iconSm: "h-8 w-8 p-0 rounded-md",
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
