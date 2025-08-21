import * as React from "react"
import { cn } from "@/lib/utils"

interface NotificationProps {
  message: string
  type?: "success" | "error" | "info"
  onClose?: () => void
}

const Notification = React.forwardRef<HTMLDivElement, NotificationProps>(
  ({ className, message, type = "info", onClose, ...props }, ref) => {
    const bgColor = {
      success: "bg-green-500",
      error: "bg-red-500",
      info: "bg-blue-500"
    }[type]

    return (
      <div
        ref={ref}
        className={cn(
          "fixed top-4 right-4 p-4 rounded-md text-white shadow-lg z-50",
          bgColor,
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between">
          <span>{message}</span>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-4 text-white hover:text-gray-200"
            >
              ×
            </button>
          )}
        </div>
      </div>
    )
  }
)

Notification.displayName = "Notification"

export { Notification }