export const SITE_TITLE_PHRASE = "Insulation in Central Connecticut";
export const PHONE_HREF = "tel:+18606905465";
export const PHONE_DISPLAY = "1 (860)-690-5465";
export const FREE_INSPECTION_CTA = "Call, email or book online for a free inspection.";
export const HOURS_DISPLAY = "7 days a week from 7am-5pm";

export type Service = {
  slug: string;
  title: string;
  shortDescription: string;
  overview: string;
  homeBenefit: string;
  energySavings: string;
  highlights: string[];
};

export const services: Service[] = [
  {
    slug: "foam-air-sealing",
    title: "Foam Air Sealing",
    shortDescription:
      "Seal hidden air leaks around penetrations, bypasses, and framing joints for stronger comfort control.",
    overview:
      "Professional foam air sealing closes the uncontrolled gaps in your home envelope that let conditioned air escape and outside air enter.",
    homeBenefit:
      "Rooms feel more even, drafts are reduced, and HVAC systems do not have to work as hard to hold target temperatures.",
    energySavings:
      "By reducing air leakage, foam sealing lowers wasted heating and cooling energy and supports measurable utility savings year-round.",
    highlights: [
      "Attic bypass and top-plate sealing",
      "Rim joist and band joist treatment",
      "Pipe, wiring, and duct penetration sealing",
      "Pairs well with new attic insulation",
    ],
  },
  {
    slug: "blown-in-fiberglass-insulation",
    title: "Blown-in Fiberglass Insulation",
    shortDescription:
      "Loose-fill fiberglass creates continuous coverage across attics and hard-to-reach cavities.",
    overview:
      "Blown-in fiberglass insulation fills irregular spaces that are difficult to insulate with traditional batts.",
    homeBenefit:
      "The added coverage improves indoor comfort and helps reduce hot and cold spots across upper levels.",
    energySavings:
      "A properly insulated attic limits heat transfer and helps cut annual heating and cooling costs.",
    highlights: [
      "Attic floor coverage",
      "Uniform fill around framing obstructions",
      "Ideal for retrofit energy upgrades",
      "Compatible with air-sealing improvements",
    ],
  },
  {
    slug: "batt-insulation",
    title: "Batt Insulation",
    shortDescription:
      "Fiberglass batt insulation for framed walls, floors, and open cavities that need reliable thermal resistance.",
    overview:
      "Batt insulation is installed between framing members where full cavity access allows clean, consistent placement.",
    homeBenefit:
      "It supports better room-to-room comfort and can also improve interior sound control in selected assemblies.",
    energySavings:
      "Correctly installed batt insulation helps reduce thermal losses and lowers ongoing energy demand.",
    highlights: [
      "Open wall and floor framing applications",
      "Basement and conditioned-space upgrades",
      "Multiple R-value options",
      "Cost-effective for accessible cavities",
    ],
  },
  {
    slug: "garage-ceiling-insulation",
    title: "Garage Ceiling Insulation",
    shortDescription:
      "Insulate the garage ceiling to protect living spaces above from temperature swings.",
    overview:
      "Garage ceiling insulation improves the thermal boundary between attached garages and conditioned rooms overhead.",
    homeBenefit:
      "Floors above garages stay warmer in winter and more comfortable throughout the year.",
    energySavings:
      "Reducing heat loss through the garage assembly lowers HVAC runtime for adjacent living spaces.",
    highlights: [
      "Targets rooms over attached garages",
      "Improves comfort on upper levels",
      "Works with existing ceiling assemblies",
      "Can be combined with air sealing",
    ],
  },
  {
    slug: "insulation-removal",
    title: "Insulation Removal",
    shortDescription:
      "Safely remove damaged, contaminated, or underperforming insulation before upgrading.",
    overview:
      "Insulation removal clears old material when moisture, pests, odor, or degraded performance prevents effective retrofits.",
    homeBenefit:
      "A clean attic or crawlspace prepares your home for durable, high-performing insulation installation.",
    energySavings:
      "Starting with clean, properly installed insulation helps ensure your upgrade delivers maximum efficiency gains.",
    highlights: [
      "Removal of compromised attic insulation",
      "Preparation for full retrofit projects",
      "Cleaner substrate for air sealing",
      "Better long-term insulation performance",
    ],
  },
  {
    slug: "solar-attic-fans",
    title: "Solar Attic Fans",
    shortDescription:
      "Use solar-powered ventilation to reduce attic heat buildup and moisture load.",
    overview:
      "Solar attic fans actively vent excess heat and humidity from attic spaces without increasing electric consumption.",
    homeBenefit:
      "Lower attic temperatures help improve indoor comfort and reduce stress on roofing materials.",
    energySavings:
      "With less heat trapped above conditioned space, cooling systems often run less during warm months.",
    highlights: [
      "Solar-powered operation",
      "Improves attic airflow",
      "Reduces summer attic heat",
      "Supports roof and insulation health",
    ],
  },
  {
    slug: "crawl-space-insulation",
    title: "Crawl Space Insulation",
    shortDescription:
      "Insulate and protect crawlspaces to control moisture, drafts, and energy loss from below.",
    overview:
      "Crawl space insulation upgrades the lower envelope of your home to reduce infiltration and temperature transfer.",
    homeBenefit:
      "Floors feel less cold, indoor humidity is easier to manage, and comfort improves in first-floor living areas.",
    energySavings:
      "Sealing and insulating crawlspaces reduces heat loss and can significantly improve whole-home efficiency.",
    highlights: [
      "Floor and wall insulation options",
      "Helps control ground moisture effects",
      "Draft reduction at lower levels",
      "Supports healthier indoor air quality",
    ],
  },
  {
    slug: "attic-insulation",
    title: "Attic Insulation",
    shortDescription:
      "Upgrade attic insulation levels to improve year-round comfort and reduce energy waste.",
    overview:
      "Attic insulation is one of the most effective home energy improvements for Connecticut homes.",
    homeBenefit:
      "It stabilizes indoor temperatures and helps maintain comfort in all seasons.",
    energySavings:
      "Improved attic R-value can reduce heating and cooling costs by limiting top-of-house heat transfer.",
    highlights: [
      "Top-of-house thermal upgrade",
      "Supports rebate-qualified projects",
      "Works with air-sealing improvements",
      "Improves comfort in upper rooms",
    ],
  },
  {
    slug: "basement-insulation",
    title: "Basement Insulation",
    shortDescription:
      "Insulate basement walls and critical surfaces to reduce heat loss and improve lower-level comfort.",
    overview:
      "Basement insulation helps convert a major loss area into a better-performing part of the home envelope.",
    homeBenefit:
      "Lower levels become more usable and connected to the comfort of the main living space.",
    energySavings:
      "Reducing basement heat loss helps improve whole-home system efficiency, especially during winter.",
    highlights: [
      "Basement wall insulation options",
      "Improves comfort near first-floor floors",
      "Pairs well with rim joist sealing",
      "Supports conditioned basement spaces",
    ],
  },
  {
    slug: "duct-insulation",
    title: "Duct Insulation",
    shortDescription:
      "Insulate exposed ductwork to reduce thermal losses before air reaches living spaces.",
    overview:
      "Duct insulation protects heated or cooled air moving through unconditioned attics, basements, and crawlspaces.",
    homeBenefit:
      "Rooms receive more consistent supply-air temperatures and systems respond more effectively.",
    energySavings:
      "Less thermal loss in transit means lower HVAC energy demand for the same comfort output.",
    highlights: [
      "Insulation for exposed duct runs",
      "Useful in attics, basements, and crawlspaces",
      "Supports better airflow performance",
      "Reduces waste in distribution systems",
    ],
  },
  {
    slug: "pipe-insulation",
    title: "Pipe Insulation",
    shortDescription:
      "Insulate plumbing lines to protect temperature-sensitive pipes and reduce standby losses.",
    overview:
      "Pipe insulation helps preserve hot-water temperatures and reduces risk of freezing in vulnerable locations.",
    homeBenefit:
      "Hot water arrives faster at fixtures and plumbing systems are better protected in colder seasons.",
    energySavings:
      "Lower heat loss from hot-water lines reduces water-heating energy use and recurring utility costs.",
    highlights: [
      "Hot-water pipe insulation",
      "Freeze-risk protection support",
      "Improves delivery efficiency",
      "Fast, targeted efficiency upgrade",
    ],
  },
  {
    slug: "passive-attic-ventilation",
    title: "Passive Attic Ventilation",
    shortDescription:
      "Balance intake and exhaust airflow to manage attic temperature and moisture naturally.",
    overview:
      "Passive attic ventilation uses ridge, soffit, and roof ventilation pathways to improve attic air exchange.",
    homeBenefit:
      "Balanced airflow supports roof longevity and helps maintain healthier attic conditions.",
    energySavings:
      "By lowering excess attic heat and moisture stress, passive ventilation supports more efficient building performance.",
    highlights: [
      "Ridge and soffit ventilation balance",
      "No electric operating cost",
      "Helps reduce attic humidity buildup",
      "Complements insulation upgrades",
    ],
  },
  {
    slug: "radiant-barrier-foil",
    title: "Radiant Barrier Foil",
    shortDescription:
      "Reflect radiant heat to reduce attic heat gain and improve summer performance.",
    overview:
      "Radiant barrier foil reflects a significant portion of radiant heat before it penetrates living areas.",
    homeBenefit:
      "Homes stay more comfortable in hot weather, especially on upper floors.",
    energySavings:
      "Lower radiant heat transfer can reduce cooling load and improve seasonal HVAC efficiency.",
    highlights: [
      "Reflective thermal control layer",
      "Targets solar heat gain",
      "Useful in hot attic conditions",
      "Compatible with insulation retrofits",
    ],
  },
  {
    slug: "double-bubble-foil",
    title: "Double Bubble Foil",
    shortDescription:
      "Reflective bubble insulation adds thermal resistance and radiant protection in select applications.",
    overview:
      "Double bubble foil combines reflective surfaces with enclosed air cells for versatile insulation support.",
    homeBenefit:
      "It can help moderate heat transfer in garages, basements, and other utility spaces.",
    energySavings:
      "When correctly installed, reflective bubble systems reduce thermal exchange and support lower conditioning costs.",
    highlights: [
      "Reflective and conductive resistance",
      "Useful for targeted retrofit details",
      "Lightweight and durable",
      "Supports envelope performance goals",
    ],
  },
  {
    slug: "basement-concrete-sealer",
    title: "Basement Concrete Sealer",
    shortDescription:
      "Seal concrete surfaces to reduce moisture movement and improve insulation system durability.",
    overview:
      "Basement concrete sealing helps control moisture transmission that can degrade insulation and indoor comfort.",
    homeBenefit:
      "Drier basement conditions support a healthier, more stable conditioned space.",
    energySavings:
      "Moisture control protects insulation performance so your energy upgrades continue delivering savings.",
    highlights: [
      "Concrete moisture-control treatment",
      "Supports long-term insulation value",
      "Improves basement environment quality",
      "Useful before finishing lower levels",
    ],
  },
  {
    slug: "rim-joist-foam-sealing",
    title: "Rim Joist Foam Sealing",
    shortDescription:
      "Seal and insulate rim joists to stop one of the most common leakage points in homes.",
    overview:
      "Rim joists are a frequent source of air infiltration and conductive heat loss in basements and crawlspaces.",
    homeBenefit:
      "Targeted foam sealing reduces drafts at floor edges and improves first-floor comfort.",
    energySavings:
      "Blocking leakage at the rim joist can significantly reduce heating losses during cold months.",
    highlights: [
      "High-impact air-sealing target",
      "Basement and crawlspace focused",
      "Improves comfort near perimeter walls",
      "Works with basement insulation projects",
    ],
  },
  {
    slug: "thermal-imaging",
    title: "Thermal Imaging",
    shortDescription:
      "Use infrared diagnostics to identify hidden insulation gaps and energy-loss locations.",
    overview:
      "Thermal imaging provides visual evidence of missing insulation, air leaks, and performance issues.",
    homeBenefit:
      "Homeowners get clear, confidence-building insight before investing in improvements.",
    energySavings:
      "By targeting the right upgrades first, thermal diagnostics helps maximize return on every insulation dollar.",
    highlights: [
      "Infrared insulation diagnostics",
      "Pinpoints hidden comfort issues",
      "Supports better upgrade planning",
      "Reduces guesswork in retrofit scope",
    ],
  },
];

