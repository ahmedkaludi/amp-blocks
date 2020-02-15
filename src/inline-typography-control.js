/**
 * Typography Component
 *
 */

/**
 * Import Icons
 */
import icons from './icons';
/**
 * Import External
 */
import gFonts from './gfonts';
import fonts from './fonts';
import capitalizeFirstLetter from './capitalfirst';
import Select from 'react-select';
import map from 'lodash/map';

const {
	applyFilters,
} = wp.hooks;

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const {
	Component,
	Fragment,
} = wp.element;
const {
	Button,
	ButtonGroup,
	IconButton,
	Dashicon,
	Tooltip,
	Dropdown,
	ToggleControl,
	SelectControl,
} = wp.components;

/**
 * Build the typography controls
 * @returns {object} typography settings.
 */
class InlineTypographyControl extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			controlSize: 'desk',
			typographyOptions: [],
			typographySelectOptions: [],
			typographyWeights: [],
			typographyStyles: [],
			typographySubsets: '',
		};
	}
	componentDidMount() {
		const fontsarray = fonts.map( ( name ) => {
			return { label: name, value: name, google: true };
		} );
		const options = [
			{
				type: 'group',
				label: 'Standard Fonts',
				options: [
					{ label: 'Arial, Helvetica, sans-serif', value: 'Arial, Helvetica, sans-serif', google: false },
					{ label: '"Arial Black", Gadget, sans-serif', value: '"Arial Black", Gadget, sans-serif', google: false },
					{ label: '"Comic Sans MS", cursive, sans-serif', value: '"Comic Sans MS", cursive, sans-serif', google: false },
					{ label: 'Impact, Charcoal, sans-serif', value: 'Impact, Charcoal, sans-serif', google: false },
					{ label: '"Lucida Sans Unicode", "Lucida Grande", sans-serif', value: '"Lucida Sans Unicode", "Lucida Grande", sans-serif', google: false },
					{ label: 'Tahoma, Geneva, sans-serif', value: 'Tahoma, Geneva, sans-serif', google: false },
					{ label: '"Trebuchet MS", Helvetica, sans-serif', value: '"Trebuchet MS", Helvetica, sans-serif', google: false },
					{ label: 'Verdana, Geneva, sans-serif', value: 'Verdana, Geneva, sans-serif', google: false },
					{ label: 'Georgia, serif', value: 'Georgia, serif', google: false },
					{ label: '"Palatino Linotype", "Book Antiqua", Palatino, serif', value: '"Palatino Linotype", "Book Antiqua", Palatino, serif', google: false },
					{ label: '"Times New Roman", Times, serif', value: '"Times New Roman", Times, serif', google: false },
					{ label: 'Courier, monospace', value: 'Courier, monospace', google: false },
					{ label: '"Lucida Console", Monaco, monospace', value: '"Lucida Console", Monaco, monospace', google: false },
				],
			},
			{
				type: 'group',
				label: 'Google Fonts',
				options: fontsarray,
			},
		];
		let typographyOptions = applyFilters( 'amp.typography_options', options );
		let typographySelectOptions = [].concat.apply( [], typographyOptions.map( option => option.options ) );
		const blockConfigObject = ( amp_blocks_params.configuration ? JSON.parse( amp_blocks_params.configuration ) : [] );
		if ( blockConfigObject[ 'amp/typography' ] !== undefined && typeof blockConfigObject[ 'amp/typography' ] === 'object' ) {
			if ( blockConfigObject[ 'amp/typography' ].showAll !== undefined && ! blockConfigObject[ 'amp/typography' ].showAll ) {
				typographyOptions = blockConfigObject[ 'amp/typography' ].choiceArray;
				typographySelectOptions = blockConfigObject[ 'amp/typography' ].choiceArray;
			}
		}
		this.setState( { typographyOptions: typographyOptions } );
		this.setState( { typographySelectOptions: typographySelectOptions } );
		this.setTypographyOptions( typographySelectOptions );
	}
	componentDidUpdate( prevProps ) {
		if ( this.props.fontFamily !== prevProps.fontFamily ) {
			this.setTypographyOptions( this.state.typographySelectOptions );
		}
	}
	setTypographyOptions( typographySelectOptions ) {
		const standardWeights = [
			{ value: 'regular', label: 'Normal' },
			{ value: 'bold', label: 'Bold' },
		];
		const standardStyles = [
			{ value: 'normal', label: 'Normal' },
			{ value: 'italic', label: 'Italic' },
		];
		const activeFont = ( typographySelectOptions ? typographySelectOptions.filter( ( { value } ) => value === this.props.fontFamily ) : '' );
		const fontStandardWeights = ( '' !== activeFont && undefined !== activeFont[ 0 ] && undefined !== activeFont[ 0 ].weights ?activeFont[ 0 ].weights : standardWeights );
		const fontStandardStyles = ( '' !== activeFont && undefined !== activeFont[ 0 ] && undefined !== activeFont[ 0 ].styles ? activeFont[ 0 ].styles : standardStyles );
		const typographyWeights = ( this.props.googleFont && this.props.fontFamily ? gFonts[ this.props.fontFamily ].w.map( opt => ( { label: capitalizeFirstLetter( opt ), value: opt } ) ) : fontStandardWeights );
		const typographyStyles = ( this.props.googleFont && this.props.fontFamily ? gFonts[ this.props.fontFamily ].i.map( opt => ( { label: capitalizeFirstLetter( opt ), value: opt } ) ) : fontStandardStyles );
		const typographySubsets = ( this.props.googleFont && this.props.fontFamily ? gFonts[ this.props.fontFamily ].s.map( opt => ( { label: capitalizeFirstLetter( opt ), value: opt } ) ) : '' );
		this.setState( { typographyWeights: typographyWeights } );
		this.setState( { typographyStyles: typographyStyles } );
		this.setState( { typographySubsets: typographySubsets } );
		this.setState( { fontFamilyValue: activeFont } );
	}
	render() {
		const { uniqueID, lineHeight, lineHeightType, fontSize, fontSizeType, googleFont, loadGoogleFont, fontFamily, fontVariant, fontWeight, fontStyle, fontSubset, letterSpacing, onLineHeight, onFontSize, onFontFamily, onFontVariant, onFontWeight, onFontStyle, onFontSubset, onFontChange, onFontArrayChange, onLoadGoogleFont, onGoogleFont, onLetterSpacing, onFontSizeType, onLineHeightType, textTransform, onTextTransform, fontSizeArray, tabSize, tabLineHeight, onTabLineHeight, onTabSize, mobileSize, mobileLineHeight, onMobileLineHeight, onMobileSize } = this.props;
		const { controlSize, typographySelectOptions, typographyOptions, typographySubsets, typographyStyles, typographyWeights, fontFamilyValue } = this.state;
		const onControlSize = ( size ) => {
			this.setState( { controlSize: size } );
		};
		const deviceControlTypes = [
			{ key: 'desk', name: __( 'Desktop' ), icon: <Dashicon icon="desktop" /> },
			{ key: 'tablet', name: __( 'Tablet' ), icon: <Dashicon icon="tablet" /> },
			{ key: 'mobile', name: __( 'Mobile' ), icon: <Dashicon icon="smartphone" /> },
		];
		const onFontSizeInput = ( event ) => {
			const newValue = Number( event.target.value );
			if ( newValue === '' ) {
				onFontSize( undefined );
				return;
			}
			if ( newValue > fontMax ) {
				onFontSize( fontMax );
			} else if ( newValue < -0.1 ) {
				onFontSize( fontMin );
			} else {
				onFontSize( newValue );
			}
		};
		const onTabFontSizeInput = ( event ) => {
			const newValue = Number( event.target.value );
			if ( newValue === '' ) {
				onTabSize( undefined );
				return;
			}
			if ( newValue > fontMax ) {
				onTabSize( fontMax );
			} else if ( newValue < -0.1 ) {
				onTabSize( fontMin );
			} else {
				onTabSize( newValue );
			}
		};
		const onMobileFontSizeInput = ( event ) => {
			const newValue = Number( event.target.value );
			if ( newValue === '' ) {
				onMobileSize( undefined );
				return;
			}
			if ( newValue > fontMax ) {
				onMobileSize( fontMax );
			} else if ( newValue < -0.1 ) {
				onMobileSize( fontMin );
			} else {
				onMobileSize( newValue );
			}
		};
		const onLineHeightInput = ( event ) => {
			const newValue = Number( event.target.value );
			if ( newValue === '' ) {
				onLineHeight( undefined );
				return;
			}
			if ( newValue > lineMax ) {
				onLineHeight( lineMax );
			} else if ( newValue < -0.1 ) {
				onLineHeight( lineMin );
			} else {
				onLineHeight( newValue );
			}
		};
		const onTabLineHeightInput = ( event ) => {
			const newValue = Number( event.target.value );
			if ( newValue === '' ) {
				onTabLineHeight( undefined );
				return;
			}
			if ( newValue > lineMax ) {
				onTabLineHeight( lineMax );
			} else if ( newValue < -0.1 ) {
				onTabLineHeight( lineMin );
			} else {
				onTabLineHeight( newValue );
			}
		};
		const onMobileLineHeightInput = ( event ) => {
			const newValue = Number( event.target.value );
			if ( newValue === '' ) {
				onMobileLineHeight( undefined );
				return;
			}
			if ( newValue > lineMax ) {
				onMobileLineHeight( lineMax );
			} else if ( newValue < -0.1 ) {
				onMobileLineHeight( lineMin );
			} else {
				onMobileLineHeight( newValue );
			}
		};
		const onLetterSpacingInput = ( event ) => {
			const newValue = Number( event.target.value );
			if ( newValue === '' ) {
				onLetterSpacing( undefined );
				return;
			}
			if ( newValue > 15 ) {
				onLetterSpacing( 15 );
			} else if ( newValue < -5 ) {
				onLetterSpacing( -5 );
			} else {
				onLetterSpacing( newValue );
			}
		};
		const onTypoFontChange = ( selected ) => {
			if ( selected === null ) {
				onTypoFontClear();
			} else {
				let variant;
				let weight;
				let subset;
				if ( selected.google ) {
					if ( ! gFonts[ selected.value ].v.includes( 'regular' ) ) {
						variant = gFonts[ selected.value ].v[ 0 ];
					} else {
						variant = 'regular';
					}
					if ( ! gFonts[ selected.value ].w.includes( 'regular' ) ) {
						weight = gFonts[ selected.value ].w[ 0 ];
					} else {
						weight = '400';
					}
					if ( gFonts[ selected.value ].s.length > 1 ) {
						subset = 'latin';
					} else {
						subset = '';
					}
				} else {
					subset = '';
					variant = '';
					weight = '400';
				}
				if ( onFontArrayChange ) {
					onFontArrayChange( { google: selected.google, family: selected.value, variant: variant, weight: weight, style: 'normal', subset: subset } );
				} else {
					onFontChange( selected );
					onFontVariant( variant );
					onFontWeight( weight );
					onFontStyle( 'normal' );
					onFontSubset( subset );
				}
			}
		};
		const onTypoFontClear = () => {
			if ( onFontArrayChange ) {
				onFontArrayChange( { google: false, family: '', variant: '', weight: 'regular', style: 'normal', subset: '' } );
			} else {
				onGoogleFont( false );
				onFontFamily( '' );
				onFontVariant( '' );
				onFontWeight( 'regular' );
				onFontStyle( 'normal' );
				onFontSubset( '' );
			}
		};
		const onTypoFontWeightChange = ( selected ) => {
			if ( googleFont ) {
				let variant;
				if ( 'italic' === fontStyle ) {
					if ( 'regular' === selected ) {
						variant = 'italic';
					} else {
						variant = selected + 'italic';
					}
				} else {
					variant = selected;
				}
				if ( onFontArrayChange ) {
					onFontArrayChange( { variant: variant, weight: ( 'regular' === selected ? '400' : selected ) } );
				} else {
					onFontVariant( variant );
					onFontWeight( ( 'regular' === selected ? '400' : selected ) );
				}
			} else if ( onFontArrayChange ) {
				onFontArrayChange( { variant: '', weight: ( 'regular' === selected ? '400' : selected ) } );
			} else {
				onFontVariant( '' );
				onFontWeight( ( 'regular' === selected ? '400' : selected ) );
			}
		};
		const onTypoFontStyleChange = ( selected ) => {
			if ( googleFont ) {
				let variant;
				if ( 'italic' === selected ) {
					if ( ! fontWeight || 'regular' === fontWeight ) {
						variant = 'italic';
					} else {
						variant = fontWeight + 'italic';
					}
				} else {
					variant = ( fontWeight ? fontWeight : 'regular' );
				}
				if ( onFontArrayChange ) {
					onFontArrayChange( { variant: variant, style: selected } );
				} else {
					onFontVariant( variant );
					onFontStyle( selected );
				}
			} else if ( onFontArrayChange ) {
				onFontArrayChange( { variant: '', style: selected } );
			} else {
				onFontVariant( '' );
				onFontStyle( selected );
			}
		};
		const textTransformOptions = [
			{ value: 'none', label: 'None' },
			{ value: 'capitalize', label: 'Capitalize' },
			{ value: 'uppercase', label: 'Uppercase' },
			{ value: 'lowercase', label: 'Lowercase' },
		];
		const fontMin = ( fontSizeType === 'em' ? 0.2 : 5 );
		const fontMax = ( fontSizeType === 'em' ? 12 : 200 );
		const fontStep = ( fontSizeType === 'em' ? 0.1 : 1 );
		const lineMin = ( lineHeightType === 'em' ? 0.2 : 5 );
		const lineMax = ( lineHeightType === 'em' ? 12 : 200 );
		const lineStep = ( lineHeightType === 'em' ? 0.1 : 1 );
		return (
			<Fragment>
				<Dropdown
					className="amp-popover-font-family-container components-dropdown-menu components-toolbar"
					contentClassName="amp-popover-font-family"
					position="top center"
					renderToggle={ ( { isOpen, onToggle } ) => (
						<Fragment>
							<IconButton className="components-dropdown-menu__toggle amp-font-family-icon" label={ __( 'Typography Settings' ) } tooltip={ __( 'Typography Settings' ) } icon={ icons.fontfamily } onClick={ onToggle } aria-expanded={ isOpen }>
								<span className="components-dropdown-menu__indicator" />
							</IconButton>
						</Fragment>
					) }
					renderContent={ () => (
						<Fragment>
							{ onFontFamily && (
								<Fragment>
									<h2 className="amp-heading-fontfamily-title">{ __( 'Font Family' ) }</h2>
									<div className="typography-family-select-form-row block-editor-block-toolbar">
										<Select
											options={ typographyOptions }
											className="amp-inline-typography-select"
											classNamePrefix="amp-typography"
											value={ fontFamilyValue }
											isMulti={ false }
											isSearchable={ true }
											isClearable={ true }
											maxMenuHeight={ 200 }
											placeholder={ __( 'Default' ) }
											onChange={ onTypoFontChange }
										/>
									</div>
								</Fragment>
							) }
							<div className="typography-row-settings">
								{ onFontWeight && (
									<SelectControl
										label={ __( 'Weight' ) }
										value={ ( '400' === fontWeight ? 'regular' : fontWeight ) }
										options={ typographyWeights }
										onChange={ onTypoFontWeightChange }
									/>
								) }
								{ onTextTransform && (
									<SelectControl
										label={ __( 'Transform' ) }
										value={ textTransform }
										options={ textTransformOptions }
										onChange={ ( value ) => onTextTransform( value ) }
									/>
								) }
								{ fontFamily && onFontStyle && (
									<SelectControl
										label={ __( 'Style' ) }
										value={ fontStyle }
										options={ typographyStyles }
										onChange={ onTypoFontStyleChange }
									/>
								) }
							</div>
							<div className="typography-row-settings">
								{ onLetterSpacing && (
									<div className="amp-type-input-wrap">
										<div className="components-base-control amp-typography-number-input">
											<div className="components-base-control__field">
												<label className="components-base-control__label" htmlFor={ `amp-inline-spacing${ uniqueID }` }>{ __( 'Spacing' ) }</label>
												<input
													id={ `amp-inline-spacing${ uniqueID }` }
													value={ ( undefined !== letterSpacing ? letterSpacing : '' ) }
													onChange={ onLetterSpacingInput }
													min={ -5 }
													max={ 15 }
													step={ 0.1 }
													type="number"
													className="components-text-control__input"
												/>
											</div>
										</div>
										<span className="amp-unit">{ __( 'px' ) }</span>
									</div>
								) }
								{ fontFamily && googleFont && onFontSubset && (
									<SelectControl
										label={ __( 'Subset' ) }
										value={ fontSubset }
										options={ typographySubsets }
										onChange={ ( value ) => onFontSubset( value ) }
									/>
								) }
								{ fontFamily && googleFont && onLoadGoogleFont && (
									<ToggleControl
										label={ __( 'Load Font' ) }
										checked={ loadGoogleFont }
										onChange={ onLoadGoogleFont }
									/>
								) }
							</div>
							<div className="typography-row-settings typography-size-row-settings">
								{ onFontSize && onFontSizeType && ! fontSizeArray && (
									<div className="amp-size-input-wrap">
										<div className="amp-size-tite-device-wrap">
											<p className="amp-inline-size-title">{ __( 'Size' ) }</p>
											<ButtonGroup className="amp-typography-size-type-options" aria-label={ __( 'Device Size Control Switch' ) }>
												{ map( deviceControlTypes, ( { name, key, icon } ) => (
													<Tooltip text={ name }>
														<Button
															key={ key }
															className="amp-size-btn"
															isSmall
															isPrimary={ controlSize === key }
															aria-pressed={ controlSize === key }
															onClick={ () => onControlSize( key ) }
														>
															{ icon }
														</Button>
													</Tooltip>
												) ) }
											</ButtonGroup>
										</div>
										{ onFontSize && (
											<div className="amp-type-size-input-wrap">
												{ 'mobile' === controlSize && (
													<div className="components-base-control amp-typography-number-input">
														<div className="components-base-control__field">
															<input
																value={ ( mobileSize ? mobileSize : '' ) }
																onChange={ onMobileFontSizeInput }
																min={ fontMin }
																max={ fontMax }
																step={ fontStep }
																type="number"
																className="components-text-control__input"
															/>
														</div>
													</div>
												) }
												{ 'tablet' === controlSize && (
													<div className="components-base-control amp-typography-number-input">
														<div className="components-base-control__field">
															<input
																value={ ( tabSize ? tabSize : '' ) }
																onChange={ onTabFontSizeInput }
																min={ fontMin }
																max={ fontMax }
																step={ fontStep }
																type="number"
																className="components-text-control__input"
															/>
														</div>
													</div>
												) }
												{ 'desk' === controlSize && (
													<div className="components-base-control amp-typography-number-input">
														<div className="components-base-control__field">
															<input
																value={ ( fontSize ? fontSize : '' ) }
																onChange={ onFontSizeInput }
																min={ fontMin }
																max={ fontMax }
																step={ fontStep }
																type="number"
																className="components-text-control__input"
															/>
														</div>
													</div>
												) }
												<SelectControl
													value={ fontSizeType }
													className="amp-typography-size-type"
													options={ [
														{ value: 'px', label: __( 'px' ) },
														{ value: 'em', label: __( 'em' ) },
													] }
													onChange={ ( value ) => onFontSizeType( value ) }
												/>
											</div>
										) }
									</div>
								) }
								{ onLineHeight && onLineHeightType && ! fontSizeArray && (
									<div className="amp-size-input-wrap">
										<div className="amp-size-tite-device-wrap">
											<p className="amp-inline-size-title">{ __( 'Height' ) }</p>
											<ButtonGroup className="amp-typography-size-type-options" aria-label={ __( 'Device Size Control Switch' ) }>
												{ map( deviceControlTypes, ( { name, key, icon } ) => (
													<Tooltip text={ name }>
														<Button
															key={ key }
															className="amp-size-btn"
															isSmall
															isPrimary={ controlSize === key }
															aria-pressed={ controlSize === key }
															onClick={ () => onControlSize( key ) }
														>
															{ icon }
														</Button>
													</Tooltip>
												) ) }
											</ButtonGroup>
										</div>
										{ onLineHeight && (
											<div className="amp-type-size-input-wrap">
												{ 'mobile' === controlSize && (
													<div className="components-base-control amp-typography-number-input">
														<div className="components-base-control__field">
															<input
																value={ ( mobileLineHeight ? mobileLineHeight : '' ) }
																onChange={ onMobileLineHeightInput }
																min={ lineMin }
																max={ lineMax }
																step={ lineStep }
																type="number"
																className="components-text-control__input"
															/>
														</div>
													</div>
												) }
												{ 'tablet' === controlSize && (
													<div className="components-base-control amp-typography-number-input">
														<div className="components-base-control__field">
															<input
																value={ ( tabLineHeight ? tabLineHeight : '' ) }
																onChange={ onTabLineHeightInput }
																min={ lineMin }
																max={ lineMax }
																step={ lineStep }
																type="number"
																className="components-text-control__input"
															/>
														</div>
													</div>
												) }
												{ 'desk' === controlSize && (
													<div className="components-base-control amp-typography-number-input">
														<div className="components-base-control__field">
															<input
																value={ ( lineHeight ? lineHeight : '' ) }
																onChange={ onLineHeightInput }
																min={ lineMin }
																max={ lineMax }
																step={ lineStep }
																type="number"
																className="components-text-control__input"
															/>
														</div>
													</div>
												) }
												<SelectControl
													value={ lineHeightType }
													className="amp-typography-size-type"
													options={ [
														{ value: 'px', label: __( 'px' ) },
														{ value: 'em', label: __( 'em' ) },
													] }
													onChange={ ( value ) => onLineHeightType( value ) }
												/>
											</div>
										) }
									</div>
								) }
							</div>
						</Fragment>
					) }
				/>
			</Fragment>
		);
	}
}
export default ( InlineTypographyControl );
