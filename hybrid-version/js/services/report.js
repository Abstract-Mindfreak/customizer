import { currentState } from '../state.js';
import { CONFIG, variantNames } from '../config.js';
import { computePrices } from '../compute-layer.js';

/**
 * Converts Base64 data to Blob with extra checks
 */
function base64ToBlob(base64Data, contentType = 'image/png') {
    try {
        if (!base64Data || typeof base64Data !== 'string' || !base64Data.includes('base64')) {
            console.warn('⚠️ Invalid Base64 data provided');
            return null;
        }

        const base64 = base64Data.split(',')[1];
        if (!base64) {
            console.warn('⚠️ Base64 part is empty');
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
        console.error('❌ Base64 to Blob conversion failed:', e);
        return null;
    }
}

/**
 * Creates SVG preview of the current microphone state
 */
function createMicrophonePreview() {
    const svgWrapper = document.getElementById('svg-wrapper');
    const svg = svgWrapper ? svgWrapper.querySelector('svg') : null;
    if (!svg) return null;

    const svgClone = svg.cloneNode(true);
    svgClone.setAttribute('width', '1200');
    svgClone.setAttribute('height', '900');
    svgClone.setAttribute('viewBox', '0 0 800 600');

    const svgString = new XMLSerializer().serializeToString(svgClone);
    return new Blob([svgString], { type: 'image/svg+xml' });
}

export async function sendOrder(clientData) {
    console.log('🚀 sendOrder Hybrid started', clientData);

    const appRoot = document.getElementById('customizer-app-root');
    const ajaxPath = appRoot?.dataset?.ajaxPath || '/local/components/custom/microphone.customizer/ajax.php';
    const sessid = appRoot?.dataset?.sessid || (window.BX ? window.BX.bitrix_sessid() : '');

    const formData = new FormData();
    formData.append('action', 'createOrder');
    formData.append('sessid', sessid);

    // Client Info
    formData.append('USER', window.BX_USER_DATA?.ID || '');
    formData.append('NAME', clientData.name || '');
    formData.append('LAST_NAME', clientData.lastname || '');
    formData.append('EMAIL', clientData.email || '');
    formData.append('PHONE', clientData.phone || '');
    formData.append('CITY', clientData.city || '');
    formData.append('COUNTRY', clientData.country || '');
    formData.append('COMMENT', clientData.comment || '');

    // Configuration Info
    const modelStr = `Soyuz ${currentState.model.toUpperCase()} - ${currentState.variant.toUpperCase()}`;
    formData.append('MIC_MODEL', modelStr);
    formData.append('MIC_SPHERES', currentState.spheres.color || variantNames[currentState.spheres.variant] || currentState.spheres.variant);
    formData.append('MIC_BODY', currentState.body.color || variantNames[currentState.body.variant] || currentState.body.variant);
    formData.append('MIC_LOGO_TYPE', currentState.logo.customLogo ? 'CUSTOM' : (currentState.logo.variant || 'STANDARD'));
    formData.append('MIC_LOGO_BG', currentState.logo.bgColor || 'black');

    // Shockmount
    formData.append('SHOCKMOUNT_ENABLED', currentState.shockmount.enabled ? 'Y' : 'N');
    formData.append('SHOCKMOUNT_COLOR', currentState.shockmount.color || currentState.shockmount.variant || '');
    formData.append('SHOCKMOUNT_PINS', currentState.shockmount.pins?.variant || currentState.shockmount.pins || '');

    // Woodcase
    formData.append('WOODCASE_VARIANT', currentState.case.variant || 'standard');
    const { logoWidthMM, logoOffsetMM } = currentState.case;
    const woodcaseDesk = `W:${logoWidthMM}mm, Top:${logoOffsetMM?.top}mm, Left:${logoOffsetMM?.left}mm`;
    formData.append('WOODCASE_IMAGE_DESK', woodcaseDesk);

    // Files handling
    if (currentState.logo.customLogo) {
        const blob = base64ToBlob(currentState.logo.customLogo);
        if (blob) formData.append('MIC_LOGO_CUSTOM', blob, 'mic_logo.png');
    }

    if (currentState.case.customLogo) {
        const blob = base64ToBlob(currentState.case.customLogo);
        if (blob) formData.append('WOODCASE_IMAGE', blob, 'case_logo.png');
    }

    const previewBlob = createMicrophonePreview();
    if (previewBlob) {
        formData.append('PREVIEW_MIC_CUSTOM', previewBlob, 'preview.svg');
    }

    // Pricing
    const prices = computePrices(currentState);
    formData.append('PRICE', `${prices.total} RUB`);

    // Logging FormData for debugging
    console.log('📋 FormData contents:');
    for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value instanceof Blob ? `Blob (${value.type}, ${value.size} bytes)` : value);
    }

    try {
        const response = await fetch(ajaxPath, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        console.log('📨 Server Response:', data);

        if (data.success) {
            alert(`Order #${data.orderId} created successfully!`);
            // Clean up UI
            const orderModal = document.getElementById('order-modal');
            if (orderModal) orderModal.style.display = 'none';
        } else {
            throw new Error(data.error || 'Server error');
        }
    } catch (e) {
        console.error('❌ Order submission failed:', e);
        alert('Failed to send order: ' + e.message);
    }
}
