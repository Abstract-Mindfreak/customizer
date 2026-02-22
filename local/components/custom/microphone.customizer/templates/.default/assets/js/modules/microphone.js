import { currentState, setState, setInitialConfig } from '../state.js';
import { CONFIG, FREE_LOGO_RALS, RAL_PALETTE, variantNames, MALFA_SILVER_RAL, MALFA_GOLD_RAL, DEFAULT_MIC_CONFIGS } from '../config.js';
import { updateSVG } from '../engine.js';
import { updateUI } from '../ui-core.js';
import { updateShockmountVisibility } from './shockmount.js';
import * as cameraAnimation from './camera-animation.js'; // NEW IMPORT

export function applyVariantPreset(newVariant) {
    // Store the previous variant before currentState.variant is potentially changed
    const previousVariant = currentState.variant;

    // Save the current configuration of the previous microphone variant, if it was valid
    // and we are actually switching to a different variant.
    if (previousVariant && previousVariant !== newVariant) {
        // Create a deep copy of the current customizable state for the previous variant
        const configToSave = JSON.parse(JSON.stringify({
            spheres: currentState.spheres,
            body: currentState.body,
            logo: currentState.logo,
            case: currentState.case,
            shockmount: currentState.shockmount,
            prices: currentState.prices
        }));
        currentState.savedMicConfigs[previousVariant] = configToSave;
    }
    
    // Reset all selections first (UI elements)
    document.querySelectorAll('.variant-item').forEach(item => {
        item.classList.remove('selected');
        item.setAttribute('aria-selected', 'false');
    });

    document.querySelectorAll('.swatch').forEach(swatch => {
        swatch.classList.remove('selected');
        swatch.setAttribute('aria-pressed', 'false');
    });

    // Show MALFA logo option and hide color selection for non-MALFA variants
    const malfaLogoOptions = document.querySelectorAll('.malfa-logo');
    const logoSubmenu = document.getElementById('submenu-logo');
    const colorSection = logoSubmenu.querySelector('.submenu-section:nth-child(2)');

    if (newVariant === 'malfa') {
        malfaLogoOptions.forEach(option => option.style.display = 'flex');
        document.getElementById('malfa-logo').style.display = 'inline';
        document.getElementById('logo-overlay').style.display = 'block';
        logoSubmenu.querySelectorAll('.submenu-section').forEach(section => section.style.display = 'block');
    } else {
        malfaLogoOptions.forEach(option => option.style.display = 'none');
        document.getElementById('malfa-logo').style.display = 'none';
        document.getElementById('logo-overlay').style.display = 'none';
        if (colorSection) colorSection.style.display = 'block';
    }

    // Update current variant in state immediately
    setState('variant', newVariant);

    let configToApply = {};

    // Check if a saved configuration exists for the new variant
    if (currentState.savedMicConfigs[newVariant]) {
        console.log(`Loading saved config for ${newVariant}`);
        configToApply = currentState.savedMicConfigs[newVariant];
    } else {
        console.log(`Applying default config for ${newVariant}`);
        // If no saved config, use the default from config.js
        configToApply = DEFAULT_MIC_CONFIGS[newVariant];
    }
    
    // Apply the chosen configuration to currentState
    Object.assign(currentState.spheres, configToApply.spheres);
    Object.assign(currentState.body, configToApply.body);
    Object.assign(currentState.logo, configToApply.logo);
    Object.assign(currentState.case, configToApply.case);
    Object.assign(currentState.shockmount, configToApply.shockmount);
    Object.assign(currentState.prices, configToApply.prices);

    const shockmountSwitch = document.getElementById('shockmount-switch');
    if (shockmountSwitch) {
        shockmountSwitch.checked = currentState.shockmount.enabled;
    }

    // Update UI selections based on the applied config
    selectVariant('spheres', currentState.spheres.variant);
    if (currentState.spheres.color) selectRALVariant('spheres', currentState.spheres.color);

    selectVariant('body', currentState.body.variant);
    if (currentState.body.color) selectRALVariant('body', currentState.body.color);

    selectVariant('logo', currentState.logo.variant);
    if (currentState.logo.bgColor) selectRALVariant('logo', currentState.logo.bgColor);

    selectVariant('case', currentState.case.variant);
    
    // Special handling for shockmount pins as its state is nested
    selectVariant('shockmount', currentState.shockmount.variant);
    if (currentState.shockmount.color) selectRALVariant('shockmount', currentState.shockmount.color);
    selectVariant('shockmount-pins', currentState.shockmount.pins.variant);
    if (currentState.shockmount.pins.colorName && currentState.shockmount.pins.material === 'custom') {
        // If it's a custom RAL, we need to mark the swatch as selected
        const palettePins = document.getElementById('pal-pins');
        if (palettePins) {
            const swatch = palettePins.querySelector(`[data-ral="${currentState.shockmount.pins.colorName.replace('RAL ', '')}"]`);
            if (swatch) swatch.classList.add('selected');
        }
    }


    updateShockmountVisibility();
    if (window.WoodCase) {
        // Assume WoodCase is initialized globally and has a method to set the case based on variant
        // or a method to apply existing case state directly.
        // For now, we'll just set the variant which might trigger its internal logic.
        window.WoodCase.setCase(newVariant);
    }
    
    // Set initial config for reset functionality based on the loaded/default config
    setInitialConfig(configToApply);

    // Ensure the camera view switches to the microphone when a new model is applied
    cameraAnimation.switchLayer('microphone'); 

    updateSVG();
    updateUI();
}

export function selectVariant(section, variant) {
    const submenu = document.getElementById('submenu-' + section);
    const selected = submenu.querySelector(`[data-variant="${variant}"]`);
    if (selected) {
        selected.classList.add('selected');
        selected.setAttribute('aria-selected', 'true');
    }
}

export function selectRALVariant(section, ralCode) {
    const submenu = document.getElementById('submenu-' + section);
    const selected = submenu.querySelector(`[data-variant="${ralCode}"]`);
    if (selected) {
        selected.classList.add('selected');
        selected.setAttribute('aria-selected', 'true');
    }
}
