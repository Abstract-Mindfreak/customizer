// Configuration for animation properties
const CAMERA_EFFECT_CONFIG = {
    duration: 600, // Animation duration in ms
    easing: 'easeInOutQuad', // Easing function
};

// Map of layer IDs to their DOM elements
const layers = {};
let activeLayerId = null;

// Define specific translateX values for each layer's 'home' (inactive) position
// Relative to the 100vh container
const LAYER_HOME_TRANSLATE_X = {
    'case': '-25%',        // Home position for Case (left of center, partial view)
    'microphone': '0%',    // Home position for Microphone (center)
    'shockmount': '25%'   // Home position for Shockmount (right of center, partial view)
};

/**
 * Initializes the camera effect by setting up the initial state of all layers.
 * One layer is set to active, others are set to inactive positions.
 * @param {string} initialActiveLayerId - The ID of the layer to make active initially.
 */
export function initCameraEffect(initialActiveLayerId) {
    if (typeof window.anime !== 'function') {
        console.error("anime.js is not loaded globally. Camera effect cannot be initialized.");
        return;
    }

    layers.microphone = document.getElementById('svg-wrapper');
    layers.shockmount = document.getElementById('shockmount-preview-container');
    layers.case = document.getElementById('case-preview-container');

    const allLayerElements = [layers.case, layers.microphone, layers.shockmount];

    // Apply base styles and initial translateX for all layers
    for (const layerElement of allLayerElements) {
        if (layerElement) {
            const layerKey = layerElement.id === 'svg-wrapper' ? 'microphone' :
                             layerElement.id === 'shockmount-preview-container' ? 'shockmount' :
                             layerElement.id === 'case-preview-container' ? 'case' : '';

            layerElement.classList.add('layer'); // Add base class for common styling
            layerElement.style.position = 'absolute';
            layerElement.style.top = '0';
            layerElement.style.left = '0';
            layerElement.style.width = 'auto';
            layerElement.style.height = '100%';
            layerElement.style.transformOrigin = 'center center';
            
            // Set initial position based on its 'home'
            layerElement.style.transform = `translateX(${LAYER_HOME_TRANSLATE_X[layerKey]})`;

            if (layerKey === initialActiveLayerId) {
                layerElement.classList.add('active');
            } else {
                layerElement.classList.add('inactive');
            }
        }
    }
    activeLayerId = initialActiveLayerId; // Set activeLayerId after initial setup
}

/**
 * Switches the active layer with a smooth camera movement animation.
 * @param {string} newActiveLayerId - The ID of the layer to make active (e.g., 'microphone', 'shockmount', 'case').
 */
export function switchLayer(newActiveLayerId) {
    if (typeof window.anime !== 'function') {
        console.error("anime.js is not loaded globally. Cannot switch layers.");
        return;
    }

    if (newActiveLayerId === activeLayerId || !layers[newActiveLayerId]) {
        return; // No change or invalid layer ID
    }

    const prevActiveElement = layers[activeLayerId];
    const newActiveElement = layers[newActiveLayerId];
    const prevActiveKey = activeLayerId;

    // Animate previous active layer out to its home position
    if (prevActiveElement) {
        prevActiveElement.classList.remove('active');
        prevActiveElement.classList.add('inactive');
        
        window.anime({
            targets: prevActiveElement,
            translateX: LAYER_HOME_TRANSLATE_X[prevActiveKey], // Animate to its home position
            duration: CAMERA_EFFECT_CONFIG.duration,
            easing: CAMERA_EFFECT_CONFIG.easing,
            complete: () => {
                prevActiveElement.style.transform = `translateX(${LAYER_HOME_TRANSLATE_X[prevActiveKey]})`;
            }
        });
    }

    // Animate new layer in to the active (centered) position
    if (newActiveElement) {
        newActiveElement.classList.remove('inactive');
        newActiveElement.classList.add('active');

        // It should animate from its home position to the active (centered) position
        // Ensure its starting position for animation is correctly set by CSS/initial JS
        window.anime({
            targets: newActiveElement,
            translateX: '0%', // Animate to center
            duration: CAMERA_EFFECT_CONFIG.duration,
            easing: CAMERA_EFFECT_CONFIG.easing,
            complete: () => {
                newActiveElement.style.transform = `translateX(0%)`;
            }
        });
    }

    activeLayerId = newActiveLayerId;
}