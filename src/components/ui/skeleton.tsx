import * as React from "react"
import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("relative overflow-hidden rounded-md bg-gray-200", className)}
      {...props}
    >
      <div className="shimmer-effect" />
    </div>
  )
}

export { Skeleton }
