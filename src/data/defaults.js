export const DEFAULT_COMPANY = {
  name: 'GoRide Tirupati Cabs',
  proprietor: 'N Viswanadham',
  designation: 'Managing Proprietor',
  tagline: 'Safe • Comfortable • On Time',
  ownerContact: '+91 85009 53558',
  email: 'Goridetirupaticab@gmail.com',
  website: 'www.goridetirupatitravels.in',
  address: 'Tirupati, Andhra Pradesh - 517501',
  gstin: '', // No GSTIN
  pan: '',
  upiId: '8500953558@upi',
  termsAndConditions: `1. Tolls, parking, interstate permits, and driver allowance are applicable as per actual journey route.
2. In steep Tirumala Ghat road stretches, vehicle AC may be turned off as per safety & hill transport regulations.
3. Kilometers and time are computed from Tirupati pickup point to final drop.
4. Night driver allowance applies for trips active between 10:00 PM and 06:00 AM.
5. Clean Sanitized AC Cabs • Ghat Road Experienced Drivers • 24/7 Tirupati Doorstep Pickup.`
};

export const CAR_TYPES = [
  {
    id: 'swift-dzire',
    name: 'Swift Dzire (Sedan - 4 + 1 Seater)',
    shortName: 'SWIFT DZIRE',
    category: 'Sedan',
    capacity: '4 + 1 Seater',
    badge: 'Couples & Small Families',
    defaultPerKm: 14,
    defaultHourly: 250,
    highlights: 'Dual AC • Hill Chauffeur • Doorstep Pick',
    description: 'Couples, small families, 1-day tours and station drops',
  },
  {
    id: 'maruti-ertiga',
    name: 'Maruti Ertiga (MUV - 6 + 1 Seater)',
    shortName: 'MARUTI ERTIGA',
    category: 'MUV',
    capacity: '6 + 1 Seater',
    badge: 'POPULAR FOR FAMILIES',
    defaultPerKm: 19,
    defaultHourly: 350,
    highlights: 'Dual AC • Hill Chauffeur • Doorstep Pick',
    description: 'Families, elders, 1-day and 2-day temple circuits',
  },
  {
    id: 'innova-crysta',
    name: 'Innova Crysta (Luxury MPV - 7 + 1 Seater)',
    shortName: 'INNOVA CRYSTA',
    category: 'Luxury MPV',
    capacity: '7 + 1 Seater',
    badge: 'MOST COMFORTABLE',
    defaultPerKm: 23,
    defaultHourly: 450,
    highlights: 'Dual AC • Hill Chauffeur • Doorstep Pick',
    description: 'Arunachalam & long-distance pilgrimage circuits, senior citizens',
  },
  {
    id: 'tempo-traveller',
    name: 'Tempo Traveller (Minibus - 12 to 14 Seater)',
    shortName: 'TEMPO TRAVELLER',
    category: 'Minibus',
    capacity: '12 to 14 Seater',
    badge: 'GROUP TOURS',
    defaultPerKm: 28,
    defaultHourly: 650,
    highlights: 'Dual AC • Hill Chauffeur • Doorstep Pick',
    description: 'Extended pilgrim groups, spiritual sanghams, large family tours',
  },
  {
    id: 'custom-vehicle',
    name: 'Other / Custom Vehicle',
    shortName: 'CUSTOM CAB',
    category: 'Cab',
    capacity: 'Custom',
    badge: 'Custom',
    defaultPerKm: 18,
    defaultHourly: 300,
    highlights: 'AC Cab • Ghat Experienced Driver',
    description: 'Custom vehicle model and tariff',
  },
];

