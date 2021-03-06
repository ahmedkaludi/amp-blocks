/**
 * BLOCK: AMP Image
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */
import edit from "./edit";
import "./style.scss";
import "./editor.scss";
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
registerBlockType("ampblocks/image", {
	title: __("Image"), // Block title.
	icon: "format-image", // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: "amp-blocks", // Block category
	keywords: [
		//Keywords
		__("photo"),
		__("image"),
		__("pic"),
	],
	attributes: {
		//Attributes
		width: {
			type: "number",
		},
		maxwidth: {
			type: "number",
		},
		height: {
			type: "number",
		},
		maxheight: {
			type: "number",
		},
		percentage: {
			type: "number",
			default: 100,
		},
		borderRadius: {
			type: "number",
			default: 0,
		},
		imageurl: {
			type: "string",
		},
		blockAlignment: {
			type: "string",
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
		const {
			width,
			maxwidth,
			height,
			maxheight,
			percentage,
			imageurl,
			borderRadius,
			blockAlignment,
		} = attributes;
		let displayimage = (imageurl) => {
			//Loops throug the image
			if (typeof imageurl !== "undefined") {
				let stylecontent = {};
				if (typeof borderRadius !== "undefined" && borderRadius != 0) {
					stylecontent["borderRadius"] = borderRadius + "%";
				}
				stylecontent["width"] = percentage + "%";
				let stylecontentmain = {};
				let alignment = "";
				stylecontentmain["max-width"] = maxwidth + "px";
				if (blockAlignment == "center") {
					alignment = "aligncenter";
				} else if (blockAlignment == "right") {
					alignment = "alignright";
				} else if (blockAlignment == "left") {
					alignment = "alignleft";
				}
				if (percentage == "100") {
					delete stylecontent["width"];
					return (
						<div className={`imc ${alignment}`}>
							<img className="im-t" src={imageurl} style={stylecontent} />
						</div>
					);
				} else {
					return (
						<div className={`imc ${alignment}`} style={stylecontentmain}>
							<img className="im-t" src={imageurl} style={stylecontent} />
						</div>
					);
				}
			} else {
				return "";
			}
		};
		return <div className="imw">{displayimage(imageurl)}</div>;
	},
});
