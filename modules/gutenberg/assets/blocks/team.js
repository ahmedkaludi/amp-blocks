
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
            
    blocks.registerBlockType( 'ampblocks/team', {
        title: __('Team', 'amp-blocks'),
        icon: 'buddicons-buddypress-logo',
        category: 'amp-blocks',
        keywords: ['team', 'Team'],
        
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
            team_tlt: {
                type: 'string',
                default : 'Our Team',
            },
            team_desc: {
                type: 'string',
                default: 'Our Team Consists Only of the Best Talents',
            },
            team_tlt_color:{
                type:'string',
                default:'#000',
              },
            team_desc_color: {
                type: 'string',
                default : '#333',
            },
            tm_name_color: {
                type: 'string',
                default : '#111',
            },
            tm_position_color: {
                type: 'string',
                default : '#111',
            },
            tm_desc_color: {
                type: 'string',
                default : '#333',
            },
            items: {           
                default: [{index: 0, 
                  testi_content: "",
                  mediaURL: ampblocksGutenbergTeam.media_url,
                  mediaID: null,
                  tm_name: "Raju Jeelaga",
                  tm_position : 'Developer',
                  tm_desc: "Description"
                }],
                selector: "blockquote.team",
                query: {
                  index: {            
                    type: 'number',                  
                    attribute: 'data-index',                  
                  },
                  mediaID: {
                    type: 'number'
                  },
                  mediaURL: {
                    type: 'string',
                  },
                  tm_name: {
                    type: 'string',
                  },
                  tm_position: {
                    type: 'string',
                  },
                  tm_desc: {
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



        var team_title = el(RichText,{
          tagName: 'h1',
          className: 'ab-team-tlt',
          style: { color: props.attributes.team_tlt_color,
           },                             
          autoFocus: true,                               
          value: attributes.team_tlt,
          onChange : function( event ){
            props.setAttributes( { team_tlt: event} );
          }
        });

        var team_descript = el(RichText,{
          tagName: 'span',
          className: 'ab-team_dsc',
          style: { color: props.attributes.team_desc_color,
           },                             
          autoFocus: true,                               
          value: attributes.team_desc,
          onChange : function( event ){
            props.setAttributes( { team_desc: event} );
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
                                    className: 'ab-tm-img',            
                                    onClick: obj.open,
                                    src:item.mediaURL
                                }            
                            )
                        }
        
                     }),

                    el(RichText,{
                        tagName: 'div',
                        className: 'ab-tm_nm',
                        placeholder: __('Name', 'amp-blocks'),
                        style: { color: props.attributes.tm_name_color,
                        },                             
                        autoFocus: true,                               
                        value: item.tm_name,
                        onChange : function( event ){
                        var newObject = Object.assign({}, item, {
                            tm_name: event
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
                    className: 'ab-tm-poistion',
                    placeholder: __('Position', 'amp-blocks'),
                    style: { color: props.attributes.tm_position_color,
                     },                             
                    autoFocus: true,                               
                    value: item.tm_position,
                    onChange : function( event ){
                      var newObject = Object.assign({}, item, {
                        tm_position: event
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
                    className: 'ab-tm-desc',
                    placeholder: __('Descrption', 'amp-blocks'),
                    style: { color: props.attributes.tm_desc_color,
                     },                             
                    autoFocus: true,                               
                    value: item.tm_desc,
      
                    onChange : function( event ){
                      var newObject = Object.assign({}, item, {
                        tm_desc: event
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
                            newTestimonials[index]['mediaURL']     = value['mediaURL'];
                            newTestimonials[index]['tm_name']      = value['tm_name'];
                            newTestimonials[index]['tm_position']  = value['tm_position'];
                            newTestimonials[index]['tm_desc']      = value['tm_desc'];
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
                      mediaURL:ampblocksGutenbergtestimonial.media_url,
                      tm_name:'',
                      tm_position: '',
                      tm_desc: '',
                    }])
                  });                            
                }
              },
              __('Add Your Team Member ', 'amp-blocks')
            );
        
        var team_blk_wrap= el('div',{className: 'ab-team-blk', 
          style: { textAlign: attributes.alignment} 
            },team_title, team_descript, itemlist, repeater);

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
                className:'ampblocks-tst-color-stng',
                initialOpen: false,
                title:'Color Settings',
              },
                
              el('div',{className:"sub-hd-clr", },
                  el('span',{},__('Heading Color', 'amp-blocks')),
                  el('div',{},el(ColorPalette,{
                    className:"ampb-team-tlt",
                    colors: colors,
                    onChange: function(event){
                      props.setAttributes( { team_tlt_color:event } );
                    } 
                  })),
              ),
              el('div',{className:"sub-hd-clr", },
                  el('span',{},__('Description Color', 'amp-blocks')),
                  el('div',{},el(ColorPalette,{
                    className:"ampb-team-desc",
                    colors: colors,
                    onChange: function(event){
                      props.setAttributes( { team_desc_color:event } );
                    } 
                  })),
              ),
              el('div',{className:"sub-hd-clr", },
                  el('span',{},__('Name Text Color', 'amp-blocks')),
                  el('div',{},el(ColorPalette,{
                    className:"ampb-tm-name",
                    colors: colors,
                    onChange: function(event){
                      props.setAttributes( { tm_name_color:event } );
                    } 
                  })),
              ),
              el('div',{className:"sub-hd-clr", },
                  el('span',{},__('Position Text Color', 'amp-blocks')),
                  el('div',{},el(ColorPalette,{
                    className:"ampb-tm-position",
                    colors: colors,
                    onChange: function(event){
                      props.setAttributes( { tm_position_color:event } );
                    } 
                  })),
              ),
              el('div',{className:"sub-hd-clr", },
                  el('span',{},__('Content Color', 'amp-blocks')),
                  el('div',{},el(ColorPalette,{
                    className:"ampb-tm-cntn",
                    colors: colors,
                    onChange: function(event){
                      props.setAttributes( { tm_desc_color:event } );
                    } 
                  })),
              ),
                  

              ), // Color Settings Ends

              ),
              team_blk_wrap
            ];

        },// edit ends here

        save: function( props ) {

            var tm_tlt = el('h1',{
                className: 'ab-team-tlt',
                style: { color: props.attributes.team_tlt_color }
                }, props.attributes.team_tlt );

            var tm_desc = el( 'span', {
                className: 'ab-team_dsc',
                style: { color: props.attributes.team_desc_color }
                }, props.attributes.team_desc );
              

            

            var team_wrap = el('div',{
                className: 'ab-team-blk',
                style: { textAlign: props.attributes.alignment } 
            }, tm_tlt, tm_desc );

          return team_wrap;

          } // Save ends here
    } );
}(
    window.wp.blocks,
    window.wp.element,
    window.wp.blockEditor,
    window.wp.components,
    window.wp.i18n,
) );
