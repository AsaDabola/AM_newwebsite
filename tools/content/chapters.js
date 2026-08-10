/**
 * AM's chapter network.
 *
 * Cities and regions are taken verbatim from the "Our Network" page of
 * amintl.org (exported August 2026). Coordinates are the standard city-centre
 * latitude/longitude for each place, added here so the chapters can be plotted
 * on the homepage globe.
 *
 * Two cleanups were applied to the source list:
 *   - "USA, New York" and "USA, New York City" were the same chapter, merged.
 *   - "Zambia, Lusaka, Ndola" listed two cities on one line, split in two.
 *
 * Used by tools/build-pages.js (static site) and
 * tools/content/build-chapter-import.js (WordPress import).
 *
 * [region, city, country, latitude, longitude]
 */

module.exports = [
  // Headquarters first - the globe radiates its arcs from this marker.
  ['North America', 'Trenton', 'New Jersey, USA', 40.2206, -74.7597, 'Headquarters'],

  ['North America', 'New York', 'USA', 40.7128, -74.006],
  ['North America', 'Atlanta', 'USA', 33.749, -84.388],
  ['North America', 'Boston', 'USA', 42.3601, -71.0589],
  ['North America', 'Burlington', 'USA', 44.4759, -73.2121],
  ['North America', 'Detroit', 'USA', 42.3314, -83.0458],
  ['North America', 'Houston', 'USA', 29.7604, -95.3698],
  ['North America', 'Los Angeles', 'USA', 34.0522, -118.2437],
  ['North America', 'Nashville', 'USA', 36.1627, -86.7816],
  ['North America', 'New Haven', 'USA', 41.3083, -72.9279],
  ['North America', 'Philadelphia', 'USA', 39.9526, -75.1652],
  ['North America', 'Princeton', 'USA', 40.3573, -74.6672],
  ['North America', 'Raleigh', 'USA', 35.7796, -78.6382],
  ['North America', 'San Diego', 'USA', 32.7157, -117.1611],
  ['North America', 'San Francisco', 'USA', 37.7749, -122.4194],
  ['North America', 'Seattle', 'USA', 47.6062, -122.3321],
  ['North America', 'St. Louis', 'USA', 38.627, -90.1994],
  ['North America', 'Washington DC', 'USA', 38.9072, -77.0369],
  ['North America', 'Wichita', 'USA', 37.6872, -97.3301],
  ['North America', 'Montreal', 'Canada', 45.5019, -73.5674],
  ['North America', 'Toronto', 'Canada', 43.6532, -79.3832],
  ['North America', 'Vancouver', 'Canada', 49.2827, -123.1207],

  ['Oceania', 'Sydney', 'Australia', -33.8688, 151.2093],

  ['Latin America & Caribbean', 'São Paulo', 'Brazil', -23.5505, -46.6333],
  ['Latin America & Caribbean', 'Buenos Aires', 'Argentina', -34.6037, -58.3816],
  ['Latin America & Caribbean', 'La Paz', 'Bolivia', -16.4897, -68.1193],
  ['Latin America & Caribbean', 'Bogotá', 'Colombia', 4.711, -74.0721],
  ['Latin America & Caribbean', 'Mexico City', 'Mexico', 19.4326, -99.1332],
  ['Latin America & Caribbean', 'Lima', 'Peru', -12.0464, -77.0428],
  ['Latin America & Caribbean', 'Montevideo', 'Uruguay', -34.9011, -56.1645],
  ['Latin America & Caribbean', 'Caracas', 'Venezuela', 10.4806, -66.9036],

  ['Africa', 'Nairobi', 'Kenya', -1.2921, 36.8219],
  ['Africa', 'Kampala', 'Uganda', 0.3476, 32.5825],
  ['Africa', 'Lusaka', 'Zambia', -15.3875, 28.3228],
  ['Africa', 'Ndola', 'Zambia', -12.9587, 28.6366],
  ['Africa', 'Lagos', 'Nigeria', 6.5244, 3.3792],
  ['Africa', 'Addis Ababa', 'Ethiopia', 9.032, 38.7469],
  ['Africa', 'Cairo', 'Egypt', 30.0444, 31.2357],
  ['Africa', 'Dar es Salaam', 'Tanzania', -6.7924, 39.2083],
  ['Africa', 'Harare', 'Zimbabwe', -17.8252, 31.0335],
  ['Africa', 'Kinshasa', 'Democratic Republic of the Congo', -4.4419, 15.2663],

  ['South Asia', 'Chennai', 'India', 13.0827, 80.2707],

  ['Europe', 'Frankfurt', 'Germany', 50.1109, 8.6821],
  ['Europe', 'London', 'United Kingdom', 51.5074, -0.1278],
  ['Europe', 'Paris', 'France', 48.8566, 2.3522],
  ['Europe', 'Madrid', 'Spain', 40.4168, -3.7038],
  ['Europe', 'Dublin', 'Ireland', 53.3498, -6.2603],
  ['Europe', 'Amsterdam', 'Netherlands', 52.3676, 4.9041],
  ['Europe', 'Warsaw', 'Poland', 52.2297, 21.0122],

  ['East & Central Asia', 'Beijing', 'China', 39.9042, 116.4074],
  ['East & Central Asia', 'Seoul', 'South Korea', 37.5665, 126.978],
  ['East & Central Asia', 'Tokyo', 'Japan', 35.6762, 139.6503],
  ['East & Central Asia', 'Macao', 'Macao', 22.1987, 113.5439],
  ['East & Central Asia', 'Ulaanbaatar', 'Mongolia', 47.8864, 106.9057],

  ['Southeast Asia', 'Kuala Lumpur', 'Malaysia', 3.139, 101.6869],
  ['Southeast Asia', 'Phnom Penh', 'Cambodia', 11.5564, 104.9282],
  ['Southeast Asia', 'Jakarta', 'Indonesia', -6.2088, 106.8456],
  ['Southeast Asia', 'Vientiane', 'Laos', 17.9757, 102.6331],
  ['Southeast Asia', 'Manila', 'Philippines', 14.5995, 120.9842],
  ['Southeast Asia', 'Bangkok', 'Thailand', 13.7563, 100.5018],
  ['Southeast Asia', 'Hanoi', 'Vietnam', 21.0285, 105.8542],
];
