import { initialState, getState, setState } from './state.js';
import { DEFAULT_MIC_CONFIG } from './customization-data.js';
import { computePrices } from './compute-layer.js';
import { render } from './render-layer.js';

// Reducer
function reducer(state, action) {
    switch (action.type) {
        // === Single Mic Actions ===
        case 'SET_MICROPHONE':
            return {
                ...state,
                singleMic: {
                    ...state.singleMic,
                    microphone: action.payload,
                    prices: computePrices({
                        ...state.singleMic,
                        microphone: action.payload
                    })
                }
            };

        case 'SET_VARIANT':
            return {
                ...state,
                singleMic: {
                    ...state.singleMic,
                    variant: action.payload,
                    prices: computePrices({
                        ...state.singleMic,
                        variant: action.payload
                    })
                }
            };

        case 'SET_SPHERES_CONFIG':
            return {
                ...state,
                singleMic: {
                    ...state.singleMic,
                    spheres: action.payload,
                    prices: computePrices({
                        ...state.singleMic,
                        spheres: action.payload
                    })
                }
            };

        case 'SET_BODY_CONFIG':
            return {
                ...state,
                singleMic: {
                    ...state.singleMic,
                    body: action.payload,
                    prices: computePrices({
                        ...state.singleMic,
                        body: action.payload
                    })
                }
            };

        case 'SET_LOGO_CONFIG':
            return {
                ...state,
                singleMic: {
                    ...state.singleMic,
                    logo: action.payload,
                    prices: computePrices({
                        ...state.singleMic,
                        logo: action.payload
                    })
                }
            };

        case 'SET_SHOCKMOUNT_CONFIG':
            return {
                ...state,
                singleMic: {
                    ...state.singleMic,
                    shockmount: action.payload,
                    prices: computePrices({
                        ...state.singleMic,
                        shockmount: action.payload
                    })
                }
            };

        case 'SET_WOODCASE_CONFIG':
            return {
                ...state,
                singleMic: {
                    ...state.singleMic,
                    woodcase: action.payload,
                    prices: computePrices({
                        ...state.singleMic,
                        woodcase: action.payload
                    })
                }
            };

        // === MIMO Actions ===
        case 'MIMO_ENABLE_TOGGLE':
            return {
                ...state,
                mimo: {
                    ...state.mimo,
                    enabled: action.payload.enabled
                }
            };

        case 'MIMO_ADD_MIC_INPUT':
            return {
                ...state,
                mimo: {
                    ...state.mimo,
                    micInputs: [
                        ...state.mimo.micInputs,
                        {
                            id: `mic_${state.mimo.micInputs.length + 1}`,
                            configRef: { ...DEFAULT_MIC_CONFIG },
                            position: { x: 0, y: 0, z: 0 },
                            pattern: 'cardioid',
                            role: 'main'
                        }
                    ]
                }
            };

        case 'MIMO_UPDATE_ROUTING_MATRIX':
            return {
                ...state,
                mimo: {
                    ...state.mimo,
                    routingMatrix: action.payload
                }
            };

        // === UI Actions ===
        case 'SET_THEME':
            return {
                ...state,
                ui: {
                    ...state.ui,
                    theme: action.payload
                }
            };

        case 'TOGGLE_SIDEBAR':
            return {
                ...state,
                ui: {
                    ...state.ui,
                    sidebar: {
                        ...state.ui.sidebar,
                        collapsed: !state.ui.sidebar.collapsed,
                        expanded: false
                    }
                }
            };

        case 'EXPAND_SIDEBAR':
            return {
                ...state,
                ui: {
                    ...state.ui,
                    sidebar: {
                        ...state.ui.sidebar,
                        expanded: !state.ui.sidebar.expanded,
                        collapsed: false
                    }
                }
            };

        case 'CHANGE_SIDEBAR_MODE':
            return {
                ...state,
                ui: {
                    ...state.ui,
                    sidebar: {
                        ...state.ui.sidebar,
                        mode: action.payload
                    }
                }
            };

        case 'SET_FULLSCREEN':
            return {
                ...state,
                ui: {
                    ...state.ui,
                    fullscreen: action.payload
                }
            };

        default:
            return state;
    }
}

// Dispatch function
function dispatch(action) {
    const newState = reducer(getState(), action);
    setState(newState);
    render(newState);
}

export { dispatch };
