import { dispatch } from './state-reducer.js';
import { getState } from './state.js';
import { initSvgComposition } from './layer-composition.js';
import { switchMicrophone, toggleFullscreen, toggleTheme, resetMicrophoneConfig } from './microphone-selector.js';
import { loadSVG } from './engine.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Customizer Overhaul Initializing...');

    // Initialize SVG composition
    initSvgComposition();

    // Load SVG
    await loadSVG();

    // Initial render
    dispatch({ type: 'INIT' }); // Trigger first render

    // Event Delegation
    document.addEventListener('click', (e) => {
        const target = e.target;

        // Microphone Selector
        const micBtn = target.closest('.mic-selector-btn');
        if (micBtn) {
            switchMicrophone(micBtn.dataset.mic);
            return;
        }

        // Sidebar Actions
        const optionItem = target.closest('.option-item');
        if (optionItem) {
            const action = optionItem.dataset.action;
            const state = getState();

            switch(action) {
                case 'set-spheres':
                    dispatch({ type: 'SET_SPHERES_CONFIG', payload: { ...state.singleMic.spheres, variant: optionItem.dataset.variant, color: null } });
                    break;
                case 'set-body':
                    dispatch({ type: 'SET_BODY_CONFIG', payload: { ...state.singleMic.body, variant: optionItem.dataset.variant, color: null } });
                    break;
                case 'set-logo':
                    dispatch({ type: 'SET_LOGO_CONFIG', payload: { ...state.singleMic.logo, type: optionItem.dataset.type } });
                    break;
                case 'set-shockmount-color':
                    dispatch({ type: 'SET_SHOCKMOUNT_CONFIG', payload: { ...state.singleMic.shockmount, color: optionItem.dataset.color } });
                    break;
                case 'set-pins-color':
                    dispatch({ type: 'SET_SHOCKMOUNT_CONFIG', payload: { ...state.singleMic.shockmount, pins: optionItem.dataset.color } });
                    break;
            }
            return;
        }

        // Controls
        if (target.closest('#sidebar-collapse-toggle')) {
            dispatch({ type: 'TOGGLE_SIDEBAR' });
        } else if (target.closest('#sidebar-expand-toggle')) {
            dispatch({ type: 'EXPAND_SIDEBAR' });
        } else if (target.closest('#sidebar-mode-toggle')) {
            const modes = ['sidebar', 'sticky', 'embedded', 'adaptive'];
            const currentMode = getState().ui.sidebar.mode;
            const nextMode = modes[(modes.indexOf(currentMode) + 1) % modes.length];
            dispatch({ type: 'CHANGE_SIDEBAR_MODE', payload: nextMode });
        } else if (target.closest('#reset-config-btn')) {
            resetMicrophoneConfig();
        } else if (target.closest('#fullscreen-toggle-btn')) {
            toggleFullscreen();
        } else if (target.closest('#theme-toggle-btn')) {
            toggleTheme();
        } else if (target.closest('#shockmount-toggle')) {
            const state = getState();
            dispatch({ type: 'SET_SHOCKMOUNT_CONFIG', payload: { ...state.singleMic.shockmount, enabled: target.checked } });
        }
    });

    console.log('✅ Customizer Overhaul Initialized.');
});
