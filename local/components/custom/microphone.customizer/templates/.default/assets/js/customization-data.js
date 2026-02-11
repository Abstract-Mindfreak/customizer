// Centralized configuration library
const CONFIG_MIC_LIBRARY = {
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
            },
            allowedLogoTypes: {
                free: ['gold', 'silver'],
                paid: ['custom']
            },
            allowedShockmountVariants: {
                free: [],
                paid: ['shockmount_standard']
            },
            allowedShockmountFrameColors: {
                free: ['RAL9003', 'RAL1013', 'RAL9005'],
                paid: ['RAL_K7_STANDARD']
            },
            allowedPinsColors: {
                free: ['RAL9003', 'RAL1013', 'RAL9005', 'brass'],
                paid: ['RAL_K7_STANDARD']
            },
            constraints: []
        },
        '017': {
            id: '017',
            name: 'Soyuz 017 Series',
            basePrice: 249990, // Example real price
            allowedSpheresColors: {
                free: ['1', '2', '3'],
                paid: ['RAL_K7_STANDARD']
            },
            allowedBodyColors: {
                free: ['1', '2', '3'],
                paid: ['RAL_K7_STANDARD']
            },
            allowedLogoTypes: {
                free: ['gold', 'silver'],
                paid: ['custom']
            },
            allowedShockmountVariants: {
                free: ['shockmount_standard'],
                paid: []
            },
            allowedShockmountFrameColors: {
                free: ['RAL9003', 'RAL1013', 'RAL9005'],
                paid: ['RAL_K7_STANDARD']
            },
            allowedPinsColors: {
                free: ['RAL9003', 'RAL1013', 'RAL9005', 'brass'],
                paid: ['RAL_K7_STANDARD']
            },
            constraints: []
        }
    },

    // Color palettes
    colorPalettes: {
        RAL_K7_STANDARD: {
            id: 'RAL_K7_STANDARD',
            description: 'Full RAL K7 palette',
            rule: 'All RAL K7 colors except metallic/fluorescent in some cases',
            pricing: 1500
        }
    },

    // Price rules
    priceRules: {
        extraForPremiumColor: 1500,
        extraForSpecialLogo: 5000,
        extraForShockmount: 10000,
        extraForPinsColor: 1500,
        currency: 'RUB'
    },

    // Special exceptions and cases
    specialCases: {
        '023_MALFA': {
            description: '023 MALFA special edition',
            requirements: {
                logo: 'MALFA_LOGO'
            },
            additionalCost: 0
        }
    }
};

// Base configuration structure (NO invented values)
const DEFAULT_MIC_CONFIG = {
    microphone: '023',        // '023' or '017'
    variant: '023-the-bomblet',
    spheres: {
        variant: '2',
        color: null,
        customRAL: null
    },
    body: {
        variant: '2',
        color: null,
        customRAL: null
    },
    logo: {
        type: 'silver',
        bgColor: '3001',
        customLogo: null
    },
    shockmount: {
        enabled: false,
        variant: 'standard',
        color: 'RAL9003',
        pins: 'RAL9003',
        pinsColor: null
    },
    woodcase: {
        variant: 'standard',
        customLogo: null,
        dimensions: {
            width: null,
            height: null,
            depth: null
        }
    }
};

export { CONFIG_MIC_LIBRARY, DEFAULT_MIC_CONFIG };
