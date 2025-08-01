import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.js';

// Restaurant data for "Rafa street eats"
const restaurantData = {
  address: "Libertador 2000",
  betaFunctionalities: {
    allowDevices: true,
    tableServiceCreation: true
  },
  city: "Buenos Aires",
  codes: ["JC1SCH"],
  countryCode: "AR",
  coverPic: "https://storage.googleapis.com/download/storage/v1/b/cactus-sandbox-12b54.appspot.com/o/images%2Fshops%2FLRQqwi73l8YvUI2wlrGg%2Fnormalized_LRQqwi73l8YvUI2wlrGg_1731010144374?generation=1731010156817418&alt=media",
  coverPicAura: "UklGRlYAAABXRUJQVlA4IEoAAACwAQCdASoGAAYAAUAmJQBYdh6PTlKAAP5A2wgXPYTCLrnv/7EqnrHcl5vY7/bzz4LOoP01pzHhG4db879xXxe8sKXxut2W8/uAAA==",
  coverPicThumb: "https://storage.googleapis.com/download/storage/v1/b/cactus-sandbox-12b54.appspot.com/o/images%2Fshops%2FLRQqwi73l8YvUI2wlrGg%2Fthumb_LRQqwi73l8YvUI2wlrGg_1731010144374?generation=1731010156743902&alt=media",
  currency: "ARS",
  customClosedMessage: null,
  customerCatalogStyle: "grid",
  delivery: {
    applyDiscounts: false,
    applyFees: false,
    autoConfirmPaidOrders: false,
    availableProcessors: ["MercadoPago", "Test Processor", "ExternalPayment"],
    deliveryFee: false,
    deliveryFeeInCents: 0,
    deliveryRangeInMeters: 0,
    deliveryTiers: [
      {
        deliveryFeeInCents: 20000,
        deliveryRangeInMeters: 10000
      }
    ],
    discounts: [],
    fees: [],
    isActive: true,
    scheduleOverride: false,
    timeRangesMap: {},
    trackStaffOrders: false,
    workflow: {
      generalTracking: true,
      requireConfirmation: true,
      trackDelivery: true
    }
  },
  deliveryOrdering: false,
  deliveryRangeInMeters: null,
  dept: null,
  description: "",
  externalChannels: [],
  externalPaymentEnabled: true,
  geolocation: {
    latitude: -34.5823363,
    longitude: -58.4001482
  },
  hasAutomaticShifts: false,
  hasCustomClosedMessage: false,
  hasOpenShift: true,
  integrations: {
    whatsapp: null,
    invoicing: null
  },
  isDemo: true,
  isFeatured: true,
  lastOrder: 437,
  lastShiftNumber: 125,
  name: "Rafa street eats",
  onSite: {
    applyDiscounts: false,
    applyFees: false,
    autoConfirmPaidOrders: true,
    availableProcessors: ["cash", "creditCard", "debitCard", "MercadoPago", "Test Processor"],
    discounts: [],
    fees: [],
    isActive: true,
    onsiteOrdering: true,
    scheduleOverride: false,
    tableQuantity: 99,
    tableService: true,
    tables: null,
    timeRangesMap: {},
    trackStaffOrders: true,
    workflow: {
      generalTracking: true,
      requireConfirmation: true,
      trackDelivery: true
    }
  },
  onsiteOrdering: true,
  openForBusiness: true,
  paymentMethods: [
    {
      autoInvoice: "manual",
      isActive: true,
      isCustom: false,
      isForExternalChannel: false,
      isIntegrated: false,
      label: "cash",
      medium: "cash",
      name: "cash"
    },
    {
      autoInvoice: "manual",
      cards: ["amex", "visa", "mastercard", "na"],
      isActive: true,
      isForExternalChannel: false,
      isIntegrated: false,
      label: "creditCard",
      medium: "pos",
      name: "creditCard"
    },
    {
      autoInvoice: "manual",
      cards: ["visaDebit", "maestro"],
      isActive: true,
      isForExternalChannel: false,
      isIntegrated: false,
      label: "debitCard",
      medium: "pos",
      name: "debitCard"
    },
    {
      autoInvoice: "manual",
      isActive: true,
      isCustom: false,
      isForExternalChannel: false,
      isIntegrated: false,
      label: "Mercado Pago",
      medium: "mercadoPagoQR",
      name: "Mercado Pago"
    },
    {
      autoInvoice: "manual",
      isActive: false,
      isCustom: false,
      isForExternalChannel: false,
      isIntegrated: true,
      label: "MercadoPago",
      medium: "mercadoPago",
      name: "MercadoPago"
    },
    {
      autoInvoice: "manual",
      isActive: true,
      isCustom: false,
      isForExternalChannel: false,
      isIntegrated: true,
      label: "Test Processor",
      medium: "test",
      name: "Test Processor"
    }
  ],
  productModelV2: true,
  profilePic: "https://storage.googleapis.com/download/storage/v1/b/cactus-sandbox-12b54.appspot.com/o/images%2Fshops%2FLRQqwi73l8YvUI2wlrGg%2Fnormalized_LRQqwi73l8YvUI2wlrGg_1731017775387?generation=1731017782578563&alt=media",
  profilePicAura: "UklGRmAAAABXRUJQVlA4IFQAAAAwAgCdASoGAAYAAUAmJbACdLoB+AAC0eMWsAD4RbcCFruQGQyFLvCfGQJvoQP/loRLZaWvEcR8nEQweMv/2hAn7pv5XB9vP04kn1B9r/+pv/tGAAA=",
  profilePicThumb: "https://storage.googleapis.com/download/storage/v1/b/cactus-sandbox-12b54.appspot.com/o/images%2Fshops%2FLRQqwi73l8YvUI2wlrGg%2Fthumb_LRQqwi73l8YvUI2wlrGg_1731017775387?generation=1731017782652587&alt=media",
  promoCode: "FAUX.CACTUS",
  published: true,
  qrCodeUrl: "https://storage.googleapis.com/download/storage/v1/b/cactus-sandbox-12b54.appspot.com/o/shops%2FLRQqwi73l8YvUI2wlrGg%2Fqr-code-rafas-street-eats.svg?generation=1684074124505139&alt=media",
  qrFilesCreated: true,
  qrStickerEpsUrl: "https://storage.googleapis.com/download/storage/v1/b/cactus-sandbox-12b54.appspot.com/o/shops%2FLRQqwi73l8YvUI2wlrGg%2Fqr-sticker-rafas-street-eats.eps?generation=1684074128904226&alt=media",
  qrStickerSvgUrl: "https://storage.googleapis.com/download/storage/v1/b/cactus-sandbox-12b54.appspot.com/o/shops%2FLRQqwi73l8YvUI2wlrGg%2Fqr-sticker-rafas-street-eats.svg?generation=1684074125599065&alt=media",
  registrationTime: new Date("2023-05-14T14:21:56.000Z"),
  requiresTableNumber: true,
  securityPreferences: {
    onlyAllowedDevices: false
  },
  shiftConfiguration: {
    automaticShiftsEnabled: false,
    reconciliationConfigurationEnabled: true
  },
  shopCode: "rafas-street-eats",
  shopDiscounts: [
    {
      discountAmount: 0,
      discountName: null,
      discountType: "orderingChannel",
      isActive: false,
      isPercentage: true,
      orderingChannels: ["delivery"],
      paymentMethod: null
    },
    {
      discountAmount: 0,
      discountName: null,
      discountType: "orderingChannel",
      isActive: false,
      isPercentage: true,
      orderingChannels: ["onsite"],
      paymentMethod: null
    },
    {
      discountAmount: 0,
      discountName: null,
      discountType: "orderingChannel",
      isActive: false,
      isPercentage: true,
      orderingChannels: ["delivery"],
      paymentMethod: null
    }
  ],
  stock: {
    autoUpdateOutOfStock: false,
    isActive: true
  },
  subscriptionLevel: "pro",
  takeaway: {
    applyDiscounts: false,
    applyFees: false,
    autoConfirmPaidOrders: false,
    availableProcessors: ["Test Processor", "ExternalPayment"],
    discounts: [],
    fees: [],
    isActive: true,
    scheduleOverride: false,
    timeRangesMap: {},
    trackStaffOrders: false,
    workflow: {
      generalTracking: true,
      requireConfirmation: true,
      trackDelivery: true
    }
  },
  takeawayOrdering: false,
  ticketSettings: {
    summaryTicketFooter: ""
  },
  timeRangesMap: {
    1: [{ from: 240, to: 1410 }],
    2: [{ from: 240, to: 1410 }],
    3: [{ from: 240, to: 1410 }],
    4: [{ from: 240, to: 1410 }],
    5: [{ from: 240, to: 1410 }],
    6: [{ from: 240, to: 1410 }],
    7: [{ from: 240, to: 1410 }]
  },
  timezone: "America/Argentina/Buenos_Aires",
  type: "FastFood",
  vibe: "Dark",
  zipCode: "C1425",
  // Additional fields for the gastro-community platform
  ownerId: "test-owner-rafa", // This should be set to actual owner ID when seeding
  location: "Libertador 2000, Buenos Aires, Argentina",
  contactInfo: "Contact via app",
  rating: 4.5,
  reviewCount: 127
};

// Function to seed the restaurant data
export async function seedRestaurantData(ownerId = null) {
  console.log('🏪 Seeding restaurant data for Rafa street eats...');
  
  try {
    const restaurantToSeed = {
      ...restaurantData,
      ownerId: ownerId || 'test-owner-rafa',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'shops'), restaurantToSeed);
    
    console.log(`✅ Restaurant created successfully with ID: ${docRef.id}`);
    console.log(`📍 Restaurant: ${restaurantData.name}`);
    console.log(`🏠 Address: ${restaurantData.address}, ${restaurantData.city}`);
    console.log(`📱 Shop Code: ${restaurantData.shopCode}`);
    console.log(`✅ Published: ${restaurantData.published}`);
    
    return docRef.id;
  } catch (error) {
    console.error('❌ Error seeding restaurant data:', error);
    throw error;
  }
}

// Make it available globally for console execution
if (typeof window !== 'undefined') {
  window.seedRestaurantData = seedRestaurantData;
  console.log('💡 To seed restaurant data, use: window.seedRestaurantData()');
}
