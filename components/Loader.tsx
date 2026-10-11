'use client'

import { useEffect, useRef, useState } from 'react'

const BRAND_IN_MS = 700
const BRAND_HOLD_MS = 1200
const CURTAIN_MS = 900
const CAP_MS = 3400
const SKIP_MIN_MS = 600

type Phase = 'brand' | 'curtain' | 'gone'

export function Loader({ locale }: { locale: 'en' | 'ar' }) {
  const [phase, setPhase] = useState<Phase>('brand')
  const phaseRef = useRef<Phase>('brand')
  const skipRef = useRef<HTMLButtonElement>(null)
  const startedAt = useRef(0)
  const ar = locale === 'ar'

  useEffect(() => {
    if (document.documentElement.dataset.intro === 'done') {
      setPhase('gone')
      return
    }

    startedAt.current = performance.now()
    document.body.classList.add('intro-lock')
    skipRef.current?.focus()

    let finished = false
    let cancelled = false
    let ready = false
    let holdElapsed = false
    let holdTimer: number | undefined
    let curtainTimer: number | undefined
    let capTimer: number | undefined

    const advance = (next: Phase) => {
      phaseRef.current = next
      setPhase(next)
    }

    const finish = () => {
      if (finished) return
      finished = true
      window.clearTimeout(holdTimer)
      window.clearTimeout(curtainTimer)
      window.clearTimeout(capTimer)
      sessionStorage.setItem('sc_intro_done', '1')
      document.body.classList.remove('intro-lock')
      document.documentElement.dataset.intro = 'done'
      advance('gone')
      document.getElementById('main')?.focus({ preventScroll: true })
    }

    const liftCurtain = () => {
      if (finished || phaseRef.current !== 'brand') return
      document.documentElement.dataset.intro = 'reveal'
      advance('curtain')
      curtainTimer = window.setTimeout(finish, CURTAIN_MS)
    }

    const maybeLift = () => {
      if (ready && holdElapsed) liftCurtain()
    }

    const skip = () => {
      if (performance.now() - startedAt.current < SKIP_MIN_MS) return
      if (phaseRef.current === 'brand') liftCurtain()
      else if (phaseRef.current === 'curtain') finish()
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Enter') skip()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', skip)

    const waitForAssets = async () => {
      try {
        await document.fonts.ready
        const image = document.querySelector<HTMLImageElement>('[data-hero-image]')
        if (image?.decode) await image.decode().catch(() => undefined)
      } catch {
        // The cap below still guarantees the intro cannot block the page.
      }
      if (cancelled) return
      ready = true
      maybeLift()
    }
    void waitForAssets()

    holdTimer = window.setTimeout(() => {
      holdElapsed = true
      maybeLift()
    }, BRAND_IN_MS + BRAND_HOLD_MS)

    capTimer = window.setTimeout(() => {
      if (phaseRef.current === 'brand') liftCurtain()
      else finish()
    }, CAP_MS)

    return () => {
      cancelled = true
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', skip)
      window.clearTimeout(holdTimer)
      window.clearTimeout(curtainTimer)
      window.clearTimeout(capTimer)
      document.body.classList.remove('intro-lock')
    }
  }, [])

  if (phase === 'gone') return null

  return (
    <div
      id="intro"
      className={phase === 'curtain' ? 'intro intro--curtain' : 'intro'}
      role="status"
      aria-live="polite"
      aria-label={ar ? 'جاري تحميل سيمبل كافيه' : 'Loading Simple Cafe'}
    >
      <img
        src="/images/brand/wordmark-trace.svg"
        alt=""
        width={520}
        height={193}
        className="intro-wordmark"
      />
      <span className="intro-cafe">c a f e</span>
      <button
        ref={skipRef}
        className="intro-skip focus-ring"
        type="button"
        onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))}
      >
        {ar ? 'تخطّى' : 'Skip'}
      </button>
    </div>
  )
}

export default Loader
