import { initEventListeners, updateUI } from './ui-core.js';
import { initPalettes } from './modules/appearance.js';
import { initCaseAndShockmount } from './modules/accessories.js';
import { init as initLogo } from './modules/logo.js';
import { initializeWoodCase } from './modules/wood-case.js';
import { initShockmount } from './modules/shockmount.js';
import { loadSVG } from './engine.js';
import { initValidation } from './services/validation.js';
import { preloadImages, getDevice } from './utils.js';
import { CASE_IMAGES, CASE_GEOMETRY } from './config.js';
import { currentState, setInitialConfig } from './state.js';

/**
 * Hybrid Version Entry Point
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Customizer Hybrid Version Initializing...');

    const appRoot = document.getElementById('customizer-app-root');

    // Auth data handling if in Bitrix context
    if (window.BX_USER_DATA && window.BX_USER_DATA.AUTHORIZED) {
        const userData = window.BX_USER_DATA;
        const fields = {
            'input-name': userData.NAME,
            'input-email': userData.EMAIL,
            'input-phone': userData.PERSONAL_PHONE || userData.PHONE
        };
        for (let [id, val] of Object.entries(fields)) {
            const el = document.getElementById(id);
            if (el && val) el.value = val;
        }
    }

    // Preload assets
    const device = getDevice(CASE_GEOMETRY.res);
    const imagesToPreload = Object.values(CASE_IMAGES).map(imgSet => imgSet[device]);
    preloadImages(imagesToPreload);

    // Initializations
    await loadSVG();
    initPalettes();
    initEventListeners();
    initCaseAndShockmount();
    initValidation();
    initLogo();
    initializeWoodCase();
    initShockmount();

    setInitialConfig(currentState);
    updateUI();

    console.log('✅ Customizer Hybrid Version Ready.');
});
