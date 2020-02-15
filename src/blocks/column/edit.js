/**
 * BLOCK: Amp Column
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Import Icons
 */
import icons from '../../icons';
import hexToRGBA from '../../hex-to-rgba';
import MeasurementControls from '../../measurement-control';
import AdvancedColorControl from '../../advanced-color-control';
import BoxShadowControl from '../../box-shadow-control';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;

const {
	Component,
	Fragment,
} = wp.element;
const {
	InnerBlocks,
	MediaUpload,
	InspectorAdvancedControls,
	InspectorControls,
	AlignmentToolbar,
} = wp.blockEditor;
const {
	TabPanel,
	Dashicon,
	PanelBody,
	Panel,
	Button,
	SelectControl,
	Tooltip,
	RangeControl,
} = wp.components;

/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const columnUniqueIDs = [];

/**
 * Build the spacer edit
 */
class AmpColumn extends Component {
	constructor() {
		super( ...arguments );
		this.saveShadow = this.saveShadow.bind( this );
		this.showSettings = this.showSettings.bind( this );
		this.state = {
			borderWidthControl: 'linked',
			borderRadiusControl: 'linked',
			user: ( amp_blocks_params.userrole ? amp_blocks_params.userrole : 'admin' ),
			settings: {},
		};
	}

	componentDidMount() {
		if (! this.props.attributes.uniqueID) {
			const blockConfigObject = ( amp_blocks_params.configuration ? JSON.parse( amp_blocks_params.configuration ) : [] );
			// Before applying defaults lets check to see if the user wants it.
			if (undefined === this.props.attributes.noCustomDefaults || ! this.props.attributes.noCustomDefaults) {
				if (blockConfigObject['amp/column'] !== undefined && typeof blockConfigObject['amp/column'] === 'object') {
					Object.keys( blockConfigObject['amp/column'] ).map( ( attribute ) => {
						this.props.attributes[attribute] = blockConfigObject['amp/column'][attribute];
					} );
				}
			}
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 3 ),
			} );
			columnUniqueIDs.push( '_' + this.props.clientId.substr( 2, 3 ) );
		} else if (columnUniqueIDs.includes( this.props.attributes.uniqueID )) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 3 ),
			} );
			columnUniqueIDs.push( '_' + this.props.clientId.substr( 2, 3 ) );
		} else {
			columnUniqueIDs.push( this.props.attributes.uniqueID );
		}
		if (this.props.attributes.borderWidth && this.props.attributes.borderWidth[0] === this.props.attributes.borderWidth[1] && this.props.attributes.borderWidth[0] === this.props.attributes.borderWidth[2] && this.props.attributes.borderWidth[0] === this.props.attributes.borderWidth[3]) {
			this.setState( { borderWidthControl: 'linked' } );
		} else {
			this.setState( { borderWidthControl: 'individual' } );
		}
		if (this.props.attributes.borderRadius && this.props.attributes.borderRadius[0] === this.props.attributes.borderRadius[1] && this.props.attributes.borderRadius[0] === this.props.attributes.borderRadius[2] && this.props.attributes.borderRadius[0] === this.props.attributes.borderRadius[3]) {
			this.setState( { borderRadiusControl: 'linked' } );
		} else {
			this.setState( { borderRadiusControl: 'individual' } );
		}
		const blockSettings = ( amp_blocks_params.settings ? JSON.parse( amp_blocks_params.settings ) : {} );
		if (blockSettings['amp/column'] !== undefined && typeof blockSettings['amp/column'] === 'object') {
			this.setState( { settings: blockSettings['amp/column'] } );
		}
	}

	showSettings( key ) {
		if (undefined === this.state.settings[key] || 'all' === this.state.settings[key]) {
			return true;
		} else if ('contributor' === this.state.settings[key] && ( 'contributor' === this.state.user || 'author' === this.state.user || 'editor' === this.state.user || 'admin' === this.state.user )) {
			return true;
		} else if ('author' === this.state.settings[key] && ( 'author' === this.state.user || 'editor' === this.state.user || 'admin' === this.state.user )) {
			return true;
		} else if ('editor' === this.state.settings[key] && ( 'editor' === this.state.user || 'admin' === this.state.user )) {
			return true;
		} else if ('admin' === this.state.settings[key] && 'admin' === this.state.user) {
			return true;
		}
		return false;
	}

	saveShadow( value ) {
		const { attributes, setAttributes } = this.props;
		const { shadow } = attributes;

		const newItems = shadow.map( ( item, thisIndex ) => {
			if (0 === thisIndex) {
				item = { ...item, ...value };
			}

			return item;
		} );
		setAttributes( {
			shadow: newItems,
		} );
	}

	render() {
		const { attributes: { id, topPadding, bottomPadding, leftPadding, rightPadding, topPaddingM, bottomPaddingM, leftPaddingM, rightPaddingM, topMargin, bottomMargin, topMarginM, bottomMarginM, leftMargin, rightMargin, leftMarginM, rightMarginM, topMarginT, bottomMarginT, leftMarginT, rightMarginT, topPaddingT, bottomPaddingT, leftPaddingT, rightPaddingT, backgroundOpacity, background, zIndex, border, borderWidth, borderOpacity, borderRadius, uniqueID, ampAnimation, ampAOSOptions, collapseOrder, backgroundImg, textAlign, textColor, linkColor, linkHoverColor, shadow, displayShadow }, setAttributes, clientId } = this.props;
		const { borderWidthControl, borderRadiusControl } = this.state;
		const saveBackgroundImage = ( value ) => {
			const newUpdate = backgroundImg.map( ( item, index ) => {
				if (0 === index) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				backgroundImg: newUpdate,
			} );
		};
		const onRemoveBGImage = () => {
			saveBackgroundImage( {
				bgImgID: '',
				bgImg: '',
			} );
		};
		const mobileControls = (
			<PanelBody
				title={ __( 'Mobile Padding/Margin' ) }
				initialOpen={ false }
			>
				<h2>{ __( 'Mobile Padding (px)' ) }</h2>
				<RangeControl
					label={ icons.outlinetop }
					value={ topPaddingM }
					className="amp-icon-rangecontrol amp-top-padding"
					onChange={ ( value ) => {
						setAttributes( {
							topPaddingM: value,
						} );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<RangeControl
					label={ icons.outlineright }
					value={ rightPaddingM }
					className="amp-icon-rangecontrol amp-right-padding"
					onChange={ ( value ) => {
						setAttributes( {
							rightPaddingM: value,
						} );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<RangeControl
					label={ icons.outlinebottom }
					value={ bottomPaddingM }
					className="amp-icon-rangecontrol amp-bottom-padding"
					onChange={ ( value ) => {
						setAttributes( {
							bottomPaddingM: value,
						} );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<RangeControl
					label={ icons.outlineleft }
					value={ leftPaddingM }
					className="amp-icon-rangecontrol amp-left-padding"
					onChange={ ( value ) => {
						setAttributes( {
							leftPaddingM: value,
						} );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<h2>{ __( 'Mobile Margin (px)' ) }</h2>
				<RangeControl
					label={ icons.outlinetop }
					value={ topMarginM }
					className="amp-icon-rangecontrol amp-top-margin"
					onChange={ ( value ) => {
						setAttributes( {
							topMarginM: value,
						} );
					} }
					min={ -200 }
					max={ 200 }
				/>
				<RangeControl
					label={ icons.outlineright }
					value={ rightMarginM }
					className="amp-icon-rangecontrol amp-right-margin"
					onChange={ ( value ) => {
						setAttributes( {
							rightMarginM: value,
						} );
					} }
					min={ -200 }
					max={ 200 }
				/>
				<RangeControl
					label={ icons.outlinebottom }
					value={ bottomMarginM }
					className="amp-icon-rangecontrol amp-bottom-margin"
					onChange={ ( value ) => {
						setAttributes( {
							bottomMarginM: value,
						} );
					} }
					min={ -200 }
					max={ 200 }
				/>
				<RangeControl
					label={ icons.outlineleft }
					value={ leftMarginM }
					className="amp-icon-rangecontrol amp-left-margin"
					onChange={ ( value ) => {
						setAttributes( {
							leftMarginM: value,
						} );
					} }
					min={ -200 }
					max={ 200 }
				/>
				<RangeControl
					label={ __( 'Mobile Collapse Order' ) }
					value={ collapseOrder }
					onChange={ ( value ) => {
						setAttributes( {
							collapseOrder: value,
						} );
					} }
					min={ -10 }
					max={ 10 }
				/>
			</PanelBody>
		);
		const tabletControls = (
			<PanelBody
				title={ __( 'Tablet Padding/Margin' ) }
				initialOpen={ false }
			>
				<h2>{ __( 'Tablet Padding (px)' ) }</h2>
				<RangeControl
					label={ icons.outlinetop }
					value={ topPaddingT }
					className="amp-icon-rangecontrol amp-top-padding"
					onChange={ ( value ) => {
						setAttributes( {
							topPaddingT: value,
						} );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<RangeControl
					label={ icons.outlineright }
					value={ rightPaddingT }
					className="amp-icon-rangecontrol amp-right-padding"
					onChange={ ( value ) => {
						setAttributes( {
							rightPaddingT: value,
						} );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<RangeControl
					label={ icons.outlinebottom }
					value={ bottomPaddingT }
					className="amp-icon-rangecontrol amp-bottom-padding"
					onChange={ ( value ) => {
						setAttributes( {
							bottomPaddingT: value,
						} );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<RangeControl
					label={ icons.outlineleft }
					value={ leftPaddingT }
					className="amp-icon-rangecontrol amp-left-padding"
					onChange={ ( value ) => {
						setAttributes( {
							leftPaddingT: value,
						} );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<h2>{ __( 'Tablet Margin (px)' ) }</h2>
				<RangeControl
					label={ icons.outlinetop }
					value={ topMarginT }
					className="amp-icon-rangecontrol amp-top-margin"
					onChange={ ( value ) => {
						setAttributes( {
							topMarginT: value,
						} );
					} }
					min={ -200 }
					max={ 200 }
				/>
				<RangeControl
					label={ icons.outlineright }
					value={ rightMarginT }
					className="amp-icon-rangecontrol amp-right-margin"
					onChange={ ( value ) => {
						setAttributes( {
							rightMarginT: value,
						} );
					} }
					min={ -200 }
					max={ 200 }
				/>
				<RangeControl
					label={ icons.outlinebottom }
					value={ bottomMarginT }
					className="amp-icon-rangecontrol amp-bottom-margin"
					onChange={ ( value ) => {
						setAttributes( {
							bottomMarginT: value,
						} );
					} }
					min={ -200 }
					max={ 200 }
				/>
				<RangeControl
					label={ icons.outlineleft }
					value={ leftMarginT }
					className="amp-icon-rangecontrol amp-left-margin"
					onChange={ ( value ) => {
						setAttributes( {
							leftMarginT: value,
						} );
					} }
					min={ -200 }
					max={ 200 }
				/>
			</PanelBody>
		);
		const deskControls = (
			<PanelBody
				title={ __( 'Padding/Margin' ) }
				initialOpen={ false }
			>
				<h2>{ __( 'Padding (px)' ) }</h2>
				<RangeControl
					label={ icons.outlinetop }
					value={ topPadding }
					className="amp-icon-rangecontrol amp-top-padding"
					onChange={ ( value ) => {
						setAttributes( {
							topPadding: value,
						} );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<RangeControl
					label={ icons.outlineright }
					value={ rightPadding }
					className="amp-icon-rangecontrol amp-right-padding"
					onChange={ ( value ) => {
						setAttributes( {
							rightPadding: value,
						} );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<RangeControl
					label={ icons.outlinebottom }
					value={ bottomPadding }
					className="amp-icon-rangecontrol amp-bottom-padding"
					onChange={ ( value ) => {
						setAttributes( {
							bottomPadding: value,
						} );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<RangeControl
					label={ icons.outlineleft }
					value={ leftPadding }
					className="amp-icon-rangecontrol amp-left-padding"
					onChange={ ( value ) => {
						setAttributes( {
							leftPadding: value,
						} );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<h2>{ __( 'Margin (px)' ) }</h2>
				<RangeControl
					label={ icons.outlinetop }
					value={ topMargin }
					className="amp-icon-rangecontrol amp-top-margin"
					onChange={ ( value ) => {
						setAttributes( {
							topMargin: value,
						} );
					} }
					min={ -200 }
					max={ 200 }
				/>
				<RangeControl
					label={ icons.outlineright }
					value={ rightMargin }
					className="amp-icon-rangecontrol amp-right-margin"
					onChange={ ( value ) => {
						setAttributes( {
							rightMargin: value,
						} );
					} }
					min={ -200 }
					max={ 200 }
				/>
				<RangeControl
					label={ icons.outlinebottom }
					value={ bottomMargin }
					className="amp-icon-rangecontrol amp-bottom-margin"
					onChange={ ( value ) => {
						setAttributes( {
							bottomMargin: value,
						} );
					} }
					min={ -200 }
					max={ 200 }
				/>
				<RangeControl
					label={ icons.outlineleft }
					value={ leftMargin }
					className="amp-icon-rangecontrol amp-left-margin"
					onChange={ ( value ) => {
						setAttributes( {
							leftMargin: value,
						} );
					} }
					min={ -200 }
					max={ 200 }
				/>
			</PanelBody>
		);
		const tabControls = (
			<TabPanel className="amp-inspect-tabs"
					  activeClass="active-tab"
					  tabs={ [
						  {
							  name: 'desk',
							  title: <Dashicon icon="desktop"/>,
							  className: 'amp-desk-tab',
						  },
						  {
							  name: 'tablet',
							  title: <Dashicon icon="tablet"/>,
							  className: 'amp-tablet-tab',
						  },
						  {
							  name: 'mobile',
							  title: <Dashicon icon="smartphone"/>,
							  className: 'amp-mobile-tab',
						  },
					  ] }>
				{
					( tab ) => {
						let tabout;
						if (tab.name) {
							if ('mobile' === tab.name) {
								tabout = mobileControls;
							} else if ('tablet' === tab.name) {
								tabout = tabletControls;
							} else {
								tabout = deskControls;
							}
						}
						return <div>{ tabout }</div>;
					}
				}
			</TabPanel>
		);
		const alignDeskControls = (
			<AlignmentToolbar
				isCollapsed={ false }
				value={ ( textAlign && textAlign[0] ? textAlign[0] : '' ) }
				onChange={ ( nextAlign ) => {
					setAttributes( { textAlign: [ nextAlign, textAlign[1], textAlign[2] ] } );
				} }
			/>
		);
		const alignTabletControls = (
			<AlignmentToolbar
				isCollapsed={ false }
				value={ ( textAlign && textAlign[1] ? textAlign[1] : '' ) }
				onChange={ ( nextAlign ) => {
					setAttributes( { textAlign: [ textAlign[0], nextAlign, textAlign[2] ] } );
				} }
			/>
		);
		const alignMobileControls = (
			<AlignmentToolbar
				isCollapsed={ false }
				value={ ( textAlign && textAlign[2] ? textAlign[2] : '' ) }
				onChange={ ( nextAlign ) => {
					setAttributes( { textAlign: [ textAlign[0], textAlign[1], nextAlign ] } );
				} }
			/>
		);
		const textAlignControls = (
			<Fragment>
				<h2 className="amp-heading-size-title">{ __( 'Text Alignment' ) }</h2>
				<TabPanel className="amp-size-tabs"
						  activeClass="active-tab"
						  tabs={ [
							  {
								  name: 'desk',
								  title: <Dashicon icon="desktop"/>,
								  className: 'amp-desk-tab',
							  },
							  {
								  name: 'tablet',
								  title: <Dashicon icon="tablet"/>,
								  className: 'amp-tablet-tab',
							  },
							  {
								  name: 'mobile',
								  title: <Dashicon icon="smartphone"/>,
								  className: 'amp-mobile-tab',
							  },
						  ] }>
					{
						( tab ) => {
							let tabout;
							if (tab.name) {
								if ('mobile' === tab.name) {
									tabout = alignMobileControls;
								} else if ('tablet' === tab.name) {
									tabout = alignTabletControls;
								} else {
									tabout = alignDeskControls;
								}
							}
							return <div>{ tabout }</div>;
						}
					}
				</TabPanel>
			</Fragment>
		);
		const backgroundString = ( background ? hexToRGBA( background, backgroundOpacity ) : 'transparent' );
		const borderString = ( border ? hexToRGBA( border, borderOpacity ) : 'transparent' );
		const hasChildBlocks = wp.data.select( 'core/block-editor' ).getBlockOrder( clientId ).length > 0;
		return (
			<div className={ `cd c c-${ id } cd-${ uniqueID }` }>
				{ ( textColor || linkColor || linkHoverColor ) && (
					<style>
						{ ( textColor ? `.cd-${ uniqueID }, .cd-${ uniqueID } p, .cd-${ uniqueID } h1, .cd-${ uniqueID } h2, .cd-${ uniqueID } h3, .cd-${ uniqueID } h4, .cd-${ uniqueID } h5, .cd-${ uniqueID } h6 { color: ${ textColor }; }` : '' ) }
						{ ( linkColor ? `.cd-${ uniqueID } a { color: ${ linkColor }; }` : '' ) }
						{ ( linkHoverColor ? `.cd-${ uniqueID } a:hover { color: ${ linkHoverColor }; }` : '' ) }
					</style>
				) }
				{ this.showSettings( 'allSettings' ) && (
					<InspectorControls>
						<Panel
							className={ 'components-panel__body is-opened' }
						>
							{ this.showSettings( 'container' ) && (
								<Fragment>
									<AdvancedColorControl
										label={ __( 'Background Color' ) }
										colorValue={ ( background ? background : '' ) }
										colorDefault={ '' }
										opacityValue={ backgroundOpacity }
										onColorChange={ value => setAttributes( { background: value } ) }
										onOpacityChange={ value => setAttributes( { backgroundOpacity: value } ) }
									/>
									<MediaUpload
										onSelect={ img => {
											saveBackgroundImage( { bgImgID: img.id, bgImg: img.url } );
										} }
										type="image"
										value={ ( backgroundImg && backgroundImg[0] && backgroundImg[0].bgImgID ? backgroundImg[0].bgImgID : '' ) }
										render={ ( { open } ) => (
											<Button
												className={ 'components-button components-icon-button amp-cta-upload-btn' }
												onClick={ open }
											>
												<Dashicon icon="format-image"/>
												{ __( 'Select Image' ) }
											</Button>
										) }
									/>
									{ backgroundImg && backgroundImg[0] && backgroundImg[0].bgImg && (
										<Fragment>
											<Tooltip text={ __( 'Remove Image' ) }>
												<Button
													className={ 'components-button components-icon-button amp-remove-img amp-cta-upload-btn' }
													onClick={ onRemoveBGImage }
												>
													<Dashicon icon="no-alt"/>
												</Button>
											</Tooltip>
											<SelectControl
												label={ __( 'Background Image Size' ) }
												value={ ( backgroundImg && backgroundImg[0] && backgroundImg[0].bgImgSize ? backgroundImg[0].bgImgSize : 'cover' ) }
												options={ [
													{ value: 'cover', label: __( 'Cover' ) },
													{ value: 'contain', label: __( 'Contain' ) },
													{ value: 'auto', label: __( 'Auto' ) },
												] }
												onChange={ value => saveBackgroundImage( { bgImgSize: value } ) }
											/>
											<SelectControl
												label={ __( 'Background Image Position' ) }
												value={ ( backgroundImg && backgroundImg[0] && backgroundImg[0].bgImgPosition ? backgroundImg[0].bgImgPosition : 'center center' ) }
												options={ [
													{ value: 'center top', label: __( 'Center Top' ) },
													{ value: 'center center', label: __( 'Center Center' ) },
													{ value: 'center bottom', label: __( 'Center Bottom' ) },
													{ value: 'left top', label: __( 'Left Top' ) },
													{ value: 'left center', label: __( 'Left Center' ) },
													{ value: 'left bottom', label: __( 'Left Bottom' ) },
													{ value: 'right top', label: __( 'Right Top' ) },
													{ value: 'right center', label: __( 'Right Center' ) },
													{ value: 'right bottom', label: __( 'Right Bottom' ) },
												] }
												onChange={ value => saveBackgroundImage( { bgImgPosition: value } ) }
											/>
											<SelectControl
												label={ __( 'Background Image Repeat' ) }
												value={ ( backgroundImg && backgroundImg[0] && backgroundImg[0].bgImgRepeat ? backgroundImg[0].bgImgRepeat : 'no-repeat' ) }
												options={ [
													{ value: 'no-repeat', label: __( 'No Repeat' ) },
													{ value: 'repeat', label: __( 'Repeat' ) },
													{ value: 'repeat-x', label: __( 'Repeat-x' ) },
													{ value: 'repeat-y', label: __( 'Repeat-y' ) },
												] }
												onChange={ value => saveBackgroundImage( { bgImgRepeat: value } ) }
											/>
											<SelectControl
												label={ __( 'Background Image Attachment' ) }
												value={ ( backgroundImg && backgroundImg[0] && backgroundImg[0].bgImgAttachment ? backgroundImg[0].bgImgAttachment : 'scroll' ) }
												options={ [
													{ value: 'scroll', label: __( 'Scroll' ) },
													{ value: 'fixed', label: __( 'Fixed' ) },
												] }
												onChange={ value => saveBackgroundImage( { bgImgAttachment: value } ) }
											/>
										</Fragment>
									) }
									<AdvancedColorControl
										label={ __( 'Border Color' ) }
										colorValue={ ( border ? border : '' ) }
										colorDefault={ '' }
										opacityValue={ borderOpacity }
										onColorChange={ value => setAttributes( { border: value } ) }
										onOpacityChange={ value => setAttributes( { borderOpacity: value } ) }
									/>
									<MeasurementControls
										label={ __( 'Border Width' ) }
										measurement={ borderWidth }
										control={ borderWidthControl }
										onChange={ ( value ) => setAttributes( { borderWidth: value } ) }
										onControl={ ( value ) => this.setState( { borderWidthControl: value } ) }
										min={ 0 }
										max={ 40 }
										step={ 1 }
									/>
									<MeasurementControls
										label={ __( 'Border Radius' ) }
										measurement={ borderRadius }
										control={ borderRadiusControl }
										onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
										onControl={ ( value ) => this.setState( { borderRadiusControl: value } ) }
										min={ 0 }
										max={ 200 }
										step={ 1 }
										controlTypes={ [
											{ key: 'linked', name: __( 'Linked' ), icon: icons.radiuslinked },
											{
												key: 'individual',
												name: __( 'Individual' ),
												icon: icons.radiusindividual,
											},
										] }
										firstIcon={ icons.topleft }
										secondIcon={ icons.topright }
										thirdIcon={ icons.bottomright }
										fourthIcon={ icons.bottomleft }
									/>
									<BoxShadowControl
										label={ __( 'Box Shadow', 'amp-blocks' ) }
										enable={ ( undefined !== displayShadow ? displayShadow : false ) }
										color={ ( undefined !== shadow && undefined !== shadow[0] && undefined !== shadow[0].color ? shadow[0].color : '#000000' ) }
										colorDefault={ '#000000' }
										opacity={ ( undefined !== shadow && undefined !== shadow[0] && undefined !== shadow[0].opacity ? shadow[0].opacity : 0.2 ) }
										hOffset={ ( undefined !== shadow && undefined !== shadow[0] && undefined !== shadow[0].hOffset ? shadow[0].hOffset : 0 ) }
										vOffset={ ( undefined !== shadow && undefined !== shadow[0] && undefined !== shadow[0].vOffset ? shadow[0].vOffset : 0 ) }
										blur={ ( undefined !== shadow && undefined !== shadow[0] && undefined !== shadow[0].blur ? shadow[0].blur : 14 ) }
										spread={ ( undefined !== shadow && undefined !== shadow[0] && undefined !== shadow[0].spread ? shadow[0].spread : 0 ) }
										inset={ ( undefined !== shadow && undefined !== shadow[0] && undefined !== shadow[0].inset ? shadow[0].inset : false ) }
										onEnableChange={ value => {
											setAttributes( {
												displayShadow: value,
											} );
										} }
										onColorChange={ value => {
											this.saveShadow( { color: value } );
										} }
										onOpacityChange={ value => {
											this.saveShadow( { opacity: value } );
										} }
										onHOffsetChange={ value => {
											this.saveShadow( { hOffset: value } );
										} }
										onVOffsetChange={ value => {
											this.saveShadow( { vOffset: value } );
										} }
										onBlurChange={ value => {
											this.saveShadow( { blur: value } );
										} }
										onSpreadChange={ value => {
											this.saveShadow( { spread: value } );
										} }
										onInsetChange={ value => {
											this.saveShadow( { inset: value } );
										} }
									/>
								</Fragment>
							) }
							{ this.showSettings( 'textAlign' ) && (
								<Fragment>
									{ textAlignControls }
								</Fragment>
							) }
							{ this.showSettings( 'textColor' ) && (
								<PanelBody
									title={ __( 'Text Color Settings' ) }
									initialOpen={ false }
								>
									<AdvancedColorControl
										label={ __( 'Text Color' ) }
										colorValue={ ( textColor ? textColor : '' ) }
										colorDefault={ '' }
										onColorChange={ value => setAttributes( { textColor: value } ) }
									/>
									<AdvancedColorControl
										label={ __( 'Link Color' ) }
										colorValue={ ( linkColor ? linkColor : '' ) }
										colorDefault={ '' }
										onColorChange={ value => setAttributes( { linkColor: value } ) }
									/>
									<AdvancedColorControl
										label={ __( 'Link Hover Color' ) }
										colorValue={ ( linkHoverColor ? linkHoverColor : '' ) }
										colorDefault={ '' }
										onColorChange={ value => setAttributes( { linkHoverColor: value } ) }
									/>
								</PanelBody>
							) }
							{ this.showSettings( 'paddingMargin' ) && (
								<Fragment>
									<div className="amp-spacer-sidebar-15"></div>
									{ tabControls }
								</Fragment>
							) }
						</Panel>
					</InspectorControls>
				) }
				<InspectorAdvancedControls>
					<RangeControl
						label={ __( 'Z Index Control' ) }
						value={ zIndex }
						onChange={ ( value ) => {
							setAttributes( {
								zIndex: value,
							} );
						} }
						min={ -200 }
						max={ 200 }
					/>
				</InspectorAdvancedControls>
				<div id={ `animate-id${ uniqueID }` }
					 className="amp-c-inner aos-animate amp-animation-wrap"
					 data-aos={ ( ampAnimation ? ampAnimation : undefined ) }
					 data-aos-duration={ ( ampAOSOptions && ampAOSOptions[0] && ampAOSOptions[0].duration ? ampAOSOptions[0].duration : undefined ) }
					 data-aos-easing={ ( ampAOSOptions && ampAOSOptions[0] && ampAOSOptions[0].easing ? ampAOSOptions[0].easing : undefined ) }
					 style={ {
						 paddingLeft: leftPadding + 'px',
						 paddingRight: rightPadding + 'px',
						 paddingTop: topPadding + 'px',
						 paddingBottom: bottomPadding + 'px',
						 marginLeft: leftMargin + 'px',
						 marginRight: rightMargin + 'px',
						 marginTop: topMargin + 'px',
						 marginBottom: bottomMargin + 'px',
						 zIndex: zIndex,
						 textAlign: ( textAlign && textAlign[0] ? textAlign[0] : undefined ),
						 backgroundColor: backgroundString,
						 backgroundImage: ( backgroundImg && backgroundImg[0] && backgroundImg[0].bgImg ? `url(${ backgroundImg[0].bgImg })` : undefined ),
						 backgroundSize: ( backgroundImg && backgroundImg[0] && backgroundImg[0].bgImgSize ? backgroundImg[0].bgImgSize : undefined ),
						 backgroundPosition: ( backgroundImg && backgroundImg[0] && backgroundImg[0].bgImgPosition ? backgroundImg[0].bgImgPosition : undefined ),
						 backgroundRepeat: ( backgroundImg && backgroundImg[0] && backgroundImg[0].bgImgRepeat ? backgroundImg[0].bgImgRepeat : undefined ),
						 backgroundAttachment: ( backgroundImg && backgroundImg[0] && backgroundImg[0].bgImgAttachment ? backgroundImg[0].bgImgAttachment : undefined ),
						 borderColor: borderString,
						 borderWidth: ( borderWidth ? borderWidth[0] + 'px ' + borderWidth[1] + 'px ' + borderWidth[2] + 'px ' + borderWidth[3] + 'px' : '' ),
						 borderRadius: ( borderRadius ? borderRadius[0] + 'px ' + borderRadius[1] + 'px ' + borderRadius[2] + 'px ' + borderRadius[3] + 'px' : '' ),
						 boxShadow: ( undefined !== displayShadow && displayShadow && undefined !== shadow && undefined !== shadow[0] && undefined !== shadow[0].color ? ( undefined !== shadow[0].inset && shadow[0].inset ? 'inset ' : '' ) + ( undefined !== shadow[0].hOffset ? shadow[0].hOffset : 0 ) + 'px ' + ( undefined !== shadow[0].vOffset ? shadow[0].vOffset : 0 ) + 'px ' + ( undefined !== shadow[0].blur ? shadow[0].blur : 14 ) + 'px ' + ( undefined !== shadow[0].spread ? shadow[0].spread : 0 ) + 'px ' + hexToRGBA( ( undefined !== shadow[0].color ? shadow[0].color : '#000000' ), ( undefined !== shadow[0].opacity ? shadow[0].opacity : 1 ) ) : undefined ),
					 } }>
					<InnerBlocks
						templateLock={ false }
						renderAppender={ (
							hasChildBlocks ?
								undefined :
								() => <InnerBlocks.ButtonBlockAppender/>
						) }
					/>
				</div>
			</div>
		);
	}
}

export default ( AmpColumn );
