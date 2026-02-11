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
    const spheresPrice = document.getElementById('spheres-price');
    if (spheresPrice) spheresPrice.textContent = `+${prices.spheres}₽`;

    const bodyPrice = document.getElementById('body-price');
    if (bodyPrice) bodyPrice.textContent = `+${prices.body}₽`;

    const logoPrice = document.getElementById('logo-price');
    if (logoPrice) logoPrice.textContent = `+${prices.logo}₽`;

    const shockmountPrice = document.getElementById('shockmount-price');
    if (shockmountPrice) shockmountPrice.textContent = `+${prices.shockmount}₽`;

    const woodcasePrice = document.getElementById('woodcase-price');
    if (woodcasePrice) woodcasePrice.textContent = `+${prices.woodcase}₽`;

    const totalPrice = document.getElementById('total-price');
    if (totalPrice) totalPrice.textContent = `${prices.total}₽`;
}

function renderVisual(config) {
    // Update SVG visual
    if (window.updateSpheresVisual) window.updateSpheresVisual(config.spheres);
    if (window.updateBodyVisual) window.updateBodyVisual(config.body);
    if (window.updateLogoVisual) window.updateLogoVisual(config.logo);
    if (window.updateShockmountVisual) window.updateShockmountVisual(config.shockmount);
    if (window.updateWoodcaseVisual) window.updateWoodcaseVisual(config.woodcase);

    // Update layer composition
    if (window.updateLayerComposition) window.updateLayerComposition(config);
}

function renderText(config) {
    // Update text descriptions
    const spheresSubtitle = document.getElementById('spheres-subtitle');
    if (spheresSubtitle) {
        spheresSubtitle.textContent = config.spheres.color || config.spheres.variant || 'Standard';
    }
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
