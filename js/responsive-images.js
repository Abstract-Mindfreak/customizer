// Responsive image helper with srcset
function createResponsiveImage(src, alt, sizes = '100vw') {
    // Generate multiple sizes
    const baseName = src.replace(/\.[^/.]+$/, "");
    const extension = src.split('.').pop();

    const srcset = `
        ${baseName}-320w.${extension} 320w,
        ${baseName}-640w.${extension} 640w,
        ${baseName}-1024w.${extension} 1024w,
        ${baseName}-1920w.${extension} 1920w,
        ${baseName}-2x.${extension} 2x,
        ${baseName}-3x.${extension} 3x
    `;

    return `
        <img
            src="${src}"
            srcset="${srcset}"
            sizes="${sizes}"
            alt="${alt}"
            loading="lazy"
        >
    `;
}

// SVG with responsive images
function createResponsiveSVGWithImages(images) {
    return `
        <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
            ${images.map(img => `
                <image
                    href="${img.src}"
                    x="${img.x}"
                    y="${img.y}"
                    width="${img.width}"
                    height="${img.height}"
                    preserveAspectRatio="xMidYMid slice"
                />
            `).join('')}
        </svg>
    `;
}

// SVG nesting for performance
function createNestedSVG(layers) {
    return `
        <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
            <!-- Woodcase layer -->
            <g id="woodcase-layer" class="svg-layer">
                <svg viewBox="0 0 800 600">
                    ${layers.woodcase}
                </svg>
            </g>

            <!-- Shockmount layer -->
            <g id="shockmount-layer" class="svg-layer">
                <svg viewBox="0 0 800 600">
                    ${layers.shockmount}
                </svg>
            </g>

            <!-- Microphone layer -->
            <g id="microphone-layer" class="svg-layer">
                <svg viewBox="0 0 800 600">
                    ${layers.microphone}
                </svg>
            </g>
        </svg>
    `;
}

// Device pixel ratio optimization
function getOptimalImageSize(baseSize) {
    const dpr = window.devicePixelRatio || 1;
    return Math.round(baseSize * dpr);
}

function loadImageWithDPR(src, baseWidth, baseHeight) {
    const width = getOptimalImageSize(baseWidth);
    const height = getOptimalImageSize(baseHeight);

    const img = new Image();
    img.src = src.replace('{width}', width).replace('{height}', height);
    img.width = baseWidth;
    img.height = baseHeight;

    return img;
}

export { createResponsiveImage, createResponsiveSVGWithImages, createNestedSVG, loadImageWithDPR };
