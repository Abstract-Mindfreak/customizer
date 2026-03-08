// modules/price-calculator.js

import { CONFIG, FREE_LOGO_RALS, FREE_SHOCKMOUNT_BODY_RALS, FREE_SHOCKMOUNT_PINS_RALS } from '../config.js';
import { APP_DEBUG } from '../core/state.js';
import { isFreeVariant } from '../config/free-variants.config.js';

// Глобальное хранилище цен из HL-блока CustomizerPrices
let customPricesData = null;

/**
 * Загружает данные о ценах из HL-блока CustomizerPrices
 * @param {Object} pricesData - Данные из window.CUSTOMIZER_DATA.prices
 */
export function loadCustomPrices(pricesData) {
    customPricesData = pricesData;
    if (APP_DEBUG) {
        console.log('[Price Calculator] Loaded custom prices:', customPricesData);
    }
}

/**
 * Получает наценку для варианта с приоритетом поиска
 * Логика поиска:
 * 1. Точный матч: (section, model, variant)
 * 2. Матч по модели: (section, model, *)
 * 3. Глобальный матч: (section, *, *)
 * 4. Если UF_IS_RAL_SURCHARGE=1 и variant.isRal=true → применить цену
 * @param {string} sectionCode - Код раздела (spheres, body, logo, case, shockmount, shockmountPins)
 * @param {string} variantCode - Код варианта (может быть пустым)
 * @param {string} modelCode - Код модели (может быть пустым)
 * @param {boolean} isRal - Является ли вариант RAL цветом
 * @returns {number} - Наценка или 0, если не найдено
 */
export function getSurcharge(sectionCode, variantCode = '', modelCode = '', isRal = false) {
    if (!customPricesData || !customPricesData[sectionCode]) {
        return 0;
    }

    const sectionData = customPricesData[sectionCode];
    
    // 1. Точный матч: (section, model, variant)
    if (modelCode && variantCode && sectionData[modelCode]?.[variantCode]) {
        const price = sectionData[modelCode][variantCode];
        if (APP_DEBUG) {
            console.log(`[Price Calculator] Exact match found: ${sectionCode}/${modelCode}/${variantCode} = ${price}`);
        }
        return price;
    }
    
    // 2. Матч по модели:
    if (modelCode && sectionData[modelCode]?.['']){
        const price = sectionData[modelCode][''];
        if (APP_DEBUG) {
            console.log(`[Price Calculator] Model match found: ${sectionCode}/${modelCode}/* = ${price}`);
        }
        return price;
    }
    
    // 3. Глобальный матч:
    if (sectionData['']?.['']) {
        const price = sectionData[''][''];
        if (APP_DEBUG) {
            console.log(`[Price Calculator] Global match found: ${sectionCode}/*/* = ${price}`);
        }
        return price;
    }
    
    // 4. Если UF_IS_RAL_SURCHARGE=1 и variant.isRal=true → применить цену
    if (isRal && sectionData['_ral_surcharge']) {
        const price = sectionData['_ral_surcharge'];
        if (APP_DEBUG) {
            console.log(`[Price Calculator] RAL surcharge applied: ${sectionCode} = ${price}`);
        }
        return price;
    }
    
    if (APP_DEBUG) {
        console.log(`[Price Calculator] No price found for: ${sectionCode}/${modelCode}/${variantCode} (RAL: ${isRal})`);
    }
    
    return 0;
}

/**
 * Calculates price breakdown for all sections using exclusively HL-data
 * @param {Object} state - Current application state
 * @returns {Object} Price breakdown by section
 */
export function getBreakdown(state) {
    const breakdown = {
        base: state.prices?.base || 0,
        spheres: 0,
        body: 0,
        logo: 0,
        logoBg: 0,
        case: 0,
        shockmount: 0,
        shockmountPins: 0
    };

    const currentModelCode = state.currentModel?.code || '023-the-bomblet';
    const modelCode = currentModelCode.replace('023-', '').replace('017-', '');

    // 1. Spheres
    if (state.spheres?.color) {
        const isRal = state.spheres.variant === 'ral';
        breakdown.spheres = getSurcharge('spheres', state.spheres.color, modelCode, isRal);
    }

    // 2. Body
    if (state.body?.color) {
        const isRal = state.body.variant === 'ral';
        breakdown.body = getSurcharge('body', state.body.color, modelCode, isRal);
    }

    // 3. Logo (Custom logo)
    if (state.logo?.customLogo) {
        breakdown.logo = getSurcharge('logo', 'custom', modelCode, false);
    }

    // 4. LogoBg (RAL background)
    if (state.logobg?.color && !state.logo?.customLogo) {
        const isRal = true; // logobg is always RAL in current logic
        breakdown.logoBg = getSurcharge('logoBg', state.logobg.color, modelCode, isRal);
    }

    // 5. Case (Engraving)
    if (state.case?.laserEngravingEnabled) {
        breakdown.case = getSurcharge('case', 'engraving', modelCode, false);
    }

    // 6. Shockmount
    if (state.shockmount?.enabled) {
        // Base shockmount price for model
        const baseShockmountPrice = state.currentModel?.shockmountPrice || 0;
        
        // Surcharge for color
        const isRal = state.shockmount.variant === 'custom';
        const colorSurcharge = getSurcharge('shockmount', state.shockmount.color || '', modelCode, isRal);
        
        breakdown.shockmount = baseShockmountPrice + colorSurcharge;
        
        // 7. Shockmount Pins
        if (state.shockmountPins?.variant) {
            const isRal = state.shockmountPins.variant.includes('ral') || state.shockmountPins.variant.includes('RAL');
            breakdown.shockmountPins = getSurcharge('shockmountPins', state.shockmountPins.variant, modelCode, isRal);
        }
    }

    return breakdown;
}

/**
 * Calculates total price from breakdown
 * @param {Object} state - Current application state
 * @returns {number} Total price
 */
export function calculateTotal(state) {
    const breakdown = getBreakdown(state);
    return Object.values(breakdown).reduce((sum, price) => sum + price, 0);
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
    if (typeof price !== 'number' || isNaN(price)) {
        return '0₽';
    }
    return price > 0 ? `+${price}₽` : '0₽';
}

/**
 * Gets all available price rules (for debugging)
 * @returns {Object} Price rules object
 */
export function getPriceRules() {
    return PRICE_RULES;
}
