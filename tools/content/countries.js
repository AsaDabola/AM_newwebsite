/**
 * The mission country list, from Fellowship_Websites_Status_60_Countries.xlsx.
 *
 * Sixty-eight numbered entries: twenty G20 mission countries, forty-four M40
 * mission countries, and four additional priority or replacement countries.
 * Two entries are country groups sharing one site, so the entries cover
 * seventy-five distinct ISO codes.
 *
 * `region` is only set on the M40 block; the G20 and additional blocks are not
 * grouped by region in the source. `sites` records the fellowship sites that
 * already exist for that country.
 *
 * Two ISO codes in the source were wrong and are corrected here — see
 * CORRECTIONS at the foot of this file. Everything else is verbatim.
 */

const COUNTRIES = [
  { no: 1, name: "Brazil", tier: 'G20', region: null, iso: ["br"], languages: ["Portuguese"] },
  { no: 2, name: "Canada", tier: 'G20', region: null, iso: ["ca"], languages: ["English", "French"] },
  { no: 3, name: "Colombia", tier: 'G20', region: null, iso: ["co", "ve", "ec", "pa"], languages: ["Spanish"], covers: ["Colombia", "Venezuela", "Ecuador", "Panama"] },
  { no: 4, name: "France", tier: 'G20', region: null, iso: ["fr"], languages: ["French"], sites: {"YEF": "https://yefi.org/fr/"} },
  { no: 5, name: "Germany", tier: 'G20', region: null, iso: ["de"], languages: ["German"] },
  { no: 6, name: "India", tier: 'G20', region: null, iso: ["in"], languages: ["Hindi", "English"] },
  { no: 7, name: "Indonesia", tier: 'G20', region: null, iso: ["id"], languages: ["Indonesian"] },
  { no: 8, name: "Italy", tier: 'G20', region: null, iso: ["it"], languages: ["Italian"], sites: {"YEF": "yefi.org/it/"} },
  { no: 9, name: "Japan", tier: 'G20', region: null, iso: ["jp"], languages: ["Japanese"], sites: {"AM": "https://amjapan.org/", "YEF": "https://yefi.org/jp/"} },
  { no: 10, name: "East Federal Africa", tier: 'G20', region: null, iso: ["ke", "tz", "ug", "rw", "bi", "ss"], languages: ["English", "Swahili", "French", "Kinyarwanda", "Kirundi"], covers: ["Kenya", "Tanzania", "Uganda", "Rwanda", "Burundi", "South Sudan"] },
  { no: 11, name: "South Korea", tier: 'G20', region: null, iso: ["kr"], languages: ["Korean"], sites: {"AM": "https://amkorea.org/", "YEF": "https://yefk.org/", "JUBILEE": "https://kr.jubileeworld.org/", "CREATIO": "creatio.or.kr"} },
  { no: 12, name: "Mexico", tier: 'G20', region: null, iso: ["mx"], languages: ["Spanish"] },
  { no: 13, name: "Nigeria", tier: 'G20', region: null, iso: ["ng"], languages: ["English"] },
  { no: 14, name: "Australia", tier: 'G20', region: null, iso: ["au"], languages: ["English"] },
  { no: 15, name: "Russia", tier: 'G20', region: null, iso: ["ru"], languages: ["Russian"] },
  { no: 16, name: "South Africa", tier: 'G20', region: null, iso: ["za"], languages: ["English", "Afrikaans", "Zulu", "Xhosa", "and others"] },
  { no: 17, name: "Spain", tier: 'G20', region: null, iso: ["es"], languages: ["Spanish"], sites: {"YEF": "yefi.org/es"} },
  { no: 18, name: "Turkey", tier: 'G20', region: null, iso: ["tr"], languages: ["Turkish"] },
  { no: 19, name: "United Kingdom", tier: 'G20', region: null, iso: ["gb"], languages: ["English"], sites: {"YEF": "https://yefi.org/uk/"} },
  { no: 20, name: "United States", tier: 'G20', region: null, iso: ["us"], languages: ["English"], sites: {"YEF": "https://yefi.org/usa/"} },
  { no: 21, name: "Angola", tier: 'M40', region: "Africa", iso: ["ao"], languages: ["Portuguese"], sites: {"YEF": "yefi.org/ao"} },
  { no: 22, name: "Cameroon", tier: 'M40', region: "Africa", iso: ["cm"], languages: ["French", "English"] },
  { no: 23, name: "Democratic Republic of the Congo", tier: 'M40', region: "Africa", iso: ["cd"], languages: ["French"] },
  { no: 24, name: "Ethiopia", tier: 'M40', region: "Africa", iso: ["et"], languages: ["Amharic", "English"] },
  { no: 25, name: "Ghana", tier: 'M40', region: "Africa", iso: ["gh"], languages: ["English"] },
  { no: 26, name: "Côte d'Ivoire", tier: 'M40', region: "Africa", iso: ["ci"], languages: ["French"] },
  { no: 27, name: "Madagascar", tier: 'M40', region: "Africa", iso: ["mg"], languages: ["Malagasy", "French"] },
  { no: 28, name: "Mozambique", tier: 'M40', region: "Africa", iso: ["mz"], languages: ["Portuguese"] },
  { no: 29, name: "Zambia", tier: 'M40', region: "Africa", iso: ["zm"], languages: ["English"], note: "Completed" },
  { no: 30, name: "Austria", tier: 'M40', region: "Europe", iso: ["at"], languages: ["German"] },
  { no: 31, name: "Belgium", tier: 'M40', region: "Europe", iso: ["be"], languages: ["Dutch", "French", "German"] },
  { no: 32, name: "Czechia", tier: 'M40', region: "Europe", iso: ["cz"], languages: ["Czech"] },
  { no: 33, name: "Slovakia", tier: 'M40', region: "Europe", iso: ["sk"], languages: ["Slovak"] },
  { no: 34, name: "Greece", tier: 'M40', region: "Europe", iso: ["gr"], languages: ["Greek"] },
  { no: 35, name: "Hungary", tier: 'M40', region: "Europe", iso: ["hu"], languages: ["Hungarian"] },
  { no: 36, name: "Netherlands", tier: 'M40', region: "Europe", iso: ["nl"], languages: ["Dutch"] },
  { no: 37, name: "Poland", tier: 'M40', region: "Europe", iso: ["pl"], languages: ["Polish"] },
  { no: 38, name: "Portugal", tier: 'M40', region: "Europe", iso: ["pt"], languages: ["Portuguese"] },
  { no: 39, name: "Romania", tier: 'M40', region: "Europe", iso: ["ro"], languages: ["Romanian"], sites: {"YEF": "yefi.org/ro/"} },
  { no: 40, name: "Sweden", tier: 'M40', region: "Europe", iso: ["se"], languages: ["Swedish"], sites: {"YEF": "yefi.org/se/"} },
  { no: 41, name: "Switzerland", tier: 'M40', region: "Europe", iso: ["ch"], languages: ["German", "French", "Italian", "Romansh"] },
  { no: 42, name: "Ukraine", tier: 'M40', region: "Europe", iso: ["ua"], languages: ["Ukrainian"] },
  { no: 43, name: "Dominican Republic", tier: 'M40', region: "Central America and the Caribbean", iso: ["do"], languages: ["Spanish"] },
  { no: 44, name: "Haiti", tier: 'M40', region: "Central America and the Caribbean", iso: ["ht"], languages: ["French", "Haitian Creole"] },
  { no: 45, name: "Argentina", tier: 'M40', region: "South America", iso: ["ar"], languages: ["Spanish"] },
  { no: 46, name: "Chile", tier: 'M40', region: "South America", iso: ["cl"], languages: ["Spanish"] },
  { no: 47, name: "Peru", tier: 'M40', region: "South America", iso: ["pe"], languages: ["Spanish"] },
  { no: 48, name: "Kazakhstan", tier: 'M40', region: "Commonwealth of Independent States", iso: ["kz"], languages: ["Kazakh", "Russian"] },
  { no: 49, name: "Egypt", tier: 'M40', region: "Middle East and North Africa", iso: ["eg"], languages: ["Arabic"] },
  { no: 50, name: "Israel", tier: 'M40', region: "Middle East and North Africa", iso: ["il"], languages: ["Hebrew", "Arabic"] },
  { no: 51, name: "United Arab Emirates", tier: 'M40', region: "Middle East and North Africa", iso: ["ae"], languages: ["Arabic"] },
  { no: 52, name: "New Zealand", tier: 'M40', region: "Oceania", iso: ["nz"], languages: ["English"] },
  { no: 53, name: "Fiji", tier: 'M40', region: "Oceania", iso: ["fj"], languages: ["English", "Fijian", "Fiji Hindi"] },
  { no: 54, name: "Bangladesh", tier: 'M40', region: "South Asia", iso: ["bd"], languages: ["Bengali"] },
  { no: 55, name: "Nepal", tier: 'M40', region: "South Asia", iso: ["np"], languages: ["Nepali"] },
  { no: 56, name: "Pakistan", tier: 'M40', region: "South Asia", iso: ["pk"], languages: ["Urdu", "English"] },
  { no: 57, name: "Malaysia", tier: 'M40', region: "Southeast Asia", iso: ["my"], languages: ["Malay"] },
  { no: 58, name: "Myanmar", tier: 'M40', region: "Southeast Asia", iso: ["mm"], languages: ["Burmese"] },
  { no: 59, name: "Philippines", tier: 'M40', region: "Southeast Asia", iso: ["ph"], languages: ["Filipino", "English"] },
  { no: 60, name: "Singapore", tier: 'M40', region: "Southeast Asia", iso: ["sg"], languages: ["English", "Malay", "Mandarin Chinese", "Tamil"] },
  { no: 61, name: "Thailand", tier: 'M40', region: "Southeast Asia", iso: ["th"], languages: ["Thai"] },
  { no: 62, name: "Vietnam", tier: 'M40', region: "Southeast Asia", iso: ["vn"], languages: ["Vietnamese"] },
  { no: 63, name: "Mongolia", tier: 'M40', region: "Asia-Pacific", iso: ["mn"], languages: ["Mongolian"], sites: {"YEF": "yefi.org/mn/"} },
  { no: 64, name: "Taiwan", tier: 'M40', region: "Asia-Pacific", iso: ["tw"], languages: ["Mandarin Chinese"] },
  { no: 65, name: "Rwanda", tier: 'Additional', region: null, iso: ["rw"], languages: ["Kinyarwanda", "English", "French", "Swahili"] },
  { no: 66, name: "Guatemala", tier: 'Additional', region: null, iso: ["gt"], languages: ["Spanish"] },
  { no: 67, name: "Honduras", tier: 'Additional', region: null, iso: ["hn"], languages: ["Spanish"] },
  { no: 68, name: "Sri Lanka", tier: 'Additional', region: null, iso: ["lk"], languages: ["Sinhala", "Tamil"] },];

