# Soyuz Microphone Customizer - Hybrid Version

This version combines the architectural stability of the original implementation with the critical improvements from the overhaul.

## Key Improvements Integrated:
1. **Robust Image Upload**:
   - Located in `js/services/report.js`.
   - Uses Base64 to Blob conversion with safety checks.
   - Properly appends Mic Logo, Case Logo, and SVG Preview to `FormData`.
   - Detailed console logging for debugging.

2. **Centralized Data & Pricing**:
   - `js/customization-data.js`: Central library for model definitions and rules.
   - `js/compute-layer.js`: Decoupled pricing logic that calculates the total based on current state.
   - `js/ui-core.js`: Integrated to automatically update prices in the UI.

3. **Improved Validation**:
   - `js/services/validation.js`: Cleaner validation logic for order forms with auto-clear error states.

4. **Optimized Initialization**:
   - `js/main.js`: Improved asset preloading and sequencing of module initialization.

## Replacement Instructions:
To apply this version to your Bitrix component:

1. **Backup**: Save your current `local/components/custom/microphone.customizer/` directory.
2. **Copy Files**:
   - Replace the contents of `templates/.default/assets/js/` with the files from `hybrid-version/js/`.
   - Replace `ajax.php` in the component root with `hybrid-version/ajax/ajax.php`. This includes the fix for property file saving.
3. **Check Paths**:
   - Ensure `template.php` correctly points to `js/main.js` as an ES module:
     ```html
     <script type="module" src="<?= $templateFolder ?>/assets/js/main.js"></script>
     ```
4. **CSS**: If you've modified styles, ensure `style.css` in `assets/css/` is updated or merged with `hybrid-version/css/style.css`.

## Architecture Note:
This version **does not** use the `state-reducer` (MMSS) pattern to maintain compatibility with existing global event handlers and the `currentState` mutation pattern used in older modules.
