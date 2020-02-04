/**
 * BLOCK: ampblocks Icon
 */

/**
 * Import Icon stuff
 */
import times from 'lodash/times';
import GenIcon from '../../genicon';
import Ico from '../../svgicons';
import FaIco from '../../faicons';

import edit from './edit';
/**
 * Import Css
 */
import './style.scss';
import './editor.scss';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const {
	registerBlockType,
} = wp.blocks;
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
registerBlockType('ampblocks/icon-list', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __('Icon List'), // Block title.
	icon: {
		src: 'list-view',
	},
	category: 'amp-blocks', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__('icon'),
		__('svg'),
	],
	attributes: {
		icons: {
			type: 'array',
			default: [{
				icon: 'fe_aperture',
				link: '',
				target: '_self',
				size: 50,
				width: 2,
				title: '',
				color: '#444444',
				background: 'transparent',
				border: '#444444',
				borderRadius: 0,
				borderWidth: 2,
				padding: 20,
				style: 'default',
				marginTop: 0,
				marginRight: 5,
				marginBottom: 0,
				marginLeft: 5,
			}],
		},
		iconCount: {
			type: 'number',
			default: 1,
		},
		uniqueID: {
			type: 'string',
			default: '',
		},
		blockAlignment: {
			type: 'string',
			default: 'center',
		},
		textAlignment: {
			type: 'string',
			default: 'center',
		},
		typography: {
			type: 'string',
			default: '',
		},
		googleFont: {
			type: 'boolean',
			default: false,
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
		markGoogleFont: {
			type: 'boolean',
			default: false,
		},
		markLoadGoogleFont: {
			type: 'boolean',
			default: true,
		},
		textcolor: {
			type: 'string',
		},
		iconorder: {
			type: 'number',
			default: 0,
		},
		content: {
			type: 'string',
			source: 'html',
			selector: 'p',
			default: 'Add your text.....',
		},

	},
	getEditWrapperProps({ blockAlignment }) {
		if ('left' === blockAlignment || 'right' === blockAlignment || 'center' === blockAlignment) {
			return { 'data-align': blockAlignment };
		}
	},
	edit,

	save: props => {
		const { attributes: { iconorder, icons, iconCount, blockAlignment, textAlignment, uniqueID, align, content, color, letterSpacing, topMargin, bottomMargin,textcolor,anchor } } = props;
		let tagId = ( anchor ? anchor : `h${ uniqueID }` );


		const htmlItem = (
			<RichText.Content
				tagName={'p'}
				id={ tagId }
			style={{
					textAlign: align,
					color: textcolor,
					letterSpacing: (letterSpacing ? letterSpacing + 'px' : undefined),
					marginTop: (undefined !== topMargin && '' !== topMargin ? topMargin + mType : undefined),
					marginBottom: (undefined !== bottomMargin && '' !== bottomMargin ? bottomMargin + mType : undefined),
					// minWidth: '150px',
				}}
				value={content}
			/>
		);
		const renderSaveIcons = (index) => {
			return (
				<div className={`iclw icl-s-${icons[index].style} icl-w icl-i-${index}`}>
					{icons[index].icon && icons[index].link && (
						<a href={icons[index].link} className={'icl-link'} target={('_blank' === icons[index].target ? icons[index].target : undefined)} rel={'_blank' === icons[index].target ? 'noopener noreferrer' : undefined} style={{
							marginTop: (icons[index].marginTop ? icons[index].marginTop + 'px' : undefined),
							marginRight: (icons[index].marginRight ? icons[index].marginRight + 'px' : undefined),
							marginBottom: (icons[index].marginBottom ? icons[index].marginBottom + 'px' : undefined),
							marginLeft: (icons[index].marginLeft ? icons[index].marginLeft + 'px' : undefined),
						}}
						>
							<GenIcon className={`icl icl-${icons[index].icon}`} name={icons[index].icon} size={icons[index].size} strokeWidth={('fe' === icons[index].icon.substring(0, 2) ? icons[index].width : undefined)} icon={('fa' === icons[index].icon.substring(0, 2) ? FaIco[icons[index].icon] : Ico[icons[index].icon])} title={(icons[index].title ? icons[index].title : '')} style={{
								color: (icons[index].color ? icons[index].color : undefined),
								backgroundColor: (icons[index].background && icons[index].style !== 'default' ? icons[index].background : undefined),
								padding: (icons[index].padding && icons[index].style !== 'default' ? icons[index].padding + 'px' : undefined),
								borderColor: (icons[index].border && icons[index].style !== 'default' ? icons[index].border : undefined),
								borderWidth: (icons[index].borderWidth && icons[index].style !== 'default' ? icons[index].borderWidth + 'px' : undefined),
								borderRadius: (icons[index].borderRadius && icons[index].style !== 'default' ? icons[index].borderRadius + '%' : undefined),
							}} />
						</a>
					)}
					{icons[index].icon && !icons[index].link && (
						<GenIcon className={`icl icl-${icons[index].icon}`} name={icons[index].icon} size={icons[index].size} strokeWidth={('fe' === icons[index].icon.substring(0, 2) ? icons[index].width : undefined)} icon={('fa' === icons[index].icon.substring(0, 2) ? FaIco[icons[index].icon] : Ico[icons[index].icon])} title={(icons[index].title ? icons[index].title : '')} style={{
							color: (icons[index].color ? icons[index].color : undefined),
							backgroundColor: (icons[index].background && icons[index].style !== 'default' ? icons[index].background : undefined),
							padding: (icons[index].padding && icons[index].style !== 'default' ? icons[index].padding + 'px' : undefined),
							borderColor: (icons[index].border && icons[index].style !== 'default' ? icons[index].border : undefined),
							borderWidth: (icons[index].borderWidth && icons[index].style !== 'default' ? icons[index].borderWidth + 'px' : undefined),
							borderRadius: (icons[index].borderRadius && icons[index].style !== 'default' ? icons[index].borderRadius + '%' : undefined),
							marginTop: (icons[index].marginTop ? icons[index].marginTop + 'px' : undefined),
							marginRight: (icons[index].marginRight ? icons[index].marginRight + 'px' : undefined),
							marginBottom: (icons[index].marginBottom ? icons[index].marginBottom + 'px' : undefined),
							marginLeft: (icons[index].marginLeft ? icons[index].marginLeft + 'px' : undefined),
							order: iconorder,
						}} />
					)}
					{htmlItem}
				</div>
			);
		};
		return (
			<div className={`icli icli${uniqueID} align${(blockAlignment ? blockAlignment : 'center')}`} style={{
				textAlign: (textAlignment ? textAlignment : 'center'),
			}} >
				{times(iconCount, n => renderSaveIcons(n))}
			</div>
		);
	},
});
