export type Rarity = "common" | "uncommon" | "scarce";
export type NestTypes = "stippled" | "striated" | "both";

export interface HonColor {
  id: number;
  name: string;
  slug: string;
  itemNumbers: string;
  productionStart: number;
  productionEnd: number;
  nestTypes: NestTypes;
  hasSlottedBeads: boolean;
  rarity: Rarity;
  ssinReferences: string;
  hexColor: string;
  hexColorSecondary: string;
  isIridescent: boolean;
  description: string;
  ebaySearchQuery: string;
  displayOrder: number;
}

export const HON_COLORS: HonColor[] = [
  {
    id: 1, name: "Crystal (Original)", slug: "crystal-original",
    itemNumbers: "No Number", productionStart: 1935, productionEnd: 1958,
    nestTypes: "stippled", hasSlottedBeads: false, rarity: "common",
    ssinReferences: "SSIN19", hexColor: "#E8E8E8", hexColorSecondary: "",
    isIridescent: false,
    description: "The earliest HONs, made in Crystal and Crystal/Decorated. Some have red cold-painted decoration on the comb, wattle, and ear. The eye is spherical with an eyelid design. Stippled nest with no beading.",
    ebaySearchQuery: "Indiana Glass hen on nest crystal clear vintage",
    displayOrder: 1,
  },
  {
    id: 2, name: "Milk Glass", slug: "milk-glass",
    itemNumbers: "#0539, #7155", productionStart: 1959, productionEnd: 1986,
    nestTypes: "both", hasSlottedBeads: true, rarity: "common",
    ssinReferences: "SSIN33, SSIN34", hexColor: "#F5F0E8", hexColorSecondary: "",
    isIridescent: false,
    description: "Second longest production run at 28 years. Over 5 million estimated produced. Found with slotted or unslotted beads, stippled or striated nests.",
    ebaySearchQuery: "Indiana Glass hen on nest milk glass white",
    displayOrder: 2,
  },
  {
    id: 3, name: "Riviera Blue", slug: "riviera-blue",
    itemNumbers: "#2233", productionStart: 1963, productionEnd: 1969,
    nestTypes: "stippled", hasSlottedBeads: false, rarity: "scarce",
    ssinReferences: "SSIN17", hexColor: "#2B4C6F", hexColorSecondary: "",
    isIridescent: false,
    description: "Labeled as simply Blue on the box. Also known as Confederate Blue, Smoky Blue, Midnight Blue, Denim Blue. Scarce and difficult to find.",
    ebaySearchQuery: "Indiana Glass hen on nest blue dark vintage",
    displayOrder: 3,
  },
  {
    id: 4, name: "Olive", slug: "olive",
    itemNumbers: "#0546, #2562", productionStart: 1965, productionEnd: 1982,
    nestTypes: "both", hasSlottedBeads: true, rarity: "common",
    ssinReferences: "SSIN26", hexColor: "#6B7D3A", hexColorSecondary: "",
    isIridescent: false,
    description: "Fourth longest production run. Stippled or striated nests, slotted or unslotted beads. Olive slotted-bead variant is hardest to find of the three slotted-bead colors.",
    ebaySearchQuery: "Indiana Glass hen on nest olive green",
    displayOrder: 4,
  },
  {
    id: 5, name: "Amber", slug: "amber",
    itemNumbers: "#0547, #1829", productionStart: 1965, productionEnd: 1985,
    nestTypes: "both", hasSlottedBeads: true, rarity: "common",
    ssinReferences: "SSIN10, SSIN11, SSIN24", hexColor: "#C8922A", hexColorSecondary: "#A07020",
    isIridescent: false,
    description: "Also called Gold and Golden Amber over the years. Hue varies between specimens. Indiana Glass never made a 'beer-bottle brown' HON despite collector rumors.",
    ebaySearchQuery: "Indiana Glass hen on nest amber gold golden",
    displayOrder: 5,
  },
  {
    id: 6, name: "Carnival", slug: "carnival",
    itemNumbers: "Unknown", productionStart: 1971, productionEnd: 1972,
    nestTypes: "both", hasSlottedBeads: false, rarity: "scarce",
    ssinReferences: "SSIN31", hexColor: "#D4A843", hexColorSecondary: "#E8C060",
    isIridescent: true,
    description: "Produced for just one to two years. Called Marigold by collectors but Indiana Glass called it Carnival. Never found in an official catalog. One of three 'mystery' colors.",
    ebaySearchQuery: "Indiana Glass hen on nest carnival marigold iridescent",
    displayOrder: 6,
  },
  {
    id: 7, name: "Iridescent Blue", slug: "iridescent-blue",
    itemNumbers: "#2891", productionStart: 1971, productionEnd: 1980,
    nestTypes: "both", hasSlottedBeads: false, rarity: "common",
    ssinReferences: "SSIN16", hexColor: "#1E3A5F", hexColorSecondary: "#3A1E5F",
    isIridescent: true,
    description: "Fifth longest production run. Readily available. Iridescence created by spraying salt solutions onto glass in a fuming chamber, then reheating.",
    ebaySearchQuery: "Indiana Glass hen on nest iridescent blue carnival",
    displayOrder: 7,
  },
  {
    id: 8, name: "Iridescent Gold", slug: "iridescent-gold",
    itemNumbers: "#1260", productionStart: 1972, productionEnd: 1980,
    nestTypes: "both", hasSlottedBeads: false, rarity: "common",
    ssinReferences: "SSIN25", hexColor: "#8B6914", hexColorSecondary: "#A08030",
    isIridescent: true,
    description: "Iridescence applied over Amber glass. Darker and more common than the Carnival/Marigold HON. Stippled nest version is scarce.",
    ebaySearchQuery: "Indiana Glass hen on nest iridescent gold carnival amber",
    displayOrder: 8,
  },
  {
    id: 9, name: "Lime Satin Mist", slug: "lime-satin-mist",
    itemNumbers: "#7241", productionStart: 1972, productionEnd: 1975,
    nestTypes: "both", hasSlottedBeads: false, rarity: "uncommon",
    ssinReferences: "SSIN29", hexColor: "#8FBF47", hexColorSecondary: "",
    isIridescent: false,
    description: "Unique satin (acid-etched) finish from hydrofluoric acid. Moderately hard to find. Commands higher prices.",
    ebaySearchQuery: "Indiana Glass hen on nest lime satin mist green frosted",
    displayOrder: 9,
  },
  {
    id: 10, name: "Iridescent Lime", slug: "iridescent-lime",
    itemNumbers: "#7643", productionStart: 1973, productionEnd: 1980,
    nestTypes: "striated", hasSlottedBeads: false, rarity: "common",
    ssinReferences: "SSIN30", hexColor: "#4A7A2E", hexColorSecondary: "#6A9A4E",
    isIridescent: true,
    description: "Fourth iridescent color. Plentifully available. Same base glass as Emerald Green with iridescent sheen.",
    ebaySearchQuery: "Indiana Glass hen on nest iridescent lime green carnival",
    displayOrder: 10,
  },
  {
    id: 11, name: "Red/Decorated", slug: "red-decorated",
    itemNumbers: "#2591", productionStart: 1974, productionEnd: 1978,
    nestTypes: "striated", hasSlottedBeads: false, rarity: "scarce",
    ssinReferences: "SSIN39", hexColor: "#9B1B30", hexColorSecondary: "",
    isIridescent: false,
    description: "Known as Ruby Red. Amber HON with red stain all over. Amber visible when held to light. Difficult to find in good condition.",
    ebaySearchQuery: "Indiana Glass hen on nest red ruby decorated",
    displayOrder: 11,
  },
  {
    id: 12, name: "Horizon Blue", slug: "horizon-blue",
    itemNumbers: "#7845", productionStart: 1974, productionEnd: 1980,
    nestTypes: "striated", hasSlottedBeads: false, rarity: "uncommon",
    ssinReferences: "SSIN14", hexColor: "#3A8FBF", hexColorSecondary: "",
    isIridescent: false,
    description: "Described as Aqua Blue or Turquoise Blue. A collector favorite — pricey due to color popularity rather than scarcity.",
    ebaySearchQuery: "Indiana Glass hen on nest horizon blue aqua turquoise",
    displayOrder: 12,
  },
  {
    id: 13, name: "Crystal (Reissue)", slug: "crystal-reissue",
    itemNumbers: "#1582, #4423, #4645, #5270", productionStart: 1982, productionEnd: 1992,
    nestTypes: "striated", hasSlottedBeads: false, rarity: "common",
    ssinReferences: "SSIN18", hexColor: "#D4D4D4", hexColorSecondary: "",
    isIridescent: false,
    description: "Reissued Crystal with beaded rim and striated base. Very easy to find at low prices. Perfect starter piece.",
    ebaySearchQuery: "Indiana Glass hen on nest crystal clear beaded",
    displayOrder: 13,
  },
  {
    id: 14, name: "Yellow Mist", slug: "yellow-mist",
    itemNumbers: "Unknown", productionStart: 1981, productionEnd: 1985,
    nestTypes: "striated", hasSlottedBeads: false, rarity: "scarce",
    ssinReferences: "SSIN40", hexColor: "#D4C36A", hexColorSecondary: "",
    isIridescent: false,
    description: "Extremely hard to find. Sometimes called Topaz. Color is in the glass. No known item number or catalog appearance. One of three 'mystery' colors.",
    ebaySearchQuery: "Indiana Glass hen on nest yellow mist topaz",
    displayOrder: 14,
  },
  {
    id: 15, name: "Pink", slug: "pink",
    itemNumbers: "#4899", productionStart: 1984, productionEnd: 1989,
    nestTypes: "striated", hasSlottedBeads: false, rarity: "uncommon",
    ssinReferences: "SSIN37, SSIN38", hexColor: "#D4A0A0", hexColorSecondary: "",
    isIridescent: false,
    description: "Labeled Pastel Pink on packaging. Multiple shade variations exist. The darker variant is the separate Peach color.",
    ebaySearchQuery: "Indiana Glass hen on nest pink pastel",
    displayOrder: 15,
  },
  {
    id: 16, name: "Pastel Blue", slug: "pastel-blue",
    itemNumbers: "#4901", productionStart: 1984, productionEnd: 1992,
    nestTypes: "striated", hasSlottedBeads: false, rarity: "common",
    ssinReferences: "SSIN12, SSIN13", hexColor: "#7BA3C4", hexColorSecondary: "#B0C8DC",
    isIridescent: false,
    description: "Two distinct shades: darker cornflower blue (common) and lighter ice blue (scarce). Item number changed from #4901 to #1583.",
    ebaySearchQuery: "Indiana Glass hen on nest pastel blue cornflower",
    displayOrder: 16,
  },
  {
    id: 17, name: "Pastel Green", slug: "pastel-green",
    itemNumbers: "#4900", productionStart: 1984, productionEnd: 1985,
    nestTypes: "striated", hasSlottedBeads: false, rarity: "uncommon",
    ssinReferences: "SSIN27", hexColor: "#8FBF8F", hexColorSecondary: "",
    isIridescent: false,
    description: "Scarcer of the pastels. Also sold as Chantilly Green through Tiara Exclusives. Production may have been diverted to Sandwich pattern.",
    ebaySearchQuery: "Indiana Glass hen on nest pastel green chantilly",
    displayOrder: 17,
  },
  {
    id: 18, name: "Emerald Green", slug: "emerald-green",
    itemNumbers: "Unknown", productionStart: 1985, productionEnd: 1986,
    nestTypes: "striated", hasSlottedBeads: false, rarity: "scarce",
    ssinReferences: "SSIN28", hexColor: "#2D8B46", hexColorSecondary: "",
    isIridescent: false,
    description: "Same glass as Iridescent Lime without iridescence, lighter than Olive. Commands high prices. One of three 'mystery' colors.",
    ebaySearchQuery: "Indiana Glass hen on nest emerald green lime",
    displayOrder: 18,
  },
  {
    id: 19, name: "Peach", slug: "peach",
    itemNumbers: "#4899, #1584", productionStart: 1988, productionEnd: 1992,
    nestTypes: "striated", hasSlottedBeads: false, rarity: "uncommon",
    ssinReferences: "SSIN36", hexColor: "#C4907A", hexColorSecondary: "",
    isIridescent: false,
    description: "Deeper, more saturated Pink. Renamed from Pink to Peach in 1988. Look for fuller color saturation. Scarcer than Pink.",
    ebaySearchQuery: "Indiana Glass hen on nest peach pink dark",
    displayOrder: 19,
  },
  {
    id: 20, name: "Evergreen", slug: "evergreen",
    itemNumbers: "#7206", productionStart: 1994, productionEnd: 1998,
    nestTypes: "striated", hasSlottedBeads: false, rarity: "scarce",
    ssinReferences: "SSIN22", hexColor: "#1A7A6D", hexColorSecondary: "",
    isIridescent: false,
    description: "Teal color, same as Spruce Green for Tiara Exclusives. Marketed as 'Confections, by Indiana Glass.' Scarcer, shorter production run.",
    ebaySearchQuery: "Indiana Glass hen on nest evergreen teal spruce",
    displayOrder: 20,
  },
  {
    id: 21, name: "Evergreen Carnival", slug: "evergreen-carnival",
    itemNumbers: "#7133", productionStart: 1994, productionEnd: 1998,
    nestTypes: "striated", hasSlottedBeads: false, rarity: "scarce",
    ssinReferences: "SSIN23", hexColor: "#1A6B60", hexColorSecondary: "#2A8B80",
    isIridescent: true,
    description: "Iridescent carnival Evergreen. Look for teal hue under the lid to distinguish from Iridescent Blue. Scarce and difficult to find.",
    ebaySearchQuery: "Indiana Glass hen on nest evergreen carnival teal iridescent",
    displayOrder: 21,
  },
  {
    id: 22, name: "Cranberry/Decorated", slug: "cranberry-decorated",
    itemNumbers: "#7520", productionStart: 1995, productionEnd: 1998,
    nestTypes: "striated", hasSlottedBeads: false, rarity: "uncommon",
    ssinReferences: "SSIN21", hexColor: "#B03060", hexColorSecondary: "",
    isIridescent: false,
    description: "Stained over clear glass with improved technique. 'Confections, by Indiana Glass.' Also made as cat and bunny dishes. Rumored to be the last HON color ever made.",
    ebaySearchQuery: "Indiana Glass hen on nest cranberry pink confections",
    displayOrder: 22,
  },
];

export const colorBySlug = (slug: string) => HON_COLORS.find((c) => c.slug === slug);
export const colorById = (id: number) => HON_COLORS.find((c) => c.id === id);

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function ebaySearchUrl(query: string, soldOnly = false) {
  const base = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}`;
  return soldOnly ? `${base}&LH_Sold=1&LH_Complete=1` : base;
}
