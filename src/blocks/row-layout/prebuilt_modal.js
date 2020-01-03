const {
	Component,
	Fragment,
} = wp.element;
const {
	Button,
	Modal,
	IconButton,
	TabPanel,
} = wp.components;
import Library from './library';
/**
 * Import Icons
 */
import icons from '../../brand-icon';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;

class CustomComponent extends Component {

	constructor() {
		super( ...arguments );
		this.state = {
			modalOpen: this.props.modalOpen,
		};
	}

	componentDidUpdate() {
		if (typeof this.props.modalOpen !== 'undefined') {
			wp.element.unmountComponentAtNode( document.getElementById( 'prebuilt_modal_top_button' ) );
		}
	}






	render() {
		return (
			<Fragment>
				<Button className="amp-prebuilt"
						onClick={ () => this.setState( { modalOpen: true } ) }>{ __( 'Prebuilt Library' ) }</Button>
				{ this.state.modalOpen ?
					<Modal
						className="amp-prebuilt-modal"
						title={ __( 'Prebuilt Library' ) }
						onRequestClose={ () => this.setState( { modalOpen: false } ) }>
						<div className="amp-pre-prebuilt-section">
							<div className="amp-pre-prebuilt-header">
								<span className="amp-pre-prebuilt-header-logo">{ icons.amp }</span>
								<h2>{ __( 'Library', 'Amp Blocks' ) }</h2>
							</div>
							<IconButton
								className="amp-pre-prebuilt-header-close"
								label={ __( 'Close Dialog' ) }
								icon="no-alt"
								onClick={ () => {
									this.setState( { modalOpen: false } );
								} }
							/>
							<TabPanel className="amp-inspect-tabs amp-pre-prebuilt-tabs"
									  activeClass="active-tab"
									  tabs={ [
										  {
											  name: 'sections',
											  title: __( 'Sections', 'amp-blocks' ),
											  className: 'amp-pre-sections-tab',
										  },
									  ] }>
								{
									( tab ) => {
										let tabout;
										if (tab.name) {

											tabout = (
												<Library
													clientId={ this.props.clientId }
												/>
											);
										}
										return <div>{ tabout }</div>;
									}
								}
							</TabPanel>
						</div>
					</Modal>
					: null }
			</Fragment>
		);
	}
}

export default CustomComponent;
