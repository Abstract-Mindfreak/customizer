import { currentState, setState } from '../state.js';
import { updateUI } from '../ui-core.js';
import { initShockmount } from './shockmount.js';

// --- NEW CASE VIEWER VARS ---
let currentCaseId = null;
const cases = {};
let userImage = null;
const viewBox = { width: 5800, height: 3100 };
let sceneScale = 1;
let interactInstance = null;
let transformState = { scale: 1, tx: 0, ty: 0 };


// --- CORE INITIALIZATION ---
export function initCaseAndShockmount() {
    // New Case Viewer Init
    initCaseViewer();
    
    // Original Shockmount Logic
    initShockmount();
    
    // Unified Preview Switching
    initPreviewSwitching();
}

// --- NEW CASE VIEWER LOGIC (Adapted from ViewerApp) ---

function initCaseViewer() {
    parseSVG();
    setupCaseUI();
    setupResize();
    // Find the initially selected microphone variant and map it to a case ID
    const initialVariant = document.querySelector('.variant-button.active').dataset.variant;
    const initialCaseId = mapVariantToCase(initialVariant);
    switchCase(initialCaseId);
}

function mapVariantToCase(variant) {
    const mapping = {
        '023-the-bomblet': '_023-bomblet',
        'malfa': '_023-malfa',
        '023-dlx': '_023-deluxe',
        '017-fet': '_017-fet',
        '017-tube': '_017-tube'
    };
    return mapping[variant] || '_023-bomblet'; // Default case
}

function parseSVG() {
    const svg = document.querySelector('#svg-data svg');
    if (!svg) {
        console.error("SVG data container not found!");
        return;
    }
    const groups = svg.querySelectorAll('g[id^="_0"]');
    groups.forEach(group => {
        const id = group.id;
        const image = group.querySelector('image');
        const polygon = group.querySelector('polygon');
        const rect = group.querySelector('rect');
        if (!image || !polygon || !rect) return;

        const imageTransform = parseTransform(image.getAttribute('transform'));
        
        cases[id] = {
            id,
            image: {
                href: image.getAttribute('xlink:href') || image.getAttribute('href'),
                width: parseFloat(image.getAttribute('width')),
                height: parseFloat(image.getAttribute('height')),
                x: imageTransform.x,
                y: imageTransform.y
            },
            faceplate: parsePoints(polygon.getAttribute('points')),
            designRect: {
                x: parseFloat(rect.getAttribute('x')),
                y: parseFloat(rect.getAttribute('y')),
                width: parseFloat(rect.getAttribute('width')),
                height: parseFloat(rect.getAttribute('height')),
            }
        };
    });
}

function parseTransform(str) {
    const r = { x: 0, y: 0, scaleX: 1, scaleY: 1 };
    if (!str) return r;
    const t = str.match(/translate\(([^,]+),([^)]+)\)/);
    if (t) {
        r.x = parseFloat(t[1]);
        r.y = parseFloat(t[2]);
    }
    const s = str.match(/scale\(([^,)]+)(?:,([^)]+))?\)/);
    if (s) {
        r.scaleX = parseFloat(s[1]);
        r.scaleY = s[2] ? parseFloat(s[2]) : r.scaleX;
    }
    return r;
}

function parsePoints(pointsStr) {
    const pts = [];
    pointsStr.trim().split(/\s+/).forEach(pair => {
        const [x, y] = pair.split(',').map(parseFloat);
        pts.push({ x, y });
    });
    return pts;
}