export const SIGHTSEEING_ATTRACTIONS = [
  // Hilltop (8)
  {
    id: 'temple',
    name: 'Sri Venkateswara Temple, Tirumala',
    location: 'Hilltop',
    highlight: 'Ananda Nilayam & Holy Sanctum',
    distance: '22 km from Tirupati',
    hours: '24 Hours (TTD slots)',
    desc: 'World-renowned ancient temple dedicated to Lord Venkateswara atop Venkatadri, 7th hill.',
  },
  {
    id: 'akasaganga',
    name: 'Akasa Ganga',
    location: 'Hilltop',
    highlight: 'Daily Abhishekam Water Source',
    distance: '3 km from Temple',
    hours: '6:00 AM – 6:00 PM',
    desc: 'Holy mountain spring and waterfall used every day for the sacred Abhishekam of the Lord.',
  },
  {
    id: 'papavinasam',
    name: 'Papavinasam',
    location: 'Hilltop',
    highlight: 'Holy Purification Dip & Reservoir',
    distance: '5 km from Main Temple',
    hours: '6:00 AM – 6:00 PM',
    desc: 'Revered holy reservoir and waterfall where pilgrims take a sacred holy dip.',
  },
  {
    id: 'silathoranam',
    name: 'Silathoranam (Natural Arch)',
    location: 'Hilltop',
    highlight: 'National Geological Monument',
    distance: '1 km from Temple',
    hours: '6:00 AM – 6:30 PM',
    desc: 'Rare prehistoric natural rock arch of immense geological and spiritual significance.',
  },
  {
    id: 'srivari-padalu',
    name: 'Srivari Padalu',
    location: 'Hilltop',
    highlight: 'Highest Peak • Holy Lotus Feet',
    distance: 'Narayanagiri Peak',
    hours: '6:00 AM – 6:00 PM',
    desc: 'Highest point of Tirumala marking where Lord Venkateswara first set holy lotus feet.',
  },
  {
    id: 'chakra-theertham',
    name: 'Chakra Theertham',
    location: 'Hilltop',
    highlight: 'Swayambhu Shiva Lingam Shrine',
    distance: 'Near Silathoranam',
    hours: '6:00 AM – 6:00 PM',
    desc: 'Serene sacred water body carved by Lord Vishnu’s Sudarshana Chakra.',
  },
  {
    id: 'deer-park',
    name: 'Tirumala Deer Park',
    location: 'Hilltop',
    highlight: 'Forest Biosphere Reserve',
    distance: 'En route Ghat Road',
    hours: '9:00 AM – 5:00 PM',
    desc: 'Tranquil reserve home to graceful spotted deer amidst mountain biosphere.',
  },
  {
    id: 'ttd-gardens',
    name: 'TTD Sacred Gardens',
    location: 'Hilltop',
    highlight: 'Temple Pooja Flowers Cultivation',
    distance: 'Tirumala Hilltop',
    hours: '6:00 AM – 6:00 PM',
    desc: 'Sprawling ornamental flower gardens cultivating sacred flowers for daily rituals.',
  },

  // Valley (5)
  {
    id: 'padmavathi-ammavari',
    name: 'Sri Padmavathi Ammavari Temple – Tiruchanoor',
    location: 'Valley',
    highlight: 'Padmasarovaram Holy Tank',
    distance: '5 km from Tirupati',
    hours: '5:00 AM – 9:00 PM',
    desc: 'Primary shrine of Goddess Padmavathi Ammavaru, completing Tirumala pilgrimage.',
  },
  {
    id: 'kapila-theertham',
    name: 'Kapila Theertham & Falls',
    location: 'Valley',
    highlight: 'Historic Shiva Shrine at Hill Base',
    distance: 'Foot of Tirumala Hills',
    hours: '5:00 AM – 8:00 PM',
    desc: 'Only historic Shiva temple in Tirupati valley at the base of a mountain waterfall.',
  },
  {
    id: 'govindaraja-swamy',
    name: 'Sri Govindaraja Swamy Temple',
    location: 'Valley',
    highlight: 'Grand 7-Tiered Rajagopuram',
    distance: 'Heart of Tirupati',
    hours: '5:00 AM – 9:00 PM',
    desc: 'Imposing 12th-century Dravidian temple of the elder brother of Lord Venkateswara.',
  },
  {
    id: 'iskcon-temple',
    name: 'ISKCON Temple, Tirupati',
    location: 'Valley',
    highlight: 'Lotus Architecture & Radha Govinda',
    distance: 'Alipiri Road',
    hours: '4:30 AM – 8:30 PM',
    desc: 'Magnificent lotus temple known for spiritual atmosphere and Govinda prasadam.',
  },
  {
    id: 'alipiri-gateway',
    name: 'Alipiri Gateway & Footpath',
    location: 'Valley',
    highlight: 'Traditional Sopana Margam Starting Point',
    distance: 'Alipiri Base',
    hours: 'Open 24/7',
    desc: 'Traditional pedestrian stone steps gateway with giant Garuda statue.',
  },
];

