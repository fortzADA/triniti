import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { TrinityLogo } from '@/components/TrinityLogo'
import {
  getStoredLang,
  presentationCopy,
  storeLang,
  type Lang,
} from '@/i18n/presentation'

export function PresentationPage() {
  const { user } = useAuth()
  const enterTo = user ? '/feed' : '/auth'
  const [lang, setLang] = useState<Lang>(() => getStoredLang())
  const t = presentationCopy[lang]

  function toggleLang() {
    const next: Lang = lang === 'en' ? 'ro' : 'en'
    setLang(next)
    storeLang(next)
    document.documentElement.lang = next
  }

  return (
    <div
      className="presentation min-h-full overflow-x-hidden bg-[var(--color-bg)] text-[var(--color-text)]"
      lang={lang}
    >
      <header
        className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-4 backdrop-blur-md bg-[var(--color-bg)]/70"
        style={{ paddingTop: 'calc(0.75rem + var(--safe-top))' }}
      >
        <Link to="/" className="inline-flex items-center gap-2">
          <TrinityLogo size={52} />
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLang}
            className="rounded-md border border-[var(--color-gold,#d4af37)] px-3 py-1.5 text-sm font-semibold tracking-wide text-[var(--color-gold,#d4af37)] transition hover:bg-[var(--color-gold,#d4af37)]/10"
            aria-label={lang === 'en' ? 'Translate to Romanian' : 'Translate to English'}
          >
            {t.translateTo}
          </button>
          <Link
            to={enterTo}
            className="rounded-md border border-[var(--color-gold,#d4af37)] px-3 py-1.5 text-sm text-[var(--color-gold,#d4af37)] transition hover:bg-[var(--color-gold,#d4af37)]/10"
          >
            {user ? t.openApp : t.join}
          </Link>
        </div>
      </header>

      {/* Hero — one composition */}
      <section
        className="relative flex min-h-[100svh] flex-col justify-end border-l-4 border-[var(--color-gold,#d4af37)]"
        style={{
          backgroundImage:
            'linear-gradient(105deg, rgba(12,26,20,0.92) 0%, rgba(12,26,20,0.72) 48%, rgba(12,26,20,0.35) 100%), url(/presentation/ppt-bg-01-title.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="pres-fade relative z-10 max-w-3xl px-6 pb-16 pt-28 md:px-12 md:pb-20">
          <p className="pres-eyebrow mb-3 text-xs font-semibold tracking-[0.2em] text-[var(--color-gold,#d4af37)] uppercase">
            {t.heroEyebrow}
          </p>
          <h1 className="pres-display text-6xl leading-[0.95] tracking-tight text-[var(--color-accent)] md:text-8xl">
            Trinity
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--color-text)] md:text-xl">
            {t.heroLead}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={enterTo}
              className="pres-cta rounded-md bg-[var(--color-accent)] px-5 py-3 font-semibold text-[var(--color-bg)] transition hover:bg-[var(--color-accent-dim)]"
            >
              {user ? t.enterCommunity : t.joinFamily}
            </Link>
            <a
              href="#need"
              className="rounded-md border border-[var(--color-border)] px-5 py-3 text-[var(--color-text-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-text)]"
            >
              {t.learnMore}
            </a>
          </div>
          <div className="mt-8">
            <p className="pres-eyebrow text-[11px] font-semibold tracking-[0.18em] text-[var(--color-gold,#d4af37)] uppercase">
              {t.comingSoonLabel}
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2.5 border border-[var(--color-border)] bg-[var(--color-bg)]/40 px-4 py-2 text-sm text-[var(--color-text-muted)] backdrop-blur-sm">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 shrink-0 fill-[var(--color-accent)]"
                  aria-hidden
                >
                  <path d="M17.6 9.48l1.84-3.18a.5.5 0 10-.87-.5l-1.86 3.22A11.4 11.4 0 0012 8c-1.6 0-3.1.33-4.71 1.02L5.43 5.8a.5.5 0 10-.87.5L6.4 9.48C3.53 11.1 1.65 14.05 1.5 17.5h21c-.15-3.45-2.03-6.4-4.9-8.02zM7.75 15.25a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm8.5 0a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" />
                </svg>
                {t.comingSoonAndroid}
              </span>
              <span className="inline-flex items-center gap-2.5 border border-[var(--color-border)] bg-[var(--color-bg)]/40 px-4 py-2 text-sm text-[var(--color-text-muted)] backdrop-blur-sm">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 shrink-0 fill-[var(--color-accent)]"
                  aria-hidden
                >
                  <path d="M16.37 12.79c.03-2.45 2-3.63 2.09-3.69-1.14-1.66-2.91-1.89-3.54-1.91-1.5-.15-2.94.89-3.7.89-.77 0-1.95-.87-3.21-.84-1.65.02-3.17.96-4.02 2.44-1.71 2.97-.44 7.37 1.23 9.78.82 1.18 1.79 2.5 3.07 2.45 1.23-.05 1.7-.8 3.19-.8 1.49 0 1.91.8 3.21.77 1.33-.02 2.17-1.2 2.98-2.39.94-1.37 1.33-2.7 1.35-2.77-.03-.01-2.59-.99-2.62-3.93zM14.1 5.45c.68-.82 1.13-1.96 1.01-3.1-1.04.04-2.26.65-2.99 1.47-.66.73-1.23 1.9-1.08 3.02 1.11.09 2.25-.56 3.06-1.39z" />
                </svg>
                {t.comingSoonIos}
              </span>
            </div>
          </div>
          <p className="mt-8 max-w-md text-sm text-[var(--color-text-muted)]">{t.endorsedBy}</p>
        </div>
      </section>

      {/* The Need */}
      <section
        id="need"
        className="relative border-l-4 border-[var(--color-gold,#d4af37)] px-6 py-20 md:px-12"
        style={{
          backgroundImage:
            'linear-gradient(rgba(12,26,20,0.78), rgba(12,26,20,0.88)), url(/presentation/need-bg.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="mx-auto max-w-3xl">
          <p className="pres-eyebrow text-xs font-semibold tracking-[0.18em] text-[var(--color-gold,#d4af37)] uppercase">
            {t.needEyebrow}
          </p>
          <h2 className="pres-display mt-2 text-4xl text-[var(--color-accent)] md:text-5xl">
            {t.needTitle}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-[var(--color-text)]">{t.needBody1}</p>
          <p className="mt-4 text-lg leading-relaxed text-[var(--color-text-muted)]">
            {t.needBody2}
          </p>
        </div>
      </section>

      {/* Three pillars */}
      <section
        id="pillars"
        className="border-l-4 border-[var(--color-gold,#d4af37)] px-6 py-20 md:px-12"
        style={{
          backgroundImage:
            'linear-gradient(rgba(12,26,20,0.9), rgba(12,26,20,0.94)), url(/presentation/ppt-bg-03-mission.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="mx-auto max-w-6xl">
          <p className="pres-eyebrow text-xs font-semibold tracking-[0.18em] text-[var(--color-gold,#d4af37)] uppercase">
            {t.pillarsEyebrow}
          </p>
          <h2 className="pres-display mt-2 text-4xl text-[var(--color-accent)] md:text-5xl">
            {t.pillarsTitle}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--color-text-muted)]">
            {t.pillarsLead}
          </p>

          <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {t.pillars.map((pillar) => (
              <div key={pillar.id} id={pillar.id} className="pres-rise min-w-0">
                <div className="relative mb-5 h-36 overflow-hidden border-t-2 border-[var(--color-gold,#d4af37)] md:h-40">
                  <img
                    src={pillar.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(12,26,20,0.18) 0%, rgba(12,26,20,0.55) 55%, rgba(12,26,20,0.88) 100%)',
                    }}
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute inset-0 mix-blend-multiply"
                    style={{ background: 'rgba(12, 26, 20, 0.28)' }}
                    aria-hidden
                  />
                </div>
                <p className="pres-eyebrow text-[11px] font-semibold tracking-[0.18em] text-[var(--color-gold,#d4af37)] uppercase">
                  {pillar.kicker}
                </p>
                <h3 className="pres-display mt-1 text-3xl text-[var(--color-accent)] md:text-4xl">
                  {pillar.title}
                </h3>
                <p className="mt-1 text-[var(--color-gold,#d4af37)]">{pillar.subtitle}</p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
                  {pillar.overview}
                </p>
                <ul className="mt-5 space-y-3">
                  {pillar.points.map((point) => (
                    <li key={point.text} className="flex items-start gap-2.5">
                      <img
                        src={point.icon}
                        alt=""
                        className="mt-0.5 h-5 w-5 shrink-0 object-contain opacity-90"
                      />
                      <span className="text-sm leading-snug text-[var(--color-text)]">
                        {point.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Model */}
      <section
        id="support"
        className="border-l-4 border-[var(--color-gold,#d4af37)] bg-[var(--color-surface)] px-6 py-20 md:px-12"
      >
        <div className="mx-auto max-w-5xl">
          <p className="pres-eyebrow text-xs font-semibold tracking-[0.18em] text-[var(--color-gold,#d4af37)] uppercase">
            {t.modelEyebrow}
          </p>
          <h2 className="pres-display mt-2 text-4xl text-[var(--color-accent)] md:text-5xl">
            {t.modelTitle}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--color-text-muted)]">
            {t.modelBody}
          </p>
        </div>
      </section>

      {/* Endorsements + close */}
      <section
        className="relative flex min-h-[80svh] flex-col justify-center border-l-4 border-[var(--color-gold,#d4af37)] px-6 py-20 text-center md:px-12"
        style={{
          backgroundImage:
            'linear-gradient(rgba(12,26,20,0.82), rgba(12,26,20,0.9)), url(/presentation/ppt-bg-08-close.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="mx-auto max-w-3xl">
          <p className="pres-eyebrow text-xs font-semibold tracking-[0.18em] text-[var(--color-gold,#d4af37)] uppercase">
            {t.closeEyebrow}
          </p>
          <h2 className="pres-display mt-2 text-4xl text-[var(--color-accent)] md:text-5xl">
            {t.closeTitle}
          </h2>
          <p className="mt-4 text-[var(--color-text-muted)]">{t.closeLead}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-10">
            <div className="flex flex-col items-center gap-2">
              <img
                src="/presentation/ppt-icon-consulate.png"
                alt=""
                className="h-16 w-16 rounded-2xl object-cover"
              />
              <p className="whitespace-pre-line text-sm text-[var(--color-gold,#d4af37)]">
                {t.consulate}
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <img
                src="/presentation/ppt-icon-church.png"
                alt=""
                className="h-16 w-16 rounded-2xl object-cover"
              />
              <p className="whitespace-pre-line text-sm text-[var(--color-gold,#d4af37)]">
                {t.patriarchate}
              </p>
            </div>
          </div>

          <blockquote className="pres-display mt-14 text-2xl leading-snug text-[var(--color-text)] md:text-3xl">
            {t.verse}
          </blockquote>
          <p className="mt-3 text-sm tracking-wide text-[var(--color-gold,#d4af37)]">
            {t.verseCite}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to={enterTo}
              className="rounded-md bg-[var(--color-accent)] px-5 py-3 font-semibold text-[var(--color-bg)] transition hover:bg-[var(--color-accent-dim)]"
            >
              {t.monthlyHelp}
            </Link>
            <Link
              to={enterTo}
              className="rounded-md border border-[var(--color-gold,#d4af37)] px-5 py-3 text-[var(--color-gold,#d4af37)] transition hover:bg-[var(--color-gold,#d4af37)]/10"
            >
              {t.volunteer}
            </Link>
          </div>
          <p className="mt-10 text-xs tracking-wide text-[var(--color-text-muted)]">{t.footer}</p>
        </div>
      </section>
    </div>
  )
}
