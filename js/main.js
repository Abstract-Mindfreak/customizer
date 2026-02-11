import { dispatch, getState } from './state-reducer.js';
import { initSvgComposition } from './layer-composition.js';
import { switchMicrophone, toggleFullscreen, toggleTheme } from './microphone-selector.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Customizer Overhaul Initializing...');

    // Initialize SVG composition
    initSvgComposition();

    // Initial render
    dispatch({ type: 'INIT' }); // Trigger first render

    // Event Delegation for Microphone Selector (outside sidebar)
    document.addEventListener('click', (e) => {
        const micBtn = e.target.closest('.mic-selector-btn');
        if (micBtn) {
            const micId = micBtn.dataset.mic;
            switchMicrophone(micId);
        }

        if (e.target.id === 'reset-config-btn') {
            // Implementation in microphone-selector.js
        }

        if (e.target.id === 'fullscreen-toggle-btn') {
            toggleFullscreen();
        }

        if (e.target.id === 'theme-toggle-btn') {
            toggleTheme();
        }
    });

    console.log('✅ Customizer Overhaul Initialized.');
});