export const OFFICIAL_TRIP_PACKAGES = [
  {
    id: 'complete-sightseeing-13-sights',
    name: 'Complete Tirupati & Tirumala Sightseeing (13 Sights)',
    badge: 'All-in-One Full Day',
    category: 'Local Sightseeing Tours',
    distanceKm: 85,
    hours: 10,
    pickup: 'Tirupati (Hotel / Rly Station / Residence)',
    drop: 'Tirumala Hilltop (8 Sights) + Tirupati Valley (5 Sights)',
    notes: 'Cover all 13 sacred landmarks, holy theerthams & valley temples with private chauffeur waiting.',
    url: 'https://www.goridetirupatitravels.in/packages/complete-tirupati-tirumala-local-sightseeing-tour-1-day',
  },
  {
    id: 'tirumala-hilltop-8-sights',
    name: 'Tirumala Hilltop Circuit (8 Places)',
    badge: 'Hilltop Sights',
    category: 'Local Sightseeing Tours',
    distanceKm: 55,
    hours: 7,
    pickup: 'Tirupati Doorstep Pickup',
    drop: 'Tirumala Temple, Akasa Ganga, Papavinasam, Silathoranam, Srivari Padalu, Chakra Theertham, Deer Park & TTD Gardens',
    notes: 'Dedicated mountain chauffeur exploring all hilltop holy theerthams & viewpoints.',
    url: 'https://www.goridetirupatitravels.in/sightseeing',
  },
  {
    id: 'tirupati-valley-5-temples',
    name: 'Tirupati Valley Circuit (5 Places)',
    badge: 'Valley Temples',
    category: 'Local Sightseeing Tours',
    distanceKm: 45,
    hours: 5,
    pickup: 'Tirupati City / Hotel',
    drop: 'Padmavathi Ammavari, Kapila Theertham, Sri Govindaraja Swamy, ISKCON & Alipiri',
    notes: 'City valley circuit covering 5 sacred temples with private AC cab.',
    url: 'https://www.goridetirupatitravels.in/packages/tirupati-local-5-temple-tour-1-day',
  },
  {
    id: 'tirupati-tirumala-1-day',
    name: 'Tirupati to Tirumala (1 Day)',
    badge: 'Most Popular',
    category: 'Sacred Ghat Transfers',
    distanceKm: 44, // 22 km one way, 44 round trip
    hours: 6,
    pickup: 'Tirupati (Hotel / Rly Station / Residence)',
    drop: 'Tirumala Hill (TTD Cottage / CRO Office / Queue Complex)',
    notes: '24/7 Ghat road mountain taxi with direct pickup and cottage drop.',
    url: 'https://www.goridetirupatitravels.in/packages/tirupati-to-tirumala-1-day',
  },
  {
    id: 'tirupati-airport-taxi',
    name: 'Tirupati Airport (TIR) Taxi Transfers',
    badge: 'Flight Timed',
    category: 'Airport & Station',
    distanceKm: 40,
    hours: 3,
    pickup: 'Tirupati International Airport (TIR - Renigunta)',
    drop: 'Tirumala Hill Cottage / Tirupati City Hotel',
    notes: 'Punctual pickup & direct drops to Tirumala & City with flight tracking.',
    url: 'https://www.goridetirupatitravels.in/services/tirupati-airport-taxi',
  },
  {
    id: 'kanipakam-golden-arunachalam',
    name: 'Kanipakam • Golden Temple • Arunachalam',
    badge: '1 Day Circuit',
    category: 'Pilgrimage Circuits',
    distanceKm: 380,
    hours: 14,
    pickup: 'Tirupati Doorstep Pickup',
    drop: 'Kanipakam Vinayaka, Sripuram Golden Temple & Arunachalam (Tiruvannamalai)',
    notes: 'Covers Kanipakam Vinayaka, Sripuram Golden Temple (Vellore), and Tiruvannamalai.',
    url: 'https://www.goridetirupatitravels.in/packages/kanipakam-golden-temple-arunachalam-1-day',
  },
  {
    id: 'two-days-sacred-pilgrimage',
    name: '2 Days Sacred Pilgrimage Tour',
    badge: '2 Days Tour',
    category: 'Pilgrimage Circuits',
    distanceKm: 540,
    hours: 24,
    pickup: 'Tirupati Doorstep Pickup',
    drop: 'Kanipakam, Arunachalam, Kanchipuram & Tiruttani',
    notes: 'Two days sacred pilgrimage tour covering 4 major kshetrams with night halt.',
    url: 'https://www.goridetirupatitravels.in/packages/two-days-kanipakam-arunachalam-kanchipuram-tiruttani',
  },
  {
    id: 'tirupati-to-srikalahasti',
    name: 'Tirupati to Srikalahasti Cab',
    badge: 'Half Day Special',
    category: 'Pilgrimage Circuits',
    distanceKm: 76,
    hours: 5,
    pickup: 'Tirupati City / Railway Station',
    drop: 'Srikalahasteeswara Temple (Rahu-Ketu Kshetram) & Return',
    notes: 'Special cab service for Rahu-Ketu Sarpa Dosha Nivarana poojas with waiting time.',
    url: 'https://www.goridetirupatitravels.in/packages/tirupati-to-srikalahasti-1-day',
  },
  {
    id: 'tirupati-to-kanchipuram-tiruttani',
    name: 'Tirupati to Kanchipuram & Tiruttani',
    badge: '1 Day Kshetram',
    category: 'Pilgrimage Circuits',
    distanceKm: 240,
    hours: 10,
    pickup: 'Tirupati Doorstep Pickup',
    drop: 'Kanchipuram Kamakshi Amman, Varadharaja Perumal & Tiruttani Murugan Temple',
    notes: 'Full day pilgrimage circuit covering ancient temple town of Kanchi & Tiruttani Arupadai.',
    url: 'https://www.goridetirupatitravels.in/packages/tirupati-to-kanchipuram-1-day',
  },
  {
    id: 'tirupati-outstation-cabs',
    name: 'Tirupati Outstation Cabs & Drops',
    badge: 'Highway Drop',
    category: 'Intercity Highway Drops',
    distanceKm: 150,
    hours: 5,
    pickup: 'Tirupati Doorstep Pickup',
    drop: 'Outstation Destination (Chennai / Bangalore / Vellore / Kanchipuram)',
    notes: 'Direct highway transfers with licensed interstate outstation cabs.',
    url: 'https://www.goridetirupatitravels.in/services/tirupati-outstation-cabs',
  },
  {
    id: 'custom-trip',
    name: 'Custom / Other Route Booking',
    badge: 'Custom',
    category: 'Custom Route',
    distanceKm: 100,
    hours: 8,
    pickup: 'Tirupati',
    drop: 'Custom Destination',
    notes: 'Clean Sanitized AC Cab with Ghat Road Experienced Chauffeur.',
    url: '',
  },
];

