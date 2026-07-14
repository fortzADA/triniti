/** Curated Romanian Orthodox / diaspora parish landmarks for the globe. */
export type RomanianChurchPin = {
  id: string
  name: string
  city: string
  country: string
  lat: number
  lng: number
  /** Suggested Trinity slug when a portal does not exist yet */
  suggestedSlug: string
}

export const ROMANIAN_CHURCH_PINS: RomanianChurchPin[] = [
  // Romania
  { id: 'ro-bucuresti', name: 'Biserica Sfântul Spiridon', city: 'Bucharest', country: 'Romania', lat: 44.4268, lng: 26.1025, suggestedSlug: 'bucuresti' },
  { id: 'ro-cluj', name: 'Catedrala Ortodoxă', city: 'Cluj-Napoca', country: 'Romania', lat: 46.7712, lng: 23.6236, suggestedSlug: 'cluj' },
  { id: 'ro-iasi', name: 'Catedrala Mitropolitană', city: 'Iași', country: 'Romania', lat: 47.1585, lng: 27.6014, suggestedSlug: 'iasi' },
  { id: 'ro-timisoara', name: 'Catedrala Ortodoxă', city: 'Timișoara', country: 'Romania', lat: 45.7489, lng: 21.2087, suggestedSlug: 'timisoara' },
  { id: 'ro-sibiu', name: 'Catedrala Ortodoxă', city: 'Sibiu', country: 'Romania', lat: 45.7983, lng: 24.1256, suggestedSlug: 'sibiu' },
  { id: 'ro-constanta', name: 'Catedrala Sfinții Apostoli', city: 'Constanța', country: 'Romania', lat: 44.1598, lng: 28.6348, suggestedSlug: 'constanta' },
  { id: 'ro-brasov', name: 'Biserica Sfântul Nicolae', city: 'Brașov', country: 'Romania', lat: 45.6579, lng: 25.6012, suggestedSlug: 'brasov' },
  { id: 'ro-oradea', name: 'Catedrala Ortodoxă', city: 'Oradea', country: 'Romania', lat: 47.0465, lng: 21.9189, suggestedSlug: 'oradea' },
  { id: 'ro-craiova', name: 'Catedrala Sfântul Dumitru', city: 'Craiova', country: 'Romania', lat: 44.3302, lng: 23.7949, suggestedSlug: 'craiova' },
  { id: 'ro-galati', name: 'Catedrala Ortodoxă', city: 'Galați', country: 'Romania', lat: 45.4353, lng: 28.008, suggestedSlug: 'galati' },

  // Western Europe
  { id: 'uk-london', name: 'Romanian Orthodox Church — St George', city: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278, suggestedSlug: 'london' },
  { id: 'uk-birmingham', name: 'Romanian Orthodox Parish', city: 'Birmingham', country: 'United Kingdom', lat: 52.4862, lng: -1.8904, suggestedSlug: 'birmingham' },
  { id: 'uk-manchester', name: 'Romanian Orthodox Parish', city: 'Manchester', country: 'United Kingdom', lat: 53.4808, lng: -2.2426, suggestedSlug: 'manchester' },
  { id: 'ie-dublin', name: 'Romanian Orthodox Parish', city: 'Dublin', country: 'Ireland', lat: 53.3498, lng: -6.2603, suggestedSlug: 'dublin' },
  { id: 'fr-paris', name: 'Paroisse Orth. Roumaine — Paris', city: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, suggestedSlug: 'paris' },
  { id: 'fr-lyon', name: 'Paroisse Orth. Roumaine — Lyon', city: 'Lyon', country: 'France', lat: 45.764, lng: 4.8357, suggestedSlug: 'lyon' },
  { id: 'be-brussels', name: 'Paroisse Orth. Roumaine — Bruxelles', city: 'Brussels', country: 'Belgium', lat: 50.8503, lng: 4.3517, suggestedSlug: 'brussels' },
  { id: 'nl-amsterdam', name: 'Romanian Orthodox Parish', city: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lng: 4.9041, suggestedSlug: 'amsterdam' },
  { id: 'de-munich', name: 'Rumänische Orthodoxe Gemeinde', city: 'Munich', country: 'Germany', lat: 48.1351, lng: 11.582, suggestedSlug: 'munich' },
  { id: 'de-berlin', name: 'Rumänische Orthodoxe Gemeinde', city: 'Berlin', country: 'Germany', lat: 52.52, lng: 13.405, suggestedSlug: 'berlin' },
  { id: 'de-stuttgart', name: 'Rumänische Orthodoxe Gemeinde', city: 'Stuttgart', country: 'Germany', lat: 48.7758, lng: 9.1829, suggestedSlug: 'stuttgart' },
  { id: 'de-frankfurt', name: 'Rumänische Orthodoxe Gemeinde', city: 'Frankfurt', country: 'Germany', lat: 50.1109, lng: 8.6821, suggestedSlug: 'frankfurt' },
  { id: 'at-vienna', name: 'Rumänische Orthodoxe Kirche', city: 'Vienna', country: 'Austria', lat: 48.2082, lng: 16.3738, suggestedSlug: 'vienna' },
  { id: 'ch-zurich', name: 'Parohia Ortodoxă Română', city: 'Zurich', country: 'Switzerland', lat: 47.3769, lng: 8.5417, suggestedSlug: 'zurich' },
  { id: 'it-rome', name: 'Parrocchia Ortodossa Rumena', city: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964, suggestedSlug: 'rome' },
  { id: 'it-milan', name: 'Parrocchia Ortodossa Rumena', city: 'Milan', country: 'Italy', lat: 45.4642, lng: 9.19, suggestedSlug: 'milan' },
  { id: 'it-turin', name: 'Parrocchia Ortodossa Rumena', city: 'Turin', country: 'Italy', lat: 45.0703, lng: 7.6869, suggestedSlug: 'turin' },
  { id: 'es-madrid', name: 'Parroquia Ortodoxa Rumana', city: 'Madrid', country: 'Spain', lat: 40.4168, lng: -3.7038, suggestedSlug: 'madrid' },
  { id: 'es-barcelona', name: 'Parroquia Ortodoxa Rumana', city: 'Barcelona', country: 'Spain', lat: 41.3874, lng: 2.1686, suggestedSlug: 'barcelona' },
  { id: 'pt-lisbon', name: 'Paróquia Ortodoxa Romena', city: 'Lisbon', country: 'Portugal', lat: 38.7223, lng: -9.1393, suggestedSlug: 'lisbon' },
  { id: 'se-stockholm', name: 'Rumänska Ortodoxa Församlingen', city: 'Stockholm', country: 'Sweden', lat: 59.3293, lng: 18.0686, suggestedSlug: 'stockholm' },
  { id: 'dk-copenhagen', name: 'Rumænsk Ortodoks Kirke', city: 'Copenhagen', country: 'Denmark', lat: 55.6761, lng: 12.5683, suggestedSlug: 'copenhagen' },
  { id: 'no-oslo', name: 'Rumensk Ortodoks Menighet', city: 'Oslo', country: 'Norway', lat: 59.9139, lng: 10.7522, suggestedSlug: 'oslo' },
  { id: 'gr-athens', name: 'Romanian Orthodox Parish', city: 'Athens', country: 'Greece', lat: 37.9838, lng: 23.7275, suggestedSlug: 'athens' },
  { id: 'cy-nicosia', name: 'Romanian Orthodox Parish', city: 'Nicosia', country: 'Cyprus', lat: 35.1856, lng: 33.3823, suggestedSlug: 'nicosia' },

  // Americas
  { id: 'us-nyc', name: 'Romanian Orthodox Cathedral — St Nicholas', city: 'New York', country: 'United States', lat: 40.7128, lng: -74.006, suggestedSlug: 'new-york' },
  { id: 'us-chicago', name: 'Romanian Orthodox Parish', city: 'Chicago', country: 'United States', lat: 41.8781, lng: -87.6298, suggestedSlug: 'chicago' },
  { id: 'us-detroit', name: 'Romanian Orthodox Cathedral', city: 'Detroit', country: 'United States', lat: 42.3314, lng: -83.0458, suggestedSlug: 'detroit' },
  { id: 'us-la', name: 'Romanian Orthodox Parish', city: 'Los Angeles', country: 'United States', lat: 34.0522, lng: -118.2437, suggestedSlug: 'los-angeles' },
  { id: 'us-seattle', name: 'Romanian Orthodox Parish', city: 'Seattle', country: 'United States', lat: 47.6062, lng: -122.3321, suggestedSlug: 'seattle' },
  { id: 'ca-toronto', name: 'Romanian Orthodox Church', city: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832, suggestedSlug: 'toronto' },
  { id: 'ca-montreal', name: 'Église Orth. Roumaine', city: 'Montreal', country: 'Canada', lat: 45.5017, lng: -73.5673, suggestedSlug: 'montreal' },
  { id: 'ca-vancouver', name: 'Romanian Orthodox Parish', city: 'Vancouver', country: 'Canada', lat: 49.2827, lng: -123.1207, suggestedSlug: 'vancouver' },

  // Oceania & Middle East
  { id: 'au-sydney', name: 'Romanian Orthodox Parish', city: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, suggestedSlug: 'sydney' },
  { id: 'au-melbourne', name: 'Romanian Orthodox Parish', city: 'Melbourne', country: 'Australia', lat: -37.8136, lng: 144.9631, suggestedSlug: 'melbourne' },
  { id: 'il-telaviv', name: 'Romanian Orthodox Community', city: 'Tel Aviv', country: 'Israel', lat: 32.0853, lng: 34.7818, suggestedSlug: 'tel-aviv' },
  { id: 'ae-dubai', name: 'Romanian Orthodox Community', city: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lng: 55.2708, suggestedSlug: 'dubai' },
]

