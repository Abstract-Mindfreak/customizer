import { currentState, setState, setInitialConfig } from './state.js';
import { variantNames, CONFIG, FREE_LOGO_RALS, MALFA_SILVER_RAL, MALFA_GOLD_RAL, DEFAULT_MIC_CONFIGS } from './config.js';
import { handleCaseVariantSelection, switchPreview } from './modules/accessories.js';
import { updateShockmountVisibility, updateShockmountLayers } from './modules/shockmount.js';
import { togglePalette, handleStyleSelection } from './modules/appearance.js';
import { applyVariantPreset } from './modules/microphone.js';
import { updateSVG } from './engine.js';
import { validateForm } from './services/validation.js';
import { sendOrder } from './services/report.js';
import { updateMalfaLogoOptionsVisibility } from './modules/logo.js';
import { computePrices } from './compute-layer.js';

export function updateUI() {
    updateMalfaLogoOptionsVisibility();

    // Update color displays
    document.getElementById('spheres-color-display').style.backgroundColor = currentState.spheres.color ? currentState.spheres.colorValue : '#000000';
    document.getElementById('body-color-display').style.backgroundColor = currentState.body.color ? currentState.body.colorValue : '#000000';

    const logoColor = currentState.logo.customLogo ? '#000' : (currentState.logo.bgColor === 'black' ? '#000' : currentState.logo.bgColorValue);
    document.getElementById('logo-color-display').style.backgroundColor = logoColor;

    document.getElementById('case-color-display').style.backgroundColor = '#8B4513';
    document.getElementById('shockmount-color-display').style.backgroundColor = currentState.shockmount.colorValue || '#f5f5f5';

    // Update labels
    document.getElementById('spheres-subtitle').textContent = currentState.spheres.color ? currentState.spheres.color : (variantNames[currentState.spheres.variant] || 'Стандарт');
    document.getElementById('body-subtitle').textContent = currentState.body.color ? currentState.body.color : (variantNames[currentState.body.variant] || 'Стандарт');

    document.getElementById('logo-subtitle').textContent = currentState.logo.customLogo
        ? 'Кастомный'
        : (currentState.logo.variant === 'malfa'
            ? (currentState.logo.bgColor === MALFA_SILVER_RAL ? 'MALFA Edition (Серебро)'
                : (currentState.logo.bgColor === MALFA_GOLD_RAL ? 'MALFA Edition (Золото)'
                    : 'MALFA Edition'))
            : (FREE_LOGO_RALS.includes(currentState.logo.bgColor)
                ? `RAL ${currentState.logo.bgColor}`
                : (currentState.logo.variant === 'silver' ? 'Холодный хром' : 'Классическая латунь')));

    const caseSubtitle = currentState.case.variant === 'custom' ? 'Собственное изображение' : 'Стандартный (Логотип Soyuz)';
    document.getElementById('case-subtitle').textContent = caseSubtitle;

    const shockmountColorNames = { 'white': 'Белый', 'cream': 'Слоновая кость', 'black': 'Глубокий черный' };
    let shockmountText = shockmountColorNames[currentState.shockmount.variant] || 'Белый';
    if (currentState.shockmount.variant === 'custom' && currentState.shockmount.color) {
        const ralMatch = currentState.shockmount.color.match(/RAL\s*(\d+)/);
        shockmountText = ralMatch ? ralMatch[1] : currentState.shockmount.color;
    }
    document.getElementById('shockmount-subtitle').textContent = shockmountText;

    // --- INTEGRATED NEW PRICING ---
    const prices = computePrices(currentState);
    currentState.prices = { ...currentState.prices, ...prices };

    const updatePriceEl = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = `+${val}₽`;
    };

    updatePriceEl('spheres-price', prices.spheres);
    updatePriceEl('body-price', prices.body);
    updatePriceEl('logo-price', prices.logo);
    updatePriceEl('case-price', prices.case);
    updatePriceEl('shockmount-price', prices.shockmount);

    updatePriceEl('spheres-price-row', prices.spheres);
    updatePriceEl('body-price-row', prices.body);
    updatePriceEl('logo-price-row', prices.logo);
    updatePriceEl('case-price-row', prices.case);
    updatePriceEl('shockmount-price-row', prices.shockmount);

    const totalEl = document.getElementById('total-price');
    if (totalEl) totalEl.textContent = `${prices.total}₽`;
}

