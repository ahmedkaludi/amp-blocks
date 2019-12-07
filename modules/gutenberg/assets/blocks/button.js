
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
            
    blocks.registerBlockType( 'ampblocks/button', {
        title: __('Button', 'amp-blocks'),
        icon: 'list-view',
        category: 'amp-blocks',
        keywords: ['btn', 'button', 'Button'],
        
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
            button_text: {
              type: 'string',
              default :'Use JOIN free',
            },
            button_text_color:{
              type:'string',
              default: '#fff',
            },
            button_bg_color:{
              type:'string',
              default: '#1e86ff',
            },
            buttonurl: {
              type: 'string',
              default :'#',
            }

        },               
        edit: function(props) {

        const colors = [
            { name: 'blue', color: '#0073a8' },
            { name: 'lblue', color: '#005075' },
            { name: 'black', color: '#000000' },
            { name: 'gray', color: '#767676' },
            { name: 'white', color: '#ffffff' },
        ];

        var attributes = props.attributes;    
        var alignment  = props.attributes.alignment;


        var button = el(RichText,{
          tagName: 'a',
          className: 'ab-btn',
          style: { color: attributes.button_text_color,
                   background: attributes.button_bg_color,
           },                             
          autoFocus: true,                               
          value: attributes.button_text,
          onChange : function( Button ){
            props.setAttributes( { button: Button} );
          }
        })

        var btn_wrap = el('div',{className: 'ab-btn-w', 
          style: { textAlign: attributes.alignment} 
            },button);


            return [el(InspectorControls,
              {
               className:'ampblocks-cbtn-fields',
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

                    el('span',{className:"cntrl-lbl"},__('Button Link', 'amp-blocks')),
                    el(TextControl,{
                      className:'button-link',
                      placeholder: i18n.__('Paste your link here', 'amp-blocks'),
                      keepPlaceholderOnFocus: true,
                      onChange:function(event){
                        props.setAttributes( { buttonurl:event } );
                      }
                    }),

                  ), // Layout Settings Ends

              el(PanelBody,{
                className:'ampblocks-cta-color-stng',
                initialOpen: false,
                title:'Color Settings',
              },
                  el('div',{className:"sub-hd-clr", },
                      el('span',{},__('Button Text Color', 'amp-blocks')),
                      el('div',{},el(ColorPalette,{
                        className:"ampb-btn-color",
                        colors: colors,
                        onChange:function(event){
                          props.setAttributes( { button_text_color:event } );
                        }
                      })),
                  ),

                  el('div',{className:"sub-hd-clr", },
                      el('span',{},__('Button Background Color', 'amp-blocks')),
                      el('div',{},el(ColorPalette,{
                        className:"ampb-btnbg-color",
                        colors: colors,
                        onChange:function(event){
                          props.setAttributes( { button_bg_color:event } );
                        }
                      })),
                  ),

              ), // Color Settings Ends

              ),
              btn_wrap
            ];

        },// edit ends here

        save: function( props ) {

          var button = el( 'a', {
            className: 'ab-btn',
            href: props.attributes.buttonurl,
             style: { color: props.attributes.button_text_color,
                      background: props.attributes.button_bg_color,
                    },
          }, props.attributes.button_text);
          
          var btnwrapper = el( 'div',{className: 'ab-btn-w', 
                                       style: { textAlign: props.attributes.alignment } 
                              },button);

          return btnwrapper;

          }
    } );
}(
    window.wp.blocks,
    window.wp.element,
    window.wp.blockEditor,
    window.wp.components,
    window.wp.i18n,
) );
