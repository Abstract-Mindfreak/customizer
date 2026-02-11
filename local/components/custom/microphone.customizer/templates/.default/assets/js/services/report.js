import { currentState } from '../state.js';
import { CONFIG, variantNames } from '../config.js';

// Функция для конвертации Base64 в Blob
function base64ToBlob(base64Data, contentType = 'image/png') {
    try {
        // Проверяем на наличие данных и Base64 формат
        if (!base64Data || typeof base64Data !== 'string' || !base64Data.includes('base64')) {
            console.warn('⚠️ Некорректные Base64 данные:', base64Data);
            return null;
        }
        
        // Удаляем префикс data:image/...;base64,
        const base64 = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
        if (!base64) {
            console.warn('⚠️ Пустые Base64 данные после очистки');
            return null;
        }
        
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: contentType });
    } catch (e) {
        console.error('Error converting base64 to blob:', e);
        return null;
    }
}

// Функция для создания SVG превью микрофона
function createMicrophonePreview() {
    const svgWrapper = document.getElementById('svg-wrapper');
    if (!svgWrapper || !svgWrapper.querySelector('svg')) return null;
    
    const svgClone = svgWrapper.querySelector('svg').cloneNode(true);
    svgClone.setAttribute('width', '200');
    svgClone.setAttribute('height', '150');
    svgClone.setAttribute('viewBox', '0 0 800 600');
    
    const svgString = new XMLSerializer().serializeToString(svgClone);
    return new Blob([svgString], { type: 'image/svg+xml' });
}

