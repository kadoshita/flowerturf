import React, { useState, useEffect } from 'react';
import Youtube from 'react-youtube';

type YoutubeViewProp = {
    videoId: string,
    onPositionChange: Function,
    onPause: Function,
    youtubeVideoStartPosition: number,
    isPause: boolean
};

const YoutubeView = (props: YoutubeViewProp) => {
    const [youtubeTarget, setYoutubeTarget] = useState<any>();

    useEffect(() => {
        if (props.isPause) {
            if (youtubeTarget) {
                youtubeTarget.pauseVideo();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.isPause]);
    return (
        <Youtube
            videoId={props.videoId}
            opts={{
                width: '640',
                height: '480',
                playerVars: {
                    autoplay: 1,
                    start: props.youtubeVideoStartPosition
                }
            }}
            onReady={e => setYoutubeTarget(e.target)}
            onStateChange={e => {
                const { currentTime } = e.target.playerInfo;
                if (currentTime > 1) {
                    props.onPositionChange(e.target.playerInfo.currentTime);
                }
            }}
            onPause={e => {
                props.onPause();
            }}
        >
        </Youtube>
    );
};

export default YoutubeView;