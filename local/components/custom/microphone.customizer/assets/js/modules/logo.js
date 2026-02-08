import { currentState, setState } from '../state.js';
import { CONFIG } from '../config.js';
import { updateSVG } from '../engine.js';
import { updateUI } from '../ui-core.js';
import { calculateLuminance, updateFilter } from './appearance.js';

export function init() {
    const uploadButton = document.querySelector('#submenu-logo .variant-item[style*="border-style: dashed"]');
    if (uploadButton) {
        uploadButton.addEventListener('click', uploadCustomLogo);
    }
}

export function updateMalfaLogoOptionsVisibility() {
    const malfaSilverOption = document.querySelector('.variant-item[data-variant="9006"]'); // MALFA Edition (Серебро)
    if (!malfaSilverOption) return;

    if (currentState.variant === 'malfa') {
        // If the microphone is MALFA, check if a gold MALFA logo is selected
        // '1036' is the data-variant for MALFA Edition (Золото)
        if (currentState.logo.variant === 'gold' || currentState.logo.variant === '1036') {
            malfaSilverOption.style.display = 'none';
        } else {
            malfaSilverOption.style.display = 'flex'; // Show if it's not gold and MALFA mic is selected
        }
    } else {
        malfaSilverOption.style.display = 'none'; // Hide if it's not a MALFA microphone
    }
}

export function updateLogoSVG() {
    const svg = document.querySelector('#svg-wrapper svg');
    const customLayer = svg.querySelector('#custom-logo-layer');
    if (customLayer) customLayer.remove();



    if (currentState.logo.customLogo) {
        ['logotype-gold', 'logo-bg-black', 'logo-bg-colorized', 'logo-bg-monochrome', 'logo-letters-and-frame', 'malfa-logo'].forEach(id => {
            const el = svg.querySelector(`#${id}`);
            if (el) el.style.display = 'none';
        });

        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.id = 'custom-logo-layer';
        const img = document.createElementNS("http://www.w3.org/2000/svg", "image");
        img.setAttribute('width', '300');
        img.setAttribute('height', '350');
        img.setAttribute('x', '150');
        img.setAttribute('y', '1117');
        img.setAttribute('href', currentState.logo.customLogo);
        g.appendChild(img);
        svg.appendChild(g);
        return;
    }

    const malfaLogo = svg.querySelector('#malfa-logo');
    const malfaLogoTextPath = svg.querySelector('#malfa-logo-text-path');
    const clipLogoBgMalfa = svg.querySelector('#clip-logo-bg-malfa');

    if (currentState.variant === 'malfa') {
        ['logotype-gold', 'logo-bg-black', 'logo-bg-colorized', 'logo-bg-monochrome', 'logo-letters-and-frame'].forEach(id => {
            const el = svg.querySelector(`#${id}`);
            if (el) el.style.display = 'none';
        });
        if (malfaLogo) malfaLogo.style.display = 'inline';

        if (malfaLogoTextPath && clipLogoBgMalfa) {
            clipLogoBgMalfa.style.fill = 'url(#grad-malfa-bg)'; // Always malfa background gradient
            if (currentState.logo.variant === 'malfa' || currentState.logo.variant === '9006') { // Default or Silver
                malfaLogoTextPath.style.fill = 'url(#grad-malfa-silver)';
            } else if (currentState.logo.variant === '1036') { // Gold
                malfaLogoTextPath.style.fill = 'url(#grad-malfa-gold)';
            }
        }
    } else {
        if (malfaLogo) malfaLogo.style.display = 'none';

        ['logotype-gold', 'logo-bg-black', 'logo-bg-colorized', 'logo-bg-monochrome', 'logo-letters-and-frame'].forEach(id => {
            const el = svg.querySelector(`#${id}`);
            if (el) el.style.display = 'inline';
        });

        const letters = svg.querySelector('#logo-letters-and-frame');
        if (letters) letters.style.filter = (currentState.logo.variant === 'silver') ? 'grayscale(1) brightness(1.5)' : 'none';

        const bgBlack = svg.querySelector('#logo-bg-black');
        const bgColor = svg.querySelector('#logo-bg-colorized');
        const bgMono = svg.querySelector('#logo-bg-monochrome');

        if (currentState.logo.bgColor === 'black') {
            if (bgBlack) bgBlack.style.display = 'inline';
            if (bgColor) bgColor.style.display = 'none';
            if (bgMono) bgMono.style.display = 'none';
        } else {
            if (bgBlack) bgBlack.style.display = 'none';
            if (bgColor) bgColor.style.display = 'inline';
            if (bgMono) bgMono.style.display = 'inline';

            const lum = calculateLuminance(currentState.logo.bgColorValue);
            const opacity = Math.max(0.15, 1 - (lum * 0.8));
            if (bgMono) bgMono.style.opacity = opacity;

            updateFilter('logobg', currentState.logo.bgColorValue);
        }
    }
}

export function uploadCustomLogo() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = e => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = event => {
                try {
                    setState('logo.customLogo', event.target.result);
                    setState('prices.logo', CONFIG.optionPrice);
                    document.querySelector('.remove-logo-btn').style.display = 'block';

                    document.getElementById('logo-overlay').classList.add('active');

                    updateSVG();
                    updateUI();
                } catch (err) {
                    console.error(err);
                    showNotification('Ошибка при загрузке логотипа', 'error');
                }
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}
