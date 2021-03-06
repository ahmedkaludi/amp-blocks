/**
 * BLOCK: AMP Image
 *
 * Editor for Image
 */
import ResizableBox from "re-resizable";
const { __ } = wp.i18n;
const { MediaUpload } = wp.editor; //Import MediaUpload from wp.editor
const {
	InspectorControls,
	BlockControls,
	BlockAlignmentToolbar,
} = wp.blockEditor;
const { Component, Fragment } = wp.element;
const {
	PanelBody,
	Button,
	SelectControl,
	TextControl,
	RangeControl,
} = wp.components;
const rowUniqueIDs = [];
class ampImage extends Component {
	constructor() {
		super(...arguments);
		this.state = {
			hideShowUploadButton: arguments[0].attributes.imageurl ? false : true,
		};
		this.bindContainer = this.bindContainer.bind(this);
	}
	bindContainer(ref) {
		this.container = ref;
	}
	componentDidMount() {
		if (!this.props.attributes.uniqueID) {
			this.props.setAttributes({
				uniqueID: "_" + this.props.clientId.substr(2, 3),
			});
			rowUniqueIDs.push("_" + this.props.clientId.substr(2, 3));
		} else if (rowUniqueIDs.includes(this.props.attributes.uniqueID)) {
			this.props.attributes.uniqueID = "_" + this.props.clientId.substr(2, 3);
			this.props.setAttributes({
				uniqueID: "_" + this.props.clientId.substr(2, 3),
			});
			rowUniqueIDs.push("_" + this.props.clientId.substr(2, 3));
		} else {
			rowUniqueIDs.push(this.props.attributes.uniqueID);
		}
	}
	render() {
		const sizes = {
			containerWidth: this.container && this.container.clientWidth,
			containerHeight: this.container && this.container.clientHeight,
		};
		const { attributes, setAttributes, toggleSelection } = this.props;
		const {
			width,
			maxwidth,
			height,
			percentage,
			maxheight,
			borderRadius,
			imageurl,
			imageSource,
			uniqueID,
			blockAlignment,
		} = attributes;

		const calmaxWidth = sizes.containerWidth;
		const calexceedMaxWidth = maxwidth > calmaxWidth;
		const calratio = maxheight / maxwidth;
		const calwidth = calexceedMaxWidth ? calmaxWidth : maxwidth;
		const calheight = calexceedMaxWidth ? calmaxWidth * calratio : maxheight;
		const currentWidth = width || calwidth;
		const currentHeight = height || calheight;
		let displayimage = (imageurl, stylecontent) => {
			let pec = percentage + "%";
			//Loops throug the image
			if (typeof imageurl !== "undefined") {
				return (
					<ResizableBox
						size={{
							width: currentWidth,
							height: currentHeight,
						}}
						maxWidth={"100%"}
						handleClasses={{
							left: "ihl",
							right: "ihr",
							bottom: "ihb",
						}}
						lockAspectRatio
						enable={{
							top: false,
							right: true,
							bottom: true,
							left: true,
						}}
						className={"ih"}
						onResize={(event, direction, elt, delta) => {
							let newwidth = currentWidth + delta.width;
							let widthinpercentage = Math.round((newwidth / calwidth) * 100);
							event.preventDefault();
							document.getElementById("lcw" + uniqueID).innerHTML =
								newwidth + "px";
							document.getElementById("lcw" + uniqueID).style.opacity = 1;
							document.getElementById("rcw" + uniqueID).innerHTML =
								widthinpercentage + "%";
							document.getElementById("rcw" + uniqueID).style.opacity = 1;
						}}
						onResizeStop={(event, direction, elt, delta) => {
							let newwidth = currentWidth + delta.width;
							let widthinpercentage = Math.round((newwidth / calwidth) * 100);
							setAttributes({
								percentage: parseInt(widthinpercentage),
								width: parseInt(currentWidth + delta.width, 10),
								height: parseInt(currentHeight + delta.height, 10),
							});
							toggleSelection(true);
							document.getElementById("lcw" + uniqueID).style.opacity = 0;
							document.getElementById("rcw" + uniqueID).style.opacity = 0;
						}}
						onResizeStart={(event, direction, elt, delta) => {
							toggleSelection(false);
						}}
					>
						<img className="im-t" src={imageurl} style={stylecontent} />

						<span id={`lcw` + uniqueID} className="left-column-width-size lcw">
							{!currentWidth ? width : currentWidth + "px"}
						</span>
						<span id={`rcw` + uniqueID} className="right-column-width-size lcw">
							{!currentWidth ? width : currentWidth + "px"}
						</span>
					</ResizableBox>
				);
			} else {
				return "";
			}
		};
		let stylecontent = {};
		if (borderRadius != 0) {
			stylecontent["borderRadius"] = borderRadius + "%";
		}
		stylecontent["width"] = percentage + "%";
		let stylecontentmain = {};
		stylecontentmain["max-width"] = maxwidth + "px";
		return (
			<Fragment>
				<div
					className="image-grid"
					data-align={blockAlignment}
					ref={this.bindContainer}
				>
					<div className="imc" style={stylecontentmain}>
						{displayimage(imageurl, stylecontent)}
					</div>
				</div>
				<BlockControls>
					<BlockAlignmentToolbar
						value={blockAlignment}
						controls={["center", "left", "right"]}
						onChange={(value) => setAttributes({ blockAlignment: value })}
					/>
				</BlockControls>
				<InspectorControls>
					{" "}
					{/* For left panel controls */}
					<PanelBody title={__("image URL")}>
						<SelectControl
							label={__("Link Target", "amp-blocks")}
							//value={ btns[ indexcountamp ].target }
							options={[
								{ value: "false", label: __("Internal", "amp-blocks") },
								{ value: "true", label: __("External", "amp-blocks") },
							]}
							onChange={(value) => {
								setAttributes({
									imageSource: value,
								});
							}}
						/>
					</PanelBody>
					<PanelBody title={__("Image Size")}>
						<RangeControl
							label={__("Size")}
							value={percentage}
							onChange={(value) => {
								let newwdith = (value * calwidth) / 100;
								let newheight = (value * calheight) / 100;
								setAttributes({
									percentage: parseInt(value),
									width: parseInt(newwdith, 10),
									height: parseInt(newheight, 10),
								});
							}}
							min={2}
							max={100}
						/>
						<h2>
							{__("Width")} : {currentWidth} px {__("Height")} : {currentHeight}{" "}
							px
						</h2>
						<RangeControl
							label={__("Border Radius", "amp-blocks")}
							value={borderRadius}
							onChange={(value) => {
								setAttributes({ borderRadius: value });
							}}
							min={0}
							max={100}
						/>
					</PanelBody>
				</InspectorControls>
				{imageSource && (
					<TextControl
						label={__("Please Enter URL", "amp-blocks")}
						onChange={(value) => {
							setAttributes({ imageurl: value.url });
							this.setState({ hideShowUploadButton: false });
						}}
					/>
				)}
				{/* content to display on block slected START */}
				{this.state.hideShowUploadButton && (
					<MediaUpload
						onSelect={(media) => {
							setAttributes({
								imageurl: media.url,
								maxwidth: media.width,
								maxheight: media.height,
							});
							this.setState({ hideShowUploadButton: false });
						}}
						allowedTypes={"image"}
						value={imageurl}
						render={({ open }) => (
							<Button
								className="select-image-button is-button is-default is-large"
								onClick={open}
							>
								Add image
							</Button>
						)}
					/>
				)}
				{/* content to display on block slected END */}
			</Fragment>
		);
	}
}
export default ampImage;
