/**
 * Amp Blocks
 *
 */
import TypographyControls from './typography-control.js';
import AdvancedColorControl from './advanced-color-control.js';
import BoxShadowControl from './box-shadow-control';
import './blocks/row-layout/block.js';
import './blocks/column/block.js';
import './blocks/advanced-heading/block.js';
import './blocks/advanced-btn/block.js';
import './blocks/image/block.js';
import './blocks/icon/block.js';
import './blocks/video/block.js';
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
	wp.data.dispatch( 'core/editor' ).updateEditorSettings( { maxWidth: amp_blocks_default_size } );
}
document.addEventListener( 'DOMContentLoaded', appendImportButton );

function appendImportButton() {
	let node = document.querySelector( '.edit-post-header-toolbar' );
	let newElem = document.createElement( 'div' );
	let html = '<div class="amp-block-defaults-modal">';
	html += `<button class="button button-primary" id="AMPBlocksImportLayoutBtn" > AMP Blocks Prebuilt Library</button>`;
	html += '</div>';
	newElem.innerHTML = html;
	node.appendChild( newElem );
	document.getElementById( 'AMPBlocksImportLayoutBtn' ).addEventListener( 'click', ampBlockImportPrebuiltLibrary );
}

var node;

function ampBlockImportPrebuiltLibrary( e ) {
	e.preventDefault();
	if (! node) {
		node = document.createElement( 'div' );
		node.setAttribute( 'id', 'prebuilt_modal_top_button' );
		document.body.appendChild( node );
	}
	wp.element.render( <Prebuilt_Modal modalOpen={ true }/>, node );

}


