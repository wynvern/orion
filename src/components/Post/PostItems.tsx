import { Post } from '@/types/post';
import formatTimestamp from '@/utils/formatTimesTamp';
import {
    BookmarkIcon,
    ChatBubbleOvalLeftIcon,
} from '@heroicons/react/24/outline';
import {
    EllipsisHorizontalIcon,
    PencilIcon,
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
import React, { useState } from 'react';
import DeletePost from '../Form/deletePost';
import LikePost from './LikePost';

interface PostItemsProps {
    posts: Post[];
    session: Session | null | undefined;
    handleUpdate: () => void;
}

const PostItems: React.FC<PostItemsProps> = ({
    posts,
    session,
    handleUpdate,
}) => {
    const [deletePostVisible, setDeletePostVisible] = useState(false);
    const [deletePostUuid, setDeletePostUuid] = useState('');

    return posts.map((post: Post) => (
        <React.Fragment key={post.id}>
            <div
                key={post.id}
                className="border-d flex sm:flex-col md:flex-col lg:flex-row w-full mb-10 sm:mb-6 md:mb-10 lg:mb-20"
            >
                {[...Array(post.images)].map((_, i) => (
                    <Image
                        src={`/api/image/post/${post.id}/${i + 1}`}
                        alt="Post Image"
                        key={i}
                        removeWrapper={true}
                        className="post-image-top sm:post-image-top md:post-image-top lg:post-image-left h-full sm:w-full md:w-full lg:w-1/2 relative"
                        style={{
                            objectFit: 'cover',
                            aspectRatio: '1 / 1',
                        }}
                    />
                ))}

                <div className="lg:p-6 md:p-6 sm:p-4 sm:pt-6 sm:w-full md:w-full lg:w-1/2 flex sm:block md:block lg:flex justify-between flex-col">
                    <div className="flex w-full">
                        <Link href={`/user/${post.user.username}`}>
                            <div className="lg:h-16 lg:w-16 md:h-20 md:w-20 sm:h-10 sm:w-10">
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
                        </Link>
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
                            <p className="break-all">{post.content}</p>
                        </div>
                    </div>
                    <div className="flex flex-row justify-around mt-6">
                        <LikePost post={post} />
                        <Button
                            isIconOnly={true}
                            variant="bordered"
                            color="secondary"
                            style={{
                                padding: '8px',
                                border: 'none',
                            }}
                        >
                            <ChatBubbleOvalLeftIcon />
                        </Button>
                        <Button
                            isIconOnly={true}
                            variant="bordered"
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
                                        onClick={() => {
                                            setDeletePostUuid(post.id);
                                            setDeletePostVisible(true);
                                        }}
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
                                        Excluír
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
            </div>
            <DeletePost
                isActive={deletePostVisible}
                setIsActive={setDeletePostVisible}
                uuid={deletePostUuid}
                handleDelete={handleUpdate}
            />
        </React.Fragment>
    ));
};

export default PostItems;
