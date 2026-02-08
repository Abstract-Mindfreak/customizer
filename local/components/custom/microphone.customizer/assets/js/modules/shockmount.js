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
        if(includedText) includedText.style.display = 'none';
        const isEnabled = currentState.shockmount.enabled;
        if(shockmountOptionsSection) shockmountOptionsSection.style.display = isEnabled ? 'block' : 'none';
        const shockmountSwitch = document.getElementById('shockmount-switch');
        if(shockmountSwitch) shockmountSwitch.checked = isEnabled;
        setState('prices.shockmount', isEnabled ? CONFIG.shockmountPrice : 0);
    } else {
        if(switchContainer) switchContainer.style.display = 'none';
        if(includedText) includedText.style.display = 'block';
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

    const target = section.querySelector(`[data-variant="${variant}"]`);
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
        section.querySelector(`[data-variant="brass"]`).classList.add('selected');
    } else {
        const colors = { 'RAL9003': '#F4F4F4', 'RAL1013': '#EAE0C8', 'RAL9005': '#0E0E10' };
        setState('shockmount.pins', { variant: variant, material: null, colorValue: colors[variant], colorName: variant });
        section.querySelector(`[data-variant="${variant}"]`).classList.add('selected');
    }

    updateUI();
    updateShockmountPinsPreview();
}

export function updateShockmountPreview() {
    const shockmountSvg = document.getElementById('shockmount-svg');
    if (!shockmountSvg) return;

    const hasCustomColor = !!currentState.shockmount.colorValue;

    const layers = {
        main017: shockmountSvg.querySelector('#shockmount-017-pins-brass-group'),
        colorize017: shockmountSvg.querySelector('#feFlood6'),
        main023: shockmountSvg.querySelector('#shockmount-023-pins-brass-group'),
        colorize023: shockmountSvg.querySelector('#feFlood8'),
    };

    // Toggle 017 layers
    if (layers.main017) layers.main017.style.display = hasCustomColor ? 'none' : 'inline';
    // if (layers.colorize017) layers.colorize017.style.display = hasCustomColor ? 'inline' : 'none';

    // Toggle 023 layers
    if (layers.main023) layers.main023.style.display = hasCustomColor ? 'none' : 'inline';
    // if (layers.colorize023) layers.colorize023.style.display = hasCustomColor ? 'inline' : 'none';

    if (hasCustomColor) {
        updateShockmountColor('body', currentState.shockmount.colorValue);
    }
}

export function updateShockmountPinsPreview() {
    const shockmountSvg = document.getElementById('shockmount-svg');
    if (!shockmountSvg) return;

    const isBrass = currentState.shockmount.pins.variant === 'brass';

    const layers = {
        brass017: shockmountSvg.querySelector('#shockmount-017-pins-brass-group'),
        colorize017: shockmountSvg.querySelector('#feFlood6'),
        brass023: shockmountSvg.querySelector('#shockmount-023-pins-brass-group'),
        colorize023: shockmountSvg.querySelector('#feFlood8'),
    };

    // Toggle 017 layers
    if (layers.brass017) layers.brass017.style.display = isBrass ? 'inline' : 'none';
    // if (layers.colorize017) layers.colorize017.style.display = isBrass ? 'none' : 'inline';

    // Toggle 023 layers
    if (layers.brass023) layers.brass023.style.display = isBrass ? 'inline' : 'none';
    // if (layers.colorize023) layers.colorize023.style.display = isBrass ? 'none' : 'inline';

    if (!isBrass) {
        updateShockmountColor('pins', currentState.shockmount.pins.colorValue);
    }
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
