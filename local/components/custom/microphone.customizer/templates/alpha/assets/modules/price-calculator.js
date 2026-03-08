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
 * Единое хранилище цен
 */
export const PRICE_CONFIG = {
    base: {
        '023-the-bomblet': 129990,
        '023-malfa': 149990,
        '023-deluxe': 159990,
        '017-fet': 229990,
        '017-tube': 419990
    },
    options: {
        spheresRal: 3000,      // платный RAL для силуэта
        bodyRal: 3000,         // платный RAL для корпуса
        logoBackgroundRal: 2000,   // платный RAL фона логотипа
        customLogo: 3000,          // собственная эмблема (logo-mode-toggle)
        caseEngraving: 3000,       // собственная гравировка футляра
        shockmountBase: 10000,     // базовая цена подвеса для 023-the-bomblet
        shockmountFrameRal: 3000,  // платный цвет каркаса подвеса
        shockmountPinsRal: 2000    // платный цвет пинов подвеса
    }
};

/**
 * Price calculation rules for different sections
 */
const PRICE_RULES = {
    base: (state) => {
        const currentVariant = state.currentVariant || '023-the-bomblet';
        return PRICE_CONFIG.base[currentVariant] || 0;
    },
    
    spheres: (state) => {
        if (!state.spheres?.color) return 0;
        return isFreeVariant('spheres', state.spheres.color) ? 0 : PRICE_CONFIG.options.spheresRal;
    },
    
    body: (state) => {
        if (!state.body?.color) return 0;
        return isFreeVariant('body', state.body.color) ? 0 : PRICE_CONFIG.options.bodyRal;
    },
    
    logo: (state) => {
        // Приоритет: custom logo > RAL фон
        if (state.logo?.useCustom) {
            return PRICE_CONFIG.options.customLogo;
        }
        if (state.logobg?.color && !isFreeVariant('logobg', state.logobg.color)) {
            return PRICE_CONFIG.options.logoBackgroundRal;
        }
        return 0;
    },
    
    logobg: (state) => {
        // logobg не учитывается в цене, т.к. учитывается в правиле logo
        return 0;
    },
    
    shockmount: (state) => {
        const currentVariant = state.currentVariant || state.variant || '023-the-bomblet';
        
        // Для 023-the-bomblet подвес платный только если включен toggle
        if (currentVariant === '023-the-bomblet') {
            if (!state.shockmount?.enabled) return 0;
            let price = PRICE_CONFIG.options.shockmountBase;
            
            // Добавляем цену за платный цвет каркаса
            if (state.shockmount?.color && !isFreeVariant('shockmount', state.shockmount.color)) {
                price += PRICE_CONFIG.options.shockmountFrameRal;
            }
            
            // Добавляем цену за платный цвет пинов
            if (state.shockmountPins?.color && !isFreeVariant('pins', state.shockmountPins.color)) {
                price += PRICE_CONFIG.options.shockmountPinsRal;
            }
            
            return price;
        }
        
        // Для остальных вариантов подвес включен в базовую цену, но платные цвета добавляются
        let price = 0;
        if (state.shockmount?.color && !isFreeVariant('shockmount', state.shockmount.color)) {
            price += PRICE_CONFIG.options.shockmountFrameRal;
        }
        if (state.shockmountPins?.color && !isFreeVariant('pins', state.shockmountPins.color)) {
            price += PRICE_CONFIG.options.shockmountPinsRal;
        }
        
        return price;
    },
    
    shockmountPins: (state) => {
        // Эта функция больше не нужна, т.к. цена пинов включена в shockmount
        return 0;
    },
    
    case: (state) => {
        return state.case?.laserEngravingEnabled ? PRICE_CONFIG.options.caseEngraving : 0;
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
    
    // Добавляем наценки из CustomizerPrices HL-блока
    const currentModel = state.variant || '023-the-bomblet';
    const modelCode = currentModel.replace('023-', '').replace('017-', '');
    
    // spheres
    if (state.spheres?.color) {
        const isRal = state.spheres.color.includes('RAL');
        const spheresSurcharge = getSurcharge('spheres', state.spheres.color, modelCode, isRal);
        breakdown.spheres = spheresSurcharge;
    }
    
    // body
    if (state.body?.color) {
        const isRal = state.body.color.includes('RAL');
        const bodySurcharge = getSurcharge('body', state.body.color, modelCode, isRal);
        breakdown.body = bodySurcharge;
    }
    
    // logo
    if (state.logo?.customLogo) {
        const logoSurcharge = getSurcharge('logo', 'custom', modelCode, false);
        breakdown.logo = logoSurcharge;
    }
    
    // case
    if (state.case?.laserEngravingEnabled) {
        const caseSurcharge = getSurcharge('case', 'engraving', modelCode, false);
        breakdown.case = caseSurcharge;
    }
    
    // shockmount
    if (state.shockmount?.enabled) {
        const shockmountSurcharge = getSurcharge('shockmount', '', modelCode, false);
        breakdown.shockmount = shockmountSurcharge;
    }
    
    // shockmountPins
    if (state.shockmountPins?.variant) {
        const isRal = state.shockmountPins.variant.includes('RAL');
        const pinsSurcharge = getSurcharge('shockmountPins', state.shockmountPins.variant, modelCode, isRal);
        breakdown.shockmountPins = pinsSurcharge;
    }
    
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
