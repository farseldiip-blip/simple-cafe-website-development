import Image from 'next/image'
import Link from 'next/link'
import type { SiteSettings } from '@/lib/data'

type Locale = 'en' | 'ar'

/**
 * Split the settings tagline into its two editorial lines.
 * EN: "Life's complicated." / "But coffee's simple."
 * AR: "الدنيا معقدة،" / "بس القهوة بسيطة"
 */
function splitTagline(tagline: string, ar: boolean): [string, string | null] {
  if (ar) {
    const i = tagline.indexOf('،')
    if (i === -1) return [tagline, null]
    return [tagline.slice(0, i + 1).trim(), tagline.slice(i + 1).trim() || null]
  }
  const match = tagline.match(/^(.+?\.)\s+(.+)$/)
  if (!match) return [tagline, null]
  return [match[1], match[2]]
}

export function Hero({ locale, settings }: { locale: Locale; settings: SiteSettings }) {
  const ar = locale === 'ar'
  const [line1, line2] = splitTagline(ar ? settings.tagline_ar : settings.tagline_en, ar)

  const hours = Array.isArray(settings.hours) ? settings.hours : []
  const hoursText = hours
    .filter((h): h is string => typeof h === 'string')
    .map((h) => h.trim())
    .filter(Boolean)
    .join(' · ')

  return (
    <section className="hero container" aria-label={ar ? 'شاشة الترحيب' : 'Hero section'}>
      <div className="hero-copy">
        <p className="hero-eyebrow">
          <span className="hero-eyebrow-rule" aria-hidden="true" />
          {ar ? 'المنصورة — مصر' : 'Mansoura — Egypt'}
        </p>

        <h1 className="hero-title">
          <span className="hero-title-line hero-title-line--soft">{line1}</span>
          {line2 ? <span className="hero-title-line">{line2}</span> : null}
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

        <div className="hero-facts">
          <span>{ar ? settings.address_ar : settings.address_en}</span>
          <span className="hero-facts-sep" aria-hidden="true" />
          <a
            className="link"
            dir="ltr"
            href={settings.socials.instagram}
            target="_blank"
            rel="noreferrer"
          >
            @simplecafe.eg
          </a>
          {hoursText ? (
            <>
              <span className="hero-facts-sep" aria-hidden="true" />
              <span>{hoursText}</span>
            </>
          ) : null}
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-photo-outline" aria-hidden="true" />

        <div className="hero-photo-frame">
          <Image
            src="/images/photos/signature-drink.jpg"
            fill
            priority
            data-hero-image
            sizes="(min-width: 900px) 46vw, 100vw"
            alt={
              ar
                ? 'كوب قهوة ساقعة من سيمبل كافيه أمام أوراق خضراء'
                : 'Simple Cafe iced coffee held in front of green leaves'
            }
            style={{ objectFit: 'cover', objectPosition: '58% 50%' }}
          />
          <p className="hero-photo-caption">
            {ar ? 'سيمل كافيه · المشروب المميز' : 'Simple Café · Signature drink'}
          </p>
        </div>

        <div className="hero-inset">
          <Image
            src="/images/photos/storefront-night.jpg"
            fill
            priority
            sizes="160px"
            alt={
              ar
                ? 'واجهة سيمبل كافيه ليلاً مضيئة'
                : 'Simple Cafe storefront glowing warmly at night'
            }
            style={{ objectFit: 'cover', objectPosition: '50% 22%' }}
          />
        </div>
      </div>
    </section>
  )
}
