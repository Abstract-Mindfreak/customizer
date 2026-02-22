import { currentState, setState } from '../state.js';
import { updateUI } from '../ui-core.js';
import { CONFIG } from '../config.js';
import { switchPreview } from './accessories.js';

// --- Private Helper Functions ---

function hexToRgb(hex) {
    if (!hex) return 'rgb(0,0,0)';
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : 'rgb(0,0,0)';
}

function updateShockmountColor(part, hex) {
    const shockmountSvg = document.getElementById('shockmount-svg');
    if (!shockmountSvg) return;

    const rgb = hexToRgb(hex);
    const floodId = part === 'body' ? 'feFlood6' : 'feFlood8';

    const el = shockmountSvg.querySelector(`#${floodId}`);
    if (el) {
        el.setAttribute('flood-color', rgb);
    }
}

// --- Public API ---

export function initShockmount() {
    initShockmountEventListeners();
    updateShockmountVisibility();
    updateShockmountLayers();
    updateShockmountPreview();
    updateShockmountPinsPreview();
}

export function updateShockmountVisibility() {
    const shockmountMenuItem = document.getElementById('shockmount-menu-item');
    const shockmountOptionsSection = document.getElementById('shockmount-options-section');
    const switchContainer = document.getElementById('shockmount-switch-container');
    const includedText = document.getElementById('shockmount-included-text');

    if (!shockmountMenuItem) return;

    const isBomblet = currentState.variant === '023-the-bomblet';
    shockmountMenuItem.style.display = 'flex';

    if (isBomblet) {
        if(switchContainer) switchContainer.style.display = 'block';
        // Полностью скрываем текст о включении в комплект
        if(includedText) includedText.style.display = 'none';
        const isEnabled = currentState.shockmount.enabled;
        if(shockmountOptionsSection) shockmountOptionsSection.style.display = isEnabled ? 'block' : 'none';
        const shockmountSwitch = document.getElementById('shockmount-switch');
        if(shockmountSwitch) shockmountSwitch.checked = isEnabled;
        setState('prices.shockmount', isEnabled ? CONFIG.shockmountPrice : 0);
    } else {
        // Для других моделей скрываем свитч (подвес безусловен или недоступен)
        if(switchContainer) switchContainer.style.display = 'none';
        // Полностью скрываем текст о включении в комплект
        if(includedText) includedText.style.display = 'none';
        if(shockmountOptionsSection) shockmountOptionsSection.style.display = 'block';
        setState('shockmount.enabled', true);
        setState('prices.shockmount', 0);
    }

    if (!currentState.shockmount.enabled && document.querySelector('.preview-switch-btn.active')?.dataset.preview === 'shockmount') {
        switchPreview('microphone');
    }
}

export function toggleShockmount() {
    const isEnabled = document.getElementById('shockmount-switch').checked;
    setState('shockmount.enabled', isEnabled);
    updateShockmountVisibility();
    updateUI();
}

export function updateShockmountLayers() {
    const shockmountSVG = document.getElementById('shockmount-svg');
    if (!shockmountSVG) return;

    const layer017 = shockmountSVG.querySelector('#layer10');
    const layer023 = shockmountSVG.querySelector('#layer9');

    if (!layer017 || !layer023) return;

    if (currentState.model === '017') {
        layer017.style.display = 'inline';
        layer023.style.display = 'none';
    } else { // model is '023'
        layer017.style.display = 'none';
        layer023.style.display = 'inline';
    }
}

export function handleShockmountVariantSelection(variant) {
    const section = document.getElementById('shockmount-options-section');
    section.querySelectorAll('.variant-item').forEach(item => item.classList.remove('selected'));

    // Ищем элемент с учетом префиксов
    let target = section.querySelector(`[data-variant="shock-${variant}"]`);
    if (!target) {
        target = section.querySelector(`[data-variant="${variant}"]`);
    }
    if (target) target.classList.add('selected');

    // Also deselect custom color from palette
    document.getElementById('pal-shockmount').querySelectorAll('.swatch').forEach(s => s.classList.remove('selected'));

    const colors = { 'RAL9003': '#F4F4F4', 'RAL1013': '#EAE0C8', 'RAL9005': '#0E0E10' };
    setState('shockmount.variant', variant);
    setState('shockmount.color', variant);
    setState('shockmount.colorValue', colors[variant]);
    setState('prices.shockmount', 0);

    updateUI();
    updateShockmountPreview();
}

