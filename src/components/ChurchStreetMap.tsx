import { useEffect, useMemo } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { GlobeChurchPin } from '@/data/romanianChurches'

type Props = {
  pin: GlobeChurchPin
  visible: boolean
}

function Recenter({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
  const map = useMap()

  useEffect(() => {
    map.invalidateSize()
    map.flyTo([lat, lng], zoom, { duration: 1.1, easeLinearity: 0.25 })
  }, [map, lat, lng, zoom])

  useEffect(() => {
    const t = window.setTimeout(() => map.invalidateSize(), 80)
    return () => window.clearTimeout(t)
  }, [map])

  return null
}

function pinIcon(color: string) {
  return L.divIcon({
    className: 'trinity-map-pin',
    html: `<div style="
      width:28px;height:28px;transform:translate(-50%,-100%);
      filter:drop-shadow(0 2px 4px rgba(0,0,0,.45));
    ">
      <svg viewBox="0 0 24 36" width="28" height="36" xmlns="http://www.w3.org/2000/svg">
        <path fill="${color}" stroke="#0c1a14" stroke-width="1.2"
          d="M12 0C5.4 0 0 5.2 0 11.6 0 20.4 12 36 12 36s12-15.6 12-24.4C24 5.2 18.6 0 12 0z"/>
        <circle cx="12" cy="12" r="4.2" fill="#0c1a14"/>
      </svg>
    </div>`,
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -34],
  })
}

export function ChurchStreetMap({ pin, visible }: Props) {
  const icon = useMemo(() => pinIcon(pin.color), [pin.color])

  return (
    <div
      className={`absolute inset-0 z-10 transition-opacity duration-700 ${
        visible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
      aria-hidden={!visible}
    >
      {visible && (
        <MapContainer
          center={[pin.lat, pin.lng]}
          zoom={16}
          className="h-full w-full"
          zoomControl
          attributionControl
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            maxZoom={20}
          />
          <Marker position={[pin.lat, pin.lng]} icon={icon}>
            <Popup>
              <strong>{pin.name}</strong>
              <br />
              {pin.address ? (
                <>
                  {pin.address}
                  <br />
                </>
              ) : null}
              {pin.city}, {pin.country}
            </Popup>
          </Marker>
          <Recenter lat={pin.lat} lng={pin.lng} zoom={17} />
        </MapContainer>
      )}
    </div>
  )
}