function setupCaseUI() {
    // Hook into existing variant buttons instead of creating new ones
    document.querySelectorAll('.variant-button').forEach(btn => {
        btn.addEventListener('click', () => {
            const variantId = btn.dataset.variant;
            const caseId = mapVariantToCase(variantId);
            switchCase(caseId);
        });
    });

    // Hook into existing upload mechanism in the sidebar
    const uploadButton = document.querySelector('#submenu-case .variant-item[data-variant="custom"]');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'file-input';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    if (uploadButton) {
        uploadButton.addEventListener('click', () => fileInput.click());
    }
    
    fileInput.addEventListener('change', e => {
        if (e.target.files.length > 0) loadImage(e.target.files[0]);
    });

    // Add delete and info buttons to the case submenu for better integration
    const customSection = document.getElementById('case-custom-section');
    if (customSection) {
        const actionButtons = document.createElement('div');
        actionButtons.className = 'case-action-buttons';
        actionButtons.style.display = 'flex';
        actionButtons.style.gap = '10px';
        actionButtons.style.marginTop = '10px';

        actionButtons.innerHTML = `
            <button class="delete-btn" id="delete-btn" style="padding: 10px 16px; background: #aa3333; border: none; color: #fff; cursor: pointer; border-radius: 6px; font-size: 14px;">Delete Image</button>
            <button class="info-btn" id="info-btn" style="padding: 10px 16px; background: #444; border: none; color: #fff; cursor: pointer; border-radius: 6px; font-size: 14px;">View Info</button>
        `;
        customSection.appendChild(actionButtons);

        document.getElementById('delete-btn').addEventListener('click', () => {
            userImage = null;
            renderScene();
        });
        document.getElementById('info-btn').addEventListener('click', () => openInfoModal());
    }
    
    // Modal close events
    document.getElementById('info-close').addEventListener('click', () => {
        document.getElementById('info-modal').style.display = 'none';
    });
    document.getElementById('info-modal').addEventListener('click', e => {
        if (e.target.id === 'info-modal') e.target.style.display = 'none';
    });
}

function setupResize() {
    window.addEventListener('resize', () => updateScene());
}

function switchCase(caseId) {
    if (!cases[caseId]) {
        console.error(`Case with ID ${caseId} not found.`);
        return;
    }
    currentCaseId = caseId;
    // The main app logic handles the active state of variant buttons
    transformState = { scale: 1, tx: 0, ty: 0 };
    renderScene();
}

function loadImage(file) {
    const reader = new FileReader();
    reader.onload = e => {
        userImage = e.target.result;
        transformState = { scale: 1, tx: 0, ty: 0 };
        setState('case.customLogo', userImage); // Integrate with main state
        renderScene();
    };
    reader.readAsDataURL(file);
}

function renderScene() {
    const scene = document.getElementById('scene');
    if (!scene) return;
    scene.innerHTML = '';

    const caseData = cases[currentCaseId];
    if (!caseData) return;

    const caseImg = document.createElement('img');
    caseImg.className = 'case-image';
    caseImg.src = caseData.image.href;
    caseImg.style.width = caseData.image.width + 'px';
    caseImg.style.height = caseData.image.height + 'px';
    caseImg.style.left = caseData.image.x + 'px';
    caseImg.style.top = caseData.image.y + 'px';

    const facePlane = document.createElement('div');
    facePlane.className = 'face-plane';
    facePlane.id = 'face-plane';
    facePlane.style.width = caseData.designRect.width + 'px';
    facePlane.style.height = caseData.designRect.height + 'px';
    facePlane.style.left = caseData.designRect.x + 'px';
    facePlane.style.top = caseData.designRect.y + 'px';

    const faceContent = document.createElement('div');
    faceContent.className = 'face-content';
    faceContent.id = 'face-content';

    const currentLogo = userImage || currentState.case.customLogo;
    if (currentLogo) {
        const img = document.createElement('img');
        img.src = currentLogo;
        img.style.width = caseData.designRect.width + 'px';
        img.style.height = 'auto';
        img.style.filter = "grayscale(1) brightness(0) url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='burn' x='-20%25' y='-20%25' width='140%25' height='140%25'%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.15 0 0 0 0 0.10 0 0 0 0 0.05 0 0 0 1 0'/%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.01 0.12' numOctaves='1' seed='10' result='noise'/%3E%3CfeDisplacementMap in='SourceGraphic' in2='noise' scale='3' xChannelSelector='R' yChannelSelector='G' result='distorted'/%3E%3CfeComposite operator='in' in='distorted' in2='noise' result='burned'/%3E%3CfeGaussianBlur stdDeviation='0.4' in='burned'/%3E%3C/filter%3E%3C/svg%3E#burn\")";
        img.style.mixBlendMode = 'multiply';
        img.style.opacity = '0.9';
        faceContent.appendChild(img);
    } else {
        const ph = document.createElement('div');
        ph.className = 'placeholder';
        ph.textContent = 'Upload an image';
        faceContent.appendChild(ph);
    }

    facePlane.appendChild(faceContent);
    scene.appendChild(caseImg);
    scene.appendChild(facePlane);

    updateScene();
    setupInteract();
}

