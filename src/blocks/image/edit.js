/**
 * BLOCK: AMP Image
 *
 * Editor for Image
 */
import ResizableBox from 're-resizable';
const { __ } = wp.i18n;
const { MediaUpload } = wp.editor; //Import MediaUpload from wp.editor
const {
	InspectorControls,
} = wp.blockEditor;
const {
	Component,
	Fragment,
} = wp.element;
const {
	PanelBody,
	Button,
	SelectControl,
	TextControl,
	RangeControl,
} = wp.components;
class ampImage extends Component {
	constructor() {
		super(...arguments);
		this.state = {
			hideShowUploadButton: arguments[0].attributes.imageurl ? false : true,
		};
	}
	render() {
		const { attributes, setAttributes, toggleSelection } = this.props;
		const { width, height, imageurl, imageSource } = attributes;
		const currentWidth = width || 20;
		const currentHeight = height || 20;
		let displayimage = (imageurl) => {
			//Loops throug the image
			if (typeof imageurl !== 'undefined') {
				return (
					<ResizableBox
						size={{
							height,
							width,
						}}
						handleClasses={{
							top: 'cr-handler-top',
							bottom: 'cr-handler-bottom',
						}}
						enable={{
							top: false,
							right: true,
							bottom: true,
							left: false,
							topRight: false,
							bottomRight: false,
							bottomLeft: false,
							topLeft: false,
						}}
						className={'components-resizable-box__container'}
						onResize={(event, direction, elt, delta) => {
							event.preventDefault();
						}}
						onResizeStop={(event, direction, elt, delta) => {
							setAttributes({
								width: parseInt(currentWidth + delta.width, 10),
								height: parseInt(currentHeight + delta.height, 10),
							});
							toggleSelection(true);
						}}
						onResizeStart={() => {
							toggleSelection(false);
						}}
					>
						<div className="imc">
							<img width={width} height={height} className='im-t' src={imageurl} />
						</div>
					</ResizableBox>
				)
			} else {
				return ("");
			}
		};
		return (
			<Fragment>
				<div className="image-grid">
					{displayimage(imageurl)}
				</div>
				<InspectorControls> {/* For left panel controls */}
					<PanelBody title={__('image URL')}>
						<SelectControl
							label={__('Link Target', 'amp-blocks')}
							//value={ btns[ indexcountamp ].target }
							options={[
								{ value: 'false', label: __('Internal', 'amp-blocks') },
								{ value: 'true', label: __('External', 'amp-blocks') },
							]}
							onChange={value => {
								setAttributes({
									imageSource: value,
								});
							}}
						/>
					</PanelBody>
					<PanelBody title={__('Image Size')}>
						<RangeControl
							label={__('Width')}
							value={(typeof width !== 'undefined' ? width : 50)}
							onChange={(value) => { setAttributes({ width: value }); }}
							min={0}
							max={1000}
						/>
						<RangeControl
							label={__('Height')}
							value={(typeof height !== 'undefined' ? height : 50)}
							onChange={(value) => { setAttributes({ height: value }); }}
							min={0}
							max={1000}
						/>
					</PanelBody>
				</InspectorControls>
				{imageSource && (
					<TextControl
						label={__('Please Enter URL', 'amp-blocks')}
						onChange={(value) => {
							setAttributes({ imageurl: value.url });
							this.setState({ hideShowUploadButton: false })
						}}
					/>
				)}
				{/* content to display on block slected START */}
				{this.state.hideShowUploadButton && (
					<MediaUpload
						onSelect={(media) => {setAttributes({ width: (media.width < 700)? media.width :700 , height:(media.height < 700)? media.width :700 , imageurl: media.url}); this.setState({ hideShowUploadButton: false }) }}
						allowedTypes={'image'}
						value={imageurl}
						render={({ open }) => (
							<Button className="select-image-button is-button is-default is-large" onClick={open}>
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
export default (ampImage);
