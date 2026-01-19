import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-[var(--admin-accent-primary)] shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-[var(--admin-bg-tertiary)] text-[var(--admin-accent-tertiary)] hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        healty: "border-transparent bg-green-500 text-primary-foreground shadow hover:bg-green-600/80",
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

function Badge({ className, variant, ...props }: BadgeProps) {
  const isDefaultVariant = variant === "default" || variant === undefined;
  
  return (
    <div 
      className={cn(
        badgeVariants({ variant }), 
        isDefaultVariant && "badge-default-hover",
        className
      )} 
      {...props} 
    />
  )
}

export { Badge, badgeVariants }
