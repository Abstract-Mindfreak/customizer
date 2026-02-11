// SVG composition configuration - adjustable without code changes
const SVG_COMPOSITION_CONFIG = {
    canvas: {
        width: 1200,
        height: 900,
        viewBox: "0 0 1200 900"
    },
    layers: {
        woodcase: {
            selector: "#woodcase-preview-container",
            scale: 1.0,
            offsetX: 0,
            offsetY: 0,
            zIndex: 1
        },
        shockmount: {
            selector: "#shockmount-preview-container",
            scale: 1.0,
            offsetX: 0,
            offsetY: 0,
            zIndex: 2
        },
        mic: {
            selector: "#mic-preview-container",
            scale: 1.0,
            offsetX: 0,
            offsetY: 0,
            zIndex: 3
        }
    }
};

// Apply SVG composition configuration
function applySvgComposition(config = SVG_COMPOSITION_CONFIG) {
    // Apply to woodcase layer
    const woodcaseEl = document.querySelector(config.layers.woodcase.selector);
    if (woodcaseEl) {
        woodcaseEl.style.zIndex = config.layers.woodcase.zIndex;
        woodcaseEl.style.transform = `scale(${config.layers.woodcase.scale}) translate(${config.layers.woodcase.offsetX}px, ${config.layers.woodcase.offsetY}px)`;
    }

    // Apply to shockmount layer
    const shockmountEl = document.querySelector(config.layers.shockmount.selector);
    if (shockmountEl) {
        shockmountEl.style.zIndex = config.layers.shockmount.zIndex;
        shockmountEl.style.transform = `scale(${config.layers.shockmount.scale}) translate(${config.layers.shockmount.offsetX}px, ${config.layers.shockmount.offsetY}px)`;
    }

    // Apply to microphone layer
    const micEl = document.querySelector(config.layers.mic.selector);
    if (micEl) {
        micEl.style.zIndex = config.layers.mic.zIndex;
        micEl.style.transform = `scale(${config.layers.mic.scale}) translate(${config.layers.mic.offsetX}px, ${config.layers.mic.offsetY}px)`;
    }
}

// Initialize and apply on resize
function initSvgComposition() {
    applySvgComposition(SVG_COMPOSITION_CONFIG);

    // Reapply on window resize
    window.addEventListener('resize', () => {
        applySvgComposition(SVG_COMPOSITION_CONFIG);
    });
}

export { SVG_COMPOSITION_CONFIG, applySvgComposition, initSvgComposition };
