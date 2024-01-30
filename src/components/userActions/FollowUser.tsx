'use client';

import React, { useEffect } from 'react';
import { Button } from '@nextui-org/react';
import UserType from '@/types/user';
import { getSession } from 'next-auth/react';

interface FollowUserProps {
    userData: UserType;
}

const FollowUser: React.FC<FollowUserProps> = ({ userData }) => {
    const [following, setFollowing] = React.useState(false);

    const isFollowing = async () => {
        try {
            const response = await fetch(`/api/user/${userData.id}/followers`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                const session = await getSession();

                const isFollowingUser = data.data.some(
                    (follower: { followerId: string }) => {
                        return follower.followerId === session?.user.id;
                    }
                );

                return isFollowingUser;
            }
        } catch (e: any) {
            console.error('Error:', e.message);
        }
        return false;
    };

    const handleFollow = async () => {
        try {
            if (following) {
                const response = await fetch(
                    `/api/user/${userData.id}/follow`,
                    {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (response.ok) {
                    setFollowing(false);
                }
            } else {
                const response = await fetch(
                    `/api/user/${userData.id}/follow`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (response.ok) {
                    setFollowing(true);
                }
            }
        } catch (e: any) {
            console.error('Error:', e.message);
        }
    };

    useEffect(() => {
        const checkFollowingStatus = async () => {
            const isCurrentlyFollowing = await isFollowing();
            setFollowing(isCurrentlyFollowing);
        };

        checkFollowingStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Button
            variant={following ? 'bordered' : 'solid'}
            color="primary"
            onClick={handleFollow}
        >
            {following ? 'Seguindo' : 'Seguir'}
        </Button>
    );
};

export default FollowUser;
