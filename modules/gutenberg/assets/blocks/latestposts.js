
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
            
    blocks.registerBlockType( 'ampblocks/latestposts', {
        title: __('Posts', 'amp-blocks'),
        icon: 'list-view',
        category: 'amp-blocks',
        keywords: ['posts', 'latest', 'latest posts', 'Latest Posts'],
        
        // Allow only one How To block per post.
        supports: {
            multiple: true
        },
        
        attributes: {
            alignment: {
              type: 'string',
              default: 'left',
            },
            lp_backgroundwrap_color: {
                type:'string',
                default: '#F2EDF0',
            },
            lp_background_color: {
                type:'string',
                default: '#ffffff',
            },
            lp_cat_color: {
                type:'string',
                default: '#f09d4a',
            },
            lp_title_color: {
                type:'string',
                default: '#1d1d1d',
            },
            lp_excerpt_color: {
                type:'string',
                default: '#848484',
            },
            lp_meta_color: {
                type:'string',
                default: '#242424',
            },

            
        }, // attributes ends here               
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
        const latesposts = ampblocksGutenbergLatestposts.posts;

        var itemlist  = latesposts.map(function(item){

            // Image Condition
            var image_tag = '';

            if(item.image){
               var image_tag =  el('div',{ className: 'lp-rght'},
                    el('a', {className: 'lp-img', href: item.url},
                        el( 'img', {                  
                            className: 'ab-lp-img',            
                            src:item.image
                        }),
                    ),
                )
            }
            
            // Loop Start here
            return el('li',{ className: 'lst-pst', 
                            style: { textAlign: props.attributes.alignment,
                                     background:  props.attributes.lp_background_color},
                                },
                        
                    el('div', { className: 'lp-left'},
                        el('div',{className: 'lp-cat'},
                            el('a',{ href: item.category_link,
                            style: { color: props.attributes.lp_cat_color},
                        },
                        item.category
                            ),
                        ),
                        el('h3', { className: 'ab-lp-tlt'},
                            el('a',{ href: item.url,
                                style: { color: props.attributes.lp_title_color}
                             },
                                item.title
                            ),
                        ),
                        el('div', {className: 'excerpt', 
                            style: { color: props.attributes.lp_excerpt_color}
                        },
                          item.excerpt,'...',el('a',{ href: item.url},'Read More')
                             ),
                       
                        el('div',{ className: 'author-meta'},
                            el('img', {
                                className: 'ab-lp-img',            
                                src:item.author_image
                             }),
                            el('a', {
                                className: 'ab-athr-nm',
                                style: { color: props.attributes.lp_meta_color},
                                href:item.author_url
                            }, item.author)

                        ),
                    ), // lp-left class ends here

                    image_tag,
                                            
                ) // Loop li ends here
            });

            var parentdiv = el('div',{className: 'lp-wrap', style: { background: props.attributes.lp_backgroundwrap_color} },itemlist);
     
        
            //Inspector Controls
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
                        el('span',{},__('Wrapper Background Color', 'amp-blocks')),
                        el('div',{},el(ColorPalette,{
                          className:"ab-lp-bgwarp-color",
                          colors: colors,
                          onChange:function(event){
                            props.setAttributes( { lp_backgroundwrap_color:event } );
                          }
                        })),
                    ),
                    el('div',{className:"sub-hd-clr", },
                        el('span',{},__('Post Background Color', 'amp-blocks')),
                        el('div',{},el(ColorPalette,{
                          className:"ab-lp-bg-color",
                          colors: colors,
                          onChange:function(event){
                            props.setAttributes( { lp_background_color:event } );
                          }
                        })),
                    ),

                    el('div',{className:"sub-hd-clr", },
                        el('span',{},__('Category Text Color', 'amp-blocks')),
                        el('div',{},el(ColorPalette,{
                        className:"ab-lp-cat-color",
                        colors: colors,
                        onChange:function(event){
                            props.setAttributes( { lp_cat_color:event } );
                        }
                        })),
                    ),

                    el('div',{className:"sub-hd-clr", },
                        el('span',{},__('Title Color', 'amp-blocks')),
                        el('div',{},el(ColorPalette,{
                        className:"ab-lp-tlt-color",
                        colors: colors,
                        onChange:function(event){
                            props.setAttributes( { lp_title_color:event } );
                        }
                        })),
                    ),

                    el('div',{className:"sub-hd-clr", },
                        el('span',{},__('Excerpt Color', 'amp-blocks')),
                        el('div',{},el(ColorPalette,{
                        className:"ab-lp-bg-color",
                        colors: colors,
                        onChange:function(event){
                            props.setAttributes( { lp_excerpt_color:event } );
                        }
                        })),
                    ),

                    el('div',{className:"sub-hd-clr", },
                        el('span',{},__('Meta Color', 'amp-blocks')),
                        el('div',{},el(ColorPalette,{
                        className:"ab-lp-mt-color",
                        colors: colors,
                        onChange:function(event){
                            props.setAttributes( { lp_meta_color:event } );
                        }
                        })),
                    ),
  
                  
  
                ), // Color Settings Ends
  
                ),
                parentdiv
              ]; // Inspector Controls ends

        },// edit ends here

        save: function( props ) {

          return null;

          }
    } );
}(
    window.wp.blocks,
    window.wp.element,
    window.wp.blockEditor,
    window.wp.components,
    window.wp.i18n,
) );
