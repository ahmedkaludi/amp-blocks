
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
            
    blocks.registerBlockType( 'ampblocks/pricing', {
        title: __('Pricing', 'amp-blocks'),
        icon: 'excerpt-view',
        category: 'amp-blocks',
        keywords: ['pricing', 'Pricing'],
        
        // Allow only one How To block per post.
        supports: {
            multiple: true
        },
        
        attributes: {
            alignment: {
              type: 'string',
              default: 'center',
            },
            price_hdng: {
                type: 'string',
                default : 'Pricing Plans',
            },
            price_desc: {
                type: 'string',
                default: 'Start with free tail, No credit card needed. Cancel at anytime.',
            },
            price_hdng_color: {
                type: 'string',
                default : '#201653',
            },
            price_desc_color: {
                type: 'string',
                default : '#a4a3a8',
            },
            pric_tlt_color: {
                type: 'string',
                default : '#201653',
            },
            pric_lbl_color: {
                type: 'string',
                default : '#a4a3a8',
            },
            pric_amnt_color: {
                type: 'string',
                default : '#201653',
            },
            pric_btn_color: {
                type: 'string',
                default : '#201653',
            },
            pric_btn_bg_color: {
                type: 'string',
                default : '#fff',
            },
            items: {           
                default: [{index: 0,
                  pric_tlt: "Free",
                  pric_lbl : 'Forever Free',
                  pric_amnt: "0",
                  pric_btn: "Get Started",
                },
                {index: 1, 
                    pric_tlt: "Starter",
                    pric_lbl : 'Perfect for Freelancers',
                    pric_amnt: "19",
                    pric_btn: "Get Started",
                },
                {index: 2, 
                    pric_tlt: "Pro",
                    pric_lbl : 'Perect for Small Team',
                    pric_amnt: "49",
                    pric_btn: "Get Started",
                },
                {index: 3, 
                    pric_tlt: "Premium",
                    pric_lbl : 'Forever Free',
                    pric_amnt: "149",
                    pric_btn: "Get Started",
                }
              ],
                selector: "blockquote.pricing",
                query: {
                  index: {            
                    type: 'number',                  
                    attribute: 'data-index',                  
                  },
                  pric_tlt: {
                    type: 'string',
                  },
                  pric_lbl: {
                    type: 'string',
                  },
                  pric_amnt: {
                    type: 'string',
                  },
                  pric_btn: {
                    type: 'string',
                  },
                  isSelected: {            
                    type: 'boolean',
                    default:false      
                  },
                }, // query ends
              } // Items selector ends

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

        var pric_hdng = el(RichText,{
            tagName: 'h2',
            className: 'ab-pri-hdng',
            style: { color: props.attributes.price_hdng_color,
             },                             
            autoFocus: true,                               
            value: attributes.price_hdng,
            onChange : function( event ){
              props.setAttributes( { price_hdng: event} );
            }
          });

        var pric_desc = el(RichText,{
            tagName: 'span',
            className: 'ab-pri-desc',
            style: { color: props.attributes.price_desc_color,
             },                             
            autoFocus: true,                               
            value: attributes.price_desc,
            onChange : function( event ){
              props.setAttributes( { price_desc: event} );
            }
          });

          function _cloneArray(arr) { 
            if (Array.isArray(arr)) { 
                for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { 
                  arr2[i] = arr[i]; 
                } 
                return arr2; 
            } else { 
                return Array.from(arr); 
            } 
        }

        var itemlist =  props.attributes.items.sort(function(a , b) {
                  
            return a.index - b.index;
            }).map(function(item){
              return el('li',{ 
                style: { textAlign: props.attributes.alignment } 
              },
                    el(RichText,{
                        tagName: 'div',
                        className: 'ab-pric-tlt',
                        placeholder: __('Price Title', 'amp-blocks'),
                        style: { color: props.attributes.pric_tlt_color,},                             
                        autoFocus: true,                               
                        value: item.pric_tlt,
                        onChange : function( event ){
                        var newObject = Object.assign({}, item, {
                            pric_tlt: event
                        });
                        return props.setAttributes({
                            items: [].concat(_cloneArray(props.attributes.items.filter(function (itemFilter) {
                            return itemFilter.index != item.index;
                            })), [newObject])
                        });
                        }
                    }),

      
                  el(RichText,{
                    tagName: 'div',
                    className: 'ab-pric-lbl',
                    placeholder: __('Price Label', 'amp-blocks'),
                    style: { color: props.attributes.pric_lbl_color,},                             
                    autoFocus: true,                               
                    value: item.pric_lbl,
                    onChange : function( event ){
                      var newObject = Object.assign({}, item, {
                        pric_lbl: event
                      });
                      return props.setAttributes({
                        items: [].concat(_cloneArray(props.attributes.items.filter(function (itemFilter) {
                          return itemFilter.index != item.index;
                        })), [newObject])
                      });
                     }
                    
                  }),
      
                  el(RichText,{
                    tagName: 'div',
                    className: 'ab-pric-amnt',
                    placeholder: __('0', 'amp-blocks'),
                    style: { color: props.attributes.pric_amnt_color,},                             
                    autoFocus: true,                               
                    value: item.pric_amnt,
      
                    onChange : function( event ){
                      var newObject = Object.assign({}, item, {
                        pric_amnt: event
                      });
                      return props.setAttributes({
                        items: [].concat(_cloneArray(props.attributes.items.filter(function (itemFilter) {
                          return itemFilter.index != item.index;
                        })), [newObject])
                      });
                     }
                  }),

                  el(RichText,{
                    tagName: 'a',
                    className: 'ab-pric-btn',
                    placeholder: __('Get Started', 'amp-blocks'),
                    style: { color: props.attributes.pric_btn_color,},                             
                    autoFocus: true,                               
                    value: item.pric_btn,
      
                    onChange : function( event ){
                      var newObject = Object.assign({}, item, {
                        pric_btn: event
                      });
                      return props.setAttributes({
                        items: [].concat(_cloneArray(props.attributes.items.filter(function (itemFilter) {
                          return itemFilter.index != item.index;
                        })), [newObject])
                      });
                     }
                  }),
      
                  el(IconButton,{
                    icon: "trash",
                    className: 'ab-trsh-btn',
                    onClick : function( event ){
                      const oldAttributes      =  attributes; 
                      const oldItems           =  attributes.items;  
                      const newTestimonials    =  oldItems
                      
                        .filter(function(itemFilter){
                            return itemFilter.index != item.index
                        }).map(function(t){                                          
                              if (t.index > oldItems.index) {
                                  t.index -= 1;
                              }
                              return t;
                        });
                        
                        newTestimonials.forEach(function(value, index){
                            newTestimonials[index]['pric_tlt']    = value['pric_tlt'];
                            newTestimonials[index]['pric_lbl']    = value['pric_lbl'];
                            newTestimonials[index]['pric_amnt']   = value['pric_amnt'];
                            newTestimonials[index]['pric_btn']    = value['pric_btn'];
                            newTestimonials[index]['index']       = index;
                            newTestimonials[index]['isSelected']  = false; 
                        });
                        
                        oldAttributes['items'] = newTestimonials;
                        props.setAttributes({
                          attributes: oldAttributes
                        });
                    } // on click function
                     
                  }),
      
              ) // </li> ends here

            }); // Items ends here
            var repeater =  el( IconButton, {
                icon: "insert",
                className: 'ab-repeater',            
                onClick: function() {              
                  return props.setAttributes({
                    items: [].concat(_cloneArray(props.attributes.items), [{
                      index: props.attributes.items.length,
                      alignment : '', 
                      pric_tlt:'',
                      pric_lbl: '',
                      pric_amnt: '',
                      pric_btn: '',
                    }])
                  });                            
                }
              },
              __('Add Your Pricing block ', 'amp-blocks')
            );
        
        var price_wrap= el('div',{className: 'price-wrap', 
          style: { textAlign: attributes.alignment} 
            },pric_hdng, pric_desc, el('ul', {className: "ab-pric-lst"}, itemlist), repeater);

            // Inpector Starts Here 
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
                className:'ampblocks-pric-color-stng',
                initialOpen: false,
                title:'Color Settings',
              },
                
                el('div',{className:"sub-hd-clr", },
                    el('span',{},__('Price Heading Color', 'amp-blocks')),
                    el('div',{},el(ColorPalette,{
                        className:"ampb-pric-tlt",
                        colors: colors,
                        onChange: function(event){
                        props.setAttributes( { price_hdng_color:event } );
                        } 
                    })),
                ),
                el('div',{className:"sub-hd-clr", },
                    el('span',{},__('Description Color', 'amp-blocks')),
                    el('div',{},el(ColorPalette,{
                        className:"ampb-pric-desc",
                        colors: colors,
                        onChange: function(event){
                        props.setAttributes( { price_desc_color:event } );
                        } 
                    })),
                ),
                el('div',{className:"sub-hd-clr", },
                    el('span',{},__('Price Title Color', 'amp-blocks')),
                    el('div',{},el(ColorPalette,{
                        className:"ampb-pric-tlt",
                        colors: colors,
                        onChange: function(event){
                        props.setAttributes( { pric_tlt_color:event } );
                        } 
                    })),
                ),
                el('div',{className:"sub-hd-clr", },
                    el('span',{},__('Price Label Color', 'amp-blocks')),
                    el('div',{},el(ColorPalette,{
                        className:"ampb-pric-lbl",
                        colors: colors,
                        onChange: function(event){
                        props.setAttributes( { pric_lbl_color:event } );
                        } 
                    })),
                ),
                el('div',{className:"sub-hd-clr", },
                    el('span',{},__('Price Color', 'amp-blocks')),
                    el('div',{},el(ColorPalette,{
                        className:"ampb-pric-amnt",
                        colors: colors,
                        onChange: function(event){
                        props.setAttributes( { pric_amnt_color:event } );
                        } 
                    })),
                ),
                el('div',{className:"sub-hd-clr", },
                    el('span',{},__('Price Button Color', 'amp-blocks')),
                    el('div',{},el(ColorPalette,{
                        className:"ampb-pric-btn",
                        colors: colors,
                        onChange: function(event){
                        props.setAttributes( { pric_btn_color:event } );
                        } 
                    })),
                ),
 
              ), // Color Settings Ends

              ),
              price_wrap
            ];


        },// edit ends here

        save: function( props ) {

            // var pric_hdng = el( 'h2', {
            //     className: 'ab-pri-hdng',
            //      style: { color: props.attributes.price_hdng_color},
            //   }, props.attributes.price_hdng);

            // var pric_desc = el( 'span', {
            //     className: 'ab-pri-desc',
            //      style: { color: props.attributes.price_desc_color},
            //   }, props.attributes.price_desc);
              
            //   var pricewrap = el( 'div',{className: 'price-wrap', 
            //                                style: { textAlign: props.attributes.alignment } 
            //                       },pric_hdng, pric_desc);
    
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
