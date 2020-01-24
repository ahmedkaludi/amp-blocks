/**
 * BLOCK: my-test-block
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */
import edit from './edit';
const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType('ampblocks/video', {
    title: __('Video'), // Block title.
    icon: 'format-video', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
    category: 'amp-blocks', // Block category
    keywords: [ //Keywords
        __('video'),
        __('videos')
    ],
    attributes: { //Attributes
        videoSource: {
            type: Boolean,
            default: false
        },
        video: {
            type: 'string',
        },
        width: {
            type: 'number',
        },
        height: {
            type: 'number',
        },
    },
    edit,
    /**
     * The save function defines the way in which the different attributes should be combined
     * into the final markup, which is then serialized by Gutenberg into post_content.
     *
     * The "save" property must be specified and must be a valid function.
     *
     * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
     */
    save({ attributes }) {
        const { video, videoSource, width, height } = attributes;
        const getId = (url) => {
            let name = 'v';
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return '//www.youtube.com/embed/' + decodeURIComponent(results[2].replace(/\+/g, " "));
        }
        let displayvideo = (video) => {
            if (videoSource) {
                return (
                    <div className="v-c">
                        <iframe width="100%" height="100%" className='video-item' src={getId(video)} />
                    </div>
                )
            } else {
                //Loops throug the video
                if (typeof video !== 'undefined') {
                    return (
                        <div className="v-c">
                            <video controls width="100%" height="100%" className=' video-item' src={video} style={{
                            maxWidth: width + 'px',
                            maxHeight: height + 'px',
                        }} />
                        </div>
                    )
                } else {
                    return ("");
                }
            }
        };
        return (
            <div className="v">
                {displayvideo(video)}
            </div>
        )
    },
});
