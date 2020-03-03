/**
 * Amp Blocks
 *
 */
import TypographyControls from './typography-control.js';
import AdvancedColorControl from './advanced-color-control.js';
import BoxShadowControl from './box-shadow-control';
import './blocks/row-layout/block.js';
import './blocks/column/block.js';
import './blocks/text/block.js';
import './blocks/button/block.js';
import './blocks/image/block.js';
import './blocks/icon/block.js';
import './blocks/video/block.js';
import './blocks/heading/block.js';
import './blocks/icon-list/block.js';
import './blocks/buttongroup/block.js';
import Prebuilt_Modal from './blocks/row-layout/prebuilt_modal';
const axios = require('axios');
let blockdata = '';
axios.get('https://raw.githubusercontent.com/ahmedkaludi/amp-blocks-designs/master/root.json')
    .then(response => {
        blockdata = response.data;
    });

window.kb = {
    // Sidebar controls.
    controls: {
        AdvancedColorControl,
        TypographyControls,
        BoxShadowControl,
    },
};

if (typeof amp_blocks_default_size !== 'undefined') {
    wp.data.dispatch('core/editor').updateEditorSettings({ maxWidth: amp_blocks_default_size });
}
document.addEventListener('DOMContentLoaded', appendImportButton);

function appendImportButton() {

    let node = document.querySelector('.edit-post-header-toolbar');
    let newElem = document.createElement('div');
    let html = '<div class="amp-block-defaults-modal">';
    html += `<button class="button button-primary" id="ampblockCanvasbutton" data-action="Enter">Enter Canvas Mode</button><button class="button button-primary" id="AMPBlocksImportLayoutBtn" style="margin-left: 5px;">Design Library</button>`;
    html += '</div>';
    newElem.innerHTML = html;
    node.appendChild(newElem);
    document.getElementById('ampblockCanvasbutton').addEventListener('click', canvasbutton);
    document.getElementById('AMPBlocksImportLayoutBtn').addEventListener('click', ampBlockImportPrebuiltLibrary);
    if (amp_blocks_params.design_library_status == '1') {
        canvasbutton('', 'frombackend');
    }
    jQuery('[aria-label="Settings"]').click(function () {
        var canvasstate = document.getElementById('ampblockCanvasbutton').getAttribute('data-action');
        if (canvasstate == 'Exit') {
            setTimeout(function () {
                if (document.getElementsByClassName('edit-post-sidebar')[0]) {
                    document.getElementsByClassName('edit-post-sidebar')[0].style.cssText = 'top:20%;right:5%';
                    document.getElementsByClassName('edit-post-layout__content')[0].style.margin = '0px';
                    var el = jQuery('.components-panel__header.edit-post-sidebar-header.edit-post-sidebar__panel-tabs')[0];
                    if (el) {
                        el.style.cursor = 'all-scroll';
                    }
                }
                sidebarMomemntListener();
            }, 1000);
        }
    });

}


function canvasbutton(e = '', frombackend = '') {
    if (e == '') {
        var self = document.getElementById('ampblockCanvasbutton');
    } else {
        var self = e.target;
        jQuery('select:contains("Full Width (AMP Blocks)")').val('dist/template.php');
    }
    var canvasStats = self.getAttribute('data-action');
    if (canvasStats == 'Enter' || frombackend == 'frombackend') {
        if (frombackend != 'frombackend')
            designLibraryajax(1);
        var isFullScreenMode = wp.data.select('core/edit-post').isFeatureActive('fullscreenMode');
        if (!isFullScreenMode) {
            wp.data.dispatch('core/edit-post').toggleFeature('fullscreenMode');
        }
        if (!jQuery('.components-icon-button').hasClass('is-toggled')) {
            jQuery('.components-icon-button').trigger('click');
        }
        setTimeout(function () {
            if (document.getElementsByClassName('edit-post-sidebar')[0]) {
                document.getElementsByClassName('edit-post-sidebar')[0].style.cssText = 'top:20%;right:5%';
                document.getElementsByClassName('edit-post-layout__content')[0].style.margin = '0px';
                var el = jQuery('.components-panel__header.edit-post-sidebar-header.edit-post-sidebar__panel-tabs')[0];
                if (el) {
                    el.style.cursor = 'all-scroll';
                }
            }
            sidebarMomemntListener();
        }, 1000);
        self.setAttribute('data-action', 'Exit');
        document.getElementById("ampblockCanvasbutton").innerText = 'Exit Canvas Mode';
    } else {
        if (frombackend != 'frombackend')
            designLibraryajax(0);
        if (document.getElementsByClassName('edit-post-sidebar')[0]) {
            document.getElementsByClassName('edit-post-sidebar')[0].style.cssText = null;
            document.getElementsByClassName('edit-post-layout__content')[0].style.margin = null;
        }
        wp.data.dispatch('core/edit-post').toggleFeature('fullscreenMode');
        self.setAttribute('data-action', 'Enter');
        document.getElementById("ampblockCanvasbutton").innerText = 'Enter Canvas Mode';
    }
}
var node;

