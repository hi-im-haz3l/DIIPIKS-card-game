import { useRef, useCallback, useMemo } from 'react'

export function useResizeObserverRef(setBounding) {
  if (typeof window === 'undefined') return null

  const ref = useRef(null)

  const observer = useMemo(
    () =>
      new ResizeObserver(entries => {
        setBounding(entries[0].target.getBoundingClientRect())
      }),
    []
  )

  return useCallback(
    node => {
      if (node && !!Object.values(node).length) {
        ref.current = node
        observer.observe(node)
      } else {
        observer.unobserve(ref.current)
        ref.current = null
      }
    },
    [observer]
  )
}
