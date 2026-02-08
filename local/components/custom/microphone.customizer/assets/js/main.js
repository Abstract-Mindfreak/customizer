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

document.addEventListener('DOMContentLoaded', async () => {
    // Preload essential images
    const device = getDevice(CASE_GEOMETRY.res);
    const imagesToPreload = Object.values(CASE_IMAGES).map(imgSet => imgSet[device]);
    preloadImages(imagesToPreload);

    await loadSVG();
    initPalettes();
    initEventListeners();
    initCaseAndShockmount();
    initValidation();
    initLogo();
    initializeWoodCase();
    initShockmount();

    // All inline event handlers have been replaced.
    // The window object is no longer needed.

    // Initial UI update
    updateUI();

    // Initial animation
    setTimeout(() => {
        document.querySelectorAll('.menu-item').forEach((item, i) => {
            setTimeout(() => item.classList.add('animate-in'), i * 100);
        });
    }, 300);
});
