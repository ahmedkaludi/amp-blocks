const { withSelect, withDispatch } = wp.data;
const {
	rawHandler,
	parse,
} = wp.blocks;
const {
	Component,
	Fragment,
} = wp.element;
const {
	Button,
	ButtonGroup,
	Tooltip,
	TextControl,
	SelectControl,
	ExternalLink,
} = wp.components;
const {
	applyFilters,
} = wp.hooks;
const { compose } = wp.compose;
import LazyLoad from 'react-lazy-load';

const axios = require( 'axios' );
let blockdata = '';
axios.get( 'https://raw.githubusercontent.com/jasthilokesh/sampletest/master/root.json' )
	.then( response => {
		blockdata = response.data;
	} );

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;

class CustomComponent extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			category: 'all',
		};
	}

	onInsertContent( blockcode ) {
		const { insertBlocks, removeBlock, rowClientId, clientId } = this.props;
		axios.get( blockcode )
			.then( response => {
				if (typeof clientId === 'undefined') {
					let pageData = parse( response.data.content );
					insertBlocks( pageData );
					wp.element.unmountComponentAtNode( document.getElementById( 'prebuilt_modal_top_button' ) );
				} else {
					this.props.import( response.data.content );
				}
			} );

	}

	capitalizeFirstLetter( string ) {
		return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
	}

	_onErrorImg( ev ) {
		ev.target.src = 'https://birkeland.uib.no/wp-content/themes/bcss/images/no.png';
	}

	render() {
		let blockOutput = blockdata.category;
		const cats = [ 'all' ];
		Object.keys( blockdata.category ).forEach( function( key ) {
			cats.push( key );
		} );

		const catOptions = cats.map( ( item ) => {
			return { value: item, label: this.capitalizeFirstLetter( item ) };
		} );
		const self = this;
		let cat_content_array = [];
		{
			Object.keys( blockOutput ).map( function( category, value ) {

				if (Array.isArray( blockOutput[category] )) {
					{
						blockOutput[category].map( function( key2 ) {
							if (( 'all' === self.state.category || category.includes( self.state.category ) )) {

								cat_content_array.push( { 'category': category, 'child': key2 } );
							}

						} );
					}

				}
			} );
		}

		return (

			<Fragment>
				<div className="amp-prebuilt-header">
					<SelectControl
						label={ __( 'Category' ) }
						value={ this.state.category }
						options={ catOptions }
						onChange={ value => this.setState( { category: value } ) }
					/>

				</div>
				<ButtonGroup aria-label={ __( 'Prebuilt Options' ) }>

					{ cat_content_array.map( function( key2 ) {
						const rootpath = blockdata.rootpath + key2['category'] + '/' + key2['child'];
						let imagepath = rootpath + '/screenshot.png';
						let json_content_path = rootpath + '/file.json';
						return (
							<div className="amp-prebuilt-item" data-background-style={ 'light' }>
								<Tooltip text={ key2['category'] }>
									<Button
										className="amp-import-btn"
										isSmall
										onClick={ () => self.onInsertContent( json_content_path ) }
									>
										<LazyLoad>
											<img
												src={ imagepath }
												alt={ key2['child'] } onError={ self._onErrorImg }/>
										</LazyLoad>
									</Button>
								</Tooltip>
							</div>
						);
					} ) }


				</ButtonGroup>
			</Fragment>
		);
	}
}

export default compose(
	withSelect( ( select, { clientId } ) => {
		const { getBlock } = select( 'core/block-editor' );
		const { canUserUseUnfilteredHTML } = select( 'core/editor' );
		const block = getBlock( clientId );
		return {
			block,
			canUserUseUnfilteredHTML: canUserUseUnfilteredHTML(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const {
			insertBlocks,
			removeBlock,
		} = dispatch( 'core/block-editor' );

		return {
			insertBlocks,
			removeBlock,
		};
	} ),
	withDispatch( ( dispatch, { block, canUserUseUnfilteredHTML } ) => ( {
			import: ( blockcode ) => {
				dispatch( 'core/block-editor' ).replaceBlocks(
					block.clientId,
					rawHandler( {
						HTML: blockcode,
						mode: 'BLOCKS',
						canUserUseUnfilteredHTML,
					} ),
				);
			},
		} ),
	),
)( CustomComponent );
