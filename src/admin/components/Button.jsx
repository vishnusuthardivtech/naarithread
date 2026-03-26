import React from 'react'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'btn inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-xl cursor-pointer transition-all duration-200 font-medium whitespace-nowrap'
  
  const variants = {
    primary: 'bg-gold text-black hover:bg-gold-hover shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]',
    secondary: 'bg-transparent text-white border border-border hover:bg-bg-hover border-gold/30 hover:border-gold/50',
    danger: 'bg-danger text-white hover:bg-red-600 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]',
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button

