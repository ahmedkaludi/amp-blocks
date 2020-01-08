/**
 * BLOCK: AMP Advanced Btn
 *
 * Editor for Advanced Btn
 */
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
} = wp.components;
class ampAdvancedHeading extends Component {
	constructor() {
		super(...arguments);
		this.state = {
			hideShowUploadButton: arguments[0].attributes.images ? false : true,
		};
	}
	GetParamByName(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}
	render() {
		const { attributes, setAttributes } = this.props;
		const { images, videoSource } = attributes;
		const getId = (url) => {
			var a = this.GetParamByName('v', url);
			return '//www.youtube.com/embed/' + a;
		}
		let displayImages = (images) => {
			if (videoSource) {
				return (
					<div className="gallery-item-container">
						<iframe width="900px" height="500px" className='gallery-item' src={getId(images)} />
					</div>
				)
			} else {
				//Loops throug the images
				if (typeof images !== 'undefined') {
					return (
						<div className="gallery-item-container">
							<iframe width="900px" height="500px" className='gallery-item' src={images} />
						</div>
					)
				} else {
					return ("");
				}
			}
		};
		return (
			<Fragment>
				<div className="gallery-grid">
					{displayImages(images)}
				</div>
				<InspectorControls> {/* For left panel controls */}
					<PanelBody title={__('Video URL')}>
						<SelectControl
							label={__('Link Target', 'amp-blocks')}
							//value={ btns[ indexcountamp ].target }
							options={[
								{ value: 'false', label: __('Internal', 'amp-blocks') },
								{ value: 'true', label: __('External', 'amp-blocks') },
							]}
							onChange={value => {
								setAttributes({
									videoSource: value,
								});
							}}
						/>
						{videoSource && (
							<TextControl
								label={__('Please Enter URL', 'amp-blocks')}
								onChange={(value) => {
									setAttributes({ images: value });
									this.setState({ hideShowUploadButton: false })
								}}
							/>
						)}
					</PanelBody>
				</InspectorControls>
				{/* content to display on block slected START */}
				{this.state.hideShowUploadButton && (
					<MediaUpload
						onSelect={(media) => { setAttributes({ images: media.url }); this.setState({ hideShowUploadButton: false }) }}
						value={images}
						render={({ open }) => (
							<Button className="select-images-button is-button is-default is-large" onClick={open}>
								Upload Video
				</Button>
						)}
					/>
				)}
				{/* content to display on block slected END */}
			</Fragment>
		);
	}
}
export default (ampAdvancedHeading);
