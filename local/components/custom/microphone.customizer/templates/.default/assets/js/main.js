import { initEventListeners } from './ui-core.js';
import { initPalettes } from './modules/appearance.js';
import { init as initLogo, toggleCustomLogo } from './modules/logo.js';
import { initCaseAndShockmount } from './modules/accessories.js';
import { initShockmount } from './modules/shockmount.js';
import { loadSVG } from './engine.js';
import { initValidation } from './services/validation.js';
import { stateManager } from './core/state.js';
import { render } from './core/render.js';
import * as cameraEffect from './modules/camera-effect.js';
import { startSessionRefresh } from './utils/bitrix.js';
import { toggleLaserEngraving, initializeWoodCase } from './modules/wood-case.js';

document.addEventListener('DOMContentLoaded', async () => {
    const appRoot = document.getElementById('customizer-app-root');
    if (!appRoot) {
        console.log('Customizer app root not found, customizer will not load.');
        return;
    }

    // Store initial backend data in state
    stateManager.set('ajaxPath', appRoot.dataset.ajaxPath);
    stateManager.set('sessid', appRoot.dataset.sessid);
    
    const elementId = parseInt(appRoot.dataset.elementId) || 0;
    
    // Subscribe the main render function to all state changes
    stateManager.subscribe(render);

    if (window.BX_USER_DATA && window.BX_USER_DATA.AUTHORIZED) {
        // Handle user data if needed
    }
    
    if (elementId > 0) {
        // Handle config loading if needed
    } else {
        stateManager.setInitialConfig(stateManager.get());
    }

    await loadSVG();
    console.log('SVG загружен');

    cameraEffect.initCameraEffect(stateManager.get('variant'));
    console.log('Camera effect initialized');

    initPalettes();
    initEventListeners();
    initCaseAndShockmount();
    initValidation();
    initLogo();
    initializeWoodCase();
    initShockmount();
    initToggles();
    
    render(); // Initial UI render based on state

    // Start session refresh mechanism
    startSessionRefresh();

    const startScreen = document.getElementById('start-screen');
    const ctaButton = document.querySelector('.start-screen-hero-cta');
    if (ctaButton && startScreen) {
        ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            startScreen.classList.add('hidden');
        });
    }
});

// Initialize toggle functionality
function initToggles() {
    // Initialize custom logo toggle
    const customLogoToggle = document.querySelector('[data-action="toggle-custom-logo"]');
    if (customLogoToggle) {
        customLogoToggle.addEventListener('click', toggleCustomLogo);
    }
    
    // Initialize laser engraving toggle
    const laserToggle = document.querySelector('[data-action="toggle-laser-engraving"]');
    if (laserToggle) {
        laserToggle.addEventListener('click', toggleLaserEngraving);
    }
    
    // Initialize toggle states based on current state
    const currentState = stateManager.get();
    
    // Set custom logo toggle state and UI
    const isCustomLogoEnabled = currentState.logo?.customLogo || false;
    if (customLogoToggle) {
        customLogoToggle.classList.toggle('active', isCustomLogoEnabled);
        customLogoToggle.setAttribute('aria-pressed', isCustomLogoEnabled);
    }
    
    // Update custom logo price display
    const customLogoPrice = document.getElementById('custom-logo-price');
    const logoPrice = isCustomLogoEnabled ? 1500 : 0;
    if (customLogoPrice) {
        customLogoPrice.textContent = logoPrice > 0 ? `+${logoPrice}₽` : '+0₽';
    }
    
    // Set initial visibility for logo sections
    const logoSection = document.querySelector('[data-section="logo"]');
    const logobgSection = document.querySelector('[data-section="logobg"]');
    const customLogoSection = document.querySelector('.toggle-logo-section');
    
    if (isCustomLogoEnabled) {
        if (logoSection) logoSection.style.display = 'none';
        if (logobgSection) logobgSection.style.display = 'none';
        if (customLogoSection) customLogoSection.style.display = 'block';
    } else {
        if (logoSection) logoSection.style.display = '';
        if (logobgSection) logobgSection.style.display = '';
        if (customLogoSection) customLogoSection.style.display = 'none';
    }
    
    // Set laser engraving toggle state and UI
    const isLaserEnabled = currentState.case?.laserEngraving || false;
    if (laserToggle) {
        laserToggle.classList.toggle('active', isLaserEnabled);
        laserToggle.setAttribute('aria-pressed', isLaserEnabled);
    }
    
    // Set initial visibility for case upload sections
    const uploadSections = document.querySelectorAll('#submenu-case .submenu-section');
    const laserDataSection = document.querySelector('.toggle-laser-engraving-data');
    
    if (isLaserEnabled) {
        uploadSections.forEach(section => {
            if (!section.closest('.toggle-laser-engraving-data')) {
                section.style.display = 'block';
            }
        });
        if (laserDataSection) laserDataSection.style.display = 'block';
    } else {
        uploadSections.forEach(section => {
            if (!section.closest('.toggle-laser-engraving-data')) {
                section.style.display = 'none';
            }
        });
        if (laserDataSection) laserDataSection.style.display = 'none';
    }
}
