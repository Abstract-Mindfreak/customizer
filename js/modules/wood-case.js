import { setState, currentState } from '../state.js';

const IMAGES = {
    '017-tube': { mobile: 'https://soyuzmicrophones.ru/image/custom/case_017_tube_mobile.png', tablet: 'https://soyuzmicrophones.ru/image/custom/case_017_tube_tablet.png', desktop: 'https://soyuzmicrophones.ru/image/custom/case_017_tube_desktop.png', _4k: 'https://soyuzmicrophones.ru/image/custom/case_017_tube_4k.png' },
    '017-fet': { mobile: 'https://soyuzmicrophones.ru/image/custom/case_017_fet-023_dlx_mobile.png', tablet: 'https://soyuzmicrophones.ru/image/custom/case_017_fet-023_dlx_tablet.png', desktop: 'https://soyuzmicrophones.ru/image/custom/case_017_fet-023_dlx_desktop.png', _4k: 'https://soyuzmicrophones.ru/image/custom/case_017_fet-023_dlx_4k.png' },
    '023-deluxe': { mobile: 'https://soyuzmicrophones.ru/image/custom/case_017_fet-023_dlx_mobile.png', tablet: 'https://soyuzmicrophones.ru/image/custom/case_017_fet-023_dlx_tablet.png', desktop: 'https://soyuzmicrophones.ru/image/custom/case_017_fet-023_dlx_desktop.png', _4k: 'https://soyuzmicrophones.ru/image/custom/case_017_fet-023_dlx_4k.png' },
    '023-bomblet': { mobile: 'https://soyuzmicrophones.ru/image/custom/case_023thebomblet-23_malfa_mobile.png', tablet: 'https://soyuzmicrophones.ru/image/custom/case_023thebomblet-23_malfa_tablet.png', desktop: 'https://soyuzmicrophones.ru/image/custom/case_023thebomblet-23_malfa_desktop.png', _4k: 'https://soyuzmicrophones.ru/image/custom/case_023thebomblet-23_malfa_4k.png' },
    '023-malfa': { mobile: 'https://soyuzmicrophones.ru/image/custom/case_023thebomblet-23_malfa_mobile.png', tablet: 'https://soyuzmicrophones.ru/image/custom/case_023thebomblet-23_malfa_tablet.png', desktop: 'https://soyuzmicrophones.ru/image/custom/case_023thebomblet-23_malfa_desktop.png', _4k: 'https://soyuzmicrophones.ru/image/custom/case_023thebomblet-23_malfa_4k.png' }
};

