'use client';

import CreatePost from '@/components/Form/newPost';
import Header from '@/components/Header/Header';
import { Post } from '@/types/post';
import formatTimestamp from '@/utils/formatTimesTamp';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import {
    ArrowDownIcon,
    ArrowUpIcon,
    EllipsisHorizontalIcon,
    PencilIcon,
    PlusIcon,
    ShareIcon,
    SparklesIcon,
    TrashIcon,
} from '@heroicons/react/24/solid';
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Image,
    Link,
} from '@nextui-org/react';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import React from 'react';
import { useEffect, useState } from 'react';

const keyMapping: Record<string, string> = {
    anosAtras: 'Anos atrás',
    diasAtras: 'Dias atrás',
    hoje: 'Hoje',
    mesesAtras: 'Meses atrás',
    ontem: 'Ontem',
    semanasAtras: 'Semana passada',
};

const Home = () => {
    const [newPostPopup, setNewPostPopup] = useState(false);
    const [session, setSession] = useState<Session | null>();
    const [posts, setPosts] = useState<Post[]>([]);
    const [scrollY, setScrollY] = useState(0);

    const fetchPosts = async () => {
        try {
            const response = await fetch('/api/post', {
                method: 'GET',
            });
            if (response.ok) {
                const data = await response.json();

                console.log(data);
                setPosts(data.posts);
            }
        } catch (e: any) {
            console.error('Error:', e.message);
        }
    };

    useEffect(() => {
        const executeLoad = async () => {
            const fetchSession = await getSession();

            setSession(fetchSession);
            fetchPosts();
        };

        executeLoad();
    }, []);

    const handleScroll = (e) => {
        setScrollY(e.target.scrollTop);
    };

    const postsMapped = (dateKey: any) => {
        return posts[dateKey].map((post: Post) => (
            <React.Fragment key={post.id}>
                <>
                    <div
                        key={post.id}
                        className="border-d mb-10 sm:mb-6 lg:p-6 md:p-6 sm:p-4 sm:pt-6 flex flex-col w-full"
                    >
                        <div className="flex w-full">
                            <div className="h-20 w-20">
                                <Image
                                    src={`/api/image/avatar/${post.user.id}`}
                                    alt="user profile"
                                    className="border-d z-0"
                                    removeWrapper={true}
                                    style={{
                                        height: '100%',
                                        width: '100%',
                                    }}
                                />
                            </div>
                            <div className="pl-6 grow w-1">
                                <div className="flex items-center gap-x-2 mb-2">
                                    <b>
                                        <Link
                                            href={`/user/${post.user.username}`}
                                            color="secondary"
                                        >
                                            {post.user.username}
                                        </Link>
                                    </b>
                                    <p>•</p>
                                    <p className="text-sm">
                                        {formatTimestamp(post.createdAt)}
                                    </p>
                                </div>
                                <p>{post.content}</p>
                            </div>
                        </div>
                        <div className="flex flex-row justify-around mt-6">
                            <Button
                                isIconOnly={true}
                                variant="ghost"
                                color="secondary"
                                style={{
                                    padding: '8px',
                                    border: 'none',
                                }}
                            >
                                <ArrowUpIcon />
                            </Button>
                            <Button
                                isIconOnly={true}
                                variant="ghost"
                                color="secondary"
                                style={{
                                    padding: '8px',
                                    border: 'none',
                                }}
                            >
                                <ArrowDownIcon />
                            </Button>
                            <Button
                                isIconOnly={true}
                                variant="ghost"
                                color="secondary"
                                style={{
                                    padding: '8px',
                                    border: 'none',
                                }}
                            >
                                <BookmarkIcon />
                            </Button>
                            <Dropdown
                                classNames={{
                                    content: 'background-bg border-d',
                                }}
                            >
                                <DropdownTrigger>
                                    <Button
                                        variant="bordered"
                                        color="secondary"
                                        style={{
                                            padding: '8px',
                                            border: 'none',
                                        }}
                                        isIconOnly={true}
                                    >
                                        <EllipsisHorizontalIcon />
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    variant="faded"
                                    aria-label="Dropdown menu with description"
                                >
                                    {session?.user.id === post.user.id ? (
                                        <DropdownItem
                                            key="edit"
                                            description="Edite este post"
                                            className="border-radius-sys"
                                            startContent={
                                                <PencilIcon
                                                    scale={0.1}
                                                    className="w-14"
                                                    style={{
                                                        padding: '10px',
                                                    }}
                                                />
                                            }
                                        >
                                            Editar
                                        </DropdownItem>
                                    ) : (
                                        <DropdownItem className="hidden">
                                            asd
                                        </DropdownItem>
                                    )}
                                    <DropdownItem
                                        key="share"
                                        description="Compartilhar post"
                                        className="border-radius-sys"
                                        startContent={
                                            <ShareIcon
                                                scale={0.1}
                                                className="w-14"
                                                style={{
                                                    padding: '10px',
                                                }}
                                            />
                                        }
                                    >
                                        Compartilhar
                                    </DropdownItem>
                                    {session?.user.id === post.user.id ? (
                                        <DropdownItem
                                            key="delete"
                                            description="Delete este post"
                                            className="border-radius-sys text-danger"
                                            startContent={
                                                <TrashIcon
                                                    scale={0.1}
                                                    className="w-14"
                                                    style={{
                                                        padding: '10px',
                                                    }}
                                                />
                                            }
                                        >
                                            Deletar
                                        </DropdownItem>
                                    ) : (
                                        <DropdownItem className="hidden">
                                            asd
                                        </DropdownItem>
                                    )}
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>
                </>
            </React.Fragment>
        ));
    };

    return (
        <main className="flex h-full flex-col items-center justify-between">
            <div className="lg:hidden md:hidden sm:block">
                <Header scrollY={scrollY} />
            </div>

            <div className="fixed bottom-12 right-6 lg:bottom-12 md:bottom-12 sm:bottom-20 sm:pb-6 md:pb-0 lg:pb-0">
                <Button
                    isIconOnly={true}
                    onClick={() => {
                        setNewPostPopup(true);
                    }}
                    color="primary"
                    size="lg"
                    style={{ padding: '8px' }}
                >
                    <PlusIcon />
                </Button>
            </div>

            <div
                className="w-full h-full lg:px-60 md:px-20 sm:px-2 n-scroll"
                onScroll={(e) => handleScroll(e)}
            >
                <div className="h-20"></div>
                {Object.keys(posts).map((dateKey) => (
                    <div key={dateKey}>
                        {posts[dateKey].length > 0 ? (
                            <h2
                                className={`flex justify-center mb-10 mt-20`}
                                style={{ color: '#333' }}
                            >
                                <b>{keyMapping[dateKey]}</b>
                            </h2>
                        ) : (
                            <div>
                                {dateKey === 'hoje' ? (
                                    <div className="w-full h-40 flex items-center justify-center flex-col p-6 mt-20">
                                        <SparklesIcon className="h-20 mb-4" />
                                        <b>Nenhum post novo para hoje</b>
                                    </div>
                                ) : (
                                    ''
                                )}
                            </div>
                        )}
                        {postsMapped(dateKey)}
                    </div>
                ))}
                <div className="h-20"></div>
            </div>

            <CreatePost
                isActive={newPostPopup}
                setIsActive={setNewPostPopup}
                handleCreatePost={() => {
                    fetchPosts();
                }}
            ></CreatePost>
        </main>
    );
};

export default Home;
