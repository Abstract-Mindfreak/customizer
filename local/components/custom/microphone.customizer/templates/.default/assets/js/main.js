import { initEventListeners, updateUI } from './ui-core.js';
import { initPalettes } from './modules/appearance.js';
import { initCaseAndShockmount } from './modules/accessories.js';
import { init as initLogo } from './modules/logo.js';
import { initializeWoodCase } from './modules/wood-case.js';
import { initShockmount } from './modules/shockmount.js';
import { loadSVG } from './engine.js';
import { initValidation } from './services/validation.js';
import { preloadImages, getDevice } from './utils.js';
import { CASE_IMAGES, CASE_GEOMETRY } from './config.js';
import { currentState, setInitialConfig } from './state.js';
import * as cameraEffect from './modules/camera-effect.js';

document.addEventListener('DOMContentLoaded', async () => {
    const appRoot = document.getElementById('customizer-app-root');
    const elementId = appRoot ? parseInt(appRoot.dataset.elementId) : 0;
    
    if (window.BX_USER_DATA && window.BX_USER_DATA.AUTHORIZED) {
        const userData = window.BX_USER_DATA;
        
        const nameField = document.getElementById('input-name');
        const emailField = document.getElementById('input-email');
        const phoneField = document.getElementById('input-phone');
        const countryField = document.getElementById('input-country');
        const cityField = document.getElementById('input-city');
        
        if (nameField && userData.NAME) nameField.value = userData.NAME;
        if (emailField && userData.EMAIL) emailField.value = userData.EMAIL;
        if (phoneField) {
            // Телефон нужно получить из профиля пользователя
            // Это поле может отсутствовать в стандартных данных
            const userPhone = userData.PERSONAL_PHONE || userData.PHONE || '';
            phoneField.value = userPhone;
        }
        if (countryField && userData.PERSONAL_COUNTRY) countryField.value = userData.PERSONAL_COUNTRY;
        if (cityField && userData.PERSONAL_CITY) cityField.value = userData.PERSONAL_CITY;
    }
    
    if (elementId > 0) {
        // Если есть ID товара, пытаемся загрузить его конфигурацию
        try {
            const ajaxPath = appRoot.dataset.ajaxPath;
            const sessid = appRoot.dataset.sessid;
            const response = await fetch(ajaxPath, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=loadConfig&element_id=${elementId}&sessid=${sessid}`
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.config) {
                    // Загружаем конфигурацию товара
                    Object.assign(currentState, data.config);
                    setInitialConfig(data.config);
                }
            }
        } catch (e) {
            console.warn("Failed to load element config, using defaults:", e);
        }
    } else {
        // Автономный режим - используем конфигурацию по умолчанию
        setInitialConfig(currentState);
    }

    // Preload essential images
    const device = getDevice(CASE_GEOMETRY.res);
    const imagesToPreload = Object.values(CASE_IMAGES).map(imgSet => imgSet[device]);
    preloadImages(imagesToPreload);

    await loadSVG();
    console.log('SVG загружен');

    // NEW: Initialize camera animation after SVG is loaded
    cameraEffect.initCameraEffect(currentState.variant);
    console.log('Camera effect initialized');

    initPalettes();
    initEventListeners();
    initCaseAndShockmount();
    initValidation();
    initLogo();
    initializeWoodCase();
    initShockmount(); // This is called inside initCaseAndShockmount, no need to call again

    updateUI();

    // Initial animation
    setTimeout(() => {
        document.querySelectorAll('.menu-item').forEach((item, i) => {
            setTimeout(() => item.classList.add('animate-in'), i * 100);
        });
    }, 300);

    // NEW HELPER FUNCTION FOR TASK 5
    // The 'appRoot' variable is already defined at the top of the DOMContentLoaded listener.
    if (appRoot) {
        function sendCustomizerForm(dataJson, files) {
            const formData = new FormData();
            formData.append("sessid", appRoot.dataset.sessid);
            formData.append("action", "createOrder");
            formData.append("config_json", JSON.stringify(dataJson));

            // Attach files
            for (const [key, file] of Object.entries(files)) {
                formData.append(key, file);
            }

            fetch(appRoot.dataset.ajaxPath, {
                method: "POST",
                body: formData
            })
            .then(r => r.json())
            .then(resp => {
                if (resp.success) {
                    alert("Заказ успешно отправлен! ID: " + resp.orderId);
                } else {
                    console.error(resp.error);
                    alert("Ошибка отправки: " + resp.error);
                }
            })
            .catch(e => {
                console.error(e);
                alert("Ошибка сети при отправке");
            });
        }
        window.sendCustomizerForm = sendCustomizerForm;
    }
});
