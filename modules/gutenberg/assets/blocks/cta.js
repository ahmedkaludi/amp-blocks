
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
            
    blocks.registerBlockType( 'ampblocks/cta', {
        title: __('Call to Action', 'amp-blocks'),
        icon: 'list-view',
        category: 'amp-blocks',
        keywords: ['cta', 'call to action', 'call-to-action'],
        
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
            widthcntrl: {
              type: 'string',
              default: '750px',
            },
            subtitle: {
              type: 'string',
              default: 'Create your own success story.',              
            },
            subtitle_text_color:{
              type:'string',
              default: '#3a95ff'
            },
            title: {
              type: 'string',
              default :'Start recruiting like the best and find your perfect candiate in no time.',
            },
            title_text_color: {
              type: 'string',
              default :'#303446',
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
             
             var sub_title = el(RichText,{
              tagName: 'span',
              className:"ab-cta-st",
              style: { color: attributes.subtitle_text_color },
              autoFocus: true,              
              value : attributes.subtitle,
              onChange: function( CTAsubtitle ) {                                
                  props.setAttributes( { subtitle: CTAsubtitle } );
              }
            });

             var title = el(RichText,{
                tagName: 'h3',
                className: 'ab-cta-t',
                style: { color: attributes.title_text_color },
                autoFocus: true,
                value: attributes.title,
                onChange: function( CTAtitle ) {
                    props.setAttributes( { title: CTAtitle } );
                }
             });

            var button = el(RichText,{
              tagName: 'a',
              className: 'ab-cta-b',
              style: { color: attributes.button_text_color,
                       background: attributes.button_bg_color
               },                             
              autoFocus: true,                               
              value: attributes.button_text,
              onChange : function( CTAbutton ){
                props.setAttributes( { button:CTAbutton } );
              }
          })

          var all_field = el('div',{className: 'ab-cta-w', 
          style: { textAlign: attributes.alignment} 
            },sub_title,title,button);

            
          return [el(InspectorControls,
              {
               className:'ampblocks-cta-fields',
               key: 'inspector'   
              },
                el(PanelBody,
                  {className:'ampblocks-cta-layout-stng',
                  initialOpen: true,
                  title:'Layout Settings'   
                  },
                    el('span',{className:"cntrl-lbl"},__('Max Width', 'amp-blocks')),
                    el(TextControl, {
                      value: attributes.widthcntrl,
                      onChange: function(event){
                        props.setAttributes({ widthcntrl: event })
                      }
                    }),

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
                      el('span',{},__('Sub Heading Text Color', 'amp-blocks')),
                      el('div',{},el(ColorPalette,{
                        className:"ampb-cta-subh-color",
                        colors: colors,
                        onChange: function(event){
                          props.setAttributes( { subtitle_text_color:event } );
                        } 
                      })),
                  ),
                  
                  el('div',{className:"sub-hd-clr", },
                      el('span',{},__('Heading Text Color', 'amp-blocks')),
                      el('div',{},el(ColorPalette,{
                        className:"ampb-cta-hdng-color",
                        colors: colors,
                        onChange: function(event){
                          props.setAttributes( { title_text_color:event } );
                        } 
                      })),
                  ),
                  
                  el('div',{className:"sub-hd-clr", },
                      el('span',{},__('Button Text Color', 'amp-blocks')),
                      el('div',{},el(ColorPalette,{
                        className:"ampb-cta-btn-color",
                        colors: colors,
                        onChange:function(event){
                          props.setAttributes( { button_text_color:event } );
                        }
                      })),
                  ),

                  el('div',{className:"sub-hd-clr", },
                      el('span',{},__('Button Background Color', 'amp-blocks')),
                      el('div',{},el(ColorPalette,{
                        className:"ampb-cta-btnbg-color",
                        colors: colors,
                        onChange:function(event){
                          props.setAttributes( { button_bg_color:event } );
                        }
                      })),
                  ),

              ), // Color Settings Ends

              ),
              all_field
            ];

        },
        save: function( props ) {
          var sub_title = el( 'span', {
            className: 'ab-cta-st',
            style: { color: props.attributes.subtitle_text_color },
          }, props.attributes.subtitle );

          var title = el( 'h3', {
            className:'ab-cta-t',
            style: { color: props.attributes.title_text_color },
          }, props.attributes.title );

          var button = el( 'a', {
            className: 'ab-cta-b',
            href: props.attributes.buttonurl,
             style: { color: props.attributes.button_text_color,
                      background: props.attributes.button_bg_color,
                    },
          }, props.attributes.button_text);
          
          var ctawrapper = el( 'div',{className: 'ab-cta-w', 
                                       style: { textAlign: props.attributes.alignment, width: props.attributes.widthcntrl } 
                              }, sub_title, title,  button);

          return ctawrapper;

          }
    } );
}(
    window.wp.blocks,
    window.wp.element,
    window.wp.blockEditor,
    window.wp.components,
    window.wp.i18n,
) );
