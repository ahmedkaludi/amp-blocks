/**
 * BLOCK: AMP Image
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */
const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const { MediaUpload } = wp.editor; //Import MediaUpload from wp.editor
const { Button } = wp.components; //Import Button from wp.components
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
		__('image')
	],
	attributes: { //Attributes
		image: { //image array
			type: 'json',
		}
	},
	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit({ attributes, setAttributes }) {
		//Destructuring the image array attribute
		const { image } = attributes;
		//Displays the image
		let displayimage = (image) => {
			//Loops throug the image
			if (typeof image !== 'undefined') {
				return (
					<div className="amp-img-block-container">
						<img width="100%" height="100%" className='amp-img-item' src={image.url} />
					</div>
				)
			} else {
				return ("");
			}
		};
		//JSX to return
		return (
			<div>
				<div className="amp-img-block">
					{displayimage(image)}
				</div>
				<br />
				{typeof image === 'undefined' && (
					<MediaUpload
						onSelect={(media) => { setAttributes({ image: media }); }}
						allowedTypes={'image'}
						value={image}
						render={({ open }) => (
							<Button className="select-image-button is-button is-default is-large" onClick={open}>
								Add image
						</Button>
						)}
					/>
				)}
			</div>
		);
	},
	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	save({ attributes }) {
		const { image } = attributes;
		let displayimage = (image) => {
			//Loops throug the image
			if (typeof image !== 'undefined') {
				return (
					<div className="amp-img-block-container">
						<img width="100%" height="100%" className='amp-img-item' src={image.url} />
					</div>
				)
			} else {
				return ("");
			}
		};
		return (
			<div className="amp-image-block">
				{displayimage(image)}
			</div>
		)
	},
});
