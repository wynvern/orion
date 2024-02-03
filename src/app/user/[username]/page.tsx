'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, Image, Link } from '@nextui-org/react';
import {
    CakeIcon,
    CalendarIcon,
    MapIcon,
    PencilIcon,
    PhotoIcon,
    XMarkIcon,
} from '@heroicons/react/24/solid';
import formatTimestamp from '@/utils/formatTimesTamp';
import { getSession } from 'next-auth/react';
import UserType from '../../../types/user';
import FollowUser from '@/components/userActions/FollowUser';
import StartDM from '@/components/userActions/StartDM';
import UpdateProfile from '@/components/Form/UpdateProfile';
import FollowingList from '@/components/Form/FollowingList';
import { Session } from 'next-auth';
import FollowerList from '@/components/Form/FollowerList';

const UserPage = ({ params }: { params: { username: string } }) => {
    const [profileData, setProfileData] = useState<UserType>({
        fullName: undefined,
    } as UserType);
    const [isOwner, setIsOwner] = useState<boolean | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [bannerLoading, setBannerLoading] = useState(true);
    const [bannerUrl, setBannerUrl] = useState(``);
    const [session, setSession] = useState<Session | null>();

    const [openedEditPopup, setOpenedEditPopup] = useState(false);

    const [followerPopup, setFollowerPopup] = useState(false);
    const [followingPopup, setFollowingPopup] = useState(false);

    const [avatarLoading, setAvatarLoading] = useState(true);
    const [avatarUrl, setAvatarUrl] = useState(``);

    const [currentUploadType, setCurrentUploadType] = useState('');

    const isVisitorOwner = async (username: string) => {
        const session = await getSession();
        setSession(session);
        setIsOwner(session?.user.username == username);
    };

    const fetchUserData = async (username: string) => {
        try {
            const response = await fetch(`/api/search/user/${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // For delaying animation
            isVisitorOwner(params.username);

            if (response.ok) {
                const data = await response.json();

                // banner
                setBannerUrl(
                    `/api/image/banner/${data.user.id}?timestamp=${Date.now()}`
                );
                setBannerLoading(false);

                // avatar
                setAvatarUrl(
                    `/api/image/avatar/${data.user.id}?timestamp=${Date.now()}`
                );
                setAvatarLoading(false);
                setProfileData(data.user);
            }
        } catch (e: any) {
            console.error('Error:', e.message);
        }
    };

    useEffect(() => {
        fetchUserData(params.username);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.username]);

    const handleFileSelect = async () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleImageUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
        type: string
    ) => {
        type === 'banner' ? setBannerLoading(true) : setAvatarLoading(true);
        const file = event.target.files?.[0];

        if (file) {
            try {
                // Convert the image to base64
                const reader = new FileReader();

                reader.onloadend = async () => {
                    try {
                        const base64Image = reader.result
                            ?.toString()
                            .split(',')[1];

                        if (base64Image) {
                            const dataSend = JSON.stringify({
                                image: base64Image,
                            });
                            const response = await fetch(`/api/image/${type}`, {
                                method: 'POST',
                                body: dataSend,
                            });

                            if (response.ok) {
                                if (type === 'banner') {
                                    setBannerUrl(
                                        `/api/image/banner/${
                                            profileData.id
                                        }?timestamp=${Date.now()}`
                                    );
                                    setBannerLoading(false);
                                } else {
                                    setAvatarUrl(
                                        `/api/image/avatar/${
                                            profileData.id
                                        }?timestamp=${Date.now()}`
                                    );
                                    setAvatarLoading(false);
                                }
                            } else {
                                console.error('Image upload failed');
                            }
                        }
                    } catch (error: any) {
                        console.error(
                            'Error processing image data:',
                            error.message
                        );
                    }
                };

                // Read the file as base64
                reader.readAsDataURL(file);
            } catch (error: any) {
                console.error('Error reading image file:', error.message);
            }
        }
    };

    return (
        <main className="flex h-full flex-col">
            <div
                className="w-full h-full border-b image-edit flex items-center justify-center sm:h-1/3 md:h-1/2 lg:h-1/2"
                style={{
                    overflow: 'hidden',
                }}
            >
                {!isOwner ? (
                    ''
                ) : (
                    <div className="image-edit-buttons absolute gap-x-4 flex">
                        <Button
                            variant="bordered"
                            color="secondary"
                            isIconOnly={true}
                            style={{ padding: '6px' }}
                        >
                            <XMarkIcon />
                        </Button>
                        <Button
                            onClick={() => {
                                setCurrentUploadType('banner');
                                handleFileSelect();
                            }}
                            variant="bordered"
                            color="secondary"
                            isIconOnly={true}
                            style={{ padding: '6px' }}
                        >
                            <PhotoIcon />
                        </Button>
                    </div>
                )}
                <Image
                    alt="default"
                    isLoading={bannerLoading}
                    src={bannerUrl}
                    className={isOwner ? 'image-img' : ''}
                    style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: '0px',
                        display: 'block',
                    }}
                    removeWrapper={true}
                ></Image>
            </div>

            <div>
                <div className="flex pt-6 2xl:px-60 lg:px-40 md:px-10 sm:px-6">
                    <div className="flex items-end justify-between grow">
                        <div className="w-full">
                            <div className="flex sm:flex-col md:flex-row lg:flex-row">
                                <div className="w-40 h-40 mr-6">
                                    <div className="avatar-edit flex items-center justify-center h-full w-full">
                                        {!isOwner ? (
                                            ''
                                        ) : (
                                            <div className="avatar-edit-buttons absolute gap-x-4 flex z-10">
                                                <Button
                                                    variant="bordered"
                                                    color="secondary"
                                                    isIconOnly={true}
                                                    style={{ padding: '6px' }}
                                                >
                                                    <XMarkIcon />
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        setCurrentUploadType(
                                                            'avatar'
                                                        );
                                                        handleFileSelect();
                                                    }}
                                                    variant="bordered"
                                                    color="secondary"
                                                    isIconOnly={true}
                                                    style={{ padding: '6px' }}
                                                >
                                                    <PhotoIcon />
                                                </Button>
                                            </div>
                                        )}
                                        {avatarUrl ? (
                                            <Image
                                                alt="default"
                                                isLoading={avatarLoading}
                                                src={avatarUrl}
                                                className={`border-d ${
                                                    isOwner ? 'avatar-img' : ''
                                                }`}
                                                style={{
                                                    maxWidth: 'auto',
                                                    height: '100%',
                                                }}
                                                removeWrapper={true}
                                            ></Image>
                                        ) : (
                                            <div
                                                className="pulsating-span"
                                                style={{
                                                    aspectRatio: '1 / 1',
                                                    height: '100%',
                                                }}
                                            ></div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    {/* Div to make the content be same height as image */}
                                    <div>
                                        <h1>
                                            {!profileData.username ? (
                                                <span className="pulsating-span">
                                                    usernamereal
                                                </span>
                                            ) : (
                                                profileData.username
                                            )}
                                        </h1>
                                    </div>
                                    <p className="pt-1">
                                        {profileData.fullName === undefined ? (
                                            <span className="pulsating-span">
                                                usernamereall
                                            </span>
                                        ) : profileData.fullName ? (
                                            profileData.fullName
                                        ) : (
                                            ''
                                        )}
                                    </p>
                                    <div className="flex mt-6 gap-x-4 w-full">
                                        <div className="flex">
                                            <Link color="secondary">
                                                <p
                                                    onClick={() =>
                                                        setFollowerPopup(true)
                                                    }
                                                >
                                                    {profileData.following ? (
                                                        <>
                                                            <b>
                                                                {
                                                                    profileData
                                                                        .following
                                                                        .length
                                                                }
                                                            </b>{' '}
                                                            Seguidores
                                                        </>
                                                    ) : (
                                                        <span className="pulsating-span">
                                                            0 Seguindo
                                                        </span>
                                                    )}
                                                </p>
                                            </Link>
                                        </div>
                                        <div className="flex">
                                            <Link color="secondary">
                                                <p
                                                    onClick={() =>
                                                        setFollowingPopup(true)
                                                    }
                                                >
                                                    {profileData.followers ? (
                                                        <>
                                                            <b>
                                                                {
                                                                    profileData
                                                                        .followers
                                                                        .length
                                                                }
                                                            </b>{' '}
                                                            Seguindo
                                                        </>
                                                    ) : (
                                                        <span className="pulsating-span">
                                                            0 Seguindo
                                                        </span>
                                                    )}
                                                </p>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="pt-6">
                                        <ul
                                            style={{ color: '#333' }}
                                            className="gap-y-3 grid"
                                        >
                                            {!profileData.biography ? (
                                                ''
                                            ) : (
                                                <li
                                                    style={{
                                                        maxHeight: '50px',
                                                    }}
                                                    className="flex items-center gap-x-2"
                                                >
                                                    <div
                                                        style={{
                                                            height: '26px',
                                                        }}
                                                    >
                                                        <PencilIcon
                                                            className="h-full"
                                                            style={{
                                                                padding: '2px',
                                                            }}
                                                        />
                                                    </div>
                                                    {profileData.biography}
                                                </li>
                                            )}
                                            {!profileData.birthDate ? (
                                                ''
                                            ) : (
                                                <li
                                                    style={{
                                                        maxHeight: '50px',
                                                    }}
                                                    className="flex items-center gap-x-2"
                                                >
                                                    <div
                                                        style={{
                                                            height: '26px',
                                                        }}
                                                    >
                                                        <CakeIcon
                                                            className="h-full"
                                                            style={{
                                                                padding: '2px',
                                                            }}
                                                        />
                                                    </div>
                                                    {`Nasceu em ${formatTimestamp(
                                                        profileData.birthDate
                                                    )}`}
                                                </li>
                                            )}
                                            {!profileData.location ? (
                                                ''
                                            ) : (
                                                <li
                                                    style={{
                                                        maxHeight: '50px',
                                                    }}
                                                    className="flex items-center gap-x-2"
                                                >
                                                    <div
                                                        style={{
                                                            height: '26px',
                                                        }}
                                                    >
                                                        <MapIcon className="h-full" />
                                                    </div>
                                                    {profileData.location}
                                                </li>
                                            )}
                                            {profileData.createdAt ? (
                                                <li
                                                    style={{
                                                        maxHeight: '50px',
                                                    }}
                                                    className="flex items-center gap-x-2"
                                                >
                                                    <div
                                                        style={{
                                                            height: '26px',
                                                        }}
                                                    >
                                                        <CalendarIcon className="h-full" />
                                                    </div>
                                                    {`Entrou em ${formatTimestamp(
                                                        profileData.createdAt
                                                    )}`}
                                                </li>
                                            ) : (
                                                <span className="pulsating-span">
                                                    Entrou em 20 de 20 de 2000
                                                </span>
                                            )}
                                            {profileData.createdAt ? (
                                                ''
                                            ) : (
                                                <span className="pulsating-span">
                                                    Entrou em 20 de 20 de 2000
                                                </span>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-start h-full pt-3">
                            <div className="flex gap-x-4">
                                {isOwner === null && (
                                    <span className="pulsating-span">
                                        Seguir doidadod
                                    </span>
                                )}
                                {isOwner !== null && !isOwner && (
                                    <FollowUser userData={profileData} />
                                )}
                                {isOwner !== null && isOwner && (
                                    <Button
                                        variant="ghost"
                                        color="secondary"
                                        style={{ lineHeight: '1.5' }}
                                        onClick={() => setOpenedEditPopup(true)}
                                        endContent={
                                            <PencilIcon className="h-1/2" />
                                        }
                                    >
                                        Editar Perfil
                                    </Button>
                                )}
                                {isOwner !== null && !isOwner && <StartDM />}
                                {isOwner === null && (
                                    <span className="pulsating-span">
                                        Place
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-20"></div>
            </div>

            {/* Hidden components that are activated via functions */}
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={(e) => handleImageUpload(e, currentUploadType)}
                accept="image/*"
            />
            {!profileData.username ? (
                ''
            ) : (
                <UpdateProfile
                    isActive={openedEditPopup}
                    setIsActive={setOpenedEditPopup}
                    userData={profileData}
                    handleProfileUpdate={() => {
                        fetchUserData(params.username);
                    }}
                ></UpdateProfile>
            )}
            {profileData.username ? (
                <FollowingList
                    isActive={followingPopup}
                    setIsActive={setFollowingPopup}
                    userData={profileData}
                />
            ) : (
                ''
            )}
            {profileData.username ? (
                <FollowerList
                    isActive={followerPopup}
                    setIsActive={setFollowerPopup}
                    userData={profileData}
                />
            ) : (
                ''
            )}
        </main>
    );
};

export default UserPage;
