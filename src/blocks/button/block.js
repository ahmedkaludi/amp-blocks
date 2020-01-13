/**
 * BLOCK: Amp Advanced Btn
 */
import times from 'lodash/times';
import GenIcon from '../../genicon';
import Ico from '../../svgicons';
import FaIco from '../../faicons';
/**
 * Import Icons
 */
import icons from './icon';

/**
 * Import Css
 */
import './style.scss';
import './editor.scss';

import edit from './edit';
/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const {
	RichText,
} = wp.blockEditor;
/**
 * Register: a Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'amp/advancedbtn', {
	title: __( 'Button', 'amp-blocks' ), // Block title.
	description: __( 'Create an advanced button or a row of buttons. Style each one, including hover controls!', 'amp-blocks' ),
	icon: {
		src: icons.block,
	},
	category: 'amp-blocks',
	keywords: [
		__( 'Button', 'amp-blocks' ),
		__( 'Icon', 'amp-blocks' ),
		__( 'KB', 'amp-blocks' ),
	],
	supports: {
		ktanimate: true,
		ktanimateadd: true,
		ktanimatepreview: true,
	},
	attributes: {
		hAlign: {
			type: 'string',
			default: 'center',
		},
		thAlign: {
			type: 'string',
			default: '',
		},
		mhAlign: {
			type: 'string',
			default: '',
		},
		btnCount: {
			type: 'number',
			default: 1,
		},
		uniqueID: {
			type: 'string',
			default: '',
		},
		btns: {
			type: 'array',
			default: [ {
				text: '',
				link: '',
				target: '_self',
				size: '',
				paddingBT: '',
				paddingLR: '',
				color: '#555555',
				background: '#ccc',
				border: '#555555',
				backgroundOpacity: 1,
				borderOpacity: 1,
				borderRadius: '',
				borderWidth: '0',
				colorHover: '#ffffff',
				backgroundHover: '#444444',
				borderHover: '#444444',
				backgroundHoverOpacity: 1,
				borderHoverOpacity: 1,
				icon: '',
				iconSide: 'right',
				iconHover: false,
				cssClass: '',
				noFollow: false,
				gap: 5,
				responsiveSize: [ '', '' ],
				gradient: [ '#999999', 1, 0, 100, 'linear', 180, 'center center' ],
				gradientHover: [ '#777777', 1, 0, 100, 'linear', 180, 'center center' ],
				btnStyle: 'basic',
				btnSize: 'standard',
				backgroundType: 'solid',
				backgroundHoverType: 'solid',
				width: [ '', '', '' ],
				responsivePaddingBT: [ '', '' ],
				responsivePaddingLR: [ '', '' ],
				boxShadow: [ false, '#000000', 0.2, 1, 1, 2, 0, false ],
				boxShadowHover: [ false, '#000000', 0.4, 2, 2, 3, 0, false ],
			} ],
		},
		letterSpacing: {
			type: 'number',
		},
		typography: {
			type: 'string',
			default: '',
		},
		googleFont: {
			type: 'boolean',
			default: false,
		},
		loadGoogleFont: {
			type: 'boolean',
			default: true,
		},
		fontSubset: {
			type: 'string',
			default: '',
		},
		fontVariant: {
			type: 'string',
			default: '',
		},
		fontWeight: {
			type: 'string',
			default: 'regular',
		},
		fontStyle: {
			type: 'string',
			default: 'normal',
		},
		textTransform: {
			type: 'string',
			default: 'none',
		},
		widthType: {
			type: 'string',
			default: 'auto',
		},
		widthUnit: {
			type: 'string',
			default: 'px',
		},
		forceFullwidth: {
			type: 'bool',
			default: false,
		},
	},
	edit,
	save: props => {
		const { attributes: { btnCount, btns, hAlign, uniqueID, letterSpacing, forceFullwidth, thAlign, mhAlign } } = props;
		const renderSaveBtns = ( index ) => {
			let relAttr;
			if ( '_blank' === btns[ index ].target && true === btns[ index ].noFollow ) {
				relAttr = 'noreferrer noopener nofollow';
			} else if ( '_blank' === btns[ index ].target ) {
				relAttr = 'noreferrer noopener';
			} else if ( true === btns[ index ].noFollow ) {
				relAttr = 'nofollow';
			} else {
				relAttr = undefined;
			}
			let btnSize;
			if ( undefined !== btns[ index ].paddingLR || undefined !== btns[ index ].paddingBT ) {
				btnSize = 'custom';
			} else {
				btnSize = 'standard';
			}
			return (
				<div className={ ` bp amp-btn-wrap amp-btn-wrap-${ index }` }>
					<a className={ `amp-button button amp-btn-${ index }-action amp-btn-size-${ ( btns[ index ].btnSize ? btns[ index ].btnSize : btnSize ) } amp-btn-style-${ ( btns[ index ].btnStyle ? btns[ index ].btnStyle : 'basic' ) } amp-btn-svg-show-${ ( ! btns[ index ].iconHover ? 'always' : 'hover' ) } amp-btn-has-text-${ ( ! btns[ index ].text ? 'false' : 'true' ) } amp-btn-has-svg-${ ( ! btns[ index ].icon ? 'false' : 'true' ) }${ ( 'video' === btns[ index ].target ? ' ktblocksvideopop' : '' ) }${ ( btns[ index ].cssClass ? ' ' + btns[ index ].cssClass : '' ) }` } href={ ( ! btns[ index ].link ? '#' : btns[ index ].link ) } target={ ( '_blank' === btns[ index ].target ? btns[ index ].target : undefined ) } rel={ relAttr } style={ {
						borderRadius: ( undefined !== btns[ index ].borderRadius && '' !== btns[ index ].borderRadius ? btns[ index ].borderRadius + 'px' : undefined ),
						borderWidth: ( undefined !== btns[ index ].borderWidth && '' !== btns[ index ].borderWidth ? btns[ index ].borderWidth + 'px' : undefined ),
						letterSpacing: ( undefined !== letterSpacing && '' !== letterSpacing ? letterSpacing + 'px' : undefined ),
					} } >
						{ btns[ index ].icon && 'left' === btns[ index ].iconSide && (
							<GenIcon className={ `amp-btn-svg-icon amp-btn-svg-icon-${ btns[ index ].icon } amp-btn-side-${ btns[ index ].iconSide }` } name={ btns[ index ].icon } size={ ( ! btns[ index ].size ? '14' : btns[ index ].size ) } icon={ ( 'fa' === btns[ index ].icon.substring( 0, 2 ) ? FaIco[ btns[ index ].icon ] : Ico[ btns[ index ].icon ] ) } />
						) }
						<RichText.Content
							tagName={ 'span' }
							className="amp-btn-inner-text"
							value={ btns[ index ].text }
						/>
						{ btns[ index ].icon && 'left' !== btns[ index ].iconSide && (
							<GenIcon className={ `amp-btn-svg-icon amp-btn-svg-icon-${ btns[ index ].icon } amp-btn-side-${ btns[ index ].iconSide }` } name={ btns[ index ].icon } size={ ( ! btns[ index ].size ? '14' : btns[ index ].size ) } icon={ ( 'fa' === btns[ index ].icon.substring( 0, 2 ) ? FaIco[ btns[ index ].icon ] : Ico[ btns[ index ].icon ] ) } />
						) }
					</a>
				</div>
			);
		};
		return (
			<div className={ `amp-btn-align-${ hAlign } amp-btn-tablet-align-${ ( thAlign ? thAlign : 'inherit' ) } amp-btn-mobile-align-${ ( mhAlign ? mhAlign : 'inherit' ) } amp-btns-wrap amp-btns${ uniqueID }${ ( forceFullwidth ? ' amp-force-btn-fullwidth' : '' ) }` }>
				{ times( btnCount, n => renderSaveBtns( n ) ) }
			</div>
		);
	},
} );
