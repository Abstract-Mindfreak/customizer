import { CONFIG } from './config.js';

export let currentState = {
    model: '023',
    variant: '023-the-bomblet',
    spheres: { variant: '3', color: null, colorValue: '#a1a1a0' },
    body: { variant: '3', color: null, colorValue: '#a1a1a0' },
    logo: { variant: 'gold', bgColor: '9005', bgColorValue: '#131516', customLogo: null },
    case: { variant: 'standard', customLogo: null, logoTransform: { x: 40, y: 26, scale: 1.2 }, logoWidthMM: 0, logoOffsetMM: { top: 0, left: 0 } },
    shockmount: { enabled: false, variant: 'white', color: null, colorValue: '#ffffff', pins: { variant: 'RAL9003', colorValue: '#F4F4F4', material: null } },
    prices: { base: CONFIG.basePrice, spheres: 0, body: 0, logo: 0, case: 0, shockmount: 0 },

    // For tracking changes and reset functionality
    initialConfig: null, // Will store the default config when a mic is selected
    hasChanged: false
};

// Function to set the initial configurable state and reset the hasChanged flag
export function setInitialConfig(config) {
    currentState.initialConfig = JSON.parse(JSON.stringify(config)); // Deep copy
    currentState.hasChanged = false;
}

export function setState(path, value) {
    // Check if the current state is different from the initial config
    if (currentState.initialConfig && !currentState.hasChanged) {
        const tempState = JSON.parse(JSON.stringify(currentState)); // Deep copy to compare
        const keys = path.split('.');
        let current = tempState;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;

        // Compare against initialConfig, excluding properties that are not part of customisation, such as prices
        const compareState = (s1, s2) => {
            const cleanS1 = { ...s1 }; delete cleanS1.prices; delete cleanS1.initialConfig; delete cleanS1.hasChanged;
            const cleanS2 = { ...s2 }; delete cleanS2.prices; delete cleanS2.initialConfig; delete cleanS2.hasChanged;
            return JSON.stringify(cleanS1) !== JSON.stringify(cleanS2);
        };

        if (compareState(tempState, currentState.initialConfig)) {
            currentState.hasChanged = true;
        }
    }

    const keys = path.split('.');
    let current = currentState;
    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
            current[keys[i]] = {};
        }
        current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;

    document.dispatchEvent(new CustomEvent('app:stateChanged', {
        detail: {
            path,
            value,
            newState: currentState
        }
    }));
}
