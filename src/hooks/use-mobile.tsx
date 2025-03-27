
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Initialisation côté client seulement
    if (typeof window !== 'undefined') {
      return window.innerWidth < MOBILE_BREAKPOINT
    }
    return false
  })

  React.useEffect(() => {
    // Optimisation pour éviter des re-rendus inutiles
    if (typeof window === 'undefined') return

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches)
    }
    
    // Vérification initiale
    handleChange(mql)
    
    // Utilisation de l'API moderne pour les événements MediaQueryList
    mql.addEventListener("change", handleChange)
    
    return () => mql.removeEventListener("change", handleChange)
  }, [])

  return isMobile
}
