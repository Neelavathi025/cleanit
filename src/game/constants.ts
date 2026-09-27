import { WasteItem, ClueSource } from '../types/game';

export const MAP_WIDTH = 1500;
export const MAP_HEIGHT = 1000;

export const INITIAL_WASTE_ITEMS: WasteItem[] = [
  {
    id: 'waste-1',
    name: 'Plastic Water Bottle',
    category: 'RECYCLABLE',
    x: 480,
    y: 430,
    width: 24,
    height: 24,
    icon: '🥤',
    collected: false,
    sorted: false,
    description: 'A discarded PET plastic bottle rolled against the street curb.',
    ecoFact: 'PET bottles take 450 years to degrade, but clean PET can be recycled into fleece jackets, bags, or new bottles.',
    wrongBinExplanation: 'Plastic bottles are recyclable! If mixed with organic waste or hazardous trash, they end up in landfills or incinerators.',
    pollutionChain: [
      { label: 'Dropped on Street', icon: '🥤', detail: 'Carelessly discarded along the roadway curb' },
      { label: 'Washed into Drain', icon: '🌧️', detail: 'Rainwater flushes the bottle straight into the storm culvert' },
      { label: 'Reaches River & Sea', icon: '🌊', detail: 'Breaks down into hazardous microplastics in waterways' },
      { label: 'Marine Harm', icon: '🐟', detail: 'Ingested by fish, entering the human food supply' }
    ]
  },
  {
    id: 'waste-2',
    name: 'Takeout Food Box',
    category: 'ORGANIC',
    x: 820,
    y: 280,
    width: 26,
    height: 26,
    icon: '🥡',
    collected: false,
    sorted: false,
    description: 'Greasy cardboard box with leftover noodles abandoned by the park bench.',
    ecoFact: 'Heavily grease-soaked paper cannot be recycled with clean paper, but can be industrially composted or added to organic bins.',
    wrongBinExplanation: 'Food-soiled paper and leftover scraps belong in the ORGANIC bin. In recyclable paper bins, grease ruins entire batches of pulp!',
    pollutionChain: [
      { label: 'Left on Bench', icon: '🥡', detail: 'Scraps left exposed to sun and wind' },
      { label: 'Pest Infestation', icon: '🐀', detail: 'Attracts rats, flies, and disease-carrying pests' },
      { label: 'Anaerobic Rot', icon: '💨', detail: 'Decays anaerobically in trash heaps, emitting potent methane' }
    ]
  },
  {
    id: 'waste-3',
    name: 'Banana Peel',
    category: 'ORGANIC',
    x: 960,
    y: 350,
    width: 22,
    height: 22,
    icon: '🍌',
    collected: false,
    sorted: false,
    description: 'Blackened banana peel on the park lawn beside a tree.',
    ecoFact: 'When composted, banana peels return potassium, phosphorus, and nitrogen to enrich garden soil.',
    wrongBinExplanation: 'Banana peels are 100% biodegradable organic matter. Never place them in recyclable or hazardous bins!',
    pollutionChain: [
      { label: 'Tossed on Grass', icon: '🍌', detail: 'Slips underfoot and poses a walking hazard' },
      { label: 'Landfill Burial', icon: '🗑️', detail: 'Without oxygen in mixed landfills, rots and creates greenhouse gases' },
      { label: 'Lost Fertilizer', icon: '🌱', detail: 'Nutrients that could nourish soil are permanently wasted' }
    ]
  },
  {
    id: 'waste-4',
    name: 'Flattened Cardboard Box',
    category: 'RECYCLABLE',
    x: 290,
    y: 370,
    width: 32,
    height: 32,
    icon: '📦',
    collected: false,
    sorted: false,
    description: 'Shipping box blown into the alley behind Ray\'s Market.',
    ecoFact: 'Cardboard can be recycled 5 to 7 times before wood fibers become too short to bind.',
    wrongBinExplanation: 'Clean cardboard is highly recyclable! It shouldn\'t go into organic or general waste where it absorbs moisture and rots.',
    pollutionChain: [
      { label: 'Blown into Alley', icon: '📦', detail: 'Blocks alley drainage channels and accumulates street dirt' },
      { label: 'Moisture Decay', icon: '🌧️', detail: 'Rains turn clean recyclable fiber into useless soggy muck' },
      { label: 'More Trees Cut', icon: '🪓', detail: 'Failure to recycle means virgin forests are logged for paper pulp' }
    ]
  },
  {
    id: 'waste-5',
    name: 'Alkaline AA Battery',
    category: 'HAZARDOUS',
    x: 520,
    y: 520,
    width: 20,
    height: 20,
    icon: '🔋',
    collected: false,
    sorted: false,
    description: 'Corroded battery leaking white potassium hydroxide powder onto the soil verge.',
    ecoFact: 'One single improperly disposed battery can pollute 20,000 liters of soil and groundwater.',
    wrongBinExplanation: 'Batteries contain caustic potassium hydroxide, zinc, and heavy metals. They cause dangerous fires in recycling plants and poison landfills!',
    pollutionChain: [
      { label: 'Dropped by Drain', icon: '🔋', detail: 'Lies in the dirt near the street water run' },
      { label: 'Casing Corrodes', icon: '⚠️', detail: 'Acids and heavy metals leach directly into surrounding topsoil' },
      { label: 'Groundwater Poison', icon: '🚰', detail: 'Toxic runoff seeps into the local aquifer and drinking supply' }
    ]
  },
  {
    id: 'waste-6',
    name: 'Broken Smartphone',
    category: 'E_WASTE',
    x: 1040,
    y: 220,
    width: 22,
    height: 22,
    icon: '📱',
    collected: false,
    sorted: false,
    description: 'Cracked phone with shattered screen forgotten under the park pavilion.',
    ecoFact: 'A smartphone contains precious gold, copper, silver, and rare earths like neodymium that can be reclaimed.',
    wrongBinExplanation: 'Electronics contain toxic flame retardants, lithium-ion battery risks, and valuable circuit metals. They require dedicated E-WASTE handling!',
    pollutionChain: [
      { label: 'Discarded Tech', icon: '📱', detail: 'Forgotten electronic device with lithium battery' },
      { label: 'Punctured Cell', icon: '🔥', detail: 'Lithium battery ruptures when crushed, causing explosive fires' },
      { label: 'Lead & Mercury', icon: '☠️', detail: 'Solders leach lead and mercury into the surrounding ecosystem' }
    ]
  },
  {
    id: 'waste-7',
    name: 'Bleach Detergent Bottle',
    category: 'HAZARDOUS',
    x: 1220,
    y: 610,
    width: 24,
    height: 24,
    icon: '🧴',
    collected: false,
    sorted: false,
    description: 'Plastic container containing pungent bleach chemical residue near the apartment dumpster.',
    ecoFact: 'Bottles with toxic chemical residue cannot go into standard municipal recycling until professionally decontaminated.',
    wrongBinExplanation: 'Containers holding corrosive cleaners, pesticides, or chemicals are HAZARDOUS waste because toxic residues endanger recycling workers.',
    pollutionChain: [
      { label: 'Dumped with Residue', icon: '🧴', detail: 'Leftover chlorine bleach pools in the bottom' },
      { label: 'Chemical Reaction', icon: '🧪', detail: 'Mixes with other chemicals in trash, releasing toxic chlorine gas' },
      { label: 'Worker Exposure', icon: '🚑', detail: 'Sanitation workers risk chemical burns and respiratory damage' }
    ]
  },
  {
    id: 'waste-8',
    name: 'Crushed Soda Can',
    category: 'RECYCLABLE',
    x: 650,
    y: 380,
    width: 22,
    height: 22,
    icon: '🥫',
    collected: false,
    sorted: false,
    description: 'Aluminum can kicked across the crosswalk.',
    ecoFact: 'Recycling aluminum saves 95% of the energy needed to make new aluminum from raw bauxite ore.',
    wrongBinExplanation: 'Aluminum cans are infinitely recyclable! Putting them in trash waste is throwing away 95% saved energy.',
    pollutionChain: [
      { label: 'Kicked to Gutter', icon: '🥫', detail: 'Lies crushed on the street crossing' },
      { label: 'Bauxite Strip Mining', icon: '⛏️', detail: 'Unrecycled aluminum requires destructive open-pit mining elsewhere' },
      { label: 'Massive Carbon', icon: '🏭', detail: 'Virgin aluminum smelting produces massive fossil fuel emissions' }
    ]
  },
  {
    id: 'waste-9',
    name: 'Plastic Grocery Bag',
    category: 'RECYCLABLE',
    x: 740,
    y: 190,
    width: 26,
    height: 26,
    icon: '🛍️',
    collected: false,
    sorted: false,
    description: 'Thin polyethylene bag tangled in the park bush branches.',
    ecoFact: 'Plastic film bags jam municipal sorting sorting gears, so they need dedicated soft-plastic drop-off recycling.',
    wrongBinExplanation: 'Clean plastic bags are recyclable through clean plastic film recycling channels. Keep them out of organic and hazardous waste!',
    pollutionChain: [
      { label: 'Caught in Wind', icon: '🛍️', detail: 'Snags on park bushes and tree canopies' },
      { label: 'Bird Entanglement', icon: '🐦', detail: 'Songbirds and squirrels get limbs or necks trapped in handles' },
      { label: 'Suffocation Risk', icon: '💔', detail: 'Animals mistake shiny plastic fragments for food and choke' }
    ]
  },
  {
    id: 'waste-10',
    name: 'Frayed USB Cable',
    category: 'E_WASTE',
    x: 620,
    y: 690,
    width: 22,
    height: 22,
    icon: '🔌',
    collected: false,
    sorted: false,
    description: 'Cracked charging cable with exposed copper wiring on the curb.',
    ecoFact: 'Copper wire in charging cables has 99.9% electrical purity and is extremely valuable for reclamation.',
    wrongBinExplanation: 'Cords and cables are E-WASTE! If thrown in standard single-stream recycling, they wrap around sorting machinery axles.',
    pollutionChain: [
      { label: 'Tossed on Curb', icon: '🔌', detail: 'Frayed plastic sheath exposing copper' },
      { label: 'Machinery Jammer', icon: '⚙️', detail: 'Tangles in sorting plant rotors, stopping multimillion-dollar plants' },
      { label: 'Open Burning', icon: '🔥', detail: 'Informal cable burning releases carcinogenic dioxins into the atmosphere' }
    ]
  },
  {
    id: 'waste-11',
    name: 'Paper Beverage Carton',
    category: 'RECYCLABLE',
    x: 360,
    y: 460,
    width: 22,
    height: 22,
    icon: '🧃',
    collected: false,
    sorted: false,
    description: 'Tetra-pack juice carton dropped outside the corner grocery store.',
    ecoFact: 'Aseptic juice cartons contain high-grade paper pulp that can be separated and turned into tissue paper.',
    wrongBinExplanation: 'Empty beverage cartons are recyclable paper containers! Place them in RECYCLABLE bins after emptying.',
    pollutionChain: [
      { label: 'Dropped at Entrance', icon: '🧃', detail: 'Spills sticky sugar syrup attracting wasps' },
      { label: 'Street Litter Clutter', icon: '🧹', detail: 'Creates an impression of neglect that encourages more littering' },
      { label: 'Permanent Waste', icon: '🗑️', detail: 'Valuable bleached wood fibers end up incinerated needlessly' }
    ]
  },
  {
    id: 'waste-12',
    name: 'Expired Medicine Blister Pack',
    category: 'HAZARDOUS',
    x: 230,
    y: 600,
    width: 20,
    height: 20,
    icon: '💊',
    collected: false,
    sorted: false,
    description: 'Foil blister pack with remaining antibiotic capsules dropped near the alley wall.',
    ecoFact: 'Pharmaceuticals flushed down sinks or tossed into soil pass through water treatment and cause antibiotic resistance in wild bacteria.',
    wrongBinExplanation: 'Pharmaceuticals are HAZARDOUS medical waste! They must be handed over to dedicated pharmacy return dropboxes.',
    pollutionChain: [
      { label: 'Dropped in Alley', icon: '💊', detail: 'Active antibiotics exposed to rainwater puddles' },
      { label: 'Aquatic Poisoning', icon: '💧', detail: 'Pharmaceutical compounds disrupt endocrine systems in amphibians and fish' },
      { label: 'Superbug Resistance', icon: '🦠', detail: 'Low-dose environmental exposure breeds drug-resistant superbugs' }
    ]
  },
  {
    id: 'waste-13',
    name: 'Coffee Cup with Plastic Lid',
    category: 'RECYCLABLE',
    x: 540,
    y: 330,
    width: 22,
    height: 22,
    icon: '☕',
    collected: false,
    sorted: false,
    description: 'Single-use coffee cup and lid set down on the streetlight base.',
    ecoFact: 'Billions of disposable cups are used once for 10 minutes then discarded. Separate the plastic lid to recycle both components!',
    wrongBinExplanation: 'Clean coffee cups with recyclable plastic lids belong in the RECYCLABLE bin (or cup collection stations).',
    pollutionChain: [
      { label: 'Left on Light Post', icon: '☕', detail: 'Wind knocks it into the street gutter' },
      { label: 'Drain Clog Point', icon: '🚱', detail: 'Lid wedges tightly into the storm drain inlet bars' },
      { label: 'Street Flooding', icon: '🌊', detail: 'Prevents storm runoff from draining, causing flash street floods' }
    ]
  },
  {
    id: 'waste-14',
    name: 'Half-Eaten Apple Core',
    category: 'ORGANIC',
    x: 890,
    y: 430,
    width: 20,
    height: 20,
    icon: '🍏',
    collected: false,
    sorted: false,
    description: 'Brown apple core left on the green grass near the footpath.',
    ecoFact: 'Apple cores biodegrade in 2 to 4 weeks in compost, producing sweet, dark humus for community gardens.',
    wrongBinExplanation: 'Fruit cores and vegetable trimmings are 100% ORGANIC waste. Sort them into the green bin for soil renewal!',
    pollutionChain: [
      { label: 'Left on Footpath', icon: '🍏', detail: 'Turns brown and attracts swarms of fruit flies' },
      { label: 'Mixed Trash Disposal', icon: '🗑️', detail: 'Trapped inside airtight plastic trash bags without air' },
      { label: 'Methane Emissions', icon: '🌍', detail: 'Generates methane, a greenhouse gas 28x more potent than CO2' }
    ]
  }
];

