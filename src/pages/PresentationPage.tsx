import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { TrinityLogo } from '@/components/TrinityLogo'

const pillars = [
  {
    id: 'help',
    title: 'Help',
    kicker: 'Pillar one',
    subtitle: 'Compassion in Action',
    overview:
      'Tangible compassion and practical support for families and individuals in need.',
    image: '/presentation/pillars/help-bg.jpeg',
    points: [
      {
        text: 'Emergency financial assistance & charitable aid',
        icon: '/presentation/pillars/s4-i2.png',
      },
      {
        text: 'Family counseling and pastoral care',
        icon: '/presentation/pillars/s4-i3.png',
      },
      {
        text: 'New immigrant integration support',
        icon: '/presentation/pillars/s4-i4.png',
      },
      {
        text: 'Youth mentorship & educational resources',
        icon: '/presentation/pillars/s4-i5.png',
      },
      {
        text: "Confidential guidance through life's transitions",
        icon: '/presentation/pillars/s4-i6.png',
      },
    ],
  },
  {
    id: 'connect',
    title: 'Connect',
    kicker: 'Pillar two',
    subtitle: 'A Family Away From Home',
    overview:
      'Authentic relationships, spiritual networks, and a true sense of belonging.',
    image: '/presentation/pillars/connect-bg.jpeg',
    points: [
      {
        text: 'Parish-based & online small faith groups',
        icon: '/presentation/pillars/s5-i2.png',
      },
      {
        text: 'Intergenerational mentorship programs',
        icon: '/presentation/pillars/s5-i3.png',
      },
      {
        text: 'Prayer chains & spiritual companionship',
        icon: '/presentation/pillars/s5-i4.png',
      },
      {
        text: 'Cultural & linguistic heritage initiatives',
        icon: '/presentation/pillars/s5-i5.png',
      },
      {
        text: 'Dedicated digital platform for the diaspora',
        icon: '/presentation/pillars/s5-i6.png',
      },
    ],
  },
  {
    id: 'events',
    title: 'Events',
    kicker: 'Pillar three',
    subtitle: 'Celebrating Faith & Heritage',
    overview:
      'Vibrant celebrations of faith, culture, and the joy of Orthodox life together.',
    image: '/presentation/pillars/events-bg.jpeg',
    points: [
      {
        text: 'Holy Liturgy & major feast day services',
        icon: '/presentation/pillars/s6-i2.png',
      },
      {
        text: 'Romanian cultural festivals & traditions',
        icon: '/presentation/pillars/s6-i3.png',
      },
      {
        text: 'Educational workshops & faith lectures',
        icon: '/presentation/pillars/s6-i4.png',
      },
      {
        text: 'Youth retreats and family gatherings',
        icon: '/presentation/pillars/s6-i5.png',
      },
      {
        text: 'Annual charity galas & outreach events',
        icon: '/presentation/pillars/s6-i6.png',
      },
    ],
  },
] as const

