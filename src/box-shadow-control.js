/**
 * BoxShadow Component
 *
 */

/**
 * Import Externals
 */
import AdvancedColorControl from './advanced-color-control';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const {
	Component,
} = wp.element;
const {
	ToggleControl,
} = wp.components;

/**
 * Build the BoxShadow controls
 * @returns {object} BoxShadow settings.
 */
class BoxShadowControl extends Component {
	constructor( label, enable = true, color, colorDefault, opacity, spread, blur, hOffset, vOffset, inset, onColorChange, onOpacityChange, onSpreadChange, onBlurChange, onHOffsetChange, onVOffsetChange, onInsetChange, onEnableChange ) {
		super( ...arguments );
	}

	render() {
		return (
			<div className="amp-box-shadow-container">
				{ this.props.label && (
					<div className="amp-box-shadow-label">
						<h2 className="amp-beside-color-label">{ this.props.label }</h2>
						{ this.props.onEnableChange && (
							<ToggleControl
								checked={ this.props.enable }
								onChange={ value => this.props.onEnableChange( value ) }
							/>
						) }
					</div>
				) }
				{ this.props.enable && (
					<div className="amp-inner-sub-section">
						<div className="amp-inner-sub-section-row">
							<div className="amp-box-color-settings amp-box-shadow-subset">
								<p className="amp-box-shadow-title">{ __( 'Color' ) }</p>
								<AdvancedColorControl
									colorValue={ ( this.props.color ? this.props.color : this.props.colorDefault ) }
									colorDefault={ this.props.colorDefault }
									onColorChange={ value => this.props.onColorChange( value ) }
									opacityValue={ this.props.opacity }
									onOpacityChange={ value => this.props.onOpacityChange( value ) }
								/>
							</div>
							<div className="amp-box-x-settings amp-box-shadow-subset">
								<p className="amp-box-shadow-title">{ __( 'X' ) }</p>
								<div className="components-base-control amp-boxshadow-number-input">
									<div className="components-base-control__field">
										<input
											value={ ( undefined !== this.props.hOffset ? this.props.hOffset : '' ) }
											onChange={ event => this.props.onHOffsetChange( Number( event.target.value ) ) }
											min={ -200 }
											max={ 200 }
											step={ 1 }
											type="number"
											className="components-text-control__input"
										/>
									</div>
								</div>
							</div>
							<div className="amp-box-y-settings amp-box-shadow-subset">
								<p className="amp-box-shadow-title">{ __( 'Y' ) }</p>
								<div className="components-base-control amp-boxshadow-number-input">
									<div className="components-base-control__field">
										<input
											value={ ( undefined !== this.props.vOffset ? this.props.vOffset : '' ) }
											onChange={ event => this.props.onVOffsetChange( Number( event.target.value ) ) }
											min={ -200 }
											max={ 200 }
											step={ 1 }
											type="number"
											className="components-text-control__input"
										/>
									</div>
								</div>
							</div>
							<div className="amp-box-blur-settings amp-box-shadow-subset">
								<p className="amp-box-shadow-title">{ __( 'Blur' ) }</p>
								<div className="components-base-control amp-boxshadow-number-input">
									<div className="components-base-control__field">
										<input
											value={ ( undefined !== this.props.blur ? this.props.blur : '' ) }
											onChange={ event => this.props.onBlurChange( Number( event.target.value ) ) }
											min={ 0 }
											max={ 200 }
											step={ 1 }
											type="number"
											className="components-text-control__input"
										/>
									</div>
								</div>
							</div>
							<div className="amp-box-spread-settings amp-box-shadow-subset">
								<p className="amp-box-shadow-title">{ __( 'Spread' ) }</p>
								<div className="components-base-control amp-boxshadow-number-input">
									<div className="components-base-control__field">
										<input
											value={ ( undefined !== this.props.spread ? this.props.spread : '' ) }
											onChange={ event => this.props.onSpreadChange( Number( event.target.value ) ) }
											min={ -200 }
											max={ 200 }
											step={ 1 }
											type="number"
											className="components-text-control__input"
										/>
									</div>
								</div>
							</div>
						</div>
						{ this.props.onInsetChange && (
							<div className="amp-box-inset-settings">
								<ToggleControl
									label={ __( 'Inset' ) }
									checked={ this.props.inset }
									onChange={ value => this.props.onInsetChange( value ) }
								/>
							</div>
						) }
					</div>
				) }
			</div>
		);
	}
}

export default ( BoxShadowControl );
