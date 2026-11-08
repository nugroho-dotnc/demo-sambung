import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border border-primary/20 bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary shadow-2xs",
        secondary:
          "border border-border/80 bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border border-destructive/25 bg-destructive/10 text-destructive shadow-2xs dark:bg-destructive/20",
        outline:
          "text-foreground border border-border/90 bg-card/80",
        highlight:
          "bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800/80 font-bold",
        muted:
          "bg-muted text-muted-foreground border border-border/60",
        success:
          "border border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800/80 dark:bg-emerald-950/50 dark:text-emerald-300 shadow-2xs",
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
