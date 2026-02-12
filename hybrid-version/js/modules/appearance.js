import { currentState, setState } from '../state.js';
import { CONFIG, FREE_LOGO_RALS, RAL_PALETTE } from '../config.js';
import { handleShockmountColorSelection, handleShockmountPinSelection } from './shockmount.js';
import { updateSVG } from '../engine.js';
import { updateUI } from '../ui-core.js';

export function initPalettes() {
    const sections = ['spheres', 'body', 'logo', 'shockmount', 'pins'];
    sections.forEach(section => {
        const container = document.getElementById('pal-' + section);
        container.innerHTML = '';

        for (let [name, color] of Object.entries(RAL_PALETTE)) {
            // Task 3: Exclude RAL 1013 from body palette
            if (section === 'body' && name === '1013') continue;

            // Exclude free RAL colors from logo palette
            if (section === 'logo' && FREE_LOGO_RALS.includes(name)) continue;

            let div = document.createElement('div');
            div.className = 'swatch';
            div.style.backgroundColor = color;
            div.title = `RAL ${name}`;
            div.dataset.color = color;
            div.dataset.ral = name;

            div.setAttribute('role', 'button');
            div.setAttribute('tabindex', '0');
            div.setAttribute('aria-label', `RAL ${name} ${color}`);
            div.setAttribute('aria-pressed', 'false');

            div.onclick = () => handleColorSelection(section, color, name);

            div.onkeydown = (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleColorSelection(section, color, name);
                }
            };

            container.appendChild(div);
        }
    });
}

export function togglePalette(section) {
    const wrapper = document.getElementById(`palette-wrapper-${section}`);
    const btn = wrapper.previousElementSibling;
    const isOpen = wrapper.classList.contains('open');

    document.querySelectorAll('.palette-wrapper.open').forEach(el => {
        if (el !== wrapper) {
            el.classList.remove('open');
            if (el.previousElementSibling) el.previousElementSibling.classList.remove('active');
        }
    });

    if (isOpen) {
        wrapper.classList.remove('open');
        btn.classList.remove('active');
    } else {
        wrapper.classList.add('open');
        btn.classList.add('active');

        const swatches = wrapper.querySelectorAll('.swatch');
        swatches.forEach((swatch, index) => {
            swatch.style.transitionDelay = `${index * 3}ms`;
        });
    }
}

export function handleColorSelection(section, color, ralName) {
    const ralLabel = `RAL ${ralName}`;

    let swatchContainer;
    if (section === 'pins') {
        swatchContainer = document.getElementById('pal-pins').parentElement;
    } else {
        swatchContainer = document.getElementById('submenu-' + section);
    }

    if (!swatchContainer) return;

    // Update ARIA and Visuals
    swatchContainer.querySelectorAll('.swatch').forEach(s => {
        s.classList.remove('selected');
        s.setAttribute('aria-pressed', 'false');
    });
    const targetSwatch = swatchContainer.querySelector(`.swatch[data-ral="${ralName}"]`);
    if (targetSwatch) {
        targetSwatch.classList.add('selected');
        targetSwatch.setAttribute('aria-pressed', 'true');
    }

    if (section === 'spheres' || section === 'body') {
        setState(`${section}.variant`, '3');
        setState(`${section}.color`, ralLabel);
        setState(`${section}.colorValue`, color);
        setState(`prices.${section}`, CONFIG.optionPrice);

        const submenu = document.getElementById('submenu-' + section);
        submenu.querySelectorAll('.variant-item').forEach(i => i.classList.remove('selected'));
        const var3 = submenu.querySelector('[data-variant="3"]');
        if(var3) var3.classList.add('selected');

    } else if (section === 'logo') {
        setState('logo.bgColor', ralName);
        setState('logo.bgColorValue', color);

        if (FREE_LOGO_RALS.includes(ralName)) {
            setState('prices.logo', 0);
        } else {
            setState('prices.logo', CONFIG.optionPrice);
        }

        const submenu = document.getElementById('submenu-logo');
        FREE_LOGO_RALS.forEach(ral => {
            submenu.querySelector(`[data-variant="${ral}"]`)?.classList.remove('selected');
        });
    } else if (section === 'shockmount') {
        handleShockmountColorSelection(color, ralName);
    } else if (section === 'pins') {
        handleShockmountPinSelection('custom', color, ralName);
    }
    updateSVG();
    updateUI();
}

