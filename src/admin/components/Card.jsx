import React from 'react'

const Card = ({ 
  children, 
  className = '', 
  title, 
  subtitle,
  actions,
  ...props 
}) => {
  return (
    <div className={`admin-card bg-bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all ${className}`} {...props}>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-xl font-semibold text-text-primary mb-1">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-text-secondary text-sm">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
      {actions && (
        <div className="flex justify-end mt-6 pt-6 border-t border-border">
          {actions}
        </div>
      )}
    </div>
  )
}

export default Card

