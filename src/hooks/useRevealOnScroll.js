import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const REVEAL_SELECTOR = [
  '.reveal',
  '.footer-links',
  '.hero-section',
  '.contact-section',
  '.contact-form',
  '.contact-info',
  '.contact-row',
].join(', ')

export function useRevealOnScroll(dependencies = []) {
  const location = useLocation()

  useEffect(() => {
    let frameId = 0
    let observer

    frameId = window.requestAnimationFrame(() => {
      const elements = Array.from(document.querySelectorAll(REVEAL_SELECTOR))

      elements.forEach((element) => element.classList.remove('active'))

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('active')
              observer.unobserve(entry.target)
            }
          })
        },
        {
          threshold: 0.12,
          rootMargin: '0px 0px -80px 0px',
        },
      )

      elements.forEach((element) => observer.observe(element))
    })

    return () => {
      window.cancelAnimationFrame(frameId)
      observer?.disconnect()
    }
  }, [location.pathname, ...dependencies])
}