export function updateSectionLayers(section, state) {
    const svg = document.querySelector('#svg-wrapper svg');
    const originalLayer = svg.querySelector(`#${section}-original`);
    const colorLayer = svg.querySelector(`#${section}-colorized`);
    const monoLayer = svg.querySelector(`#${section}-monochrome`);

    for (let i = 1; i <= 3; i++) {
        const display = (state.variant === String(i)) ? 'inline' : 'none';
        const origImg = svg.querySelector(`#${section}-original-${i}`);
        const colorImg = svg.querySelector(`#${section}-color-${i}`);
        const monoImg = svg.querySelector(`#${section}-mono-${i}`);

        if (origImg) origImg.style.display = display;
        if (colorImg) colorImg.style.display = display;
        if (monoImg) monoImg.style.display = display;
    }

    // Task 4: Only apply color logic if custom color is selected AND variant is 3
    if (state.color && state.variant === '3') {
        if (originalLayer) originalLayer.style.display = 'none';
        if (colorLayer) colorLayer.style.display = 'inline';
        if (monoLayer) monoLayer.style.display = 'inline';

        const filters = getCorrectiveFilters(state.colorValue);
        if (colorLayer) colorLayer.style.filter = `url(#filter-${section}-colorize) ${filters}`;

        updateFilter(section, state.colorValue);
    } else {
        if (originalLayer) originalLayer.style.display = 'inline';
        if (colorLayer) colorLayer.style.display = 'none';
        if (monoLayer) monoLayer.style.display = 'none';
        if (colorLayer) colorLayer.style.filter = `url(#filter-${section}-colorize)`;
    }
}

export function getCorrectiveFilters(hex) {
    const rgb = hexToRgbValues(hex);
    if (!rgb) return '';

    const [r, g, b] = rgb;

    if (r > 200 && g > 180 && b < 100) {
        return 'brightness(1.05) saturate(0.9) hue-rotate(-5deg)';
    }
    if (r > 230 && g > 230 && b > 230) {
        return 'contrast(1.1)';
    }
    return '';
}

export function calculateLuminance(hex) {
    const rgb = hexToRgbValues(hex);
    if (!rgb) return 0;
    return (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
}

export function updateFilter(section, hex) {
    const svg = document.querySelector('#svg-wrapper svg');
    const rgb = hexToRgb(hex);
    let id = (section === 'logobg') ? 'feFlood-logobg-color' : `feFlood-${section}-color`;
    const el = svg.querySelector(`#${id}`);
    if (el) el.setAttribute('flood-color', rgb);
}

export function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : hex;
}

export function hexToRgbValues(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
}

export function handleStyleSelection(section, variant) {
    const submenu = document.getElementById('submenu-' + section);
    submenu.querySelectorAll('.variant-item').forEach(i => {
        i.classList.remove('selected');
        i.setAttribute('aria-selected', 'false');
    });

    const selected = submenu.querySelector(`[data-variant="${variant}"]`);
    if (selected) {
        selected.classList.add('selected');
        selected.setAttribute('aria-selected', 'true');
    }

    if (section === 'spheres' || section === 'body') {
        setState(`${section}.variant`, variant);
        setState(`${section}.color`, null); // Clear color
        setState(`${section}.colorValue`, '#ffffff00');
        setState(`prices.${section}`, 0); // Styles are free

        // Clear palette selection
        submenu.querySelectorAll('.swatch').forEach(s => {
            s.classList.remove('selected');
            s.setAttribute('aria-pressed', 'false');
        });

    } else if (section === 'logo') {
        if (variant === 'black' || FREE_LOGO_RALS.includes(variant)) {
            setState('logo.bgColor', variant);
            setState('logo.bgColorValue', variant === 'black' ? '#000000' : RAL_PALETTE[variant]);
            setState('prices.logo', 0);
        } else {
            setState('logo.variant', variant);
            setState('prices.logo', 0); // Silver/Gold are free
        }
    }
    updateSVG();
    updateUI();
}