export function PresentationPage() {
  const { user } = useAuth()
  const enterTo = user ? '/feed' : '/auth'

  return (
    <div className="presentation min-h-full overflow-x-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
      <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-4 backdrop-blur-md bg-[var(--color-bg)]/70"
        style={{ paddingTop: 'calc(0.75rem + var(--safe-top))' }}
      >
        <Link to="/" className="inline-flex items-center gap-2">
          <TrinityLogo size={52} />
        </Link>
        <Link
          to={enterTo}
          className="rounded-md border border-[var(--color-gold,#d4af37)] px-3 py-1.5 text-sm text-[var(--color-gold,#d4af37)] transition hover:bg-[var(--color-gold,#d4af37)]/10"
        >
          {user ? 'Open app' : 'Join'}
        </Link>
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
            Faith · Community · Hope
          </p>
          <h1 className="pres-display text-6xl leading-[0.95] tracking-tight text-[var(--color-accent)] md:text-8xl">
            Trinity
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--color-text)] md:text-xl">
            A ministry serving the Romanian Orthodox community around the world.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={enterTo}
              className="pres-cta rounded-md bg-[var(--color-accent)] px-5 py-3 font-semibold text-[var(--color-bg)] transition hover:bg-[var(--color-accent-dim)]"
            >
              {user ? 'Enter community' : 'Join the Trinity family'}
            </Link>
            <a
              href="#need"
              className="rounded-md border border-[var(--color-border)] px-5 py-3 text-[var(--color-text-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-text)]"
            >
              Learn more
            </a>
          </div>
          <p className="mt-8 max-w-md text-sm text-[var(--color-text-muted)]">
            Endorsed by the Romanian Consulate in Los Angeles &amp; the Romanian Patriarchate
          </p>
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
            The need
          </p>
          <h2 className="pres-display mt-2 text-4xl text-[var(--color-accent)] md:text-5xl">
            Bridging the gap for Romanian Orthodox faithful
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-[var(--color-text)]">
            Over one million Romanians call the United States home. Many face the quiet ache of
            spiritual disconnection — far from ancestral parishes, navigating life in a new land
            while striving to pass on the beauty of Orthodox faith and Romanian culture to their
            children.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-[var(--color-text-muted)]">
            Trinity was born to answer this call: a living bridge of faith, practical help, and
            authentic community for the diaspora.
          </p>
        </div>
      </section>

      {/* Three pillars — slides 4–6 compressed into one section */}
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
            Introducing Trinity
          </p>
          <h2 className="pres-display mt-2 text-4xl text-[var(--color-accent)] md:text-5xl">
            Three pillars. One sacred mission.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--color-text-muted)]">
            Rooted in the Holy Trinity and the rich tradition of the Romanian Orthodox Church,
            Trinity offers a holistic ministry of presence, compassion, and celebration for
            Romanians across America.
          </p>

          <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {pillars.map((pillar) => (
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

      {/* Subscription model */}
      <section id="support" className="border-l-4 border-[var(--color-gold,#d4af37)] bg-[var(--color-surface)] px-6 py-20 md:px-12">
        <div className="mx-auto max-w-5xl">
          <p className="pres-eyebrow text-xs font-semibold tracking-[0.18em] text-[var(--color-gold,#d4af37)] uppercase">
            Our model
          </p>
          <h2 className="pres-display mt-2 text-4xl text-[var(--color-accent)] md:text-5xl">
            Sustainable ministry through monthly micro-contribution
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--color-text-muted)]">
            Trinity is sustained by the community’s monthly micro-contributions—a shared
            commitment of care. It is built for spread good—not personal glory: Each gift
            quietly supports help, compassion, and practical programs so families and neighbors
            across the diaspora can grow stronger together.
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
            Endorsed &amp; trusted
          </p>
          <h2 className="pres-display mt-2 text-4xl text-[var(--color-accent)] md:text-5xl">
            Building legacy together
          </h2>
          <p className="mt-4 text-[var(--color-text-muted)]">
            Trinity is honored to serve under the blessing and endorsement of:
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-10">
            <div className="flex flex-col items-center gap-2">
              <img
                src="/presentation/ppt-icon-consulate.png"
                alt=""
                className="h-16 w-16 rounded-2xl object-cover"
              />
              <p className="text-sm text-[var(--color-gold,#d4af37)]">
                Romanian Consulate
                <br />
                in Los Angeles
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <img
                src="/presentation/ppt-icon-church.png"
                alt=""
                className="h-16 w-16 rounded-2xl object-cover"
              />
              <p className="text-sm text-[var(--color-gold,#d4af37)]">
                The Romanian
                <br />
                Patriarchate
              </p>
            </div>
          </div>

          <blockquote className="pres-display mt-14 text-2xl leading-snug text-[var(--color-text)] md:text-3xl">
            “Where two or three are gathered in My name, there I am in the midst of them.”
          </blockquote>
          <p className="mt-3 text-sm tracking-wide text-[var(--color-gold,#d4af37)]">
            — Matthew 18:20
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to={enterTo}
              className="rounded-md bg-[var(--color-accent)] px-5 py-3 font-semibold text-[var(--color-bg)] transition hover:bg-[var(--color-accent-dim)]"
            >
              Offer monthly help
            </Link>
            <Link
              to={enterTo}
              className="rounded-md border border-[var(--color-gold,#d4af37)] px-5 py-3 text-[var(--color-gold,#d4af37)] transition hover:bg-[var(--color-gold,#d4af37)]/10"
            >
              Volunteer · Partner with us
            </Link>
          </div>
          <p className="mt-10 text-xs tracking-wide text-[var(--color-text-muted)]">
            Trinity Ministry · Romanian Orthodox Diaspora · Los Angeles, California
          </p>
        </div>
      </section>
    </div>
  )
}
