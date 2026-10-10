'use client'

import { useEffect, useRef, useState } from 'react'

const MINIMUM_MS = 1600
const CAP_MS = 3000

export function Loader({ locale }: { locale: 'en' | 'ar' }) {
  const [visible, setVisible] = useState(true)
  const skipRef = useRef<HTMLButtonElement>(null)
  const startedAt = useRef<number | null>(null)
  const ar = locale === 'ar'

  useEffect(() => {
    const introDone = document.documentElement.dataset.intro === 'done'
    if (introDone) {
      setVisible(false)
      return
    }

    startedAt.current = performance.now()
    document.body.classList.add('intro-lock')
    skipRef.current?.focus()

    let finished = false
    let finishTimer: number | undefined
    let capTimer: number | undefined
    const finish = () => {
      if (finished) return
      finished = true
      window.clearTimeout(finishTimer)
      window.clearTimeout(capTimer)
      sessionStorage.setItem('sc_intro_done', '1')
      document.body.classList.remove('intro-lock')
      document.documentElement.dataset.intro = 'done'
      setVisible(false)
      document.getElementById('main')?.focus()
    }
    const skip = () => {
      const elapsed = performance.now() - (startedAt.current ?? 0)
      if (elapsed >= 800) finish()
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Enter') skip()
    }
    const onTap = () => skip()
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onTap)

    const ready = async () => {
      try {
        await document.fonts.ready
        const image = document.querySelector<HTMLImageElement>('[data-hero-image]')
        if (image?.decode) await image.decode().catch(() => undefined)
      } catch {
        // The cap still guarantees the intro cannot block the page.
      }
      const remaining = Math.max(0, MINIMUM_MS - (performance.now() - (startedAt.current ?? 0)))
      finishTimer = window.setTimeout(finish, remaining + 800)
    }
    void ready()
    capTimer = window.setTimeout(finish, CAP_MS)

    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onTap)
      window.clearTimeout(finishTimer)
      window.clearTimeout(capTimer)
      document.body.classList.remove('intro-lock')
    }
  }, [])

  if (!visible) return null

  return (
    <div id="intro" className="intro" role="status" aria-live="polite" aria-label={ar ? 'جاري تحميل سيمبل كافيه' : 'Loading Simple Cafe'}>
      <svg className="intro-svg" viewBox="0 0 720 180" aria-hidden="true">
        <path className="intro-scribble" d="M104 91 C80 28 177 25 169 88 S265 153 260 75 S357 22 353 92 S455 148 448 78 S542 30 535 91 S624 141 617 72" />
        <image href="/images/brand/wordmark-trace.svg" x="100" y="35" width="520" height="110" preserveAspectRatio="xMidYMid meet" className="intro-wordmark" />
      </svg>
      <span className="intro-cafe">c a f e</span>
      <button ref={skipRef} className="intro-skip focus-ring" type="button" onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))}>{ar ? 'تخطّى' : 'Skip'}</button>
    </div>
  )
}

export default Loader