export function handleShockmountColorSelection(color, ralName) {
    const section = document.getElementById('shockmount-options-section');
    section.querySelectorAll('.variant-item').forEach(i => i.classList.remove('selected'));

    setState('shockmount.variant', 'custom');
    setState('shockmount.color', `RAL ${ralName}`);
    setState('shockmount.colorValue', color);
    setState('prices.shockmount', CONFIG.optionPrice);

    updateUI();
    updateShockmountPreview();
}

export function handleShockmountPinSelection(variant, color = null, ralName = null) {
    const section = document.getElementById('shockmount-pins-section');
    section.querySelectorAll('.variant-item').forEach(item => item.classList.remove('selected'));
    document.getElementById('pal-pins').querySelectorAll('.swatch').forEach(s => s.classList.remove('selected'));

    if (variant === 'custom') {
        setState('shockmount.pins', { variant: 'custom', material: 'custom', colorValue: color, colorName: `RAL ${ralName}` });
        const targetSwatch = document.getElementById('pal-pins').querySelector(`[data-ral="${ralName}"]`);
        if(targetSwatch) targetSwatch.classList.add('selected');

    } else if (variant === 'brass') {
        setState('shockmount.pins', { variant: 'brass', material: 'brass', colorValue: null, colorName: 'Polished Brass' });
        // Ищем с префиксом pins-
        let target = section.querySelector(`[data-variant="pins-${variant}"]`);
        if (!target) {
            target = section.querySelector(`[data-variant="${variant}"]`);
        }
        if (target) target.classList.add('selected');
    } else {
        const colors = { 'RAL9003': '#F4F4F4', 'RAL1013': '#EAE0C8', 'RAL9005': '#0E0E10' };
        setState('shockmount.pins', { variant: variant, material: null, colorValue: colors[variant], colorName: variant });
        // Ищем с префиксом pins-
        let target = section.querySelector(`[data-variant="pins-${variant}"]`);
        if (!target) {
            target = section.querySelector(`[data-variant="${variant}"]`);
        }
        if (target) target.classList.add('selected');
    }

    updateUI();
    updateShockmountPinsPreview();
}

export function updateShockmountPreview() {
    const shockmountSvg = document.getElementById('shockmount-svg');
    if (!shockmountSvg) return;

    // Check if a custom color is applied to the shockmount body
    const hasBodyCustomColor = !!currentState.shockmount.colorValue;

    // Apply the flood color for the body if a custom color is selected
    if (hasBodyCustomColor) {
        updateShockmountColor('body', currentState.shockmount.colorValue);
    }
    // Note: The visibility of the body colorization (through filter) is managed implicitly
    // by whether a colorValue is set and then passed to updateShockmountColor.
    // Brass pin groups visibility is handled by updateShockmountPinsPreview.
}

export function updateShockmountPinsPreview() {
    const shockmountSvg = document.getElementById('shockmount-svg');
    if (!shockmountSvg) return;

    const isBrass = currentState.shockmount.pins.variant === 'brass';

    const brass017Group = shockmountSvg.querySelector('#shockmount-017-pins-brass-group');
    const brass023Group = shockmountSvg.querySelector('#shockmount-023-pins-brass-group');

    // Toggle brass groups visibility based on current model and brass selection
    if (brass017Group) {
        brass017Group.style.display = (currentState.model === '017' && isBrass) ? 'inline' : 'none';
    }
    if (brass023Group) {
        brass023Group.style.display = (currentState.model === '023' && isBrass) ? 'inline' : 'none';
    }

    // If pins are not brass, apply the selected color
    if (!isBrass && currentState.shockmount.pins.colorValue) {
        updateShockmountColor('pins', currentState.shockmount.pins.colorValue);
    }
    // No need to hide/show feFlood elements directly here; updateShockmountColor manages their flood-color.
}

function initShockmountEventListeners() {
    document.getElementById('shockmount-switch')?.addEventListener('change', toggleShockmount);

    document.querySelectorAll('#shockmount-options-section .variant-item').forEach(item => {
        item.addEventListener('click', () => handleShockmountVariantSelection(item.dataset.variant));
    });

    document.querySelectorAll('#shockmount-pins-section .variant-item').forEach(item => {
        item.addEventListener('click', () => handleShockmountPinSelection(item.dataset.variant));
    });
}
