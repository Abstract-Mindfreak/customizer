import { currentState } from './state.js';
import { CONFIG } from './config.js';
import { SVG_STORAGE } from './svg-assets.js';
import { getCorrectiveFilters, calculateLuminance, updateFilter, hexToRgb, hexToRgbValues, updateSectionLayers } from './modules/appearance.js';
import { showNotification } from './ui-core.js';
import { updateLogoSVG } from './modules/logo.js';

export function updateSVG() {
    try {
        const svg = document.querySelector('#svg-wrapper svg');
        if (!svg) return;

        svg.style.transform = currentState.model === '023' ? `scale(${CONFIG.scaleFactor})` : 'scale(1)';

        for (let i = 1; i <= 3; i++) {
            const grill = svg.querySelector(`#img-grill-mic${i}`);
            if (grill) grill.style.display = (currentState.spheres.variant === String(i)) ? 'inline' : 'none';
        }

        updateSectionLayers('spheres', currentState.spheres);
        updateSectionLayers('body', currentState.body);
        updateLogoSVG();
    } catch (e) {
        console.error("SVG Update Error:", e);
        showNotification("Ошибка обновления визуализации", "error");
    }
}

export async function loadSVG(svgPath = 'assets/mic-017.svg') {
    try {
        const response = await fetch(svgPath);
        const svgText = await response.text();
        document.getElementById('svg-wrapper').innerHTML = svgText;
    } catch (e) {
        console.error("Failed to load SVG:", e);
        // Fallback or error UI
    }

    document.getElementById('theme-toggle').innerHTML = SVG_STORAGE.THEME_TOGGLE;

    document.querySelectorAll('.chevron-icon').forEach(el => el.innerHTML = SVG_STORAGE.CHEVRON_ICON);
    document.querySelectorAll('.submenu-back > svg').forEach(el => el.innerHTML = SVG_STORAGE.SUBMENU_BACK);
    document.querySelectorAll('.palette-toggle-btn > svg').forEach(el => el.innerHTML = SVG_STORAGE.PALETTE_TOGGLE_CHEVRON);
    const svg = document.querySelector('#svg-wrapper svg');
    if (svg) svg.style.transformOrigin = 'center bottom';
    updateSVG();
}
