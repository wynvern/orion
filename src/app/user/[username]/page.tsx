'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, Image, Link, Tab, Tabs } from '@nextui-org/react';
import {
    BookmarkIcon,
    CakeIcon,
    CalendarIcon,
    CubeIcon,
    HeartIcon,
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
import PostItems from '@/components/Post/PostItems';

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

    const [likedPosts, setLikedPosts] = useState([]);
    const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
    const [postedPosts, setPostedPosts] = useState([]);
    const [selectedPosts, setSelectedPosts] = useState('posted');

    const isVisitorOwner = async (username: string) => {
        const session = await getSession();
        setSession(session);
        setIsOwner(session?.user.username == username);
    };

    const fetchUserData = async (username: string) => {
        try {
            const response = await fetch(
                `/api/search/user?username=${username}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            isVisitorOwner(params.username);

            if (response.ok) {
                const data = await response.json();

                // banner
                setBannerUrl(
                    `/api/image/banner/${
                        data.users[0].id
                    }?timestamp=${Date.now()}`
                );
                setBannerLoading(false);

                // avatar
                setAvatarUrl(
                    `/api/image/avatar/${
                        data.users[0].id
                    }?timestamp=${Date.now()}`
                );
                setAvatarLoading(false);

                // User posts, etc...
                await fecthPosts('bookmarked', data.users[0].id);
                await fecthPosts('liked', data.users[0].id);
                await fecthPosts('posted', data.users[0].id);

                setProfileData(data.users[0]);
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

    const fecthPosts = async (type: string, userId: string) => {
        try {
            const response = await fetch(
                `/api/search/post/${type}?userId=${userId}`
            );
            if (response.ok) {
                const data = await response.json();

                console.log(type, data);

                switch (type) {
                    case 'bookmarked':
                        setBookmarkedPosts(data.posts);
                    case 'liked':
                        setLikedPosts(data.posts);
                    case 'posted':
                        setPostedPosts(data.posts);
                }
            }
        } catch (error) {
            console.error(error);
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
        } else {
            setAvatarLoading(false);
            setBannerLoading(false);
        }
    };

    return (
        <main className="flex flex-col">
            <div className="w-full lg:h-96 md:h-96 sm:h-60">
                <div
                    className="w-full h-full image-edit flex items-center justify-center rounded-lg"
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
                                style={{ padding: '6px', border: 'none' }}
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
                                style={{ padding: '6px', border: 'none' }}
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
                            height: '100%',
                            borderRadius: '0px',
                            objectFit: 'cover',
                        }}
                        removeWrapper={true}
                    ></Image>
                </div>
            </div>

            <div className="flex pt-6 lg:px-60 md:px-10 sm:px-6">
                <div className="flex items-end justify-between grow">
                    <div className="w-full lg:-translate-y-0 md:-translate-y-0 sm:-translate-y-20 z-50">
                        <div className="flex sm:flex-col md:flex-row lg:flex-row">
                            <div className="w-40 h-40 mr-6">
                                <div className="avatar-edit flex items-center justify-center h-full w-full relative">
                                    {!isOwner ? (
                                        ''
                                    ) : (
                                        <div className="avatar-edit-buttons absolute gap-x-4 flex z-10">
                                            <Button
                                                variant="bordered"
                                                color="secondary"
                                                isIconOnly={true}
                                                style={{
                                                    padding: '6px',
                                                    border: 'none',
                                                }}
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
                                                style={{
                                                    padding: '6px',
                                                    border: 'none',
                                                }}
                                            >
                                                <PhotoIcon />
                                            </Button>
                                        </div>
                                    )}
                                    {profileData.status ? (
                                        <div
                                            className={`absolute w-6 h-6 bottom-0 right-0 rounded-full translate-x-1 translate-y-1 z-50 ${
                                                profileData.status === 'Online'
                                                    ? 'bg-online'
                                                    : 'transparent'
                                            }`}
                                        ></div>
                                    ) : (
                                        ''
                                    )}
                                    {avatarUrl ? (
                                        <Image
                                            alt="default"
                                            isLoading={avatarLoading}
                                            src={avatarUrl}
                                            className={`${
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
                                    <h1 className="sm:mt-4 md:mt-0 lg:mt-0">
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
                                <div className="flex lg:mt-6 md:mt-6 sm:mt-4 gap-x-4 w-full">
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
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-start h-full pt-3">
                        <div className="flex gap-x-4 h-14">
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
                                    color="default"
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
                                <span className="pulsating-span">Place</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full flex justify-center pb-4">
                <div className="flex">
                    <Button
                        variant="bordered"
                        onClick={() => setSelectedPosts('posted')}
                        color={
                            selectedPosts === 'posted' ? 'secondary' : 'default'
                        }
                        className="border-none h-14"
                    >
                        Posts
                        <CubeIcon className="h-1/2" />
                    </Button>
                    <Button
                        variant="bordered"
                        onClick={() => setSelectedPosts('bookmarked')}
                        color={
                            selectedPosts === 'bookmarked'
                                ? 'secondary'
                                : 'default'
                        }
                        className="border-none h-14"
                    >
                        Bookmarks
                        <BookmarkIcon className="h-1/2" />
                    </Button>
                    <Button
                        variant="bordered"
                        onClick={() => setSelectedPosts('liked')}
                        color={
                            selectedPosts === 'liked' ? 'secondary' : 'default'
                        }
                        className="border-none h-14"
                    >
                        Likes
                        <HeartIcon className="h-1/2" />
                    </Button>
                </div>
            </div>

            {profileData.id ? (
                <div className="flex h-full flex-col items-center pt-10 lg:px-60 md:px-40 sm:px-2 n-scroll h-min">
                    {selectedPosts === 'posted' && (
                        <PostItems
                            session={session}
                            posts={postedPosts}
                            handleUpdate={() =>
                                fecthPosts('posted', profileData.id)
                            }
                        />
                    )}
                    {selectedPosts === 'liked' && (
                        <PostItems
                            session={session}
                            posts={likedPosts}
                            handleUpdate={() =>
                                fecthPosts('liked', profileData.id)
                            }
                        />
                    )}
                    {selectedPosts === 'bookmarked' && (
                        <PostItems
                            session={session}
                            posts={bookmarkedPosts}
                            handleUpdate={() =>
                                fecthPosts('bookmarked', profileData.id)
                            }
                        />
                    )}
                </div>
            ) : (
                ''
            )}

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
