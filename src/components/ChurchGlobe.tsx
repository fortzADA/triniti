import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Globe, { type GlobeMethods } from 'react-globe.gl'
import type { GlobeChurchPin } from '@/data/romanianChurches'

type Props = {
  pins: GlobeChurchPin[]
  selectedId: string | null
  /** Bumps when search should re-fly even to the same pin */
  flyKey?: number
  onSelect: (pin: GlobeChurchPin) => void
  onReady?: () => void
}

type PinDatum = GlobeChurchPin & { selected: boolean }

const EARTH_TEXTURE =
  'https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg'
const BUMP_TEXTURE =
  'https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png'
const NIGHT_SKY =
  'https://cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png'

/** Phase 1: hold the Earth globe wide and turn toward the parish */
const SHOWCASE_MS = 2200
/** Phase 2: zoom toward the parish until the pin is close enough */
const DESCENT_MS = 6500
const TOTAL_MS = SHOWCASE_MS + DESCENT_MS

const SHOWCASE_ALTITUDE = 2.05
/** Stop here — pin is readable without a ground-level dive */
const TARGET_ALTITUDE = 0.55
/** Early stop once altitude + aim are already close enough */
const STOP_ALTITUDE = 0.62
const STOP_AIM_DEG = 2.5

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function clamp01(t: number) {
  return Math.min(1, Math.max(0, t))
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

function easeApproach(t: number) {
  const x = clamp01(t)
  return 1 - Math.pow(1 - x, 3)
}

function shortestLngDelta(from: number, to: number) {
  let d = to - from
  while (d > 180) d -= 360
  while (d < -180) d += 360
  return d
}

function aimErrorDeg(lat: number, lng: number, pinLat: number, pinLng: number) {
  const dLat = Math.abs(lat - pinLat)
  let dLng = Math.abs(lng - pinLng)
  if (dLng > 180) dLng = 360 - dLng
  return Math.hypot(dLat, dLng)
}

function mapPinMarkup(color: string, selected: boolean) {
  const w = selected ? 30 : 22
  const h = Math.round(w * 1.45)
  return `
    <div class="church-map-pin${selected ? ' is-selected' : ''}" style="
      width:${w}px;height:${h}px;
      transform:translate(-50%,-100%);
      cursor:pointer;
      pointer-events:auto;
      filter:drop-shadow(0 2px 4px rgba(0,0,0,.45));
    ">
      <svg viewBox="0 0 24 36" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          fill="${color}"
          stroke="#0c1a14"
          stroke-width="1.1"
          d="M12 0C5.4 0 0 5.25 0 11.7 0 20.5 12 36 12 36s12-15.5 12-24.3C24 5.25 18.6 0 12 0z"
        />
        <circle cx="12" cy="12" r="4.5" fill="#0c1a14"/>
        <circle cx="12" cy="12" r="2.4" fill="#e8f0eb"/>
      </svg>
    </div>
  `
}

export function ChurchGlobe({
  pins,
  selectedId,
  flyKey = 0,
  onSelect,
  onReady,
}: Props) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined)
  const containerRef = useRef<HTMLDivElement>(null)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect
  const [dims, setDims] = useState({ w: 800, h: 600 })
  const [globeError, setGlobeError] = useState('')

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const update = () => {
      const rect = el.getBoundingClientRect()
      setDims({
        w: Math.max(320, Math.floor(rect.width)),
        h: Math.max(360, Math.floor(rect.height)),
      })
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const handleReady = useCallback(() => {
    const globe = globeRef.current
    if (!globe) return
    try {
      const controls = globe.controls()
      controls.autoRotate = true
      controls.autoRotateSpeed = 0.45
      controls.enableDamping = true
      controls.minDistance = 70
      controls.maxDistance = 500
      globe.pointOfView({ lat: 30, lng: 15, altitude: 2.15 }, 0)
      onReady?.()
    } catch (err) {
      setGlobeError(err instanceof Error ? err.message : 'Globe failed to start')
    }
  }, [onReady])

  useEffect(() => {
    const pin = pins.find((p) => p.id === selectedId)
    const globe = globeRef.current
    if (!pin || !globe) return

    const controls = globe.controls()
    controls.autoRotate = false
    controls.enabled = false

    const start = globe.pointOfView()
    const fromLat = start.lat
    const fromLng = start.lng
    const fromAlt = Math.max(start.altitude, SHOWCASE_ALTITUDE * 0.92)
    const lngDelta = shortestLngDelta(fromLng, pin.lng)
    const toLng = fromLng + lngDelta

    let frame = 0
    const t0 = performance.now()

    const finish = (lat: number, lng: number, altitude: number) => {
      globe.pointOfView({ lat, lng, altitude }, 0)
      controls.enabled = true
      controls.autoRotate = true
      controls.autoRotateSpeed = 0.15
    }

    const tick = (now: number) => {
      const elapsed = now - t0
      const overall = clamp01(elapsed / TOTAL_MS)

      let lat: number
      let lng: number
      let altitude: number

      if (elapsed < SHOWCASE_MS) {
        const showT = easeOutCubic(elapsed / SHOWCASE_MS)
        lat = lerp(fromLat, pin.lat, showT * 0.92)
        lng = lerp(fromLng, toLng, showT * 0.92)
        altitude = lerp(fromAlt, SHOWCASE_ALTITUDE, showT)
      } else {
        const descentT = clamp01((elapsed - SHOWCASE_MS) / DESCENT_MS)
        const rotT = easeOutCubic(Math.min(1, descentT * 1.2))
        const altT = easeApproach(descentT)
        const midLat = lerp(fromLat, pin.lat, 0.92)
        const midLng = lerp(fromLng, toLng, 0.92)

        lat = lerp(midLat, pin.lat, rotT)
        lng = lerp(midLng, toLng, rotT)
        altitude = lerp(SHOWCASE_ALTITUDE, TARGET_ALTITUDE, altT)
      }

      globe.pointOfView({ lat, lng, altitude }, 0)

      const closeEnough =
        elapsed >= SHOWCASE_MS &&
        altitude <= STOP_ALTITUDE &&
        aimErrorDeg(lat, lng, pin.lat, pin.lng) <= STOP_AIM_DEG

      if (closeEnough || overall >= 1) {
        finish(pin.lat, pin.lng, TARGET_ALTITUDE)
        return
      }

      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      controls.enabled = true
    }
  }, [selectedId, pins, flyKey])

  const htmlData = useMemo<PinDatum[]>(
    () =>
      pins.map((p) => ({
        ...p,
        selected: selectedId === p.id,
      })),
    [pins, selectedId],
  )

  const createPinElement = useCallback((d: object) => {
    const pin = d as PinDatum
    const wrap = document.createElement('div')
    wrap.innerHTML = mapPinMarkup(pin.color, pin.selected)
    wrap.title = `${pin.name} — ${pin.city}, ${pin.country}`
    wrap.style.pointerEvents = 'auto'
    wrap.style.userSelect = 'none'
    wrap.addEventListener('click', (e) => {
      e.stopPropagation()
      onSelectRef.current(pin)
    })
    return wrap
  }, [])

  return (
    <div
      ref={containerRef}
      className="church-globe relative h-full w-full overflow-hidden rounded-none"
    >
      {globeError ? (
        <div className="flex h-full items-center justify-center px-4 text-center text-sm text-[var(--color-danger)]">
          {globeError}
        </div>
      ) : (
        <Globe
          ref={globeRef}
          width={dims.w}
          height={dims.h}
          backgroundImageUrl={NIGHT_SKY}
          globeImageUrl={EARTH_TEXTURE}
          bumpImageUrl={BUMP_TEXTURE}
          backgroundColor="rgba(0,0,0,0)"
          atmosphereColor="#7ec8a3"
          atmosphereAltitude={0.18}
          // Subtle surface dots keep each location fixed in 3D while Earth spins
          pointsData={htmlData}
          pointLat="lat"
          pointLng="lng"
          pointAltitude={0.01}
          pointRadius={(d) => ((d as PinDatum).selected ? 0.55 : 0.32)}
          pointColor="color"
          pointsMerge={false}
          // Map pins stay tied to lat/lng for the whole spin
          htmlElementsData={htmlData}
          htmlLat="lat"
          htmlLng="lng"
          htmlAltitude={0.015}
          htmlTransitionDuration={0}
          htmlElement={createPinElement}
          onGlobeReady={handleReady}
        />
      )}
    </div>
  )
}