function ampBlockImportPrebuiltLibrary(e, category = 'all') {
    e.preventDefault();
    if (!node) {
        node = document.createElement('div');
        node.setAttribute('id', 'prebuilt_modal_top_button');
        document.body.appendChild(node);
    }
    wp.element.render(< Prebuilt_Modal modalOpen={true} category={category}
    />, node);

}

function sidebarMomemntListener() {
    var el = jQuery('.components-panel__header.edit-post-sidebar-header.edit-post-sidebar__panel-tabs')[0];
    if (el) {
        el.addEventListener('mousedown', sidebarmouseDown, false);
    }
    window.addEventListener('mouseup', sidebarmouseUp, false);

}

function sidebarmouseUp() {
    window.removeEventListener('mousemove', moveEditPostSidebar, true);
}

function sidebarmouseDown(e) {
    window.addEventListener('mousemove', moveEditPostSidebar, true);
}

function moveEditPostSidebar(e) {
    if (document.getElementById('ampblockCanvasbutton').getAttribute('data-action') == 'Exit') {
        var editPostSidebar = document.getElementsByClassName('edit-post-sidebar')[0];
        editPostSidebar.style.position = 'absolute';
        editPostSidebar.style.top = e.clientY - 25 + 'px';
        editPostSidebar.style.left = e.clientX - 160 + 'px';
    }
}


function designLibraryajax(status = 0) {
    jQuery.ajax({
        method: 'post',
        security: 'automattic_wizard_nonce',
        url: ajaxurl,
        data: {
            status: status,
            post_ID: jQuery("#post_ID").val(),
            security: amp_blocks_params.amp_blocks_nonce,
            action: 'amp_blocks_set_transient',
        }
    })
}
jQuery(function () {
    setTimeout(function () {
        jQuery('[aria-label="Add block"]').click(function () {
            let html = '';
            html += '<ul><div class="compoent-panel-amp ampblockIn"><h2>DESIGNS</h2></div></ul>';
            html += `<ul role="list" class="editor-block-types-list block-editor-block-types-list ampblockIn">`;
            Object.keys(blockdata.category).forEach(function (key) {
                let categoryIcon = 'tag';
                if (key == 'Testimonial') {
                    categoryIcon = 'format-quote';
                } else if (key == 'Feature') {
                    categoryIcon = 'star-filled';
                } else if (key == 'Project') {
                    categoryIcon = 'lightbulb';
                } else if (key == 'Team') {
                    categoryIcon = 'groups';
                } else if (key == 'text') {
                    categoryIcon = 'editor-paste-text';
                }
                html += ` <li class="editor-block-types-list__list-item block-editor-block-types-list__list-item">
                                <button class="openDesignLibrary" data-action="`+ key + `" class="editor-block-types-list__item"><span class="editor-block-types-list__item-icon"><span class="dashicons dashicons-` + categoryIcon + `"></span></span><span class="editor-block-types-list__item-title block-editor-block-types-list__item-title">` + key + `</span></button>
                            </li>`;
            });
            html += ` </ul>`;
            html += '<ul><div class="compoent-panel-amp ampblockIn"><h2>Blocks</h2></div></ul>';
            var checkExist = setInterval(function () {
                if (jQuery('.editor-inserter__menu .components-panel__body:contains("AMP Blocks") ul').length) {
                    jQuery('.editor-inserter__menu .components-panel__body:contains("AMP Blocks") ul').before(html);
                    clearInterval(checkExist);
                    var DesignLibraryElements = document.getElementsByClassName("openDesignLibrary");
                    var DesignLibraryFun = function (e) {
                        var attribute = this.getAttribute("data-action");
                        ampBlockImportPrebuiltLibrary(e, attribute);
                    };
                    for (var i = 0; i < DesignLibraryElements.length; i++) {
                        DesignLibraryElements[i].addEventListener('click', DesignLibraryFun, false);
                    }
                }
            }, 100);
        });
    }, 1000);
});


