import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-white dark:text-[#182117] shadow-2xs hover:bg-primary-hover",
        secondary:
          "border border-border/50 bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive/15 text-destructive border border-destructive/25 shadow-2xs",
        outline: "text-foreground border border-border/80 bg-card/60",
        highlight: "bg-highlight text-highlight-foreground font-bold border border-highlight/40",
        muted: "bg-muted/80 text-muted-foreground border border-border/40",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}
