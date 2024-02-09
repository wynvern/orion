import { Post } from '@/types/post';
import formatTimestamp from '@/utils/formatTimesTamp';
import {
    BookmarkIcon,
    ChatBubbleBottomCenterIcon,
    ChatBubbleOvalLeftIcon,
} from '@heroicons/react/24/outline';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
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
    ScrollShadow,
} from '@nextui-org/react';
import { Session } from 'next-auth';
import React, { useState } from 'react';
import DeletePost from '../Form/deletePost';
import LikePost from './LikePost';
import BookmarkPost from './BookmarkPost';
import ImageIndicator from './ImageIndicator';
import { useRouter } from 'next/navigation';
import PostComments from './PostComments';

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
    const [imageIndices, setImageIndices] = useState<number[]>(
        new Array(posts.length).fill(1)
    );

    const router = useRouter();

    const handleImageIndexChange = (index: number, postIndex: number) => {
        const newIndices = [...imageIndices];
        newIndices[postIndex] = index;
        setImageIndices(newIndices);
    };

    return posts.map((post: Post, index: number) => (
        <React.Fragment key={post.id}>
            <div
                key={post.id}
                className="border-d flex sm:flex-col md:flex-col lg:flex-row w-full mb-10 sm:mb-6 md:mb-10 lg:mb-20 overflow-hidden"
            >
                <div
                    className="post-image-top sm:post-image-top md:post-image-top lg:post-image-left sm:w-full md:w-full lg:w-1/2 relative flex justify-center items-center"
                    style={{
                        objectFit: 'cover',
                        aspectRatio: '1 / 1',
                    }}
                >
                    <div
                        className={`absolute left-8 z-50 ${
                            post?.images <= 1 ? 'hidden' : 'visible'
                        }`}
                    >
                        <Button
                            isIconOnly={true}
                            onClick={() => {
                                handleImageIndexChange(
                                    imageIndices[index] - 1,
                                    index
                                );
                            }}
                            color="secondary"
                            variant="bordered"
                            className="border-none"
                        >
                            <ChevronLeftIcon className="h-2/3" />
                        </Button>
                    </div>
                    <div
                        className="h-full w-full relative rounded-none"
                        onDoubleClick={() => router.push(`/post/${post.id}`)}
                    >
                        <Image
                            src={`/api/image/post/${post.id}/${imageIndices[index]}`}
                            alt="Post Image"
                            removeWrapper={true}
                            className="h-full w-full relative rounded-none"
                            style={{
                                objectFit: 'cover',
                                aspectRatio: '1 / 1',
                            }}
                        />
                    </div>
                    <div
                        className={`absolute right-8 z-50 ${
                            post?.images <= 1 ? 'hidden' : 'visible'
                        }`}
                    >
                        <Button
                            isIconOnly={true}
                            onClick={() => {
                                handleImageIndexChange(
                                    imageIndices[index] + 1,
                                    index
                                );
                            }}
                            color="secondary"
                            variant="bordered"
                            className="border-none"
                        >
                            <ChevronRightIcon className="h-2/3" />
                        </Button>
                    </div>
                    <div className="absolute bottom-10 z-50">
                        <ImageIndicator
                            images={post.images}
                            currentImageIndex={imageIndices[index]}
                            handleIndexChange={(newIndex: number) =>
                                handleImageIndexChange(newIndex, index)
                            }
                        />
                    </div>
                </div>
                <div className="lg:p-6 md:p-6 sm:p-4 sm:pt-6 sm:w-full md:w-full lg:w-1/2 flex sm:block md:block lg:flex justify-between flex-col">
                    <div className="flex w-full">
                        <Link
                            href={`/user/${post.user.username}`}
                            className="flex items-start"
                        >
                            <div className="lg:h-16 lg:w-16 md:h-20 md:w-20 sm:h-12 sm:w-12">
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
                            <Link href={`/post/${post.id}`} color="secondary">
                                <p className="break-all">{post.content}</p>
                            </Link>
                        </div>
                    </div>
                    <div className="flex grow overflow-auto flex-col items-center mb-6 lg:visible md:visible sm:hidden">
                        <div className="my-6 w-full">
                            <b>
                                <p>Comentários</p>
                            </b>
                        </div>
                        <ScrollShadow className="w-full grow">
                            <div className="h-20 w-full">
                                {post?.comments ? (
                                    <PostComments
                                        comments={post.comments.slice(0, 4)}
                                        session={session}
                                    />
                                ) : (
                                    ''
                                )}
                            </div>
                        </ScrollShadow>
                        <div>
                            <Link href={`/post/${post.id}`} color="secondary">
                                <b>Veja mais</b>
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-row justify-around mt-6">
                        <LikePost post={post} />
                        <Button
                            isIconOnly={true}
                            onClick={() => router.push(`/post/${post.id}`)}
                            variant="bordered"
                            color="secondary"
                            style={{
                                padding: '8px',
                                border: 'none',
                            }}
                        >
                            <ChatBubbleBottomCenterIcon />
                        </Button>
                        <BookmarkPost post={post} />
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
