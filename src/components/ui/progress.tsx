import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  indicatorClassName?: string
}

function Progress({ value = 0, className, indicatorClassName, ...props }: ProgressProps) {
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-gray-200", className)}
      {...props}
    >
      <div
        className={cn("h-full bg-kenya-red transition-all duration-500 ease-in-out", indicatorClassName)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

export { Progress }
