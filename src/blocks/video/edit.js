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
			hideShowUploadButton: arguments[0].attributes.video ? false : true,
		};
	}
	youtubeVideoConvertor = (url) => {
		var name = 'v';
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return '//www.youtube.com/embed/' + decodeURIComponent(results[2].replace(/\+/g, " "));
	}
	render() {
		const { attributes, setAttributes } = this.props;
		const { video, videoSource } = attributes;

		let displayvideo = (video) => {
			if (videoSource) {
				return (
					<div className="gallery-item-container">
						<iframe width="100%" height="100%" className='video-item' src={this.youtubeVideoConvertor(video)} />
					</div>
				)
			} else {
				//Loops throug the video
				if (typeof video !== 'undefined') {
					return (
						<div className="v-c">
							<video controls width="100%" height="100%" className='video-item' src={video} />
						</div>
					)
				} else {
					return ("");
				}
			}
		};
		return (
			<Fragment>
				<div className="v">
					{displayvideo(video)}
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
									setAttributes({ video: value });
									this.setState({ hideShowUploadButton: false })
								}}
							/>
						)}
					</PanelBody>
				</InspectorControls>
				{/* content to display on block slected START */}
				{this.state.hideShowUploadButton && (
					<MediaUpload
						onSelect={(media) => { setAttributes({ video: media.url }); this.setState({ hideShowUploadButton: false }) }}
						value={video}
						allowedTypes={'video'}
						render={({ open }) => (
							<Button className="select-video-button is-button is-default is-large" onClick={open}>
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
