import { currentState, setState, setInitialConfig } from './state.js';
import { variantNames, CONFIG, FREE_LOGO_RALS, MALFA_SILVER_RAL, MALFA_GOLD_RAL, DEFAULT_MIC_CONFIGS } from './config.js';
import { handleCaseVariantSelection, switchPreview } from './modules/accessories.js';
import { updateShockmountVisibility, updateShockmountLayers } from './modules/shockmount.js';
import { togglePalette, handleStyleSelection } from './modules/appearance.js';
import { applyVariantPreset } from './modules/microphone.js';
import { updateSVG } from './engine.js';
import { validateField } from './services/validation.js';
import { generateReport } from './services/report.js';
import { updateMalfaLogoOptionsVisibility } from './modules/logo.js'; // Import the new function

export function updateUI() {
    updateMalfaLogoOptionsVisibility(); // Call the new function here
    document.getElementById('spheres-color-display').style.backgroundColor = currentState.spheres.color ? currentState.spheres.colorValue : '#000000';
    document.getElementById('body-color-display').style.backgroundColor = currentState.body.color ? currentState.body.colorValue : '#000000';

    const logoColor = currentState.logo.customLogo ? '#000' : (currentState.logo.bgColor === 'black' ? '#000' : currentState.logo.bgColorValue);
    document.getElementById('logo-color-display').style.backgroundColor = logoColor;

    // Update case and shockmount displays
    document.getElementById('case-color-display').style.backgroundColor = '#8B4513';
    document.getElementById('shockmount-color-display').style.backgroundColor = currentState.shockmount.colorValue;

    // Task 1: Update labels
    document.getElementById('spheres-subtitle').textContent = currentState.spheres.color ? currentState.spheres.color : variantNames[currentState.spheres.variant];
    document.getElementById('body-subtitle').textContent = currentState.body.color ? currentState.body.color : variantNames[currentState.body.variant];
    document.getElementById('logo-subtitle').textContent = currentState.logo.customLogo
        ? 'Кастомный'
        : (currentState.logo.variant === 'malfa'
            ? (currentState.logo.bgColor === MALFA_SILVER_RAL ? 'MALFA Edition (Серебро)'
                : (currentState.logo.bgColor === MALFA_GOLD_RAL ? 'MALFA Edition (Золото)'
                    : 'MALFA Edition'))
            : (FREE_LOGO_RALS.includes(currentState.logo.bgColor)
                ? `RAL ${currentState.logo.bgColor}`
                : (currentState.logo.variant === 'silver' ? 'Холодный хром' : 'Классическая латунь')));

    // Update case and shockmount subtitles
    const caseSubtitle = currentState.case.variant === 'custom' ? 'Собственное изображение' : 'Стандартный (Логотип Soyuz)';
    document.getElementById('case-subtitle').textContent = caseSubtitle;

    const shockmountColorNames = {
        'white': 'Белый',
        'cream': 'Слоновая кость',
        'black': 'Глубокий черный'
    };
    let shockmountText = shockmountColorNames[currentState.shockmount.variant] || 'Белый';

    if (currentState.shockmount.variant === 'custom' && currentState.shockmount.color) {
        // Извлекаем чистый RAL номер из строки типа "RAL 9003"
        const ralMatch = currentState.shockmount.color.match(/RAL\s*(\d+)/);
        shockmountText = ralMatch ? ralMatch[1] : currentState.shockmount.color;
    }
    document.getElementById('shockmount-subtitle').textContent = shockmountText;

    // Update prices
    document.getElementById('spheres-price').textContent = `+${currentState.prices.spheres}₽`;
    document.getElementById('body-price').textContent = `+${currentState.prices.body}₽`;
    document.getElementById('logo-price').textContent = `+${currentState.prices.logo}₽`;
    document.getElementById('case-price').textContent = `+${currentState.prices.case}₽`;
    document.getElementById('shockmount-price').textContent = `+${currentState.prices.shockmount}₽`;

    // Update price rows
    document.getElementById('spheres-price-row').textContent = `+${currentState.prices.spheres}₽`;
    document.getElementById('body-price-row').textContent = `+${currentState.prices.body}₽`;
    document.getElementById('logo-price-row').textContent = `+${currentState.prices.logo}₽`;
    document.getElementById('case-price-row').textContent = `+${currentState.prices.case}₽`;
    document.getElementById('shockmount-price-row').textContent = `+${currentState.prices.shockmount}₽`;

    const total = CONFIG.basePrice + currentState.prices.spheres + currentState.prices.body + currentState.prices.logo + currentState.prices.case + currentState.prices.shockmount;
    document.getElementById('total-price').textContent = `${total}₽`;
}

