import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconFilled } from '@heroicons/react/24/solid';
import { Button } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';

interface LikePostProps {
    post: any;
}

const LikePost: React.FC<LikePostProps> = ({ post }) => {
    const [liked, setLiked] = useState(false);
    const [realtimeUpdate, setRealtimeUpdate] = useState(post.likes.length);

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
            const response = await fetch(`/api/post/${post.id}/like`, {
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
            const response = await fetch(`/api/post/${post.id}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setRealtimeUpdate(realtimeUpdate + 1);
                setLiked(true);
            }
        } catch (e: any) {
            console.error('Error:', e.message);
        }
    };

    const unlikePost = async () => {
        try {
            const response = await fetch(`/api/post/${post.id}/like`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setRealtimeUpdate(realtimeUpdate - 1);
                setLiked(false);
            }
        } catch (e: any) {
            console.error('Error:', e.message);
        }
    };

    return (
        <Button
            variant="bordered"
            color={liked ? 'danger' : 'secondary'}
            onClick={handleLike}
            isIconOnly={true}
            style={{ border: 'none' }}
            startContent={
                liked ? (
                    <HeartIconFilled className="h-2/3 mr-2" />
                ) : (
                    <HeartIcon className="h-2/3 mr-2" />
                )
            }
        >
            {realtimeUpdate}
        </Button>
    );
};

export default LikePost;
