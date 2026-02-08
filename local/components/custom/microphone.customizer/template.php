<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

/** @var array $arParams */
/** @var array $arResult */
/** @var CBitrixComponentTemplate $this */

$this->addExternalCss($templateFolder . "/assets/css/style.css");
// Add required external libraries
$this->addExternalJs("https://cdn.jsdelivr.net/npm/interactjs@1.10.19/dist/interact.min.js");
?>

<div class="microphone-customizer-app" id="customizer-app-root"
     data-element-id="<?= $arResult["ELEMENT"]["ID"] ?>"
     data-iblock-id="<?= $arResult["ELEMENT"]["IBLOCK_ID"] ?>"
     data-ajax-path="<?= $componentPath ?>/ajax.php"
     data-sessid="<?= bitrix_sessid() ?>">

    <div class="z-9">
        <div class="z-91">
            <h1 class="z-10">Custom Shop</h1>
            <div class="z-11">by SOYUZ</div>
        </div>
    </div>

    <div class="toggle-color">
        <button id="fullscreen-toggle" class="fullscreen-toggle" aria-label="Переключить полноэкранный режим">
            <svg class="fullscreen-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3m-18 0v3a2 2 0 0 0 2 2h3"></path>
            </svg>
        </button>
        <button id="theme-toggle" class="theme-toggle" aria-label="Переключить тему"></button>
    </div>

    <div class="app-container">
        <div class="preview-area" id="preview-area">
            <div class="svg-container">
                <div class="svg-wrapper" id="svg-wrapper"></div>

                <!-- Shockmount Preview Container -->
                <div class="shockmount-preview-container" id="shockmount-preview-container" style="display: none;">
                    <div class="shockmount-svg-container">
                        <svg id="shockmount-svg" viewBox="0 0 2048.2 2048.2">
                            <!-- SVG content will be populated by JS -->
                        </svg>
                    </div>
                </div>

                <!-- Case Preview Container -->
                <div class="case-preview-container" id="case-preview-container" style="display: none; width:100%; height:100%;">
                    <div id="wood-case-workspace">
                        <div class="loader" id="wood-case-loader">Загрузка...</div>
                        <svg id="wood-case-svg" preserveAspectRatio="xMidYMid meet">
                            <defs>
                                <filter id="woodBurnFilter" x="-10%" y="-10%" width="120%" height="120%">
                                    <feColorMatrix type="matrix" values="0 0 0 0 0.28 0 0 0 0 0.15 0 0 0 0 0.08 0 0 0 1 0" result="colored"/>
                                    <feGaussianBlur stdDeviation="0.8" in="SourceAlpha" result="blur"/>
                                    <feOffset dx="1" dy="1" result="offsetBlur"/>
                                    <feComposite operator="in" in="colored" in2="SourceGraphic" result="mainColor"/>
                                    <feMerge><feMergeNode in="mainColor"/></feMerge>
                                </filter>
                            </defs>
                            <image id="wood-case-bg" x="0" y="0" />
                            <foreignObject id="wood-case-perspective-fo" x="0" y="0" width="100%" height="100%">
                                <div id="wood-case-perspective-plane" xmlns="http://www.w3.org/1999/xhtml">
                                    <div id="wood-case-logo-wrapper">
                                        <div id="user-logo-container" style="display:none;"></div>
                                    </div>
                                </div>
                            </foreignObject>
                            <g id="wood-case-rulers-group"></g>
                        </svg>
                    </div>
                </div>
            </div>
        </div>

        <div class="sidebar">
            <div class="model-switch">
                <button class="model-button active" data-model="023">
                    <span>023</span>
                    <small>серия</small>
                </button>
                <button class="model-button" data-model="017">
                    <span>017</span>
                    <small>серия</small>
                </button>
            </div>

            <!-- Include actual controls from CUSTOMIZER.html -->
            <div class="variant-switch" id="variant-switch">
                <div class="variant-options" id="variants-023">
                    <button class="variant-button active" data-variant="023-the-bomblet">023 the BOMBLET</button>
                    <button class="variant-button" data-variant="malfa">023 MALFA</button>
                    <button class="variant-button" data-variant="023-dlx">023 DELUXE</button>
                </div>
                <div class="variant-options" id="variants-017" style="display: none;">
                    <button class="variant-button" data-variant="017-fet">017 FET</button>
                    <button class="variant-button" data-variant="017-tube">017 TUBE</button>
                </div>
            </div>

            <div class="section-group" id="menu-sections">
                <!-- Add essential sections here -->
                 <!-- (Simplified for the example, but would include all from standalone) -->
            </div>

            <div class="total-price">
                <div class="price-row">
                    <span><?= GetMessage("BASE_PRICE") ?>:</span>
                    <span id="base-price">0₽</span>
                </div>
                <div class="price-row price-total">
                    <span>Итого:</span>
                    <span id="total-price">0₽</span>
                </div>
                <button class="order-button"><?= GetMessage("CUSTOMIZER_SAVE") ?></button>
            </div>
        </div>
    </div>
</div>

<script type="module">
    import { initPalettes } from '<?= $templateFolder ?>/assets/js/modules/appearance.js';
    import { initEventListeners, updateUI } from '<?= $templateFolder ?>/assets/js/ui-core.js';
    import { initCaseAndShockmount } from '<?= $templateFolder ?>/assets/js/modules/accessories.js';
    import { init as initLogo } from '<?= $templateFolder ?>/assets/js/modules/logo.js';
    import { initializeWoodCase } from '<?= $templateFolder ?>/assets/js/modules/wood-case.js';
    import { initShockmount } from '<?= $templateFolder ?>/assets/js/modules/shockmount.js';
    import { loadSVG } from '<?= $templateFolder ?>/assets/js/engine.js';
    import { initValidation } from '<?= $templateFolder ?>/assets/js/services/validation.js';

    BX.ready(async function() {
        // Adjust SVG path for Bitrix
        window.CUSTOMIZER_SVG_PATH = '<?= $templateFolder ?>/assets/mic-017.svg';

        await loadSVG(window.CUSTOMIZER_SVG_PATH);
        initPalettes();
        initEventListeners();
        initCaseAndShockmount();
        initValidation();
        initLogo();
        initializeWoodCase();
        initShockmount();
        updateUI();
    });
</script>