export function initEventListeners() {
    document.getElementById('theme-toggle').addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        document.documentElement.setAttribute('data-theme', current === 'light' ? 'dark' : 'light');
    });

    // Fullscreen Toggle
    const fullscreenToggleBtn = document.getElementById('fullscreen-toggle');
    if (fullscreenToggleBtn) {
        fullscreenToggleBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    showNotification(`Ошибка перехода в полноэкранный режим: ${err.message}`, 'error');
                });
            } else {
                document.exitFullscreen();
            }
        });

        document.addEventListener('fullscreenchange', updateFullscreenIcon);
        // Initial icon update
        updateFullscreenIcon();
    }

    document.querySelectorAll('.model-button').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.model-button').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            setState('model', this.dataset.model);

            // Show/hide variant options based on model
            document.querySelectorAll('.variant-options').forEach(options => {
                options.style.display = 'none';
            });
            document.getElementById(`variants-${this.dataset.model}`).style.display = 'flex';

            // Reset to first variant of new model and apply preset
            const firstVariant = document.querySelector(`#variants-${this.dataset.model} .variant-button`);
            if (firstVariant) {
                document.querySelectorAll('.variant-button').forEach(b => b.classList.remove('active'));
                firstVariant.classList.add('active');
                setState('variant', firstVariant.dataset.variant);
                applyVariantPreset(firstVariant.dataset.variant);
            }

            updateShockmountLayers();
            updateSVG();
        });
    });

    // Variant button handlers
    document.querySelectorAll('.variant-button').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.variant-button').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            setState('variant', this.dataset.variant);
            applyVariantPreset(this.dataset.variant);

            // Update shockmount visibility immediately
            updateShockmountVisibility();
        });

        // Add keyboard support
        btn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                document.querySelectorAll('.variant-button').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                setState('variant', this.dataset.variant);
                applyVariantPreset(this.dataset.variant);

                // Update shockmount visibility immediately
                updateShockmountVisibility();
            }
        });
    });

    document.querySelectorAll('.palette-toggle-btn').forEach(item => {
        item.addEventListener('click', function() {
            const wrapper = this.nextElementSibling;
            if (wrapper && wrapper.classList.contains('palette-wrapper')) {
                const section = wrapper.id.replace('palette-wrapper-', '');
                togglePalette(section);
            }
        });
    });

    document.querySelectorAll('.submenu-back').forEach(item => {
        item.addEventListener('click', function() {
            const section = this.closest('.submenu').id.replace('submenu-', '');
            toggleSubmenu(section);
        });
    });

    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            toggleSubmenu(this.dataset.section);
        });
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleSubmenu(this.dataset.section);
            }
        });
    });

    // Reset settings button handler
    const resetSettingsBtn = document.querySelector('.menu-item[data-section="reset-settings"]');
    if (resetSettingsBtn) {
        resetSettingsBtn.addEventListener('click', () => {
            let confirmReset = true;
            if (currentState.hasChanged) {
                confirmReset = confirm('Вы действительно хотите сбросить настройки? Все несохраненные изменения будут потеряны.');
            }

            if (confirmReset) {
                // Apply the default config for the current microphone model
                // Note: The `model` in `currentState` refers to '023' or '017' series.
                // We need to apply the default for the *currently selected variant*.
                const currentVariant = currentState.variant;
                if (DEFAULT_MIC_CONFIGS[currentVariant]) {
                    // Temporarily set a flag to prevent setState from marking as changed during reset
                    const tempHasChanged = currentState.hasChanged;
                    currentState.hasChanged = false;

                    // Apply default values to currentState directly for each section
                    const defaultConfig = DEFAULT_MIC_CONFIGS[currentVariant];
                    Object.keys(defaultConfig).forEach(section => {
                        Object.assign(currentState[section], defaultConfig[section]);
                    });

                    // Explicitly reset prices to 0 for configurable options
                    currentState.prices = { base: CONFIG.basePrice, spheres: 0, body: 0, logo: 0, case: 0, shockmount: 0 };

                    // Re-set initial config
                    setInitialConfig(defaultConfig);

                    // Restore hasChanged flag if it was true before reset and should reflect original changes
                    // Or keep it false as it is a reset action
                    currentState.hasChanged = false; // After reset, there are no changes

                    updateSVG();
                    updateUI();
                    showNotification('Настройки успешно сброшены!', 'success');
                } else {
                    showNotification('Не удалось найти стандартные настройки для текущего микрофона.', 'error');
                }
            }
        });
    }

    document.querySelectorAll('.submenu .variant-item').forEach(item => {
        const handler = function() {
            if(this.onclick) return;
            const section = this.closest('.submenu').id.replace('submenu-', '');
            handleStyleSelection(section, this.dataset.variant);

            // Switch to microphone preview when spheres or body options are selected
            if (section === 'spheres' || section === 'body') {
                switchPreview('microphone');
            }
            // Switch to case preview when case options are selected
            else if (section === 'case') {
                switchPreview('case');
            }
            // Switch to microphone preview when logo options are selected
            else if (section === 'logo') {
                switchPreview('microphone');
            }
        };

        item.addEventListener('click', handler);
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if(this.onclick) { this.click(); return; }
                handler.call(this);
            }
        });
    });

    const modal = document.getElementById('order-modal');
    document.querySelector('.order-button').addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    document.getElementById('order-form').addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('📝 Начинаю валидацию формы');

        const inputs = e.target.querySelectorAll('input');
        let isValid = true;

        inputs.forEach(input => {
            try {
                if (!validateField(input)) isValid = false;
            } catch (error) {
                console.error('❌ Ошибка валидации поля:', error);
                // Продолжаем проверку других полей даже если одно упало
            }
        });

        if (!isValid) {
            console.log('❌ Валидация не пройдена');
            showNotification('Пожалуйста, исправьте ошибки в форме', 'error');
            return;
        }

        console.log('✅ Валидация пройдена');
        const formData = new FormData(e.target);
        const clientData = Object.fromEntries(formData.entries());

        // Импортируем и вызываем sendOrder
        import('./services/report.js').then(({ sendOrder }) => {
            sendOrder(clientData);
        }).catch(error => {
            console.error('❌ Ошибка импорта sendOrder:', error);
            alert('Ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.');
        });
    });

    document.querySelector('.print-btn').addEventListener('click', () => {
        window.print();
    });

    document.getElementById('order-modal').querySelector('button[style*="background:none"]').addEventListener('click', closeOrderModal);
    document.getElementById('report-modal').querySelector('button[style*="background:none"]').addEventListener('click', closeReportModal);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
        }
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.style.display = 'none';
            }
        });
    });
}

