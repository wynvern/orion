'use client';

import DeletePost from '@/components/Form/deletePost';
import CreatePost from '@/components/Form/newPost';
import Header from '@/components/Header/Header';
import PostItems from '@/components/Post/PostItems';
import { PlusIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { Button } from '@nextui-org/react';
import { Session } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { getSession } from 'next-auth/react';
import React, { useRef } from 'react';
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
    const [posts, setPosts] = useState([]);
    const scrollDivRef = useRef(null);

    const fetchPosts = async () => {
        try {
            const response = await fetch('/api/post', {
                method: 'GET',
            });
            if (response.ok) {
                const data = await response.json();

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

    return (
        <main className="flex h-full flex-col items-center justify-between">
            <div className="lg:hidden md:hidden sm:block">
                <Header reference={scrollDivRef} />
            </div>

            <div className="fixed lg:bottom-12 md:bottom-12 sm:bottom-20 lg:right-16 md:right-16 sm:right-6 sm:pb-10 md:pb-0 lg:pb-0 z-50">
                <Button
                    isIconOnly={true}
                    onClick={() => {
                        setNewPostPopup(true);
                    }}
                    color="primary"
                    size="lg"
                    className="h-14 w-14 rounded-3xl"
                    style={{ padding: '8px' }}
                >
                    <PlusIcon />
                </Button>
            </div>

            <div
                className="w-full h-full lg:px-40 md:px-40 sm:px-2 n-scroll"
                ref={scrollDivRef}
            >
                <div className="sm:h-10 md:h-0 lg:h-0"></div>
                {Object.keys(posts).map((dateKey) => (
                    <div key={dateKey}>
                        {(posts as any)[dateKey].length > 0 ? (
                            <h2 className={`flex justify-center mb-10 mt-20`}>
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
                        <PostItems
                            posts={(posts as any)[dateKey]}
                            session={session}
                            handleUpdate={fetchPosts}
                        />
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
