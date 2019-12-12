
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
          id: {
            source: "attribute",
            selector: ".carousel.slide",
            attribute: "id"
          },
          btn_clicked:{
            type:Boolean,
            default:false
          },
          alignment: {
            type: 'string',
            default: 'center',
          },
          testi_content_color:{
            type:'string',
            default:'#3b3170',
          },
          testi_authr_nm_color:{
            type:'string',
            default:'#3b3170',
          },
          testi_social_fld_nm_color:{
            type:'string',
            default:'#b8b8b8',
          },
          items: {           
            default: [],
            selector: "blockquote.testimonial",
            query: {
              index: {            
                type: 'number',                  
                attribute: 'data-index',                  
              },
              testi_content: {
                type: 'string',
              },
              mediaID: {
                type: 'number'
              },
              mediaURL: {
                type: 'string',
              },
              testi_authr_nm: {
                type: 'string',
              },
              testi_social_fld_nm: {
                type: 'string',
              },
              isSelected: {            
                type: 'boolean',
                default:false      
              },
              
            } // query ends
          } // Testimonial selector ends
        }, // attributes ends

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
        return el('li',{},
            el(RichText,{
              tagName: 'div',
              className: 'ab-tsti-cnt',
              placeholder: __('Enter the Testimonial', 'amp-blocks'),
              style: { color: props.attributes.testi_content_color,
              },                             
              autoFocus: true,                               
              value: item.testi_content,
              onChange : function( event ){
                var newObject = Object.assign({}, item, {
                  testi_content: event
                });
                return props.setAttributes({
                  items: [].concat(_cloneArray(props.attributes.items.filter(function (itemFilter) {
                    return itemFilter.index != item.index;
                  })), [newObject])
                });
               }
            }),

            el(MediaUpload, {
              onSelect: function(media){  
                var newObject = Object.assign({}, item, {
                  mediaURL: media.url
                });
                return props.setAttributes({
                  items: [].concat(_cloneArray(props.attributes.items.filter(function (itemFilter) {
                    return itemFilter.index != item.index;
                  })), [newObject])
                });
              },
    
             allowedTypes:[ "image" ],
             render:function(obj){
                 return el( 'img', {                  
                      className: 'ab-tst-img',            
                      onClick: obj.open,
                      src:item.mediaURL
                    }            
              )
             }

          }),

            el(RichText,{
              tagName: 'div',
              className: 'ab-tsti-nm',
              placeholder: __('Name', 'amp-blocks'),
              style: { color: props.attributes.testi_authr_nm_color,
               },                             
              autoFocus: true,                               
              value: item.testi_authr_nm,
              onChange : function( event ){
                var newObject = Object.assign({}, item, {
                  testi_authr_nm: event
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
              className: 'ab-tsti-spf',
              placeholder: __('Google', 'amp-blocks'),
              style: { color: props.attributes.testi_social_fld_nm_color,
               },                             
              autoFocus: true,                               
              value: item.testi_social_fld_nm,

              onChange : function( event ){
                var newObject = Object.assign({}, item, {
                  testi_social_fld_nm: event
                });
                return props.setAttributes({
                  items: [].concat(_cloneArray(props.attributes.items.filter(function (itemFilter) {
                    return itemFilter.index != item.index;
                  })), [newObject])
                });
               }
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
                alignment : 'center',                  
                testi_content: "You can Decide whether to create your site using UI Kit blocks or samples. The blocks can merge together in various combinations.",
                mediaURL:'http://localhost/ampdev/wp-content/uploads/2019/12/user-df-img.png',
                testi_authr_nm:'Raju Jeelaga',
                testi_social_fld_nm: 'GOOGLE',
              }])
            });                            
          }
        },
        __('Add a Testimonial', 'amp-blocks')
      );

       var parentdiv = el('div',{
         className: "ab-tsti-w",
         style: { textAlign: props.attributes.alignment }
       },
       itemlist,
       repeater  
       ); 

      // Inspector Controls Starts
       return [el(InspectorControls,
        {
         className:'ampblocks-btn-fields',
         key: 'inspector'   
        },
          el(PanelBody,
            {className:'ampblocks-tsti-layout-stng',
            initialOpen: true,
            title:'Layout Settings'   
            },
             
              //Display alignment toolbar within block controls.
              el('span',{className:"cntrl-lbl"},__('Alignment', 'amp-blocks')),
              el(AlignmentToolbar, {
                value: props.attributes.alignment,
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
                props.setAttributes( { testi_content_color:event
                   } );
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

       parentdiv
     ];

      }, // Edit Ends Here

        save: function( props ) {

          return null;

        } // Save ends here
        

        
    } ); // RegisterBlockType Ends
}(
    window.wp.blocks,
    window.wp.element,
    window.wp.blockEditor,
    window.wp.components,
    window.wp.i18n,
) );
