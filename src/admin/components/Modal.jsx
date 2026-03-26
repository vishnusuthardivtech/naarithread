import React from 'react'
import Button from './Button'

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) => {
  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
  }

  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div
        className={`modal-card bg-bg-card border border-border rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-xl font-semibold text-text-primary">{title}</h3>
          <Button variant="secondary" size="sm" onClick={onClose} className="hover:bg-bg-hover">
            <span className="text-lg">x</span>
          </Button>
        </div>

        <div className="modal-body p-6">{children}</div>

        {footer ? <div className="modal-footer flex justify-end gap-3 p-6 border-t border-border bg-bg-hover">{footer}</div> : null}
      </div>
    </div>
  )
}

export default Modal
