import React from 'react'

const Badge = ({ 
  children, 
  variant = 'gold', 
  className = '', 
  size = 'md',
  ...props 
}) => {
  const baseClasses = 'badge inline-flex items-center px-3 py-1 rounded-full font-semibold text-xs uppercase tracking-wide'
  
  const variants = {
    gold: 'bg-gold/10 text-gold border border-gold/20',
    success: 'bg-success/10 text-success border border-success/20',
    danger: 'bg-danger/10 text-danger border border-danger/20',
    processing: 'bg-gold/10 text-gold border border-gold/20',
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  }
  
  return (
    <span 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge

