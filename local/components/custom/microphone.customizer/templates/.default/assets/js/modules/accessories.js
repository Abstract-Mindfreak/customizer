import { currentState, setState } from '../state.js';
import { updateUI } from '../ui-core.js';
import { initShockmount } from './shockmount.js';
import * as cameraAnimation from './camera-animation.js'; // NEW IMPORT

// --- CORE INITIALIZATION ---
export function initCaseAndShockmount() {
    // Original Shockmount Logic
    initShockmount();

    // Unified Preview Switching
    initPreviewSwitching();
}

// --- PREVIEW SWITCHING LOGIC ---

export function initPreviewSwitching() {
    const previewArea = document.querySelector('.preview-area');
    const switchContainer = document.createElement('div');
    switchContainer.className = 'preview-switch-container';
    switchContainer.innerHTML = `
        <button class="preview-switch-btn active" data-preview="microphone">Микрофон</button>
        <button class="preview-switch-btn" data-preview="case">Деревянный футляр</button>
        <button class="preview-switch-btn" data-preview="shockmount" id="shockmount-preview-btn">Подвес</button>
    `;

    previewArea.insertBefore(switchContainer, previewArea.firstChild);

    switchContainer.querySelectorAll('.preview-switch-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchPreview(this.dataset.preview); // Call switchPreview, which now handles button active state
        });
    });
}

export function switchPreview(previewType) {
    // Update active class on buttons
    document.querySelectorAll('.preview-switch-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const targetButton = document.querySelector(`[data-preview="${previewType}"]`);
    if (targetButton) {
        targetButton.classList.add('active');
    }

    // Call cameraAnimation to switch layers, replacing display manipulation
    cameraAnimation.switchLayer(previewType);
}

// Legacy functions - больше не используются
export function handleCaseVariantSelection() {
    // Устаревшая функция
}
export function uploadCaseLogo() {
    // Устаревшая функция
}
