import { useEffect } from 'react'

export function useAdminBodyClass(className) {
  useEffect(() => {
    document.body.classList.add(className)

    return () => {
      document.body.classList.remove(className)
    }
  }, [className])
}