function updateScene() {
    const caseData = cases[currentCaseId];
    if (!caseData) return;

    const workspace = document.getElementById('workspace');
    const scene = document.getElementById('scene');
    const facePlane = document.getElementById('face-plane');
    if (!workspace || !scene || !facePlane) return;
    
    const rect = workspace.getBoundingClientRect();
    const scaleX = rect.width / viewBox.width;
    const scaleY = rect.height / viewBox.height;
    sceneScale = Math.min(scaleX, scaleY) * 0.9;

    scene.style.width = viewBox.width + 'px';
    scene.style.height = viewBox.height + 'px';
    scene.style.transform = `scale(${sceneScale})`;

    const srcQuad = [
        { x: 0, y: 0 },
        { x: caseData.designRect.width, y: 0 },
        { x: caseData.designRect.width, y: caseData.designRect.height },
        { x: 0, y: caseData.designRect.height }
    ];
    const dstQuad = caseData.faceplate.map(p => ({
        x: p.x - caseData.designRect.x,
        y: p.y - caseData.designRect.y
    }));
    const m = computeHomography(srcQuad, dstQuad);
    facePlane.style.transform = m;
    
    const clipPath = caseData.faceplate.map(p => {
        const relX = (p.x - caseData.designRect.x) / caseData.designRect.width * 100;
        const relY = (p.y - caseData.designRect.y) / caseData.designRect.height * 100;
        return `${relX}% ${relY}%`;
    }).join(', ');
    
    // Special case from original file
    if (currentCaseId === '_017-tube') {
      facePlane.style.clipPath = 'none';
      return;
    }
    facePlane.style.clipPath = `polygon(${clipPath})`;
}

function computeHomography(src, dst) {
    const A = [], b = [];
    for (let i = 0; i < 4; i++) {
        const sx = src[i].x, sy = src[i].y;
        const dx = dst[i].x, dy = dst[i].y;
        A.push([sx, sy, 1, 0, 0, 0, -dx * sx, -dx * sy]); b.push(dx);
        A.push([0, 0, 0, sx, sy, 1, -dy * sx, -dy * sy]); b.push(dy);
    }
    const h = solveLinearSystem(A, b);
    const [m11, m12, m14, m21, m22, m24, m41, m42] = h;
    return `matrix3d(${m11}, ${m21}, 0, ${m41}, ${m12}, ${m22}, 0, ${m42}, 0, 0, 1, 0, ${m14}, ${m24}, 0, 1)`;
}

function solveLinearSystem(A, b) {
    const n = A.length;
    const aug = A.map((row, i) => [...row, b[i]]);
    for (let i = 0; i < n; i++) {
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(aug[k][i]) > Math.abs(aug[maxRow][i])) maxRow = k;
        }
        [aug[i], aug[maxRow]] = [aug[maxRow], aug[i]];
        for (let k = i + 1; k < n; k++) {
            const f = aug[k][i] / aug[i][i];
            for (let j = i; j < n + 1; j++) aug[k][j] -= f * aug[i][j];
        }
    }
    const x = new Array(n);
    for (let i = n - 1; i >= 0; i--) {
        x[i] = aug[i][n];
        for (let j = i + 1; j < n; j++) x[i] -= aug[i][j] * x[j];
        x[i] /= aug[i][i];
    }
    return x;
}

