/** Curated Romanian Orthodox / diaspora parish landmarks for the globe + street map. */
export type RomanianChurchPin = {
  id: string
  name: string
  city: string
  country: string
  lat: number
  lng: number
  /** Street-level address shown on the map popup */
  address?: string
  /** Suggested Trinity slug when a portal does not exist yet */
  suggestedSlug: string
}

export const ROMANIAN_CHURCH_PINS: RomanianChurchPin[] = [
  // Romania — landmark churches
  {
    id: 'ro-bucuresti',
    name: 'Catedrala Patriarhală',
    city: 'Bucharest',
    country: 'Romania',
    lat: 44.42447,
    lng: 26.08889,
    address: 'Dealul Mitropoliei, Bucharest',
    suggestedSlug: 'bucuresti',
  },
  {
    id: 'ro-cluj',
    name: 'Catedrala Ortodoxă',
    city: 'Cluj-Napoca',
    country: 'Romania',
    lat: 46.7694,
    lng: 23.5898,
    address: 'Piața Avram Iancu, Cluj-Napoca',
    suggestedSlug: 'cluj',
  },
  {
    id: 'ro-iasi',
    name: 'Catedrala Mitropolitană',
    city: 'Iași',
    country: 'Romania',
    lat: 47.16135,
    lng: 27.58235,
    address: 'Bd. Ștefan cel Mare, Iași',
    suggestedSlug: 'iasi',
  },
  {
    id: 'ro-timisoara',
    name: 'Catedrala Ortodoxă Mitropolitană',
    city: 'Timișoara',
    country: 'Romania',
    lat: 45.75055,
    lng: 21.22485,
    address: 'Bd. Regele Ferdinand I, Timișoara',
    suggestedSlug: 'timisoara',
  },
  {
    id: 'ro-sibiu',
    name: 'Catedrala Ortodoxă',
    city: 'Sibiu',
    country: 'Romania',
    lat: 45.79725,
    lng: 24.15095,
    address: 'Str. Mitropoliei, Sibiu',
    suggestedSlug: 'sibiu',
  },
  {
    id: 'ro-constanta',
    name: 'Catedrala Sfinții Apostoli Petru și Pavel',
    city: 'Constanța',
    country: 'Romania',
    lat: 44.17475,
    lng: 28.65825,
    address: 'Str. Arhiepiscopiei, Constanța',
    suggestedSlug: 'constanta',
  },
  {
    id: 'ro-brasov',
    name: 'Biserica Sfântul Nicolae',
    city: 'Brașov',
    country: 'Romania',
    lat: 45.63525,
    lng: 25.58565,
    address: 'Piața Unirii, Șcheii Brașovului',
    suggestedSlug: 'brasov',
  },
  {
    id: 'ro-oradea',
    name: 'Catedrala Ortodoxă',
    city: 'Oradea',
    country: 'Romania',
    lat: 47.0552,
    lng: 21.9285,
    address: 'Piata Unirii, Oradea',
    suggestedSlug: 'oradea',
  },
  {
    id: 'ro-craiova',
    name: 'Catedrala Sfântul Dumitru',
    city: 'Craiova',
    country: 'Romania',
    lat: 44.3185,
    lng: 23.7968,
    address: 'Str. Mitropolit Firmilian, Craiova',
    suggestedSlug: 'craiova',
  },
  {
    id: 'ro-galati',
    name: 'Catedrala Ortodoxă',
    city: 'Galați',
    country: 'Romania',
    lat: 45.4338,
    lng: 28.0475,
    address: 'Str. Domnească, Galați',
    suggestedSlug: 'galati',
  },

  // Western Europe — known Romanian parish sites (street-level where possible)
  {
    id: 'uk-london',
    name: 'Romanian Orthodox Church — St George',
    city: 'London',
    country: 'United Kingdom',
    lat: 51.47585,
    lng: -0.33755,
    address: '21a Harvard Road, Isleworth, London',
    suggestedSlug: 'london',
  },
  {
    id: 'uk-birmingham',
    name: 'Romanian Orthodox Parish',
    city: 'Birmingham',
    country: 'United Kingdom',
    lat: 52.4862,
    lng: -1.8904,
    address: 'Birmingham city centre area',
    suggestedSlug: 'birmingham',
  },
  {
    id: 'uk-manchester',
    name: 'Romanian Orthodox Parish',
    city: 'Manchester',
    country: 'United Kingdom',
    lat: 53.4808,
    lng: -2.2426,
    address: 'Manchester city centre area',
    suggestedSlug: 'manchester',
  },
  {
    id: 'ie-dublin',
    name: 'Romanian Orthodox Parish',
    city: 'Dublin',
    country: 'Ireland',
    lat: 53.3498,
    lng: -6.2603,
    address: 'Dublin city centre area',
    suggestedSlug: 'dublin',
  },
  {
    id: 'fr-paris',
    name: 'Paroisse Orth. Roumaine — Saints Archanges',
    city: 'Paris',
    country: 'France',
    lat: 48.84925,
    lng: 2.34785,
    address: '9 Rue Jean de Beauvais, Paris',
    suggestedSlug: 'paris',
  },
  {
    id: 'fr-lyon',
    name: 'Paroisse Orth. Roumaine — Lyon',
    city: 'Lyon',
    country: 'France',
    lat: 45.764,
    lng: 4.8357,
    address: 'Lyon centre',
    suggestedSlug: 'lyon',
  },
  {
    id: 'be-brussels',
    name: 'Paroisse Orth. Roumaine — Bruxelles',
    city: 'Brussels',
    country: 'Belgium',
    lat: 50.8503,
    lng: 4.3517,
    address: 'Brussels centre',
    suggestedSlug: 'brussels',
  },
  {
    id: 'nl-amsterdam',
    name: 'Romanian Orthodox Parish',
    city: 'Amsterdam',
    country: 'Netherlands',
    lat: 52.3676,
    lng: 4.9041,
    address: 'Amsterdam centre',
    suggestedSlug: 'amsterdam',
  },
  {
    id: 'de-munich',
    name: 'Rumänische Orthodoxe Gemeinde',
    city: 'Munich',
    country: 'Germany',
    lat: 48.1351,
    lng: 11.582,
    address: 'Munich centre',
    suggestedSlug: 'munich',
  },
  {
    id: 'de-berlin',
    name: 'Rumänische Orthodoxe Gemeinde',
    city: 'Berlin',
    country: 'Germany',
    lat: 52.52,
    lng: 13.405,
    address: 'Berlin centre',
    suggestedSlug: 'berlin',
  },
  {
    id: 'de-stuttgart',
    name: 'Rumänische Orthodoxe Gemeinde',
    city: 'Stuttgart',
    country: 'Germany',
    lat: 48.7758,
    lng: 9.1829,
    address: 'Stuttgart centre',
    suggestedSlug: 'stuttgart',
  },
  {
    id: 'de-frankfurt',
    name: 'Rumänische Orthodoxe Gemeinde',
    city: 'Frankfurt',
    country: 'Germany',
    lat: 50.1109,
    lng: 8.6821,
    address: 'Frankfurt centre',
    suggestedSlug: 'frankfurt',
  },
  {
    id: 'at-vienna',
    name: 'Rumänische Orthodoxe Kirche',
    city: 'Vienna',
    country: 'Austria',
    lat: 48.2082,
    lng: 16.3738,
    address: 'Vienna centre',
    suggestedSlug: 'vienna',
  },
  {
    id: 'ch-zurich',
    name: 'Parohia Ortodoxă Română',
    city: 'Zurich',
    country: 'Switzerland',
    lat: 47.3769,
    lng: 8.5417,
    address: 'Zurich centre',
    suggestedSlug: 'zurich',
  },
  {
    id: 'it-rome',
    name: 'Parrocchia Ortodossa Rumena',
    city: 'Rome',
    country: 'Italy',
    lat: 41.9028,
    lng: 12.4964,
    address: 'Rome centre',
    suggestedSlug: 'rome',
  },
  {
    id: 'it-milan',
    name: 'Parrocchia Ortodossa Rumena',
    city: 'Milan',
    country: 'Italy',
    lat: 45.4642,
    lng: 9.19,
    address: 'Milan centre',
    suggestedSlug: 'milan',
  },
  {
    id: 'it-turin',
    name: 'Parrocchia Ortodossa Rumena',
    city: 'Turin',
    country: 'Italy',
    lat: 45.0703,
    lng: 7.6869,
    address: 'Turin centre',
    suggestedSlug: 'turin',
  },
  {
    id: 'es-madrid',
    name: 'Parroquia Ortodoxa Rumana',
    city: 'Madrid',
    country: 'Spain',
    lat: 40.4168,
    lng: -3.7038,
    address: 'Madrid centre',
    suggestedSlug: 'madrid',
  },
  {
    id: 'es-barcelona',
    name: 'Parroquia Ortodoxa Rumana',
    city: 'Barcelona',
    country: 'Spain',
    lat: 41.3874,
    lng: 2.1686,
    address: 'Barcelona centre',
    suggestedSlug: 'barcelona',
  },
  {
    id: 'pt-lisbon',
    name: 'Paróquia Ortodoxa Romena',
    city: 'Lisbon',
    country: 'Portugal',
    lat: 38.7223,
    lng: -9.1393,
    address: 'Lisbon centre',
    suggestedSlug: 'lisbon',
  },
  {
    id: 'se-stockholm',
    name: 'Rumänska Ortodoxa Församlingen',
    city: 'Stockholm',
    country: 'Sweden',
    lat: 59.3293,
    lng: 18.0686,
    address: 'Stockholm centre',
    suggestedSlug: 'stockholm',
  },
  {
    id: 'dk-copenhagen',
    name: 'Rumænsk Ortodoks Kirke',
    city: 'Copenhagen',
    country: 'Denmark',
    lat: 55.6761,
    lng: 12.5683,
    address: 'Copenhagen centre',
    suggestedSlug: 'copenhagen',
  },
  {
    id: 'no-oslo',
    name: 'Rumensk Ortodoks Menighet',
    city: 'Oslo',
    country: 'Norway',
    lat: 59.9139,
    lng: 10.7522,
    address: 'Oslo centre',
    suggestedSlug: 'oslo',
  },
  {
    id: 'gr-athens',
    name: 'Romanian Orthodox Parish',
    city: 'Athens',
    country: 'Greece',
    lat: 37.9838,
    lng: 23.7275,
    address: 'Athens centre',
    suggestedSlug: 'athens',
  },
  {
    id: 'cy-nicosia',
    name: 'Romanian Orthodox Parish',
    city: 'Nicosia',
    country: 'Cyprus',
    lat: 35.1856,
    lng: 33.3823,
    address: 'Nicosia centre',
    suggestedSlug: 'nicosia',
  },

  // Americas
  {
    id: 'us-nyc',
    name: 'St. Nicholas Romanian Orthodox Cathedral',
    city: 'New York',
    country: 'United States',
    lat: 40.7128,
    lng: -74.006,
    address: 'New York City',
    suggestedSlug: 'new-york',
  },
  {
    id: 'us-chicago',
    name: 'Romanian Orthodox Parish',
    city: 'Chicago',
    country: 'United States',
    lat: 41.8781,
    lng: -87.6298,
    address: 'Chicago',
    suggestedSlug: 'chicago',
  },
  {
    id: 'us-detroit',
    name: 'Romanian Orthodox Cathedral',
    city: 'Detroit',
    country: 'United States',
    lat: 42.3314,
    lng: -83.0458,
    address: 'Detroit',
    suggestedSlug: 'detroit',
  },
  {
    id: 'us-la',
    name: 'Romanian Orthodox Parish',
    city: 'Los Angeles',
    country: 'United States',
    lat: 34.0522,
    lng: -118.2437,
    address: 'Los Angeles',
    suggestedSlug: 'los-angeles',
  },
  {
    id: 'us-seattle',
    name: 'Romanian Orthodox Parish',
    city: 'Seattle',
    country: 'United States',
    lat: 47.6062,
    lng: -122.3321,
    address: 'Seattle',
    suggestedSlug: 'seattle',
  },
  {
    id: 'ca-toronto',
    name: 'Romanian Orthodox Church',
    city: 'Toronto',
    country: 'Canada',
    lat: 43.6532,
    lng: -79.3832,
    address: 'Toronto',
    suggestedSlug: 'toronto',
  },
  {
    id: 'ca-montreal',
    name: 'Église Orth. Roumaine',
    city: 'Montreal',
    country: 'Canada',
    lat: 45.5017,
    lng: -73.5673,
    address: 'Montreal',
    suggestedSlug: 'montreal',
  },
  {
    id: 'ca-vancouver',
    name: 'Romanian Orthodox Parish',
    city: 'Vancouver',
    country: 'Canada',
    lat: 49.2827,
    lng: -123.1207,
    address: 'Vancouver',
    suggestedSlug: 'vancouver',
  },

  // Oceania & Middle East
  {
    id: 'au-sydney',
    name: 'Romanian Orthodox Parish',
    city: 'Sydney',
    country: 'Australia',
    lat: -33.8688,
    lng: 151.2093,
    address: 'Sydney',
    suggestedSlug: 'sydney',
  },
  {
    id: 'au-melbourne',
    name: 'Romanian Orthodox Parish',
    city: 'Melbourne',
    country: 'Australia',
    lat: -37.8136,
    lng: 144.9631,
    address: 'Melbourne',
    suggestedSlug: 'melbourne',
  },
  {
    id: 'il-telaviv',
    name: 'Romanian Orthodox Community',
    city: 'Tel Aviv',
    country: 'Israel',
    lat: 32.0853,
    lng: 34.7818,
    address: 'Tel Aviv',
    suggestedSlug: 'tel-aviv',
  },
  {
    id: 'ae-dubai',
    name: 'Romanian Orthodox Community',
    city: 'Dubai',
    country: 'United Arab Emirates',
    lat: 25.2048,
    lng: 55.2708,
    address: 'Dubai',
    suggestedSlug: 'dubai',
  },
]

export type GlobeChurchPin = {
  id: string
  name: string
  city: string
  country: string
  lat: number
  lng: number
  address?: string
  suggestedSlug: string
  /** Live Trinity portal slug when matched from the database */
  portalSlug?: string
  size: number
  color: string
}

export function buildGlobePins(
  liveChurches: {
    id: string
    name: string
    slug: string
    city: string | null
    country: string | null
    latitude?: number | null
    longitude?: number | null
  }[],
): GlobeChurchPin[] {
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
      lat: match?.latitude ?? pin.lat,
      lng: match?.longitude ?? pin.lng,
      address: pin.address,
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
      (c) => c.latitude != null && c.longitude != null && !claimed.has(c.slug),
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
