import { currentState } from '../state.js';
import { CONFIG, variantNames } from '../config.js';

export function generateReport(clientData) {
    const reportModal = document.getElementById('report-modal');
    
    document.getElementById('report-name').textContent = clientData.fullname;
    document.getElementById('report-phone').textContent = clientData.phone;
    document.getElementById('report-email').textContent = clientData.email;
    document.getElementById('report-comment').textContent = clientData.comment || 'Нет комментария';
    document.getElementById('report-comment').title = clientData.comment || '';

    // Task 6: Update Report Labels
    const sphereDesc = currentState.spheres.color ? `RAL ${currentState.spheres.color.replace('RAL ', '')}` : variantNames[currentState.spheres.variant];
    const bodyDesc = currentState.body.color ? `RAL ${currentState.body.color.replace('RAL ', '')}` : variantNames[currentState.body.variant];
    
    let logoDesc = 'Стандартный (Золото)';
    if (currentState.logo.customLogo) logoDesc = 'Собственное изображение';
    else if (currentState.logo.variant === 'malfa') logoDesc = 'MALFA';
    else if (currentState.logo.bgColor !== 'black') logoDesc = `Цвет эмали RAL K7 ${currentState.logo.bgColor.replace('RAL ', '')}`;
    else if (currentState.logo.variant === 'silver') logoDesc = 'Холодный хром';

    document.getElementById('report-model').textContent = `Союз ${currentState.model} - ${currentState.variant.toUpperCase()}`;
    document.getElementById('report-spheres').textContent = sphereDesc;
    document.getElementById('report-body').textContent = bodyDesc;
    document.getElementById('report-logo').textContent = logoDesc;

    // Update case and shockmount report info
    let caseDesc = 'Стандарт (Логотип Soyuz)';
    if (currentState.case.variant === 'custom' && currentState.case.customLogo) {
        const { top, left } = currentState.case.logoOffsetMM;
        const size = currentState.case.logoWidthMM;
        caseDesc = `Собственный логотип (Ш: ${size}мм, Сверху: ${top}мм, Слева: ${left}мм)`;
    }
    document.getElementById('report-case').textContent = caseDesc;
    
    const shockmountRow = document.getElementById('report-shockmount-row');
    const shockmountPinsRow = document.getElementById('report-shockmount-pins-row');

    if (currentState.shockmount.enabled) {
        shockmountRow.style.display = 'flex';
        document.getElementById('report-shockmount').textContent = `${currentState.shockmount.color || currentState.shockmount.variant}`;
        
        shockmountPinsRow.style.display = 'flex';
        const pinDesc = currentState.shockmount.pins.variant === 'brass' ? 'Полированная латунь' : `${currentState.shockmount.pins.variant}`;
        document.getElementById('report-shockmount-pins').textContent = `${pinDesc}`;
    } else {
        shockmountRow.style.display = 'none';
        shockmountPinsRow.style.display = 'none';
    }

    // Handle hidden inputs for custom logos
    const hiddenInput = document.getElementById('report-custom-logo-data');
    if (currentState.logo.customLogo) {
        hiddenInput.value = currentState.logo.customLogo;
    } else {
        hiddenInput.value = '';
    }

    const caseHiddenInput = document.getElementById('report-case-logo-data');
    if (currentState.case.customLogo) {
        caseHiddenInput.value = currentState.case.customLogo;
    } else {
        caseHiddenInput.value = '';
    }

    const total = CONFIG.basePrice + currentState.prices.spheres + currentState.prices.body + currentState.prices.logo + currentState.prices.case + currentState.prices.shockmount;
    document.getElementById('report-total-price').textContent = `${total}₽`;

    const visualContainer = document.getElementById('report-visual-container');
    visualContainer.innerHTML = '';

    // Create Grid Wrapper
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
    grid.style.gap = '20px';
    grid.style.alignItems = 'start';
    grid.style.width = '100%';

    // 1. Microphone Visual
    const micCell = document.createElement('div');
    micCell.style.display = 'flex';
    micCell.style.flexDirection = 'column';
    micCell.style.alignItems = 'center';
    micCell.innerHTML = '<h4 style="margin-bottom: 10px;">Микрофон</h4>';
    
    try {
        const originalSvg = document.querySelector('#svg-wrapper svg');
        const svgClone = originalSvg.cloneNode(true);
        svgClone.removeAttribute('id');
        svgClone.style.transform = 'scale(1)'; 
        svgClone.style.height = '300px';
        svgClone.style.width = 'auto';

        // Handle Custom Logo in Clone
        if (currentState.logo.customLogo) {
            // Remove standard logo parts from clone
            ['logotype-gold', 'logo-bg-black', 'logo-bg-colorized', 'logo-bg-monochrome', 'logo-letters-and-frame'].forEach(id => {
                const el = svgClone.querySelector(`#${id}`);
                if (el) el.remove();
            });
            
            // Ensure custom layer exists or recreate it
            let customLayer = svgClone.querySelector('#custom-logo-layer');
            if (!customLayer) {
                customLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
                customLayer.id = 'custom-logo-layer';
                const img = document.createElementNS("http://www.w3.org/2000/svg", "image");
                img.setAttribute('width', '300');
                img.setAttribute('height', '350');
                img.setAttribute('x', '150');
                img.setAttribute('y', '1117');
                img.setAttribute('href', currentState.logo.customLogo);
                customLayer.appendChild(img);
                svgClone.appendChild(customLayer);
            }
        }
        micCell.appendChild(svgClone);
    } catch (error) {
        console.error('Mic report generation failed:', error);
        micCell.innerHTML += 'Ошибка визуализации';
    }
    grid.appendChild(micCell);

    // 2. Case Visual
    const caseCell = document.createElement('div');
    caseCell.style.display = 'flex';
    caseCell.style.flexDirection = 'column';
    caseCell.style.alignItems = 'center';
    caseCell.innerHTML = '<h4 style="margin-bottom: 10px;">Деревянный футляр</h4>';
    
    const casePreview = document.getElementById('case-preview-container');
    if (casePreview) {
        const wrapper = document.createElement('div');
        wrapper.style.width = '250px';
        wrapper.style.height = '250px';
        wrapper.style.overflow = 'hidden';
        wrapper.style.position = 'relative';
        
        const caseClone = casePreview.cloneNode(true);
        caseClone.removeAttribute('id');
        caseClone.style.display = 'flex';
        caseClone.style.position = 'absolute';
        caseClone.style.top = '0';
        caseClone.style.left = '0';
        caseClone.style.transform = 'scale(0.25)'; 
        caseClone.style.transformOrigin = 'top left';
        
        caseClone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
        
        wrapper.appendChild(caseClone);
        caseCell.appendChild(wrapper);
    }
    grid.appendChild(caseCell);

    // 3. Shockmount Visual
    const smCell = document.createElement('div');
    smCell.style.display = 'flex';
    smCell.style.flexDirection = 'column';
    smCell.style.alignItems = 'center';
    smCell.innerHTML = '<h4 style="margin-bottom: 10px;">Подвес</h4>';
    
    const smPreview = document.getElementById('shockmount-preview-container');
    if (smPreview) {
        const smClone = smPreview.cloneNode(true);
        smClone.removeAttribute('id');
        smClone.style.display = 'flex';
        smClone.style.height = '250px';
        smClone.style.width = 'auto';
        smClone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
        smCell.appendChild(smClone);
    }
    grid.appendChild(smCell);

    // 4. Custom Mic Logo (Raw)
    if (currentState.logo.customLogo) {
        const logoCell = document.createElement('div');
        logoCell.style.display = 'flex';
        logoCell.style.flexDirection = 'column';
        logoCell.style.alignItems = 'center';
        logoCell.innerHTML = '<h4 style="margin-bottom: 10px;">Эмблема (Микрофон)</h4>';
        
        const img = document.createElement('img');
        img.src = currentState.logo.customLogo;
        img.style.maxWidth = '150px';
        img.style.maxHeight = '150px';
        img.style.objectFit = 'contain';
        img.style.border = '1px solid #ccc';
        
        logoCell.appendChild(img);
        grid.appendChild(logoCell);
    }

    // 5. Custom Case Logo (Raw)
    if (currentState.case.customLogo) {
        const logoCell = document.createElement('div');
        logoCell.style.display = 'flex';
        logoCell.style.flexDirection = 'column';
        logoCell.style.alignItems = 'center';
        logoCell.innerHTML = '<h4 style="margin-bottom: 10px;">Персонализация крышки</h4>';
        
        const img = document.createElement('img');
        img.src = currentState.case.customLogo;
        img.style.maxWidth = '150px';
        img.style.maxHeight = '150px';
        img.style.objectFit = 'contain';
        img.style.border = '1px solid #ccc';
        
        logoCell.appendChild(img);
        grid.appendChild(logoCell);
    }

    visualContainer.appendChild(grid);

    reportModal.style.display = 'flex';
    window.closeReportModal = () => reportModal.style.display = 'none';
}
