import * as React from "react"
import * as ToastPrimitive from "@radix-ui/react-toast"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

const ToastProvider = ToastPrimitive.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      "fixed top-4 right-4 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:max-w-[400px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitive.Viewport.displayName

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> & { variant?: "default" | "destructive" | "success" | "warning" }
>(({ className, variant = "default", ...props }, ref) => {
  const baseClasses =
    "group pointer-events-auto relative flex w-full items-center justify-between gap-2 overflow-hidden rounded-md border bg-white px-3 py-2 text-sm shadow-lg"
  const variantClasses = {
    default: "border-kenya-border",
    destructive: "border-red-500 bg-red-50 text-red-800",
    success: "border-green-500 bg-green-50 text-green-800",
    warning: "border-amber-500 bg-amber-50 text-amber-800",
  } as const
  return (
    <ToastPrimitive.Root
      ref={ref}
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitive.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Action
    ref={ref}
    className={cn(
      "shrink-0 rounded-md border bg-transparent px-2 py-1 text-xs font-medium hover:underline",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitive.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    className={cn(
      "absolute right-1 top-1 rounded-sm p-1 text-gray-400 opacity-70 hover:text-kenya-black hover:opacity-100",
      className
    )}
    {...props}
  >
    <X className="h-3 w-3" />
  </ToastPrimitive.Close>
))
ToastClose.displayName = ToastPrimitive.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitive.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitive.Description.displayName

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastAction,
  ToastClose,
  ToastTitle,
  ToastDescription,
}
