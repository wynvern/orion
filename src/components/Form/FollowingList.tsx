import UserType from '@/types/user';
import React, { useEffect, useState } from 'react';
import { Button, Image, Link } from '@nextui-org/react';
import FollowUser from '../userActions/FollowUser';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';

interface FollowingListProps {
    isActive: boolean;
    setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
    userData: UserType;
}

interface FollowingData {
    data: any[];
    message: string;
    type: string;
}

const FollowingList: React.FC<FollowingListProps> = ({
    isActive,
    setIsActive,
    userData,
}) => {
    const [followingData, setFollowingData] = useState<any[]>([]);
    const [session, setSession] = useState<Session | null>();

    const fetchfollowing = async () => {
        const response = await fetch(`/api/user/${userData.id}/following`);

        if (response.ok) {
            const data: FollowingData = await response.json();
            return data.data;
        } else {
            console.error(response.statusText);
        }
        return [];
    };

    useEffect(() => {
        const fetchAllUserFollowing = async () => {
            const session = await getSession();
            setSession(session);

            const data = await fetchfollowing();
            setFollowingData(data);
        };

        fetchAllUserFollowing();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {isActive && (
                <div
                    style={{
                        opacity: '0',
                    }}
                    className={`fixed inset-0 flex items-center justify-center z-50 py-6 ${
                        isActive ? 'active-popup' : ''
                    }`}
                >
                    {/* Background blur effect */}
                    <div
                        onClick={() => {
                            setIsActive(false);
                        }}
                        className="fixed inset-0 bg-black opacity-50"
                    ></div>

                    {/* Popup container */}
                    <div
                        className="border-d h-full lg:w-1/2 md:w-1/2 sm:w-2/3 flex flex-col justify-between  background-bg px-14 pb-10"
                        style={{
                            zIndex: '100',
                        }}
                    >
                        <div className="w-full flex items-center flex-col mt-10">
                            <h1>Seguindo</h1>
                        </div>
                        <div
                            className="flex flex-col flex-grow justify-between my-14"
                            style={{ overflowY: 'auto' }}
                        >
                            <ul>
                                {followingData.map((user) => (
                                    <li
                                        key={user.id}
                                        className="flex w-full items-center mb-10"
                                    >
                                        <div className="h-20">
                                            <Image
                                                alt="default"
                                                src={`/api/image/avatar/${user.following.id}`}
                                                className={`border-d`}
                                                style={{
                                                    maxWidth: 'auto',
                                                    height: '100%',
                                                }}
                                                removeWrapper={true}
                                            ></Image>
                                        </div>
                                        <div className="grow flex justify-between">
                                            <div className="ml-6 flex items-start flex-col justify-center">
                                                <h2>
                                                    <b>
                                                        <Link
                                                            href={`/user/${user.following.username}`}
                                                            color="secondary"
                                                        >
                                                            {
                                                                user.following
                                                                    .username
                                                            }
                                                        </Link>
                                                    </b>
                                                </h2>
                                                <p style={{ color: '#333' }}>
                                                    {user.following.biography}
                                                </p>
                                            </div>
                                            <div>
                                                {session?.user.id ===
                                                user.following.id ? (
                                                    <Button
                                                        variant="bordered"
                                                        color="secondary"
                                                        isDisabled={true}
                                                    >
                                                        Você
                                                    </Button>
                                                ) : (
                                                    <FollowUser
                                                        userData={
                                                            user.following
                                                        }
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FollowingList;
