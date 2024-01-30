'use client';

import CreatePost from '@/components/Form/newPost';
import { Post } from '@/types/post';
import {
    ArrowDownIcon,
    ArrowUpIcon,
    BookmarkIcon,
    HandThumbDownIcon,
    HandThumbUpIcon,
    PlusIcon,
} from '@heroicons/react/24/solid';
import { Button, Image, Link } from '@nextui-org/react';
import { useEffect, useState } from 'react';

const Home = () => {
    const [newPostPopup, setNewPostPopup] = useState(false);
    const [posts, setPosts] = useState([]);

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
        fetchPosts();
    }, []);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between pt-14 ">
            <div className="absolute bottom-10 right-10">
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
                className="w-full"
                style={{ paddingLeft: '150px', paddingRight: '150px' }}
            >
                {posts.map((post: Post) => (
                    <div
                        key={post.id}
                        className="border-d mb-10 p-6 flex flex-col"
                    >
                        <div className="flex">
                            <div className="h-20">
                                <Image
                                    src={`/api/image/avatar/${post.user.id}`} // Assuming there is a username property in the User model
                                    alt="user profile"
                                    removeWrapper={true}
                                    style={{ height: '100%', width: 'auto' }}
                                />
                            </div>
                            <div className="ml-6">
                                <h2>
                                    <b>
                                        <Link
                                            href={`/user/${post.user.username}`}
                                            color="secondary"
                                        >
                                            {post.user.username}
                                        </Link>
                                    </b>
                                </h2>
                                <p>{post.content}</p>
                            </div>
                        </div>
                        <div className="flex flex-row justify-around mt-6">
                            <Button
                                isIconOnly={true}
                                variant="ghost"
                                color="secondary"
                                style={{ padding: '8px', border: 'none' }}
                            >
                                <ArrowUpIcon />
                            </Button>
                            <Button
                                isIconOnly={true}
                                variant="ghost"
                                color="secondary"
                                style={{ padding: '8px', border: 'none' }}
                            >
                                <ArrowDownIcon />
                            </Button>
                            <Button
                                isIconOnly={true}
                                variant="ghost"
                                color="secondary"
                                style={{ padding: '8px', border: 'none' }}
                            >
                                <BookmarkIcon />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <CreatePost
                isActive={newPostPopup}
                setIsActive={setNewPostPopup}
                handleCreatePost={function (): void {
                    throw new Error('Function not implemented.');
                }}
            ></CreatePost>
        </main>
    );
};

export default Home;
