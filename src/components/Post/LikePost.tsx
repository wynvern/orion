import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconFilled } from '@heroicons/react/24/solid';
import { Button } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';

interface LikePostProps {
    postUuid: string;
}

const LikePost: React.FC<LikePostProps> = ({ postUuid }) => {
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const fetchFirstTime = async () => {
            const isLikedNow = await fetchIsLiked();

            if (isLikedNow) {
                setLiked(true);
            } else {
                setLiked(false);
            }
        };

        fetchFirstTime();
    });

    const handleLike = async () => {
        const isLikedNow = await fetchIsLiked();

        if (!isLikedNow) {
            likePost();
        } else {
            unlikePost();
        }
    };

    const fetchIsLiked = async () => {
        try {
            const response = await fetch(`/api/post/${postUuid}/like`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data.type === 'post-liked') {
                    return true;
                } else if (data.type === 'post-not-liked') {
                    return false;
                }
            }
        } catch (e: any) {
            console.error('Error:', e.message);
        }
    };

    const likePost = async () => {
        try {
            const response = await fetch(`/api/post/${postUuid}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setLiked(true);
            }
        } catch (e: any) {
            console.error('Error:', e.message);
        }
    };

    const unlikePost = async () => {
        try {
            const response = await fetch(`/api/post/${postUuid}/like`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setLiked(false);
            }
        } catch (e: any) {
            console.error('Error:', e.message);
        }
    };

    return (
        <Button
            isIconOnly={true}
            variant="ghost"
            color={liked ? 'danger' : 'secondary'}
            onClick={handleLike}
            style={{
                padding: '8px',
                border: 'none',
            }}
        >
            {liked ? <HeartIconFilled /> : <HeartIcon />}
        </Button>
    );
};

export default LikePost;
