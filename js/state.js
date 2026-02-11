// === UNIFIED STATE ===
const initialState = {
    // Single Mic configuration
    singleMic: {
        microphone: '023',
        variant: '023-the-bomblet',
        spheres: { variant: '2', color: null, customRAL: null },
        body: { variant: '2', color: null, customRAL: null },
        logo: { type: 'silver', bgColor: '3001', customLogo: null },
        shockmount: { enabled: false, variant: 'standard', color: 'RAL9003', pins: 'RAL9003', pinsColor: null },
        woodcase: { variant: 'standard', customLogo: null, dimensions: { width: null, height: null, depth: null } },
        prices: { base: 0, spheres: 0, body: 0, logo: 0, shockmount: 0, woodcase: 0, total: 0 }
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

export function getState() {
    return state;
}

export function setState(newState) {
    state = newState;
}

export { initialState };
