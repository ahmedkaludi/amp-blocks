
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
              default: 'http://localhost/ampdev/wp-content/uploads/2019/12/user-df-img.png',
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


        var media_upload = el(MediaUpload, {
          onSelect: function(media){  
            props.setAttributes( { mediaURL: media.url} );
            //console.log(media);
          },

         allowedTypes:[ "image" ],
         render:function(obj){
             return el( 'img', {                  
                  className: 'ab-tst-img',            
                  onClick: obj.open,
                  src:attributes.mediaURL
                }            
          )
         }
      });

        var testimonial_cnt = el(RichText,{
          tagName: 'div',
          className: 'ab-tsti-cnt',
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
          className: 'ab-tsti-nm',
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
          className: 'ab-tsti-spf',
          style: { color: attributes.testi_social_fld_nm_color,
           },                             
          autoFocus: true,                               
          value: attributes.testi_social_fld_nm,
          onChange : function( event ){
            props.setAttributes( { testi_social_fld_nm: event} );
          }
        });


        var testi_wrap = el('div',{className: 'ab-tsti-w', 
          style: { textAlign: attributes.alignment} 
            },testimonial_cnt, media_upload, testimonial_nme, testimonial_spc);


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

          var upload_image = el( 'img' , {
            className : 'ab-tst-img',
            src: props.attributes.mediaURL
          });

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
                              },tsti_cnt, upload_image, tsti_nm, tsti_spf);

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
