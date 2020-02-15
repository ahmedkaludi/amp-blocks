/**
 * BLOCK: ampblocks Icon
 */

/**
 * Import Icon stuff
 */
import itemicons from './icon';
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

/**
 * Register: a Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'ampblocks/icon', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Icon' ), // Block title.
	icon: {
		src: itemicons.block,
	},
	category: 'amp-blocks', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'icon' ),
		__( 'svg' ),
	],
	attributes: {
		icons: {
			type: 'array',
			default: [ {
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
				marginRight: 0,
				marginBottom: 0,
				marginLeft: 0,
			} ],
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
	},
	getEditWrapperProps( { blockAlignment } ) {
		if ( 'left' === blockAlignment || 'right' === blockAlignment || 'center' === blockAlignment ) {
			return { 'data-align': blockAlignment };
		}
	},
	edit,

	save: props => {
		const { attributes: { icons, iconCount, blockAlignment, textAlignment, uniqueID } } = props;
		const renderSaveIcons = ( index ) => {
			return (
				<div className={ `isvg-s-${ icons[ index ].style } isvg-w isvg-i-${ index }` }>
					{ icons[ index ].icon && icons[ index ].link && (
						<a href={ icons[ index ].link } className={ 'isvg-link' } target={ ( '_blank' === icons[ index ].target ? icons[ index ].target : undefined ) } rel={ '_blank' === icons[ index ].target ? 'noopener noreferrer' : undefined } style={ {
							marginTop: ( icons[ index ].marginTop ? icons[ index ].marginTop + 'px' : undefined ),
							marginRight: ( icons[ index ].marginRight ? icons[ index ].marginRight + 'px' : undefined ),
							marginBottom: ( icons[ index ].marginBottom ? icons[ index ].marginBottom + 'px' : undefined ),
							marginLeft: ( icons[ index ].marginLeft ? icons[ index ].marginLeft + 'px' : undefined ),
						} }
						>
							<GenIcon className={ `isvg isvg-${ icons[ index ].icon }` } name={ icons[ index ].icon } size={ icons[ index ].size } strokeWidth={ ( 'fe' === icons[ index ].icon.substring( 0, 2 ) ? icons[ index ].width : undefined ) } icon={ ( 'fa' === icons[ index ].icon.substring( 0, 2 ) ? FaIco[ icons[ index ].icon ] : Ico[ icons[ index ].icon ] ) } title={ ( icons[ index ].title ? icons[ index ].title : '' ) } style={ {
								color: ( icons[ index ].color ? icons[ index ].color : undefined ),
								backgroundColor: ( icons[ index ].background && icons[ index ].style !== 'default' ? icons[ index ].background : undefined ),
								padding: ( icons[ index ].padding && icons[ index ].style !== 'default' ? icons[ index ].padding + 'px' : undefined ),
								borderColor: ( icons[ index ].border && icons[ index ].style !== 'default' ? icons[ index ].border : undefined ),
								borderWidth: ( icons[ index ].borderWidth && icons[ index ].style !== 'default' ? icons[ index ].borderWidth + 'px' : undefined ),
								borderRadius: ( icons[ index ].borderRadius && icons[ index ].style !== 'default' ? icons[ index ].borderRadius + '%' : undefined ),
							} } />
						</a>
					) }
					{ icons[ index ].icon && ! icons[ index ].link && (
						<GenIcon className={ `isvg isvg-${ icons[ index ].icon }` } name={ icons[ index ].icon } size={ icons[ index ].size } strokeWidth={ ( 'fe' === icons[ index ].icon.substring( 0, 2 ) ? icons[ index ].width : undefined ) } icon={ ( 'fa' === icons[ index ].icon.substring( 0, 2 ) ? FaIco[ icons[ index ].icon ] : Ico[ icons[ index ].icon ] ) } title={ ( icons[ index ].title ? icons[ index ].title : '' ) } style={ {
							color: ( icons[ index ].color ? icons[ index ].color : undefined ),
							backgroundColor: ( icons[ index ].background && icons[ index ].style !== 'default' ? icons[ index ].background : undefined ),
							padding: ( icons[ index ].padding && icons[ index ].style !== 'default' ? icons[ index ].padding + 'px' : undefined ),
							borderColor: ( icons[ index ].border && icons[ index ].style !== 'default' ? icons[ index ].border : undefined ),
							borderWidth: ( icons[ index ].borderWidth && icons[ index ].style !== 'default' ? icons[ index ].borderWidth + 'px' : undefined ),
							borderRadius: ( icons[ index ].borderRadius && icons[ index ].style !== 'default' ? icons[ index ].borderRadius + '%' : undefined ),
							marginTop: ( icons[ index ].marginTop ? icons[ index ].marginTop + 'px' : undefined ),
							marginRight: ( icons[ index ].marginRight ? icons[ index ].marginRight + 'px' : undefined ),
							marginBottom: ( icons[ index ].marginBottom ? icons[ index ].marginBottom + 'px' : undefined ),
							marginLeft: ( icons[ index ].marginLeft ? icons[ index ].marginLeft + 'px' : undefined ),
						} } />
					) }
				</div>
			);
		};
		return (
			<div className={ `isvgi isvgi${ uniqueID } align${ ( blockAlignment ? blockAlignment : 'center' ) }` } style={ {
				textAlign: ( textAlignment ? textAlignment : 'center' ),
			} } >
				{ times( iconCount, n => renderSaveIcons( n ) ) }
			</div>
		);
	},
	deprecated: [
		{
			attributes: {
				icons: {
					type: 'array',
					default: [ {
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
					} ],
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
			},
			save: ( { attributes } ) => {
				const { icons, iconCount, blockAlignment, textAlignment, uniqueID } = attributes;
				const renderSaveIcons = ( index ) => {
					return (
						<div className={ `isvg-s-${ icons[ index ].style } isvg-w isvg-i-${ index }` }>
							{ icons[ index ].icon && icons[ index ].link && (
								<a href={ icons[ index ].link } className={ 'isvg-link' } target={ ( '_blank' === icons[ index ].target ? icons[ index ].target : undefined ) } rel={ '_blank' === icons[ index ].target ? 'noopener noreferrer' : undefined }>
									<GenIcon className={ `isvg isvg-${ icons[ index ].icon }` } name={ icons[ index ].icon } size={ icons[ index ].size } strokeWidth={ ( 'fe' === icons[ index ].icon.substring( 0, 2 ) ? icons[ index ].width : undefined ) } icon={ ( 'fa' === icons[ index ].icon.substring( 0, 2 ) ? FaIco[ icons[ index ].icon ] : Ico[ icons[ index ].icon ] ) } title={ ( icons[ index ].title ? icons[ index ].title : '' ) } style={ {
										color: ( icons[ index ].color ? icons[ index ].color : undefined ),
										backgroundColor: ( icons[ index ].background && icons[ index ].style !== 'default' ? icons[ index ].background : undefined ),
										padding: ( icons[ index ].padding && icons[ index ].style !== 'default' ? icons[ index ].padding + 'px' : undefined ),
										borderColor: ( icons[ index ].border && icons[ index ].style !== 'default' ? icons[ index ].border : undefined ),
										borderWidth: ( icons[ index ].borderWidth && icons[ index ].style !== 'default' ? icons[ index ].borderWidth + 'px' : undefined ),
										borderRadius: ( icons[ index ].borderRadius && icons[ index ].style !== 'default' ? icons[ index ].borderRadius + '%' : undefined ),
									} } />
								</a>
							) }
							{ icons[ index ].icon && ! icons[ index ].link && (
								<GenIcon className={ `isvg isvg-${ icons[ index ].icon }` } name={ icons[ index ].icon } size={ icons[ index ].size } strokeWidth={ ( 'fe' === icons[ index ].icon.substring( 0, 2 ) ? icons[ index ].width : undefined ) } icon={ ( 'fa' === icons[ index ].icon.substring( 0, 2 ) ? FaIco[ icons[ index ].icon ] : Ico[ icons[ index ].icon ] ) } title={ ( icons[ index ].title ? icons[ index ].title : '' ) } style={ {
									color: ( icons[ index ].color ? icons[ index ].color : undefined ),
									backgroundColor: ( icons[ index ].background && icons[ index ].style !== 'default' ? icons[ index ].background : undefined ),
									padding: ( icons[ index ].padding && icons[ index ].style !== 'default' ? icons[ index ].padding + 'px' : undefined ),
									borderColor: ( icons[ index ].border && icons[ index ].style !== 'default' ? icons[ index ].border : undefined ),
									borderWidth: ( icons[ index ].borderWidth && icons[ index ].style !== 'default' ? icons[ index ].borderWidth + 'px' : undefined ),
									borderRadius: ( icons[ index ].borderRadius && icons[ index ].style !== 'default' ? icons[ index ].borderRadius + '%' : undefined ),
								} } />
							) }
						</div>
					);
				};
				return (
					<div className={ `isvgi isvgi${ uniqueID } align${ ( blockAlignment ? blockAlignment : 'center' ) }` } style={ {
						textAlign: ( textAlignment ? textAlignment : 'center' ),
					} } >
						{ times( iconCount, n => renderSaveIcons( n ) ) }
					</div>
				);
			},
		},
		{
			attributes: {
				icons: {
					type: 'array',
					default: [ {
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
					} ],
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
			},
			save: ( { attributes } ) => {
				const { icons, iconCount, blockAlignment, textAlignment, uniqueID } = attributes;
				const renderSaveIcons = ( index ) => {
					return (
						<div className={ `isvg-s-${ icons[ index ].style } isvg-w isvg-i-${ index }` }>
							{ icons[ index ].icon && icons[ index ].link && (
								<a href={ icons[ index ].link } className={ 'isvg-link' } target={ ( '_blank' === icons[ index ].target ? icons[ index ].target : undefined ) } rel={ '_blank' === icons[ index ].target ? 'noopener noreferrer' : undefined }>
									<div style={ {
										color: ( icons[ index ].color ? icons[ index ].color : undefined ),
										backgroundColor: ( icons[ index ].background && icons[ index ].style !== 'default' ? icons[ index ].background : undefined ),
										padding: ( icons[ index ].padding && icons[ index ].style !== 'default' ? icons[ index ].padding + 'px' : undefined ),
										borderColor: ( icons[ index ].border && icons[ index ].style !== 'default' ? icons[ index ].border : undefined ),
										borderWidth: ( icons[ index ].borderWidth && icons[ index ].style !== 'default' ? icons[ index ].borderWidth + 'px' : undefined ),
										borderRadius: ( icons[ index ].borderRadius && icons[ index ].style !== 'default' ? icons[ index ].borderRadius + '%' : undefined ),
									} } className={ `isvg isvg-${ icons[ index ].icon }` }>
									</div>
								</a>
							) }
							{ icons[ index ].icon && ! icons[ index ].link && (
								<div style={ {
									color: ( icons[ index ].color ? icons[ index ].color : undefined ),
									backgroundColor: ( icons[ index ].background && icons[ index ].style !== 'default' ? icons[ index ].background : undefined ),
									padding: ( icons[ index ].padding && icons[ index ].style !== 'default' ? icons[ index ].padding + 'px' : undefined ),
									borderColor: ( icons[ index ].border && icons[ index ].style !== 'default' ? icons[ index ].border : undefined ),
									borderWidth: ( icons[ index ].borderWidth && icons[ index ].style !== 'default' ? icons[ index ].borderWidth + 'px' : undefined ),
									borderRadius: ( icons[ index ].borderRadius && icons[ index ].style !== 'default' ? icons[ index ].borderRadius + '%' : undefined ),
								} } className={ `isvg isvg-${ icons[ index ].icon }` }>
								</div>
							) }
						</div>
					);
				};
				return (
					<div className={ `isvgi isvgi${ uniqueID } align${ ( blockAlignment ? blockAlignment : 'center' ) }` } style={ {
						textAlign: ( textAlignment ? textAlignment : 'center' ),
					} } >
						{ times( iconCount, n => renderSaveIcons( n ) ) }
					</div>
				);
			},
		},
		{
			attributes: {
				icons: {
					type: 'array',
					default: [ {
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
					} ],
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
			},
			save: ( { attributes } ) => {
				const { icons, iconCount, blockAlignment, textAlignment, uniqueID } = attributes;
				const renderSaveIcons = ( index ) => {
					return (
						<div className={ `isvg-s-${ icons[ index ].style } isvg-w isvg-i-${ index }` }>
							{ icons[ index ].icon && icons[ index ].link && (
								<a href={ icons[ index ].link } className={ 'isvg-link' } target={ icons[ index ].target }>
									<GenIcon className={ `isvg isvg-${ icons[ index ].icon }` } name={ icons[ index ].icon } size={ icons[ index ].size } strokeWidth={ ( 'fe' === icons[ index ].icon.substring( 0, 2 ) ? icons[ index ].width : undefined ) } icon={ ( 'fa' === icons[ index ].icon.substring( 0, 2 ) ? FaIco[ icons[ index ].icon ] : Ico[ icons[ index ].icon ] ) } title={ ( icons[ index ].title ? icons[ index ].title : '' ) } style={ {
										color: ( icons[ index ].color ? icons[ index ].color : undefined ),
										backgroundColor: ( icons[ index ].background && icons[ index ].style !== 'default' ? icons[ index ].background : undefined ),
										padding: ( icons[ index ].padding && icons[ index ].style !== 'default' ? icons[ index ].padding + 'px' : undefined ),
										borderColor: ( icons[ index ].border && icons[ index ].style !== 'default' ? icons[ index ].border : undefined ),
										borderWidth: ( icons[ index ].borderWidth && icons[ index ].style !== 'default' ? icons[ index ].borderWidth + 'px' : undefined ),
										borderRadius: ( icons[ index ].borderRadius && icons[ index ].style !== 'default' ? icons[ index ].borderRadius + '%' : undefined ),
									} } />
								</a>
							) }
							{ icons[ index ].icon && ! icons[ index ].link && (
								<GenIcon className={ `isvg isvg-${ icons[ index ].icon }` } name={ icons[ index ].icon } size={ icons[ index ].size } strokeWidth={ ( 'fe' === icons[ index ].icon.substring( 0, 2 ) ? icons[ index ].width : undefined ) } icon={ ( 'fa' === icons[ index ].icon.substring( 0, 2 ) ? FaIco[ icons[ index ].icon ] : Ico[ icons[ index ].icon ] ) } title={ ( icons[ index ].title ? icons[ index ].title : '' ) } style={ {
									color: ( icons[ index ].color ? icons[ index ].color : undefined ),
									backgroundColor: ( icons[ index ].background && icons[ index ].style !== 'default' ? icons[ index ].background : undefined ),
									padding: ( icons[ index ].padding && icons[ index ].style !== 'default' ? icons[ index ].padding + 'px' : undefined ),
									borderColor: ( icons[ index ].border && icons[ index ].style !== 'default' ? icons[ index ].border : undefined ),
									borderWidth: ( icons[ index ].borderWidth && icons[ index ].style !== 'default' ? icons[ index ].borderWidth + 'px' : undefined ),
									borderRadius: ( icons[ index ].borderRadius && icons[ index ].style !== 'default' ? icons[ index ].borderRadius + '%' : undefined ),
								} } />
							) }
						</div>
					);
				};
				return (
					<div className={ `isvgi isvgi${ uniqueID } align${ ( blockAlignment ? blockAlignment : 'center' ) }` } style={ {
						textAlign: ( textAlignment ? textAlignment : 'center' ),
					} } >
						{ times( iconCount, n => renderSaveIcons( n ) ) }
					</div>
				);
			},
		},
		{
			attributes: {
				icons: {
					type: 'array',
					default: [ {
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
					} ],
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
			},
			save: ( { attributes } ) => {
				const { icons, iconCount, blockAlignment, textAlignment, uniqueID } = attributes;
				const renderSaveIcons = ( index ) => {
					return (
						<div className={ `isvg-s-${ icons[ index ].style } isvg-w isvg-i-${ index }` }>
							{ icons[ index ].icon && icons[ index ].link && (
								<a href={ icons[ index ].link } className={ 'isvg-link' } target={ icons[ index ].target } rel="noopener noreferrer">
									<GenIcon className={ `isvg isvg-${ icons[ index ].icon }` } name={ icons[ index ].icon } size={ icons[ index ].size } strokeWidth={ ( 'fe' === icons[ index ].icon.substring( 0, 2 ) ? icons[ index ].width : undefined ) } icon={ ( 'fa' === icons[ index ].icon.substring( 0, 2 ) ? FaIco[ icons[ index ].icon ] : Ico[ icons[ index ].icon ] ) } title={ ( icons[ index ].title ? icons[ index ].title : '' ) } style={ {
										color: ( icons[ index ].color ? icons[ index ].color : undefined ),
										backgroundColor: ( icons[ index ].background && icons[ index ].style !== 'default' ? icons[ index ].background : undefined ),
										padding: ( icons[ index ].padding && icons[ index ].style !== 'default' ? icons[ index ].padding + 'px' : undefined ),
										borderColor: ( icons[ index ].border && icons[ index ].style !== 'default' ? icons[ index ].border : undefined ),
										borderWidth: ( icons[ index ].borderWidth && icons[ index ].style !== 'default' ? icons[ index ].borderWidth + 'px' : undefined ),
										borderRadius: ( icons[ index ].borderRadius && icons[ index ].style !== 'default' ? icons[ index ].borderRadius + '%' : undefined ),
									} } />
								</a>
							) }
							{ icons[ index ].icon && ! icons[ index ].link && (
								<GenIcon className={ `isvg isvg-${ icons[ index ].icon }` } name={ icons[ index ].icon } size={ icons[ index ].size } strokeWidth={ ( 'fe' === icons[ index ].icon.substring( 0, 2 ) ? icons[ index ].width : undefined ) } icon={ ( 'fa' === icons[ index ].icon.substring( 0, 2 ) ? FaIco[ icons[ index ].icon ] : Ico[ icons[ index ].icon ] ) } title={ ( icons[ index ].title ? icons[ index ].title : '' ) } style={ {
									color: ( icons[ index ].color ? icons[ index ].color : undefined ),
									backgroundColor: ( icons[ index ].background && icons[ index ].style !== 'default' ? icons[ index ].background : undefined ),
									padding: ( icons[ index ].padding && icons[ index ].style !== 'default' ? icons[ index ].padding + 'px' : undefined ),
									borderColor: ( icons[ index ].border && icons[ index ].style !== 'default' ? icons[ index ].border : undefined ),
									borderWidth: ( icons[ index ].borderWidth && icons[ index ].style !== 'default' ? icons[ index ].borderWidth + 'px' : undefined ),
									borderRadius: ( icons[ index ].borderRadius && icons[ index ].style !== 'default' ? icons[ index ].borderRadius + '%' : undefined ),
								} } />
							) }
						</div>
					);
				};
				return (
					<div className={ `isvgi isvgi${ uniqueID } align${ ( blockAlignment ? blockAlignment : 'center' ) }` } style={ {
						textAlign: ( textAlignment ? textAlignment : 'center' ),
					} } >
						{ times( iconCount, n => renderSaveIcons( n ) ) }
					</div>
				);
			},
		},
	],
} );
