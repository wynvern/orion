import { PauseIcon, PlayIcon } from '@heroicons/react/24/solid';
import { Button, Progress, Slider } from '@nextui-org/react';
import React, { useRef, useState, useEffect } from 'react';

interface VideoProps {
    src: string;
    className?: string;
    style?: React.CSSProperties;
}

const Video: React.FC<VideoProps> = ({ src, className, style }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isSeeking, setIsSeeking] = useState(false);

    useEffect(() => {
        const updateProgress = () => {
            if (videoRef.current && isSeeking) {
                const { currentTime, duration } = videoRef.current;
                const progressValue = (currentTime / duration) * 100;
                console.log('executing', currentTime);
                setCurrentTime(progressValue);
            }
        };
        if (videoRef.current) {
            videoRef.current.addEventListener('timeupdate', updateProgress);
            return () => {
                if (videoRef.current) {
                    videoRef.current.removeEventListener(
                        'timeupdate',
                        updateProgress
                    );
                }
            };
        }
    }, []);

    const playPauseHandler = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    const seekHandler = (value: number | number[]) => {
        console.log('seek');
        setIsSeeking(true);
        if (videoRef.current && typeof value === 'number') {
            const { duration } = videoRef.current;
            const currentTime = (value * duration) / 100;

            videoRef.current.currentTime = currentTime;

            setCurrentTime(value);
        }
    };

    return (
        <>
            <div className="absolute z-50 flex w-full items-center p-4 gap-x-4 bottom-0">
                <Slider
                    aria-label="Loading..."
                    value={currentTime}
                    className="max-w-md pl-2"
                    onChange={(num) => seekHandler(num)}
                />
                <Button
                    color="secondary"
                    variant="bordered"
                    className="border-none"
                    onClick={playPauseHandler}
                    isIconOnly={true}
                >
                    {isPlaying ? (
                        <PauseIcon className="h-2/3" />
                    ) : (
                        <PlayIcon className="h-2/3" />
                    )}
                </Button>
                <Button
                    onClick={() => {
                        if (videoRef.current) {
                            videoRef.current.currentTime = 10;
                        }
                    }}
                >
                    Clicar
                </Button>
            </div>
            <Video src={src}></Video>
        </>
    );
};

export default Video;
