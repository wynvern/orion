'use client';

import SearchHeader from '@/components/Header/SearchHeader';
import PostItems from '@/components/Post/PostItems';
import UserList from '@/components/User/UserList';
import {
    CubeTransparentIcon,
    MagnifyingGlassIcon,
} from '@heroicons/react/24/solid';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const Search = () => {
    const [data, setData] = useState([]);
    const [session, setSession] = useState<Session | null | undefined>();
    const [scrollY, setScrollY] = useState(0);
    const [searched, setSearched] = useState(false);
    const [type, setType] = useState('user');

    useEffect(() => {
        const fetchSession = async () => {
            const fetched = await getSession();
            setSession(fetched);
        };

        fetchSession();
    }, []); // Empty dependency array to run only once on mount

    const fetchPosts = async (content: string) => {
        try {
            const response = await fetch(`/api/search/post?content=${content}`);
            if (response.ok) {
                const data = await response.json();
                setData(data.posts);
                setSearched(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchUsers = async (content: string) => {
        try {
            const response = await fetch(
                `/api/search/user?username=${content}`
            );
            if (response.ok) {
                const data = await response.json();
                setData(data.users);
                setSearched(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchSearch = async (content: string, type: string) => {
        setType(type);

        if (content === '') {
            setSearched(false);
            setData([]);
            return;
        }

        if (type === 'post') {
            await fetchPosts(content);
        } else if (type === 'user') {
            await fetchUsers(content);
        }
    };

    const handleScroll = (e: any) => {
        setScrollY(e.target.scrollTop);
    };

    return (
        <main
            className="flex h-full flex-col items-center pt-10 lg:px-60 md:px-40 sm:px-2 n-scroll"
            onScroll={handleScroll}
        >
            <div className="w-full">
                <SearchHeader onSubmit={fetchSearch} scrollY={scrollY} />
                <div className="mt-20"></div>
                {searched && data.length === 0 ? (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-full max-w-sm p-6">
                            <div className="flex items-center justify-center mb-4">
                                <CubeTransparentIcon className="h-20" />
                            </div>
                            <b className="text-center block">
                                Nenhum {type === 'post' ? 'Post' : 'Usuário'}{' '}
                                encontrado em sua pesquisa.
                            </b>
                        </div>
                    </div>
                ) : type === 'post' ? (
                    data.length > 0 && (
                        <PostItems
                            key="post-items"
                            posts={data as any}
                            session={session}
                            handleUpdate={fetchSearch}
                        />
                    )
                ) : (
                    <UserList
                        key="user-list"
                        users={data as any}
                        session={session}
                    />
                )}
                {!searched ? (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-full max-w-sm p-6">
                            <div className="flex items-center justify-center mb-4">
                                <MagnifyingGlassIcon className="h-20" />
                            </div>
                            <b className="text-center block">
                                Pesquise por usuários e posts aqui.
                            </b>
                        </div>
                    </div>
                ) : (
                    ''
                )}
            </div>
        </main>
    );
};

export default Search;
