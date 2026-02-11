import { dispatch } from './state-reducer.js';
import { getState } from './state.js';
import { CONFIG_MIC_LIBRARY } from './customization-data.js';

class CustomizerSidebar {
    constructor() {
        const state = getState();
        this.isCollapsed = state.ui.sidebar.collapsed;
        this.isExpanded = state.ui.sidebar.expanded;
        this.width = {
            collapsed: 60,
            normal: 320,
            expanded: 480
        };
        this.mode = state.ui.sidebar.mode || 'sidebar'; // 'sidebar', 'sticky', 'embedded', 'adaptive'
    }

    render() {
        const width = this.isCollapsed ? this.width.collapsed :
                     (this.isExpanded ? this.width.expanded : this.width.normal);

        // Mode-specific rendering
        switch (this.mode) {
            case 'sticky':
                return this.renderSticky();
            case 'embedded':
                return this.renderEmbedded();
            case 'adaptive':
                return this.renderAdaptive();
            default:
                return this.renderSidebar(width);
        }
    }

    renderSidebar(width) {
        return `
            <div class="customizer-sidebar" style="width: ${width}px">
                <!-- Sidebar controls -->
                <div class="sidebar-controls">
                    <button class="sidebar-btn mode-toggle" id="sidebar-mode-toggle" title="Change layout">
                        <i class="icon-layout"></i>
                    </button>
                    <button class="sidebar-btn collapse" id="sidebar-collapse-toggle" title="Collapse">
                        ${this.isCollapsed ? '→' : '←'}
                    </button>
                    <button class="sidebar-btn expand" id="sidebar-expand-toggle" title="Expand">
                        ${this.isExpanded ? '−' : '+'}
                    </button>
                </div>

                ${this.isCollapsed ? this.renderCollapsed() : this.renderFull()}
            </div>
        `;
    }

    renderSticky() {
        return `
            <div class="sticky-navigation">
                <div class="sticky-nav-inner">
                    <button class="nav-item" data-scroll="spheres">
                        <i class="icon-spheres"></i>
                        <span>Spheres</span>
                    </button>
                    <button class="nav-item" data-scroll="body">
                        <i class="icon-body"></i>
                        <span>Body</span>
                    </button>
                    <button class="nav-item" data-scroll="logo">
                        <i class="icon-logo"></i>
                        <span>Logo</span>
                    </button>
                    <button class="nav-item" data-scroll="shockmount">
                        <i class="icon-shockmount"></i>
                        <span>Shockmount</span>
                    </button>
                    <button class="nav-item" data-scroll="woodcase">
                        <i class="icon-woodcase"></i>
                        <span>Case</span>
                    </button>
                    <button class="nav-item primary" id="sticky-order-btn">
                        <i class="icon-order"></i>
                        <span>Order</span>
                    </button>
                </div>
            </div>
        `;
    }

    renderEmbedded() {
        return `
            <div class="embedded-navigation">
                <div class="nav-section" id="nav-spheres">
                    <button class="expand-btn" data-toggle="spheres">
                        <i class="icon-spheres"></i>
                        <span>Spheres</span>
                        <i class="icon-arrow"></i>
                    </button>
                    <div class="section-content" id="content-spheres" style="display: none;">
                        ${this.renderOptions('spheres')}
                    </div>
                </div>
                <div class="nav-section" id="nav-body">
                    <button class="expand-btn" data-toggle="body">
                        <i class="icon-body"></i>
                        <span>Body</span>
                        <i class="icon-arrow"></i>
                    </button>
                    <div class="section-content" id="content-body" style="display: none;">
                        ${this.renderOptions('body')}
                    </div>
                </div>
                <!-- More sections... -->
            </div>
        `;
    }

    renderAdaptive() {
        return `
            <div class="adaptive-navigation">
                <div class="nav-header">
                    <button class="menu-toggle" id="adaptive-menu-toggle">
                        <i class="icon-menu"></i>
                        <span>Customize</span>
                    </button>
                </div>
                <div class="adaptive-menu" id="adaptive-menu">
                    ${this.renderFull()}
                </div>
            </div>
        `;
    }

