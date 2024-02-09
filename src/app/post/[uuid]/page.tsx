'use client';

import { useEffect, useRef, useState } from 'react';
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Image,
    Input,
    Link,
    ScrollShadow,
} from '@nextui-org/react';
import formatTimestamp from '@/utils/formatTimesTamp';
import { Post } from '@/types/post';
import BookmarkPost from '@/components/Post/BookmarkPost';
import LikePost from '@/components/Post/LikePost';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    EllipsisHorizontalIcon,
    PaperAirplaneIcon,
    PencilIcon,
    ShareIcon,
    TrashIcon,
} from '@heroicons/react/24/solid';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DeletePost from '@/components/Form/deletePost';
import { ChatBubbleBottomCenterIcon } from '@heroicons/react/24/outline';
import PostComments from '@/components/Post/PostComments';
import { Slide, toast } from 'react-toastify';
import ImageIndicator from '@/components/Post/ImageIndicator';

const Post = ({ params }: { params: { uuid: string } }) => {
    const [post, setPost] = useState<Post | undefined>();
    const [session, setSession] = useState<Session | null | undefined>();
    const [deletePostVisible, setDeletePostVisible] = useState(false);
    const [deletePostUuid, setDeletePostUuid] = useState('');
    const router = useRouter();
    const [commentContent, setCommentContent] = useState('');

    const fetchPost = async () => {
        try {
            const response = await fetch(`/api/post/${params.uuid}`);

            if (response.ok) {
                const data = await response.json();
                setPost(data.post);
                console.log(data.post);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        const fetchSession = async () => {
            const data = await getSession();
            setSession(data);
        };

        fetchPost();
        fetchSession();
    }, []);

    const createComment = async () => {
        try {
            const response = await fetch(`/api/post/${post?.id}/comment`, {
                method: 'POST',
                body: JSON.stringify({
                    text: commentContent,
                }),
            });
            if (response.ok) {
                setCommentContent('');
                fetchPost();
            }
        } catch (e: any) {
            console.error('Error:', e.message);
        }
    };

    const eventHandle = (e: {
        currentTarget: { getBoundingClientRect: () => any };
        clientX: number;
        clientY: number;
    }) => {
        if (!imageClicked) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = rect.left + rect.width / 2 - e.clientX;
            const y = rect.top + rect.height / 2 - e.clientY;
            setImageMoveCord({ x, y, scale: 2 });
            setImageClicked(true);
        } else {
            mouseLeaveImage();
        }
    };

    const mouseLeaveImage = () => {
        setImageClicked(false);
        setImageMoveCord({ x: 0, y: 0, scale: 1 });
    };

    const [imageMoveCord, setImageMoveCord] = useState({
        x: 0,
        y: 0,
        scale: 1,
    });
    const [imageClicked, setImageClicked] = useState(false);

    const [currentImageIndex, setCurrentImageIndex] = useState(1);

    const nextImage = () => {
        if (post && post.images > 1) {
            setCurrentImageIndex(
                (prevIndex: number) => (prevIndex % post.images) + 1
            );
        }
    };

    const previousImage = () => {
        if (post && post.images > 1) {
            setCurrentImageIndex((prevIndex: number) =>
                prevIndex === 1 ? post.images : prevIndex - 1
            );
        }
    };

    return (
        <main className="flex flex-col h-screen w-full overflow-hidden">
            <div className="w-full h-full flex flex-row">
                <div className="w-2/3 h-full flex justify-center items-center relative">
                    {post ? (
                        <div
                            className={`absolute left-10 ${
                                post?.images <= 1 ? 'hidden' : 'visible'
                            }`}
                        >
                            <Button
                                isIconOnly={true}
                                onClick={previousImage}
                                color="secondary"
                                variant="bordered"
                                className="border-none"
                            >
                                <ChevronLeftIcon className="h-2/3" />
                            </Button>
                        </div>
                    ) : (
                        ''
                    )}
                    <div
                        className={`fixed w-screen h-screen bg-black left-0 bottom-0 transition-all duration-300 ${
                            imageMoveCord.scale > 1 ? 'visible' : 'hidden'
                        }`}
                        style={{ zIndex: '110', opacity: '50%' }}
                    ></div>
                    <div className="w-2/3 flex items-center justify-center">
                        <Image
                            src={`/api/image/post/${params.uuid}/${currentImageIndex}`}
                            className={`w-full rounded-none`}
                            onMouseDownCapture={eventHandle}
                            onMouseLeave={mouseLeaveImage}
                            style={{
                                transform: `translate(${imageMoveCord.x}px, ${imageMoveCord.y}px) scale(${imageMoveCord.scale})`,
                                maxHeight: '60vh',
                                zIndex: '120',
                            }}
                        ></Image>
                    </div>
                    {post ? (
                        <div
                            className={`absolute right-10 ${
                                post?.images <= 1 ? 'hidden' : 'visible'
                            }`}
                        >
                            <Button
                                isIconOnly={true}
                                onClick={nextImage}
                                color="secondary"
                                variant="bordered"
                                className="border-none"
                            >
                                <ChevronRightIcon className="h-2/3" />
                            </Button>
                        </div>
                    ) : (
                        ''
                    )}
                    <div className="absolute bottom-20">
                        {post ? (
                            <ImageIndicator
                                images={post.images}
                                currentImageIndex={currentImageIndex}
                                handleIndexChange={(index: number) => {
                                    setCurrentImageIndex(index);
                                }}
                            />
                        ) : (
                            ''
                        )}
                    </div>
                </div>
                <div className="w-1/2 h-full border-ll flex justify-between flex-col p-6">
                    <div className="mt-10 grow flex flex-col">
                        <div>
                            {post !== undefined ? (
                                <div className="flex w-full">
                                    <Link
                                        href={`/user/${post.user.username}`}
                                        className="flex items-start"
                                    >
                                        <div className="lg:h-16 lg:w-16 md:h-16 md:w-16 sm:h-12 sm:w-12">
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
                                                {formatTimestamp(
                                                    post.createdAt
                                                )}
                                            </p>
                                        </div>
                                        <p className="break-all">
                                            {post.content}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                ''
                            )}
                            <div className="my-8">
                                {post !== undefined ? (
                                    <div className="flex flex-row justify-between">
                                        <LikePost post={post} />
                                        <BookmarkPost post={post} />
                                        <Dropdown
                                            classNames={{
                                                content:
                                                    'background-bg border-d',
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
                                                {session?.user.id ===
                                                post.user.id ? (
                                                    <DropdownItem
                                                        key="edit"
                                                        description="Edite este post"
                                                        className="border-radius-sys"
                                                        startContent={
                                                            <PencilIcon
                                                                scale={0.1}
                                                                className="w-14"
                                                                style={{
                                                                    padding:
                                                                        '10px',
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
                                                    onClick={() => {
                                                        const copyContent =
                                                            async () => {
                                                                try {
                                                                    await navigator.clipboard.writeText(
                                                                        `http://localhost:3000/post/${post.id}`
                                                                    );
                                                                    toast(
                                                                        'Copiado para área de transferência.',
                                                                        {
                                                                            position:
                                                                                'bottom-right',
                                                                            autoClose: 3000,
                                                                            hideProgressBar:
                                                                                false,
                                                                            closeOnClick:
                                                                                true,
                                                                            pauseOnHover:
                                                                                true,
                                                                            draggable:
                                                                                true,
                                                                            progress:
                                                                                undefined,
                                                                            theme: 'dark',
                                                                            icon: (
                                                                                <ShareIcon />
                                                                            ),
                                                                            transition:
                                                                                Slide,
                                                                        }
                                                                    );
                                                                } catch (err) {
                                                                    console.error(
                                                                        'Failed to copy: ',
                                                                        err
                                                                    );
                                                                }
                                                            };

                                                        copyContent();
                                                    }}
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
                                                {session?.user.id ===
                                                post.user.id ? (
                                                    <DropdownItem
                                                        key="delete"
                                                        onClick={() => {
                                                            setDeletePostUuid(
                                                                post.id
                                                            );
                                                            setDeletePostVisible(
                                                                true
                                                            );
                                                        }}
                                                        description="Delete este post"
                                                        className="border-radius-sys text-danger"
                                                        startContent={
                                                            <TrashIcon
                                                                scale={0.1}
                                                                className="w-14"
                                                                style={{
                                                                    padding:
                                                                        '10px',
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
                                ) : (
                                    ''
                                )}
                            </div>
                            <div className="mb-6">
                                <b>
                                    <p>Comentários</p>
                                </b>
                            </div>
                        </div>
                        <div className="flex justify-between flex-col grow">
                            <div className="flex grow overflow-auto">
                                <ScrollShadow className="w-full">
                                    <div className="h-20 w-full">
                                        {post?.comments ? (
                                            <PostComments
                                                comments={post.comments}
                                                session={session}
                                            />
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                </ScrollShadow>
                            </div>
                            <div className="flex items-center mt-8">
                                <Input
                                    size="sm"
                                    type="text"
                                    placeholder="Digite algo..."
                                    variant="bordered"
                                    onValueChange={(e) => {
                                        setCommentContent(e);
                                    }}
                                    value={commentContent}
                                    startContent={
                                        <ChatBubbleBottomCenterIcon className="h-2/3 mr-3 ml-4" />
                                    }
                                    classNames={{
                                        inputWrapper:
                                            'border-none rounded-3xl p-0',
                                        input: 'placeholder:text-neutral-600',
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            createComment();
                                        }
                                    }}
                                />
                                <Button
                                    isIconOnly={true}
                                    onClick={createComment}
                                    color="secondary"
                                    variant="bordered"
                                    className="border-none"
                                >
                                    <PaperAirplaneIcon className="h-1/2" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div></div>
                </div>
            </div>

            <DeletePost
                isActive={deletePostVisible}
                setIsActive={setDeletePostVisible}
                uuid={deletePostUuid}
                handleDelete={() => router.back()}
            />
        </main>
    );
};

export default Post;