export type GlobeChurchPin = {
  id: string
  name: string
  city: string
  country: string
  lat: number
  lng: number
  suggestedSlug: string
  /** Live Trinity portal slug when matched from the database */
  portalSlug?: string
  size: number
  color: string
}

export function buildGlobePins(liveChurches: { id: string; name: string; slug: string; city: string | null; country: string | null; latitude?: number | null; longitude?: number | null }[]): GlobeChurchPin[] {
  const byCityCountry = new Map<string, (typeof liveChurches)[0]>()
  const bySlug = new Map<string, (typeof liveChurches)[0]>()

  for (const c of liveChurches) {
    bySlug.set(c.slug, c)
    if (c.city) {
      const key = `${c.city.toLowerCase().trim()}|${(c.country || '').toLowerCase().trim()}`
      byCityCountry.set(key, c)
    }
  }

  const curated = ROMANIAN_CHURCH_PINS.map((pin) => {
    const match =
      bySlug.get(pin.suggestedSlug) ||
      byCityCountry.get(`${pin.city.toLowerCase()}|${pin.country.toLowerCase()}`)

    return {
      id: pin.id,
      name: match?.name || pin.name,
      city: pin.city,
      country: pin.country,
      lat: pin.lat,
      lng: pin.lng,
      suggestedSlug: pin.suggestedSlug,
      portalSlug: match?.slug,
      size: match ? 0.55 : 0.35,
      color: match ? '#3dd68c' : '#d4af37',
    } satisfies GlobeChurchPin
  })

  const claimed = new Set(
    curated.map((p) => p.portalSlug).filter((slug): slug is string => Boolean(slug)),
  )

  const extras: GlobeChurchPin[] = liveChurches
    .filter(
      (c) =>
        c.latitude != null &&
        c.longitude != null &&
        !claimed.has(c.slug),
    )
    .map((c) => ({
      id: `live-${c.id}`,
      name: c.name,
      city: c.city || 'Unknown',
      country: c.country || '',
      lat: c.latitude!,
      lng: c.longitude!,
      suggestedSlug: c.slug,
      portalSlug: c.slug,
      size: 0.55,
      color: '#3dd68c',
    }))

  return [...curated, ...extras]
}
