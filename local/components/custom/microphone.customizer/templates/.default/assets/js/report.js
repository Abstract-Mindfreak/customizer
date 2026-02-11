async function sendOrder(orderData) {
    console.log('🚀 sendOrder called!', orderData);

    try {
        const formData = new FormData();

        // Action and session
        formData.append('action', 'createOrder');
        formData.append('sessid', BX.bitrix_sessid());

        // User data
        formData.append('USER', orderData.userId || 1);
        formData.append('LAST_NAME', orderData.lastname);
        formData.append('NAME', orderData.name);
        formData.append('CITY', orderData.city || '');
        formData.append('COUNTRY', orderData.country || '');
        formData.append('EMAIL', orderData.email);
        formData.append('PHONE', orderData.phone);
        formData.append('COMMENT', orderData.comment || '');

        // Microphone data
        formData.append('MIC_MODEL', orderData.micModel);
        formData.append('MIC_SPHERES', orderData.micSpheres || '');
        formData.append('MIC_BODY', orderData.micBody || '');
        formData.append('MIC_LOGO_TYPE', orderData.micLogoType || '');
        formData.append('MIC_LOGO_BG', orderData.micLogoBg || '');
        formData.append('SHOCKMOUNT_ENABLED', orderData.shockmountEnabled || 'N');
        formData.append('SHOCKMOUNT_COLOR', orderData.shockmountColor || '');
        formData.append('SHOCKMOUNT_PINS', orderData.shockmountPins || '');
        formData.append('WOODCASE_VARIANT', orderData.woodcaseVariant || '');
        formData.append('WOODCASE_IMAGE_DESK', orderData.woodcaseImageDesk || '');
        formData.append('PRICE', orderData.price);

        // 🔴 CRITICAL: Add files correctly
        if (orderData.woodcaseImage) {
            formData.append('WOODCASE_IMAGE', orderData.woodcaseImage);
        }

        if (orderData.previewMicCustom) {
            formData.append('PREVIEW_MIC_CUSTOM', orderData.previewMicCustom);
        }

        const response = await fetch('/local/ajax/ajax.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            return result;
        } else {
            throw new Error(result.error || 'Error creating order');
        }

    } catch (error) {
        console.error('❌ Order send error:', error);
        throw error;
    }
}

// Generate snapshot image for order
function renderSnapshotImage(state) {
    return new Promise((resolve, reject) => {
        try {
            // Get SVG containers
            const woodcaseSvg = document.querySelector('#woodcase-preview-container svg');
            const shockmountSvg = document.querySelector('#shockmount-preview-container svg');
            const micSvg = document.querySelector('#mic-preview-container svg');

            if (!woodcaseSvg || !micSvg) {
                reject(new Error('SVG containers not found'));
                return;
            }

            // Create composite SVG
            const compositeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            compositeSvg.setAttribute('width', '1200');
            compositeSvg.setAttribute('height', '900');
            compositeSvg.setAttribute('viewBox', '0 0 1200 900');

            // Clone and append layers
            if (woodcaseSvg) {
                const woodcaseClone = woodcaseSvg.cloneNode(true);
                compositeSvg.appendChild(woodcaseClone);
            }

            if (state.shockmount.enabled && shockmountSvg) {
                const shockmountClone = shockmountSvg.cloneNode(true);
                compositeSvg.appendChild(shockmountClone);
            }

            const micClone = micSvg.cloneNode(true);
            compositeSvg.appendChild(micClone);

            // Convert SVG to canvas
            const svgData = new XMLSerializer().serializeToString(compositeSvg);
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const svgUrl = URL.createObjectURL(svgBlob);

            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = 1200;
                canvas.height = 900;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, 1200, 900);

                // Convert to PNG
                canvas.toBlob((blob) => {
                    URL.revokeObjectURL(svgUrl);
                    resolve(blob);
                }, 'image/png', 0.95);
            };

            img.onerror = (e) => {
                URL.revokeObjectURL(svgUrl);
                reject(new Error('Failed to load SVG image'));
            };

            img.src = svgUrl;
        } catch (error) {
            reject(error);
        }
    });
}

export { sendOrder, renderSnapshotImage };
