import { CONFIG_MIC_LIBRARY } from './customization-data.js';

// === COMPUTE LAYER ===
function computePrices(config) {
    // Price calculation logic - takes from CONFIG_MIC_LIBRARY
    // All calculations based on real project data
    const micModel = CONFIG_MIC_LIBRARY.micModels[config.microphone];
    if (!micModel) return { base: 0, spheres: 0, body: 0, logo: 0, shockmount: 0, woodcase: 0, total: 0 };

    const basePrice = micModel.basePrice;
    let spheresPrice = 0;
    let bodyPrice = 0;
    let logoPrice = 0;
    let shockmountPrice = 0;
    let woodcasePrice = 0;

    if (config.spheres.color || config.spheres.customRAL) {
        spheresPrice = CONFIG_MIC_LIBRARY.priceRules.extraForPremiumColor;
    }

    if (config.body.color || config.body.customRAL) {
        bodyPrice = CONFIG_MIC_LIBRARY.priceRules.extraForPremiumColor;
    }

    if (config.logo.type === 'custom' || config.logo.customLogo) {
        logoPrice = CONFIG_MIC_LIBRARY.priceRules.extraForSpecialLogo;
    }

    if (config.shockmount.enabled) {
        shockmountPrice = CONFIG_MIC_LIBRARY.priceRules.extraForShockmount;
        if (config.shockmount.pinsColor) {
            shockmountPrice += CONFIG_MIC_LIBRARY.priceRules.extraForPinsColor;
        }
    }

    if (config.woodcase.customLogo) {
        woodcasePrice = CONFIG_MIC_LIBRARY.priceRules.extraForSpecialLogo;
    }

    const total = basePrice + spheresPrice + bodyPrice + logoPrice + shockmountPrice + woodcasePrice;

    return {
        base: basePrice,
        spheres: spheresPrice,
        body: bodyPrice,
        logo: logoPrice,
        shockmount: shockmountPrice,
        woodcase: woodcasePrice,
        total: total
    };
}

export { computePrices };
