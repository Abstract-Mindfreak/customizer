import { dispatch } from './state-reducer.js';
import { getState } from './state.js';
import { DEFAULT_MIC_CONFIG } from './customization-data.js';

// Global state for each microphone
const MICROPHONE_STATES = {
    '023': { ...DEFAULT_MIC_CONFIG, microphone: '023' },
    '017': { ...DEFAULT_MIC_CONFIG, microphone: '017', variant: '017-fet' }
};

// Current active microphone
let currentMicrophoneId = '023';

// Initialize states
function initializeMicrophoneStates() {
    // Already initialized in global constant for this example
}

// Switch microphone
function switchMicrophone(micId) {
    // Save current state of single mic configuration
    const currentState = getState();
    MICROPHONE_STATES[currentMicrophoneId] = { ...currentState.singleMic };

    // Switch to new microphone
    currentMicrophoneId = micId;

    // Restore saved state or initialize new one
    const nextState = MICROPHONE_STATES[micId];

    // Apply state via dispatch
    dispatch({ type: 'SET_MICROPHONE', payload: micId });
    dispatch({ type: 'SET_VARIANT', payload: nextState.variant });
    dispatch({ type: 'SET_SPHERES_CONFIG', payload: nextState.spheres });
    dispatch({ type: 'SET_BODY_CONFIG', payload: nextState.body });
    dispatch({ type: 'SET_LOGO_CONFIG', payload: nextState.logo });
    dispatch({ type: 'SET_SHOCKMOUNT_CONFIG', payload: nextState.shockmount });
    dispatch({ type: 'SET_WOODCASE_CONFIG', payload: nextState.woodcase });
}

// Reset current microphone config to default
function resetMicrophoneConfig() {
    const defaultStateForMic = { ...DEFAULT_MIC_CONFIG, microphone: currentMicrophoneId };
    if (currentMicrophoneId === '017') defaultStateForMic.variant = '017-fet';

    MICROPHONE_STATES[currentMicrophoneId] = defaultStateForMic;

    dispatch({ type: 'SET_SPHERES_CONFIG', payload: defaultStateForMic.spheres });
    dispatch({ type: 'SET_BODY_CONFIG', payload: defaultStateForMic.body });
    dispatch({ type: 'SET_LOGO_CONFIG', payload: defaultStateForMic.logo });
    dispatch({ type: 'SET_SHOCKMOUNT_CONFIG', payload: defaultStateForMic.shockmount });
    dispatch({ type: 'SET_WOODCASE_CONFIG', payload: defaultStateForMic.woodcase });
}

// Toggle fullscreen mode
function toggleFullscreen() {
    const previewContainer = document.querySelector('.preview-area');

    if (!document.fullscreenElement) {
        if (previewContainer.requestFullscreen) {
            previewContainer.requestFullscreen();
        } else if (previewContainer.mozRequestFullScreen) {
            previewContainer.mozRequestFullScreen();
        } else if (previewContainer.webkitRequestFullscreen) {
            previewContainer.webkitRequestFullscreen();
        } else if (previewContainer.msRequestFullscreen) {
            previewContainer.msRequestFullscreen();
        } else {
            // Fallback: CSS overlay
            previewContainer.classList.add('fullscreen-fallback');
        }
        dispatch({ type: 'SET_FULLSCREEN', payload: true });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else {
            previewContainer.classList.remove('fullscreen-fallback');
        }
        dispatch({ type: 'SET_FULLSCREEN', payload: false });
    }
}

// Toggle theme
function toggleTheme() {
    const currentState = getState();
    const newTheme = currentState.ui.theme === 'dark' ? 'light' : 'dark';
    dispatch({ type: 'SET_THEME', payload: newTheme });

    // Save to localStorage
    localStorage.setItem('theme', newTheme);
}

// UI for microphone selection (outside sidebar)
function renderMicrophoneSelector() {
    const state = getState();
    const currentMic = state.singleMic.microphone;
    return `
        <div class="mic-selector-container">
            <button class="mic-selector-btn ${currentMic === '023' ? 'active' : ''}"
                    data-mic="023">
                <span class="mic-series">023 SERIES</span>
            </button>
            <button class="mic-selector-btn ${currentMic === '017' ? 'active' : ''}"
                    data-mic="017">
                <span class="mic-series">017 SERIES</span>
            </button>
            <div class="control-buttons">
                <button class="reset-btn" id="reset-config-btn" title="Reset to default">
                    <i class="icon-reset"></i>
                </button>
                <button class="fullscreen-btn" id="fullscreen-toggle-btn" title="Full screen preview">
                    <i class="icon-fullscreen"></i>
                </button>
                <button class="theme-toggle-btn" id="theme-toggle-btn" title="Toggle theme">
                    <i class="icon-theme"></i>
                </button>
            </div>
        </div>
    `;
}

export { switchMicrophone, resetMicrophoneConfig, toggleFullscreen, toggleTheme, renderMicrophoneSelector };