const GEOMETRY = {
    res: { mobile: { max: 767, vb: "0 0 750 1334" }, tablet: { max: 1024, vb: "0 0 1024 768" }, desktop: { max: 2560, vb: "0 0 1920 1080" }, _4k: { max: 9999, vb: "0 0 3840 2160" } },
    cases: {
        '017-tube': { mm: 550, startConfig: { wMM: 160, yOffsetMM: 50 }, mobile: { x: 2.1, y: 88.55, w: 757, h: 431, poly: [746.33,105.59, 746.02,478.65, 33.85,511.99, 27.12,103.51] }, tablet: { x: 17.68, y: 116.72, w: 1009, h: 574, poly: [1004.24,139.31, 1003.83,633.85, 59.76,678.04, 50.84,136.54] }, desktop: { x: 50.31, y: 156.84, w: 1472, h: 838, poly: [1524.18,190.6, 1523.57,929.4, 113.18,995.43, 99.85,186.46] }, _4k: { x: 88.19, y: 329.76, w: 2775, h: 1580, poly: [2857.65,393.18, 2856.5,1781.43, 206.33,1905.49, 181.28,385.42] } },
        '017-fet': { mm: 284, startConfig: { wMM: 100, yOffsetMM: 50 }, mobile: { x: 160.48, y: 22.77, w: 435, h: 512, poly: [588.95,123.66, 586.59,492.23, 230.65,520.84, 231.18,105.8] }, tablet: { x: 227.63, y: 29.52, w: 580, h: 683, poly: [795.61,163.26, 792.49,651.84, 320.64,689.77, 321.34,139.58] }, desktop: { x: 535.17, y: 26.58, w: 846, h: 997, poly: [1383.7,226.38, 1379.04,956.28, 674.13,1012.95, 675.17,190.99] }, _4k: { x: 1121.73, y: 58.73, w: 1596, h: 1879, poly: [2716.15,434.16, 2707.39,1805.68, 1382.83,1912.15, 1384.79,367.67] } },
        '023-deluxe': { mm: 256, startConfig: { wMM: 100, yOffsetMM: 50 }, mobile: { x: 160.48, y: 22.77, w: 435, h: 512, poly: [588.95,123.66, 586.59,492.23, 230.65,520.84, 231.18,105.8] }, tablet: { x: 227.63, y: 29.52, w: 580, h: 683, poly: [795.61,163.26, 792.49,651.84, 320.64,689.77, 321.34,139.58] }, desktop: { x: 535.17, y: 26.58, w: 846, h: 997, poly: [1383.7,226.38, 1379.04,956.28, 674.13,1012.95, 675.17,190.99] }, _4k: { x: 1121.73, y: 58.73, w: 1596, h: 1879, poly: [2716.15,434.16, 2707.39,1805.68, 1382.83,1912.15, 1384.79,367.67] } },
        '023-bomblet': { mm: 139, startConfig: { wMM: 70, yOffsetMM: 50 }, mobile: { x: 199.17, y: 23.39, w: 313, h: 476, poly: [457.8,547.82, 210.66,538.21, 207.34,38.85, 453.48,26.26] }, tablet: { x: 288.34, y: 29.52, w: 418, h: 635, poly: [617.32,696.62, 302.95,684.4, 298.72,49.18, 611.83,33.16] }, desktop: { x: 654.24, y: 112.59, w: 609, h: 926, poly: [1103.98,1024.54, 674.22,1007.83, 668.44,139.46, 1096.47,117.57] }, _4k: { x: 1345.47, y: 292.99, w: 1149, h: 1746, poly: [2190.54,2006.59, 1383,1975.19, 1372.14,343.49, 2176.43,302.35] } },
        '023-malfa': { mm: 139, startConfig: { wMM: 70, yOffsetMM: 50 }, mobile: { x: 199.17, y: 23.39, w: 313, h: 476, poly: [457.8,547.82, 210.66,538.21, 207.34,38.85, 453.48,26.26] }, tablet: { x: 288.34, y: 29.52, w: 418, h: 635, poly: [617.32,696.62, 302.95,684.4, 298.72,49.18, 611.83,33.16] }, desktop: { x: 654.24, y: 112.59, w: 609, h: 926, poly: [1103.98,1024.54, 674.22,1007.83, 668.44,139.46, 1096.47,117.57] }, _4k: { x: 1345.47, y: 292.99, w: 1149, h: 1746, poly: [2190.54,2006.59, 1383,1975.19, 1372.14,343.49, 2176.43,302.35] } }
    }
};

