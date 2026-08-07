import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsContextValue {
  value?: string
  onValueChange?: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue>({})

function Tabs({ defaultValue, value, onValueChange, className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
}) {
  return (
    <TabsContext.Provider value={{ value: value || defaultValue, onValueChange }}>
      <div className={cn("", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

function TabsList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="tablist"
      className={cn("inline-flex h-9 items-center justify-center rounded-lg bg-gray-100 p-1 text-gray-500", className)}
      {...props}
    />
  )
}

function TabsTrigger({ value, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { value?: string }) {
  const { value: selectedValue, onValueChange } = React.useContext(TabsContext)
  const isActive = value === selectedValue
  return (
    <button
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? 'active' : 'inactive'}
      onClick={() => onValueChange?.(value || '')}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50",
        isActive ? "bg-white text-kenya-black shadow-sm" : "text-gray-500 hover:text-kenya-black",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ value, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { value?: string }) {
  const { value: selectedValue } = React.useContext(TabsContext)
  if (value !== selectedValue) return null
  return (
    <div
      role="tabpanel"
      data-state={value === selectedValue ? 'active' : 'inactive'}
      className={cn("mt-2 focus-visible:outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
