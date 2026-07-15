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

/** Smooth approach that settles as the pin comes into view. */
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

export function ChurchGlobe({
  pins,
  selectedId,
  flyKey = 0,
  onSelect,
  onReady,
}: Props) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 800, h: 600 })
  const [hoveredId, setHoveredId] = useState<string | null>(null)

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
    const controls = globe.controls()
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.45
    controls.enableDamping = true
    controls.minDistance = 70
    controls.maxDistance = 500
    globe.pointOfView({ lat: 30, lng: 15, altitude: 2.15 }, 0)
    onReady?.()
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

  const pointsData = useMemo(
    () =>
      pins.map((p) => ({
        ...p,
        altitude: selectedId === p.id || hoveredId === p.id ? 0.12 : 0.05,
        radius: selectedId === p.id ? p.size * 1.35 : p.size,
      })),
    [pins, selectedId, hoveredId],
  )

  return (
    <div
      ref={containerRef}
      className="church-globe relative h-full w-full overflow-hidden rounded-none"
    >
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
        pointsData={pointsData}
        pointLat="lat"
        pointLng="lng"
        pointAltitude="altitude"
        pointRadius="radius"
        pointColor="color"
        pointsMerge={false}
        pointLabel={(d) => {
          const pin = d as GlobeChurchPin
          return `<div style="font-family:system-ui;padding:6px 10px;background:#132820;border:1px solid #d4af37;color:#e8f0eb;border-radius:6px;font-size:12px;max-width:220px">
            <strong style="color:#3dd68c">${pin.name}</strong><br/>
            <span style="color:#8fa89a">${pin.city}, ${pin.country}</span>
          </div>`
        }}
        onPointHover={(p) => setHoveredId((p as GlobeChurchPin | null)?.id ?? null)}
        onPointClick={(p) => {
          const pin = p as GlobeChurchPin
          onSelect(pin)
        }}
        onGlobeReady={handleReady}
      />
    </div>
  )
}
