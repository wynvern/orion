import React from 'react';
import { Button } from '@nextui-org/react';
import UserType from '@/types/user';

interface FollowUserProps {
    userData: UserType;
}

const FollowUser: React.FC<FollowUserProps> = ({ userData }) => {
    const isFollowing = async () => {
        try {
            const response = await fetch(`/api/follow/${userData.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
            }
        } catch (e: any) {
            console.error('Error:', e.message);
        }
    };

    const handleFollow;

    return (
        <Button variant="solid" color="primary" onClick={handleFollower}>
            Seguir
        </Button>
    );
};

export default FollowUser;