export const POPULAR_ROUTES = OFFICIAL_TRIP_PACKAGES.map((p) => p.name);

export function getTodayDateString() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

export function generateInvoiceNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `GRT-${year}${month}-${random}`;
}

export const INITIAL_INVOICE_DATA = {
  invoiceNumber: 'GRT-202610-1842',
  invoiceDate: getTodayDateString(),
  dueDate: getTodayDateString(),

  // Selected Trip package
  tripPackageName: 'Complete Tirupati & Tirumala Sightseeing (13 Sights)',

  // Selected 13 sights
  selectedSights: [
    'Sri Venkateswara Temple, Tirumala',
    'Akasa Ganga',
    'Papavinasam',
    'Silathoranam (Natural Arch)',
    'Srivari Padalu',
    'Chakra Theertham',
    'Sri Padmavathi Ammavari Temple – Tiruchanoor',
    'Kapila Theertham & Falls',
  ],

  // Customer Details
  customerName: 'Suresh Kumar Reddy',
  customerMobile: '+91 85009 53558',
  customerEmail: 'sureshreddy@example.com',
  pickupLocation: 'Tirupati (Hotel / Rly Station / Residence)',
  dropLocation: 'Tirumala Hilltop (8 Sights) + Tirupati Valley (5 Sights)',
  pickupDateTime: '',
  dropDateTime: '',

  // Vehicle details (Innova Crysta at official Rs 23 / km)
  carType: 'Innova Crysta (Luxury MPV - 7 + 1 Seater)',
  vehicleNumber: 'AP 03 BP 4589',
  driverName: 'Ramesh Naidu',
  driverMobile: '+91 94401 55667',

  // Billing calculation
  billingModel: 'both',
  packageBasePrice: 0,
  totalKm: 85, // 85 km for complete sightseeing
  ratePerKm: 23, // Official Rs. 23 / km for Innova Crysta
  hoursUsed: 10,
  hourlyRate: 450,

  // Extra charges
  tollCharges: 150,
  parkingCharges: 100,
  driverAllowance: 400,
  nightHaltCharges: 0,
  otherCharges: 0,
  otherChargesDesc: '',

  // Taxes & Payments (No GSTIN, enableGst is false)
  enableGst: false,
  gstRate: 0,
  discount: 0,
  advancePaid: 1000,
  paymentMode: 'UPI (GPay / PhonePe)',
  paymentStatus: 'Partially Paid',

  specialNotes: 'Complete 13 Sights Private AC Cab • Flexible Waiting for Darshan & Theertham Dips • Hill Road Experienced Chauffeur',
};
