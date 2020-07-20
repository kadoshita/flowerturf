import React from 'react';
import Youtube from 'react-youtube';

type YoutubeViewProp = {
    videoId: string
};

const YoutubeView = (props: YoutubeViewProp) => {
    return (
        <Youtube
            videoId={props.videoId}
            opts={{
                width: '640',
                height: '480',
                playerVars: {
                    autoplay: 1
                }
            }}>
        </Youtube>
    );
};

export default YoutubeView;