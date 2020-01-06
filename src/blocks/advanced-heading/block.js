/**
 * BLOCK: amp Text
 *
 * Registering a block with Gutenberg.
 */

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
import backwardCompatibility from './deprecated';
/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const {
	registerBlockType,
	createBlock,
	getBlockDefaultClassName,
} = wp.blocks;
const {
	Fragment,
} = wp.element;
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
registerBlockType( 'amp/advancedheading', {
	title: __( 'Text' ),
	icon: {
		src: icons.block,
	},
	category: 'amp-blocks',
	keywords: [
		__( 'text' ),
		__( 'content' ),
	],
	supports: {
		ktanimate: true,
		ktanimatereveal: true,
		ktanimatepreview: true,
	},
	attributes: {
		content: {
			type: 'string',
			source: 'html',
			selector: 'h1,h2,h3,h4,h5,h6',
		},
		level: {
			type: 'number',
			default: 2,
		},
		uniqueID: {
			type: 'string',
		},
		align: {
			type: 'string',
		},
		color: {
			type: 'string',
		},
		size: {
			type: 'number',
		},
		sizeType: {
			type: 'string',
			default: 'px',
		},
		lineHeight: {
			type: 'number',
		},
		lineType: {
			type: 'string',
			default: 'px',
		},
		tabSize: {
			type: 'number',
		},
		tabLineHeight: {
			type: 'number',
		},
		mobileSize: {
			type: 'number',
		},
		mobileLineHeight: {
			type: 'number',
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
		topMargin: {
			type: 'number',
			default: '',
		},
		bottomMargin: {
			type: 'number',
			default: '',
		},
		marginType: {
			type: 'string',
			default: 'px',
		},
		markSize: {
			type: 'array',
			default: [ '', '', '' ],
		},
		markSizeType: {
			type: 'string',
			default: 'px',
		},
		markLineHeight: {
			type: 'array',
			default: [ '', '', '' ],
		},
		markLineType: {
			type: 'string',
			default: 'px',
		},
		markLetterSpacing: {
			type: 'number',
		},
		markTypography: {
			type: 'string',
			default: '',
		},
		markGoogleFont: {
			type: 'boolean',
			default: false,
		},
		markLoadGoogleFont: {
			type: 'boolean',
			default: true,
		},
		markFontSubset: {
			type: 'string',
			default: '',
		},
		markFontVariant: {
			type: 'string',
			default: '',
		},
		markFontWeight: {
			type: 'string',
			default: 'regular',
		},
		markFontStyle: {
			type: 'string',
			default: 'normal',
		},
		markColor: {
			type: 'string',
			default: '#f76a0c',
		},
		markBG: {
			type: 'string',
		},
		markBGOpacity: {
			type: 'number',
			default: 1,
		},
		markPadding: {
			type: 'array',
			default: [ 0, 0, 0, 0 ],
		},
		markPaddingControl: {
			type: 'string',
			default: 'linked',
		},
		markBorder: {
			type: 'string',
		},
		markBorderOpacity: {
			type: 'number',
			default: 1,
		},
		markBorderWidth: {
			type: 'number',
			default: 0,
		},
		markBorderStyle: {
			type: 'string',
			default: 'solid',
		},
		textTransform: {
			type: 'string',
			default: '',
		},
		markTextTransform: {
			type: 'string',
			default: '',
		},
		anchor: {
			type: 'string',
		},
	},
	transforms: {
		from: [
			{
				type: 'block',
				blocks: [ 'core/paragraph' ],
				transform: ( { content } ) => {
					return createBlock( 'amp/advancedheading', {
						content,
					} );
				},
			},
			{
				type: 'block',
				blocks: [ 'core/heading' ],
				transform: ( { content, level } ) => {
					return createBlock( 'amp/advancedheading', {
						content: content,
						level: level,
					} );
				},
			},
		],
		to: [
			{
				type: 'block',
				blocks: [ 'core/paragraph' ],
				transform: ( { content } ) => {
					return createBlock( 'core/paragraph', {
						content,
					} );
				},
			},
			{
				type: 'block',
				blocks: [ 'core/heading' ],
				transform: ( { content, level } ) => {
					return createBlock( 'core/heading', {
						content: content,
						level: level,
					} );
				},
			},
		],
	},
	edit,
	save: props => {
		const { attributes: { anchor, align, level, content, color, uniqueID, letterSpacing, topMargin, bottomMargin, marginType, className, ampAnimation, ampAOSOptions } } = props;
		const tagName = 'h' + level;
		const mType = ( marginType ? marginType : 'px' );
		let tagId = ( anchor ? anchor : `amp-adv-heading${ uniqueID }` );
		const revealAnimation = ( ampAnimation && ( 'reveal-left' === ampAnimation || 'reveal-right' === ampAnimation || 'reveal-up' === ampAnimation || 'reveal-down' === ampAnimation ) ? true : false );
		const wrapper = ( anchor || revealAnimation ? true : false );
		tagId = ( revealAnimation && ! anchor ? `amp-adv-inner-heading${ uniqueID }` : tagId );
		const classes = ( ! wrapper && className ? `${ className } ${ getBlockDefaultClassName( 'amp/advancedheading' ) }` : getBlockDefaultClassName( 'amp/advancedheading' ) );
		const htmlItem = (
			<RichText.Content
				tagName={ tagName }
				id={ tagId }
				className={ `amp-adv-heading${ uniqueID } ${ classes }` }
				data-aos={ ( ampAnimation ? ampAnimation : undefined ) }
				data-aos-offset={ ( ampAOSOptions && ampAOSOptions[ 0 ] && ampAOSOptions[ 0 ].offset ? ampAOSOptions[ 0 ].offset : undefined ) }
				data-aos-duration={ ( ampAOSOptions && ampAOSOptions[ 0 ] && ampAOSOptions[ 0 ].duration ? ampAOSOptions[ 0 ].duration : undefined ) }
				data-aos-delay={ ( ampAOSOptions && ampAOSOptions[ 0 ] && ampAOSOptions[ 0 ].delay ? ampAOSOptions[ 0 ].delay : undefined ) }
				data-aos-easing={ ( ampAOSOptions && ampAOSOptions[ 0 ] && ampAOSOptions[ 0 ].easing ? ampAOSOptions[ 0 ].easing : undefined ) }
				data-aos-once={ ( ampAOSOptions && ampAOSOptions[ 0 ] && undefined !== ampAOSOptions[ 0 ].once && '' !== ampAOSOptions[ 0 ].once ? ampAOSOptions[ 0 ].once : undefined ) }
				style={ {
					textAlign: align,
					color: color,
					letterSpacing: ( letterSpacing ? letterSpacing + 'px' : undefined ),
					marginTop: ( undefined !== topMargin && '' !== topMargin ? topMargin + mType : undefined ),
					marginBottom: ( undefined !== bottomMargin && '' !== bottomMargin ? bottomMargin + mType : undefined ),
				} }
				value={ content }
			/>
		);
		return (
			<Fragment>
				{ wrapper && (
					<div id={ `amp-adv-heading${ uniqueID }` } className={ `amp-advanced-heading-wrapper${ ( revealAnimation ? ' amp-heading-clip-animation' : '' ) }${ ( className ? ' ' + className : '' ) }` }>
						{ htmlItem }
					</div>
				) }
				{ ! wrapper && (
					htmlItem
				) }
			</Fragment>
		);
	},
	deprecated: backwardCompatibility,
} );
