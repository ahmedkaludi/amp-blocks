
( function( blocks, element, editor, components, i18n ) {
    
    const { __ }          = i18n;
    
    var el                = element.createElement;
    var RichText          = editor.RichText;
    var MediaUpload       = editor.MediaUpload;       
    var IconButton        = components.IconButton;
    var AlignmentToolbar  = editor.AlignmentToolbar;
    var BlockControls     = editor.BlockControls;
    var TextControl       = components.TextControl;
    var InspectorControls = editor.InspectorControls;
    var ToggleControl     = components.ToggleControl;
    var PanelBody         = components.PanelBody;
    var ColorPicker       = components.ColorPicker;
    var Placeholder       = components.Placeholder;
    var ColorPalette      = components.ColorPalette;
            
    blocks.registerBlockType( 'ampblocks/testimonial', {
        title: __('Testimonial', 'amp-blocks'),
        icon: 'list-view',
        category: 'amp-blocks',
        keywords: ['testi', 'testimonial', 'Testimonial'],
        
        // Allow only one How To block per post.
        supports: {
            multiple: true
        },
        
        attributes: {
            btn_clicked:{
              type:Boolean,
              default:false
            },
            alignment: {
              type: 'string',
              default: 'center',
            },
            testi_content: {
              type: 'string',
              default :'You can Decide whether to create your site using UI Kit blocks or samples. The blocks can merge together in various combinations.',
            },
            mediaID: {
              type: 'number'
            },
            mediaURL: {
              type: 'string',
              source: 'attribute',
              selector: 'img',
              attribute: 'src'
            },
            testi_authr_nm: {
              type: 'string',
              default :'Raju Jeelaga',
            },
            testi_social_fld_nm: {
              type: 'string',
              default :'GOOGLE',
            },
            testi_content_color:{
              type:'string',
              default: '#54479a',
            },
            testi_authr_nm_color:{
              type:'string',
              default: '#54479a',
            },
            testi_social_fld_nm_color:{
              type:'string',
              default: '#b0afb4',
            },

        },               
        edit: function(props) {

        const colors = [
            { name: 'pink', color: '#f78da7' },
            { name: 'red', color: '#cf2e2e' },
            { name: 'orange', color: '#ff6900' },
            { name: 'yellow', color: '#fcb900' },
            { name: 'light-green', color: '#7bdcb5' },
            { name: 'green', color: '#00d084' },
            { name: 'sky-blue', color: '#8ed1fc' },
            { name: 'blue', color: '#0693e3' },
            { name: 'meroon', color: '#9b51e0' },
            { name: 'light-gray', color: '#eeeeee' },
            { name: 'gray', color: '#abb8c3' },
            { name: 'black', color: '#313131' },
            { name: 'white', color: '#ffffff' },

        ];

        var attributes = props.attributes;    
        var alignment  = props.attributes.alignment;

        var onSelectImage = function (media) {
          return props.setAttributes({
            mediaURL: media.url,
            mediaID: media.id
          })
        }
  
        function onChangeAlignment (newAlignment) {
          props.setAttributes({ alignment: newAlignment })
        }

        var testimonial_cnt = el(RichText,{
          tagName: 'div',
          className: 'ab-testi-cnt',
          style: { color: attributes.testi_content_color,
           },                             
          autoFocus: true,                               
          value: attributes.testi_content,
          onChange : function( event ){
            props.setAttributes( { testi_content: event} );
          }
        });

        var testimonial_nme = el(RichText,{
          tagName: 'div',
          className: 'ab-testi-nm',
          style: { color: attributes.testi_authr_nm_color,
           },                             
          autoFocus: true,                               
          value: attributes.testi_authr_nm,
          onChange : function( event ){
            props.setAttributes( { testi_authr_nm: event} );
          }
        });

        var testimonial_spc = el(RichText,{
          tagName: 'div',
          className: 'ab-testi-spc',
          style: { color: attributes.testi_social_fld_nm_color,
           },                             
          autoFocus: true,                               
          value: attributes.testi_social_fld_nm,
          onChange : function( event ){
            props.setAttributes( { testi_social_fld_nm: event} );
          }
        });


        var testi_wrap = el('div',{className: 'ab-tst-w', 
          style: { textAlign: attributes.alignment} 
            },testimonial_cnt, testimonial_nme, testimonial_spc);


            return [el(InspectorControls,
              {
               className:'ampblocks-btn-fields',
               key: 'inspector'   
              },
                el(PanelBody,
                  {className:'ampblocks-btn-layout-stng',
                  initialOpen: true,
                  title:'Layout Settings'   
                  },
                   
                    // Display alignment toolbar within block controls.
                    el('span',{className:"cntrl-lbl"},__('Alignment', 'amp-blocks')),
                    el(AlignmentToolbar, {
                      value: alignment,
                      onChange: function(event){
                        props.setAttributes({ alignment: event })
                      }
                    }),

                   
                  ), // Layout Settings Ends

              el(PanelBody,{
                className:'ampblocks-tst-color-stng',
                initialOpen: false,
                title:'Color Settings',
              },
                
              el('div',{className:"sub-hd-clr", },
                  el('span',{},__('Content Color', 'amp-blocks')),
                  el('div',{},el(ColorPalette,{
                    className:"ampb-tst-cnt",
                    colors: colors,
                    onChange: function(event){
                      props.setAttributes( { testi_content_color:event } );
                    } 
                  })),
              ),
              el('div',{className:"sub-hd-clr", },
                  el('span',{},__('Testimonial Name Color', 'amp-blocks')),
                  el('div',{},el(ColorPalette,{
                    className:"ampb-tst-nm",
                    colors: colors,
                    onChange: function(event){
                      props.setAttributes( { testi_authr_nm_color:event } );
                    } 
                  })),
              ),
              el('div',{className:"sub-hd-clr", },
                  el('span',{},__('Social Profile Text Color', 'amp-blocks')),
                  el('div',{},el(ColorPalette,{
                    className:"ampb-tst-spc",
                    colors: colors,
                    onChange: function(event){
                      props.setAttributes( { testi_social_fld_nm_color:event } );
                    } 
                  })),
              )
                  

              ), // Color Settings Ends

                el(BlockControls, { key: 'controls' }, // Display controls when the block is clicked on.
                el('div', { className: 'components-toolbar' },
                  el(MediaUpload, {
                    onSelect: onSelectImage,
                    type: 'image',
                    render: function (obj) {
                      return el(components.Button, {
                        className: 'components-icon-button components-toolbar__control',
                        onClick: obj.open
                      },
                      // Add Dashicon for media upload button.
                      el('svg', { className: 'dashicon dashicons-edit', width: '20', height: '20' },
                        el('path', { d: 'M2.25 1h15.5c.69 0 1.25.56 1.25 1.25v15.5c0 .69-.56 1.25-1.25 1.25H2.25C1.56 19 1 18.44 1 17.75V2.25C1 1.56 1.56 1 2.25 1zM17 17V3H3v14h14zM10 6c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm3 5s0-6 3-6v10c0 .55-.45 1-1 1H5c-.55 0-1-.45-1-1V8c2 0 3 4 3 4s1-3 3-3 3 2 3 2z' })
                      ))
                    }
                  })
                ),
                // Display alignment toolbar within block controls.
                el(AlignmentToolbar, {
                  value: alignment,
                  onChange: onChangeAlignment
                })
              ) // Block controller Ends 




              ),
              testi_wrap
            ];

        },// edit ends here

        save: function( props ) {

          var tsti_cnt = el( 'div', {
            className: 'ab-tsti-cnt',
             style: { color: props.attributes.testi_content_color,
                    },
          }, props.attributes.testi_content);

          var tsti_nm = el( 'div', {
            className: 'ab-tsti-nm',
             style: { color: props.attributes.testi_authr_nm_color,
                    },
          }, props.attributes.testi_authr_nm);

          var tsti_spf = el( 'div', {
            className: 'ab-tsti-spf',
             style: { color: props.attributes.testi_social_fld_nm_color,
                    },
          }, props.attributes.testi_social_fld_nm);

          
          var tstiwrapper = el( 'div',{className: 'ab-tsti-w', 
                                       style: { textAlign: props.attributes.alignment } 
                              },tsti_cnt, tsti_nm, tsti_spf);

          return tstiwrapper;

          }
    } );
}(
    window.wp.blocks,
    window.wp.element,
    window.wp.blockEditor,
    window.wp.components,
    window.wp.i18n,
) );
