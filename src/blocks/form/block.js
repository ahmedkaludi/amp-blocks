/**
 * BLOCK: Kadence Form Block
 *
 * Registering a basic block with Gutenberg.
 */

import classnames from 'classnames';
/**
 * Import Icons
 */
import icons from '../../icons';
import times from 'lodash/times';
/**
 * Import edit
 */
import edit from './edit';

/**
 * Import Css
 */
import './style.scss';
import './editor.scss';
const {
	Fragment,
} = wp.element;
const {
	RichText,
} = wp.blockEditor;
/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

/**
 * Register: a Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'ampblocks/form', {
	title: __( 'Form', 'amp-blocks' ),
	icon: {
		src: icons.formBlock,
	},
	category: 'amp-blocks',
	keywords: [
		__( 'Contact', 'amp-blocks' ),
		__( 'form', 'amp-blocks' )
	],
	supports: {
		anchor: true,
		align: [ 'wide', 'full' ],
		ktanimate: true,
		ktanimateadd: true,
		ktanimatepreview: true,
		ktanimateswipe: true,
	},
	attributes: {
		uniqueID: {
			type: 'string',
			default: '',
		},
		postID: {
			type: 'number',
			default: '',
		},
		hAlign: {
			type: 'string',
			default: '',
		},
		fields: {
			type: 'array',
			default: [ {
				label: 'Name',
				showLabel: true,
				placeholder: '',
				default: '',
				description: '',
				rows: 4,
				options: [ {
					value: '',
					label: '',
				} ],
				multiSelect: false,
				inline: false,
				showLink: false,
				min: '',
				max: '',
				type: 'text', // text, email, textarea, url, tel, radio, select, check, accept
				required: false,
				width: [ '100', '', '' ],
				auto: '',
			},
			{
				label: 'Email',
				showLabel: true,
				placeholder: '',
				default: '',
				description: '',
				rows: 4,
				options: [ {
					value: '',
					label: '',
				} ],
				multiSelect: false,
				inline: false,
				showLink: false,
				min: '',
				max: '',
				type: 'email', // text, email, textarea, url, tel, radio, select, check, accept
				required: true,
				width: [ '100', '', '' ],
				auto: '',
			},
			{
				label: 'Message',
				showLabel: true,
				placeholder: '',
				default: '',
				description: '',
				rows: 4,
				options: [ {
					value: '',
					label: '',
				} ],
				multiSelect: false,
				inline: false,
				showLink: false,
				min: '',
				max: '',
				type: 'textarea', // text, email, textarea, url, tel, radio, select, check, accept
				required: true,
				width: [ '100', '', '' ],
				auto: '',
			} ],
		},
		messages: {
			type: 'array',
			default: [ {
				success: '',
				error: '',
				required: '',
				invalid: '',
			} ],
		},
		messageFont: {
			type: 'array',
			default: [ {
				colorSuccess: '',
				colorError: '',
				borderSuccess: '',
				borderError: '',
				backgroundSuccess: '',
				backgroundSuccessOpacity: 1,
				backgroundError: '',
				backgroundErrorOpacity: 1,
				borderWidth: [ '', '', '', '' ],
				borderRadius: '',
				size: [ '', '', '' ],
				sizeType: 'px',
				lineHeight: [ '', '', '' ],
				lineType: 'px',
				letterSpacing: '',
				textTransform: '',
				family: '',
				google: '',
				style: '',
				weight: '',
				variant: '',
				subset: '',
				loadGoogle: true,
				padding: [ '', '', '', '' ],
				margin: [ '', '', '', '' ],
			} ],
		},
		style: {
			type: 'array',
			default: [ {
				showRequired: true,
				size: 'standard',
				deskPadding: [ '', '', '', '' ],
				tabletPadding: [ '', '', '', '' ],
				mobilePadding: [ '', '', '', '' ],
				color: '',
				requiredColor: '',
				background: '',
				border: '',
				backgroundOpacity: 1,
				borderOpacity: 1,
				borderRadius: '',
				borderWidth: [ '', '', '', '' ],
				colorActive: '',
				backgroundActive: '',
				borderActive: '',
				backgroundActiveOpacity: 1,
				borderActiveOpacity: 1,
				gradient: [ '#999999', 1, 0, 100, 'linear', 180, 'center center' ],
				gradientActive: [ '#777777', 1, 0, 100, 'linear', 180, 'center center' ],
				backgroundType: 'solid',
				backgroundActiveType: 'solid',
				boxShadow: [ false, '#000000', 0.2, 1, 1, 2, 0, false ],
				boxShadowActive: [ false, '#000000', 0.4, 2, 2, 3, 0, false ],
				fontSize: [ '', '', '' ],
				fontSizeType: 'px',
				lineHeight: [ '', '', '' ],
				lineType: 'px',
				rowGap: '',
				rowGapType: 'px',
				gutter: '',
				gutterType: 'px',
			} ],
		},
		labelFont: {
			type: 'array',
			default: [ {
				color: '',
				size: [ '', '', '' ],
				sizeType: 'px',
				lineHeight: [ '', '', '' ],
				lineType: 'px',
				letterSpacing: '',
				textTransform: '',
				family: '',
				google: '',
				style: '',
				weight: '',
				variant: '',
				subset: '',
				loadGoogle: true,
				padding: [ '', '', '', '' ],
				margin: [ '', '', '', '' ],
			} ],
		},
		submit: {
			type: 'array',
			default: [ {
				label: '',
				width: [ '100', '', '' ],
				size: 'standard',
				widthType: 'auto',
				fixedWidth: [ '', '', '' ],
				align: [ '', '', '' ],
				deskPadding: [ '', '', '', '' ],
				tabletPadding: [ '', '', '', '' ],
				mobilePadding: [ '', '', '', '' ],
				color: '',
				background: '',
				border: '',
				backgroundOpacity: 1,
				borderOpacity: 1,
				borderRadius: '',
				borderWidth: [ '', '', '', '' ],
				colorHover: '',
				backgroundHover: '',
				borderHover: '',
				backgroundHoverOpacity: 1,
				borderHoverOpacity: 1,
				icon: '',
				iconSide: 'right',
				iconHover: false,
				cssClass: '',
				gradient: [ '#999999', 1, 0, 100, 'linear', 180, 'center center' ],
				gradientHover: [ '#777777', 1, 0, 100, 'linear', 180, 'center center' ],
				btnStyle: 'basic',
				btnSize: 'standard',
				backgroundType: 'solid',
				backgroundHoverType: 'solid',
				boxShadow: [ false, '#000000', 0.2, 1, 1, 2, 0, false ],
				boxShadowHover: [ false, '#000000', 0.4, 2, 2, 3, 0, false ],
			} ],
		},
		submitFont: {
			type: 'array',
			default: [ {
				size: [ '', '', '' ],
				sizeType: 'px',
				lineHeight: [ '', '', '' ],
				lineType: 'px',
				letterSpacing: '',
				textTransform: '',
				family: '',
				google: '',
				style: '',
				weight: '',
				variant: '',
				subset: '',
				loadGoogle: true,
			} ],
		},
		actions: {
			type: 'array',
			default: [ 'email' ],
		},
		email: {
			type: 'array',
			default: [ {
				emailTo: '',
				subject: '',
				fromEmail: '',
				fromName: '',
				replyTo: 'email_field',
				cc: '',
				bcc: '',
				html: true,
			} ],
		},
		redirect: {
			type: 'string',
			default: '',
		},
		recaptcha: {
			type: 'bool',
			default: false,
		},
		honeyPot: {
			type: 'bool',
			default: true,
		},
	},
	edit,

	save: props => {
		const { attributes: { uniqueID, fields, submit, style, postID, hAlign, recaptcha, honeyPot } } = props;
		const fieldOutput = ( index ) => {
			const fieldClassName = classnames( {
				'amp-blocks-form-field': true,
				[ `ampblocks-form-field-${ index }` ]: index,
				[ `ampblocks-field-desk-width-${ fields[ index ].width[ 0 ] }` ]: fields[ index ].width && fields[ index ].width[ 0 ],
				[ `ampblocks-field-tablet-width-${ fields[ index ].width[ 1 ] }` ]: fields[ index ].width && fields[ index ].width[ 1 ],
				[ `ampblocks-field-mobile-width-${ fields[ index ].width[ 2 ] }` ]: fields[ index ].width && fields[ index ].width[ 2 ],
				[ `ampblocks-input-size-${ style[ 0 ].size }` ]: style[ 0 ].size,
			} );
			let acceptLabel;
			let acceptLabelBefore;
			let acceptLabelAfter;
			if ( fields[ index ].label && fields[ index ].label.includes( '{privacy_policy}' ) ) {
				acceptLabelBefore = fields[ index ].label.split( '{' )[ 0 ];
				acceptLabelAfter = fields[ index ].label.split( '}' )[ 1 ];
				acceptLabel = (
					<Fragment>
						{ acceptLabelBefore }<a href={ ( undefined !== amp_blocks_params .privacy_link && '' !== amp_blocks_params .privacy_link ? amp_blocks_params .privacy_link : '#' ) } target="blank" rel="noopener noreferrer">{ ( undefined !== amp_blocks_params .privacy_title && '' !== amp_blocks_params .privacy_title ? amp_blocks_params .privacy_title : 'Privacy policy' ) }</a>{ acceptLabelAfter }
					</Fragment>
				);
			} else {
				acceptLabel = fields[ index ].label;
			}
			return (
				<div className={ fieldClassName } >
					{ 'accept' === fields[ index ].type && (
						<Fragment>
							{ fields[ index ].showLink && (
								<a href={ ( undefined !== fields[ index ].default && '' !== fields[ index ].default ? fields[ index ].default : '#' ) } target="_blank" rel="noopener noreferrer" className={ 'ampblocks-accept-link' }>{ ( undefined !== fields[ index ].placeholder && '' !== fields[ index ].placeholder ? fields[ index ].placeholder : 'View Privacy Policy' ) }</a>
							) }
							<input type="checkbox" name={ `ampblocks_field_${ index }` } id={ `ampblocks_field_${ uniqueID }_${ index }` } className={ `ampblocks-field ampblocks-checkbox-style ampblocks-${ fields[ index ].type }` } value={ 'accept' } checked={ fields[ index ].inline ? true : false } data-type={ fields[ index ].type } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } />
							<label htmlFor={ `ampblocks_field_${ uniqueID }_${ index }` }>{ ( fields[ index ].label ? acceptLabel : '' ) }{ ( fields[ index ].required && style[ 0 ].showRequired ? <span className="required">*</span> : '' ) }</label>
						</Fragment>
					) }
					{ 'accept' !== fields[ index ].type && (
						<Fragment>
							{ fields[ index ].showLabel && (
								<label htmlFor={ `ampblocks_field_${ uniqueID }_${ index }` }>{ ( fields[ index ].label ? fields[ index ].label : '' ) }{ ( fields[ index ].required && style[ 0 ].showRequired ? <span className="required">*</span> : '' ) }</label>
							) }
							{ 'textarea' === fields[ index ].type && (
								<textarea name={ `ampblocks_field_${ index }` } id={ `ampblocks_field_${ uniqueID }_${ index }` } data-label={ fields[ index ].label } type={ fields[ index ].type } placeholder={ fields[ index ].placeholder } value={ fields[ index ].default } data-type={ fields[ index ].type } className={ `ampblocks-field ampblocks-text-style-field ampblocks-${ fields[ index ].type }-field ampblocks-field-${ index }` } rows={ fields[ index ].rows } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } />
							) }
							{ 'select' === fields[ index ].type && (
								<select name={ ( fields[ index ].multiSelect ? `ampblocks_field_${ index }[]` : `ampblocks_field_${ index }` ) } id={ `ampblocks_field_${ uniqueID }_${ index }` } multiple={ ( fields[ index ].multiSelect ? true : false ) } data-label={ fields[ index ].label } type={ fields[ index ].type } value={ fields[ index ].default } data-type={ fields[ index ].type } className={ `ampblocks-field ampblocks-select-style-field ampblocks-${ fields[ index ].type }-field ampblocks-field-${ index }` } data-required={ ( fields[ index ].required ? 'yes' : undefined ) }>
									{ times( fields[ index ].options.length, n => (
										<option
											key={ n }
											selected={ ( undefined !== fields[ index ].options[ n ].value && fields[ index ].options[ n ].value === fields[ index ].default ? true : false ) }
											value={ ( undefined !== fields[ index ].options[ n ].value ? fields[ index ].options[ n ].value : '' ) }
										>{ ( undefined !== fields[ index ].options[ n ].label ? fields[ index ].options[ n ].label : '' ) }</option>
									) ) }
								</select>
							) }
							{ 'textarea' !== fields[ index ].type && 'select' !== fields[ index ].type && (
								<input name={ `ampblocks_field_${ index }` } id={ `ampblocks_field_${ uniqueID }_${ index }` } data-label={ fields[ index ].label } type={ fields[ index ].type } placeholder={ fields[ index ].placeholder } value={ fields[ index ].default } data-type={ fields[ index ].type } className={ `ampblocks-field ampblocks-text-style-field ampblocks-${ fields[ index ].type }-field ampblocks-field-${ index }` } autoComplete={ ( '' !== fields[ index ].auto ? fields[ index ].auto : undefined ) } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } />
							) }
						</Fragment>
					) }
					{ undefined !== fields[ index ].description && '' !== fields[ index ].description && (
						<span className={ 'ampblocks-field-help' }>{ ( fields[ index ].description ? fields[ index ].description : '' ) }</span>
					) }
				</div>
			);
		};
		const renderFieldOutput = (
			<Fragment>
				{ times( fields.length, n => fieldOutput( n ) ) }
			</Fragment>
		);
		const submitClassName = classnames( {
			'amp-blocks-form-field': true,
			'ampblocks-submit-field': true,
			[ `ampblocks-field-desk-width-${ submit[ 0 ].width[ 0 ] }` ]: submit[ 0 ].width && submit[ 0 ].width[ 0 ],
			[ `ampblocks-field-tablet-width-${ submit[ 0 ].width[ 1 ] }` ]: submit[ 0 ].width && submit[ 0 ].width[ 1 ],
			[ `ampblocks-field-mobile-width-${ submit[ 0 ].width[ 2 ] }` ]: submit[ 0 ].width && submit[ 0 ].width[ 2 ],
		} );
		return (
			<div className={ `kadence-form-${ uniqueID } ampblocks-form-wrap${ ( hAlign ? ' ampblocks-form-align-' + hAlign : '' ) }` }>
				<form className="ampblocks-form ampforwp-form-allow" action="" method="post">
					{ renderFieldOutput }
					<input type="hidden" name="_ampblocks_form_id" value={ uniqueID } />
					<input type="hidden" name="_ampblocks_form_post_id" value={ postID } />
					<input type="hidden" name="action" value="ampblocks_process_ajax_submit" />
					{ recaptcha && (
						<input type="hidden" name="recaptcha_response" className={ `ampblocks_recaptcha_response ampblocks_recaptcha_${ uniqueID }` } />
					) }
					{ honeyPot && (
						<input className="amp-blocks-field verify" type="email" name="_ampblocks_verify_email" autoComplete="off" placeholder="Email" tabIndex="-1" />
					) }
					<div className={ submitClassName }>
						<RichText.Content
							tagName="button"
							value={ ( '' !== submit[ 0 ].label ? submit[ 0 ].label : 'Submit' ) }
							className={ `ampblocks-forms-submit button ampblocks-button-size-${ ( submit[ 0 ].size ? submit[ 0 ].size : 'standard' ) } ampblocks-button-width-${ ( submit[ 0 ].widthType ? submit[ 0 ].widthType : 'auto' ) }` }
						/>
					</div>
				</form>
			</div>
		);
	},
	deprecated: [
		{
			attributes: {
				uniqueID: {
					type: 'string',
					default: '',
				},
				postID: {
					type: 'number',
					default: '',
				},
				hAlign: {
					type: 'string',
					default: '',
				},
				fields: {
					type: 'array',
					default: [ {
						label: 'Name',
						showLabel: true,
						placeholder: '',
						default: '',
						description: '',
						rows: 4,
						options: [ {
							value: '',
							label: '',
						} ],
						multiSelect: false,
						inline: false,
						showLink: false,
						min: '',
						max: '',
						type: 'text', // text, email, textarea, url, tel, radio, select, check, accept
						required: false,
						width: [ '100', '', '' ],
						auto: '',
					},
					{
						label: 'Email',
						showLabel: true,
						placeholder: '',
						default: '',
						description: '',
						rows: 4,
						options: [ {
							value: '',
							label: '',
						} ],
						multiSelect: false,
						inline: false,
						showLink: false,
						min: '',
						max: '',
						type: 'email', // text, email, textarea, url, tel, radio, select, check, accept
						required: true,
						width: [ '100', '', '' ],
						auto: '',
					},
					{
						label: 'Message',
						showLabel: true,
						placeholder: '',
						default: '',
						description: '',
						rows: 4,
						options: [ {
							value: '',
							label: '',
						} ],
						multiSelect: false,
						inline: false,
						showLink: false,
						min: '',
						max: '',
						type: 'textarea', // text, email, textarea, url, tel, radio, select, check, accept
						required: true,
						width: [ '100', '', '' ],
						auto: '',
					} ],
				},
				messages: {
					type: 'array',
					default: [ {
						success: '',
						error: '',
						required: '',
						invalid: '',
					} ],
				},
				messageFont: {
					type: 'array',
					default: [ {
						colorSuccess: '',
						colorError: '',
						borderSuccess: '',
						borderError: '',
						backgroundSuccess: '',
						backgroundSuccessOpacity: 1,
						backgroundError: '',
						backgroundErrorOpacity: 1,
						borderWidth: [ '', '', '', '' ],
						borderRadius: '',
						size: [ '', '', '' ],
						sizeType: 'px',
						lineHeight: [ '', '', '' ],
						lineType: 'px',
						letterSpacing: '',
						textTransform: '',
						family: '',
						google: '',
						style: '',
						weight: '',
						variant: '',
						subset: '',
						loadGoogle: true,
						padding: [ '', '', '', '' ],
						margin: [ '', '', '', '' ],
					} ],
				},
				style: {
					type: 'array',
					default: [ {
						showRequired: true,
						size: 'standard',
						deskPadding: [ '', '', '', '' ],
						tabletPadding: [ '', '', '', '' ],
						mobilePadding: [ '', '', '', '' ],
						color: '',
						requiredColor: '',
						background: '',
						border: '',
						backgroundOpacity: 1,
						borderOpacity: 1,
						borderRadius: '',
						borderWidth: [ '', '', '', '' ],
						colorActive: '',
						backgroundActive: '',
						borderActive: '',
						backgroundActiveOpacity: 1,
						borderActiveOpacity: 1,
						gradient: [ '#999999', 1, 0, 100, 'linear', 180, 'center center' ],
						gradientActive: [ '#777777', 1, 0, 100, 'linear', 180, 'center center' ],
						backgroundType: 'solid',
						backgroundActiveType: 'solid',
						boxShadow: [ false, '#000000', 0.2, 1, 1, 2, 0, false ],
						boxShadowActive: [ false, '#000000', 0.4, 2, 2, 3, 0, false ],
						fontSize: [ '', '', '' ],
						fontSizeType: 'px',
						lineHeight: [ '', '', '' ],
						lineType: 'px',
						rowGap: '',
						rowGapType: 'px',
						gutter: '',
						gutterType: 'px',
					} ],
				},
				labelFont: {
					type: 'array',
					default: [ {
						color: '',
						size: [ '', '', '' ],
						sizeType: 'px',
						lineHeight: [ '', '', '' ],
						lineType: 'px',
						letterSpacing: '',
						textTransform: '',
						family: '',
						google: '',
						style: '',
						weight: '',
						variant: '',
						subset: '',
						loadGoogle: true,
						padding: [ '', '', '', '' ],
						margin: [ '', '', '', '' ],
					} ],
				},
				submit: {
					type: 'array',
					default: [ {
						label: '',
						width: [ '100', '', '' ],
						size: 'standard',
						widthType: 'auto',
						fixedWidth: [ '', '', '' ],
						align: [ '', '', '' ],
						deskPadding: [ '', '', '', '' ],
						tabletPadding: [ '', '', '', '' ],
						mobilePadding: [ '', '', '', '' ],
						color: '',
						background: '',
						border: '',
						backgroundOpacity: 1,
						borderOpacity: 1,
						borderRadius: '',
						borderWidth: [ '', '', '', '' ],
						colorHover: '',
						backgroundHover: '',
						borderHover: '',
						backgroundHoverOpacity: 1,
						borderHoverOpacity: 1,
						icon: '',
						iconSide: 'right',
						iconHover: false,
						cssClass: '',
						gradient: [ '#999999', 1, 0, 100, 'linear', 180, 'center center' ],
						gradientHover: [ '#777777', 1, 0, 100, 'linear', 180, 'center center' ],
						btnStyle: 'basic',
						btnSize: 'standard',
						backgroundType: 'solid',
						backgroundHoverType: 'solid',
						boxShadow: [ false, '#000000', 0.2, 1, 1, 2, 0, false ],
						boxShadowHover: [ false, '#000000', 0.4, 2, 2, 3, 0, false ],
					} ],
				},
				submitFont: {
					type: 'array',
					default: [ {
						size: [ '', '', '' ],
						sizeType: 'px',
						lineHeight: [ '', '', '' ],
						lineType: 'px',
						letterSpacing: '',
						textTransform: '',
						family: '',
						google: '',
						style: '',
						weight: '',
						variant: '',
						subset: '',
						loadGoogle: true,
					} ],
				},
				actions: {
					type: 'array',
					default: [ 'email' ],
				},
				email: {
					type: 'array',
					default: [ {
						emailTo: '',
						subject: '',
						fromEmail: '',
						fromName: '',
						replyTo: 'email_field',
						cc: '',
						bcc: '',
						html: true,
					} ],
				},
				redirect: {
					type: 'string',
					default: '',
				},
				recaptcha: {
					type: 'bool',
					default: false,
				},
				honeyPot: {
					type: 'bool',
					default: true,
				},
			},
			save: ( { attributes } ) => {
				const { uniqueID, fields, submit, style, postID, hAlign, recaptcha, honeyPot } = attributes;
				const fieldOutput = ( index ) => {
					const fieldClassName = classnames( {
						'amp-blocks-form-field': true,
						[ `ampblocks-form-field-${ index }` ]: index,
						[ `ampblocks-field-desk-width-${ fields[ index ].width[ 0 ] }` ]: fields[ index ].width && fields[ index ].width[ 0 ],
						[ `ampblocks-field-tablet-width-${ fields[ index ].width[ 1 ] }` ]: fields[ index ].width && fields[ index ].width[ 1 ],
						[ `ampblocks-field-mobile-width-${ fields[ index ].width[ 2 ] }` ]: fields[ index ].width && fields[ index ].width[ 2 ],
						[ `ampblocks-input-size-${ style[ 0 ].size }` ]: style[ 0 ].size,
					} );
					let acceptLabel;
					let acceptLabelBefore;
					let acceptLabelAfter;
					if ( fields[ index ].label && fields[ index ].label.includes( '{privacy_policy}' ) ) {
						acceptLabelBefore = fields[ index ].label.split( '{' )[ 0 ];
						acceptLabelAfter = fields[ index ].label.split( '}' )[ 1 ];
						acceptLabel = (
							<Fragment>
								{ acceptLabelBefore }<a href={ ( undefined !== amp_blocks_params .privacy_link && '' !== amp_blocks_params .privacy_link ? amp_blocks_params .privacy_link : '#' ) } target="blank" rel="noopener noreferrer">{ ( undefined !== amp_blocks_params .privacy_title && '' !== amp_blocks_params .privacy_title ? amp_blocks_params .privacy_title : 'Privacy policy' ) }</a>{ acceptLabelAfter }
							</Fragment>
						);
					} else {
						acceptLabel = fields[ index ].label;
					}
					return (
						<div className={ fieldClassName } >
							{ 'accept' === fields[ index ].type && (
								<Fragment>
									{ fields[ index ].showLink && (
										<a href={ ( undefined !== fields[ index ].default && '' !== fields[ index ].default ? fields[ index ].default : '#' ) } target="_blank" rel="noopener noreferrer" className={ 'ampblocks-accept-link' }>{ ( undefined !== fields[ index ].placeholder && '' !== fields[ index ].placeholder ? fields[ index ].placeholder : 'View Privacy Policy' ) }</a>
									) }
									<input type="checkbox" name={ `ampblocks_field_${ index }` } id={ `ampblocks_field_${ index }` } className={ `ampblocks-field ampblocks-checkbox-style ampblocks-${ fields[ index ].type }` } value={ 'accept' } checked={ fields[ index ].inline ? true : false } data-type={ fields[ index ].type } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } />
									<label htmlFor={ `ampblocks_field_${ index }` }>{ ( fields[ index ].label ? acceptLabel : '' ) }{ ( fields[ index ].required && style[ 0 ].showRequired ? <span className="required">*</span> : '' ) }</label>
								</Fragment>
							) }
							{ 'accept' !== fields[ index ].type && (
								<Fragment>
									{ fields[ index ].showLabel && (
										<label htmlFor={ `ampblocks_field_${ index }` }>{ ( fields[ index ].label ? fields[ index ].label : '' ) }{ ( fields[ index ].required && style[ 0 ].showRequired ? <span className="required">*</span> : '' ) }</label>
									) }
									{ 'textarea' === fields[ index ].type && (
										<textarea name={ `ampblocks_field_${ index }` } id={ `ampblocks_field_${ index }` } data-label={ fields[ index ].label } type={ fields[ index ].type } placeholder={ fields[ index ].placeholder } value={ fields[ index ].default } data-type={ fields[ index ].type } className={ `ampblocks-field ampblocks-text-style-field ampblocks-${ fields[ index ].type }-field ampblocks-field-${ index }` } rows={ fields[ index ].rows } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } />
									) }
									{ 'select' === fields[ index ].type && (
										<select name={ ( fields[ index ].multiSelect ? `ampblocks_field_${ index }[]` : `ampblocks_field_${ index }` ) } id={ `ampblocks_field_${ index }` } multiple={ ( fields[ index ].multiSelect ? true : false ) } data-label={ fields[ index ].label } type={ fields[ index ].type } value={ fields[ index ].default } data-type={ fields[ index ].type } className={ `ampblocks-field ampblocks-select-style-field ampblocks-${ fields[ index ].type }-field ampblocks-field-${ index }` } data-required={ ( fields[ index ].required ? 'yes' : undefined ) }>
											{ times( fields[ index ].options.length, n => (
												<option
													key={ n }
													selected={ ( undefined !== fields[ index ].options[ n ].value && fields[ index ].options[ n ].value === fields[ index ].default ? true : false ) }
													value={ ( undefined !== fields[ index ].options[ n ].value ? fields[ index ].options[ n ].value : '' ) }
												>{ ( undefined !== fields[ index ].options[ n ].label ? fields[ index ].options[ n ].label : '' ) }</option>
											) ) }
										</select>
									) }
									{ 'textarea' !== fields[ index ].type && 'select' !== fields[ index ].type && (
										<input name={ `ampblocks_field_${ index }` } id={ `ampblocks_field_${ index }` } data-label={ fields[ index ].label } type={ fields[ index ].type } placeholder={ fields[ index ].placeholder } value={ fields[ index ].default } data-type={ fields[ index ].type } className={ `ampblocks-field ampblocks-text-style-field ampblocks-${ fields[ index ].type }-field ampblocks-field-${ index }` } autoComplete={ ( '' !== fields[ index ].auto ? fields[ index ].auto : undefined ) } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } />
									) }
								</Fragment>
							) }
							{ undefined !== fields[ index ].description && '' !== fields[ index ].description && (
								<span className={ 'ampblocks-field-help' }>{ ( fields[ index ].description ? fields[ index ].description : '' ) }</span>
							) }
						</div>
					);
				};
				const renderFieldOutput = (
					<Fragment>
						{ times( fields.length, n => fieldOutput( n ) ) }
					</Fragment>
				);
				const submitClassName = classnames( {
					'amp-blocks-form-field': true,
					'ampblocks-submit-field': true,
					[ `ampblocks-field-desk-width-${ submit[ 0 ].width[ 0 ] }` ]: submit[ 0 ].width && submit[ 0 ].width[ 0 ],
					[ `ampblocks-field-tablet-width-${ submit[ 0 ].width[ 1 ] }` ]: submit[ 0 ].width && submit[ 0 ].width[ 1 ],
					[ `ampblocks-field-mobile-width-${ submit[ 0 ].width[ 2 ] }` ]: submit[ 0 ].width && submit[ 0 ].width[ 2 ],
				} );
				return (
					<div className={ `kadence-form-${ uniqueID } ampblocks-form-wrap${ ( hAlign ? ' ampblocks-form-align-' + hAlign : '' ) }` }>
						<form className="ampblocks-form" action="" method="post">
							{ renderFieldOutput }
							<input type="hidden" name="_ampblocks_form_id" value={ uniqueID } />
							<input type="hidden" name="_ampblocks_form_post_id" value={ postID } />
							<input type="hidden" name="action" value="ampblocks_process_ajax_submit" />
							{ recaptcha && (
								<input type="hidden" name="recaptcha_response" className="ampblocks_recaptcha_response" />
							) }
							{ honeyPot && (
								<input className="amp-blocks-field verify" type="email" name="_ampblocks_verify_email" autoComplete="off" placeholder="Email" tabIndex="-1" />
							) }
							<div className={ submitClassName }>
								<RichText.Content
									tagName="button"
									value={ ( '' !== submit[ 0 ].label ? submit[ 0 ].label : 'Submit' ) }
									className={ `ampblocks-forms-submit button ampblocks-button-size-${ ( submit[ 0 ].size ? submit[ 0 ].size : 'standard' ) } ampblocks-button-width-${ ( submit[ 0 ].widthType ? submit[ 0 ].widthType : 'auto' ) }` }
								/>
							</div>
						</form>
					</div>
				);
			},
		},
		{
			attributes: {
				uniqueID: {
					type: 'string',
					default: '',
				},
				postID: {
					type: 'number',
					default: '',
				},
				hAlign: {
					type: 'string',
					default: '',
				},
				fields: {
					type: 'array',
					default: [ {
						label: 'Name',
						showLabel: true,
						placeholder: '',
						default: '',
						description: '',
						rows: 4,
						options: [ {
							value: '',
							label: '',
						} ],
						multiSelect: false,
						inline: false,
						showLink: false,
						min: '',
						max: '',
						type: 'text', // text, email, textarea, url, tel, radio, select, check, accept
						required: false,
						width: [ '100', '', '' ],
						auto: '',
					},
					{
						label: 'Email',
						showLabel: true,
						placeholder: '',
						default: '',
						description: '',
						rows: 4,
						options: [ {
							value: '',
							label: '',
						} ],
						multiSelect: false,
						inline: false,
						showLink: false,
						min: '',
						max: '',
						type: 'email', // text, email, textarea, url, tel, radio, select, check, accept
						required: true,
						width: [ '100', '', '' ],
						auto: '',
					},
					{
						label: 'Message',
						showLabel: true,
						placeholder: '',
						default: '',
						description: '',
						rows: 4,
						options: [ {
							value: '',
							label: '',
						} ],
						multiSelect: false,
						inline: false,
						showLink: false,
						min: '',
						max: '',
						type: 'textarea', // text, email, textarea, url, tel, radio, select, check, accept
						required: true,
						width: [ '100', '', '' ],
						auto: '',
					} ],
				},
				messages: {
					type: 'array',
					default: [ {
						success: '',
						error: '',
						required: '',
						invalid: '',
					} ],
				},
				messageFont: {
					type: 'array',
					default: [ {
						colorSuccess: '',
						colorError: '',
						borderSuccess: '',
						borderError: '',
						backgroundSuccess: '',
						backgroundSuccessOpacity: 1,
						backgroundError: '',
						backgroundErrorOpacity: 1,
						borderWidth: [ '', '', '', '' ],
						borderRadius: '',
						size: [ '', '', '' ],
						sizeType: 'px',
						lineHeight: [ '', '', '' ],
						lineType: 'px',
						letterSpacing: '',
						textTransform: '',
						family: '',
						google: '',
						style: '',
						weight: '',
						variant: '',
						subset: '',
						loadGoogle: true,
						padding: [ '', '', '', '' ],
						margin: [ '', '', '', '' ],
					} ],
				},
				style: {
					type: 'array',
					default: [ {
						showRequired: true,
						size: 'standard',
						deskPadding: [ '', '', '', '' ],
						tabletPadding: [ '', '', '', '' ],
						mobilePadding: [ '', '', '', '' ],
						color: '',
						requiredColor: '',
						background: '',
						border: '',
						backgroundOpacity: 1,
						borderOpacity: 1,
						borderRadius: '',
						borderWidth: [ '', '', '', '' ],
						colorActive: '',
						backgroundActive: '',
						borderActive: '',
						backgroundActiveOpacity: 1,
						borderActiveOpacity: 1,
						gradient: [ '#999999', 1, 0, 100, 'linear', 180, 'center center' ],
						gradientActive: [ '#777777', 1, 0, 100, 'linear', 180, 'center center' ],
						backgroundType: 'solid',
						backgroundActiveType: 'solid',
						boxShadow: [ false, '#000000', 0.2, 1, 1, 2, 0, false ],
						boxShadowActive: [ false, '#000000', 0.4, 2, 2, 3, 0, false ],
						fontSize: [ '', '', '' ],
						fontSizeType: 'px',
						lineHeight: [ '', '', '' ],
						lineType: 'px',
						rowGap: '',
						rowGapType: 'px',
						gutter: '',
						gutterType: 'px',
					} ],
				},
				labelFont: {
					type: 'array',
					default: [ {
						color: '',
						size: [ '', '', '' ],
						sizeType: 'px',
						lineHeight: [ '', '', '' ],
						lineType: 'px',
						letterSpacing: '',
						textTransform: '',
						family: '',
						google: '',
						style: '',
						weight: '',
						variant: '',
						subset: '',
						loadGoogle: true,
						padding: [ '', '', '', '' ],
						margin: [ '', '', '', '' ],
					} ],
				},
				submit: {
					type: 'array',
					default: [ {
						label: '',
						width: [ '100', '', '' ],
						size: 'standard',
						widthType: 'auto',
						fixedWidth: [ '', '', '' ],
						align: [ '', '', '' ],
						deskPadding: [ '', '', '', '' ],
						tabletPadding: [ '', '', '', '' ],
						mobilePadding: [ '', '', '', '' ],
						color: '',
						background: '',
						border: '',
						backgroundOpacity: 1,
						borderOpacity: 1,
						borderRadius: '',
						borderWidth: [ '', '', '', '' ],
						colorHover: '',
						backgroundHover: '',
						borderHover: '',
						backgroundHoverOpacity: 1,
						borderHoverOpacity: 1,
						icon: '',
						iconSide: 'right',
						iconHover: false,
						cssClass: '',
						gradient: [ '#999999', 1, 0, 100, 'linear', 180, 'center center' ],
						gradientHover: [ '#777777', 1, 0, 100, 'linear', 180, 'center center' ],
						btnStyle: 'basic',
						btnSize: 'standard',
						backgroundType: 'solid',
						backgroundHoverType: 'solid',
						boxShadow: [ false, '#000000', 0.2, 1, 1, 2, 0, false ],
						boxShadowHover: [ false, '#000000', 0.4, 2, 2, 3, 0, false ],
					} ],
				},
				submitFont: {
					type: 'array',
					default: [ {
						size: [ '', '', '' ],
						sizeType: 'px',
						lineHeight: [ '', '', '' ],
						lineType: 'px',
						letterSpacing: '',
						textTransform: '',
						family: '',
						google: '',
						style: '',
						weight: '',
						variant: '',
						subset: '',
						loadGoogle: true,
					} ],
				},
				actions: {
					type: 'array',
					default: [ 'email' ],
				},
				email: {
					type: 'array',
					default: [ {
						emailTo: '',
						subject: '',
						fromEmail: '',
						fromName: '',
						replyTo: 'email_field',
						cc: '',
						bcc: '',
						html: true,
					} ],
				},
				redirect: {
					type: 'string',
					default: '',
				},
				recaptcha: {
					type: 'bool',
					default: false,
				},
			},
			save: ( { attributes } ) => {
				const { uniqueID, fields, submit, style, postID, hAlign, recaptcha } = attributes;
				const fieldOutput = ( index ) => {
					const fieldClassName = classnames( {
						'amp-blocks-form-field': true,
						[ `ampblocks-form-field-${ index }` ]: index,
						[ `ampblocks-field-desk-width-${ fields[ index ].width[ 0 ] }` ]: fields[ index ].width && fields[ index ].width[ 0 ],
						[ `ampblocks-field-tablet-width-${ fields[ index ].width[ 1 ] }` ]: fields[ index ].width && fields[ index ].width[ 1 ],
						[ `ampblocks-field-mobile-width-${ fields[ index ].width[ 2 ] }` ]: fields[ index ].width && fields[ index ].width[ 2 ],
						[ `ampblocks-input-size-${ style[ 0 ].size }` ]: style[ 0 ].size,
					} );
					let acceptLabel;
					let acceptLabelBefore;
					let acceptLabelAfter;
					if ( fields[ index ].label && fields[ index ].label.includes( '{privacy_policy}' ) ) {
						acceptLabelBefore = fields[ index ].label.split( '{' )[ 0 ];
						acceptLabelAfter = fields[ index ].label.split( '}' )[ 1 ];
						acceptLabel = (
							<Fragment>
								{ acceptLabelBefore }<a href={ ( undefined !== amp_blocks_params .privacy_link && '' !== amp_blocks_params .privacy_link ? amp_blocks_params .privacy_link : '#' ) } target="blank" rel="noopener noreferrer">{ ( undefined !== amp_blocks_params .privacy_title && '' !== amp_blocks_params .privacy_title ? amp_blocks_params .privacy_title : 'Privacy policy' ) }</a>{ acceptLabelAfter }
							</Fragment>
						);
					} else {
						acceptLabel = fields[ index ].label;
					}
					return (
						<div className={ fieldClassName } >
							{ 'accept' === fields[ index ].type && (
								<Fragment>
									{ fields[ index ].showLink && (
										<a href={ ( undefined !== fields[ index ].default && '' !== fields[ index ].default ? fields[ index ].default : '#' ) } target="_blank" rel="noopener noreferrer" className={ 'ampblocks-accept-link' }>{ ( undefined !== fields[ index ].placeholder && '' !== fields[ index ].placeholder ? fields[ index ].placeholder : 'View Privacy Policy' ) }</a>
									) }
									<input type="checkbox" name={ `ampblocks_field_${ index }` } id={ `ampblocks_field_${ index }` } className={ `ampblocks-field ampblocks-checkbox-style ampblocks-${ fields[ index ].type }` } value={ 'accept' } checked={ fields[ index ].inline ? true : false } data-type={ fields[ index ].type } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } />
									<label htmlFor={ `ampblocks_field_${ index }` }>{ ( fields[ index ].label ? acceptLabel : '' ) }{ ( fields[ index ].required && style[ 0 ].showRequired ? <span className="required">*</span> : '' ) }</label>
								</Fragment>
							) }
							{ 'accept' !== fields[ index ].type && (
								<Fragment>
									{ fields[ index ].showLabel && (
										<label htmlFor={ `ampblocks_field_${ index }` }>{ ( fields[ index ].label ? fields[ index ].label : '' ) }{ ( fields[ index ].required && style[ 0 ].showRequired ? <span className="required">*</span> : '' ) }</label>
									) }
									{ 'textarea' === fields[ index ].type && (
										<textarea name={ `ampblocks_field_${ index }` } id={ `ampblocks_field_${ index }` } data-label={ fields[ index ].label } type={ fields[ index ].type } placeholder={ fields[ index ].placeholder } value={ fields[ index ].default } data-type={ fields[ index ].type } className={ `ampblocks-field ampblocks-text-style-field ampblocks-${ fields[ index ].type }-field ampblocks-field-${ index }` } rows={ fields[ index ].rows } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } />
									) }
									{ 'select' === fields[ index ].type && (
										<select name={ ( fields[ index ].multiSelect ? `ampblocks_field_${ index }[]` : `ampblocks_field_${ index }` ) } id={ `ampblocks_field_${ index }` } multiple={ ( fields[ index ].multiSelect ? true : false ) } data-label={ fields[ index ].label } type={ fields[ index ].type } value={ fields[ index ].default } data-type={ fields[ index ].type } className={ `ampblocks-field ampblocks-select-style-field ampblocks-${ fields[ index ].type }-field ampblocks-field-${ index }` } data-required={ ( fields[ index ].required ? 'yes' : undefined ) }>
											{ times( fields[ index ].options.length, n => (
												<option
													key={ n }
													selected={ ( undefined !== fields[ index ].options[ n ].value && fields[ index ].options[ n ].value === fields[ index ].default ? true : false ) }
													value={ ( undefined !== fields[ index ].options[ n ].value ? fields[ index ].options[ n ].value : '' ) }
												>{ ( undefined !== fields[ index ].options[ n ].label ? fields[ index ].options[ n ].label : '' ) }</option>
											) ) }
										</select>
									) }
									{ 'textarea' !== fields[ index ].type && 'select' !== fields[ index ].type && (
										<input name={ `ampblocks_field_${ index }` } id={ `ampblocks_field_${ index }` } data-label={ fields[ index ].label } type={ fields[ index ].type } placeholder={ fields[ index ].placeholder } value={ fields[ index ].default } data-type={ fields[ index ].type } className={ `ampblocks-field ampblocks-text-style-field ampblocks-${ fields[ index ].type }-field ampblocks-field-${ index }` } autoComplete={ ( '' !== fields[ index ].auto ? fields[ index ].auto : undefined ) } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } />
									) }
								</Fragment>
							) }
							{ undefined !== fields[ index ].description && '' !== fields[ index ].description && (
								<span className={ 'ampblocks-field-help' }>{ ( fields[ index ].description ? fields[ index ].description : '' ) }</span>
							) }
						</div>
					);
				};
				const renderFieldOutput = (
					<Fragment>
						{ times( fields.length, n => fieldOutput( n ) ) }
					</Fragment>
				);
				const submitClassName = classnames( {
					'amp-blocks-form-field': true,
					'ampblocks-submit-field': true,
					[ `ampblocks-field-desk-width-${ submit[ 0 ].width[ 0 ] }` ]: submit[ 0 ].width && submit[ 0 ].width[ 0 ],
					[ `ampblocks-field-tablet-width-${ submit[ 0 ].width[ 1 ] }` ]: submit[ 0 ].width && submit[ 0 ].width[ 1 ],
					[ `ampblocks-field-mobile-width-${ submit[ 0 ].width[ 2 ] }` ]: submit[ 0 ].width && submit[ 0 ].width[ 2 ],
				} );
				return (
					<div className={ `kadence-form-${ uniqueID } ampblocks-form-wrap${ ( hAlign ? ' ampblocks-form-align-' + hAlign : '' ) }` }>
						<form className="ampblocks-form" action="" method="post">
							{ renderFieldOutput }
							<input type="hidden" name="_ampblocks_form_id" value={ uniqueID } />
							<input type="hidden" name="_ampblocks_form_post_id" value={ postID } />
							<input type="hidden" name="action" value="ampblocks_process_ajax_submit" />
							{ recaptcha && (
								<input type="hidden" name="recaptcha_response" id="ampblocks_recaptcha_response" />
							) }
							<input className="amp-blocks-field verify" type="email" name="_ampblocks_verify_email" autoComplete="off" placeholder="Email" tabIndex="-1" />
							<div className={ submitClassName }>
								<RichText.Content
									tagName="button"
									value={ ( '' !== submit[ 0 ].label ? submit[ 0 ].label : 'Submit' ) }
									className={ `ampblocks-forms-submit button ampblocks-button-size-${ ( submit[ 0 ].size ? submit[ 0 ].size : 'standard' ) } ampblocks-button-width-${ ( submit[ 0 ].widthType ? submit[ 0 ].widthType : 'auto' ) }` }
								/>
							</div>
						</form>
					</div>
				);
			},
		},
	],
} );
