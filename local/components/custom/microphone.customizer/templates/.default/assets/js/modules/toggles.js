// ============================================
// TOGGLE FUNCTIONS
// ============================================

import { stateManager } from '../core/state.js';
import { uploadCustomLogo } from './logo.js';

/**
 * Toggle Logo Mode
 * Управляет переключением между стандартной эмблемой и кастомным логотипом
 */
export function toggleLogoMode() {
    const checkbox = document.getElementById('logo-mode-toggle');
    const logoSection = document.getElementById('logo-section');
    const logobgSection = document.querySelector('[data-section="logobg"]');
    const customLogoSection = document.querySelector('.toggle-logo-section');
    const uploadArea = document.getElementById('custom-logo-upload-area');
    const logoOverlay = document.getElementById('logo-overlay');
    
    if (!checkbox) return;
    
    const isChecked = checkbox.checked;
    
    // Update state
    stateManager.set('logo.useCustom', isChecked);
    
    // Update UI visibility
    if (isChecked) {
        // Show custom logo, hide standard sections
        if (logoSection) logoSection.classList.add('hidden');
        if (logobgSection) logobgSection.classList.add('hidden');
        if (customLogoSection) customLogoSection.style.display = 'block';
        if (uploadArea) uploadArea.style.display = 'block';
        if (logoOverlay) logoOverlay.style.display = 'block';
    } else {
        // Show standard sections, hide custom logo
        if (logoSection) logoSection.classList.remove('hidden');
        if (logobgSection) logobgSection.classList.remove('hidden');
        if (customLogoSection) customLogoSection.style.display = 'none';
        if (uploadArea) uploadArea.style.display = 'none';
        if (logoOverlay) logoOverlay.style.display = 'none';
    }
    
    // Update price
    const logoPrice = isChecked ? 2000 : 0;
    stateManager.set('prices.logo', logoPrice);
    
    console.log(`[Toggle] Logo mode: ${isChecked ? 'custom' : 'standard'}, price: ${logoPrice}₽`);
}

/**
 * Toggle Laser Engraving
 * Управляет переключением лазерной гравировки на футляре
 */
export function toggleLaserEngraving() {
    const checkbox = document.getElementById('laser-engraving-toggle');
    const dataSection = document.getElementById('laser-engraving-data');
    
    if (!checkbox || !dataSection) return;
    
    const isChecked = checkbox.checked;
    
    // Update state
    stateManager.set('case.laserEngravingEnabled', isChecked);
    
    // Update UI visibility
    if (isChecked) {
        dataSection.style.display = 'block';
    } else {
        dataSection.style.display = 'none';
    }
    
    // Update price
    const casePrice = isChecked ? 2500 : 0;
    stateManager.set('prices.case', casePrice);
    
    console.log(`[Toggle] Laser engraving: ${isChecked ? 'enabled' : 'disabled'}, price: ${casePrice}₽`);
}

/**
 * Toggle Shockmount
 * Управляет переключением подвеса с ценой 10000₽
 */
export function toggleShockmount() {
    const checkbox = document.getElementById('shockmount-switch');
    const shockmountSection = document.getElementById('shockmount-menu-item');
    const shockmountPinsSection = document.getElementById('shockmount-pins-menu-item');
    const includedText = document.getElementById('shockmount-included-text');
    
    if (!checkbox || !shockmountSection) return;
    
    const isChecked = checkbox.checked;
    
    // Update state
    stateManager.set('shockmount.enabled', isChecked);
    
    // Update UI visibility
    if (isChecked) {
        shockmountSection.style.display = 'flex';
        if (shockmountPinsSection) shockmountPinsSection.style.display = 'flex';
        if (includedText) includedText.style.display = 'block';
    } else {
        shockmountSection.style.display = 'none';
        if (shockmountPinsSection) shockmountPinsSection.style.display = 'none';
        if (includedText) includedText.style.display = 'none';
    }
    
    // Update price
    const shockmountPrice = isChecked ? 10000 : 0;
    stateManager.set('prices.shockmount', shockmountPrice);
    
    console.log(`[Toggle] Shockmount: ${isChecked ? 'enabled' : 'disabled'}, price: ${shockmountPrice}₽`);
}

/**
 * Initialize toggle states based on current state
 */
export function initToggles() {
    // Initialize logo mode toggle
    const logoCheckbox = document.getElementById('logo-mode-toggle');
    if (logoCheckbox) {
        const useCustomLogo = stateManager.get('logo.useCustom') || false;
        logoCheckbox.checked = useCustomLogo;
        
        // Set initial UI state
        if (useCustomLogo) {
            const logoSection = document.getElementById('logo-section');
            const logobgSection = document.querySelector('[data-section="logobg"]');
            const customLogoSection = document.querySelector('.toggle-logo-section');
            const uploadArea = document.getElementById('custom-logo-upload-area');
            const logoOverlay = document.getElementById('logo-overlay');
            
            if (logoSection) logoSection.classList.add('hidden');
            if (logobgSection) logobgSection.classList.add('hidden');
            if (customLogoSection) customLogoSection.style.display = 'block';
            if (uploadArea) uploadArea.style.display = 'block';
            if (logoOverlay) logoOverlay.style.display = 'block';
        }
    }
    
    // Initialize laser engraving toggle
    const laserCheckbox = document.getElementById('laser-engraving-toggle');
    if (laserCheckbox) {
        const laserEnabled = stateManager.get('case.laserEngravingEnabled') || false;
        laserCheckbox.checked = laserEnabled;
        
        // Set initial UI state
        const dataSection = document.getElementById('laser-engraving-data');
        if (dataSection) {
            dataSection.style.display = laserEnabled ? 'block' : 'none';
        }
    }
    
    // Initialize shockmount toggle
    const shockmountCheckbox = document.getElementById('shockmount-switch');
    if (shockmountCheckbox) {
        const shockmountEnabled = stateManager.get('shockmount.enabled') || false;
        shockmountCheckbox.checked = shockmountEnabled;
        
        // Set initial UI state
        const shockmountSection = document.getElementById('shockmount-menu-item');
        const shockmountPinsSection = document.getElementById('shockmount-pins-menu-item');
        const includedText = document.getElementById('shockmount-included-text');
        
        if (shockmountEnabled) {
            if (shockmountSection) shockmountSection.style.display = 'flex';
            if (shockmountPinsSection) shockmountPinsSection.style.display = 'flex';
            if (includedText) includedText.style.display = 'block';
        } else {
            if (shockmountSection) shockmountSection.style.display = 'none';
            if (shockmountPinsSection) shockmountPinsSection.style.display = 'none';
            if (includedText) includedText.style.display = 'none';
        }
    }
    
    // Добавляем обработчик для кнопки загрузки кастомного логотипа
    const uploadButton = document.querySelector('#custom-logo-upload-area .variant-item');
    if (uploadButton) {
        uploadButton.addEventListener('click', uploadCustomLogo);
    }
}