export async function sendOrder(clientData) {
    console.log('🚀 Функция sendOrder вызвана!', clientData);
    
    // Инициализация pins если отсутствует
    if (!currentState.shockmount.pins) {
        currentState.shockmount.pins = { variant: 'pins-RAL9003' };
    }
    
    console.log('🚀 Начинаю отправку заказа');
    
    const appRoot = document.getElementById('customizer-app-root');
    const ajaxPath = appRoot.dataset.ajaxPath;
    const sessid = appRoot.dataset.sessid;
    
    // Создаем FormData
    const formData = new FormData();
    formData.append('action', 'createOrder'); // Добавляем action!
    formData.append('sessid', sessid);
    console.log('📋 FormData создана');
    
    // Личные данные
    formData.append('USER', window.BX_USER_DATA?.ID || '');
    formData.append('LAST_NAME', clientData.lastname || '');
    formData.append('NAME', clientData.name || '');
    formData.append('CITY', clientData.city || '');
    formData.append('COUNTRY', clientData.country || '');
    formData.append('EMAIL', clientData.email || '');
    formData.append('PHONE', clientData.phone || '');
    formData.append('COMMENT', clientData.comment || '');
    
    // Данные микрофона
    formData.append('MIC_MODEL', `Союз ${currentState.model.toUpperCase()} - ${currentState.variant.toUpperCase()}`);
    formData.append('MIC_SPHERES', currentState.spheres.color || variantNames[currentState.spheres.variant]);
    formData.append('MIC_BODY', currentState.body.color || variantNames[currentState.body.variant]);
    formData.append('MIC_LOGO_TYPE', currentState.logo.customLogo ? 'CUSTOM' : 'STANDARD');
    formData.append('MIC_LOGO_BG', currentState.logo.bgColor || 'black');
    
    // Логотипы и файлы
    if (currentState.logo.customLogo && currentState.logo.customLogo.includes('base64')) {
        const logoBlob = base64ToBlob(currentState.logo.customLogo);
        if (logoBlob) {
            formData.append('MIC_LOGO_CUSTOM', logoBlob, 'custom_logo.png');
            console.log('🖼️ Логотип микрофона добавлен');
        }
    }
    
    // Данные подвеса
    formData.append('SHOCKMOUNT_ENABLED', currentState.shockmount.enabled ? 'Y' : 'N');
    formData.append('SHOCKMOUNT_COLOR', currentState.shockmount.color || currentState.shockmount.variant || 'Standard');
    formData.append('SHOCKMOUNT_PINS', currentState.shockmount.pins?.variant || 'pins-RAL9003');
    
    // Данные кейса
    formData.append('WOODCASE_VARIANT', currentState.case.variant);
    if (currentState.case.customLogo && currentState.case.customLogo.includes('base64')) {
        const caseBlob = base64ToBlob(currentState.case.customLogo);
        if (caseBlob) {
            formData.append('WOODCASE_IMAGE', caseBlob, 'wood_case_logo.png');
            console.log('🖼️ Логотип кейса добавлен');
        }
    }
    
    // Превью микрофона
    const previewBlob = createMicrophonePreview();
    if (previewBlob) {
        formData.append('PREVIEW_MIC_CUSTOM', previewBlob, 'microphone_preview.svg');
        console.log('📄 Превью микрофона добавлено');
    }
    
    // Подвес
    if (currentState.shockmount.enabled) {
        formData.append('SHOCKMOUNT_COLOR', currentState.shockmount.color || currentState.shockmount.variant);
        formData.append('SHOCKMOUNT_PINS', currentState.shockmount.pins.variant || 'RAL9003');
    }
    
    // Кейс параметры
    const { logoWidthMM, logoOffsetMM } = currentState.case;
    const woodcaseDesk = `Ш:${logoWidthMM}мм, Сверху:${logoOffsetMM.top}мм, Слева:${logoOffsetMM.left}мм`;
    formData.append('WOODCASE_IMAGE_DESK', woodcaseDesk);
    
    // Финансы
    const totalPrice = CONFIG.basePrice + currentState.prices.spheres + currentState.prices.body + 
                      currentState.prices.logo + currentState.prices.case + currentState.prices.shockmount;
    const priceDetails = [];
    if (currentState.prices.spheres > 0) priceDetails.push('Цвет силуэта');
    if (currentState.prices.body > 0) priceDetails.push('Цвет корпуса');
    if (currentState.prices.logo > 0) priceDetails.push('Кастом лого');
    if (currentState.prices.case > 0) priceDetails.push('Кейс');
    if (currentState.prices.shockmount > 0) priceDetails.push('Подвес');
    
    const priceString = priceDetails.length > 0 ? 
        `${totalPrice}р (База + ${priceDetails.join(' + ')})` : 
        `${totalPrice}р`;
    console.log('💰 Final Price:', priceString);
    formData.append('PRICE', priceString);
    
    // Выводим весь FormData для отладки
    console.log('📋 FormData содержимое:');
    for (var pair of formData.entries()) {
        console.log(pair[0] + ':', pair[1]);
    }
    
    console.log('📤 Отправляю запрос в ajax.php');
    
    // Отправляем запрос
    fetch(ajaxPath, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('📨 Ответ от Битрикса получен:', data);
        
        if (data.success) {
            // Показываем простое сообщение об успехе
            const message = `Спасибо! Ваша конфигурация сохранена. В ближайшее время мы с Вами свяжемся. Номер вашей заявки: ${data.orderId}`;
            alert(message);
            
            // Закрываем модальное окно заказа
            const orderModal = document.getElementById('order-modal');
            if (orderModal) {
                orderModal.style.display = 'none';
            }
            
            // Очищаем и блокируем форму для избежания дублей
            const orderForm = document.getElementById('order-form');
            const submitBtn = orderForm ? orderForm.querySelector('button[type="submit"]') : null;
            
            if (orderForm) {
                // Очищаем все поля формы
                orderForm.reset();
                
                // Удаляем классы ошибок
                orderForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
            }
            
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Отправлено';
            }
            
        } else {
            console.error('❌ Ошибка сервера:', data.error);
            alert('Ошибка при отправке заявки: ' + (data.error || 'Неизвестная ошибка'));
        }
    })
    .catch(error => {
        console.error('❌ Ошибка сети:', error);
        alert('Ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.');
    });
}

export function generateReport(clientData) {
    // Функция больше не генерирует визуальное превью
    // Все данные передаются через sendOrder
    console.log('📊 generateReport вызван, но визуальная генерация отключена');
}
