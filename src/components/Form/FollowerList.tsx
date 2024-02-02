import UserType from '@/types/user';
import React, { useEffect, useState } from 'react';
import { Button, Image, Link } from '@nextui-org/react';
import FollowUser from '../userActions/FollowUser';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';

interface FollowerListProps {
    isActive: boolean;
    setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
    userData: UserType;
}

interface FollowerData {
    data: any[];
    message: string;
    type: string;
}

const FollowerList: React.FC<FollowerListProps> = ({
    isActive,
    setIsActive,
    userData,
}) => {
    const [followerData, setFollowerData] = useState<any[]>([]);
    const [session, setSession] = useState<Session | null>();

    const fetchfollowers = async () => {
        const response = await fetch(`/api/user/${userData.id}/followers`);

        if (response.ok) {
            const data: FollowerData = await response.json();
            console.log(data.data);
            return data.data;
        } else {
            console.error(response.statusText);
        }
        return [];
    };

    useEffect(() => {
        const fetchAllUserFollowers = async () => {
            const session = await getSession();
            setSession(session);

            const data = await fetchfollowers();
            setFollowerData(data);
        };

        fetchAllUserFollowers();
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
                        className="border-d blurred-bg-color h-full lg:w-2/3 md:w-3/4 sm:w-full flex flex-col justify-between blurred-background-form lg:px-14 md:px-14 sm:px-6 pb-10 max-w-lg"
                        style={{
                            zIndex: '100',
                        }}
                    >
                        <div className="w-full flex items-center flex-col mt-10">
                            <h1>Seguidores</h1>
                        </div>
                        <div
                            className="flex flex-col flex-grow justify-between my-14"
                            style={{ overflowY: 'auto' }}
                        >
                            <ul>
                                {followerData.map((user) => (
                                    <li
                                        key={user.id}
                                        className="flex w-full items-center mb-10"
                                    >
                                        <div className="h-20">
                                            <Image
                                                alt="default"
                                                src={`/api/image/avatar/${user.follower.id}`}
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
                                                            href={`/user/${user.follower.username}`}
                                                            color="secondary"
                                                        >
                                                            {
                                                                user.follower
                                                                    .username
                                                            }
                                                        </Link>
                                                    </b>
                                                </h2>
                                                <p style={{ color: '#333' }}>
                                                    {user.follower.biography}
                                                </p>
                                            </div>
                                            <div>
                                                {session?.user.id ===
                                                user.follower.id ? (
                                                    <Button
                                                        variant="bordered"
                                                        color="secondary"
                                                        isDisabled={true}
                                                    >
                                                        Você
                                                    </Button>
                                                ) : (
                                                    <FollowUser
                                                        userData={user.follower}
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

export default FollowerList;
