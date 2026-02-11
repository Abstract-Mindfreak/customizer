import { CustomizerSidebar } from './sidebar.js';
import { renderMicrophoneSelector } from './microphone-selector.js';

// === RENDER LAYER ===
function render(state) {
    renderPrices(state.singleMic.prices);
    renderVisual(state.singleMic);
    renderText(state.singleMic);
    renderTheme(state.ui.theme);
    renderSidebar(state.ui.sidebar);
    renderSelector();

    if (state.mimo.enabled) {
        renderMimoPanel(state.mimo);
    }

    if (state.ui.fullscreen) {
        renderFullscreenMode();
    }
}

function renderPrices(prices) {
    // Prices are now rendered within the sidebar.render() and also in the footer if it exists
    const totalPrice = document.getElementById('total-price');
    if (totalPrice) totalPrice.textContent = `${prices.total}₽`;
}

function renderVisual(config) {
    // Update SVG visual via standard engine calls if available
    if (window.updateSVG) {
        window.updateSVG();
    } else {
        // Fallback for standalone or before engine init
        const micSvg = document.querySelector('#mic-preview-container svg');
        if (micSvg) {
            // Basic visual updates
        }
    }
}

function renderText(config) {
    // Handled by sidebar render
}

function renderTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}

function renderSidebar(sidebarState) {
    // Render sidebar based on mode
    const sidebarInstance = new CustomizerSidebar();
    sidebarInstance.mode = sidebarState.mode;
    sidebarInstance.isCollapsed = sidebarState.collapsed;
    sidebarInstance.isExpanded = sidebarState.expanded;

    const container = document.querySelector('.customizer-sidebar-container');
    if (container) {
        container.innerHTML = sidebarInstance.render();
    }
}

function renderFullscreenMode() {
    // Handle fullscreen rendering
    document.querySelector('.preview-area')?.classList.add('fullscreen-active');
}

function renderSelector() {
    const container = document.getElementById('mic-selector-root');
    if (container) {
        container.innerHTML = renderMicrophoneSelector();
    }
}

function renderMimoPanel(mimoState) {
    // Implement MIMO panel rendering
}

export { render };
