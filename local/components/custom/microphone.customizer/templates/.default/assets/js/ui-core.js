import { currentState, setState, setInitialConfig, restoreMicState, micStates } from './state.js';
import { variantNames, CONFIG, FREE_LOGO_RALS, MALFA_SILVER_RAL, MALFA_GOLD_RAL, DEFAULT_MIC_CONFIGS } from './config.js';
import { handleCaseVariantSelection, switchPreview } from './modules/accessories.js';
import { updateShockmountVisibility, updateShockmountLayers } from './modules/shockmount.js';
import { togglePalette, handleStyleSelection, hexToRgbValues } from './modules/appearance.js';
import { applyVariantPreset } from './modules/microphone.js';
import { updateSVG } from './engine.js';
import { validateField } from './services/validation.js';
import { generateReport } from './services/report.js';
import { updateMalfaLogoOptionsVisibility } from './modules/logo.js'; // Import the new function

export function updateUI() {
    updateMalfaLogoOptionsVisibility(); // Call the new function here

    const spheresColor = currentState.spheres.color ? currentState.spheres.colorValue : null;
    const bodyColor = currentState.body.color ? currentState.body.colorValue : null;
    const logoColor = currentState.logo.customLogo ? null : (currentState.logo.bgColor === 'black' ? '#000000' : currentState.logo.bgColorValue);
    const shockmountColor = currentState.shockmount.colorValue;

    // Apply dimmed background colors to menu items
    const setMutedBg = (section, color) => {
        const el = document.querySelector(`.menu-item[data-section="${section}"]`);
        if (el) {
            if (color) {
                const rgb = hexToRgbValues(color);
                if (rgb) {
                    el.style.backgroundColor = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.15)`;
                }
            } else {
                el.style.backgroundColor = '';
            }
        }
    };

    setMutedBg('spheres', spheresColor);
    setMutedBg('body', bodyColor);
    setMutedBg('logo', logoColor);
    setMutedBg('shockmount', shockmountColor);
    setMutedBg('shockmount-pins', currentState.shockmount.pins.colorValue);

    // Conflict Resolution: RAL vs Satin Steel (Variant 3)
    const spheresSatinSteel = document.querySelector('#submenu-spheres .variant-item[data-variant="3"]');
    if (spheresSatinSteel) {
        // If a custom RAL color is selected, hide the "Satin Steel" (Variant 3) button
        spheresSatinSteel.style.display = currentState.spheres.color ? 'none' : 'flex';
    }

    const bodySatinSteel = document.querySelector('#submenu-body .variant-item[data-variant="3"]');
    if (bodySatinSteel) {
        // If a custom RAL color is selected, hide the "Satin Steel" (Variant 3) button
        bodySatinSteel.style.display = currentState.body.color ? 'none' : 'flex';
    }

    document.getElementById('spheres-color-display').style.backgroundColor = currentState.spheres.color ? currentState.spheres.colorValue : '#000000';
    document.getElementById('body-color-display').style.backgroundColor = currentState.body.color ? currentState.body.colorValue : '#000000';

    const logoColor = currentState.logo.customLogo ? '#000' : (currentState.logo.bgColor === 'black' ? '#000' : currentState.logo.bgColorValue);
    document.getElementById('logo-color-display').style.backgroundColor = logoColor;

    // Update case and shockmount displays
    document.getElementById('case-color-display').style.backgroundColor = '#8B4513';
    document.getElementById('shockmount-color-display').style.backgroundColor = currentState.shockmount.colorValue;
    const pinsDisplay = document.getElementById('shockmount-pins-color-display');
    if (pinsDisplay) {
        pinsDisplay.style.backgroundColor = currentState.shockmount.pins.colorValue || '#D4AF37';
    }

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
        const ralMatch = currentState.shockmount.color.match(/RAL\s*(\d+)/);
        shockmountText = ralMatch ? ralMatch[1] : currentState.shockmount.color;
    }
    document.getElementById('shockmount-subtitle').textContent = shockmountText;

    // Shockmount Pins Subtitle
    let pinsText = currentState.shockmount.pins.variant === 'brass' ? 'Полированная латунь' : (currentState.shockmount.pins.colorName || 'RAL 9003');
    const pinsSubtitle = document.getElementById('shockmount-pins-subtitle');
    if (pinsSubtitle) pinsSubtitle.textContent = pinsText;

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
            const model = this.dataset.model;
            document.querySelectorAll('.model-button').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            setState('model', model);

            // Show/hide variant options based on model
            document.querySelectorAll('.variant-options').forEach(options => {
                options.style.display = 'none';
            });
            document.getElementById(`variants-${model}`).style.display = 'flex';

            // Find either previously saved variant or first one
            let targetVariant = null;
            if (model === '023') {
                targetVariant = micStates['023-the-bomblet'] ? '023-the-bomblet' : (micStates['malfa'] ? 'malfa' : (micStates['023-dlx'] ? '023-dlx' : '023-the-bomblet'));
            } else {
                targetVariant = micStates['017-fet'] ? '017-fet' : (micStates['017-tube'] ? '017-tube' : '017-fet');
            }

            const variantBtn = document.querySelector(`.variant-button[data-variant="${targetVariant}"]`);
            if (variantBtn) {
                variantBtn.click();
            }

            updateShockmountLayers();
            updateSVG();
        });
    });

    // Variant button handlers
    document.querySelectorAll('.variant-button').forEach(btn => {
        btn.addEventListener('click', function() {
            const variant = this.dataset.variant;
            document.querySelectorAll('.variant-button').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Persistent State: Restore or Apply Default
            restoreMicState(variant);

            // Update Case Preview
            if (window.WoodCase) {
                window.WoodCase.setCase(variant);
            }

            // Ensure UI matches restored state
            updateShockmountVisibility();
            updateShockmountLayers();
            updateSVG();
            updateUI();
        });

        // Add keyboard support
        btn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
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
    const resetSettingsBtn = document.getElementById('reset-settings-btn');
    if (resetSettingsBtn) {
        resetSettingsBtn.addEventListener('click', () => {
            let confirmReset = true;
            if (currentState.hasChanged) {
                confirmReset = confirm('Вы действительно хотите сбросить настройки? Все несохраненные изменения будут потеряны.');
            }

            if (confirmReset) {
                const currentVariant = currentState.variant;
                if (DEFAULT_MIC_CONFIGS[currentVariant]) {
                    // Clear saved state for this variant
                    delete micStates[currentVariant];

                    // Re-restore from defaults
                    restoreMicState(currentVariant);

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
        console.log('Начинаю валидацию формы');
        
        const inputs = e.target.querySelectorAll('input');
        let isValid = true;
        
        inputs.forEach(input => {
            try {
                if (!validateField(input)) isValid = false;
            } catch (error) {
                console.error('Ошибка валидации поля:', error);
            }
        });

        if (!isValid) {
            console.log('Валидация не пройдена');
            showNotification('Пожалуйста, исправьте ошибки в форме', 'error');
            return;
        }

        console.log('Валидация пройдена');
        const formData = new FormData(e.target);
        const clientData = Object.fromEntries(formData.entries());
        import('./services/report.js').then(({ sendOrder }) => {
            sendOrder(clientData);
        }).catch(error => {
            console.error('Ошибка импорта sendOrder:', error);
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

    initDragAndDrop();
}

function initDragAndDrop() {
    const dropZones = [
        { id: 'submenu-logo', section: 'logo' },
        { id: 'submenu-case', section: 'case' }
    ];

    dropZones.forEach(zone => {
        const el = document.getElementById(zone.id);
        if (!el) return;

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            el.addEventListener(eventName, e => {
                e.preventDefault();
                e.stopPropagation();
                if (eventName === 'dragenter' || eventName === 'dragover') {
                    el.classList.add('drag-over');
                } else {
                    el.classList.remove('drag-over');
                }
            }, false);
        });

        el.addEventListener('drop', e => {
            el.classList.remove('drag-over');
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files && files.length > 0) {
                const file = files[0];
                if (!file.type.startsWith('image/')) {
                    showNotification('Пожалуйста, загрузите изображение', 'error');
                    return;
                }

                if (zone.section === 'logo') {
                    import('./modules/logo.js').then(m => {
                        const reader = new FileReader();
                        reader.onload = event => {
                            setState('logo.customLogo', event.target.result);
                            setState('prices.logo', CONFIG.optionPrice);
                            document.querySelector('.remove-logo-btn').style.display = 'block';
                            document.getElementById('logo-overlay')?.classList.add('active');
                            updateSVG();
                            updateUI();
                        };
                        reader.readAsDataURL(file);
                    });
                } else if (zone.section === 'case') {
                    if (window.WoodCase) {
                        window.WoodCase.handleUpload({ target: { files: [file] } });
                    }
                }
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
        icon.innerHTML = '<path d="M15 3h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2m-7 0H5a2 2 0 0 1-2-2v-2m0-10V5a2 2 0 0 1 2-2h2"></path>';
    } else {
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
        } else if ((section === 'shockmount' || section === 'shockmount-pins') && currentState.shockmount.enabled) {
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
