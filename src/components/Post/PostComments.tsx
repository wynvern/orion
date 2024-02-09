import formatTimestamp from '@/utils/formatTimesTamp';
import { Session } from 'next-auth';
import Link from 'next/link';
import React from 'react';
import { Image } from '@nextui-org/react';
import { CubeTransparentIcon } from '@heroicons/react/24/solid';

interface PostCommentsProps {
    comments: Comment[];
    session: Session | null | undefined;
}

const PostComments: React.FC<PostCommentsProps> = ({ comments, session }) => {
    if (comments.length <= 0) {
        return (
            <div className="w-full h-full my-10">
                <div className="flex items-center justify-center gap-x-4 text-neutral-600">
                    <CubeTransparentIcon className="h-10" />
                    <b>Nenhum comentário</b>
                </div>
            </div>
        );
    }

    return (
        <div className="flex gap-y-6 flex-col">
            {comments.map((comment: any) => (
                <React.Fragment key={comment.id}>
                    <div className="flex w-full">
                        <Link
                            href={`/user/${comment.user.username}`}
                            className="flex items-start"
                        >
                            <div className="lg:h-12 lg:w-12 md:h-12 md:w-12 sm:h-12 sm:w-12">
                                <Image
                                    src={`/api/image/avatar/${comment.user.id}`}
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
                                        href={`/user/${comment.user.username}`}
                                        color="secondary"
                                    >
                                        {comment.user.username}
                                    </Link>
                                </b>
                                <p>•</p>
                                <p className="text-sm">
                                    {formatTimestamp(comment.createdAt)}
                                </p>
                            </div>
                            <p className="break-all">{comment.content}</p>
                        </div>
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
};

export default PostComments;
