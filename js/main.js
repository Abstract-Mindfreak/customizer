import { initEventListeners, updateUI } from './ui-core.js';
import { initPalettes } from './modules/appearance.js';
import { initCaseAndShockmount } from './modules/accessories.js';
import { init as initLogo } from './modules/logo.js';
import { initializeWoodCase } from './modules/wood-case.js';
import { initShockmount } from './modules/shockmount.js';
import { loadSVG } from './engine.js';
import { initValidation } from './services/validation.js';

document.addEventListener('DOMContentLoaded', () => {
    loadSVG();
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