export type Town = {
  slug: string;
  name: string;
};

export const towns: Town[] = [
  { slug: "hartford", name: "Hartford" },
  { slug: "west-hartford", name: "West Hartford" },
  { slug: "east-hartford", name: "East Hartford" },
  { slug: "new-britain", name: "New Britain" },
  { slug: "bristol", name: "Bristol" },
  { slug: "newington", name: "Newington" },
  { slug: "wethersfield", name: "Wethersfield" },
  { slug: "rocky-hill", name: "Rocky Hill" },
  { slug: "glastonbury", name: "Glastonbury" },
  { slug: "bloomfield", name: "Bloomfield" },
  { slug: "farmington", name: "Farmington" },
  { slug: "avon", name: "Avon" },
  { slug: "simsbury", name: "Simsbury" },
  { slug: "plainville", name: "Plainville" },
  { slug: "berlin", name: "Berlin" },
  { slug: "southington", name: "Southington" },
  { slug: "canton", name: "Canton" },
  { slug: "burlington", name: "Burlington" },
  { slug: "enfield", name: "Enfield" },
  { slug: "windsor", name: "Windsor" },
  { slug: "middletown", name: "Middletown" },
  { slug: "meriden", name: "Meriden" },
  { slug: "wallingford", name: "Wallingford" },
  { slug: "cromwell", name: "Cromwell" },
  { slug: "portland", name: "Portland" },
  { slug: "east-hampton", name: "East Hampton" },
  { slug: "haddam", name: "Haddam" },
  { slug: "durham", name: "Durham" },
  { slug: "middlefield", name: "Middlefield" },
  { slug: "chester", name: "Chester" },
  { slug: "litchfield", name: "Litchfield" },
  { slug: "torrington", name: "Torrington" },
  { slug: "harwinton", name: "Harwinton" },
];
