/**
 * BLOCK: AMP Image
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */
import edit from './edit';
import './editor.scss';
const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType('ampblocks/image', {
	title: __('Image'), // Block title.
	icon: 'format-image', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'amp-blocks', // Block category
	keywords: [ //Keywords
		__('photo'),
		__('image'),
		__('pic'),
	],
	attributes: { //Attributes
		width: {
			type: 'number',
		},
		maxwidth: {
			type: 'number',
		},
		height: {
			type: 'number',
		},
		maxheight: {
			type: 'number',
		},
		borderRadius: {
			type: 'number',
			default: 0,
		},
		imageurl: {
			type: 'string',
		},
	},
	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit,
	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	save({ attributes }) {
		const { width, maxwidth, height, maxheight, imageurl, borderRadius } = attributes;
		let displayimage = (imageurl) => {
			//Loops throug the image
			if (typeof imageurl !== 'undefined') {
				let stylecontent = {};
				if (borderRadius != 0) {
					stylecontent['borderRadius'] = borderRadius + '%';
				}
				if (maxwidth < width) {
					stylecontent['maxWidth'] = width + 'px';
					stylecontent['minHeight'] = height + 'px';
				}
				if (maxheight < height) {
					stylecontent['minHeight'] = height + 'px';
				}
				return (
					<div className="imc">
						<img className='im-t' width={width} height={height} src={imageurl} style={stylecontent} />
					</div>
				)
			} else {
				return ("");
			}
		};
		return (
			<div className="imw">
				{displayimage(imageurl)}
			</div>
		)
	},
});
