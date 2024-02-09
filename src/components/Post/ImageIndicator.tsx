import React from 'react';

interface ImageIndicatorProps {
    images: number; // Assuming images is the count of images
    currentImageIndex: number;
    handleIndexChange: (index: number) => void;
}

const ImageIndicator: React.FC<ImageIndicatorProps> = ({
    images,
    currentImageIndex,
    handleIndexChange,
}) => {
    return (
        <div className="flex gap-x-2">
            {Array.from({ length: images }).map((_, index) => (
                <div
                    key={index}
                    className={`rounded-3xl h-2 w-2 ${
                        index === currentImageIndex - 1
                            ? 'bg-white'
                            : 'bg-zinc-800'
                    }`}
                    // Assuming you want to handle onClick to change the image based on the index
                    onClick={() => handleIndexChange(index + 1)}
                ></div>
            ))}
        </div>
    );
};

export default ImageIndicator;
