import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ChartCardProps {
  title: string
  description?: string
  children: ReactNode
  actions?: ReactNode
  className?: string
}

function ChartCard({
  title,
  description,
  children,
  actions,
  className,
}: ChartCardProps) {
  return (
    <Card className={cn("h-full w-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {description && <p className="text-xs text-kenya-black/60">{description}</p>}
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </CardHeader>
      <CardContent className="h-full pt-0">
        {children}
      </CardContent>
    </Card>
  )
}

export default ChartCard