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
const rowUniqueIDs = [];
class ampImage extends Component {
	constructor() {
		super(...arguments);
		this.state = {
			hideShowUploadButton: arguments[0].attributes.imageurl ? false : true,
		};
		this.bindContainer = this.bindContainer.bind( this );
	}
	bindContainer( ref ) {
		this.container = ref;
	}
	componentDidMount() {
		if (! this.props.attributes.uniqueID) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 3 ),
			} );
			rowUniqueIDs.push( '_' + this.props.clientId.substr( 2, 3 ) );
		} else if (rowUniqueIDs.includes( this.props.attributes.uniqueID )) {
			this.props.attributes.uniqueID = '_' + this.props.clientId.substr( 2, 3 );
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 3 ),
			} );
			rowUniqueIDs.push( '_' + this.props.clientId.substr( 2, 3 ) );
		} else {
			rowUniqueIDs.push( this.props.attributes.uniqueID );
		}
	}
	render() {
		const sizes = {
			containerWidth: this.container && this.container.clientWidth,
			containerHeight: this.container && this.container.clientHeight,
		};
		const { attributes, setAttributes, toggleSelection } = this.props;
		const { width, height, imageurl, imageSource,uniqueID } = attributes;
		const currentWidth = width || sizes.containerWidth;
		const currentHeight = height || sizes.containerHeight;
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
							top: 'iht',
							bottom: 'ihb',
						}}
						lockAspectRatio
						enable={{
							top: true,
							right: true,
							bottom: true,
							left: true,
						}}
						className={'ih'}
						onResize={(event, direction, elt, delta) => {
							event.preventDefault();
							document.getElementById( 'lcw' + uniqueID ).innerHTML = currentWidth+delta.width + 'px';
							document.getElementById( 'lcw' + uniqueID ).style.opacity = 1;
						}}
						onResizeStop={(event, direction, elt, delta) => {
							setAttributes({
								width: parseInt(currentWidth + delta.width, 10),
								height: parseInt(currentHeight + delta.height, 10),
							});
							toggleSelection(true);
							document.getElementById( 'lcw' + uniqueID ).style.opacity = 0;
						}}
						onResizeStart={() => {
							toggleSelection(false);
						}}
					>
						<div className="imc" ref={ this.bindContainer }>
							<img className='im-t' src={imageurl} />
						</div>
						<span id={`lcw`+uniqueID}
							className="left-column-width-size lcw">
							{(!currentWidth ? width : currentWidth + 'px')}
						</span>
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
							value={(typeof width !== 'undefined' ? width : '')}
							onChange={(value) => { setAttributes({ width: value }); }}
							min={0}
							max={1000}
						/>
						<RangeControl
							label={__('Height')}
							value={(typeof height !== 'undefined' ? height : '')}
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
						onSelect={(media) => { setAttributes({imageurl: media.url }); this.setState({ hideShowUploadButton: false }) }}
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
