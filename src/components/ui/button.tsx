import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Classes de base
    let baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    
    // Classes selon la variante
    let variantClasses = ""
    switch (variant) {
      case 'default':
        variantClasses = "btn-primary"
        break
      case 'outline':
        variantClasses = "btn-outline"
        break
      case 'ghost':
        variantClasses = "bg-transparent hover:bg-gray-100 text-gray-900"
        break
      case 'link':
        variantClasses = "bg-transparent text-blue-600 underline hover:text-blue-800"
        break
      case 'destructive':
        variantClasses = "bg-red-600 text-white hover:bg-red-700"
        break
      case 'secondary':
        variantClasses = "bg-gray-200 text-gray-900 hover:bg-gray-300"
        break
    }
    
    // Classes selon la taille
    let sizeClasses = ""
    switch (size) {
      case 'default':
        sizeClasses = "px-4 py-2 text-sm rounded-md"
        break
      case 'sm':
        sizeClasses = "px-3 py-1.5 text-xs rounded"
        break
      case 'lg':
        sizeClasses = "px-6 py-3 text-base rounded-lg"
        break
      case 'icon':
        sizeClasses = "p-2 rounded-md"
        break
    }
    
    const finalClassName = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`.trim()
    
    return (
      <Comp
        className={finalClassName}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