export const INVESTIGATION_SOURCES: ClueSource[] = [
  {
    id: 'source-shop',
    title: 'Single-Use Packaging at Ray\'s Corner Market',
    locationName: 'Ray\'s Corner Market & Snacks',
    npcName: 'Mr. Ray',
    npcRole: 'Shopkeeper',
    x: 270,
    y: 280,
    dialogueInitial: [
      '"Hey there! Thanks for cleaning up outside. Business is busy, but I honestly hate seeing our drink cups blown all over the sidewalk."',
      '"We sell over 400 cold drinks and snack boxes a day. People walk out the door, finish their drink in two minutes, and if they don\'t see a bin within ten steps, they just set it down on the curb."'
    ],
    dialogueInvestigating: [
      '"You\'re right to ask why this happens. Look at our counter: everything is single-use plastic cups and styrofoam takeaway boxes. We don\'t offer reusable tumblers or discounts for bringing your own cup."',
      '"Customers want convenience, and suppliers give me cheap disposable containers. Cleaning up every morning doesn\'t stop the afternoon rush from piling it right back up!"'
    ],
    dialogueWeekLaterThriving:
      '"Look at this place! That Green Reusable Cup program you helped launch was a game changer! Customers pay a small $1 deposit or bring their own mug for a 15% discount. We\'ve cut single-use waste by 85%, and regulars love the customized neighborhood mugs!"',
    dialogueWeekLaterBandAid:
      '"I hired a student to sweep the sidewalk twice a day. It looks decent at noon, but by 6 PM it\'s cluttered again, and the extra sweeping costs are eating into my profits. We\'re running on a treadmill."',
    dialogueWeekLaterRelapsed:
      '"We put up that angry \'No Littering\' poster you suggested... someone tore it down within two days. Cups are piling up again, and neighbors are starting to boycott my store. Sweeping alone never fixed anything."',
    evidenceSummary: 'Corner market distributes over 400 disposable plastic cups daily with zero refill incentives or deposit-return system.',
    investigated: false,
    problemStatement: 'High-volume single-use drink cups and takeout packaging with zero return or reuse incentives.',
    choices: [
      {
        id: 'choice-shop-bandaid',
        text: 'Pay a cleaner to sweep discarded cups twice every day',
        type: 'BAND_AID',
        explanation: 'Keeps the curb clean for a few hours, but cups keep generating endlessly and costs escalate.',
        weekLaterEffect: 'Street requires constant manual cleaning; waste generation volume is unchanged.'
      },
      {
        id: 'choice-shop-systemic',
        text: 'Launch "Green Greenwood" reusable cup program + $1 deposit & 15% discount for bringing tumblers',
        type: 'SYSTEMIC',
        explanation: 'Attacks the problem at the source! Customers adopt reusables, reducing single-use packaging by over 80%.',
        weekLaterEffect: 'Single-use cups practically disappear; customers proudly carry reusable mugs.'
      },
      {
        id: 'choice-shop-neglect',
        text: 'Put up a cardboard sign asking customers to litter somewhere else',
        type: 'NEGLECT',
        explanation: 'Passive signage without alternatives is almost universally ignored by people in a rush.',
        weekLaterEffect: 'Cups accumulate right beneath the sign; customer relations sour.'
      }
    ]
  },
  {
    id: 'source-drain',
    title: 'Unguarded Storm Drain & Water Runoff',
    locationName: 'Clogged Storm Drain Inlet',
    npcName: 'Maya',
    npcRole: 'Environmental Science Student',
    x: 480,
    y: 570,
    dialogueInitial: [
      '"Look at this water. It\'s stagnant, oily, and smells like rotten eggs."',
      '"Every time it rains, street trash washes down this curb right into this drain. The bars are spaced too wide, and there\'s no debris catch basket."'
    ],
    dialogueInvestigating: [
      '"I\'ve been testing water quality for my college lab. This drain connects straight to the Mill Creek river two miles downstream."',
      '"When the drain gets clogged with plastic bottles and leaf litter, water backs up, floods the sidewalk, and leaches battery toxins directly into our local waterways. Unclogging it with a stick only lasts until the next downpour!"'
    ],
    dialogueWeekLaterThriving:
      '"Look into the culvert! Clear, running water! The new heavy-duty curved leaf-and-trash filter basket catches all debris before it enters the channel, and the painted \'Drains to River\' sidewalk stencil reminds everyone that street runoff is our drinking watershed. Even small minnows are back in the creek downstream!"',
    dialogueWeekLaterBandAid:
      '"The city crew came and scooped out the gunk last Tuesday. It was clear for three days, but the storm last night washed fresh cups and twigs right back over the opening. Without a permanent catch filter, it\'s already choking again."',
    dialogueWeekLaterRelapsed:
      '"It completely overflowed during the rain. The whole crosswalk was flooded with greasy brown water, and mosquitoes are breeding in the puddles. People are having to leap over puddles just to reach the crosswalk."',
    evidenceSummary: 'Storm drain lacks debris catch grate; street runoff flushes litter directly into the local river ecosystem while causing street flooding.',
    investigated: false,
    problemStatement: 'Unfiltered storm drain funnels street debris directly into the urban waterway and causes toxic backflow.',
    choices: [
      {
        id: 'choice-drain-bandaid',
        text: 'Manually rake debris away with a pole once a month',
        type: 'BAND_AID',
        explanation: 'Temporarily opens flow, but the next single rainstorm causes an immediate repeat clog.',
        weekLaterEffect: 'Drain chokes again with every rain event; runoff continues to pollute the river.'
      },
      {
        id: 'choice-drain-systemic',
        text: 'Install heavy-duty leaf & debris filter basket + curb recycling bins + "Drains to River" awareness stencil',
        type: 'SYSTEMIC',
        explanation: 'Physically blocks debris from entering waterways, allows easy maintenance, and educates pedestrians.',
        weekLaterEffect: 'Water flows crystal clear; zero plastic escapes to the river; sidewalk stays flood-free.'
      },
      {
        id: 'choice-drain-neglect',
        text: 'Cover the drain opening with a wooden board so trash can\'t fall inside',
        type: 'NEGLECT',
        explanation: 'Blocking the storm drain prevents rainwater from entering, causing severe street flash flooding.',
        weekLaterEffect: 'Catastrophic sidewalk flooding; stagnant mosquito-breeding pools form.'
      }
    ]
  },
  {
    id: 'source-construction',
    title: 'Midnight Fly-Tipping at Renovation Site',
    locationName: 'Apartment Renovation Corner',
    npcName: 'Dan',
    npcRole: 'Construction Supervisor',
    x: 150,
    y: 800,
    dialogueInitial: [
      '"Hey, watch your step around these bricks. We\'re remodeling the ground floor unit, but this trash pile outside our fence wasn\'t from my crew."',
      '"Unlicensed rogue haulers dump old drywall, broken tiles, and toxic paints here in the dead of night because the official waste facility charges $150 per truckload."'
    ],
    dialogueInvestigating: [
      '"Notice how there\'s no street lighting on this corner and no surveillance cameras? It\'s become a known drop point for illegal midnight fly-tipping."',
      '"If we just shovel it away every Monday, other haulers treat this corner as a free dumping ground. You have to remove the incentive and make proper disposal easy!"'
    ],
    dialogueWeekLaterThriving:
      '"That solution was brilliant! The city set up a subsidized monthly bulk construction recycling depot, installed a solar motion-sensor floodlight, and posted official licensed disposal manifests. The illegal dumpers vanished overnight, and we\'re recycling 90% of concrete and metal!"',
    dialogueWeekLaterBandAid:
      '"We hired a private skip to haul the dumped drywall away. Cost us $400 out of pocket. But two nights later, someone dumped four old tires and a broken sink right where the skip was sitting. We can\'t afford to keep paying for other people\'s garbage."',
    dialogueWeekLaterRelapsed:
      '"Someone dumped three barrels of expired industrial solvent and a mountain of busted plaster! It smells awful, and the city inspector slapped a violation notice on our building. It\'s an environmental hazard now."',
    evidenceSummary: 'Unlit street corner without surveillance or accessible commercial bulk recycling invites illegal nighttime fly-tipping.',
    investigated: false,
    problemStatement: 'Unmonitored corner encourages illicit commercial dumping of hazardous construction rubble and e-waste.',
    choices: [
      {
        id: 'choice-const-bandaid',
        text: 'Pay a private hauler to clean up the dumped rubble after each incident',
        type: 'BAND_AID',
        explanation: 'Treats the symptom at high cost while signaling to rogue contractors that someone else will clean up for free.',
        weekLaterEffect: 'Dumping continues unabated; costs mount continuously.'
      },
      {
        id: 'choice-const-systemic',
        text: 'Install solar motion floodlights + neighborhood reporting hotline + municipal bulk construction materials recycling depot',
        type: 'SYSTEMIC',
        explanation: 'Deters midnight dumping with light and accountability, while giving legitimate small builders an affordable recycling outlet.',
        weekLaterEffect: 'Illegal dumping stops completely; corner transforms into a clean, safe pedestrian pathway.'
      },
      {
        id: 'choice-const-neglect',
        text: 'Put up yellow plastic hazard tape and ignore the rubble pile',
        type: 'NEGLECT',
        explanation: 'Plastic tape provides zero physical deterrent and makes the spot look like an abandoned wasteland.',
        weekLaterEffect: 'Massive hazardous rubble pile forms; hazardous solvents leak into the curb.'
      }
    ]
  },
  {
    id: 'source-residential',
    title: 'Single Mixed-Waste Dumpster at Greenwood Court',
    locationName: 'Apartment Complex Dumpster Nook',
    npcName: 'Mrs. Gable',
    npcRole: 'Building Resident Representative',
    x: 1250,
    y: 490,
    dialogueInitial: [
      '"Oh, thank heavens someone is looking at this! Smell that? That\'s two dozen families\' garbage rotting together under the afternoon sun."',
      '"Our landlord only gives us one giant rusted metal dumpster for 48 units. Everything goes into the same bin—vegetable scraps, old batteries, cardboard boxes, bleach bottles."'
    ],
    dialogueInvestigating: [
      '"Most of our neighbors actually want to recycle, but where are we supposed to put anything? There are no separate bins, no labels, no food scrap collection."',
      '"When the dumpster fills up by Thursday, people just pile trash bags on the sidewalk. Stray cats and rats rip them open, and the whole street gets littered again by the weekend!"'
    ],
    dialogueWeekLaterThriving:
      '"You should see our courtyard now! The building installed a beautiful 4-stream color-coded recycling station with clear pictorial signs in three languages, plus a secured odor-free compost tumbler! We divert 75% of our waste, and our community garden is using the rich compost to grow fresh tomatoes and sunflowers!"',
    dialogueWeekLaterBandAid:
      '"The management ordered a second big metal dumpster. It holds more trash, but everything is still mixed together. The stench is twice as bad, and flies are everywhere. We\'re just generating twice as much unseparated landfill."',
    dialogueWeekLaterRelapsed:
      '"The dumpster broke its hinge, trash bags are piled four feet high on the sidewalk, and two neighbors got bitten by rats! People are screaming at each other in the building lobby. It\'s an absolute disaster."',
    evidenceSummary: '48 residential apartments share only one mixed dumpster with zero sorting bins, resulting in overflowing sidewalk trash and lost recyclable value.',
    investigated: false,
    problemStatement: 'Lack of multi-stream sorting bins and composting forces hundreds of residents to dump all waste into a single overflowing dumpster.',
    choices: [
      {
        id: 'choice-res-bandaid',
        text: 'Order a second large dumpster to hold more mixed trash',
        type: 'BAND_AID',
        explanation: 'Accommodates more volume without addressing waste creation, decomposition stench, or total loss of recyclable materials.',
        weekLaterEffect: 'Double the stench and pest problems; 100% of materials still go to open landfills.'
      },
      {
        id: 'choice-res-systemic',
        text: 'Install 4-stream color-coded sorting station + secured odor-free compost tumbler + pictorial multilingual guide for residents',
        type: 'SYSTEMIC',
        explanation: 'Empowers residents to properly segregate waste at home, diverting 75% of waste from landfills and creating rich compost.',
        weekLaterEffect: 'Overflowing trash eliminated; community compost feeds thriving neighborhood flowerbeds.'
      },
      {
        id: 'choice-res-neglect',
        text: 'Send an angry email telling residents they will be fined if the dumpster overflows',
        type: 'NEGLECT',
        explanation: 'Penalizes residents without providing the necessary bins or disposal infrastructure, creating resentment.',
        weekLaterEffect: 'Residents dump trash secretly at night; sidewalk becomes impassable.'
      }
    ]
  }
];

export const SORTING_CATEGORIES = [
  {
    id: 'ORGANIC',
    name: 'Organic & Food',
    color: '#16a34a',
    bg: 'bg-emerald-600',
    border: 'border-emerald-500',
    icon: '🌱',
    examples: 'Leftover food, fruit peels, yard trimmings, greasy napkins'
  },
  {
    id: 'RECYCLABLE',
    name: 'Clean Recyclables',
    color: '#2563eb',
    bg: 'bg-blue-600',
    border: 'border-blue-500',
    icon: '♻️',
    examples: 'Paper, cardboard, clean plastics (PET/HDPE), aluminum & steel cans'
  },
  {
    id: 'HAZARDOUS',
    name: 'Hazardous Waste',
    color: '#dc2626',
    bg: 'bg-red-600',
    border: 'border-red-500',
    icon: '⚠️',
    examples: 'Household batteries, paints, toxic cleaners, expired pharmaceuticals'
  },
  {
    id: 'E_WASTE',
    name: 'Electronic Waste',
    color: '#9333ea',
    bg: 'bg-purple-600',
    border: 'border-purple-500',
    icon: '🔌',
    examples: 'Phones, cables, laptops, chargers, lithium-ion devices'
  }
] as const;
