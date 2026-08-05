import { useCallback, useEffect, useRef, useState } from "react"

/**
 * Runs `loader` on mount and again whenever the tab regains focus/visibility,
 * so the UI always reflects the latest backend state without a manual refresh.
 * Returns a `refresh()` you can call right after any successful mutation.
 */
export function useLiveData(loader: () => Promise<void>, deps: unknown[] = []) {
  const [loading, setLoading] = useState(true)
  const running = useRef(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableLoader = useCallback(loader, deps)

  const refresh = useCallback(async () => {
    if (running.current) return
    running.current = true
    try {
      await stableLoader()
    } finally {
      running.current = false
      setLoading(false)
    }
  }, [stableLoader])

  useEffect(() => {
    refresh()
    const onFocus = () => refresh()
    const onVisible = () => { if (document.visibilityState === "visible") refresh() }
    window.addEventListener("focus", onFocus)
    document.addEventListener("visibilitychange", onVisible)
    return () => {
      window.removeEventListener("focus", onFocus)
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [refresh])

  return { loading, refresh }
}
