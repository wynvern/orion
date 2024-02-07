import UserType from '@/types/user';
import { Session } from 'next-auth';
import { Button, Image, Link } from '@nextui-org/react';
import React, { use } from 'react';
import FollowUser from '../userActions/FollowUser';

interface UserListProps {
    users: UserType[];
    session: Session | null | undefined;
}

const UserList: React.FC<UserListProps> = ({ users, session }) => {
    console.log(users);

    return (
        <div className="flex gap-y-6 flex-col">
            {users.map((user: UserType, index) => (
                <div key={index}>
                    <div className="flex w-full justify-between">
                        <Link href={`/user/${user.username}`} color="secondary">
                            <div className="flex items-center gap-x-4">
                                <div className="h-14 w-14">
                                    <Image
                                        src={`/api/image/avatar/${user.id}`}
                                        removeWrapper={true}
                                        className="w-full h-full"
                                    />
                                </div>
                                <div>
                                    <b>{user.username}</b>
                                    <p>{user.fullName}</p>
                                </div>
                            </div>
                        </Link>
                        <div className="flex items-center">
                            {session?.user.id === user.id ? (
                                <Button
                                    variant="bordered"
                                    color="secondary"
                                    isDisabled={true}
                                >
                                    Você
                                </Button>
                            ) : (
                                <FollowUser userData={user} />
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UserList;
