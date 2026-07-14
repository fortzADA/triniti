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

export function ChurchGlobe({ pins, selectedId, flyKey = 0, onSelect, onReady }: Props) {
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
    controls.minDistance = 120
    controls.maxDistance = 500
    globe.pointOfView({ lat: 30, lng: 15, altitude: 2.1 }, 0)
    onReady?.()
  }, [onReady])

  useEffect(() => {
    const pin = pins.find((p) => p.id === selectedId)
    const globe = globeRef.current
    if (!pin || !globe) return

    const controls = globe.controls()
    controls.autoRotate = false
    globe.pointOfView({ lat: pin.lat, lng: pin.lng, altitude: 0.55 }, 1600)

    const resume = window.setTimeout(() => {
      controls.autoRotate = true
      controls.autoRotateSpeed = 0.2
    }, 8000)

    return () => window.clearTimeout(resume)
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
      className="church-globe relative h-[min(70vh,640px)] w-full overflow-hidden rounded-none"
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