const WoodCase = {
    currentCase: '017-tube',
    userImgSrc: null,
    isSvg: false,
    svgRatio: 1,
    history: {},
    currentMatrix: null,
    timer: null,

    init() {
        Object.keys(GEOMETRY.cases).forEach(k => { this.history[k] = { x: 0, y: 0, scale: 0.5 }; });
        this.setupInteract();
        this.setupRulerEvents();
        window.addEventListener('resize', () => this.render());

        document.getElementById('case-upload-btn').addEventListener('click', () => {
            document.getElementById('case-file-input').click();
        });
        document.getElementById('case-file-input').addEventListener('change', (e) => this.handleUpload(e));
        document.getElementById('case-clear-btn').addEventListener('click', () => this.clearLogo());
        
        this.render();
    },

    getDevice() {
        const w = window.innerWidth;
        if (w <= GEOMETRY.res.mobile.max) return 'mobile';
        if (w <= GEOMETRY.res.tablet.max) return 'tablet';
        if (w <= GEOMETRY.res.desktop.max) return 'desktop';
        return '_4k';
    },

    setCase(id) {
        const variantMap = {
            'malfa': '023-malfa',
            '023-dlx': '023-deluxe',
            '023-the-bomblet': '023-bomblet'
        };
        const caseId = variantMap[id] || id;

        if (!caseId || !GEOMETRY.cases[caseId]) {
            console.warn(`WoodCase.setCase: Invalid case ID "${caseId}"`);
            return;
        }
        document.getElementById('wood-case-loader').style.display = 'block';
        this.currentCase = caseId;
        
        if (this.userImgSrc && this.history[caseId].scale === 0.5 && this.history[caseId].x === 0) {
            this.applyStartConfig(caseId);
        }
        this.render();
        setTimeout(() => document.getElementById('wood-case-loader').style.display = 'none', 300);
    },

    handleUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        document.getElementById('wood-case-loader').style.display = 'block';
        document.getElementById('case-clear-btn').style.display = 'block';

        const reader = new FileReader();
        reader.onload = (ev) => {
            this.isSvg = file.type === 'image/svg+xml';
            if (this.isSvg) {
                const text = ev.target.result;
                this.svgRatio = this.parseSvgRatio(text);
                this.userImgSrc = this.processSvgColors(text);
                const container = document.getElementById('user-logo-container');
                container.innerHTML = this.userImgSrc;
                const svgEl = container.querySelector('svg');
                if(svgEl) {
                    svgEl.setAttribute('preserveAspectRatio', 'xMidYMid meet');
                    svgEl.style.width = '100%'; svgEl.style.height = '100%';
                }
            } else {
                this.userImgSrc = ev.target.result;
                const container = document.getElementById('user-logo-container');
                container.innerHTML = `<img src="${this.userImgSrc}" style="display:block; width:100%; height:100%;" />`;
            }

            const loadHandler = () => {
                this.applyStartConfig(this.currentCase);
                this.render();
                setState('case.variant', 'custom');
                setState('case.customLogo', this.userImgSrc);
                document.getElementById('wood-case-loader').style.display = 'none';
            };

            if (this.isSvg) {
                loadHandler();
            } else {
                const img = document.querySelector('#user-logo-container img');
                img.onload = loadHandler;
            }
        };

        if (file.type === 'image/svg+xml') {
            reader.readAsText(file);
        } else {
            reader.readAsDataURL(file);
        }
    },

    applyStartConfig(caseId) {
        if (!this.userImgSrc) return;
        const config = GEOMETRY.cases[caseId].startConfig;
        const pxPerMM = this.getPixelsPerMM(caseId);
        let newScale = 0.5;

        if (this.isSvg) {
            newScale = (config.wMM * pxPerMM) / 550;
        } else {
            const img = document.querySelector('#user-logo-container img');
            const natW = img ? img.naturalWidth : 100;
            if (natW > 0) newScale = (config.wMM * pxPerMM) / natW;
        }

        this.history[caseId] = { x: 0, y: config.yOffsetMM * pxPerMM, scale: newScale };
    },

    getPixelsPerMM(caseId) {
        const dev = this.getDevice();
        const poly = GEOMETRY.cases[caseId][dev].poly;
        let minX = Infinity, maxX = -Infinity;
        for(let i=0; i<poly.length; i+=2) { minX = Math.min(minX, poly[i]); maxX = Math.max(maxX, poly[i]); }
        return (maxX - minX) / GEOMETRY.cases[caseId].mm;
    },

    render() {
        const dev = this.getDevice();
        const res = GEOMETRY.res[dev];
        const caseData = GEOMETRY.cases[this.currentCase][dev];
        const svg = document.getElementById('wood-case-svg');
        svg.setAttribute('viewBox', res.vb);

        const bg = document.getElementById('wood-case-bg');
        bg.setAttribute('href', IMAGES[this.currentCase][dev]);
        bg.setAttribute('x', caseData.x); bg.setAttribute('y', caseData.y);
        bg.setAttribute('width', caseData.w); bg.setAttribute('height', caseData.h);

        const fo = document.getElementById('wood-case-perspective-fo');
        const vbParts = res.vb.split(' ');
        fo.setAttribute('width', vbParts[2]); fo.setAttribute('height', vbParts[3]);

        document.getElementById('info-res-tag').textContent = dev.toUpperCase();
        document.getElementById('info-mm-tag').textContent = GEOMETRY.cases[this.currentCase].mm + ' мм';

        const container = document.getElementById('user-logo-container');
        if (this.userImgSrc) {
            container.style.display = 'block';
            if (this.isSvg) {
                container.style.filter = 'grayscale(1) brightness(0) url(#woodBurnFilter)';
                container.style.mixBlendMode = 'multiply';
                container.style.opacity = '0.9';
            } else {
                container.style.filter = 'grayscale(1) contrast(1.2) brightness(0)  url(#burnFilterSVG) ';
                container.style.mixBlendMode = 'multiply';
                container.style.opacity = '1';
            }
            const poly = caseData.poly;
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            for(let i=0; i<poly.length; i+=2) {
                minX = Math.min(minX, poly[i]); maxX = Math.max(maxX, poly[i]);
                minY = Math.min(minY, poly[i+1]); maxY = Math.max(maxY, poly[i+1]);
            }
            const srcW = maxX - minX, srcH = maxY - minY;
            const dstQuad = this.getSortedCorners(poly);
            const h = this.solveHomography([{x:0,y:0},{x:srcW,y:0},{x:srcW,y:srcH},{x:0,y:srcH}], dstQuad);
            this.currentMatrix = h;

            const plane = document.getElementById('wood-case-perspective-plane');
            plane.style.width = srcW + 'px'; plane.style.height = srcH + 'px';
            plane.style.transform = `matrix3d(${h[0]},${h[3]},0,${h[6]},${h[1]},${h[4]},0,${h[7]},0,0,1,0,${h[2]},${h[5]},0,1)`;
            this.updateTransform();
        }
    },

    updateTransform() {
        if(!this.userImgSrc) return;
        const state = this.history[this.currentCase];
        const container = document.getElementById('user-logo-container');
        let bW, bH;
        if (this.isSvg) {
            bW = 550; bH = 550 / this.svgRatio;
        } else {
            const img = container.querySelector('img');
            bW = img ? img.naturalWidth : 100; bH = img ? img.naturalHeight : 100;
        }
        container.style.width = bW + 'px'; container.style.height = bH + 'px';
        container.style.transform = `translate(${state.x}px, ${state.y}px) scale(${state.scale})`;
        
        setState('case.logoTransform', { x: state.x, y: state.y, scale: state.scale });
        const pxPerMM = this.getPixelsPerMM(this.currentCase);
        const width_mm = Math.round((bW * state.scale) / pxPerMM);
        setState('case.logoWidthMM', width_mm);

        this.drawRulers();
    },

    setupInteract() {
        interact('#wood-case-logo-wrapper').gesturable({
            onmove: (e) => {
                const state = this.history[this.currentCase];
                state.scale *= (1 + e.ds);
                this.updateTransform();
                this.showRulers();
            }
        }).draggable({
            onmove: (e) => {
                const state = this.history[this.currentCase];
                state.x += e.dx; state.y += e.dy;
                this.updateTransform();
                this.showRulers();
            }
        });
        document.getElementById('wood-case-logo-wrapper').addEventListener('wheel', (e) => {
            e.preventDefault();
            const state = this.history[this.currentCase];
            const delta = e.deltaY > 0 ? 0.95 : 1.05;
            state.scale *= delta;
            this.updateTransform();
            this.showRulers();
        }, { passive: false });
    },

    parseSvgRatio(text) {
        const doc = new DOMParser().parseFromString(text, "image/svg+xml");
        const svg = doc.querySelector('svg');
        if(svg && svg.viewBox.baseVal.width > 0) return svg.viewBox.baseVal.width / svg.viewBox.baseVal.height;
        return 1;
    },

    processSvgColors(text) {
        const doc = new DOMParser().parseFromString(text, "image/svg+xml");
        doc.querySelectorAll('*').forEach(el => {
            ['fill', 'stroke'].forEach(attr => { if(el.getAttribute(attr) && el.getAttribute(attr) !== 'none') el.setAttribute(attr, '#482814'); });
            if(el.style.fill && el.style.fill !== 'none') el.style.fill = '#482814';
        });
        return new XMLSerializer().serializeToString(doc);
    },

    getSortedCorners(poly) {
        let pts = []; for(let i=0; i<poly.length; i+=2) pts.push({x: poly[i], y: poly[i+1]});
        pts.sort((a,b) => a.y - b.y);
        const t = pts.slice(0,2).sort((a,b) => a.x - b.x), b = pts.slice(2,4).sort((a,b) => a.x - b.x);
        return [t[0], t[1], b[1], b[0]];
    },

    solveHomography(src, dst) {
        const A = [], b = [];
        for(let i=0; i<4; i++){
            const sx = src[i].x, sy = src[i].y, dx = dst[i].x, dy = dst[i].y;
            A.push([sx, sy, 1, 0, 0, 0, -dx*sx, -dx*sy]); b.push(dx);
            A.push([0, 0, 0, sx, sy, 1, -dy*sx, -dy*sy]); b.push(dy);
        }
        return this.gaussianElimination(A, b);
    },

    gaussianElimination(A, b) {
        const n = A.length, aug = A.map((row, i) => [...row, b[i]]);
        for (let i = 0; i < n; i++) {
            let max = i; for (let k = i+1; k < n; k++) if (Math.abs(aug[k][i]) > Math.abs(aug[max][i])) max = k;
            [aug[i], aug[max]] = [aug[max], aug[i]];
            for (let k = i+1; k < n; k++) {
                const f = aug[k][i] / aug[i][i];
                for (let j = i; j <= n; j++) aug[k][j] -= f * aug[i][j];
            }
        }
        const x = new Array(n);
        for (let i = n-1; i >= 0; i--) {
            x[i] = aug[i][n]; for (let j = i+1; j < n; j++) x[i] -= aug[i][j] * x[j];
            x[i] /= aug[i][i];
        }
        return x;
    },

    projectPoint(x, y, h) {
        const w = h[6]*x + h[7]*y + 1;
        return { x: (h[0]*x + h[1]*y + h[2]) / w, y: (h[3]*x + h[4]*y + h[5]) / w };
    },

    drawRulers() {
        if (!this.userImgSrc || !this.currentMatrix) return;
        const state = this.history[this.currentCase], container = document.getElementById('user-logo-container');
        const bW = parseFloat(container.style.width), bH = parseFloat(container.style.height);
        const cW = bW * state.scale, cH = bH * state.scale;
        const plane = document.getElementById('wood-case-perspective-plane');
        const pW = parseFloat(plane.style.width), pH = parseFloat(plane.style.height);
        const iTLx = (pW/2 + state.x) - cW/2, iTLy = (pH/2 + state.y) - cH/2;
        const pxPerMM = this.getPixelsPerMM(this.currentCase);
        
        const top_mm = Math.round(iTLy / pxPerMM);
        const left_mm = Math.round(iTLx / pxPerMM);

        document.getElementById('info-top-tag').textContent = top_mm + ' мм';
        document.getElementById('info-left-tag').textContent = left_mm + ' мм';
        
        setState('case.logoOffsetMM', { top: top_mm, left: left_mm });

        const sCorners = [{x:iTLx,y:iTLy},{x:iTLx+cW,y:iTLy},{x:iTLx+cW,y:iTLy+cH},{x:iTLx,y:iTLy+cH}].map(p => this.projectPoint(p.x, p.y, this.currentMatrix));
        const pTL = sCorners[0], pTR = sCorners[1], pBL = sCorners[3];

        const getOff = (p1, p2, d) => {
            const dx = p2.x - p1.x, dy = p2.y - p1.y, len = Math.sqrt(dx*dx + dy*dy);
            return { x: (-dy/len)*d, y: (dx/len)*d };
        };

        const tO = getOff(pTL, pTR, -15), lO = getOff(pBL, pTL, -15);
        const tr1 = {x:pTL.x+tO.x, y:pTL.y+tO.y}, tr2 = {x:pTR.x+tO.x, y:pTR.y+tO.y};
        const lr1 = {x:pTL.x+lO.x, y:pTL.y+lO.y}, lr2 = {x:pBL.x+lO.x, y:pBL.y+lO.y};

        document.getElementById('wood-case-rulers-group').innerHTML = `
            <line class="ruler-line" x1="${tr1.x}" y1="${tr1.y}" x2="${tr2.x}" y2="${tr2.y}" />
            <line class="ruler-tick" x1="${pTL.x}" y1="${pTL.y}" x2="${tr1.x}" y2="${tr1.y}" />
            <line class="ruler-tick" x1="${pTR.x}" y1="${pTR.y}" x2="${tr2.x}" y2="${tr2.y}" />
            <text class="r-text" x="${(tr1.x+tr2.x)/2}" y="${(tr1.y+tr2.y)/2-5}" text-anchor="middle">${Math.round(cW/pxPerMM)} мм</text>
            <line class="ruler-line" x1="${lr1.x}" y1="${lr1.y}" x2="${lr2.x}" y2="${lr2.y}" />
            <line class="ruler-tick" x1="${pTL.x}" y1="${pTL.y}" x2="${lr1.x}" y2="${lr1.y}" />
            <line class="ruler-tick" x1="${pBL.x}" y1="${pBL.y}" x2="${lr2.x}" y2="${lr2.y}" />
            <text class="r-text" x="${(lr1.x+lr2.x)/2-10}" y="${(lr1.y+lr2.y)/2}" text-anchor="end" dominant-baseline="middle">${Math.round(cH/pxPerMM)} мм</text>
        `;
    },

    showRulers() {
        const g = document.getElementById('wood-case-rulers-group'); g.classList.add('visible');
        clearTimeout(this.timer); this.timer = setTimeout(() => g.classList.remove('visible'), 3000);
    },

    setupRulerEvents() {
        [document.getElementById('wood-case-logo-wrapper'), document.getElementById('wood-case-bg')].forEach(el => {
            if(el) {
                el.addEventListener('click', () => this.showRulers());
                el.addEventListener('mouseenter', () => this.showRulers());
            }
        });
    },

    clearLogo() {
        this.userImgSrc = null; 
        const c = document.getElementById('user-logo-container');
        c.style.display = 'none'; 
        c.innerHTML = ''; 
        document.getElementById('wood-case-rulers-group').innerHTML = '';
        ['info-top-tag', 'info-left-tag', 'info-res-tag'].forEach(id => {
            const el = document.getElementById(id);
            if(el) el.textContent = '-';
        });
        document.getElementById('case-clear-btn').style.display = 'none';
        document.getElementById('case-file-input').value = '';

        setState('case.variant', 'standard');
        setState('case.customLogo', null);
        setState('case.logoWidthMM', 0);
    }
};

export function initializeWoodCase() {
    WoodCase.init();
    // Make it globally accessible for now for easier integration
    window.WoodCase = WoodCase;
}