function setupInteract() {
    const faceContent = document.getElementById('face-content');
    if (!faceContent) return;
    if (interactInstance) interactInstance.unset();

    let { scale, tx, ty } = transformState;
    const apply = () => {
        faceContent.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
        transformState = { scale, tx, ty };
        // Optional: Update main state for persistence
        setState('case.logoTransform', { x: tx, y: ty, scale: scale });
    };

    interactInstance = interact(faceContent)
        .draggable({
            inertia: true,
            listeners: {
                move: (event) => {
                    tx += event.dx / scale;
                    ty += event.dy / scale;
                    apply();
                }
            }
        })
        .gesturable({
            listeners: {
                move: (event) => {
                    scale *= (1 + event.ds * 0.4);
                    scale = Math.max(0.1, Math.min(10, scale));
                    apply();
                }
            }
        });

    faceContent.addEventListener('wheel', e => {
        e.preventDefault();
        const rect = faceContent.getBoundingClientRect();
        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;
        const delta = -e.deltaY * 0.0007;
        const prev = scale;
        scale *= (1 + delta);
        scale = Math.max(0.1, Math.min(10, scale));
        const k = scale / prev;
        tx = cx - (cx - tx) * k;
        ty = cy - (cy - ty) * k;
        apply();
    }, { passive: false });

    apply(); // Apply initial transform
}

function openInfoModal() {
    const modal = document.getElementById('info-modal');
    document.getElementById('info-case').textContent = currentCaseId || '-';
    document.getElementById('info-image-state').textContent = userImage ? 'Yes' : 'No';
    const { tx, ty, scale } = transformState;
    document.getElementById('info-x').textContent = tx.toFixed(1);
    document.getElementById('info-y').textContent = ty.toFixed(1);
    document.getElementById('info-scale').textContent = scale.toFixed(3);
    
    let w = '-', h = '-';
    const faceContent = document.getElementById('face-content');
    if (faceContent) {
        const img = faceContent.querySelector('img');
        if (img) {
            w = img.naturalWidth || img.width;
            h = img.naturalHeight || img.height;
        }
    }
    document.getElementById('info-size').textContent = `${w} × ${h}`;
    
    const imgPreview = document.getElementById('info-image-preview');
    if (userImage) {
        imgPreview.src = userImage;
    } else {
        imgPreview.removeAttribute('src');
    }

    modal.style.display = 'flex';
}

// --- PREVIEW SWITCHING LOGIC ---

export function initPreviewSwitching() {
    const previewArea = document.querySelector('.preview-area');
    const switchContainer = document.createElement('div');
    switchContainer.className = 'preview-switch-container';
    switchContainer.innerHTML = `
        <button class="preview-switch-btn active" data-preview="microphone">Микрофон</button>
        <button class="preview-switch-btn" data-preview="case">Деревянный футляр</button>
        <button class="preview-switch-btn" data-preview="shockmount" id="shockmount-preview-btn">Подвес</button>
    `;
    
    previewArea.insertBefore(switchContainer, previewArea.firstChild);
    
    switchContainer.querySelectorAll('.preview-switch-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchPreview(this.dataset.preview);
        });
    });
}

export function switchPreview(previewType) {
    document.querySelectorAll('.preview-switch-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-preview="${previewType}"]`).classList.add('active');
    
    document.getElementById('svg-wrapper').style.display = 'none';
    document.getElementById('case-preview-container').style.display = 'none';
    document.getElementById('shockmount-preview-container').style.display = 'none';
    
    switch(previewType) {
        case 'microphone':
            document.getElementById('svg-wrapper').style.display = 'flex';
            break;
        case 'case':
            document.getElementById('case-preview-container').style.display = 'flex';
            setTimeout(() => {
                updateScene(); // Recalculate size when shown
            }, 0);
            break;
        case 'shockmount':
            document.getElementById('shockmount-preview-container').style.display = 'flex';
            break;
    }
}


// Placeholder for functions that were in the old file but are not part of the new logic
export function handleCaseVariantSelection() { 
    // This is now handled by the main variant switch listener
}
export function uploadCaseLogo() {
    // This is now handled by the integrated file input
}
