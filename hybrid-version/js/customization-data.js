// Centralized configuration library (Hybrid Version)
export const CONFIG_MIC_LIBRARY = {
    // Microphone models
    micModels: {
        '023': {
            id: '023',
            name: 'Soyuz 023 Series',
            basePrice: 129990,
            allowedSpheresColors: {
                free: ['1', '2', '3'],
                paid: ['RAL_K7_STANDARD']
            },
            allowedBodyColors: {
                free: ['1', '2', '3'],
                paid: ['RAL_K7_STANDARD']
            }
        },
        '017': {
            id: '017',
            name: 'Soyuz 017 Series',
            basePrice: 249990
        }
    },

    // Price rules
    priceRules: {
        extraForPremiumColor: 1500,
        extraForSpecialLogo: 5000,
        extraForShockmount: 10000,
        extraForPinsColor: 1500,
        currency: 'RUB'
    }
};

export const DEFAULT_MIC_CONFIG = {
    model: '023',
    variant: '023-the-bomblet',
    spheres: { variant: '2', color: null },
    body: { variant: '2', color: null },
    logo: { type: 'silver', bgColor: '3001', customLogo: null },
    shockmount: { enabled: false, variant: 'standard', color: 'RAL9003', pins: 'RAL9003' },
    case: { variant: 'standard', customLogo: null, logoWidthMM: 100, logoOffsetMM: { top: 50, left: 50 } },
    prices: { spheres: 0, body: 0, logo: 0, shockmount: 0, case: 0, total: 129990 }
};