function updateFullscreenIcon() {
    const fullscreenToggleBtn = document.getElementById('fullscreen-toggle');
    if (!fullscreenToggleBtn) return;

    const icon = fullscreenToggleBtn.querySelector('.fullscreen-icon');
    if (!icon) return;

    if (document.fullscreenElement) {
        // Change icon to exit fullscreen (two arrows pointing inwards)
        icon.innerHTML = '<path d="M15 3h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2m-7 0H5a2 2 0 0 1-2-2v-2m0-10V5a2 2 0 0 1 2-2h2"></path>';
    } else {
        // Change icon to enter fullscreen (two arrows pointing outwards)
        icon.innerHTML = '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3m-18 0v3a2 2 0 0 0 2 2h3"></path>';
    }
}

export function closeOrderModal() {
    document.getElementById('order-modal').style.display = 'none';
}

export function closeReportModal() {
    document.getElementById('report-modal').style.display = 'none';
}

export function toggleSubmenu(section) {
    const menuItem = document.querySelector(`[data-section="${section}"]`);
    const submenu = document.getElementById(`submenu-${section}`);

    if (!menuItem || !submenu) return;

    const isExpanded = menuItem.classList.contains('expanded');

    document.querySelectorAll('.submenu').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('expanded'));

    if (!isExpanded) {
        submenu.classList.add('active');
        menuItem.classList.add('expanded');

        // Auto-preview switching logic
        if (['spheres', 'body', 'logo'].includes(section)) {
            const currentPreview = document.querySelector('.preview-switch-btn.active')?.dataset.preview;
            if (currentPreview === 'case' || currentPreview === 'shockmount') {
                switchPreview('microphone');
            }
        } else if (section === 'case') {
            const currentPreview = document.querySelector('.preview-switch-btn.active')?.dataset.preview;
            if (currentPreview === 'microphone' || currentPreview === 'shockmount') {
                switchPreview('case');
            }
        } else if (section === 'shockmount' && currentState.shockmount.enabled) {
            const currentPreview = document.querySelector('.preview-switch-btn.active')?.dataset.preview;
            if (currentPreview === 'microphone' || currentPreview === 'case') {
                switchPreview('shockmount');
            }
        }

        setTimeout(() => {
            const backBtn = submenu.querySelector('.submenu-back');
            if (backBtn) backBtn.focus();
        }, 400);
    }
}

export function showNotification(msg, type) {
    const n = document.getElementById('notification');
    n.textContent = msg;
    n.className = `notification ${type} show`;
    setTimeout(() => n.classList.remove('show'), 3000);
}