export function initEventListeners() {
    // Theme toggle
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') || 'light';
            document.documentElement.setAttribute('data-theme', current === 'light' ? 'dark' : 'light');
        });
    }

    // Fullscreen Toggle
    const fsBtn = document.getElementById('fullscreen-toggle');
    if (fsBtn) {
        fsBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => console.error(err));
            } else {
                document.exitFullscreen();
            }
        });
    }

    // Model switching
    document.querySelectorAll('.model-button').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.model-button').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            setState('model', this.dataset.model);

            document.querySelectorAll('.variant-options').forEach(options => options.style.display = 'none');
            const variantsEl = document.getElementById(`variants-${this.dataset.model}`);
            if (variantsEl) variantsEl.style.display = 'flex';

            const firstVariant = document.querySelector(`#variants-${this.dataset.model} .variant-button`);
            if (firstVariant) {
                document.querySelectorAll('.variant-button').forEach(b => b.classList.remove('active'));
                firstVariant.classList.add('active');
                setState('variant', firstVariant.dataset.variant);
                applyVariantPreset(firstVariant.dataset.variant);
            }
            updateShockmountLayers();
            updateSVG();
            updateUI();
        });
    });

    // Variant switching
    document.querySelectorAll('.variant-button').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.variant-button').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            setState('variant', this.dataset.variant);
            applyVariantPreset(this.dataset.variant);
            updateShockmountVisibility();
            updateUI();
        });
    });

    // Sidebar and submenus
    document.querySelectorAll('.menu-item').forEach(item => {
        if (item.dataset.section !== 'reset-settings') {
            item.addEventListener('click', function() {
                toggleSubmenu(this.dataset.section);
            });
        }
    });

    document.querySelectorAll('.submenu-back').forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.closest('.submenu').id.replace('submenu-', '');
            toggleSubmenu(section);
        });
    });

    // Reset settings
    const resetBtn = document.querySelector('.menu-item[data-section="reset-settings"]');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Вы действительно хотите сбросить настройки?')) {
                const currentVariant = currentState.variant;
                if (DEFAULT_MIC_CONFIGS[currentVariant]) {
                    const defaultConfig = DEFAULT_MIC_CONFIGS[currentVariant];
                    Object.keys(defaultConfig).forEach(section => {
                        Object.assign(currentState[section], defaultConfig[section]);
                    });
                    currentState.hasChanged = false;
                    updateSVG();
                    updateUI();
                }
            }
        });
    }

    // Order modal logic
    const orderBtn = document.querySelector('.order-button');
    if (orderBtn) {
        orderBtn.addEventListener('click', () => {
            document.getElementById('order-modal').style.display = 'flex';
        });
    }

    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (validateForm('order-form')) {
                const formData = new FormData(orderForm);
                const clientData = Object.fromEntries(formData.entries());
                await sendOrder(clientData);
            } else {
                showNotification('Пожалуйста, заполните все обязательные поля', 'error');
            }
        });
    }

    // Modal closing
    document.querySelectorAll('.modal-overlay .close, .modal-overlay button[style*="background:none"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.closest('.modal-overlay').style.display = 'none';
        });
    });
}

export function toggleSubmenu(section) {
    const menuItem = document.querySelector(`[data-section="${section}"]`);
    const submenu = document.getElementById(`submenu-${section}`);
    if (!menuItem || !submenu) return;

    const isActive = submenu.classList.contains('active');
    document.querySelectorAll('.submenu').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('expanded'));

    if (!isActive) {
        submenu.classList.add('active');
        menuItem.classList.add('expanded');
    }
}

export function showNotification(msg, type) {
    const n = document.getElementById('notification');
    if (n) {
        n.textContent = msg;
        n.className = `notification ${type} show`;
        setTimeout(() => n.classList.remove('show'), 3000);
    }
}
