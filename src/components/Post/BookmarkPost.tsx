import { BookmarkIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconFilled } from '@heroicons/react/24/solid';
import { Button } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';

interface BookmarkPostProps {
    post: any;
}

const BookmarkPost: React.FC<BookmarkPostProps> = ({ post }) => {
    const [bookmarked, setBookmarked] = useState(false);
    const [realtimeUpdate, setRealtimeUpdate] = useState(post.bookmarks.length);

    useEffect(() => {
        const fetchFirstTime = async () => {
            const isBookmarkedNow = await fetchIsBookmarked();

            if (isBookmarkedNow) {
                setBookmarked(true);
            } else {
                setBookmarked(false);
            }
        };

        fetchFirstTime();
    }, []);

    const handleBookmark = async () => {
        const isBookmarkedNow = await fetchIsBookmarked();

        if (!isBookmarkedNow) {
            bookmarkPost();
        } else {
            unbookmarkPost();
        }
    };

    const fetchIsBookmarked = async () => {
        try {
            const response = await fetch(`/api/post/${post.id}/bookmark`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data.type === 'post-bookmarked') {
                    return true;
                } else if (data.type === 'post-not-bookmarked') {
                    return false;
                }
            }
        } catch (e: any) {
            console.error('Error:', e.message);
        }
    };

    const bookmarkPost = async () => {
        try {
            const response = await fetch(`/api/post/${post.id}/bookmark`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setBookmarked(true);
                setRealtimeUpdate(realtimeUpdate + 1);
            }
        } catch (e: any) {
            console.error('Error:', e.message);
        }
    };

    const unbookmarkPost = async () => {
        try {
            const response = await fetch(`/api/post/${post.id}/bookmark`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setBookmarked(false);
                setRealtimeUpdate(realtimeUpdate - 1);
            }
        } catch (e: any) {
            console.error('Error:', e.message);
        }
    };

    return (
        <Button
            variant="bordered"
            color="secondary"
            onClick={handleBookmark}
            style={{
                padding: '8px',
                border: 'none',
            }}
            startContent={
                bookmarked ? <BookmarkIconFilled /> : <BookmarkIcon />
            }
        >
            {realtimeUpdate}
        </Button>
    );
};

export default BookmarkPost;
