import { CONFIG_MIC_LIBRARY } from './customization-data.js';

/**
 * Calculates prices based on current configuration
 * @param {Object} state - The currentState object
 * @returns {Object} Updated prices object
 */
export function computePrices(state) {
    const micId = state.model || '023';
    const micModel = CONFIG_MIC_LIBRARY.micModels[micId] || CONFIG_MIC_LIBRARY.micModels['023'];
    const rules = CONFIG_MIC_LIBRARY.priceRules;

    let spheresPrice = state.spheres.color ? rules.extraForPremiumColor : 0;
    let bodyPrice = state.body.color ? rules.extraForPremiumColor : 0;
    let logoPrice = state.logo.customLogo ? rules.extraForSpecialLogo : 0;

    // Check if shockmount is an extra option for this model
    let shockmountPrice = 0;
    if (state.shockmount.enabled) {
        // In 023 series it's usually paid, in 017 deluxe/tube it's included
        if (micId === '023' && state.variant !== '023-dlx') {
            shockmountPrice = rules.extraForShockmount;
        }
    }

    // Woodcase custom logo
    let casePrice = state.case.customLogo ? rules.extraForSpecialLogo : 0;

    const total = micModel.basePrice + spheresPrice + bodyPrice + logoPrice + shockmountPrice + casePrice;

    return {
        spheres: spheresPrice,
        body: bodyPrice,
        logo: logoPrice,
        shockmount: shockmountPrice,
        case: casePrice,
        total: total
    };
}
