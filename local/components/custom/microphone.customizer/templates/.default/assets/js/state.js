// === UNIFIED STATE ===
const initialState = {
    // Single Mic configuration
    singleMic: {
        microphone: '023',
        variant: '023-the-bomblet',
        spheres: { variant: '2', color: null, colorValue: '#a1a1a0', customRAL: null },
        body: { variant: '2', color: null, colorValue: '#a1a1a0', customRAL: null },
        logo: { type: 'silver', variant: 'silver', bgColor: '3001', bgColorValue: '#8F1E24', customLogo: null },
        shockmount: { enabled: false, variant: 'standard', color: 'RAL9003', pins: 'RAL9003', pinsColor: null },
        woodcase: { variant: 'standard', customLogo: null, dimensions: { width: null, height: null, depth: null } },
        prices: { base: 129990, spheres: 0, body: 0, logo: 0, shockmount: 0, woodcase: 0, total: 129990 }
    },

    // MIMO configuration
    mimo: {
        enabled: false,
        micInputs: [],
        audioOutputs: [],
        routingMatrix: [],
        beamformingProfiles: []
    },

    // UI state
    ui: {
        theme: 'light',
        sidebar: {
            collapsed: false,
            expanded: false,
            mode: 'sidebar'
        },
        activeSection: 'spheres',
        modal: null,
        fullscreen: false
    }
};

let state = { ...initialState };

// Old modules expect 'currentState'
export let currentState = state.singleMic;

export function getState() {
    return state;
}

export function setState(pathOrNewState, value) {
    if (typeof pathOrNewState === 'object' && value === undefined) {
        state = pathOrNewState;
        currentState = state.singleMic;
        return;
    }

    // Compatibility mode for old setState(path, value)
    const keys = pathOrNewState.split('.');
    let current = state.singleMic;
    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;

    // We should ideally call render() here but that would create circular dependency
    // So this is just to keep data in sync for old modules
}

export { initialState };
