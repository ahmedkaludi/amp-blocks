/**
 * BLOCK: amp Advanced Btn
 *
 * Editor for Advanced Btn
 */
import times from 'lodash/times';
import map from 'lodash/map';
import editorIcons from '../../icons';
import IconControl from '../../icon-control';
import IconRender from '../../icon-render';
import TypographyControls from '../../typography-control';
import AdvancedColorControl from '../../advanced-color-control';
import BoxShadowControl from '../../box-shadow-control';
import WebfontLoader from '../../fontloader';
import hexToRGBA from '../../hex-to-rgba';
import StepControl from '../../step-control';

import '../button/editor.scss';
/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const {
	RichText,
	URLInput,
	InspectorControls,
	BlockControls,
	AlignmentToolbar,
	InspectorAdvancedControls,
	URLInputButton,
} = wp.blockEditor;
const {
	Component,
	Fragment,
} = wp.element;
const {
	IconButton,
	Dashicon,
	TabPanel,
	Button,
	PanelBody,
	RangeControl,
	TextControl,
	ButtonGroup,
	SelectControl,
	ToggleControl,
	Tooltip,
} = wp.components;

/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const buttongroupUniqueIDs = [];

class ampAdvancedButton extends Component {
	constructor() {
		super(...arguments);
		this.showSettings = this.showSettings.bind(this);
		this.saveArrayUpdate = this.saveArrayUpdate.bind(this);
		this.state = {
			btnFocused: 'false',
			marginControl: 'linked',
			btnLink: false,
			user: (amp_blocks_params.userrole ? amp_blocks_params.userrole : 'admin'),
			settings: {},
		};
	}
	componentDidMount() {
		if (!this.props.attributes.uniqueID) {
			const oldBlockConfig = amp_blocks_params.config['amp/advancedbtn'];
			const blockConfigObject = (amp_blocks_params.configuration ? JSON.parse(amp_blocks_params.configuration) : []);
			if (blockConfigObject['amp/advancedbtn'] !== undefined && typeof blockConfigObject['amp/advancedbtn'] === 'object') {
				Object.keys(blockConfigObject['amp/advancedbtn']).map((attribute) => {
					this.props.attributes[attribute] = blockConfigObject['amp/advancedbtn'][attribute];
				});
			} else if (oldBlockConfig !== undefined && typeof oldBlockConfig === 'object') {
				Object.keys(oldBlockConfig).map((attribute) => {
					this.props.attributes[attribute] = oldBlockConfig[attribute];
				});
			}
			this.props.setAttributes({
				uniqueID: '_' + this.props.clientId.substr(2, 3),
			});
			buttongroupUniqueIDs.push('_' + this.props.clientId.substr(2, 3));
		} else if (buttongroupUniqueIDs.includes(this.props.attributes.uniqueID)) {
			this.props.setAttributes({
				uniqueID: '_' + this.props.clientId.substr(2, 3),
			});
			buttongroupUniqueIDs.push('_' + this.props.clientId.substr(2, 3));
		} else {
			buttongroupUniqueIDs.push(this.props.attributes.uniqueID);
		}
		const blockSettings = (amp_blocks_params.settings ? JSON.parse(amp_blocks_params.settings) : {});
		if (blockSettings['amp/advancedbtn'] !== undefined && typeof blockSettings['amp/advancedbtn'] === 'object') {
			this.setState({ settings: blockSettings['amp/advancedbtn'] });
		}
		if (this.props.attributes.btns && this.props.attributes.btns[0] && undefined === this.props.attributes.btns[0].btnSize) {
			this.saveArrayUpdate({ btnSize: 'custom' }, 0);
		}
		if (this.props.attributes.btns && this.props.attributes.btns[1] && undefined === this.props.attributes.btns[1].btnSize) {
			this.saveArrayUpdate({ btnSize: 'custom' }, 1);
		}
		if (this.props.attributes.btns && this.props.attributes.btns[2] && undefined === this.props.attributes.btns[2].btnSize) {
			this.saveArrayUpdate({ btnSize: 'custom' }, 2);
		}
		if (this.props.attributes.btns && this.props.attributes.btns[3] && undefined === this.props.attributes.btns[3].btnSize) {
			this.saveArrayUpdate({ btnSize: 'custom' }, 3);
		}
		if (this.props.attributes.btns && this.props.attributes.btns[4] && undefined === this.props.attributes.btns[4].btnSize) {
			this.saveArrayUpdate({ btnSize: 'custom' }, 4);
		}
		if (undefined === this.props.attributes.widthType) {
			if (this.props.attributes.forceFullwidth) {
				this.props.setAttributes({ widthType: 'full' });
			}
		}
	}
	componentDidUpdate(prevProps) {
		if (!this.props.isSelected && prevProps.isSelected && this.state.btnFocused) {
			this.setState({
				btnFocused: 'false',
			});
		}
	}
	showSettings(key) {
		if (undefined === this.state.settings[key] || 'all' === this.state.settings[key]) {
			return true;
		} else if ('contributor' === this.state.settings[key] && ('contributor' === this.state.user || 'author' === this.state.user || 'editor' === this.state.user || 'admin' === this.state.user)) {
			return true;
		} else if ('author' === this.state.settings[key] && ('author' === this.state.user || 'editor' === this.state.user || 'admin' === this.state.user)) {
			return true;
		} else if ('editor' === this.state.settings[key] && ('editor' === this.state.user || 'admin' === this.state.user)) {
			return true;
		} else if ('admin' === this.state.settings[key] && 'admin' === this.state.user) {
			return true;
		}
		return false;
	}
	saveArrayUpdate(value, index) {
		const { attributes, setAttributes } = this.props;
		const { btns } = attributes;

		const newItems = btns.map((item, thisIndex) => {
			if (index === thisIndex) {
				item = { ...item, ...value };
			}

			return item;
		});
		setAttributes({
			btns: newItems,
		});
	}
	render() {
		const { attributes: { uniqueID, btnCount, btns, hAlign, letterSpacing, fontStyle, fontWeight, typography, googleFont, loadGoogleFont, fontSubset, fontVariant, forceFullwidth, thAlign, mhAlign, widthType, widthUnit, textTransform, ampAOSOptions, ampAnimation }, className, setAttributes, isSelected } = this.props;
		const gconfig = {
			google: {
				families: [typography + (fontVariant ? ':' + fontVariant : '')],
			},
		};
		const controlTypes = [
			{ key: 'linked', name: __('Linked'), micon: editorIcons.linked },
			{ key: 'individual', name: __('Individual'), micon: editorIcons.individual },
		];
		const { marginControl } = this.state;
		const btnSizes = [
			{ key: 'small', name: __('S') },
			{ key: 'standard', name: __('M') },
			{ key: 'large', name: __('L') },
			{ key: 'custom', name: <Dashicon icon="admin-generic" /> },
		];
		const btnWidths = [
			{ key: 'auto', name: __('Auto') },
			{ key: 'fixed', name: __('Fixed') },
			{ key: 'full', name: __('Full') },
		];
		const unitTypes = [
			{ key: 'px', name: __('px') },
			{ key: '%', name: __('%') },
		];
		const gradTypes = [
			{ key: 'linear', name: __('Linear') },
			{ key: 'radial', name: __('Radial') },
		];
		const bgType = [
			{ key: 'solid', name: __('Solid') },
			{ key: 'gradient', name: __('Gradient') },
		];
		const config = (googleFont ? gconfig : '');
		const renderBtns = (index) => {
			let btnSize;
			if (undefined !== btns[index].paddingLR || undefined !== btns[index].paddingBT) {
				btnSize = 'custom';
			} else {
				btnSize = 'standard';
			}
			let btnbg;
			let btnGrad;
			let btnGrad2;
			if (undefined !== btns[index].backgroundType && 'gradient' === btns[index].backgroundType) {
				btnGrad = ('transparent' === btns[index].background || undefined === btns[index].background ? 'rgba(255,255,255,0)' : hexToRGBA(btns[index].background, (btns[index].backgroundOpacity !== undefined ? btns[index].backgroundOpacity : 1)));
				btnGrad2 = (undefined !== btns[index].gradient && undefined !== btns[index].gradient[0] && '' !== btns[index].gradient[0] ? hexToRGBA(btns[index].gradient[0], (undefined !== btns[index].gradient && btns[index].gradient[1] !== undefined ? btns[index].gradient[1] : 1)) : hexToRGBA('#999999', (undefined !== btns[index].gradient && btns[index].gradient[1] !== undefined ? btns[index].gradient[1] : 1)));
				if (undefined !== btns[index].gradient && 'radial' === btns[index].gradient[4]) {
					btnbg = `radial-gradient(at ${(undefined === btns[index].gradient[6] ? 'center center' : btns[index].gradient[6])}, ${btnGrad} ${(undefined === btns[index].gradient[2] ? '0' : btns[index].gradient[2])}%, ${btnGrad2} ${(undefined === btns[index].gradient[3] ? '100' : btns[index].gradient[3])}%)`;
				} else if (undefined === btns[index].gradient || 'radial' !== btns[index].gradient[4]) {
					btnbg = `linear-gradient(${(undefined !== btns[index].gradient && undefined !== btns[index].gradient[5] ? btns[index].gradient[5] : '180')}deg, ${btnGrad} ${(undefined !== btns[index].gradient && undefined !== btns[index].gradient[2] ? btns[index].gradient[2] : '0')}%, ${btnGrad2} ${(undefined !== btns[index].gradient && undefined !== btns[index].gradient[3] ? btns[index].gradient[3] : '100')}%)`;
				}
			} else {
				btnbg = ('transparent' === btns[index].background || undefined === btns[index].background ? undefined : hexToRGBA(btns[index].background, (btns[index].backgroundOpacity !== undefined ? btns[index].backgroundOpacity : 1)));
			}
			return (
				<div className={`btn-area-wrap b-${index}-area`} style={{
					marginTop: (btns[index].marginTop ? btns[index].marginTop + 'px' : undefined),
					marginRight: (btns[index].marginRight ? btns[index].marginRight + 'px' : undefined),
					marginBottom: (btns[index].marginBottom ? btns[index].marginBottom + 'px' : undefined),
					marginLeft: (btns[index].marginLeft ? btns[index].marginLeft + 'px' : undefined),
				}} >
					<span className={`b-wrap b-${index}-action lokeshs b-svg-show-${(!btns[index].iconHover ? 'always' : 'hover')}`}>
						<span className={`b b-${index} b-size-${(btns[index].btnSize ? btns[index].btnSize : btnSize)} b-style-${(btns[index].btnStyle ? btns[index].btnStyle : 'basic')}`} style={{
							background: (undefined !== btnbg ? btnbg : undefined),
							color: (undefined !== btns[index].color ? btns[index].color : undefined),
							fontSize: (undefined !== btns[index].size ? btns[index].size + 'px' : undefined),
							fontWeight: fontWeight,
							fontStyle: fontStyle,
							letterSpacing: letterSpacing + 'px',
							textTransform: (textTransform ? textTransform : undefined),
							fontFamily: (typography ? typography : ''),
							borderRadius: (undefined !== btns[index].borderRadius ? btns[index].borderRadius + 'px' : undefined),
							borderWidth: (undefined !== btns[index].borderWidth ? btns[index].borderWidth + 'px' : undefined),
							borderColor: (undefined === btns[index].border ? '#555555' : hexToRGBA(btns[index].border, (btns[index].borderOpacity !== undefined ? btns[index].borderOpacity : 1))),
							paddingLeft: (undefined !== btns[index].paddingLR && 'custom' === btns[index].btnSize ? btns[index].paddingLR + 'px' : undefined),
							paddingRight: (undefined !== btns[index].paddingLR && 'custom' === btns[index].btnSize ? btns[index].paddingLR + 'px' : undefined),
							paddingTop: (undefined !== btns[index].paddingBT && 'custom' === btns[index].btnSize ? btns[index].paddingBT + 'px' : undefined),
							paddingBottom: (undefined !== btns[index].paddingBT && 'custom' === btns[index].btnSize ? btns[index].paddingBT + 'px' : undefined),
							width: (undefined !== widthType && 'fixed' === widthType && undefined !== btns[index].width && undefined !== btns[index].width[0] ? btns[index].width[0] + (undefined !== widthUnit ? widthUnit : 'px') : undefined),
							boxShadow: (undefined !== btns[index].boxShadow && undefined !== btns[index].boxShadow[0] && btns[index].boxShadow[0] ? (undefined !== btns[index].boxShadow[7] && btns[index].boxShadow[7] ? 'inset ' : '') + (undefined !== btns[index].boxShadow[3] ? btns[index].boxShadow[3] : 1) + 'px ' + (undefined !== btns[index].boxShadow[4] ? btns[index].boxShadow[4] : 1) + 'px ' + (undefined !== btns[index].boxShadow[5] ? btns[index].boxShadow[5] : 2) + 'px ' + (undefined !== btns[index].boxShadow[6] ? btns[index].boxShadow[6] : 0) + 'px ' + hexToRGBA((undefined !== btns[index].boxShadow[1] ? btns[index].boxShadow[1] : '#000000'), (undefined !== btns[index].boxShadow[2] ? btns[index].boxShadow[2] : 1)) : undefined),
						}} >
							{btns[index].icon && 'left' === btns[index].iconSide && (
								<IconRender className={`b-svg-icon b-svg-icon-${btns[index].icon} b-side-${btns[index].iconSide}`} name={btns[index].icon} size={(!btns[index].size ? '14' : btns[index].size)} />
							)}
							<RichText
								tagName="div"
								placeholder={__('Button...', 'amp-blocks')}
								value={btns[index].text}
								unstableOnFocus={() => {
									if (1 === index) {
										onFocusBtn1();
									} else if (2 === index) {
										onFocusBtn2();
									} else if (3 === index) {
										onFocusBtn3();
									} else if (4 === index) {
										onFocusBtn4();
									} else {
										onFocusBtn();
									}
								}}
								onChange={value => {
									this.saveArrayUpdate({ text: value }, index);
								}}
								allowedFormats={['core/bold', 'core/italic', 'core/strikethrough']}
								className={'b-text'}
								keepPlaceholderOnFocus
							/>
							{btns[index].icon && 'left' !== btns[index].iconSide && (
								<IconRender className={`b-svg-icon b-svg-icon-${btns[index].icon} b-side-${btns[index].iconSide}`} name={btns[index].icon} size={(!btns[index].size ? '14' : btns[index].size)} />
							)}
						</span>
					</span>
					{isSelected && ((this.state.btnFocused && 'btn' + [index] === this.state.btnFocused) || (this.state.btnFocused && 'false' === this.state.btnFocused && '0' === index)) && (
						<div><BlockControls>

							<URLInputButton
								url={btns[index].link}
								onChange={url => {
									this.saveArrayUpdate({ link: url }, index);
								}}
							/>
						</BlockControls></div>
					)}
				</div>
			);
		};
		const onFocusBtn = () => {
			if ('btn0' !== this.state.btnFocused) {
				this.setState({
					btnFocused: 'btn0',
				});
			}
		};
		const onFocusBtn1 = () => {
			if ('btn1' !== this.state.btnFocused) {
				this.setState({
					btnFocused: 'btn1',
				});
			}
		};
		const onFocusBtn2 = () => {
			if ('btn2' !== this.state.btnFocused) {
				this.setState({
					btnFocused: 'btn2',
				});
			}
		};
		const onFocusBtn3 = () => {
			if ('btn3' !== this.state.btnFocused) {
				this.setState({
					btnFocused: 'btn3',
				});
			}
		};
		const onFocusBtn4 = () => {
			if ('btn4' !== this.state.btnFocused) {
				this.setState({
					btnFocused: 'btn4',
				});
			}
		};
		const defineWidthType = (type) => {
			if ('full' === type) {
				setAttributes({ forceFullwidth: true });
				setAttributes({ widthType: type });
			} else {
				setAttributes({ forceFullwidth: false });
				setAttributes({ widthType: type });
			}
		};
		const defineWidthTypeToggle = (value) => {
			if (value) {
				setAttributes({ forceFullwidth: true });
				setAttributes({ widthType: 'full' });
			} else {
				setAttributes({ forceFullwidth: false });
				setAttributes({ widthType: 'full' });
			}
		};
		const tabControls = (index) => {
			return (
				<PanelBody
					title={__('Button', 'amp-blocks') + ' ' + (index + 1) + ' ' + __('Settings', 'amp-blocks')}
					initialOpen={false}
				>
					<h2 className="side-h2-label">{__('Button Link', 'amp-blocks')}</h2>
					<div className="b-link-group">
						<URLInput
							value={btns[index].link}
							className="b-link-input"
							onChange={value => {
								this.saveArrayUpdate({ link: value }, index);
							}}
						/>
						<IconButton
							className="amp-link-settings"
							icon={'arrow-down-alt2'}
							label={__('Link Settings', 'amp-blocks')}
							onClick={() => this.setState({ btnLink: (this.state.btnLink ? false : true) })}
						/>
					</div>
					{this.state.btnLink && (
						<Fragment>
							<div className="amp-spacer-sidebar-15"></div>
							<SelectControl
								label={__('Link Target', 'amp-blocks')}
								value={btns[index].target}
								options={[
									{ value: '_self', label: __('Same Window', 'amp-blocks') },
									{ value: '_blank', label: __('New Window', 'amp-blocks') },
									{ value: 'video', label: __('Video Popup', 'amp-blocks') },
								]}
								onChange={value => {
									this.saveArrayUpdate({ target: value }, index);
								}}
							/>
							{btns[index].target === 'video' && (
								<p>{__('NOTE: Video popup only works with youtube and vimeo links.', 'amp-blocks')}</p>
							)}
							<ToggleControl
								label={__('Set link to nofollow?', 'amp-blocks')}
								checked={(undefined !== btns[index].noFollow ? btns[index].noFollow : false)}
								onChange={(value) => this.saveArrayUpdate({ noFollow: value }, index)}
							/>
							<ToggleControl
								label={__('Set link attribute Sponsored?', 'amp-blocks')}
								checked={(undefined !== btns[index].sponsored ? btns[index].sponsored : false)}
								onChange={(value) => this.saveArrayUpdate({ sponsored: value }, index)}
							/>
						</Fragment>
					)}
					{this.showSettings('sizeSettings') && (
						<Fragment>
							<h2 className="amp-heading-size-title">{__('Text Size', 'amp-blocks')}</h2>
							<TabPanel className="amp-size-tabs"
								activeClass="active-tab"
								tabs={[
									{
										name: 'desk',
										title: <Dashicon icon="desktop" />,
										className: 'amp-desk-tab',
									},
									{
										name: 'tablet',
										title: <Dashicon icon="tablet" />,
										className: 'amp-tablet-tab',
									},
									{
										name: 'mobile',
										title: <Dashicon icon="smartphone" />,
										className: 'amp-mobile-tab',
									},
								]}>
								{
									(tab) => {
										let tabout;
										if (tab.name) {
											if ('mobile' === tab.name) {
												tabout = (
													<div>
														<RangeControl
															className="btn-text-size-range"
															beforeIcon="editor-textcolor"
															afterIcon="editor-textcolor"
															value={(undefined !== btns[index].responsiveSize && undefined !== btns[index].responsiveSize[1] ? btns[index].responsiveSize[1] : '')}
															onChange={value => {
																this.saveArrayUpdate({ responsiveSize: [(undefined !== btns[index].responsiveSize && undefined !== btns[index].responsiveSize[0] ? btns[index].responsiveSize[0] : ''), value] }, index);
															}}
															min={4}
															max={100}
														/>
														<p>{__('Margin (px)')}</p>
														<RangeControl
															className="amp-icon-rangecontrol"
															label={editorIcons.outlinetop}
															value={(undefined !== btns[index].responsivemarginTop && undefined !== btns[index].responsivemarginTop[1] ? btns[index].responsivemarginTop[1] : '')}
															onChange={value => {
																this.saveArrayUpdate({ responsivemarginTop: [(undefined !== btns[index].responsivemarginTop && undefined !== btns[index].responsivemarginTop[0] ? btns[index].responsivemarginTop[0] : ''), value] }, index);
															}}
															min={0}
															max={180}
															step={1}
														/>
														<RangeControl
															className="amp-icon-rangecontrol"
															label={editorIcons.outlineright}
															value={(undefined !== btns[index].responsivemarginRight && undefined !== btns[index].responsivemarginRight[1] ? btns[index].responsivemarginRight[1] : '')}
															onChange={value => {
																this.saveArrayUpdate({ responsivemarginRight: [(undefined !== btns[index].responsivemarginRight && undefined !== btns[index].responsivemarginRight[0] ? btns[index].responsivemarginRight[0] : ''), value] }, index);
															}}
															min={0}
															max={180}
															step={1}
														/>
														<RangeControl
															className="amp-icon-rangecontrol"
															label={editorIcons.outlinebottom}
															value={(undefined !== btns[index].responsivemarginBottom && undefined !== btns[index].responsivemarginBottom[1] ? btns[index].responsivemarginBottom[1] : '')}
															onChange={value => {
																this.saveArrayUpdate({ responsivemarginBottom: [(undefined !== btns[index].responsivemarginBottom && undefined !== btns[index].responsivemarginBottom[0] ? btns[index].responsivemarginBottom[0] : ''), value] }, index);
															}}
															min={0}
															max={180}
															step={1}
														/>
														<RangeControl
															className="amp-icon-rangecontrol"
															label={editorIcons.outlineleft}
															value={(undefined !== btns[index].responsivemarginLeft && undefined !== btns[index].responsivemarginLeft[1] ? btns[index].responsivemarginLeft[1] : '')}
															onChange={value => {
																this.saveArrayUpdate({ responsivemarginLeft: [(undefined !== btns[index].responsivemarginLeft && undefined !== btns[index].responsivemarginLeft[0] ? btns[index].responsivemarginLeft[0] : ''), value] }, index);
															}}
															min={0}
															max={180}
															step={1}
														/>

													</div>

												);
											} else if ('tablet' === tab.name) {
												tabout = (
													<div>
														<RangeControl
															className="btn-text-size-range"
															beforeIcon="editor-textcolor"
															afterIcon="editor-textcolor"
															value={(undefined !== btns[index].responsiveSize && undefined !== btns[index].responsiveSize[0] ? btns[index].responsiveSize[0] : '')}
															onChange={value => {
																this.saveArrayUpdate({ responsiveSize: [value, (undefined !== btns[index].responsiveSize && undefined !== btns[index].responsiveSize[1] ? btns[index].responsiveSize[1] : '')] }, index);
															}}
															min={4}
															max={100}
														/>
														<p>{__('Margin (px)')}</p>
														<RangeControl
															className="amp-icon-rangecontrol"
															label={editorIcons.outlinetop}
															value={(undefined !== btns[index].responsivemarginTop && undefined !== btns[index].responsivemarginTop[0] ? btns[index].responsivemarginTop[0] : '')}
															onChange={value => {
																this.saveArrayUpdate({ responsivemarginTop: [(undefined !== btns[index].responsivemarginTop && undefined !== btns[index].responsivemarginTop[1] ? btns[index].responsivemarginTop[1] : ''), value] }, index);
															}}
															min={0}
															max={180}
															step={1}
														/>
														<RangeControl
															className="amp-icon-rangecontrol"
															label={editorIcons.outlineright}
															value={(undefined !== btns[index].responsivemarginRight && undefined !== btns[index].responsivemarginRight[0] ? btns[index].responsivemarginRight[0] : '')}
															onChange={value => {
																this.saveArrayUpdate({ responsivemarginRight: [(undefined !== btns[index].responsivemarginRight && undefined !== btns[index].responsivemarginRight[1] ? btns[index].responsivemarginRight[1] : ''), value] }, index);
															}}
															min={0}
															max={180}
															step={1}
														/>
														<RangeControl
															className="amp-icon-rangecontrol"
															label={editorIcons.outlinebottom}
															value={(undefined !== btns[index].responsivemarginBottom && undefined !== btns[index].responsivemarginBottom[0] ? btns[index].responsivemarginBottom[0] : '')}
															onChange={value => {
																this.saveArrayUpdate({ responsivemarginBottom: [(undefined !== btns[index].responsivemarginBottom && undefined !== btns[index].responsivemarginBottom[1] ? btns[index].responsivemarginBottom[1] : ''), value] }, index);
															}}
															min={0}
															max={180}
															step={1}
														/>
														<RangeControl
															className="amp-icon-rangecontrol"
															label={editorIcons.outlineleft}
															value={(undefined !== btns[index].responsivemarginLeft && undefined !== btns[index].responsivemarginLeft[0] ? btns[index].responsivemarginLeft[0] : '')}
															onChange={value => {
																this.saveArrayUpdate({ responsivemarginLeft: [(undefined !== btns[index].responsivemarginLeft && undefined !== btns[index].responsivemarginLeft[1] ? btns[index].responsivemarginLeft[1] : ''), value] }, index);
															}}
															min={0}
															max={180}
															step={1}
														/>
													</div>
												);
											} else {
												tabout = (
													<div>
														<RangeControl
															className="btn-text-size-range"
															beforeIcon="editor-textcolor"
															afterIcon="editor-textcolor"
															value={btns[index].size}
															onChange={value => {
																this.saveArrayUpdate({ size: value }, index);
															}}
															min={4}
															max={100}
														/>
														<p>{__('Margin (px)')}</p>
														<RangeControl
								className="amp-icon-rangecontrol"
								label={editorIcons.outlinetop}
								value={(btns[index].marginTop ? btns[index].marginTop : 0)}
								onChange={value => {
									this.saveArrayUpdate({ marginTop: value }, index);
								}}
								min={0}
								max={180}
								step={1}
							/>
							<RangeControl
								className="amp-icon-rangecontrol"
								label={editorIcons.outlineright}
								value={(btns[index].marginRight ? btns[index].marginRight : 0)}
								onChange={value => {
									this.saveArrayUpdate({ marginRight: value }, index);
								}}
								min={0}
								max={180}
								step={1}
							/>
							<RangeControl
								className="amp-icon-rangecontrol"
								label={editorIcons.outlinebottom}
								value={(btns[index].marginBottom ? btns[index].marginBottom : 0)}
								onChange={value => {
									this.saveArrayUpdate({ marginBottom: value }, index);
								}}
								min={0}
								max={180}
								step={1}
							/>
							<RangeControl
								className="amp-icon-rangecontrol"
								label={editorIcons.outlineleft}
								value={(btns[index].marginLeft ? btns[index].marginLeft : 0)}
								onChange={value => {
									this.saveArrayUpdate({ marginLeft: value }, index);
								}}
								min={0}
								max={180}
								step={1}
							/>
													</div>
												);
											}
										}
										return <div>{tabout}</div>;
									}
								}
							</TabPanel>
							<div className="b-size-settings-container">
								<h2 className="amp-beside-btn-group">{__('Button Size')}</h2>
								<ButtonGroup className="b-size-type-options" aria-label={__('Button Size', 'amp-blocks')}>
									{map(btnSizes, ({ name, key }) => (
										<Button
											key={key}
											className="b-size-btn"
											isSmall
											isPrimary={btns[index].btnSize === key}
											aria-pressed={btns[index].btnSize === key}
											onClick={() => this.saveArrayUpdate({ btnSize: key }, index)}
										>
											{name}
										</Button>
									))}
								</ButtonGroup>
							</div>
							{'custom' === btns[index].btnSize && (
								<div className="amp-inner-sub-section">
									<h2 className="amp-heading-size-title amp-secondary-color-size">{__('Padding', 'amp-blocks')}</h2>
									<TabPanel className="amp-size-tabs"
										activeClass="active-tab"
										tabs={[
											{
												name: 'desk',
												title: <Dashicon icon="desktop" />,
												className: 'amp-desk-tab',
											},
											{
												name: 'tablet',
												title: <Dashicon icon="tablet" />,
												className: 'amp-tablet-tab',
											},
											{
												name: 'mobile',
												title: <Dashicon icon="smartphone" />,
												className: 'amp-mobile-tab',
											},
										]}>
										{
											(tab) => {
												let tabout;
												if (tab.name) {
													if ('mobile' === tab.name) {
														tabout = (
															<Fragment>
																<RangeControl
																	label={__('Top and Bottom Padding', 'amp-blocks')}
																	value={(undefined !== btns[index].responsivePaddingBT && undefined !== btns[index].responsivePaddingBT[1] ? btns[index].responsivePaddingBT[1] : '')}
																	onChange={value => {
																		this.saveArrayUpdate({ responsivePaddingBT: [(undefined !== btns[index].responsivePaddingBT && undefined !== btns[index].responsivePaddingBT[0] ? btns[index].responsivePaddingBT[0] : ''), value] }, index);
																	}}
																	min={0}
																	max={100}
																/>
																<RangeControl
																	label={__('Left and Right Padding', 'amp-blocks')}
																	value={(undefined !== btns[index].responsivePaddingLR && undefined !== btns[index].responsivePaddingLR[1] ? btns[index].responsivePaddingLR[1] : '')}
																	onChange={value => {
																		this.saveArrayUpdate({ responsivePaddingLR: [(undefined !== btns[index].responsivePaddingLR && undefined !== btns[index].responsivePaddingLR[0] ? btns[index].responsivePaddingLR[0] : ''), value] }, index);
																	}}
																	min={0}
																	max={100}
																/>
															</Fragment>
														);
													} else if ('tablet' === tab.name) {
														tabout = (
															<Fragment>
																<RangeControl
																	label={__('Top and Bottom Padding', 'amp-blocks')}
																	value={(undefined !== btns[index].responsivePaddingBT && undefined !== btns[index].responsivePaddingBT[0] ? btns[index].responsivePaddingBT[0] : '')}
																	onChange={value => {
																		this.saveArrayUpdate({ responsivePaddingBT: [value, (undefined !== btns[index].responsivePaddingBT && undefined !== btns[index].responsivePaddingBT[1] ? btns[index].responsivePaddingBT[1] : '')] }, index);
																	}}
																	min={0}
																	max={100}
																/>
																<RangeControl
																	label={__('Left and Right Padding', 'amp-blocks')}
																	value={(undefined !== btns[index].responsivePaddingLR && undefined !== btns[index].responsivePaddingLR[0] ? btns[index].responsivePaddingLR[0] : '')}
																	onChange={value => {
																		this.saveArrayUpdate({ responsivePaddingLR: [value, (undefined !== btns[index].responsivePaddingLR && undefined !== btns[index].responsivePaddingLR[1] ? btns[index].responsivePaddingLR[1] : '')] }, index);
																	}}
																	min={0}
																	max={100}
																/>
															</Fragment>
														);
													} else {
														tabout = (
															<Fragment>
																<RangeControl
																	label={__('Top and Bottom Padding', 'amp-blocks')}
																	value={btns[index].paddingBT}
																	onChange={value => {
																		this.saveArrayUpdate({ paddingBT: value }, index);
																	}}
																	min={0}
																	max={100}
																/>
																<RangeControl
																	label={__('Left and Right Padding', 'amp-blocks')}
																	value={btns[index].paddingLR}
																	onChange={value => {
																		this.saveArrayUpdate({ paddingLR: value }, index);
																	}}
																	min={0}
																	max={100}
																/>
															</Fragment>
														);
													}
												}
												return <div>{tabout}</div>;
											}
										}
									</TabPanel>
								</div>
							)}
							<div className="b-size-settings-container">
								<h2 className="amp-beside-btn-group">{__('Button Width', 'amp-blocks')}</h2>
								<ButtonGroup className="b-size-type-options" aria-label={__('Button Width', 'amp-blocks')}>
									{map(btnWidths, ({ name, key }) => (
										<Button
											key={key}
											className="b-size-btn"
											isSmall
											isPrimary={widthType === key}
											aria-pressed={widthType === key}
											onClick={() => defineWidthType(key)}
										>
											{name}
										</Button>
									))}
								</ButtonGroup>
							</div>
							{'fixed' === widthType && (
								<div className="amp-inner-sub-section">
									<h2 className="amp-heading-size-title amp-secondary-color-size">{__('Fixed Width', 'amp-blocks')}</h2>
									<TabPanel className="amp-size-tabs"
										activeClass="active-tab"
										tabs={[
											{
												name: 'desk',
												title: <Dashicon icon="desktop" />,
												className: 'amp-desk-tab',
											},
											{
												name: 'tablet',
												title: <Dashicon icon="tablet" />,
												className: 'amp-tablet-tab',
											},
											{
												name: 'mobile',
												title: <Dashicon icon="smartphone" />,
												className: 'amp-mobile-tab',
											},
										]}>
										{
											(tab) => {
												let tabout;
												if (tab.name) {
													if ('mobile' === tab.name) {
														tabout = (
															<Fragment>
																<RangeControl
																	value={(btns[index].width && undefined !== btns[index].width[2] ? btns[index].width[2] : undefined)}
																	onChange={value => {
																		this.saveArrayUpdate({ width: [(undefined !== btns[index].width && undefined !== btns[index].width[0] ? btns[index].width[0] : ''), (undefined !== btns[index].width && undefined !== btns[index].width[1] ? btns[index].width[1] : ''), value] }, index);
																	}}
																	min={10}
																	max={500}
																/>
															</Fragment>
														);
													} else if ('tablet' === tab.name) {
														tabout = (
															<Fragment>
																<RangeControl
																	value={(btns[index].width && undefined !== btns[index].width[1] ? btns[index].width[1] : undefined)}
																	onChange={value => {
																		this.saveArrayUpdate({ width: [(undefined !== btns[index].width && undefined !== btns[index].width[0] ? btns[index].width[0] : ''), value, (undefined !== btns[index].width && undefined !== btns[index].width[2] ? btns[index].width[2] : '')] }, index);
																	}}
																	min={10}
																	max={500}
																/>
															</Fragment>
														);
													} else {
														tabout = (
															<Fragment>
																<RangeControl
																	value={(btns[index].width && undefined !== btns[index].width[0] ? btns[index].width[0] : undefined)}
																	onChange={value => {
																		this.saveArrayUpdate({ width: [value, (undefined !== btns[index].width && undefined !== btns[index].width[1] ? btns[index].width[1] : ''), (undefined !== btns[index].width && undefined !== btns[index].width[2] ? btns[index].width[2] : '')] }, index);
																	}}
																	min={10}
																	max={500}
																/>
															</Fragment>
														);
													}
												}
												return <div>{tabout}</div>;
											}
										}
									</TabPanel>
								</div>
							)}
						</Fragment>
					)}
					{this.showSettings('colorSettings') && (
						<Fragment>
							<h2 className="amp-tab-wrap-title amp-color-settings-title">{__('Color Settings', 'amp-blocks')}</h2>
							<TabPanel className="amp-inspect-tabs amp-hover-tabs"
								activeClass="active-tab"
								tabs={[
									{
										name: 'normal' + index,
										title: __('Normal'),
										className: 'amp-normal-tab',
									},
									{
										name: 'hover' + index,
										title: __('Hover'),
										className: 'amp-hover-tab',
									},
								]}>
								{
									(tab) => {
										let tabout;
										if (tab.name) {
											if ('hover' + index === tab.name) {
												tabout = hoverSettings(index);
											} else {
												tabout = buttonSettings(index);
											}
										}
										return <div>{tabout}</div>;
									}
								}
							</TabPanel>
							<h2>{__('Border Settings', 'amp-blocks')}</h2>
							<RangeControl
								label={__('Border Width')}
								value={btns[index].borderWidth}
								onChange={value => {
									this.saveArrayUpdate({ borderWidth: value }, index);
								}}
								min={0}
								max={20}
							/>
							<RangeControl
								label={__('Border Radius', 'amp-blocks')}
								value={btns[index].borderRadius}
								onChange={value => {
									this.saveArrayUpdate({ borderRadius: value }, index);
								}}
								min={0}
								max={50}
							/>
						</Fragment>
					)}
					{this.showSettings('iconSettings') && (
						<Fragment>
							<h2 className="amp-tool">{__('Icon Settings', 'amp-blocks')}</h2>
							<div className="amp-select-icon-container">
								<IconControl
									value={btns[index].icon}
									onChange={value => {
										this.saveArrayUpdate({ icon: value }, index);
									}}
								/>
							</div>
							<SelectControl
								label={__('Icon Location', 'amp-blocks')}
								value={btns[index].iconSide}
								options={[
									{ value: 'right', label: __('Right') },
									{ value: 'left', label: __('Left') },
								]}
								onChange={value => {
									this.saveArrayUpdate({ iconSide: value }, index);
								}}
							/>
						</Fragment>
					)}
					<TextControl
						label={__('Add Custom CSS Class', 'amp-blocks')}
						value={(btns[index].cssClass ? btns[index].cssClass : '')}
						onChange={(value) => this.saveArrayUpdate({ cssClass: value }, index)}
					/>
				</PanelBody>
			);
		};
		const hoverSettings = (index) => {
			return (
				<div>
					<AdvancedColorControl
						label={__('Hover Text Color', 'amp-blocks')}
						colorValue={(btns[index].colorHover ? btns[index].colorHover : '#ffffff')}
						colorDefault={'#ffffff'}
						onColorChange={value => {
							this.saveArrayUpdate({ colorHover: value }, index);
						}}
					/>
					<div className="b-size-settings-container">
						<h2 className="amp-beside-btn-group">{__('Background Type', 'amp-blocks')}</h2>
						<ButtonGroup className="b-size-type-options" aria-label={__('Background Type', 'amp-blocks')}>
							{map(bgType, ({ name, key }) => (
								<Button
									key={key}
									className="b-size-btn"
									isSmall
									isPrimary={(undefined !== btns[index].backgroundHoverType ? btns[index].backgroundHoverType : 'solid') === key}
									aria-pressed={(undefined !== btns[index].backgroundHoverType ? btns[index].backgroundHoverType : 'solid') === key}
									onClick={() => this.saveArrayUpdate({ backgroundHoverType: key }, index)}
								>
									{name}
								</Button>
							))}
						</ButtonGroup>
					</div>
					{'gradient' !== btns[index].backgroundHoverType && (
						<div className="amp-inner-sub-section">
							<AdvancedColorControl
								label={__('Background Color', 'amp-blocks')}
								colorValue={(btns[index].backgroundHover ? btns[index].backgroundHover : '#444444')}
								colorDefault={'#444444'}
								opacityValue={btns[index].backgroundHoverOpacity}
								onColorChange={value => {
									this.saveArrayUpdate({ backgroundHover: value }, index);
								}}
								onOpacityChange={value => {
									this.saveArrayUpdate({ backgroundHoverOpacity: value }, index);
								}}
							/>
						</div>
					)}
					{'gradient' === btns[index].backgroundHoverType && (
						<div className="amp-inner-sub-section">
							<AdvancedColorControl
								label={__('Gradient Color 1', 'amp-blocks')}
								colorValue={(btns[index].backgroundHover ? btns[index].backgroundHover : '#444444')}
								colorDefault={'#444444'}
								opacityValue={btns[index].backgroundHoverOpacity}
								onColorChange={value => {
									this.saveArrayUpdate({ backgroundHover: value }, index);
								}}
								onOpacityChange={value => {
									this.saveArrayUpdate({ backgroundHoverOpacity: value }, index);
								}}
							/>
							<RangeControl
								label={__('Location', 'amp-blocks')}
								value={(btns[index].gradientHover && undefined !== btns[index].gradientHover[2] ? btns[index].gradientHover[2] : 0)}
								onChange={(value) => {
									this.saveArrayUpdate({ gradientHover: [(btns[index].gradientHover && undefined !== btns[index].gradientHover[0] ? btns[index].gradientHover[0] : '#777777'), (btns[index].gradientHover && undefined !== btns[index].gradientHover[1] ? btns[index].gradientHover[1] : 1), value, (btns[index].gradientHover && undefined !== btns[index].gradientHover[3] ? btns[index].gradientHover[3] : 100), (btns[index].gradientHover && undefined !== btns[index].gradientHover[4] ? btns[index].gradientHover[4] : 'linear'), (btns[index].gradientHover && undefined !== btns[index].gradientHover[5] ? btns[index].gradientHover[5] : 180), (btns[index].gradientHover && undefined !== btns[index].gradientHover[6] ? btns[index].gradientHover[6] : 'center center')] }, index);
								}}
								min={0}
								max={100}
							/>
							<AdvancedColorControl
								label={__('Gradient Color 2', 'amp-blocks')}
								colorValue={(btns[index].gradientHover && undefined !== btns[index].gradientHover[0] ? btns[index].gradientHover[0] : '#777777')}
								colorDefault={'#777777'}
								opacityValue={(btns[index].gradientHover && undefined !== btns[index].gradientHover[1] ? btns[index].gradientHover[1] : 1)}
								onColorChange={value => {
									this.saveArrayUpdate({ gradientHover: [value, (btns[index].gradientHover && undefined !== btns[index].gradientHover[1] ? btns[index].gradientHover[1] : 1), (btns[index].gradientHover && undefined !== btns[index].gradientHover[2] ? btns[index].gradientHover[2] : 0), (btns[index].gradientHover && undefined !== btns[index].gradientHover[3] ? btns[index].gradientHover[3] : 100), (btns[index].gradientHover && undefined !== btns[index].gradientHover[4] ? btns[index].gradientHover[4] : 'linear'), (btns[index].gradientHover && undefined !== btns[index].gradientHover[5] ? btns[index].gradientHover[5] : 180), (btns[index].gradientHover && undefined !== btns[index].gradientHover[6] ? btns[index].gradientHover[6] : 'center center')] }, index);
								}}
								onOpacityChange={value => {
									this.saveArrayUpdate({ gradientHover: [(btns[index].gradientHover && undefined !== btns[index].gradientHover[0] ? btns[index].gradientHover[0] : '#777777'), value, (btns[index].gradientHover && undefined !== btns[index].gradientHover[2] ? btns[index].gradientHover[2] : 0), (btns[index].gradientHover && undefined !== btns[index].gradientHover[3] ? btns[index].gradientHover[3] : 100), (btns[index].gradientHover && undefined !== btns[index].gradientHover[4] ? btns[index].gradientHover[4] : 'linear'), (btns[index].gradientHover && undefined !== btns[index].gradientHover[5] ? btns[index].gradientHover[5] : 180), (btns[index].gradientHover && undefined !== btns[index].gradientHover[6] ? btns[index].gradientHover[6] : 'center center')] }, index);
								}}
							/>
							<RangeControl
								label={__('Location', 'amp-blocks')}
								value={(btns[index].gradientHover && undefined !== btns[index].gradientHover[3] ? btns[index].gradientHover[3] : 100)}
								onChange={(value) => {
									this.saveArrayUpdate({ gradientHover: [(btns[index].gradientHover && undefined !== btns[index].gradientHover[0] ? btns[index].gradientHover[0] : '#777777'), (btns[index].gradientHover && undefined !== btns[index].gradientHover[1] ? btns[index].gradientHover[1] : 1), (btns[index].gradientHover && undefined !== btns[index].gradientHover[2] ? btns[index].gradientHover[2] : 0), value, (btns[index].gradientHover && undefined !== btns[index].gradientHover[4] ? btns[index].gradientHover[4] : 'linear'), (btns[index].gradientHover && undefined !== btns[index].gradientHover[5] ? btns[index].gradientHover[5] : 180), (btns[index].gradientHover && undefined !== btns[index].gradientHover[6] ? btns[index].gradientHover[6] : 'center center')] }, index);
								}}
								min={0}
								max={100}
							/>
							<div className="b-size-settings-container">
								<h2 className="amp-beside-btn-group">{__('Gradient Type', 'amp-blocks')}</h2>
								<ButtonGroup className="b-size-type-options" aria-label={__('Gradient Type', 'amp-blocks')}>
									{map(gradTypes, ({ name, key }) => (
										<Button
											key={key}
											className="b-size-btn"
											isSmall
											isPrimary={(btns[index].gradientHover && undefined !== btns[index].gradientHover[4] ? btns[index].gradientHover[4] : 'linear') === key}
											aria-pressed={(btns[index].gradientHover && undefined !== btns[index].gradientHover[4] ? btns[index].gradientHover[4] : 'linear') === key}
											onClick={() => {
												this.saveArrayUpdate({ gradientHover: [(btns[index].gradientHover && undefined !== btns[index].gradientHover[0] ? btns[index].gradientHover[0] : '#777777'), (btns[index].gradientHover && undefined !== btns[index].gradientHover[1] ? btns[index].gradientHover[1] : 1), (btns[index].gradientHover && undefined !== btns[index].gradientHover[2] ? btns[index].gradientHover[2] : 0), (btns[index].gradientHover && undefined !== btns[index].gradientHover[3] ? btns[index].gradientHover[3] : 100), key, (btns[index].gradientHover && undefined !== btns[index].gradientHover[5] ? btns[index].gradientHover[5] : 180), (btns[index].gradientHover && undefined !== btns[index].gradientHover[6] ? btns[index].gradientHover[6] : 'center center')] }, index);
											}}
										>
											{name}
										</Button>
									))}
								</ButtonGroup>
							</div>
							{'radial' !== (btns[index].gradientHover && undefined !== btns[index].gradientHover[4] ? btns[index].gradientHover[4] : 'linear') && (
								<RangeControl
									label={__('Gradient Angle', 'amp-blocks')}
									value={(btns[index].gradientHover && undefined !== btns[index].gradientHover[5] ? btns[index].gradientHover[5] : 180)}
									onChange={(value) => {
										this.saveArrayUpdate({ gradientHover: [(btns[index].gradientHover && undefined !== btns[index].gradientHover[0] ? btns[index].gradientHover[0] : '#777777'), (btns[index].gradientHover && undefined !== btns[index].gradientHover[1] ? btns[index].gradientHover[1] : 1), (btns[index].gradientHover && undefined !== btns[index].gradientHover[2] ? btns[index].gradientHover[2] : 0), (btns[index].gradientHover && undefined !== btns[index].gradientHover[3] ? btns[index].gradientHover[3] : 100), (btns[index].gradientHover && undefined !== btns[index].gradientHover[4] ? btns[index].gradientHover[4] : 'linear'), value, (btns[index].gradientHover && undefined !== btns[index].gradientHover[6] ? btns[index].gradientHover[6] : 'center center')] }, index);
									}}
									min={0}
									max={360}
								/>
							)}
							{'radial' === (btns[index].gradientHover && undefined !== btns[index].gradientHover[4] ? btns[index].gradientHover[4] : 'linear') && (
								<SelectControl
									label={__('Gradient Position', 'amp-blocks')}
									value={(btns[index].gradientHover && undefined !== btns[index].gradientHover[6] ? btns[index].gradientHover[6] : 'center center')}
									options={[
										{ value: 'center top', label: __('Center Top', 'amp-blocks') },
										{ value: 'center center', label: __('Center Center', 'amp-blocks') },
										{ value: 'center bottom', label: __('Center Bottom', 'amp-blocks') },
										{ value: 'left top', label: __('Left Top', 'amp-blocks') },
										{ value: 'left center', label: __('Left Center', 'amp-blocks') },
										{ value: 'left bottom', label: __('Left Bottom', 'amp-blocks') },
										{ value: 'right top', label: __('Right Top', 'amp-blocks') },
										{ value: 'right center', label: __('Right Center', 'amp-blocks') },
										{ value: 'right bottom', label: __('Right Bottom', 'amp-blocks') },
									]}
									onChange={value => {
										this.saveArrayUpdate({ gradientHover: [(btns[index].gradientHover && undefined !== btns[index].gradientHover[0] ? btns[index].gradientHover[0] : '#777777'), (btns[index].gradientHover && undefined !== btns[index].gradientHover[1] ? btns[index].gradientHover[1] : 1), (btns[index].gradientHover && undefined !== btns[index].gradientHover[2] ? btns[index].gradientHover[2] : 0), (btns[index].gradientHover && undefined !== btns[index].gradientHover[3] ? btns[index].gradientHover[3] : 100), (btns[index].gradientHover && undefined !== btns[index].gradientHover[4] ? btns[index].gradientHover[4] : 'linear'), (btns[index].gradientHover && undefined !== btns[index].gradientHover[5] ? btns[index].gradientHover[5] : 180), value] }, index);
									}}
								/>
							)}
						</div>
					)}
					<AdvancedColorControl
						label={__('Hover Border Color', 'amp-blocks')}
						colorValue={(btns[index].borderHover ? btns[index].borderHover : '#444444')}
						colorDefault={'#444444'}
						opacityValue={btns[index].borderHoverOpacity}
						onColorChange={value => {
							this.saveArrayUpdate({ borderHover: value }, index);
						}}
						onOpacityChange={value => {
							this.saveArrayUpdate({ borderHoverOpacity: value }, index);
						}}
					/>
					<BoxShadowControl
						label={__('Hover Box Shadow', 'amp-blocks')}
						enable={(undefined !== btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[0] ? btns[index].boxShadowHover[0] : false)}
						color={(undefined !== btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[1] ? btns[index].boxShadowHover[1] : '#000000')}
						colorDefault={'#000000'}
						opacity={(undefined !== btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[2] ? btns[index].boxShadowHover[2] : 0.4)}
						hOffset={(undefined !== btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[3] ? btns[index].boxShadowHover[3] : 2)}
						vOffset={(undefined !== btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[4] ? btns[index].boxShadowHover[4] : 2)}
						blur={(undefined !== btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[5] ? btns[index].boxShadowHover[5] : 3)}
						spread={(undefined !== btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[6] ? btns[index].boxShadowHover[6] : 0)}
						inset={(undefined !== btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[7] ? btns[index].boxShadowHover[7] : false)}
						onEnableChange={value => {
							this.saveArrayUpdate({ boxShadowHover: [value, (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[1] ? btns[index].boxShadowHover[1] : '#000000'), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[2] ? btns[index].boxShadowHover[2] : 0.4), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[3] ? btns[index].boxShadowHover[3] : 2), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[4] ? btns[index].boxShadowHover[4] : 2), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[5] ? btns[index].boxShadowHover[5] : 3), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[6] ? btns[index].boxShadowHover[6] : 0), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[7] ? btns[index].boxShadowHover[7] : false)] }, index);
						}}
						onColorChange={value => {
							this.saveArrayUpdate({ boxShadowHover: [(btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[0] ? btns[index].boxShadowHover[0] : false), value, (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[2] ? btns[index].boxShadowHover[2] : 0.4), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[3] ? btns[index].boxShadowHover[3] : 2), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[4] ? btns[index].boxShadowHover[4] : 2), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[5] ? btns[index].boxShadowHover[5] : 3), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[6] ? btns[index].boxShadowHover[6] : 0), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[7] ? btns[index].boxShadowHover[7] : false)] }, index);
						}}
						onOpacityChange={value => {
							this.saveArrayUpdate({ boxShadowHover: [(btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[0] ? btns[index].boxShadowHover[0] : false), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[1] ? btns[index].boxShadowHover[1] : '#000000'), value, (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[3] ? btns[index].boxShadowHover[3] : 2), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[4] ? btns[index].boxShadowHover[4] : 2), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[5] ? btns[index].boxShadowHover[5] : 3), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[6] ? btns[index].boxShadowHover[6] : 0), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[7] ? btns[index].boxShadowHover[7] : false)] }, index);
						}}
						onHOffsetChange={value => {
							this.saveArrayUpdate({ boxShadowHover: [(btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[0] ? btns[index].boxShadowHover[0] : false), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[1] ? btns[index].boxShadowHover[1] : '#000000'), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[2] ? btns[index].boxShadowHover[2] : 0.4), value, (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[4] ? btns[index].boxShadowHover[4] : 2), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[5] ? btns[index].boxShadowHover[5] : 3), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[6] ? btns[index].boxShadowHover[6] : 0), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[7] ? btns[index].boxShadowHover[7] : false)] }, index);
						}}
						onVOffsetChange={value => {
							this.saveArrayUpdate({ boxShadowHover: [(btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[0] ? btns[index].boxShadowHover[0] : false), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[1] ? btns[index].boxShadowHover[1] : '#000000'), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[2] ? btns[index].boxShadowHover[2] : 0.4), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[3] ? btns[index].boxShadowHover[3] : 2), value, (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[5] ? btns[index].boxShadowHover[5] : 3), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[6] ? btns[index].boxShadowHover[6] : 0), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[7] ? btns[index].boxShadowHover[7] : false)] }, index);
						}}
						onBlurChange={value => {
							this.saveArrayUpdate({ boxShadowHover: [(btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[0] ? btns[index].boxShadowHover[0] : false), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[1] ? btns[index].boxShadowHover[1] : '#000000'), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[2] ? btns[index].boxShadowHover[2] : 0.4), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[3] ? btns[index].boxShadowHover[3] : 2), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[4] ? btns[index].boxShadowHover[4] : 2), value, (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[6] ? btns[index].boxShadowHover[6] : 0), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[7] ? btns[index].boxShadowHover[7] : false)] }, index);
						}}
						onSpreadChange={value => {
							this.saveArrayUpdate({ boxShadowHover: [(btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[0] ? btns[index].boxShadowHover[0] : false), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[1] ? btns[index].boxShadowHover[1] : '#000000'), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[2] ? btns[index].boxShadowHover[2] : 0.4), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[3] ? btns[index].boxShadowHover[3] : 2), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[4] ? btns[index].boxShadowHover[4] : 2), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[5] ? btns[index].boxShadowHover[5] : 3), value, (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[7] ? btns[index].boxShadowHover[7] : false)] }, index);
						}}
						onInsetChange={value => {
							this.saveArrayUpdate({ boxShadowHover: [(btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[0] ? btns[index].boxShadowHover[0] : false), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[1] ? btns[index].boxShadowHover[1] : '#000000'), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[2] ? btns[index].boxShadowHover[2] : 0.4), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[3] ? btns[index].boxShadowHover[3] : 2), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[4] ? btns[index].boxShadowHover[4] : 2), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[5] ? btns[index].boxShadowHover[5] : 3), (btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[6] ? btns[index].boxShadowHover[6] : 0), value] }, index);
						}}
					/>
				</div>
			);
		};
		const buttonSettings = (index) => {
			return (
				<div>
					<AdvancedColorControl
						label={__('Text Color', 'amp-blocks')}
						colorValue={btns[index].color}
						colorDefault={'#555555'}
						onColorChange={value => {
							this.saveArrayUpdate({ color: value }, index);
						}}
					/>
					<div className="b-size-settings-container">
						<h2 className="amp-beside-btn-group">{__('Background Type', 'amp-blocks')}</h2>
						<ButtonGroup className="b-size-type-options" aria-label={__('Background Type', 'amp-blocks')}>
							{map(bgType, ({ name, key }) => (
								<Button
									key={key}
									className="b-size-btn"
									isSmall
									isPrimary={(undefined !== btns[index].backgroundType ? btns[index].backgroundType : 'solid') === key}
									aria-pressed={(undefined !== btns[index].backgroundType ? btns[index].backgroundType : 'solid') === key}
									onClick={() => this.saveArrayUpdate({ backgroundType: key }, index)}
								>
									{name}
								</Button>
							))}
						</ButtonGroup>
					</div>
					{'gradient' !== btns[index].backgroundType && (
						<div className="amp-inner-sub-section">
							<AdvancedColorControl
								label={__('Background Color', 'amp-blocks')}
								colorValue={btns[index].background}
								colorDefault={''}
								opacityValue={btns[index].backgroundOpacity}
								onColorChange={value => {
									this.saveArrayUpdate({ background: value }, index);
								}}
								onOpacityChange={value => {
									this.saveArrayUpdate({ backgroundOpacity: value }, index);
								}}
							/>
						</div>
					)}
					{'gradient' === btns[index].backgroundType && (
						<div className="amp-inner-sub-section">
							<AdvancedColorControl
								label={__('Gradient Color 1', 'amp-blocks')}
								colorValue={btns[index].background}
								colorDefault={''}
								opacityValue={btns[index].backgroundOpacity}
								onColorChange={value => {
									this.saveArrayUpdate({ background: value }, index);
								}}
								onOpacityChange={value => {
									this.saveArrayUpdate({ backgroundOpacity: value }, index);
								}}
							/>
							<RangeControl
								label={__('Location', 'amp-blocks')}
								value={(btns[index].gradient && undefined !== btns[index].gradient[2] ? btns[index].gradient[2] : 0)}
								onChange={(value) => {
									this.saveArrayUpdate({ gradient: [(btns[index].gradient && undefined !== btns[index].gradient[0] ? btns[index].gradient[0] : '#999999'), (btns[index].gradient && undefined !== btns[index].gradient[1] ? btns[index].gradient[1] : 1), value, (btns[index].gradient && undefined !== btns[index].gradient[3] ? btns[index].gradient[3] : 100), (btns[index].gradient && undefined !== btns[index].gradient[4] ? btns[index].gradient[4] : 'linear'), (btns[index].gradient && undefined !== btns[index].gradient[5] ? btns[index].gradient[5] : 180), (btns[index].gradient && undefined !== btns[index].gradient[6] ? btns[index].gradient[6] : 'center center')] }, index);
								}}
								min={0}
								max={100}
							/>
							<AdvancedColorControl
								label={__('Gradient Color 2', 'amp-blocks')}
								colorValue={(btns[index].gradient && undefined !== btns[index].gradient[0] ? btns[index].gradient[0] : '#999999')}
								colorDefault={'#999999'}
								opacityValue={(btns[index].gradient && undefined !== btns[index].gradient[1] ? btns[index].gradient[1] : 1)}
								onColorChange={value => {
									this.saveArrayUpdate({ gradient: [value, (btns[index].gradient && undefined !== btns[index].gradient[1] ? btns[index].gradient[1] : 1), (btns[index].gradient && undefined !== btns[index].gradient[2] ? btns[index].gradient[2] : 0), (btns[index].gradient && undefined !== btns[index].gradient[3] ? btns[index].gradient[3] : 100), (btns[index].gradient && undefined !== btns[index].gradient[4] ? btns[index].gradient[4] : 'linear'), (btns[index].gradient && undefined !== btns[index].gradient[5] ? btns[index].gradient[5] : 180), (btns[index].gradient && undefined !== btns[index].gradient[6] ? btns[index].gradient[6] : 'center center')] }, index);
								}}
								onOpacityChange={value => {
									this.saveArrayUpdate({ gradient: [(btns[index].gradient && undefined !== btns[index].gradient[0] ? btns[index].gradient[0] : '#999999'), value, (btns[index].gradient && undefined !== btns[index].gradient[2] ? btns[index].gradient[2] : 0), (btns[index].gradient && undefined !== btns[index].gradient[3] ? btns[index].gradient[3] : 100), (btns[index].gradient && undefined !== btns[index].gradient[4] ? btns[index].gradient[4] : 'linear'), (btns[index].gradient && undefined !== btns[index].gradient[5] ? btns[index].gradient[5] : 180), (btns[index].gradient && undefined !== btns[index].gradient[6] ? btns[index].gradient[6] : 'center center')] }, index);
								}}
							/>
							<RangeControl
								label={__('Location', 'amp-blocks')}
								value={(btns[index].gradient && undefined !== btns[index].gradient[3] ? btns[index].gradient[3] : 100)}
								onChange={(value) => {
									this.saveArrayUpdate({ gradient: [(btns[index].gradient && undefined !== btns[index].gradient[0] ? btns[index].gradient[0] : '#999999'), (btns[index].gradient && undefined !== btns[index].gradient[1] ? btns[index].gradient[1] : 1), (btns[index].gradient && undefined !== btns[index].gradient[2] ? btns[index].gradient[2] : 0), value, (btns[index].gradient && undefined !== btns[index].gradient[4] ? btns[index].gradient[4] : 'linear'), (btns[index].gradient && undefined !== btns[index].gradient[5] ? btns[index].gradient[5] : 180), (btns[index].gradient && undefined !== btns[index].gradient[6] ? btns[index].gradient[6] : 'center center')] }, index);
								}}
								min={0}
								max={100}
							/>
							<div className="b-size-settings-container">
								<h2 className="amp-beside-btn-group">{__('Gradient Type', 'amp-blocks')}</h2>
								<ButtonGroup className="b-size-type-options" aria-label={__('Gradient Type', 'amp-blocks')}>
									{map(gradTypes, ({ name, key }) => (
										<Button
											key={key}
											className="b-size-btn"
											isSmall
											isPrimary={(btns[index].gradient && undefined !== btns[index].gradient[4] ? btns[index].gradient[4] : 'linear') === key}
											aria-pressed={(btns[index].gradient && undefined !== btns[index].gradient[4] ? btns[index].gradient[4] : 'linear') === key}
											onClick={() => {
												this.saveArrayUpdate({ gradient: [(btns[index].gradient && undefined !== btns[index].gradient[0] ? btns[index].gradient[0] : '#999999'), (btns[index].gradient && undefined !== btns[index].gradient[1] ? btns[index].gradient[1] : 1), (btns[index].gradient && undefined !== btns[index].gradient[2] ? btns[index].gradient[2] : 0), (btns[index].gradient && undefined !== btns[index].gradient[3] ? btns[index].gradient[3] : 100), key, (btns[index].gradient && undefined !== btns[index].gradient[5] ? btns[index].gradient[5] : 180), (btns[index].gradient && undefined !== btns[index].gradient[6] ? btns[index].gradient[6] : 'center center')] }, index);
											}}
										>
											{name}
										</Button>
									))}
								</ButtonGroup>
							</div>
							{'radial' !== (btns[index].gradient && undefined !== btns[index].gradient[4] ? btns[index].gradient[4] : 'linear') && (
								<RangeControl
									label={__('Gradient Angle', 'amp-blocks')}
									value={(btns[index].gradient && undefined !== btns[index].gradient[5] ? btns[index].gradient[5] : 180)}
									onChange={(value) => {
										this.saveArrayUpdate({ gradient: [(btns[index].gradient && undefined !== btns[index].gradient[0] ? btns[index].gradient[0] : '#999999'), (btns[index].gradient && undefined !== btns[index].gradient[1] ? btns[index].gradient[1] : 1), (btns[index].gradient && undefined !== btns[index].gradient[2] ? btns[index].gradient[2] : 0), (btns[index].gradient && undefined !== btns[index].gradient[3] ? btns[index].gradient[3] : 100), (btns[index].gradient && undefined !== btns[index].gradient[4] ? btns[index].gradient[4] : 'linear'), value, (btns[index].gradient && undefined !== btns[index].gradient[6] ? btns[index].gradient[6] : 'center center')] }, index);
									}}
									min={0}
									max={360}
								/>
							)}
							{'radial' === (btns[index].gradient && undefined !== btns[index].gradient[4] ? btns[index].gradient[4] : 'linear') && (
								<SelectControl
									label={__('Gradient Position', 'amp-blocks')}
									value={(btns[index].gradient && undefined !== btns[index].gradient[6] ? btns[index].gradient[6] : 'center center')}
									options={[
										{ value: 'center top', label: __('Center Top', 'amp-blocks') },
										{ value: 'center center', label: __('Center Center', 'amp-blocks') },
										{ value: 'center bottom', label: __('Center Bottom', 'amp-blocks') },
										{ value: 'left top', label: __('Left Top', 'amp-blocks') },
										{ value: 'left center', label: __('Left Center', 'amp-blocks') },
										{ value: 'left bottom', label: __('Left Bottom', 'amp-blocks') },
										{ value: 'right top', label: __('Right Top', 'amp-blocks') },
										{ value: 'right center', label: __('Right Center', 'amp-blocks') },
										{ value: 'right bottom', label: __('Right Bottom', 'amp-blocks') },
									]}
									onChange={value => {
										this.saveArrayUpdate({ gradient: [(btns[index].gradient && undefined !== btns[index].gradient[0] ? btns[index].gradient[0] : '#999999'), (btns[index].gradient && undefined !== btns[index].gradient[1] ? btns[index].gradient[1] : 1), (btns[index].gradient && undefined !== btns[index].gradient[2] ? btns[index].gradient[2] : 0), (btns[index].gradient && undefined !== btns[index].gradient[3] ? btns[index].gradient[3] : 100), (btns[index].gradient && undefined !== btns[index].gradient[4] ? btns[index].gradient[4] : 'linear'), (btns[index].gradient && undefined !== btns[index].gradient[5] ? btns[index].gradient[5] : 180), value] }, index);
									}}
								/>
							)}
						</div>
					)}
					<AdvancedColorControl
						label={__('Border Color', 'amp-blocks')}
						colorValue={(btns[index].border ? btns[index].border : '#555555')}
						colorDefault={'#555555'}
						opacityValue={btns[index].borderOpacity}
						onColorChange={value => {
							this.saveArrayUpdate({ border: value }, index);
						}}
						onOpacityChange={value => {
							this.saveArrayUpdate({ borderOpacity: value }, index);
						}}
					/>
					<BoxShadowControl
						label={__('Box Shadow', 'amp-blocks')}
						enable={(undefined !== btns[index].boxShadow && undefined !== btns[index].boxShadow[0] ? btns[index].boxShadow[0] : false)}
						color={(undefined !== btns[index].boxShadow && undefined !== btns[index].boxShadow[1] ? btns[index].boxShadow[1] : '#000000')}
						colorDefault={'#000000'}
						opacity={(undefined !== btns[index].boxShadow && undefined !== btns[index].boxShadow[2] ? btns[index].boxShadow[2] : 0.2)}
						hOffset={(undefined !== btns[index].boxShadow && undefined !== btns[index].boxShadow[3] ? btns[index].boxShadow[3] : 1)}
						vOffset={(undefined !== btns[index].boxShadow && undefined !== btns[index].boxShadow[4] ? btns[index].boxShadow[4] : 1)}
						blur={(undefined !== btns[index].boxShadow && undefined !== btns[index].boxShadow[5] ? btns[index].boxShadow[5] : 2)}
						spread={(undefined !== btns[index].boxShadow && undefined !== btns[index].boxShadow[6] ? btns[index].boxShadow[6] : 0)}
						inset={(undefined !== btns[index].boxShadow && undefined !== btns[index].boxShadow[7] ? btns[index].boxShadow[7] : false)}
						onEnableChange={value => {
							this.saveArrayUpdate({ boxShadow: [value, (btns[index].boxShadow && undefined !== btns[index].boxShadow[1] ? btns[index].boxShadow[1] : '#000000'), (btns[index].boxShadow && undefined !== btns[index].boxShadow[2] ? btns[index].boxShadow[2] : 0.2), (btns[index].boxShadow && undefined !== btns[index].boxShadow[3] ? btns[index].boxShadow[3] : 1), (btns[index].boxShadow && undefined !== btns[index].boxShadow[4] ? btns[index].boxShadow[4] : 1), (btns[index].boxShadow && undefined !== btns[index].boxShadow[5] ? btns[index].boxShadow[5] : 2), (btns[index].boxShadow && undefined !== btns[index].boxShadow[6] ? btns[index].boxShadow[6] : 0), (btns[index].boxShadow && undefined !== btns[index].boxShadow[7] ? btns[index].boxShadow[7] : false)] }, index);
						}}
						onColorChange={value => {
							this.saveArrayUpdate({ boxShadow: [(btns[index].boxShadow && undefined !== btns[index].boxShadow[0] ? btns[index].boxShadow[0] : false), value, (btns[index].boxShadow && undefined !== btns[index].boxShadow[2] ? btns[index].boxShadow[2] : 0.2), (btns[index].boxShadow && undefined !== btns[index].boxShadow[3] ? btns[index].boxShadow[3] : 1), (btns[index].boxShadow && undefined !== btns[index].boxShadow[4] ? btns[index].boxShadow[4] : 1), (btns[index].boxShadow && undefined !== btns[index].boxShadow[5] ? btns[index].boxShadow[5] : 2), (btns[index].boxShadow && undefined !== btns[index].boxShadow[6] ? btns[index].boxShadow[6] : 0), (btns[index].boxShadow && undefined !== btns[index].boxShadow[7] ? btns[index].boxShadow[7] : false)] }, index);
						}}
						onOpacityChange={value => {
							this.saveArrayUpdate({ boxShadow: [(btns[index].boxShadow && undefined !== btns[index].boxShadow[0] ? btns[index].boxShadow[0] : false), (btns[index].boxShadow && undefined !== btns[index].boxShadow[1] ? btns[index].boxShadow[1] : '#000000'), value, (btns[index].boxShadow && undefined !== btns[index].boxShadow[3] ? btns[index].boxShadow[3] : 1), (btns[index].boxShadow && undefined !== btns[index].boxShadow[4] ? btns[index].boxShadow[4] : 1), (btns[index].boxShadow && undefined !== btns[index].boxShadow[5] ? btns[index].boxShadow[5] : 2), (btns[index].boxShadow && undefined !== btns[index].boxShadow[6] ? btns[index].boxShadow[6] : 0), (btns[index].boxShadow && undefined !== btns[index].boxShadow[7] ? btns[index].boxShadow[7] : false)] }, index);
						}}
						onHOffsetChange={value => {
							this.saveArrayUpdate({ boxShadow: [(btns[index].boxShadow && undefined !== btns[index].boxShadow[0] ? btns[index].boxShadow[0] : false), (btns[index].boxShadow && undefined !== btns[index].boxShadow[1] ? btns[index].boxShadow[1] : '#000000'), (btns[index].boxShadow && undefined !== btns[index].boxShadow[2] ? btns[index].boxShadow[2] : 0.2), value, (btns[index].boxShadow && undefined !== btns[index].boxShadow[4] ? btns[index].boxShadow[4] : 1), (btns[index].boxShadow && undefined !== btns[index].boxShadow[5] ? btns[index].boxShadow[5] : 2), (btns[index].boxShadow && undefined !== btns[index].boxShadow[6] ? btns[index].boxShadow[6] : 0), (btns[index].boxShadow && undefined !== btns[index].boxShadow[7] ? btns[index].boxShadow[7] : false)] }, index);
						}}
						onVOffsetChange={value => {
							this.saveArrayUpdate({ boxShadow: [(btns[index].boxShadow && undefined !== btns[index].boxShadow[0] ? btns[index].boxShadow[0] : false), (btns[index].boxShadow && undefined !== btns[index].boxShadow[1] ? btns[index].boxShadow[1] : '#000000'), (btns[index].boxShadow && undefined !== btns[index].boxShadow[2] ? btns[index].boxShadow[2] : 0.2), (btns[index].boxShadow && undefined !== btns[index].boxShadow[3] ? btns[index].boxShadow[3] : 1), value, (btns[index].boxShadow && undefined !== btns[index].boxShadow[5] ? btns[index].boxShadow[5] : 2), (btns[index].boxShadow && undefined !== btns[index].boxShadow[6] ? btns[index].boxShadow[6] : 0), (btns[index].boxShadow && undefined !== btns[index].boxShadow[7] ? btns[index].boxShadow[7] : false)] }, index);
						}}
						onBlurChange={value => {
							this.saveArrayUpdate({ boxShadow: [(btns[index].boxShadow && undefined !== btns[index].boxShadow[0] ? btns[index].boxShadow[0] : false), (btns[index].boxShadow && undefined !== btns[index].boxShadow[1] ? btns[index].boxShadow[1] : '#000000'), (btns[index].boxShadow && undefined !== btns[index].boxShadow[2] ? btns[index].boxShadow[2] : 0.2), (btns[index].boxShadow && undefined !== btns[index].boxShadow[3] ? btns[index].boxShadow[3] : 1), (btns[index].boxShadow && undefined !== btns[index].boxShadow[4] ? btns[index].boxShadow[4] : 1), value, (btns[index].boxShadow && undefined !== btns[index].boxShadow[6] ? btns[index].boxShadow[6] : 0), (btns[index].boxShadow && undefined !== btns[index].boxShadow[7] ? btns[index].boxShadow[7] : false)] }, index);
						}}
						onSpreadChange={value => {
							this.saveArrayUpdate({ boxShadow: [(btns[index].boxShadow && undefined !== btns[index].boxShadow[0] ? btns[index].boxShadow[0] : false), (btns[index].boxShadow && undefined !== btns[index].boxShadow[1] ? btns[index].boxShadow[1] : '#000000'), (btns[index].boxShadow && undefined !== btns[index].boxShadow[2] ? btns[index].boxShadow[2] : 0.2), (btns[index].boxShadow && undefined !== btns[index].boxShadow[3] ? btns[index].boxShadow[3] : 1), (btns[index].boxShadow && undefined !== btns[index].boxShadow[4] ? btns[index].boxShadow[4] : 1), (btns[index].boxShadow && undefined !== btns[index].boxShadow[5] ? btns[index].boxShadow[5] : 2), value, (btns[index].boxShadow && undefined !== btns[index].boxShadow[7] ? btns[index].boxShadow[7] : false)] }, index);
						}}
						onInsetChange={value => {
							this.saveArrayUpdate({ boxShadow: [(btns[index].boxShadow && undefined !== btns[index].boxShadow[0] ? btns[index].boxShadow[0] : false), (btns[index].boxShadow && undefined !== btns[index].boxShadow[1] ? btns[index].boxShadow[1] : '#000000'), (btns[index].boxShadow && undefined !== btns[index].boxShadow[2] ? btns[index].boxShadow[2] : 0.2), (btns[index].boxShadow && undefined !== btns[index].boxShadow[3] ? btns[index].boxShadow[3] : 1), (btns[index].boxShadow && undefined !== btns[index].boxShadow[4] ? btns[index].boxShadow[4] : 1), (btns[index].boxShadow && undefined !== btns[index].boxShadow[5] ? btns[index].boxShadow[5] : 2), (btns[index].boxShadow && undefined !== btns[index].boxShadow[6] ? btns[index].boxShadow[6] : 0), value] }, index);
						}}
					/>
				</div>
			);
		};
		const renderArray = (
			<Fragment>
				{times(btnCount, n => tabControls(n))}
			</Fragment>
		);
		const renderPreviewArray = (
			<div>
				{times(btnCount, n => renderBtns(n))}
			</div>
		);
		const renderBtnCSS = (index) => {
			let btnbg;
			let btnGrad;
			let btnGrad2;
			let btnRad = '0';
			let btnBox = '';
			let btnBox2 = '';
			if (undefined !== btns[index].backgroundHoverType && 'gradient' === btns[index].backgroundHoverType && undefined !== btns[index].gradientHover) {
				btnGrad = (undefined === btns[index].backgroundHover ? hexToRGBA('#444444', (btns[index].backgroundHoverOpacity !== undefined ? btns[index].backgroundHoverOpacity : 1)) : hexToRGBA(btns[index].backgroundHover, (btns[index].backgroundHoverOpacity !== undefined ? btns[index].backgroundHoverOpacity : 1)));
				btnGrad2 = (undefined === btns[index].gradientHover[0] ? hexToRGBA('#777777', (btns[index].gradientHover[1] !== undefined ? btns[index].gradientHover[1] : 1)) : hexToRGBA(btns[index].gradientHover[0], (btns[index].gradientHover[1] !== undefined ? btns[index].gradientHover[1] : 1)));
				if (undefined !== btns[index].gradientHover && 'radial' === btns[index].gradientHover[4]) {
					btnbg = `radial-gradient(at ${(undefined === btns[index].gradientHover[6] ? 'center center' : btns[index].gradientHover[6])}, ${btnGrad} ${(undefined === btns[index].gradientHover[2] ? '0' : btns[index].gradientHover[2])}%, ${btnGrad2} ${(undefined === btns[index].gradientHover[3] ? '100' : btns[index].gradientHover[3])}%)`;
				} else if (undefined !== btns[index].backgroundType && 'gradient' === btns[index].backgroundType && undefined !== btns[index].gradientHover && 'linear' === btns[index].gradientHover[4]) {
					btnbg = `linear-gradient(${(undefined === btns[index].gradientHover[5] ? '180' : btns[index].gradientHover[5])}deg, ${btnGrad} ${(undefined === btns[index].gradientHover[2] ? '0' : btns[index].gradientHover[2])}%, ${btnGrad2} ${(undefined === btns[index].gradientHover[3] ? '100' : btns[index].gradientHover[3])}%)`;
				}
			} else if (undefined !== btns[index].backgroundHoverType && 'gradient' === btns[index].backgroundHoverType && undefined === btns[index].gradientHover) {
				btnGrad = (undefined === btns[index].backgroundHover ? hexToRGBA('#444444', (btns[index].backgroundHoverOpacity !== undefined ? btns[index].backgroundHoverOpacity : 1)) : hexToRGBA(btns[index].backgroundHover, (btns[index].backgroundHoverOpacity !== undefined ? btns[index].backgroundHoverOpacity : 1)));
				btnbg = `linear-gradient(180deg, ${btnGrad} 0%, #777777 100%)`;
			} else {
				btnbg = hexToRGBA((undefined === btns[index].backgroundHover ? '#444444' : btns[index].backgroundHover), (btns[index].backgroundHoverOpacity !== undefined ? btns[index].backgroundHoverOpacity : 1));
			}
			if (undefined !== btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[0] && btns[index].boxShadowHover[0] && false === btns[index].boxShadowHover[7]) {
				btnBox = `${(undefined !== btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[0] && btns[index].boxShadowHover[0] ? (undefined !== btns[index].boxShadowHover[7] && btns[index].boxShadowHover[7] ? 'inset ' : '') + (undefined !== btns[index].boxShadowHover[3] ? btns[index].boxShadowHover[3] : 1) + 'px ' + (undefined !== btns[index].boxShadowHover[4] ? btns[index].boxShadowHover[4] : 1) + 'px ' + (undefined !== btns[index].boxShadowHover[5] ? btns[index].boxShadowHover[5] : 2) + 'px ' + (undefined !== btns[index].boxShadowHover[6] ? btns[index].boxShadowHover[6] : 0) + 'px ' + hexToRGBA((undefined !== btns[index].boxShadowHover[1] ? btns[index].boxShadowHover[1] : '#000000'), (undefined !== btns[index].boxShadowHover[2] ? btns[index].boxShadowHover[2] : 1)) : undefined)}`;
				btnBox2 = 'none';
				btnRad = '0';
			}
			if (undefined !== btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[0] && btns[index].boxShadowHover[0] && true === btns[index].boxShadowHover[7]) {
				btnBox2 = `${(undefined !== btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[0] && btns[index].boxShadowHover[0] ? (undefined !== btns[index].boxShadowHover[7] && btns[index].boxShadowHover[7] ? 'inset ' : '') + (undefined !== btns[index].boxShadowHover[3] ? btns[index].boxShadowHover[3] : 1) + 'px ' + (undefined !== btns[index].boxShadowHover[4] ? btns[index].boxShadowHover[4] : 1) + 'px ' + (undefined !== btns[index].boxShadowHover[5] ? btns[index].boxShadowHover[5] : 2) + 'px ' + (undefined !== btns[index].boxShadowHover[6] ? btns[index].boxShadowHover[6] : 0) + 'px ' + hexToRGBA((undefined !== btns[index].boxShadowHover[1] ? btns[index].boxShadowHover[1] : '#000000'), (undefined !== btns[index].boxShadowHover[2] ? btns[index].boxShadowHover[2] : 1)) : undefined)}`;
				btnRad = (undefined !== btns[index].borderRadius ? btns[index].borderRadius : '3');
				btnBox = 'none';
			}
			return (
				`#b_${uniqueID} .b-${index}:hover {
					color: ${ btns[index].colorHover} !important;
					border-color: ${ hexToRGBA((undefined === btns[index].borderHover ? '#444444' : btns[index].borderHover), (btns[index].borderHoverOpacity !== undefined ? btns[index].borderHoverOpacity : 1))} !important;
					box-shadow: ${ btnBox} !important;
				}
				#b_${ uniqueID} .b-${index}::before {
					background: ${ btnbg};
					box-shadow: ${ btnBox2};
					border-radius: ${ btnRad}px;
				}`
			);
		};
		const renderCSS = (
			<style>
				{times(btnCount, n => renderBtnCSS(n))}
			</style>
		);
		return (
			<Fragment>
				{renderCSS}
				<div id={`b_${uniqueID}`} className={`${className} bp b-align-${hAlign}${(forceFullwidth ? ' amp-force-btn-fullwidth' : '')}`}>
					<BlockControls>
						<AlignmentToolbar
							value={hAlign}
							onChange={(value) => setAttributes({ hAlign: value })}
						/>
					</BlockControls>
					{this.showSettings('allSettings') && (
						<Fragment>
							<InspectorControls>
								{this.showSettings('countSettings') && (
									<PanelBody
										title={__('Button Count', 'amp-blocks')}
										initialOpen={true}
									>
										<StepControl
											label={__('Number of Buttons', 'amp-blocks')}
											value={btnCount}
											onChange={(newcount) => {
												const newbtns = btns;
												if (newbtns.length < newcount) {
													const amount = Math.abs(newcount - newbtns.length);
													{
														times(amount, n => {
															newbtns.push({
																text: newbtns[0].text,
																link: newbtns[0].link,
																target: newbtns[0].target,
																size: newbtns[0].size,
																paddingBT: newbtns[0].paddingBT,
																paddingLR: newbtns[0].paddingLR,
																color: newbtns[0].color,
																background: newbtns[0].background,
																border: newbtns[0].border,
																backgroundOpacity: newbtns[0].backgroundOpacity,
																borderOpacity: newbtns[0].borderOpacity,
																borderRadius: newbtns[0].borderRadius,
																borderWidth: newbtns[0].borderWidth,
																colorHover: newbtns[0].colorHover,
																backgroundHover: newbtns[0].backgroundHover,
																borderHover: newbtns[0].borderHover,
																backgroundHoverOpacity: newbtns[0].backgroundHoverOpacity,
																borderHoverOpacity: newbtns[0].borderHoverOpacity,
																icon: newbtns[0].icon,
																iconSide: newbtns[0].iconSide,
																iconHover: newbtns[0].iconHover,
																cssClass: (newbtns[0].cssClass ? newbtns[0].cssClass : ''),
																noFollow: (newbtns[0].noFollow ? newbtns[0].noFollow : false),
																responsiveSize: (newbtns[0].responsiveSize ? newbtns[0].responsiveSize : ['', '']),
																gradient: (newbtns[0].gradient ? newbtns[0].gradient : ['#999999', 1, 0, 100, 'linear', 180, 'center center']),
																gradientHover: (newbtns[0].gradientHover ? newbtns[0].gradientHover : ['#777777', 1, 0, 100, 'linear', 180, 'center center']),
																btnStyle: (newbtns[0].btnStyle ? newbtns[0].btnStyle : 'basic'),
																btnSize: (newbtns[0].btnSize ? newbtns[0].btnSize : 'standard'),
																backgroundType: (newbtns[0].backgroundType ? newbtns[0].backgroundType : 'solid'),
																backgroundHoverType: (newbtns[0].backgroundHoverType ? newbtns[0].backgroundHoverType : 'solid'),
																width: (newbtns[0].width ? newbtns[0].width : ['', '', '']),
																responsivePaddingBT: (newbtns[0].responsivePaddingBT ? newbtns[0].responsivePaddingBT : ['', '']),
																responsivePaddingLR: (newbtns[0].responsivePaddingLR ? newbtns[0].responsivePaddingLR : ['', '']),
																boxShadow: (newbtns[0].boxShadow ? newbtns[0].boxShadow : [false, '#000000', 0.2, 1, 1, 2, 0, false]),
																boxShadowHover: (newbtns[0].boxShadowHover ? newbtns[0].boxShadowHover : [false, '#000000', 0.4, 2, 2, 3, 0, false]),
																sponsored: (newbtns[0].sponsored ? newbtns[0].sponsored : false),
																marginTop: (newbtns[index].marginTop ? newbtns[index].marginTop + 'px' : undefined),
																marginRight: (newbtns[index].marginRight ? newbtns[index].marginRight + 'px' : undefined),
																marginBottom: (newbtns[index].marginBottom ? newbtns[index].marginBottom + 'px' : undefined),
																marginLeft: (newbtns[index].marginLeft ? newbtns[index].marginLeft + 'px' : undefined),
															});
														});
													}
													setAttributes({ btns: newbtns });
													this.saveArrayUpdate({ iconSide: btns[0].iconSide }, 0);
												}
												setAttributes({ btnCount: newcount });
											}}
											min={1}
											max={5}
											step={1}
										/>
										<h2 className="amp-heading-size-title">{__('Button Alignment', 'amp-blocks')}</h2>
										<TabPanel className="amp-size-tabs"
											activeClass="active-tab"
											tabs={[
												{
													name: 'desk',
													title: <Dashicon icon="desktop" />,
													className: 'amp-desk-tab',
												},
												{
													name: 'tablet',
													title: <Dashicon icon="tablet" />,
													className: 'amp-tablet-tab',
												},
												{
													name: 'mobile',
													title: <Dashicon icon="smartphone" />,
													className: 'amp-mobile-tab',
												},
											]}>
											{
												(tab) => {
													let tabout;
													if (tab.name) {
														if ('mobile' === tab.name) {
															tabout = (
																<AlignmentToolbar
																	isCollapsed={false}
																	value={mhAlign}
																	onChange={(value) => setAttributes({ mhAlign: value })}
																/>
															);
														} else if ('tablet' === tab.name) {
															tabout = (
																<AlignmentToolbar
																	isCollapsed={false}
																	value={thAlign}
																	onChange={(value) => setAttributes({ thAlign: value })}
																/>
															);
														} else {
															tabout = (
																<AlignmentToolbar
																	isCollapsed={false}
																	value={hAlign}
																	onChange={(value) => setAttributes({ hAlign: value })}
																/>
															);
														}
													}
													return <div>{tabout}</div>;
												}
											}
										</TabPanel>
									</PanelBody>
								)}
								{renderArray}
								{this.showSettings('fontSettings') && (
									<PanelBody
										title={__('Font Family', 'amp-blocks')}
										initialOpen={false}
										className="amp-font-family-area"
									>
										<TypographyControls
											letterSpacing={letterSpacing}
											onLetterSpacing={(value) => setAttributes({ letterSpacing: value })}
											textTransform={textTransform}
											onTextTransform={(value) => setAttributes({ textTransform: value })}
											fontFamily={typography}
											onFontFamily={(value) => setAttributes({ typography: value })}
											onFontChange={(select) => {
												setAttributes({
													typography: select.value,
													googleFont: select.google,
												});
											}}
											googleFont={googleFont}
											onGoogleFont={(value) => setAttributes({ googleFont: value })}
											loadGoogleFont={loadGoogleFont}
											onLoadGoogleFont={(value) => setAttributes({ loadGoogleFont: value })}
											fontVariant={fontVariant}
											onFontVariant={(value) => setAttributes({ fontVariant: value })}
											fontWeight={fontWeight}
											onFontWeight={(value) => setAttributes({ fontWeight: value })}
											fontStyle={fontStyle}
											onFontStyle={(value) => setAttributes({ fontStyle: value })}
											fontSubset={fontSubset}
											onFontSubset={(value) => setAttributes({ fontSubset: value })}
										/>
									</PanelBody>
								)}
							</InspectorControls>
							<InspectorAdvancedControls>
								<ToggleControl
									label={__('Force Button Fullwidth', 'amp-blocks')}
									checked={(undefined !== forceFullwidth ? forceFullwidth : false)}
									onChange={(value) => defineWidthTypeToggle(value)}
								/>
							</InspectorAdvancedControls>
						</Fragment>
					)}
					<div id={`animate-id${uniqueID}`} className={'btn-inner-wrap aos-animate amp-animation-wrap'} data-aos={(ampAnimation ? ampAnimation : undefined)} data-aos-duration={(ampAOSOptions && ampAOSOptions[0] && ampAOSOptions[0].duration ? ampAOSOptions[0].duration : undefined)} data-aos-easing={(ampAOSOptions && ampAOSOptions[0] && ampAOSOptions[0].easing ? ampAOSOptions[0].easing : undefined)} >
						{renderPreviewArray}
						{googleFont && (
							<WebfontLoader config={config}>
							</WebfontLoader>
						)}
					</div>
				</div>
			</Fragment>
		);
	}
}
export default (ampAdvancedButton);
