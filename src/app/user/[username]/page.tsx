'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, Image } from '@nextui-org/react';
import {
    CakeIcon,
    ClockIcon,
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

const UserPage = ({ params }: { params: { username: string } }) => {
    const [profileData, setProfileData] = useState<UserType>({
        fullName: undefined,
    } as UserType);
    const [isOwner, setIsOwner] = useState<boolean | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [bannerLoading, setBannerLoading] = useState(true);
    const [bannerUrl, setBannerUrl] = useState(``);

    const [openedEditPopup, setOpenedEditPopup] = useState(false);

    const [avatarLoading, setAvatarLoading] = useState(true);
    const [avatarUrl, setAvatarUrl] = useState(``);

    const [currentUploadType, setCurrentUploadType] = useState('');

    const isVisitorOwner = async (username: string) => {
        const session = await getSession();
        setIsOwner(session?.user.username == username);
    };

    const fetchUserData = async (username: string) => {
        try {
            const response = await fetch(`/api/user/${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            /*             await new Promise<void>((resolve) => {
                setTimeout(() => {
                    console.log('alohas');
                    resolve(); // Resolve the promise after the timeout
                }, 3000);
            }); */

            // For delaying animation
            isVisitorOwner(params.username);

            if (response.ok) {
                const data = await response.json();

                // banner
                setBannerUrl(
                    `http://localhost:3000/api/images/banner/${
                        data.user.id
                    }?timestamp=${Date.now()}`
                );
                setBannerLoading(false);

                // avatar
                setAvatarUrl(
                    `http://localhost:3000/api/images/avatar/${
                        data.user.id
                    }?timestamp=${Date.now()}`
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
                            const response = await fetch(
                                `/api/images/${type}`,
                                {
                                    method: 'POST',
                                    body: dataSend,
                                }
                            );

                            if (response.ok) {
                                if (type === 'banner') {
                                    setBannerUrl(
                                        `http://localhost:3000/api/images/banner/${
                                            profileData.id
                                        }?timestamp=${Date.now()}`
                                    );
                                    setBannerLoading(false);
                                } else {
                                    setAvatarUrl(
                                        `http://localhost:3000/api/images/avatar/${
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

    const followUser = () => {
        // Follows the user and handles if it is already followed
    };

    return (
        <main className="flex min-h-screen flex-col">
            <div
                className="absolute z-50 avatar-edit flex items-center justify-center"
                style={{ height: '250px', paddingLeft: '150px', top: '350px' }}
            >
                {!isOwner ? (
                    ''
                ) : (
                    <div className="avatar-edit-buttons fixed gap-x-4 flex z-10">
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
                                setCurrentUploadType('avatar');
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
                        className="border-d"
                        style={{ maxWidth: 'auto', height: '100%' }}
                        removeWrapper={true}
                    ></Image>
                ) : (
                    <div
                        className="pulsating-span"
                        style={{ aspectRatio: '1 / 1', height: '100%' }}
                    ></div>
                )}
            </div>

            <div
                className="w-full border-b image-edit flex items-center justify-center"
                style={{
                    maxHeight: '450px',
                    minHeight: '450px',
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
                    style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: '0px',
                        display: 'block',
                    }}
                    removeWrapper={true}
                ></Image>
            </div>
            <div className="w-full">
                <div
                    className="flex pt-6"
                    style={{ paddingLeft: '450px', paddingRight: '150px' }}
                >
                    <div className="flex items-end justify-between grow">
                        <div className="w-full">
                            <div className="w-full flex justify-between items-center">
                                <h1>
                                    {!profileData.username ? (
                                        <span className="pulsating-span">
                                            usernamereallylong
                                        </span>
                                    ) : (
                                        profileData.username
                                    )}
                                </h1>
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
                                            onClick={() =>
                                                setOpenedEditPopup(true)
                                            }
                                            endContent={
                                                <PencilIcon className="h-1/2" />
                                            }
                                        >
                                            Editar Perfil
                                        </Button>
                                    )}
                                    {isOwner !== null && !isOwner && (
                                        <StartDM />
                                    )}
                                    {isOwner === null && (
                                        <span className="pulsating-span">
                                            Place
                                        </span>
                                    )}
                                </div>
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
                            <div className="flex mt-4 gap-x-4 w-full">
                                <div className="flex">
                                    <p>
                                        {profileData.followers ? (
                                            <>
                                                <b>
                                                    {
                                                        profileData.followers
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
                                </div>
                                <div className="flex">
                                    <p>
                                        {profileData.following ? (
                                            <>
                                                <b>
                                                    {
                                                        profileData.following
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
                                            style={{ maxHeight: '50px' }}
                                            className="flex items-center gap-x-2"
                                        >
                                            <div style={{ height: '26px' }}>
                                                <PencilIcon
                                                    className="h-full"
                                                    style={{ padding: '2px' }}
                                                />
                                            </div>
                                            {profileData.biography}
                                        </li>
                                    )}
                                    {!profileData.birthDate ? (
                                        ''
                                    ) : (
                                        <li
                                            style={{ maxHeight: '50px' }}
                                            className="flex items-center gap-x-2"
                                        >
                                            <div style={{ height: '26px' }}>
                                                <CakeIcon
                                                    className="h-full"
                                                    style={{ padding: '2px' }}
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
                                            style={{ maxHeight: '50px' }}
                                            className="flex items-center gap-x-2"
                                        >
                                            <div style={{ height: '26px' }}>
                                                <MapIcon className="h-full" />
                                            </div>
                                            {profileData.location}
                                        </li>
                                    )}
                                    {profileData.createdAt ? (
                                        <li
                                            style={{ maxHeight: '50px' }}
                                            className="flex items-center gap-x-2"
                                        >
                                            <div style={{ height: '26px' }}>
                                                <ClockIcon className="h-full" />
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
        </main>
    );
};

export default UserPage;
