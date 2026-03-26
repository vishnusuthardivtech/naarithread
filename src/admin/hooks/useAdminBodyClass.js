import { useEffect } from 'react'

export function useAdminBodyClass(className) {
  useEffect(() => {
    document.body.classList.add('admin-new-theme', className)

    return () => {
      document.body.classList.remove('admin-new-theme', className)
    }
  }, [className])
}
