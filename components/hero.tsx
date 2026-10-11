'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import type { SiteSettings } from '@/lib/data'

type Locale = 'en' | 'ar'

export function Hero({ locale, settings }: { locale: Locale; settings: SiteSettings }) {
  const ar = locale === 'ar'
  const ref = useRef<HTMLDivElement>(null)

  // Apply the animation class after detecting loader completion.
  useEffect(() => {
    const root = document.documentElement
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (ref.current) ref.current.dataset.hero = 'done'
      return
    }

    // First check: already done from previous visit?
    if (root.dataset.intro === 'done') {
      ref.current!.dataset.hero = 'run'
      ref.current!.style.setProperty('--hero-speed', '.5')
      return
    }

    // Otherwise, observe for the loader to finish.
    const observer = new MutationObserver(() => {
      if (root.dataset.intro === 'done') {
        observer.disconnect()
        ref.current!.dataset.hero = 'run'
        ref.current!.style.setProperty('--hero-speed', '.5')
      }
    })
    observer.observe(root, { attributes: true, attributeFilter: ['data-intro'] })

    // Safety: if loader never finishes within 6s, just show final state.
    const fallback = setTimeout(() => {
      observer.disconnect()
      ref.current!.dataset.hero = 'run'
      ref.current!.style.setProperty('--hero-speed', '.5')
    }, 6000)

    return () => {
      observer.disconnect()
      clearTimeout(fallback)
    }
  }, [locale, settings])

  // Keep the final state visible at all times; SSR shows the final layout.
  useEffect(() => {
    // Ensure any SSR-rendered final state is visible immediately on first client paint.
    const el = ref.current
    if (!el) return
    // The 'idle' default means the CSS has the final state; we only add 'run'/'done'.
    // No animation delays are applied until the class is added post-hydration.
  }, [])

  const hours = Array.isArray(settings.hours) ? settings.hours : []
  const hoursText = hours
    .filter((h) => typeof h === 'string')
    .map((h) => h.trim())
    .filter((h) => h.length > 0)
    .join(' · ')

  return (
    <section
      ref={ref}
      className="hero"
      data-hero="idle"
      aria-label={ar ? 'شاشة الترحيب' : 'Hero section'}
      style={{ '--hero-speed': '1' }}
    >
      <div className="hero-container">
        <div className="hero-grid">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-line hero-title-line-1">
                {ar ? 'الدنيا معقدة،' : 'Life\'s complicated.'}
              </span>
              <span className="hero-title-line hero-title-line-2">
                {ar ? 'بس القهوة بسيطة.' : "Coffee's simple."}
              </span>
            </h1>
            <p className="hero-sub">{ar ? 'قهوة حلوة، من غير تعقيد.' : 'Good coffee, no fuss.'}</p>

            <div className="hero-actions">
              <Link className="btn btn-primary focus-ring" href={`/${locale}/menu`}>
                {ar ? 'شوف المنيو' : 'See the menu'}
              </Link>
              <a className="btn btn-secondary focus-ring" href="#visit">
                {ar ? 'تعالى زورنا' : 'Find us'}
              </a>
            </div>

            {hoursText ? (
              <div className="hero-facts">
                <span>{ar ? 'شارع حي الجامعة، المنصورة' : 'Hay El Gamaa St, Mansoura'}</span>
                <span className="hero-rule" aria-hidden />
                <a
                  className="link"
                  href={settings.socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                >
                  {ar ? '@simplecafe.eg' : '@simplecafe.eg'}
                </a>
                {hoursText && (
                  <span>{hoursText}</span>
                )}
              </div>
            ) : null}
          </div>

          <div className="hero-media">
            <div
              className="hero-oval-wrap"
              style={{
                inlineSize: 'var(--hero-oval-w)',
                aspectRatio: '3 / 4',
              }}
            >
              <div
                className="hero-oval"
                style={{ position: 'relative' }}
              >
                <Image
                  src="/images/photos/signature-drink.jpg"
                  fill
                  priority
                  sizes="(min-width: 1024px) 45vw, (min-width: 640px) 40vw, 80vw"
                  alt={ar ? 'كوب قهوة ساقعة من سيمبل كافيه أمام أوراق خضراء' : 'Simple Cafe iced coffee held in front of green leaves'}
                  style={{ objectFit: 'cover', objectPosition: '55% 60%' }}
                />
              </div>
              <svg
                className="hero-outline"
                viewBox="0 0 300 400"
                preserveAspectRatio="none"
                aria-hidden="true"
                focusable="false"
              >
                <rect
                  x="1"
                  y="1"
                  width="298"
                  height="398"
                  rx="149"
                  pathLength="100"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <div
                className="hero-badge"
                style={{
                  insetInlineStart: 'calc(-12% + var(--hero-badge-x, 0))',
                  insetBlockEnd: '10%',
                  inlineSize: '30%',
                  aspectRatio: '1 / 1',
                  position: 'relative',
                }}
              >
                <Image
                  src="/images/photos/storefront-night.jpg"
                  fill
                  priority
                  sizes="(min-width: 1024px) 140px, 84px"
                  alt={ar ? 'واجهة سيمبل كافيه ليلاً مضيئة' : 'Simple Cafe storefront glowing warmly at night'}
                  style={{
                    objectFit: 'cover',
                    objectPosition: '50% 24%',
                    borderRadius: '999px',
                  }}
                />
              </div>
            </div>

            <svg
              className="hero-steam"
              viewBox="0 0 120 90"
              preserveAspectRatio="none"
              aria-hidden="true"
              focusable="false"
              style={{
                insetInlineStart: '0',
                insetBlockStart: '0',
                inlineSize: '100%',
                blockSize: '34%',
              }}
            >
              <path
                d="M30 86 C 22 70 38 60 30 44 C 22 28 38 18 30 4"
                vectorEffect="non-scaling-stroke"
                style={{ stroke: 'var(--ink)', strokeWidth: '1.5' }}
              />
              <path
                d="M60 86 C 52 70 68 60 60 44 C 52 28 68 18 60 4"
                vectorEffect="non-scaling-stroke"
                style={{ stroke: 'var(--ink)', strokeWidth: '1.5' }}
              />
              <path
                d="M90 86 C 82 70 98 60 90 44 C 82 28 98 18 90 4"
                vectorEffect="non-scaling-stroke"
                style={{ stroke: 'var(--ink)', strokeWidth: '1.5' }}
              />
            </svg>
          </div>
        </div>

        {/* Ink line overlay — two paths (scribble + straight line) drawn with stroke-dashoffset */}
        <svg
          className="hero-ink"
          viewBox="0 0 1000 320"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
          style={{
            insetInlineStart: '0',
            insetBlockStart: 'calc(var(--hero-title-size) * -1.15)',
            blockSize: 'calc(var(--hero-title-size) * 3.9)',
            inlineSize: 'calc(100% / var(--hero-text-frac) * (1 + (1 - var(--hero-text-frac)) * (1 - var(--hero-oval-frac)) * 0.89) + var(--ink-offset))',
            zIndex: '0',
          }}
        >
          <path
            className="hero-ink-tangle"
            d="M48 96 C 38 62 62 26 92 42 C 116 55 100 94 80 80 C 62 68 74 36 102 46 C 134 58 146 100 114 100 C 88 100 88 58 118 60 C 148 62 172 96 144 102 C 120 107 112 76 136 72 C 162 68 188 92 168 104"
            pathLength="100"
            vectorEffect="non-scaling-stroke"
            style={{ stroke: 'var(--ink)', strokeWidth: '2' }}
          />
          <path
            className="hero-ink-line"
            d="M48 300 H1000"
            pathLength="100"
            vectorEffect="non-scaling-stroke"
            style={{ stroke: 'var(--ink)', strokeWidth: '2' }}
          />
        </svg>
      </div>
    </section>
  )
}