    renderCollapsed() {
        return `
            <div class="sidebar-collapsed">
                <div class="sidebar-section-icon" data-scroll="spheres" title="Spheres">
                    <i class="icon-spheres"></i>
                </div>
                <div class="sidebar-section-icon" data-scroll="body" title="Body">
                    <i class="icon-body"></i>
                </div>
                <div class="sidebar-section-icon" data-scroll="logo" title="Logo">
                    <i class="icon-logo"></i>
                </div>
                <div class="sidebar-section-icon" data-scroll="shockmount" title="Shockmount">
                    <i class="icon-shockmount"></i>
                </div>
                <div class="sidebar-section-icon" data-scroll="woodcase" title="Case">
                    <i class="icon-woodcase"></i>
                </div>
                <div class="sidebar-section-icon" id="collapsed-order-btn" title="Order">
                    <i class="icon-order"></i>
                </div>
            </div>
        `;
    }

    renderFull() {
        const state = getState().singleMic;
        return `
            <div class="sidebar-content">
                <!-- Spheres -->
                <div id="spheres-section" class="sidebar-section">
                    <h3>Spheres</h3>
                    <div class="options-grid">
                        ${this.renderOptions('spheres')}
                    </div>
                    <div class="price-row">
                        <span>Price:</span>
                        <span id="spheres-price">${state.prices.spheres}₽</span>
                    </div>
                </div>

                <!-- Body -->
                <div id="body-section" class="sidebar-section">
                    <h3>Body</h3>
                    <div class="options-grid">
                        ${this.renderOptions('body')}
                    </div>
                    <div class="price-row">
                        <span>Price:</span>
                        <span id="body-price">${state.prices.body}₽</span>
                    </div>
                </div>

                <!-- Logo -->
                <div id="logo-section" class="sidebar-section">
                    <h3>Logo</h3>
                    <div class="options-grid">
                        ${this.renderOptions('logo')}
                    </div>
                    <div class="price-row">
                        <span>Price:</span>
                        <span id="logo-price">${state.prices.logo}₽</span>
                    </div>
                </div>

                <!-- Shockmount -->
                <div id="shockmount-section" class="sidebar-section">
                    <h3>Shockmount</h3>
                    <label class="toggle-switch">
                        <input type="checkbox" id="shockmount-toggle" ${state.shockmount.enabled ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                    <div id="shockmount-options" style="${state.shockmount.enabled ? '' : 'display: none;'}">
                        <div class="options-grid">
                            ${this.renderOptions('shockmount')}
                        </div>
                        <div class="sub-options">
                            <h4>Pins Color</h4>
                            <div class="options-grid">
                                ${this.renderOptions('shockmount-pins')}
                            </div>
                        </div>
                    </div>
                    <div class="price-row">
                        <span>Price:</span>
                        <span id="shockmount-price">${state.prices.shockmount}₽</span>
                    </div>
                </div>

                <!-- Wood Case -->
                <div id="woodcase-section" class="sidebar-section">
                    <h3>Wood Case</h3>
                    <div class="options-grid">
                        ${this.renderOptions('woodcase')}
                    </div>
                    <div class="price-row">
                        <span>Price:</span>
                        <span id="woodcase-price">${state.prices.woodcase}₽</span>
                    </div>
                </div>

                <!-- Total Price -->
                <div class="sidebar-section total-section">
                    <div class="total-price-container">
                        <span>Total:</span>
                        <span id="total-price">${state.prices.total}₽</span>
                    </div>
                    <button class="order-btn" id="place-order-btn">
                        Place Order
                    </button>
                </div>
            </div>
        `;
    }

    renderOptions(section) {
        // Render options for each section
        // Menu item background colored with selected color
        // No circles in main items
        return '';
    }
}

export { CustomizerSidebar };