/** The ten fellowships sharing this country list, and their headquarters site. */
const FELLOWSHIPS = {
  AM: 'https://amintl.org/',
  YEF: 'https://yefi.org/',
  YD: 'https://youngdisciples.org/',
  JUBILEE: 'https://jubileeworld.org',
  CREATIO: 'https://creatiointl.org/',
  GNIT: 'https://gnit.org',
  VERITAS: 'https://veritassociety.org',
  SLS: 'https://saintlukesociety.org/',
  CLF: null,
  OTM: null,
};

/**
 * Problems found in the source spreadsheet. Corrected in the data above where
 * the correct value is unambiguous; listed here either way so they can be
 * fixed at source.
 */
const CORRECTIONS = [
  { row: 'Malaysia', was: 'ms', now: 'my', why: 'ms is the Malay language code, not the country code' },
  { row: 'Myanmar', was: 'my', now: 'mm', why: 'my is Malaysia; Myanmar is mm' },
  { row: 'Colombia group', was: 'Equador', now: 'Ecuador', why: 'spelling' },
  { row: 'East Federal Africa group', was: 'Brundi', now: 'Burundi', why: 'spelling' },
  { row: 'Rwanda', was: null, now: null, why: 'appears twice — inside the East Federal Africa group (rw) and again as additional country 65' },
];

module.exports = { COUNTRIES, FELLOWSHIPS, CORRECTIONS };
