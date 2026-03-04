// modules/price-calculator.js

import { CONFIG, FREE_LOGO_RALS, FREE_SHOCKMOUNT_BODY_RALS, FREE_SHOCKMOUNT_PINS_RALS } from '../config.js';
import { APP_DEBUG } from '../core/state.js';
import { isFreeVariant } from '../config/free-variants.config.js';

/**
 * Price calculation rules for different sections
 */
const PRICE_RULES = {
    base: () => CONFIG.basePrice,
    
    spheres: (state) => {
        if (!state.spheres?.color) return 0;
        return isFreeVariant('spheres', state.spheres.color) ? 0 : CONFIG.optionPrice;
    },
    
    body: (state) => {
        if (!state.body?.color) return 0;
        return isFreeVariant('body', state.body.color) ? 0 : CONFIG.optionPrice;
    },
    
    logo: (state) => {
        return state.logo.useCustom ? 2000 : 0; // Цена из задачи 3
    },
    
    logobg: (state) => {
        if (!state.logobg?.color) return 0;
        return isFreeVariant('logobg', state.logobg.color) ? 0 : CONFIG.optionPrice;
    },
    
    shockmount: (state) => {
        if (!state.shockmount.enabled) return 0;
        return CONFIG.shockmountPrice; // Фиксированная цена 10000₽ для подвеса
    },
    
    shockmountPins: (state) => {
        if (!state.shockmount.enabled) return 0;
        if (!state.shockmountPins.color) return 0;
        return isFreeVariant('shockmountPins', state.shockmountPins.color) ? 0 : CONFIG.optionPrice;
    },
    
    case: (state) => {
        return state.case.laserEngravingEnabled ? 2500 : 0; // Цена из задачи 4
    }
};

/**
 * Calculates price breakdown for all sections
 * @param {Object} state - Current application state
 * @returns {Object} Price breakdown by section
 */
export function getBreakdown(state) {
    const breakdown = {};
    
    Object.entries(PRICE_RULES).forEach(([section, calculator]) => {
        try {
            breakdown[section] = calculator(state);
        } catch (error) {
            console.error(`[Price Calculator] Error calculating price for ${section}:`, error);
            breakdown[section] = 0;
        }
    });
    
    return breakdown;
}

/**
 * Calculates total price from breakdown
 * @param {Object} state - Current application state
 * @returns {number} Total price
 */
export function calculateTotal(state) {
    const breakdown = getBreakdown(state);
    const total = Object.values(breakdown).reduce((sum, price) => sum + price, 0);
    
    return total;
}

/**
 * Updates prices in state based on current configuration
 * @param {Object} state - Current application state
 * @returns {Object} Updated prices object
 */
export function updatePrices(state) {
    const breakdown = getBreakdown(state);
    return {
        ...state.prices,
        ...breakdown
    };
}

/**
 * Checks if a color is free for a specific section
 * @param {string} section - Section name (body, shockmount, pins, logobg)
 * @param {string} color - Color name or RAL code
 * @returns {boolean} True if color is free
 */
export function isFreeColor(section, color) {
    switch (section) {
        case 'body':
            return false; // Body has no free colors
        case 'shockmount':
            return FREE_SHOCKMOUNT_BODY_RALS.includes(color.replace('RAL ', ''));
        case 'pins':
            return FREE_SHOCKMOUNT_PINS_RALS.includes(color.replace('RAL ', ''));
        case 'logobg':
            return FREE_LOGO_RALS.includes(color);
        default:
            return false;
    }
}

/**
 * Gets price for a specific section
 * @param {string} section - Section name
 * @param {Object} state - Current application state
 * @returns {number} Section price
 */
export function getSectionPrice(section, state) {
    const calculator = PRICE_RULES[section];
    return calculator ? calculator(state) : 0;
}

/**
 * Formats price for display
 * @param {number} price - Price value
 * @returns {string} Formatted price string
 */
export function formatPrice(price) {
    return `+${price}₽`;
}

/**
 * Gets all available price rules (for debugging)
 * @returns {Object} Price rules object
 */
export function getPriceRules() {
    return PRICE_RULES;
}
