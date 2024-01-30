'use client';

import CreatePost from '@/components/Form/newPost';
import { Post } from '@/types/post';
import formatTimestamp from '@/utils/formatTimesTamp';
import timeDifference from '@/utils/timeDifference';
import {
    ArrowDownIcon,
    ArrowUpIcon,
    BookmarkIcon,
    EllipsisHorizontalIcon,
    PencilIcon,
    PlusIcon,
    ShareIcon,
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
    const [posts, setPosts] = useState({});

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

    const postsMapped = (dateKey: any) => {
        return posts[dateKey].map((post: Post) => (
            <React.Fragment key={post.id}>
                <>
                    <div
                        key={post.id}
                        className="border-d mb-10 p-6 flex flex-col w-full"
                    >
                        <div className="flex w-full">
                            <div className="h-20 w-20">
                                <Image
                                    src={`/api/image/avatar/${post.user.id}`}
                                    alt="user profile"
                                    className="border-d"
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
                                    <p>{formatTimestamp(post.createdAt)}</p>
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
                                                        padding: '8px',
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
                                                    padding: '8px',
                                                }}
                                            />
                                        }
                                    >
                                        Compartilhar
                                    </DropdownItem>
                                    <DropdownItem
                                        key="delete"
                                        className="border-radius-sys text-danger"
                                        description="Deletar post permanentemente"
                                        startContent={
                                            <TrashIcon
                                                scale={0.1}
                                                className="w-14"
                                                style={{
                                                    padding: '8px',
                                                }}
                                            />
                                        }
                                    >
                                        Excluír
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>
                </>
            </React.Fragment>
        ));
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between pt-14 ">
            <div className="fixed bottom-10 right-12">
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

            <div className="w-full px-60">
                {Object.keys(posts).map((dateKey) => (
                    <div key={dateKey}>
                        {posts[dateKey].length > 0 && (
                            <h2
                                className={`flex justify-center mb-10 ${
                                    dateKey !== 'hoje' ? 'mt-60' : ''
                                }`}
                                style={{ color: '#333' }}
                            >
                                <b>{keyMapping[dateKey]}</b>
                            </h2>
                        )}
                        {postsMapped(dateKey)}
                    </div>
                ))}
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
