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
import Prebuilt_Modal from './blocks/row-layout/prebuilt_modal';

window.kb = {
	// Sidebar controls.
	controls: {
		AdvancedColorControl,
		TypographyControls,
		BoxShadowControl,
	},
};

//wp.i18n.setLocaleData( { '': {} }, 'amp-blocks' );
if (typeof amp_blocks_default_size !== 'undefined') {
	wp.data.dispatch('core/editor').updateEditorSettings({ maxWidth: amp_blocks_default_size });
}
document.addEventListener('DOMContentLoaded', appendImportButton);

function appendImportButton() {
	let node = document.querySelector('.edit-post-header-toolbar');
	let newElem = document.createElement('div');
	let html = '<div class="amp-block-defaults-modal">';
	html += `<button class="button button-primary" id="ampblockCanvasbutton">Enter Canvas Mode</button><button class="button button-primary" id="AMPBlocksImportLayoutBtn" > AMP Blocks Prebuilt Library</button>`;
	html += '</div>';
	newElem.innerHTML = html;
	node.appendChild(newElem);
	document.getElementById('ampblockCanvasbutton').addEventListener('click', canvasbutton);

	document.getElementById('AMPBlocksImportLayoutBtn').addEventListener('click', ampBlockImportPrebuiltLibrary);
	jQuery('[aria-label="Settings"]').click(function () {
		setTimeout(function () {
			addListeners();
		}, 1000);
	});

}


function canvasbutton() {

	var isFullScreenMode = wp.data.select('core/edit-post').isFeatureActive('fullscreenMode');
	if (!isFullScreenMode) {
		if (!jQuery('.components-icon-button').hasClass('is-toggled')) {
			jQuery('.components-icon-button').trigger('click');
		}
		document.getElementsByClassName('edit-post-sidebar')[0].style.top = '20%';
		document.getElementsByClassName('edit-post-sidebar')[0].style.right = '5%';
		document.getElementsByClassName('edit-post-layout__content')[0].style.margin = '0px';
		document.getElementById("ampblockCanvasbutton").innerText = 'Exit Canvas Mode';
	} else {
		document.getElementsByClassName('edit-post-sidebar')[0].style.top = null;
		document.getElementsByClassName('edit-post-sidebar')[0].style.right = null;
		document.getElementsByClassName('edit-post-sidebar')[0].style.left = null;
		document.getElementsByClassName('edit-post-sidebar')[0].style.position = null;
		document.getElementsByClassName('edit-post-layout__content')[0].style.margin = null;
		document.getElementById("ampblockCanvasbutton").innerText = 'Enter Canvas Mode';
	}
	wp.data.dispatch('core/edit-post').toggleFeature('fullscreenMode');
	setTimeout(function () {
		addListeners();
	}, 1000);
}
var node;

function ampBlockImportPrebuiltLibrary(e) {
	e.preventDefault();
	if (!node) {
		node = document.createElement('div');
		node.setAttribute('id', 'prebuilt_modal_top_button');
		document.body.appendChild(node);
	}
	wp.element.render(<Prebuilt_Modal modalOpen={true} />, node);

}

function addListeners() {
	var el = jQuery('.components-panel__header.edit-post-sidebar-header.edit-post-sidebar__panel-tabs')[0];
	if (el) {
		el.addEventListener('mousedown', mouseDown, false);
	}
	window.addEventListener('mouseup', mouseUp, false);

}

function mouseUp() {
	window.removeEventListener('mousemove', moveEditPostSidebar, true);
}

function mouseDown(e) {
	window.addEventListener('mousemove', moveEditPostSidebar, true);
}

function moveEditPostSidebar(e) {
	var editPostSidebar = document.getElementsByClassName('edit-post-sidebar')[0];
	editPostSidebar.style.position = 'absolute';
	editPostSidebar.style.top = e.clientY + 'px';
	editPostSidebar.style.left = e.clientX + 'px';
}


